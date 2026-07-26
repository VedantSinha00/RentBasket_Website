import logoWordmark from "@/assets/rentbasket-wordmark.svg";
import { ShoppingBag, Search, User, X, ArrowRight } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import ContactModal from "@/components/ContactModal";

const Header = () => {
  const [contactOpen, setContactOpen] = useState(false);
  const { getCartItemCount } = useCart();
  const cartCount = getCartItemCount();
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const onCatalog = pathname === "/catalog" || pathname === "/catalog/";
  const onCart = pathname === "/basket" || pathname === "/basket/";
  const onProfile = pathname === "/profile";
  const showMobileSearch =
    pathname === "/" || pathname === "/catalog" || pathname.startsWith("/product");

  const urlQ = onCatalog ? (new URLSearchParams(search).get("q") || "") : "";
  const [query, setQuery] = useState(urlQ);
  const lastUrlQ = useRef(urlQ);

  // Mobile search: the header shows just a magnifying-glass icon by default;
  // tapping it expands an inline, auto-focused input so the user can type.
  // Each page renders its own <Header/>, so navigating remounts this component
  // and would reset local state — we drive the open-state off a `search` URL
  // param instead, so it survives the jump to /catalog.
  const mobileSearchOpen =
    new URLSearchParams(search).get("search") === "1";
  const mobileInputRef = useRef(null);

  useEffect(() => {
    if (mobileSearchOpen) mobileInputRef.current?.focus();
  }, [mobileSearchOpen]);

  // Desktop-only: the header inverts to pine while the dark "Myth or Reality"
  // section is behind it. rootMargin pulls the trigger line up to where the
  // sticky header actually sits, so the flip lines up with the section edge
  // instead of firing a full viewport-height late.
  const [isPineTheme, setIsPineTheme] = useState(false);
  useEffect(() => {
    const target = document.getElementById("myth-section");
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPineTheme(entry.isIntersecting && window.innerWidth >= 1024),
      { rootMargin: "-80px 0px -70% 0px" }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  // Tapping the magnifying glass takes the user to the catalog (where results
  // live) and opens the inline search field to type in.
  const openMobileSearch = () => {
    const params = new URLSearchParams(onCatalog ? search : "");
    params.set("search", "1");
    navigate(`/catalog?${params.toString()}`);
  };

  const closeMobileSearch = () => {
    const params = new URLSearchParams(search);
    params.delete("search");
    const qs = params.toString();
    navigate(`/catalog${qs ? `?${qs}` : ""}`, { replace: true });
  };

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
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        isPineTheme ? "bg-pine border-white/10" : "bg-white border-border"
      }`}
    >
      {/* Wider than .section-container's 1600px cap and with its own edge
          padding — the header anchors to the actual viewport edges on
          ultra-wide screens instead of sitting in the same narrow centered
          column as the page content below it. */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8" style={{ width: "100%" }}>
        <div
          className="relative flex items-center justify-between h-14 md:h-16"
          style={{ width: "100%" }}
        >
          {/* Left Anchor: Logo + Navigation Links */}
          <div className="flex items-center gap-6 xl:gap-8 shrink-0">
            <Link
              to="/"
              className="flex items-center shrink-0 transition-opacity hover:opacity-90 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label="RentBasket home"
            >
              <img
                src={logoWordmark}
                alt="RentBasket"
                className={`h-7 md:h-9 w-auto object-contain transition-[filter] duration-300 ${
                  isPineTheme ? "brightness-0 invert" : ""
                }`}
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6 xl:gap-8">
              {!onCatalog && (
                <Link
                  to="/catalog"
                  className={`text-sm font-medium transition-colors whitespace-nowrap rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isPineTheme ? "text-white hover:text-mint" : "text-ink-muted hover:text-jade-ink"
                  }`}
                >
                  Browse Catalogue
                </Link>
              )}
              <Link
                to="/faqs"
                className={`relative text-sm font-medium transition-colors pb-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  pathname === "/faqs"
                    ? isPineTheme
                      ? "text-white after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-mint after:rounded-full"
                      : "text-jade-ink after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-0.5 after:bg-jade after:rounded-full"
                    : isPineTheme
                      ? "text-white hover:text-mint"
                      : "text-ink-muted hover:text-jade-ink"
                }`}
              >
                FAQs
              </Link>
            </nav>
          </div>

          {/* Right Anchor: Search Input + Icons + Action Button */}
          <div className="hidden md:flex items-center gap-4 xl:gap-6 shrink-0 ml-auto">
            <form onSubmit={handleSubmit} className="relative w-60 xl:w-72">
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
                isPineTheme ? "text-white/70" : "text-jade-ink"
              }`} />
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder="Search furniture..."
                className={`w-full pl-10 pr-4 py-2 rounded-full text-xs xl:text-sm border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all ${
                  isPineTheme
                    ? "bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20"
                    : "bg-mint-pale placeholder:text-ink-muted text-ink"
                }`}
              />
            </form>

            <div className="flex items-center gap-1.5 xl:gap-3">
              <Link
                to="/profile"
                className={`flex relative p-1.5 md:p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  isPineTheme
                    ? onProfile ? "bg-white/10" : "hover:bg-white/10"
                    : onProfile ? "bg-mint-pale" : "hover:bg-mint-pale"
                }`}
                title="My Profile"
              >
                <User className={`w-5 h-5 ${
                  isPineTheme
                    ? onProfile ? "text-mint" : "text-white hover:text-mint"
                    : onProfile ? "text-jade-ink" : "text-ink-muted"
                }`} />
              </Link>
              {!onCart && (
                <Link
                  to="/basket"
                  className={`flex relative p-1.5 md:p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    isPineTheme ? "hover:bg-white/10" : "hover:bg-mint-pale"
                  }`}
                  title="View Basket"
                >
                  <ShoppingBag className={`w-5 h-5 ${isPineTheme ? "text-white" : "text-ink-muted"}`} />
                  {cartCount > 0 && (
                    <span className={`absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm ${
                      isPineTheme ? "bg-mint text-pine" : "bg-jade text-pine"
                    }`}>
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </Link>
              )}
              {onCart && (
                <div className={`flex relative p-1.5 md:p-2 rounded-xl ${isPineTheme ? "bg-white/10" : "bg-mint-pale"}`}>
                  <ShoppingBag className={`w-5 h-5 ${isPineTheme ? "text-mint" : "text-jade-ink"}`} />
                  {cartCount > 0 && (
                    <span className={`absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm ${
                      isPineTheme ? "bg-mint text-pine" : "bg-jade text-pine"
                    }`}>
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={() => setContactOpen(true)}
              className="hidden lg:inline-flex btn-jade text-xs xl:text-sm py-2 px-4 whitespace-nowrap"
            >
              Talk to us
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile search icon button on the right */}
          {showMobileSearch && (
            <button
              type="button"
              onClick={openMobileSearch}
              className="md:hidden p-1.5 rounded-xl text-ink-muted hover:bg-mint-pale hover:text-jade-ink transition-colors ml-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              title="Search Catalogue"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          )}

          {/* Mobile expanding search — overlays the header row when open */}
          {showMobileSearch && mobileSearchOpen && (
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                mobileInputRef.current?.blur();
              }}
              className="md:hidden absolute inset-0 z-10 flex items-center gap-2 bg-white px-4"
            >
              <button
                type="button"
                onClick={closeMobileSearch}
                className="p-1.5 -ml-1.5 rounded-xl text-ink-muted hover:bg-mint-pale transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-jade-ink pointer-events-none" />
                <input
                  ref={mobileInputRef}
                  type="search"
                  value={query}
                  onChange={handleChange}
                  placeholder="Search furniture, appliances..."
                  className="w-full pl-10 pr-3 py-2 rounded-full text-sm bg-mint-pale placeholder:text-ink-muted text-ink border-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </form>
          )}
        </div>
      </div>

      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </header>
  );
};

export default Header;
