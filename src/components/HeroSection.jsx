import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mascotVideo from "@/assets/kling_20260104_Image_to_Video_Just_Make__1408_0.mp4";

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
        {/* Centered Headline */}
        <motion.h1
          className="font-display font-semibold leading-[1.2] tracking-tight text-foreground text-[24px] sm:text-[32px] max-w-sm sm:max-w-md mx-auto z-10 relative"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="font-script font-normal text-primary text-[1.1em] mr-1">Rent</span>{" "}
          quality furniture &amp; appliances in{" "}
          <span className="text-primary">Delhi&nbsp;NCR</span>
        </motion.h1>

        {/* Mascot video container - Chest up close-up */}
        <div className="relative flex items-center justify-center w-full h-[260px] sm:h-[310px] overflow-hidden mx-auto -mt-10 sm:-mt-12 z-0">
          <video
            src={mascotVideo}
            className="h-full w-full object-contain origin-top scale-[1.7]"
            autoPlay
            loop
            muted
            playsInline
            aria-label="RentBasket mascot Ku waving hello"
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

        {/* CTA Button */}
        <motion.div
          className="w-full max-w-xs pb-8"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Link
            to={catalogLink}
            data-testid="hero-cta"
            className="flex items-center justify-center h-[52px] w-full rounded-full border-[2.5px] border-primary text-primary font-sans font-bold text-[16px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-soft active:scale-[0.98] focus-visible:outline-none"
          >
            Browse Catalogue
          </Link>
        </motion.div>
      </section>

      {/* ── Desktop View (Dual Layout) ───────────────────────────── */}
      <section className="hidden lg:flex relative flex-row bg-background overflow-hidden lg:min-h-[440px] w-full">
        {/* Content column */}
        <div className="flex flex-col justify-center px-16 xl:px-20 z-10 w-[44%] shrink-0 gap-6">
          {/* Headline */}
          <motion.h1
            className="font-display font-semibold leading-[1.1] tracking-tight text-foreground lg:text-[40px] xl:text-[48px] 2xl:text-[54px]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="font-script font-normal text-primary mr-1 text-[1.15em]">Rent</span>{" "}
            quality furniture &amp; appliances in{" "}
            <span className="text-primary">Delhi&nbsp;NCR</span>
          </motion.h1>

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
            aria-label="RentBasket mascot Ku waving hello"
          />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
