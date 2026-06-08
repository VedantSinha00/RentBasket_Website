import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import logo from "@/assets/7 1.png";
import { toast } from "sonner";
import { setAuth } from "@/lib/auth";
import { generateOtp, loginWithOtp, signUpWithOtp, getCities } from "@/api/otp";

const RESEND_COOLDOWN = 30; // seconds

const CustomerValidation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || "/profile";
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => { document.title = "Sign Up or Login | RentBasket"; }, []);
  const [step, setStep] = useState("phone"); // "phone" | "otp"
  const [isLoading, setIsLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0); // seconds until resend is allowed
  const [isRegistered, setIsRegistered] = useState(null); // null | true | false
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState("");
  const [cityError, setCityError] = useState("");
  const [citiesError, setCitiesError] = useState(false);

  // Prefetch cities so the list is ready if the user turns out to be new
  const fetchCities = () => {
    setCitiesError(false);
    getCities().then(setCities).catch(() => setCitiesError(true));
  };
  useEffect(() => {
    fetchCities();
  }, []);

  // Countdown for the Resend OTP cooldown
  useEffect(() => {
    if (resendIn <= 0) return;
    const id = setInterval(() => setResendIn((s) => (s <= 1 ? 0 : s - 1)), 1000);
    return () => clearInterval(id);
  }, [resendIn]);

  const handlePhoneSubmit = async () => {
    if (!phoneNumber.trim() || phoneNumber.length < 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setIsLoading(true);
    try {
      const { IsRegistered } = await generateOtp(phoneNumber);
      setIsRegistered(IsRegistered);
      setStep("otp");
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP sent to your mobile number");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendIn > 0 || isLoading) return;
    setOtp("");
    setIsLoading(true);
    try {
      await generateOtp(phoneNumber);
      setResendIn(RESEND_COOLDOWN);
      toast.success("OTP resent to your mobile number");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp.trim() || otp.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }
    if (!isRegistered && !cityId) {
      setCityError("Please select your city");
      return;
    }

    setIsLoading(true);
    try {
      let userData;
      if (isRegistered) {
        userData = await loginWithOtp(phoneNumber, otp);
      } else {
        await signUpWithOtp(phoneNumber, otp, cityId);
        // The signup endpoint doesn't return a token (mobile-app-only field).
        // We re-use the same OTP to log in immediately after. If the backend
        // treats OTPs as single-use this second call will fail — in that case
        // we catch below and tell the user to request a fresh OTP.
        userData = await loginWithOtp(phoneNumber, otp);
      }
      setAuth({
        phone: userData.mobile_no,
        token: userData.token,
        userId: userData.user_id,
        leadId: userData.lead_id,
        name: userData.first_name ? `${userData.first_name} ${userData.last_name}`.trim() : "",
        email: userData.email || "",
      });
      toast.success("Mobile verified!", {
        description: "Let's complete your order details.",
      });
      navigate(returnTo, { state: { verifiedPhone: phoneNumber } });
    } catch (err) {
      const isPostSignupLoginFail = !isRegistered;
      toast.error(
        isPostSignupLoginFail
          ? "Account created! Please request a new OTP to log in."
          : err.message,
        isPostSignupLoginFail
          ? { description: "Tap 'Resend OTP' below to get a fresh code." }
          : undefined,
      );
      if (isPostSignupLoginFail) {
        setOtp("");
        setIsRegistered(true); // switch to login path so next attempt skips signUpWithOtp
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (step === "phone") handlePhoneSubmit();
      else handleOtpSubmit();
    }
  };

  const benefits = [
    "Track your rental bookings in real-time",
    "Exclusive member-only discounts and offers",
    "Priority customer support access",
    "Seamless future rentals with saved preferences",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 py-2 sticky top-0 z-50">
        <div className="section-container">
          <img src={logo} alt="RentBasket" className="w-10 md:w-28" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10 border border-border/30">

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl font-bold font-display text-foreground text-center mb-2">
              {step === "phone" ? "Sign Up or Login" : "Verify OTP"}
            </h1>

            <p className="text-center text-muted-foreground text-sm md:text-base mb-8">
              {step === "phone"
                ? "Enter your mobile number to get started"
                : `Enter the OTP sent to ${phoneNumber}`}
            </p>

            {/* Form */}
            <div className="space-y-5 mb-8">
              {step === "phone" ? (
                <>
                  {/* Phone Input */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="Enter 10-digit number"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      maxLength="10"
                      className="w-full px-3.5 py-2.5 border border-primary/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed bg-background placeholder-muted-foreground/40 font-medium tracking-normal"
                    />
                  </div>

                  {/* Generate OTP Button */}
                  <button
                    onClick={handlePhoneSubmit}
                    disabled={isLoading || !phoneNumber}
                    className="w-full py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-primary/25 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Sending..." : "Generate OTP"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>
                </>
              ) : (
                <>
                  {/* OTP Input */}
                  <div>
                    <label className="text-sm font-semibold text-foreground block mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      placeholder="Enter 4-digit OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      maxLength="4"
                      className="w-full px-3.5 py-2.5 border border-primary/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed bg-background placeholder-muted-foreground/40 font-medium tracking-widest text-center"
                    />
                  </div>

                  {/* City Picker — only for new users */}
                  {isRegistered === false && (
                    <div>
                      <label className="text-sm font-semibold text-foreground block mb-2">
                        Select City
                      </label>
                      {citiesError ? (
                        <div className="flex items-center justify-between rounded-lg border border-destructive/40 bg-destructive/5 px-3.5 py-2.5">
                          <p className="text-xs text-destructive font-medium">
                            Couldn't load cities. Please retry.
                          </p>
                          <button
                            type="button"
                            onClick={fetchCities}
                            disabled={isLoading}
                            className="text-xs font-semibold text-primary hover:underline disabled:opacity-60 ml-2 flex-shrink-0"
                          >
                            Retry
                          </button>
                        </div>
                      ) : (
                        <select
                          value={cityId}
                          onChange={(e) => { setCityId(e.target.value); setCityError(""); }}
                          disabled={isLoading}
                          className="w-full px-3.5 py-2.5 border border-primary/30 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed bg-background text-foreground"
                        >
                          <option value="">Select your city</option>
                          {cities.map((c) => (
                            <option key={c.city_id} value={c.city_id}>{c.city}</option>
                          ))}
                        </select>
                      )}
                      {cityError && (
                        <p className="text-xs text-destructive mt-1">{cityError}</p>
                      )}
                    </div>
                  )}

                  {/* Verify OTP Button */}
                  <button
                    onClick={handleOtpSubmit}
                    disabled={isLoading || !otp}
                    className="w-full py-2.5 bg-gradient-to-r from-primary to-primary/90 text-white text-sm font-semibold rounded-xl hover:shadow-md hover:shadow-primary/25 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? "Verifying..." : "Verify & Continue"}
                    {!isLoading && <ArrowRight className="w-5 h-5" />}
                  </button>

                  {/* Secondary actions */}
                  <div className="pt-3 border-t border-border/30 flex items-center justify-between text-sm">
                    <div className="text-muted-foreground">
                      {resendIn > 0 ? (
                        <span>Resend in <span className="font-semibold text-foreground tabular-nums">0:{String(resendIn).padStart(2, "0")}</span></span>
                      ) : (
                        <button
                          onClick={handleResend}
                          disabled={isLoading}
                          className="text-primary font-semibold hover:underline disabled:opacity-60"
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setStep("phone");
                        setOtp("");
                        setPhoneNumber("");
                        setResendIn(0);
                        setIsRegistered(null);
                        setCityId("");
                        setCityError("");
                      }}
                      disabled={isLoading}
                      className="text-muted-foreground hover:text-primary transition-colors underline disabled:opacity-60"
                    >
                      Change number
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Verification Message */}
            <div className="text-center text-xs md:text-sm text-muted-foreground pb-6 border-b border-border/30">
              By continuing, I agree to the{" "}
              <Link to="/terms-n-conditions" className="text-primary font-semibold hover:underline">
                Terms & Conditions
              </Link>.
            </div>

            {/* Benefits Section */}
            {step === "phone" && (
              <div className="mt-6 space-y-3">
                <p className="text-sm font-semibold text-foreground mb-3">By signing up:</p>
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs md:text-sm text-muted-foreground">
                    <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Trust Badge */}
          <div className="mt-6 text-center text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-success-muted border border-success-border font-medium text-success">
              ✓ Secure & Encrypted
            </span>
          </div>
        </div>
      </main>

      {/* Footer Note */}
      <footer className="text-center text-xs md:text-sm text-muted-foreground py-6 border-t border-border/30">
        <p>Need help? <a href="tel:+919958858473" className="text-primary font-semibold hover:underline">Call +91 9958858473</a></p>
      </footer>
    </div>
  );
};

export default CustomerValidation;
