import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ChevronLeft, MapPin, Calendar, User, Phone, Pencil } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import { cartBreakdown } from "@/lib/pricing";
import { getAuth } from "@/lib/auth";
import { safeRemove } from "@/lib/safeStorage";
import { recordOrder } from "@/lib/recentOrders";
import { getDeliveryFields, slotLabel } from "@/lib/delivery";
import { addItemsToProposal, confirmProposal, fetchProposalCart, applyGlobalCoupon, setDeliverySlot } from "@/api/proposal";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import CheckoutProgress from "@/components/checkout/CheckoutProgress";
import CheckoutSummary from "@/components/checkout/CheckoutSummary";

/** Tear down the per-checkout session state once an order is placed. */
const clearCheckoutSession = () => {
  safeRemove("rb_checkout_form", sessionStorage);
  safeRemove("rb_verified_phone", sessionStorage);
  safeRemove("rb_cart_proceed", sessionStorage);
};

const OrderSummary = () => {
  const { cartItems, itemsForDuration, selectedDuration, setSelectedDuration, clearGroup, coupon, setAvailableCoupon } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const verifiedPhone = location.state?.verifiedPhone || getAuth()?.phone || "";
  const formData = location.state?.formData || null;
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // The duration group being ordered. Each group is confirmed as its own order;
  // on success only this group is cleared and the user returns to the cart for
  // any remaining groups.
  const checkoutDuration =
    location.state?.checkoutDuration ||
    sessionStorage.getItem("rb_checkout_duration") ||
    selectedDuration ||
    "";
  const groupItems = checkoutDuration ? itemsForDuration(checkoutDuration) : cartItems;

  // On mount, try to read any coupon the backend has pre-attached to this lead's
  // proposal and auto-apply it so the user sees the discount before confirming.
  useEffect(() => {
    const auth = getAuth();
    if (!auth?.userId || !auth?.leadId) return;
    fetchProposalCart(auth.userId, auth.leadId)
      .then((data) => {
        const c = data?.coupons;
        if (!c?.id) return;
        const type = c.discount_type === 1 ? "percent" : "flat";
        const value = c.discount_type === 1 ? c.discount_in_percent : c.absolute_discount;
        if (!value) return;
        setAvailableCoupon({ id: c.id, code: c.coupon_name, type, value });
      })
      .catch(() => {});
  }, []);

  // Accumulator for resume-on-retry: survives across handlePlaceOrder calls
  // while this page stays mounted.  Keyed by the line's stable cartItemId.
  // Passed into addItemsToProposal so already-POSTed items are skipped on retry.
  const addedItemsRef = useRef(new Map());

  // Guard: the chosen plan must have items, a verified mobile, and submitted details.
  useEffect(() => {
    if (orderPlaced) return;
    if (groupItems.length === 0) {
      navigate("/basket");
    } else if (!verifiedPhone) {
      navigate("/customer-validation");
    } else if (!formData) {
      navigate("/checkout", { state: { verifiedPhone, checkoutDuration } });
    }
  }, [groupItems, navigate, verifiedPhone, formData, orderPlaced, checkoutDuration]);

  const buildOrderPayload = (b, orderId) => ({
    orderId,
    bookingDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    deliveryDate: new Date(formData.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    deliverySlot: formData.timeSlot,
    customerDetails: {
      name: formData.fullName,
      phone: formData.phone,
      email: formData.email,
    },
    deliveryAddress: `${formData.addressLine1}, ${formData.addressLine2}, ${formData.city}, ${formData.state}, ${formData.pincode}`,
    paymentDetails: {
      method: formData.paymentMethod.toUpperCase(),
      transactionId: `TXN${Math.floor(Math.random() * 900000) + 100000}`,
      status: "Successful",
    },
    items: groupItems,
    duration: checkoutDuration,
    totalRent: b.totalRent,
    itemSavings: b.itemSavings,
    coupon: b.coupon,
    baseRent: b.netBaseRent,
    gst: b.gst,
    netMonthlyRent: b.netMonthlyRent,
    security: b.security,
    netFirstMonth: b.netFirstMonth,
    upfront: b.upfront,
    payOnDelivery: b.payOnDelivery,
    grandTotal: b.netFirstMonth, // legacy fallback
  });

  /**
   * Finalise a placed order. Only the just-ordered duration group is cleared.
   * If other duration groups still have items, the user is sent back to the cart
   * to check those out (each is a separate order); otherwise to the success page.
   */
  const finalizeOrder = (orderPayload) => {
    setOrderPlaced(true);
    recordOrder(orderPayload);

    // What's left after this group is removed?
    const remaining = cartItems.filter((i) => i.duration !== checkoutDuration);
    const remainingDurations = [...new Set(remaining.map((i) => i.duration))];

    if (remainingDurations.length > 0) {
      const n = remainingDurations.length;
      toast.success("Order placed successfully!", {
        description: `Your plan is confirmed. You have ${n} more rental ${n === 1 ? "plan" : "plans"} to check out.`,
      });
      // Point the cart at the next group, then return there.
      safeRemove("rb_cart_proceed", sessionStorage);
      sessionStorage.setItem("rb_checkout_duration", remainingDurations[0]);
      setSelectedDuration(remainingDurations[0]);
      navigate("/basket");
      clearGroup(checkoutDuration);
      return;
    }

    toast.success("Order placed successfully!", { description: "Your rental order has been confirmed." });
    // Navigate first, then clear — same tick, so the empty cart never renders.
    navigate("/order-success", { state: { orderData: orderPayload } });
    clearGroup(checkoutDuration);
    clearCheckoutSession();
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    const auth = getAuth();

    // Guard: fall back to mock if userId/leadId haven't propagated yet
    if (!auth?.userId || !auth?.leadId) {
      console.warn("[OrderSummary] userId or leadId missing from auth — using mock order flow");
      setTimeout(() => {
        setIsProcessing(false);
        const b = cartBreakdown(groupItems, coupon);
        const orderPayload = buildOrderPayload(b, `RB-${Math.floor(Math.random() * 90000) + 10000}`);
        finalizeOrder(orderPayload);
      }, 2500);
      return;
    }

    try {
      // Pass the persistent accumulator Map so that any items already POSTed on a
      // previous attempt are skipped (dedupe by productId|duration key).
      // addItemsToProposal mutates the Map in place and returns the full id list.
      const cartItemIds = await addItemsToProposal(
        auth.userId,
        auth.leadId,
        groupItems,
        addedItemsRef.current,
      );

      // Set delivery slot + date on the proposal (non-fatal — don't block confirmation).
      // The endpoint wants a numeric slot id; a legacy draft may hold an old text
      // label ("Morning") — skip the call then, confirmProposal still carries the
      // resolved slot code via getDeliveryFields.
      const delivery = getDeliveryFields(formData);
      const slotId = Number(formData?.timeSlot);
      if (Number.isFinite(slotId) && slotId > 0 && delivery.expected_delivery_date) {
        await setDeliverySlot(auth.leadId, slotId, delivery.expected_delivery_date).catch((err) => {
          console.warn("[OrderSummary] set-delivery-slot failed (non-fatal):", err.message);
        });
      }

      // Apply the backend-attached coupon (if any) before confirming.
      if (coupon?.id) {
        await applyGlobalCoupon(auth.userId, auth.leadId, coupon.id).catch(() => {});
      }

      // Attach expected_delivery_date + expected_delivery_time_slot to the confirmation.
      const apiResponse = await confirmProposal(auth.userId, auth.leadId, cartItemIds, coupon?.id ?? null, delivery);

      const b = cartBreakdown(groupItems, coupon);
      const rawOrderId = apiResponse?.data?.order_id ?? apiResponse?.data?.orderId;
      // Warn when the backend omits order_id — makes contract drift visible in logs.
      if (rawOrderId == null) {
        console.warn(
          "[OrderSummary] confirmProposal response missing order_id / orderId — " +
          "falling back to RB-{leadId}. Check backend contract with Shivam.",
          apiResponse?.data,
        );
      }
      const orderId = rawOrderId ?? `RB-${auth.leadId}`;
      const orderPayload = buildOrderPayload(b, String(orderId));

      // Reset the resume accumulator so the NEXT group's checkout starts clean
      // (these ids belong to the group we just confirmed).
      addedItemsRef.current = new Map();
      finalizeOrder(orderPayload);
    } catch (err) {
      // err.cartItemIds is set by addItemsToProposal when it fails mid-loop;
      // those ids are already in addedItemsRef.current so a retry will skip them.
      toast.error(err.message);
      setIsProcessing(false);
    }
  };

  if (!orderPlaced && (groupItems.length === 0 || !verifiedPhone || !formData)) return null;

  const addressLine = formData
    ? [formData.addressLine1, formData.addressLine2, formData.landmark, formData.city, formData.state, formData.pincode]
        .filter(Boolean)
        .join(", ")
    : "";

  return (
    <div className="min-h-screen bg-background pb-20">
      <CheckoutHeader />

      <main className="section-container mt-4 md:mt-6">
        {/* Back to details */}
        <div className="mb-6 md:mb-8">
          <Link
            to="/checkout"
            state={{ verifiedPhone, formData }}
            className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Edit Details
          </Link>
          <div className="mt-4">
            <h1 className="text-2xl md:text-4xl font-black text-foreground tracking-tight">
              Order Summary
            </h1>
            <p className="text-[11px] md:text-sm text-muted-foreground font-medium mt-1">
              Review your rental, then confirm and pay.
            </p>
          </div>
        </div>

        <CheckoutProgress currentStep="payment" />

        <div className="max-w-xl mx-auto mt-4 md:mt-8 space-y-6">
          {/* Delivery recap */}
          {formData && (
            <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
              <div className="px-5 py-4 border-b border-border/50 bg-secondary/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-foreground">Delivering To</h3>
                <Link
                  to="/checkout"
                  state={{ verifiedPhone, formData }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </Link>
              </div>
              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center gap-2.5 text-foreground">
                  <User className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-semibold">{formData.fullName}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 {formData.phone}</span>
                </div>
                <div className="flex items-start gap-2.5 text-muted-foreground">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{addressLine}</span>
                </div>
                <div className="flex items-center gap-2.5 text-muted-foreground">
                  <Calendar className="w-4 h-4 flex-shrink-0" />
                  <span>
                    Starts{" "}
                    {new Date(formData.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {slotLabel(formData.timeSlot) ? ` · ${slotLabel(formData.timeSlot)}` : ""}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Order summary + Confirm & Pay */}
          <CheckoutSummary onPlaceOrder={handlePlaceOrder} isProcessing={isProcessing} items={groupItems} />
        </div>
      </main>
    </div>
  );
};

export default OrderSummary;
