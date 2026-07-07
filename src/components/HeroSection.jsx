import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mascotVideo from "@/assets/ku-behind-sofa.mp4";

// SP-01: Mobile-first hero.
// On mobile (375 px): content stacks vertically, CTA is always above the fold.
// On desktop (lg+): original two-column layout with mascot video alongside.
const HeroSection = () => {
  const catalogLink = "/catalog";

  return (
    <>
      {/* ── Mobile/Tablet View (Dual Layout) ─────────────────────── */}
      <section className="lg:hidden relative px-5 pt-8 sm:px-8 flex flex-col items-center text-center gap-6 overflow-hidden">
        <div className="bg-background -mx-5 sm:-mx-8 px-5 sm:px-8 w-[calc(100%+2.5rem)] sm:w-[calc(100%+4rem)] flex flex-col items-center text-center gap-6 pb-6">
          {/* Mascot video container - full scene, shown uncropped */}
          <div className="relative flex items-center justify-center w-full mx-auto -mt-4 z-0">
            <video
              src={mascotVideo}
              className="w-full h-auto object-contain"
              autoPlay
              loop
              muted
              playsInline
              aria-label="RentBasket mascot Ku behind a sofa"
            />
          </div>

          {/* Floating Card - stats + CTA below the video */}
          <motion.div
            className="bg-cream/50 border border-border/40 p-6 rounded-2xl shadow-soft flex flex-col gap-6 w-full max-w-xs mx-auto z-10 relative"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            {/* Stats row inside card */}
            <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-4 text-left">
              <div>
                <div className="font-sans font-extrabold text-foreground text-[18px] leading-none tracking-tight">
                  2000+
                </div>
                <div className="font-sans text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                  Customers
                </div>
              </div>
              <div className="w-[1px] h-7 bg-border/40 shrink-0" />
              <a
                href="https://rentbasket.short.gy/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none"
                aria-label="Read our 4.9 Google reviews"
              >
                <span className="text-gold text-[16px] leading-none">★</span>
                <div>
                  <div className="font-sans font-extrabold text-foreground text-[18px] leading-none tracking-tight">
                    4.9
                  </div>
                  <div className="font-sans text-[10px] text-muted-foreground mt-1 font-semibold uppercase tracking-wider">
                    Google Rating
                  </div>
                </div>
              </a>
            </div>

            {/* Button inside card */}
            <div>
              <Link
                to={catalogLink}
                data-testid="hero-cta"
                className="flex items-center justify-center h-[46px] w-full rounded-full border-[2px] border-primary text-primary font-sans font-bold text-[14px] bg-white hover:bg-primary/5 transition-colors active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Browse Catalogue
              </Link>
            </div>
          </motion.div>

          {/* TODO: Once the backend supports category-based collection routing, restore the category tabs.
            For now, since collection filtering is handled directly within the catalog, they are removed from the hero view. */}
        </div>

      </section>

      {/* ── Desktop View (Dual Layout) ───────────────────────────── */}
      {/* Inner row capped to max-w-7xl and centered so the hero doesn't sprawl
          edge-to-edge (and de-align from the rest of the site) on wide / zoomed-
          out screens. The section stays full-bleed for the background. */}
      <section className="hidden lg:flex relative flex-row justify-center bg-background overflow-hidden lg:min-h-[440px] w-full">
        <div className="flex flex-row w-full max-w-7xl mx-auto">
          {/* Content column */}
          <div className="flex flex-col justify-center px-16 xl:px-20 z-10 w-[44%] shrink-0">
            {/* Floating Content Card */}
            <motion.div
              className="bg-cream/50 border border-border/40 p-8 xl:p-10 rounded-2xl shadow-soft flex flex-col gap-8 max-w-sm"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Clean, Divided Stats Row */}
              <div className="flex items-center justify-between gap-6 border-b border-border/40 pb-6">
                <div>
                  <span className="font-sans font-extrabold text-foreground text-2xl xl:text-3xl tracking-tight">
                    2000+
                  </span>
                  <span className="font-sans text-xs text-muted-foreground block mt-1 font-semibold tracking-tight uppercase">
                    Happy Customers
                  </span>
                </div>
                <div className="w-[1px] h-10 bg-border/40 shrink-0" />
                <a
                  href="https://rentbasket.short.gy/reviews"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  aria-label="Read our 4.9 Google reviews (opens in new tab)"
                >
                  <Star className="w-6 h-6 fill-gold text-gold shrink-0" />
                  <div>
                    <span className="font-sans font-extrabold text-foreground text-2xl xl:text-3xl tracking-tight">
                      4.9
                    </span>
                    <span className="font-sans text-xs text-muted-foreground block mt-1 font-semibold tracking-tight uppercase">
                      Google Rating
                    </span>
                  </div>
                </a>
              </div>

              {/* TODO: Restore desktop category tabs once backend collections are built. */}

              {/* Primary CTA Button */}
              <div>
                <Link
                  to={catalogLink}
                  data-testid="hero-cta"
                  className="flex items-center justify-center h-[50px] w-full rounded-full border-[2.5px] border-primary text-primary font-sans font-bold text-[15px] xl:text-[16px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-sm active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Browse Catalogue
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Mascot video */}
          <div className="relative flex items-center justify-center lg:flex-1">
            <video
              src={mascotVideo}
              className="h-full w-full lg:w-[90%] lg:h-[90%] object-contain"
              autoPlay
              loop
              muted
              playsInline
              aria-label="RentBasket mascot Ku behind a sofa"
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
