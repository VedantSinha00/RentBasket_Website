import logo from "@/assets/7 1.png";
import { ShoppingBag, Package, Search, Heart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const Header = () => {
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const { getWishlistCount } = useWishlist();
  const wishlistCount = getWishlistCount();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const onCatalog = pathname === "/catalog";

  const urlQ = onCatalog ? (new URLSearchParams(search).get("q") || "") : "";
  const [query, setQuery] = useState(urlQ);
  const lastUrlQ = useRef(urlQ);

  useEffect(() => {
    if (urlQ !== lastUrlQ.current) {
      lastUrlQ.current = urlQ;
      setQuery(urlQ);
    }
  }, [urlQ]);

  useEffect(() => {
    if (!onCatalog) setQuery("");
  }, [onCatalog]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (onCatalog) {
      const params = new URLSearchParams(search);
      if (val.trim()) params.set("q", val.trim());
      else params.delete("q");
      navigate(`/catalog?${params.toString()}`, { replace: true });
    }
  };

  const scrollToResults = () => {
    document
      .getElementById("catalog-results")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams(onCatalog ? search : "");
    if (trimmed) params.set("q", trimmed);
    else params.delete("q");
    const qs = params.toString();
    navigate(`/catalog${qs ? `?${qs}` : ""}`, { replace: onCatalog });
    if (onCatalog) {
      scrollToResults();
    } else {
      setTimeout(scrollToResults, 150);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-container" style={{ width: "100%" }}>
        <div
          className="flex items-center justify-between h-16 md:h-20"
          style={{
            width: "100%",
          }}
        >
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-24 md:w-32 md:block"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Catalogue
            </Link>
            <Link
              to="/faqs"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              FAQs
            </Link>
            <form onSubmit={handleSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search furniture, appliances..."
                className="w-80 pl-9 pr-4 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </form>
          </nav>

          {/* Cart + CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/account/orders"
              className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
              title="My Orders"
            >
              <Package className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
              title="My Wishlist"
            >
              <Heart className="w-5 h-5 text-muted-foreground" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            <Link
              to="/cart"
              className="relative p-2 rounded-xl hover:bg-secondary transition-colors"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
            <a
              href="#download"
              className="hidden sm:inline-flex btn-outline text-sm py-2 px-4"
            >
              Download App
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
