import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, User, Phone, Mail, LogOut, CheckCircle2, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";
import { updateUserProfile } from "@/api/profile";
import { sendEmailOtp, verifyEmailOtp } from "@/api/otp";
import { toast } from "sonner";

const RESEND_COOLDOWN = 30;

const AccountDetails = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [name, setName] = useState(auth?.name ?? "");
  const [email, setEmail] = useState(auth?.email ?? "");
  const [isSaving, setIsSaving] = useState(false);

  // Email verification state
  const [emailVerified, setEmailVerified] = useState(Boolean(auth?.emailVerified));
  const [emailStep, setEmailStep] = useState("idle"); // "idle" | "sending" | "otp" | "verifying"
  const [emailOtp, setEmailOtp] = useState("");
  const [resendIn, setResendIn] = useState(0);
  const [pendingEmail, setPendingEmail] = useState(""); // email the OTP was sent to
  const otpInputRef = useRef(null);

  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  // Reset verification state when user edits email to something different
  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (emailVerified && val !== (auth?.email ?? "")) setEmailVerified(false);
    if (emailStep === "otp") setEmailStep("idle");
  };

  const buildProfilePayload = (overrides) => {
    const current = getAuth();
    const fullName = overrides.name ?? current?.name ?? "";
    const parts = fullName.trim().split(" ");
    const firstName = parts[0] || "";
    const lastName = parts.slice(1).join(" ");
    return {
      user_id: current?.userId ?? "",
      first_name: firstName,
      last_name: lastName,
      email: overrides.email ?? current?.email ?? "",
      address: "",
      org_name: "",
      about_me: "",
      social_media_links: "",
      reg_mobile_num: current?.phone ?? "",
    };
  };

  const handleNameBlur = async () => {
    const trimmed = name.trim();
    const current = getAuth();
    if (!current?.userId) {
      console.warn("AccountDetails: userId missing from auth — falling back to localStorage save");
      setAuth({ ...current, name: trimmed });
      if (trimmed) toast.success("Name saved");
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile(buildProfilePayload({ name: trimmed }));
      setAuth({ ...getAuth(), name: trimmed });
      if (trimmed) toast.success("Name saved");
    } catch (err) {
      toast.error(err.message || "Failed to save name");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEmailBlur = async () => {
    const trimmed = email.trim();
    const current = getAuth();
    if (!current?.userId) {
      console.warn("AccountDetails: userId missing from auth — falling back to localStorage save");
      setAuth({ ...current, email: trimmed });
      if (trimmed) toast.success("Email saved");
      return;
    }
    setIsSaving(true);
    try {
      await updateUserProfile(buildProfilePayload({ email: trimmed }));
      setAuth({ ...getAuth(), email: trimmed });
      if (trimmed) toast.success("Email saved");
    } catch (err) {
      toast.error(err.message || "Failed to save email");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendEmailOtp = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error("Please enter a valid email address first");
      return;
    }
    setEmailStep("sending");
    try {
      // Save email to profile first so the backend recognises it when sending OTP
      const current = getAuth();
      if (current?.userId) {
        await updateUserProfile(buildProfilePayload({ email: trimmed }));
        setAuth({ ...getAuth(), email: trimmed });
      }
      await sendEmailOtp(trimmed);
      setPendingEmail(trimmed);
      setEmailStep("otp");
      setResendIn(RESEND_COOLDOWN);
      setEmailOtp("");
      toast.success("OTP sent to " + trimmed);
      setTimeout(() => otpInputRef.current?.focus(), 100);
    } catch (err) {
      setEmailStep("idle");
      toast.error(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyEmailOtp = async () => {
    if (!emailOtp.trim() || emailOtp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    setEmailStep("verifying");
    try {
      await verifyEmailOtp(pendingEmail, emailOtp);
      // Also persist the verified email to profile API
      const current = getAuth();
      if (current?.userId) {
        try {
          await updateUserProfile(buildProfilePayload({ email: pendingEmail }));
        } catch {
          // Profile save failure is non-fatal — email is still verified locally
        }
      }
      setAuth({ ...getAuth(), email: pendingEmail, emailVerified: true });
      setEmail(pendingEmail);
      setEmailVerified(true);
      setEmailStep("idle");
      toast.success("Email verified successfully!");
    } catch (err) {
      setEmailStep("otp");
      toast.error(err.message || "Invalid OTP. Please try again.");
    }
  };

  const handleResendEmailOtp = async () => {
    if (resendIn > 0) return;
    setEmailOtp("");
    try {
      await sendEmailOtp(pendingEmail);
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP resent to " + pendingEmail);
    } catch (err) {
      toast.error(err.message || "Failed to resend OTP");
    }
  };

  const handleSignOut = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-10 md:py-14 max-w-lg mx-auto w-full">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest mb-6"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> Profile
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">Personal Details</h1>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-sm p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleNameBlur}
              disabled={isSaving}
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background placeholder-muted-foreground/40 disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                disabled={isSaving || emailStep === "otp" || emailStep === "verifying"}
                className="w-full pl-9 pr-28 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background placeholder-muted-foreground/40 disabled:opacity-60 disabled:cursor-not-allowed"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                {emailVerified ? (
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-success">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                ) : email.trim() && emailStep === "idle" ? (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    className="text-[11px] font-semibold text-primary hover:underline"
                  >
                    Verify Email
                  </button>
                ) : emailStep === "sending" ? (
                  <Loader2 className="w-3.5 h-3.5 text-muted-foreground animate-spin" />
                ) : null}
              </div>
            </div>

            {/* Inline OTP entry */}
            {emailStep === "otp" || emailStep === "verifying" ? (
              <div className="mt-3 space-y-2">
                <p className="text-[11px] text-muted-foreground">
                  OTP sent to <span className="font-semibold text-foreground">{pendingEmail}</span>
                </p>
                <div className="flex gap-2">
                  <input
                    ref={otpInputRef}
                    type="text"
                    inputMode="numeric"
                    placeholder="Enter OTP"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    onKeyDown={(e) => e.key === "Enter" && handleVerifyEmailOtp()}
                    disabled={emailStep === "verifying"}
                    className="flex-1 px-3 py-2 border border-primary/30 rounded-lg text-sm text-center tracking-widest font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyEmailOtp}
                    disabled={emailStep === "verifying" || !emailOtp}
                    className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                  >
                    {emailStep === "verifying" ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    {emailStep === "verifying" ? "Verifying…" : "Confirm"}
                  </button>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  {resendIn > 0 ? (
                    <span className="text-muted-foreground">
                      Resend in <span className="font-semibold text-foreground tabular-nums">0:{String(resendIn).padStart(2, "0")}</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendEmailOtp}
                      className="text-primary font-semibold hover:underline"
                    >
                      Resend OTP
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setEmailStep("idle"); setEmailOtp(""); }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Phone — read-only */}
          <div>
            <label className="text-xs font-semibold text-foreground block mb-1.5">
              Mobile Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <input
                type="tel"
                value={auth?.phone ? `+91 ${auth.phone}` : "—"}
                readOnly
                className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-lg text-sm bg-secondary/40 text-muted-foreground cursor-not-allowed select-none"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1.5">
              Contact number cannot be changed. It is tied to your account.
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </main>

      <Footer />
    </div>
  );
};

export default AccountDetails;
