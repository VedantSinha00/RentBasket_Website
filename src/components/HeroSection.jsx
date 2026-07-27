import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import heroLifestylePhoto from "@/assets/Home/gallery-2.jpg";

// SP-01: Mobile-first hero (§5.2). On mobile (375px): content stacks
// vertically, CTAs are always above the fold. On desktop (lg+): two-column
// split with the pine-framed lifestyle photo on the right.
const HeroSection = () => {
  const catalogLink = "/catalog";
  const prefersReducedMotion = useReducedMotion();

  // Orchestrated entrance (§5.2): H1 -> sub+CTAs -> photo card -> chips,
  // staggered, <900ms total. Reduced motion: instant single 200ms fade.
  const stagger = prefersReducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: {},
        show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
      };
  const riseFade = prefersReducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, y: 18 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
      };
  const photoReveal = prefersReducedMotion
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.2 } } }
    : {
        hidden: { opacity: 0, clipPath: "inset(0 0 0 100%)" },
        show: {
          opacity: 1,
          clipPath: "inset(0 0 0 0%)",
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 },
        },
      };

  const StatChips = ({ className = "" }) => (
    <motion.div variants={riseFade} className={`grid grid-cols-2 gap-3 ${className}`}>
      <div className="rounded-2xl bg-cream px-5 py-4">
        <div className="font-display font-bold text-ink text-2xl md:text-3xl leading-none tracking-tight">
          2000+
        </div>
        <div className="font-sans text-xs font-semibold text-ink-muted mt-1.5">
          Happy customers
        </div>
      </div>
      <a
        href="https://rentbasket.short.gy/reviews"
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-2xl bg-mint-pale px-5 py-4 transition-colors hover:bg-mint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Read our 4.9 Google reviews (opens in new tab)"
      >
        <div className="flex items-center gap-1.5">
          <Star className="w-5 h-5 md:w-6 md:h-6 fill-jade-ink text-jade-ink shrink-0" />
          <span className="font-display font-bold text-ink text-2xl md:text-3xl leading-none tracking-tight">
            4.9
          </span>
        </div>
        <div className="font-sans text-xs font-semibold text-ink-muted mt-1.5">
          Google rating
        </div>
      </a>
    </motion.div>
  );

  return (
    <section className="bg-white pt-4 pb-10 md:pt-6 md:pb-20">
      <div className="section-container">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Left column */}
          <div className="flex flex-col gap-5 md:gap-6 text-center lg:text-left items-center lg:items-start">
            <motion.h1
              variants={riseFade}
              className="font-display font-bold text-ink tracking-tight text-balance"
              style={{
                fontSize: "clamp(2rem, 6.5vw, 4.25rem)",
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
              }}
            >
              Furnish your home, on your <mark className="marker">own</mark> terms.
            </motion.h1>

            <motion.p
              variants={riseFade}
              className="font-sans font-medium text-ink-muted text-base sm:text-lg leading-relaxed max-w-md sm:hidden"
            >
              Rent premium furniture &amp; appliances in Delhi NCR — free delivery,
              maintenance, and swaps.
            </motion.p>
            <motion.p
              variants={riseFade}
              className="hidden sm:block font-sans font-medium text-ink-muted text-lg leading-relaxed max-w-md"
            >
              Rent premium furniture &amp; appliances in Delhi NCR — free delivery, free
              maintenance, and swaps when life changes.
            </motion.p>

            <motion.div
              variants={riseFade}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <Link
                to={catalogLink}
                data-testid="hero-cta"
                className="btn-pine justify-center w-full sm:w-auto text-base py-3.5 px-8"
              >
                Start Renting
              </Link>
            </motion.div>

            <StatChips className="w-full max-w-sm mt-1" />
          </div>

          {/* Right column: pine-framed lifestyle photo */}
          <motion.div variants={photoReveal} className="relative mt-2 lg:mt-0">
            <div className="rounded-3xl bg-pine p-2.5 md:p-3 shadow-elevated border border-white/10">
              <div className="relative rounded-[20px] overflow-hidden">
                <img
                  src={heroLifestylePhoto}
                  alt="A styled living room chair, part of RentBasket's furniture catalogue"
                  className="w-full h-[260px] sm:h-[380px] md:h-[480px] object-cover"
                />
                {/* Floating tag badge on mobile instead of extra button */}
                <div className="absolute top-3 left-3 md:hidden bg-pine/90 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
                  ✨ Curated Living
                </div>
              </div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-3.5 py-3.5 md:px-5 md:py-5">
                <div>
                  <h3 className="font-display font-semibold text-white text-base md:text-xl leading-snug">
                    Modern living starts here
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-mint mt-0.5 max-w-[240px]">
                    Discover furniture that brings comfort &amp; flexibility.
                  </p>
                </div>
                <Link
                  to={catalogLink}
                  className="hidden md:inline-flex btn-jade shrink-0 py-2.5 px-5 text-sm w-full md:w-auto justify-center"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
