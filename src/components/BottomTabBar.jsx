import { Home, LayoutGrid, Heart, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

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
  { to: "/",        icon: Home,        label: "Home"    },
  { to: "/catalog", icon: LayoutGrid,   label: "Browse"  },
  { to: "/wishlist",icon: Heart,       label: "Wishlist"},
  { to: "/basket",  icon: ShoppingBag, label: "Cart"    },
  { to: "/profile", icon: User,        label: "Account" },
];

const BottomTabBar = () => {
  const { pathname } = useLocation();
  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();

  const hidden = HIDDEN_ON.some((p) => pathname === p || pathname === `${p}/` || pathname.startsWith(p));
  if (hidden) return null;

  const cartCount = getCartItemCount();
  const wishlistCount = getWishlistCount();

  const isActive = (to) => {
    if (to === "/") return pathname === "/" || pathname === "//";
    return pathname === to || pathname.startsWith(to);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/40">
      <div className="flex items-center justify-around px-2 py-2 pb-safe">
        {tabs.map(({ to, icon: Icon, label }) => {
          const active = isActive(to);
          const showBadge = (to === "/basket" && cartCount > 0) || (to === "/wishlist" && wishlistCount > 0);
          const badgeCount = to === "/basket" ? cartCount : wishlistCount;

          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}
                  fill={active && (to === "/wishlist") ? "currentColor" : "none"}
                />
                {showBadge && (
                  <span className="absolute -top-1 -right-1.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] font-bold rounded-full flex items-center justify-center">
                    {badgeCount > 9 ? "9+" : badgeCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-semibold transition-colors ${active ? "text-primary" : "text-muted-foreground"}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomTabBar;
