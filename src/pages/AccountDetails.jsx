import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronLeft, User, Phone, Mail, LogOut } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuth, setAuth, clearAuth } from "@/lib/auth";
import { toast } from "sonner";

const AccountDetails = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [name, setName] = useState(auth?.name ?? "");
  const [email, setEmail] = useState(auth?.email ?? "");

  const handleNameBlur = () => {
    setAuth({ ...auth, name: name.trim() });
    if (name.trim()) toast.success("Name saved");
  };

  const handleEmailBlur = () => {
    setAuth({ ...auth, email: email.trim() });
    if (email.trim()) toast.success("Email saved");
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
              className="w-full px-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background placeholder-muted-foreground/40"
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
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className="w-full pl-9 pr-3.5 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background placeholder-muted-foreground/40"
              />
            </div>
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
