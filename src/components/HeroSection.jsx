import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mascotVideo from "@/assets/kling_20260104_Image_to_Video_Just_Make__1408_0.mp4";

const categories = ["Furniture", "Appliances", "Combos", "Bestsellers"];

// SP-01: Mobile-first hero.
// On mobile (375 px): content stacks vertically, CTA is always above the fold.
// On desktop (lg+): original two-column layout with mascot video alongside.
const HeroSection = ({ activeCategory = "Furniture", onCategoryChange }) => {
  const catalogLink = "/catalog";

  return (
    <>
      {/* ── Mobile/Tablet View (Dual Layout) ─────────────────────── */}
      <section className="lg:hidden relative bg-background px-5 py-8 sm:px-8 flex flex-col items-center text-center gap-6 overflow-hidden">
        {/* Centered Headline */}
        <motion.h1
          className="font-display font-semibold leading-[1.2] tracking-tight text-foreground text-[24px] sm:text-[32px] max-w-sm sm:max-w-md mx-auto z-10 relative"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <span className="font-script font-normal text-primary text-[1.1em] mr-1">Comfort</span>{" "}
          <span className="text-primary">for your home</span>
          <br />
          <span className="text-gradient-coral font-bold">without the hassle of ownership</span>
        </motion.h1>

        {/* Mascot video container - Chest up close-up */}
        <div className="relative flex items-center justify-center w-full h-[260px] sm:h-[310px] overflow-hidden mx-auto -mt-6 sm:-mt-8 z-0">
          <video
            src={mascotVideo}
            className="h-full w-full object-contain origin-top scale-[1.7]"
            autoPlay
            loop
            muted
            playsInline
            aria-label="RentBasket mascot Ku waving hello"
          />

          {/* Soft transition fade at the bottom edge */}
          <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none z-10" />

          {/* Stats - Floating glassmorphic capsule overlay */}
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center justify-center gap-6 px-6 py-2.5 bg-white/90 backdrop-blur-md rounded-full border border-border/50 shadow-card z-20 w-[88%] max-w-[320px]"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="text-center flex-1">
              <div className="font-sans font-extrabold italic text-primary leading-none text-[22px] tracking-[-0.04em]">
                1200+
              </div>
              <div className="font-sans font-bold text-muted-foreground text-[10px] mt-0.5 tracking-tight uppercase">
                Customers
              </div>
            </div>

            {/* Divider line */}
            <div className="w-[1px] h-6 bg-border/80" />

            <a
              href="https://rentbasket.short.gy/reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="text-center flex-1 block transition-opacity hover:opacity-80 focus-visible:outline-none"
              aria-label="Read our 4.9 Google reviews"
            >
              <div className="flex items-center justify-center gap-0.5 leading-none">
                <span className="text-gold text-[18px] leading-none">★</span>
                <span className="font-sans font-extrabold italic text-primary text-[22px] tracking-[-0.04em]">
                  4.9
                </span>
              </div>
              <div className="font-sans font-bold text-muted-foreground text-[10px] mt-0.5 tracking-tight uppercase">
                Google Rating
              </div>
            </a>
          </motion.div>
        </div>

        {/* Category tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className={`relative font-sans font-semibold text-[15px] sm:text-[17px] pb-1.5 tracking-tight transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="w-full max-w-xs"
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
                1200+
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

          {/* Category tabs */}
          <motion.div
            className="flex gap-x-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            {categories.map((cat) => {
              const isActive = cat === activeCategory;
              return (
                <button
                  key={cat}
                  onClick={() => onCategoryChange?.(cat)}
                  className={`relative font-sans font-semibold lg:text-[18px] xl:text-[20px] pb-1.5 tracking-tight transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {cat}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </motion.div>

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
