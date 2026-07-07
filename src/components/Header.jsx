import logo from "@/assets/7 1.png";
import { ShoppingBag, Search, Heart, User } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import ContactModal from "@/components/ContactModal";

const Header = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const { getWishlistCount } = useWishlist();
  const wishlistCount = getWishlistCount();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const onCatalog = pathname === "/catalog";
  const onCart = pathname === "/basket" || pathname === "/basket/";
  const onProfile = pathname === "/profile";
  const onWishlist = pathname === "/wishlist";
  const showMobileSearch =
    pathname === "/" || pathname === "/catalog" || pathname.startsWith("/product");

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
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="section-container" style={{ width: "100%" }}>
        <div
          className="flex items-center justify-between h-12 md:h-14"
          style={{ width: "100%" }}
        >
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-1.5 md:gap-2 shrink-0 transition-opacity hover:opacity-90"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-8 md:w-32 object-contain"
              />
            </div>
            <span className="font-display text-[15px] md:text-xl font-bold text-foreground whitespace-nowrap leading-none">
              Rent<span className="text-primary">Basket</span>
            </span>
          </Link>

          {/* Desktop Nav — gaps and search width scale up with the breakpoint so
              the whole bar fits in the tight md band (768–~830px) instead of
              overflowing and cutting off the Download App button. */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8 min-w-0">
            <Link
              to="/catalog"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors whitespace-nowrap"
            >
              Browse Catalogue
            </Link>
            <Link
              to="/faqs"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              FAQs
            </Link>
            <form onSubmit={handleSubmit} className="relative min-w-0 flex-1 max-w-xs lg:max-w-none lg:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search furniture, appliances..."
                className="w-full lg:w-80 pl-9 pr-4 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </form>
          </nav>

          {/* Icons */}
          <div className="hidden md:flex items-center gap-3 shrink-0 ml-auto">
            <Link
              to="/profile"
              className={`hidden md:flex relative p-1.5 md:p-2 rounded-xl transition-colors ${
                onProfile ? "bg-primary/10" : "hover:bg-secondary"
              }`}
              title="My Profile"
            >
              <User className={`w-5 h-5 ${onProfile ? "text-primary" : "text-muted-foreground"}`} />
            </Link>
            <Link
              to="/wishlist"
              className={`hidden md:flex relative p-1.5 md:p-2 rounded-xl transition-colors ${
                onWishlist ? "bg-primary/10" : "hover:bg-secondary"
              }`}
              title="My Wishlist"
            >
              <Heart className={`w-5 h-5 ${onWishlist ? "text-primary fill-primary" : "text-muted-foreground"}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </Link>
            {!onCart && (
              <Link
                to="/basket"
                className="hidden md:flex relative p-1.5 md:p-2 rounded-xl hover:bg-secondary transition-colors"
                title="View Basket"
              >
                <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </Link>
            )}
            {onCart && (
              <div className="hidden md:flex relative p-1.5 md:p-2 rounded-xl bg-primary/10">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
            )}
            <button
              onClick={() => setContactOpen(true)}
              className="hidden lg:inline-flex btn-outline text-sm py-2 px-4 whitespace-nowrap"
            >
              Contact Us
            </button>
          </div>

          {/* Mobile search icon button on the right */}
          {showMobileSearch && (
            <Link
              to="/catalog"
              className="md:hidden p-1.5 rounded-xl text-muted-foreground hover:bg-secondary hover:text-primary transition-colors ml-auto"
              title="Search Catalogue"
            >
              <Search className="w-5 h-5" />
            </Link>
          )}
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
};

export default Header;
