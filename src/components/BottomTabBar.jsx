import { useState } from "react";
import { Home, LayoutGrid, ShoppingBag, User, Phone } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import ContactModal from "@/components/ContactModal";

const HIDDEN_ON = [
  "/product/",
  "/basket",
  "/checkout",
  "/order-summary",
  "/order-success",
  "/kyc",
  "/customer-validation",
];

const tabs = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/catalog", icon: LayoutGrid, label: "Browse" },
  { to: "/basket", icon: ShoppingBag, label: "Cart" },
  { to: "/profile", icon: User, label: "Account" },
  { to: "#contact", icon: Phone, label: "Contact" },
];

const BottomTabBar = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const { pathname } = useLocation();
  const { getCartItemCount } = useCart();

  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname === `${p}/` || pathname.startsWith(p));
  if (hidden) return null;

  const cartCount = getCartItemCount();

  const isActive = (to) => {
    if (to === "/") return pathname === "/" || pathname === "//";
    return pathname === to || pathname.startsWith(to);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-border/50 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-around px-3 py-2 pb-safe max-w-md mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          const showBadge = to === "/basket" && cartCount > 0;
          const badgeCount = cartCount;

          if (to === "#contact") {
            return (
              <button
                key={to}
                onClick={() => setContactOpen(true)}
                className="relative flex flex-col items-center gap-1 px-3 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 text-ink-muted hover:text-jade-ink"
              >
                <div className="relative">
                  <Icon className="w-5 h-5" fill="none" />
                </div>
                <span className="text-[10px] font-semibold tracking-tight">
                  {label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={to}
              to={to}
              className={`relative flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-2xl transition-all duration-200 active:scale-95 ${active
                  ? "bg-mint-pale text-jade-ink font-bold shadow-sm"
                  : "text-ink-muted hover:text-ink"
                }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? "text-jade-ink stroke-[2.4]" : "text-ink-muted stroke-[1.8]"
                    }`}
                  fill="none"
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 bg-pine text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-sm">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] tracking-tight ${active ? "font-bold text-jade-ink" : "font-medium text-ink-muted"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </nav>
  );
};

export default BottomTabBar;
