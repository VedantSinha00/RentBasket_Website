import logo from "@/assets/7 1.png";
import { ShoppingBag, Search, Heart, User } from "lucide-react";
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
  const onCart = pathname === "/basket" || pathname === "/basket/";
  const onProfile = pathname === "/profile";
  const onWishlist = pathname === "/wishlist";
  const showMobileSearch =
    pathname === "/" || pathname === "/catalog" || pathname.startsWith("/product");

  const urlQ = onCatalog ? (new URLSearchParams(search).get("q") || "") : "";
  const [query, setQuery] = useState(urlQ);
  const [searchFocused, setSearchFocused] = useState(false);
  const lastUrlQ = useRef(urlQ);
  const inputRef = useRef(null);

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
    inputRef.current?.blur();
  };


  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="section-container" style={{ width: "100%" }}>
        <div
          className="flex items-center h-16 md:h-20 gap-2"
          style={{ width: "100%" }}
        >
          {/* Logo */}
          <Link
            to="/"
            className={`flex items-center gap-2 shrink-0 transition-opacity duration-200 ${
              searchFocused
                ? "opacity-20 pointer-events-none md:opacity-100 md:pointer-events-auto"
                : "opacity-100"
            }`}
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <img
                src={logo}
                alt="RentBasket mascot"
                className="w-24 md:w-32 md:block"
              />
            </div>
          </Link>

          {/* Mobile search — flex-1 fills the centre; inner div is always w-full */}
          {showMobileSearch && (
            <form
              onSubmit={handleSubmit}
              className="md:hidden flex-1 min-w-0 relative mx-1"
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
                aria-hidden
              />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={handleChange}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={searchFocused ? "Search furniture, appliances..." : "Search..."}
                className="w-full pl-9 pr-3 py-2 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
              />
            </form>
          )}

          {/* Desktop Nav */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
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

          {/* Icons */}
          <div
            className={`ml-auto flex items-center gap-1 md:gap-3 shrink-0 transition-opacity duration-200 ${
              searchFocused
                ? "opacity-20 pointer-events-none md:opacity-100 md:pointer-events-auto"
                : "opacity-100"
            }`}
          >
            <Link
              to="/profile"
              className={`relative p-1.5 md:p-2 rounded-xl transition-colors ${
                onProfile ? "bg-primary/10" : "hover:bg-secondary"
              }`}
              title="My Profile"
            >
              <User className={`w-5 h-5 ${onProfile ? "text-primary" : "text-muted-foreground"}`} />
            </Link>
            <Link
              to="/wishlist"
              className={`relative p-1.5 md:p-2 rounded-xl transition-colors ${
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
                className="relative p-1.5 md:p-2 rounded-xl hover:bg-secondary transition-colors"
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
              <div className="relative p-1.5 md:p-2 rounded-xl bg-primary/10">
                <ShoppingBag className="w-5 h-5 text-primary" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </div>
            )}
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
