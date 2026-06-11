import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Truck, Clock, ArrowRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { getAuth } from "@/lib/auth";
import { safeSet, safeGet } from "@/lib/safeStorage";
import { getUserAddress, saveUserAddress } from "@/api/address";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutForm from "@/components/checkout/CheckoutForm";

const CHECKOUT_FORM_KEY = "rb_checkout_form";

/** Read a persisted checkout draft from sessionStorage, or null. */
const loadCheckoutDraft = () => {
  try {
    return JSON.parse(safeGet(CHECKOUT_FORM_KEY, sessionStorage)) || null;
  } catch {
    return null;
  }
};

const DEFAULT_FORM = {
  fullName: "",
  phone: "",
  email: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  startDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // Default to +2 days
  timeSlot: null,
  instructions: "",
  paymentMethod: "upi",
};

const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedPhone = location.state?.verifiedPhone || sessionStorage.getItem("rb_verified_phone") || getAuth()?.phone || "";

  // Persist verifiedPhone so navigating back to checkout doesn't lose it.
  useEffect(() => {
    if (location.state?.verifiedPhone) {
      safeSet("rb_verified_phone", location.state.verifiedPhone, sessionStorage);
    }
  }, []);

  // Pre-fill address fields from the user's saved address if the form doesn't
  // already have address data (i.e. no draft). Fire-and-forget — a failure here
  // just means the user fills in the fields manually.
  const addressPrefilled = useRef(false);
  useEffect(() => {
    if (!verifiedPhone || addressPrefilled.current) return;
    addressPrefilled.current = true;
    getUserAddress(verifiedPhone).then((addr) => {
      if (!addr) return;
      setFormData((prev) => {
        if (prev.addressLine1) return prev; // draft already has address — don't overwrite
        return {
          ...prev,
          fullName: prev.fullName || addr.contact_name || "",
          addressLine1: addr.address_line_1 || "",
          addressLine2: addr.address_line_2 || "",
          landmark: addr.landmark || "",
          pincode: addr.pincode || "",
          city: addr.city || "",
          state: addr.state || "",
        };
      });
    }).catch(() => {});
  }, [verifiedPhone]);

  // Enforce flow order: cart must have items, and mobile must be verified first.
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
      toast.error("Your cart is empty", {
        description: "Add some items before checking out.",
      });
    } else if (!sessionStorage.getItem("rb_cart_proceed")) {
      navigate("/cart");
    } else if (!verifiedPhone) {
      navigate("/customer-validation", { state: { returnTo: "/checkout" } });
    }
  }, [cartItems, navigate, verifiedPhone]);

  // Prefill order: defaults < persisted draft < API address < explicit state from "Edit Details"
  // < explicit state from "Edit Details" on the order summary.
  const [formData, setFormData] = useState(() => {
    const draft = loadCheckoutDraft() || {};
    return {
      ...DEFAULT_FORM,
      ...draft,
      ...(location.state?.formData || {}),
      phone: verifiedPhone || location.state?.formData?.phone || draft.phone || "",
    };
  });

  // Persist the draft so navigating to the address book and back never loses
  // the name / email / date / instructions the user already typed.
  useEffect(() => {
    safeSet(CHECKOUT_FORM_KEY, JSON.stringify(formData), sessionStorage);
  }, [formData]);

  const handleReviewSummary = () => {
    if (!formData.fullName || !formData.phone || !formData.addressLine1 || !formData.pincode) {
      toast.error("Please fill required fields", {
        description: "Name, Address, and Pincode are mandatory.",
      });
      return;
    }
    const minDate = new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0];
    if (!formData.startDate || formData.startDate < minDate) {
      toast.error("Please pick a later start date", {
        description: "We need at least 2 days to prepare your delivery.",
      });
      return;
    }
    // Silently sync the address back so it pre-fills on the next order.
    if (formData.addressLine1) {
      saveUserAddress(formData.phone || verifiedPhone, {
        address_line_1: formData.addressLine1,
        address_line_2: formData.addressLine2 || "",
        landmark: formData.landmark || "",
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        contact_name: formData.fullName,
        contact_phone: formData.phone || verifiedPhone,
      }).catch(() => {});
    }
    navigate("/order-summary", { state: { verifiedPhone, formData } });
  };

  if (cartItems.length === 0 || !verifiedPhone) return null;

  return (
    <div className="min-h-screen bg-background pb-20">
      <CheckoutHeader />

      <main className="section-container mt-4 md:mt-6">
        {/* Breadcrumb / Back Link */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Review Cart
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
              Checkout
            </h1>
            <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
              Enter your delivery details — you'll review the order summary next.
            </p>
          </div>
        </div>

        <CheckoutProgress currentStep="checkout" />

        <div className="max-w-3xl mx-auto mt-4 md:mt-8">
          {/* Trust Banner */}
          <div className="flex flex-wrap items-center gap-4 bg-primary/5 border border-primary/10 rounded-2xl p-4 mb-8">
            <div className="flex items-center gap-2 text-primary">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-wider">Secured Rental</span>
            </div>
            <div className="h-4 w-px bg-primary/20 hidden md:block" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Free Delivery & Setup</span>
            </div>
            <div className="h-4 w-px bg-primary/20 hidden md:block" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-[11px] font-bold uppercase tracking-wider">24/48 Hr Installation</span>
            </div>
          </div>

          <CheckoutForm formData={formData} setFormData={setFormData} phoneVerified={Boolean(verifiedPhone)} />

          {/* Proceed to Order Summary */}
          <button
            onClick={handleReviewSummary}
            className="gradient-coral w-full py-4 rounded-2xl font-black text-lg shadow-lg shadow-primary/30 transition-all hover:shadow-primary/40 hover:opacity-95 active:scale-[0.98] flex items-center justify-center gap-3 group"
          >
            Order Summary
            <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" />
            </div>
          </button>

          {/* Bottom Note */}
          <p className="text-xs text-muted-foreground text-center py-4 mt-3 bg-secondary/20 rounded-2xl border border-dashed border-border/50 font-medium">
            Need help with your order? <a href="tel:+919958858473" className="text-primary font-bold hover:underline">Chat with us</a> for instant setup support.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
