import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Phone, Mail, MapPin, Calendar, Clock, Info, CheckCircle2, ChevronDown, Plus } from "lucide-react";
import { getAddresses } from "@/lib/addresses";

/**
 * Reusable Card for Checkout Sections
 */
const CheckoutCard = ({ title, icon: Icon, children, subtitle }) => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-soft mb-6">
    <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between bg-secondary/10">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm md:text-base font-bold text-foreground">{title}</h3>
          {subtitle && <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="p-5 md:p-6">
      {children}
    </div>
  </div>
);

/**
 * Standard Input Field
 */
const InputField = ({ label, icon: Icon, placeholder, type = "text", ...props }) => (
  <div className="space-y-1.5">
    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all"
        {...props}
      />
    </div>
  </div>
);

const AddressSelector = ({ setFormData }) => {
  const [expanded, setExpanded] = useState(false);
  const [addresses, setAddresses] = useState(getAddresses);
  const defaultAddr = addresses.find((a) => a.isDefault);

  // Sync default address fields into formData whenever the default address changes.
  useEffect(() => {
    if (defaultAddr) {
      setFormData((prev) => ({
        ...prev,
        addressLine1: defaultAddr.addressLine1,
        addressLine2: defaultAddr.addressLine2 || "",
        landmark: defaultAddr.landmark || "",
        pincode: defaultAddr.pincode,
        city: defaultAddr.city,
        state: defaultAddr.state,
      }));
    }
  }, [defaultAddr?.id]);

  if (!defaultAddr) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">No saved address yet. Add one to continue.</p>
        <Link
          to="/address-book"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-primary/30 text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </Link>
        <ServiceabilityNote />
      </div>
    );
  }

  const shortAddr = [defaultAddr.addressLine1, defaultAddr.city, defaultAddr.pincode]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-3">
      {/* Collapsed card — tap to expand */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left bg-secondary/30 border border-border rounded-xl p-4 hover:border-primary/30 transition-all"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-success flex-shrink-0" />
              <span className="text-[10px] font-bold text-success uppercase tracking-wider">Saved Address</span>
            </div>
            <p className="text-sm font-bold text-foreground">{defaultAddr.fullName}</p>
            <p className="text-sm text-muted-foreground mt-0.5 truncate">{shortAddr}</p>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-muted-foreground flex-shrink-0 mt-1 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {/* Expanded full details */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-border rounded-xl p-4 space-y-1">
              <p className="text-sm font-bold text-foreground">{defaultAddr.fullName}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {[defaultAddr.addressLine1, defaultAddr.addressLine2, defaultAddr.landmark]
                  .filter(Boolean)
                  .join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {defaultAddr.city}, {defaultAddr.state} {defaultAddr.pincode}
              </p>
              <p className="text-sm text-muted-foreground">Mob: +91 {defaultAddr.phone}</p>
              <div className="pt-2 border-t border-border/50 mt-2">
                <Link
                  to="/address-book"
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Edit in Address Book
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add / change address */}
      <Link
        to="/address-book"
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        Add or change address
      </Link>

      <ServiceabilityNote />
    </div>
  );
};

const ServiceabilityNote = () => (
  <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl flex gap-3">
    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
    <p className="text-[11px] text-muted-foreground leading-relaxed">
      <span className="font-bold text-primary">Serviceability Note:</span> If your pincode is outside our primary zone, our team will coordinate for a custom delivery quote.
    </p>
  </div>
);

const CheckoutForm = ({ formData, setFormData, phoneVerified = false }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full">
      {/* 1. Your Details (mobile already verified at login/signup) */}
      <CheckoutCard
        title="Your Details"
        icon={User}
        subtitle="We'll use these details to share delivery updates and your invoice."
      >
        {phoneVerified && (
          <div className="flex items-center justify-between gap-3 mb-5 p-3 bg-success-muted border border-success-border rounded-xl">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
              <div>
                <p className="text-[10px] font-bold text-success-muted-foreground uppercase tracking-wider">Mobile Verified</p>
                <p className="text-sm font-bold text-foreground">+91 {formData.phone}</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-success uppercase tracking-wider">Verified</span>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InputField
            label="Full Name"
            icon={User}
            name="fullName"
            placeholder="e.g. Rahul Sharma"
            value={formData.fullName}
            onChange={handleChange}
          />
          <InputField
            label="Email Address"
            icon={Mail}
            name="email"
            type="email"
            placeholder="e.g. rahul@example.com"
            value={formData.email}
            onChange={handleChange}
          />
          {!phoneVerified && (
            <div className="md:col-span-2">
              <InputField
                label="Mobile Number"
                icon={Phone}
                name="phone"
                placeholder="e.g. 99588 58473"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          )}
        </div>
      </CheckoutCard>

      {/* 2. Delivery Address */}
      <CheckoutCard
        title="Delivery Address"
        icon={MapPin}
        subtitle="Currently serving Gurgaon, Noida, and select areas across Delhi NCR."
      >
        <AddressSelector setFormData={setFormData} />
      </CheckoutCard>

      {/* 3. Rental Start Details */}
      <CheckoutCard 
        title="Rental Start Details" 
        icon={Calendar}
        subtitle="When would you like your items delivered and set up?"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField 
            label="Preferred Start Date" 
            icon={Calendar} 
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            min={new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]}
          />
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Time Slot
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Morning", "Afternoon", "Evening"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, timeSlot: slot }))}
                  className={`py-2.5 px-1 rounded-xl border text-[10px] md:text-xs font-bold transition-all ${
                    formData.timeSlot === slot
                      ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 space-y-1.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">
              Special Instructions (Optional)
            </label>
            <textarea
              name="instructions"
              rows={3}
              placeholder="e.g. Entry via Gate 2, Lift access available, call after arriving at gate."
              className="w-full px-4 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary focus:bg-background transition-all resize-none"
              value={formData.instructions}
              onChange={handleChange}
            />
          </div>
        </div>
      </CheckoutCard>

      {/* 4. Included Benefits Trust Card */}
      <div className="bg-success rounded-2xl p-5 md:p-6 text-white shadow-lg shadow-success/25 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h4 className="text-base font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Included with your RentBasket order
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-2">
            {[
              "Free Delivery",
              "Free Installation",
              "Free Maintenance",
              "Flexible Duration",
              "Refundable Deposit",
              "Relocation Support",
            ].map((benefit) => (
              <div key={benefit} className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-white/70" />
                <span className="text-xs font-medium text-white/90 uppercase tracking-wide">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Abstract background element */}
        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      </div>
    </div>
  );
};

export default CheckoutForm;
