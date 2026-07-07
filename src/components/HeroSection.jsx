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

          {/* Stats - below the video in white space */}
          <motion.div
            className="flex items-center justify-center gap-14 w-full max-w-xs mx-auto pt-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          >
            <div className="text-center">
              <div className="font-sans font-extrabold italic text-primary leading-none text-[28px] sm:text-[32px] tracking-[-0.04em]">
                2000+
              </div>
              <div className="font-sans font-semibold text-muted-foreground text-[11px] sm:text-xs mt-1.5 tracking-tight">
                Happy Customers
              </div>
            </div>
            <a
              href="https://rentbasket.short.gy/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center block rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none"
              aria-label="Read our 4.9 Google reviews"
            >
              <div className="flex items-center justify-center gap-1 leading-none">
                <span className="text-gold text-[22px] leading-none">★</span>
                <span className="font-sans font-extrabold italic text-primary text-[28px] sm:text-[32px] tracking-[-0.04em]">
                  4.9
                </span>
              </div>
              <div className="font-sans font-semibold text-muted-foreground text-[11px] sm:text-xs mt-1.5 tracking-tight">
                Google Rating!
              </div>
            </a>
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
          <div className="flex flex-col justify-center px-16 xl:px-20 z-10 w-[44%] shrink-0 gap-6">
            {/* Stats */}
            <motion.div
              className="flex items-center gap-12"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            >
              <div>
                <div className="font-sans font-extrabold italic text-primary leading-none lg:text-[44px] xl:text-[52px] tracking-[-0.04em]">
                  2000+
                </div>
                <div className="font-sans font-bold text-muted-foreground text-sm xl:text-base mt-1 tracking-tight">
                  Happy Customers
                </div>
              </div>
              <a
                href="https://rentbasket.short.gy/reviews"
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Read our 4.9 Google reviews (opens in new tab)"
              >
                <div className="flex items-center gap-1.5 leading-none">
                  <Star className="w-8 xl:w-10 xl:h-10 fill-gold text-gold shrink-0" />
                  <span className="font-sans font-extrabold italic text-primary lg:text-[44px] xl:text-[52px] tracking-[-0.04em]">
                    4.9
                  </span>
                </div>
                <div className="font-sans font-bold text-muted-foreground text-sm xl:text-base mt-1 tracking-tight">
                  Google Rating
                </div>
              </a>
            </motion.div>

            {/* TODO: Restore desktop category tabs once backend collections are built. */}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Link
                to={catalogLink}
                data-testid="hero-cta"
                className="flex items-center justify-center h-[52px] sm:px-8 rounded-full border-[2.5px] border-primary text-primary font-sans font-bold lg:text-[16px] xl:text-[18px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-soft active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                Browse Catalogue
              </Link>
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
