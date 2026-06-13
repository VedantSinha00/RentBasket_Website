import { Link, useNavigate } from "react-router-dom";
import { User, Package, ChevronRight, LogOut, Phone, Heart, HelpCircle, LogIn, LifeBuoy, UserCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAuth, clearAuth, isAuthenticated } from "@/lib/auth";

const MenuItem = ({ to, state, icon: Icon, iconBg = "bg-primary/10", iconColor = "text-primary", title, subtitle }) => (
  <Link
    to={to}
    state={state}
    className="flex items-center gap-4 px-5 py-4 hover:bg-secondary transition-colors"
  >
    <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center flex-shrink-0`}>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground" />
  </Link>
);

const Profile = () => {
  const navigate = useNavigate();
  const loggedIn = isAuthenticated();
  const auth = getAuth();
  const phone = auth?.phone ?? "—";

  const handleSignOut = () => {
    clearAuth();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 section-container py-10 md:py-16 max-w-lg mx-auto w-full">
        {/* Avatar block */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="w-9 h-9 text-primary" />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display text-foreground">My Profile</h1>
            {loggedIn ? (
              <div className="flex items-center justify-center gap-2 mt-1 text-muted-foreground text-sm">
                <Phone className="w-3.5 h-3.5" />
                <span>+91 {phone}</span>
              </div>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">Sign in to access your account</p>
            )}
          </div>
        </div>

        {/* Menu items */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border">
          {loggedIn && (
            <>
              <MenuItem
                to="/account/details"
                icon={UserCircle}
                iconBg="bg-violet-50"
                iconColor="text-violet-500"
                title="Personal Details"
                subtitle="Your name and contact info"
              />
              <MenuItem
                to="/account/orders"
                icon={Package}
                title="My Orders"
                subtitle="View and track your rentals"
              />
            </>
          )}
          <MenuItem
            to="/wishlist"
            icon={Heart}
            iconBg="bg-rose-50"
            iconColor="text-rose-500"
            title="Wishlist"
            subtitle="Your saved items"
          />
          <MenuItem
            to="/faqs"
            icon={HelpCircle}
            iconBg="bg-blue-50"
            iconColor="text-blue-500"
            title="FAQs"
            subtitle="Common questions answered"
          />
          <MenuItem
            to="/contact"
            icon={LifeBuoy}
            iconBg="bg-amber-50"
            iconColor="text-amber-500"
            title="Support"
            subtitle="Get help with your order"
          />
          {!loggedIn && (
            <MenuItem
              to="/customer-validation"
              state={{ returnTo: "/profile" }}
              icon={LogIn}
              iconBg="bg-primary/10"
              iconColor="text-primary"
              title="Login"
              subtitle="Sign in to your account"
            />
          )}
        </div>

        {/* Sign out (only when logged in) */}
        {loggedIn && (
          <button
            onClick={handleSignOut}
            className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Profile;
