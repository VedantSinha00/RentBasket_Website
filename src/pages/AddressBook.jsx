import { useState } from "react";
import { MapPin, Plus, Pencil, Trash2, ChevronLeft, Star, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/addresses";

const EMPTY_FORM = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  isDefault: false,
  lat: null,
  lng: null,
};

const Field = ({ label, required, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-1">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background placeholder-muted-foreground/40"
    />
  </div>
);

const AddressForm = ({ initial = EMPTY_FORM, onSave, onCancel }) => {
  const [form, setForm] = useState(initial);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const [geoState, setGeoState] = useState(initial?.lat ? "done" : "idle"); // "idle" | "loading" | "done" | "denied"
  const [pincodeState, setPincodeState] = useState("idle"); // "idle" | "loading" | "done" | "error"

  const handlePincodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setForm((f) => ({ ...f, pincode: value }));
    if (value.length !== 6) { setPincodeState("idle"); return; }
    setPincodeState("loading");
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
      const data = await res.json();
      const po = data?.[0]?.PostOffice?.[0];
      if (data?.[0]?.Status === "Success" && po) {
        setForm((f) => ({
          ...f,
          city: f.city || po.District || po.Block || "",
          state: f.state || po.State || "",
        }));
        setPincodeState("done");
      } else {
        setPincodeState("error");
      }
    } catch {
      setPincodeState("error");
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) { setGeoState("denied"); return; }
    setGeoState("loading");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "User-Agent": "RentBasket/1.0 (rentbasket.com)" } }
          );
          if (!res.ok) throw new Error("geocode failed");
          const data = await res.json();
          const a = data.address || {};
          setForm((f) => ({
            ...f,
            lat: latitude,
            lng: longitude,
            addressLine1: f.addressLine1 || [a.house_number, a.road].filter(Boolean).join(", "),
            addressLine2: f.addressLine2 || (a.suburb || a.neighbourhood || a.quarter || ""),
            city: f.city || (a.city || a.town || a.village || a.county || ""),
            state: f.state || (a.state || ""),
            pincode: f.pincode || (a.postcode || ""),
          }));
        } catch {
          // Reverse geocode failed — still save raw coords
          setForm((f) => ({ ...f, lat: latitude, lng: longitude }));
        }
        setGeoState("done");
      },
      () => setGeoState("denied"),
      { timeout: 8000 }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullName || !form.phone || !form.addressLine1 || !form.pincode || !form.city || !form.state) return;
    onSave(form);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="bg-secondary/40 border border-border rounded-2xl p-5 space-y-3"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Full Name" required placeholder="e.g. Rahul Sharma" value={form.fullName} onChange={set("fullName")} />
        <Field label="Mobile Number" required placeholder="10-digit number" value={form.phone} onChange={set("phone")} maxLength={10} />
      </div>
      <button
        type="button"
        onClick={handleUseLocation}
        disabled={geoState === "loading" || geoState === "done"}
        className={`w-full flex items-center justify-center gap-2 py-2 border rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          geoState === "done"
            ? "border-success/40 text-success bg-success/5"
            : geoState === "denied"
            ? "border-orange-300 text-orange-600 hover:border-orange-400 bg-orange-50/40"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
        }`}
      >
        {geoState === "loading" ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Getting location…</>
        ) : geoState === "done" ? (
          <><MapPin className="w-4 h-4" /> Location captured ✓</>
        ) : geoState === "denied" ? (
          <><MapPin className="w-4 h-4" /> Retry location</>
        ) : (
          <><MapPin className="w-4 h-4" /> Use my location</>
        )}
      </button>
      <Field label="Address Line 1" required placeholder="House / Flat / Block No." value={form.addressLine1} onChange={set("addressLine1")} />
      <Field label="Address Line 2" placeholder="Street, Colony, Area" value={form.addressLine2} onChange={set("addressLine2")} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Landmark" placeholder="Near metro, school, etc." value={form.landmark} onChange={set("landmark")} />
        <div>
          <Field label="Pincode" required placeholder="6-digit pincode" value={form.pincode} onChange={handlePincodeChange} maxLength={6} inputMode="numeric" />
          {pincodeState === "loading" && (
            <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
              <Loader2 className="w-3 h-3 animate-spin" /> Looking up pincode…
            </p>
          )}
          {pincodeState === "done" && (
            <p className="text-[10px] text-success flex items-center gap-1 mt-1">
              <CheckCircle2 className="w-3 h-3" /> City &amp; state filled automatically
            </p>
          )}
          {pincodeState === "error" && (
            <p className="text-[10px] text-muted-foreground mt-1">Pincode not found — enter city and state manually</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="City" required placeholder="City" value={form.city} onChange={set("city")} />
        <Field label="State" required placeholder="State" value={form.state} onChange={set("state")} />
      </div>

      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={(e) => setForm((f) => ({ ...f, isDefault: e.target.checked }))}
          className="accent-primary w-4 h-4"
        />
        <span className="text-sm text-foreground font-medium">Set as default address</span>
      </label>

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="flex-1 py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-primary/25 transition-all active:scale-95"
        >
          Save Address
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-2.5 border border-border text-sm font-medium text-muted-foreground rounded-xl hover:bg-secondary transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.form>
  );
};

const AddressBook = () => {
  const [addresses, setAddresses] = useState(getAddresses);
  const [mode, setMode] = useState(null); // null | "add" | { type: "edit", id }

  const refresh = () => setAddresses(getAddresses());

  const handleAdd = (form) => {
    addAddress(form);
    refresh();
    setMode(null);
  };

  const handleEdit = (id, form) => {
    updateAddress(id, form);
    refresh();
    setMode(null);
  };

  const handleDelete = (id) => {
    deleteAddress(id);
    refresh();
  };

  const handleSetDefault = (id) => {
    updateAddress(id, { isDefault: true });
    refresh();
  };

  const defaultAddr = addresses.find((a) => a.isDefault);
  const others = addresses.filter((a) => !a.isDefault);

  const AddressCard = ({ addr }) => {
    const isEditing = mode?.type === "edit" && mode.id === addr.id;
    return (
      <div className="space-y-3">
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-foreground">{addr.fullName}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {[addr.addressLine1, addr.addressLine2, addr.landmark].filter(Boolean).join(", ")}
              </p>
              <p className="text-sm text-muted-foreground">
                {addr.city}, {addr.state} {addr.pincode}
              </p>
              <p className="text-sm text-muted-foreground">Mob: +91 {addr.phone}</p>
              {addr.lat && addr.lng && (
                <p className="text-[10px] text-muted-foreground/60 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {Number(addr.lat).toFixed(4)}, {Number(addr.lng).toFixed(4)}
                </p>
              )}
            </div>
            {addr.isDefault && (
              <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide">
                <Star className="w-2.5 h-2.5 fill-primary" /> Default
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border/50">
            <button
              onClick={() => setMode(isEditing ? null : { type: "edit", id: addr.id })}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Pencil className="w-3 h-3" /> Edit
            </button>
            <button
              onClick={() => handleDelete(addr.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-destructive hover:underline"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </button>
            {!addr.isDefault && (
              <button
                onClick={() => handleSetDefault(addr.id)}
                className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground ml-auto"
              >
                Set as default
              </button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {isEditing && (
            <AddressForm
              initial={addr}
              onSave={(form) => handleEdit(addr.id, form)}
              onCancel={() => setMode(null)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-10 md:py-14 max-w-lg mx-auto w-full">
        {/* Back link */}
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Profile
        </Link>

        {/* Page heading */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Address Book</h1>
        </div>

        {addresses.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No saved addresses yet</p>
          </div>
        ) : (
          <div className="space-y-6">
            {defaultAddr && (
              <section>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Default Address</p>
                <AddressCard addr={defaultAddr} />
              </section>
            )}
            {others.length > 0 && (
              <section>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Other Addresses</p>
                <div className="space-y-3">
                  {others.map((a) => <AddressCard key={a.id} addr={a} />)}
                </div>
              </section>
            )}
          </div>
        )}

        {/* Add form */}
        <AnimatePresence>
          {mode === "add" && (
            <div className="mt-6">
              <AddressForm onSave={handleAdd} onCancel={() => setMode(null)} />
            </div>
          )}
        </AnimatePresence>

        {/* Add new address button */}
        {mode !== "add" && (
          <button
            onClick={() => setMode("add")}
            className="mt-8 w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-semibold hover:shadow-md hover:shadow-primary/25 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add a New Address
          </button>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default AddressBook;
