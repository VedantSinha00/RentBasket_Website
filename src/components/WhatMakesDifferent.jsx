import { SlidersHorizontal, Settings, Sparkles, PhoneCall } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const WhatMakesDifferent = () => {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 },
    },
  };

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="section-container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16 px-4 flex flex-col items-center">
          <h2 className="font-display font-bold text-ink tracking-tight text-balance text-4xl sm:text-5xl md:text-6xl leading-tight">
            What makes Rentbasket
          </h2>
          <div className="relative inline-block mt-3 mb-4">
            {/* Far left accent dot */}
            <span
              aria-hidden="true"
              className="absolute -left-16 bottom-2 w-1.5 h-1.5 rounded-full bg-jade hidden sm:block"
            />

            {/* Left vertical bracket line with bottom dot */}
            <div aria-hidden="true" className="absolute left-0 -top-1 -bottom-2.5 w-[2px] bg-jade">
              <span className="absolute -bottom-1 -left-[3.5px] w-2.5 h-2.5 rounded-full bg-jade" />
            </div>

            {/* Right vertical bracket line with top dot */}
            <div aria-hidden="true" className="absolute right-0 -top-2.5 -bottom-1 w-[2px] bg-jade">
              <span className="absolute -top-1 -right-[3.5px] w-2.5 h-2.5 rounded-full bg-jade" />
            </div>

            {/* Highlighted pale mint box */}
            <div className="bg-mint-pale px-7 py-1">
              <span className="font-display font-bold text-pine text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight block">
                different
              </span>
            </div>
          </div>
          <p className="font-sans text-base sm:text-lg text-ink-muted font-medium mt-1">
            Zero hassle, transparent pricing, built for relocation.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5 max-w-6xl mx-auto md:grid-rows-[275px_125px]"
          variants={containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* 1. Customizations — top-left green card */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-3 bg-jade rounded-[28px] p-7 flex flex-col justify-between min-h-[260px] md:min-h-0 overflow-hidden relative shadow-sm"
          >
            {/* Organic top-right background wave curve */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 275"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 100 0 C 160 50, 140 145, 300 165 L 300 0 Z"
                fill="hsl(var(--mint))"
                fillOpacity="0.45"
              />
            </svg>

            {/* Dark icon tile */}
            <div className="w-12 h-12 rounded-2xl bg-pine text-white flex items-center justify-center shrink-0 relative z-10 shadow-sm">
              <SlidersHorizontal className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="font-display font-bold text-white text-2xl sm:text-3xl leading-tight">
                Customizations
              </h3>
              <p className="font-sans text-sm font-medium text-white/90 leading-snug max-w-[240px]">
                Tailor your furniture to your space and style — make it truly yours.
              </p>
            </div>
          </motion.div>

          {/* 2. Free Maintenance & Repair — tall middle column */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-3 md:row-span-2 bg-mint-pale rounded-[28px] p-7 flex flex-col justify-between min-h-0 overflow-hidden relative shadow-sm"
          >
            {/* Background organic curves — a smaller mobile-only viewBox so the
                blobs don't force the tall desktop card's ~410px gap */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none md:hidden"
              viewBox="0 0 300 220"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 0 0 L 170 0 C 120 60, 170 110, 300 125 L 300 0 Z"
                fill="hsl(var(--mint))"
                fillOpacity="0.5"
              />
              <path
                d="M 0 100 C 100 110, 110 170, 190 220 L 0 220 Z"
                fill="hsl(var(--mint))"
                fillOpacity="0.35"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none hidden md:block"
              viewBox="0 0 300 420"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 0 0 L 170 0 C 120 110, 170 210, 300 240 L 300 0 Z"
                fill="hsl(var(--mint))"
                fillOpacity="0.5"
              />
              <path
                d="M 0 190 C 100 210, 110 320, 190 420 L 0 420 Z"
                fill="hsl(var(--mint))"
                fillOpacity="0.35"
              />
            </svg>

            {/* Icon placed in middle section on desktop; mobile sits at natural top */}
            <div className="pt-0 md:pt-28">
              <div className="w-13 h-13 p-3.5 rounded-2xl bg-jade text-white flex items-center justify-center shrink-0 relative z-10 shadow-sm w-fit">
                <Settings className="w-6 h-6 stroke-[2.2]" />
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 relative z-10 pb-1">
              <h3 className="font-display font-bold text-ink text-2xl sm:text-3xl leading-tight">
                Free Maintenance<br />&amp; Repair
              </h3>
              <p className="font-sans text-xs sm:text-sm font-medium text-ink-muted leading-relaxed max-w-[250px]">
                If something stops working, we fix or replace it — quickly and responsibly, with no hidden cost
              </p>
            </div>
          </motion.div>

          {/* 3. Sky Blue Sliver — top row narrow sliver */}
          <motion.div
            variants={cardVariants}
            aria-hidden="true"
            className="hidden md:block md:col-span-1 bg-sky rounded-[28px] relative overflow-hidden shadow-sm"
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 275"
              preserveAspectRatio="none"
            >
              <path
                d="M 0 0 L 100 0 L 100 80 C 60 70, 30 110, 0 140 Z"
                fill="hsl(var(--sky))"
                fillOpacity="0.8"
              />
              <path
                d="M 0 150 C 40 170, 60 210, 100 230 L 100 275 L 0 275 Z"
                fill="hsl(var(--sky))"
                fillOpacity="0.6"
              />
            </svg>
          </motion.div>

          {/* 4. Try First, Pay Later — top-right landscape card */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-5 bg-sand rounded-[28px] p-7 flex flex-col justify-between min-h-[260px] md:min-h-0 overflow-hidden relative shadow-sm"
          >
            {/* Top-Left White Icon Tile with Coral Sparkle */}
            <div className="w-12 h-12 rounded-2xl bg-white/90 text-terracotta flex items-center justify-center shrink-0 relative z-10 shadow-sm">
              <Sparkles className="w-6 h-6 stroke-[2.2] fill-terracotta/20" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 relative z-10 mt-6">
              <h3 className="font-display font-bold text-ink text-2xl sm:text-3xl leading-tight">
                Try First, Pay Later
              </h3>
              <p className="font-sans text-xs sm:text-sm font-medium text-ink-muted leading-snug max-w-[260px]">
                Try it before you commit and pay later on selected products.
              </p>
            </div>
          </motion.div>

          {/* 5. Blush Pink Block — bottom-left decorative card */}
          <motion.div
            variants={cardVariants}
            aria-hidden="true"
            className="hidden md:block md:col-span-3 bg-blush rounded-[28px] relative overflow-hidden shadow-sm"
          >
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 300 125"
              preserveAspectRatio="none"
            >
              <path
                d="M 120 0 C 180 30, 220 70, 300 125 L 300 0 Z"
                fill="hsl(var(--blush))"
                fillOpacity="0.7"
              />
              <path
                d="M 0 35 C 80 35, 140 75, 200 125 L 0 125 Z"
                fill="hsl(var(--terracotta))"
                fillOpacity="0.5"
              />
            </svg>
          </motion.div>

          {/* 6. Consultation on Call — bottom-right wide card (spans col 7..12) */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-6 bg-cream rounded-[28px] p-7 flex items-center justify-between min-h-[120px] md:min-h-0 overflow-hidden relative shadow-sm"
          >
            {/* Bottom right soft beige wave */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 500 125"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M 280 125 C 320 60, 400 40, 500 45 L 500 125 Z"
                fill="hsl(var(--ivory))"
                fillOpacity="0.9"
              />
            </svg>

            {/* Content Left */}
            <div className="flex flex-col gap-1 relative z-10 max-w-[340px]">
              <h3 className="font-display font-bold text-ink text-xl sm:text-2xl leading-snug">
                Consultation on Call
              </h3>
              <p className="font-sans text-xs sm:text-sm font-medium text-ink-muted leading-snug">
                Not sure what you need? Talk to us and we'll help you plan the perfect setup.
              </p>
            </div>

            {/* Icon Right */}
            <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-2xl bg-terracotta text-white flex items-center justify-center shrink-0 relative z-10 shadow-sm ml-3">
              <PhoneCall className="w-6 h-6 stroke-[2.2]" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatMakesDifferent;


