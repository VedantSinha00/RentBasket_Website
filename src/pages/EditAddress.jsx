import { useState, useEffect } from "react";
import { MapPin, ChevronLeft, Loader2, CheckCircle2, Save } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuth } from "@/lib/auth";
import { getUserAddress, saveUserAddress } from "@/api/address";
import { toast } from "sonner";

const EMPTY = {
  contact_name: "",
  contact_phone: "",
  address_line_1: "",
  address_line_2: "",
  landmark: "",
  pincode: "",
  city: "",
  state: "",
  lat: null,
  lng: null,
};

const Field = ({ label, required, hint, ...props }) => (
  <div>
    <label className="text-xs font-semibold text-foreground block mb-1">
      {label} {required && <span className="text-primary">*</span>}
    </label>
    <input
      {...props}
      className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background placeholder-muted-foreground/40"
    />
    {hint && <p className="text-[10px] mt-1 flex items-center gap-1">{hint}</p>}
  </div>
);

const EditAddress = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const returnTo = location.state?.returnTo || "/profile";
  const backLabel = returnTo === "/checkout" ? "Checkout" : "Profile";

  const [form, setForm] = useState(EMPTY);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [geoState, setGeoState] = useState("idle"); // idle | loading | done | denied
  const [pincodeState, setPincodeState] = useState("idle"); // idle | loading | done | error

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  useEffect(() => {
    const auth = getAuth();
    if (!auth?.phone) { setIsFetching(false); return; }
    getUserAddress(auth.phone)
      .then((addr) => {
        if (addr) setForm({ ...EMPTY, ...addr });
      })
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, []);

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
          if (!res.ok) throw new Error();
          const data = await res.json();
          const a = data.address || {};
          setForm((f) => ({
            ...f,
            lat: latitude,
            lng: longitude,
            address_line_1: f.address_line_1 || [a.house_number, a.road].filter(Boolean).join(", "),
            address_line_2: f.address_line_2 || (a.suburb || a.neighbourhood || a.quarter || ""),
            city: f.city || (a.city || a.town || a.village || a.county || ""),
            state: f.state || (a.state || ""),
            pincode: f.pincode || (a.postcode || ""),
          }));
        } catch {
          setForm((f) => ({ ...f, lat: latitude, lng: longitude }));
        }
        setGeoState("done");
      },
      () => setGeoState("denied"),
      { timeout: 8000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.contact_name || !form.address_line_1 || !form.pincode || !form.city || !form.state) {
      toast.error("Please fill all required fields");
      return;
    }
    const auth = getAuth();
    if (!auth?.phone) { toast.error("Not logged in"); return; }
    setIsSaving(true);
    await saveUserAddress(auth.phone, form).catch(() => {});
    setIsSaving(false);
    toast.success("Address saved");
    navigate(returnTo);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-10 md:py-14 max-w-lg mx-auto w-full">
        <Link
          to={returnTo}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> {backLabel}
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">My Address</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Your saved delivery address</p>
          </div>
        </div>

        {isFetching ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
            className="bg-card border border-border rounded-2xl p-5 md:p-6 space-y-3.5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="Contact Name" required placeholder="e.g. Rahul Sharma" value={form.contact_name} onChange={set("contact_name")} />
              <Field label="Contact Phone" required placeholder="10-digit number" value={form.contact_phone} onChange={set("contact_phone")} maxLength={10} inputMode="numeric" />
            </div>

            <button
              type="button"
              onClick={handleUseLocation}
              disabled={geoState === "loading" || geoState === "done"}
              className={`w-full flex items-center justify-center gap-2 py-2.5 border rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
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

            <Field label="Address Line 1" required placeholder="House / Flat / Block No." value={form.address_line_1} onChange={set("address_line_1")} />
            <Field label="Address Line 2" placeholder="Street, Colony, Area" value={form.address_line_2} onChange={set("address_line_2")} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="Landmark" placeholder="Near metro, school, etc." value={form.landmark} onChange={set("landmark")} />
              <Field
                label="Pincode"
                required
                placeholder="6-digit pincode"
                value={form.pincode}
                onChange={handlePincodeChange}
                maxLength={6}
                inputMode="numeric"
                hint={
                  pincodeState === "loading" ? (
                    <span className="text-muted-foreground flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Looking up…</span>
                  ) : pincodeState === "done" ? (
                    <span className="text-success flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> City &amp; state filled</span>
                  ) : pincodeState === "error" ? (
                    <span className="text-muted-foreground">Not found — enter manually</span>
                  ) : null
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <Field label="City" required placeholder="City" value={form.city} onChange={set("city")} />
              <Field label="State" required placeholder="State" value={form.state} onChange={set("state")} />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-primary/25 transition-all active:scale-95 disabled:opacity-60 mt-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving…" : "Save Address"}
            </button>
          </motion.form>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default EditAddress;
