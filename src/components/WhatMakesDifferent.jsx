import { SlidersHorizontal, Settings, Sparkles, PhoneCall } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import mascotPeek from "@/assets/mascot-peek.png";

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
        <div className="text-center max-w-xl mx-auto mb-10 md:mb-14 px-4">
          <h2
            className="font-display font-semibold text-ink tracking-tight text-balance"
            style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            What makes Rentbasket <mark className="marker">different</mark>
          </h2>
          <p className="font-sans text-base text-ink-muted mt-3">
            Zero hassle, transparent pricing, built for relocation.
          </p>
        </div>

        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-12 gap-5 max-w-6xl mx-auto"
          variants={containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Customizations — tall left, jade fill */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-4 md:row-span-2 bg-jade rounded-3xl p-6 flex flex-col justify-between min-h-[220px] md:min-h-[420px] overflow-hidden relative"
          >
            <div className="w-12 h-12 rounded-xl bg-pine/15 flex items-center justify-center text-pine shrink-0">
              <SlidersHorizontal className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col gap-2 mt-8">
              <h3 className="font-display font-semibold text-pine text-xl leading-snug">
                Customizations
              </h3>
              <p className="font-sans text-[15px] text-pine/90 leading-snug max-w-[220px]">
                Tailor pieces to your space and style — make the place truly yours.
              </p>
            </div>
          </motion.div>

          {/* Free maintenance — mid, mint-pale */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-4 bg-mint-pale rounded-3xl p-6 flex flex-col justify-between min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-jade/15 flex items-center justify-center text-jade-ink shrink-0">
              <Settings className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col gap-2 mt-8">
              <h3 className="font-display font-semibold text-ink text-xl leading-snug">
                Free maintenance &amp; repair
              </h3>
              <p className="font-sans text-[15px] text-ink-muted leading-snug">
                If something stops working, we fix or replace it. Quickly, and with no
                hidden cost.
              </p>
            </div>
          </motion.div>

          {/* Decorative tile — hidden on mobile, blush shapes, aria-hidden */}
          <motion.div
            variants={cardVariants}
            aria-hidden="true"
            className="hidden md:block md:col-span-4 md:row-span-2 bg-blush rounded-3xl relative overflow-hidden min-h-[420px]"
          >
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/20" />
            <div className="absolute bottom-8 left-6 w-24 h-24 rounded-3xl bg-white/25 rotate-12" />
            <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-white/15" />

            {/* Mascot peeks over this card's top-right edge; pops in after
                cards settle. Static under reduced motion (still visible by
                default — initial state only strips the scale, not opacity). */}
            <motion.img
              src={mascotPeek}
              alt=""
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-16 right-2 w-32 h-32 object-contain drop-shadow-lg"
              initial={prefersReducedMotion ? false : { scale: 0.92, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
              style={{ scaleX: -1 }}
            />
          </motion.div>

          {/* Try first, pay later — wide right, sand */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-4 bg-sand rounded-3xl p-6 flex flex-col justify-between min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <Sparkles className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col gap-2 mt-8">
              <h3 className="font-display font-semibold text-ink text-xl leading-snug">
                Try first, pay later
              </h3>
              <p className="font-sans text-[15px] text-ink-muted leading-snug">
                Try selected products at home before you commit a rupee.
              </p>
            </div>
          </motion.div>

          {/* Consultation on call — wide bottom, ivory */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-8 bg-ivory rounded-3xl p-6 flex flex-col justify-between min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-terracotta/20 flex items-center justify-center text-terracotta shrink-0">
              <PhoneCall className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="flex flex-col gap-2 mt-8">
              <h3 className="font-display font-semibold text-ink text-xl leading-snug">
                Consultation on call
              </h3>
              <p className="font-sans text-[15px] text-ink-muted leading-snug max-w-md">
                Not sure what you need? We'll help you plan the full setup for your floor
                plan and budget.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatMakesDifferent;
