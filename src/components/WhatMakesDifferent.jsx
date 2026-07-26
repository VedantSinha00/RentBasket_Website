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
          <h2 className="font-display font-bold text-gray-900 tracking-tight text-balance text-4xl sm:text-5xl md:text-6xl leading-tight">
            What makes Rentbasket
          </h2>
          <div className="relative inline-block mt-3 mb-4">
            {/* Far left accent dot */}
            <span
              aria-hidden="true"
              className="absolute -left-16 bottom-2 w-1.5 h-1.5 rounded-full bg-[#3eb37c] hidden sm:block"
            />

            {/* Left vertical bracket line with bottom dot */}
            <div aria-hidden="true" className="absolute left-0 -top-1 -bottom-2.5 w-[2px] bg-[#3eb37c]">
              <span className="absolute -bottom-1 -left-[3.5px] w-2.5 h-2.5 rounded-full bg-[#3eb37c]" />
            </div>

            {/* Right vertical bracket line with top dot */}
            <div aria-hidden="true" className="absolute right-0 -top-2.5 -bottom-1 w-[2px] bg-[#3eb37c]">
              <span className="absolute -top-1 -right-[3.5px] w-2.5 h-2.5 rounded-full bg-[#3eb37c]" />
            </div>

            {/* Highlighted pale mint box */}
            <div className="bg-[#eaf4ed] px-7 py-1">
              <span className="font-display font-bold text-[#0f3b36] text-4xl sm:text-5xl md:text-6xl tracking-tight leading-tight block">
                different
              </span>
            </div>
          </div>
          <p className="font-sans text-base sm:text-lg text-gray-500 font-medium mt-1">
            Zero hassle, transparent pricing, built for relocation.
          </p>
        </div>

        {/* Bento Grid */}
        <motion.div
          className="relative grid grid-cols-1 md:grid-cols-12 gap-5 max-w-6xl mx-auto md:grid-rows-[310px_110px]"
          variants={containerVariants}
          initial={prefersReducedMotion ? "visible" : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* 1. Customizations — top-left, green fill */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-4 bg-[#3eb37c] rounded-[28px] p-7 flex flex-col justify-between min-h-[280px] md:min-h-0 overflow-hidden relative"
          >
            {/* Background shape */}
            <div className="absolute top-1/3 right-0 w-64 h-64 rounded-full bg-white/15 translate-x-1/4 pointer-events-none" />
            
            {/* Icon */}
            <div className="w-13 h-13 p-3.5 rounded-2xl bg-[#0b332d] text-white flex items-center justify-center shrink-0 relative shadow-sm w-fit">
              <SlidersHorizontal className="w-6 h-6 stroke-[2.5]" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 relative z-10">
              <h3 className="font-display font-bold text-white text-2xl leading-tight">
                Customizations
              </h3>
              <p className="font-sans text-sm font-medium text-white/90 leading-snug max-w-[240px]">
                Tailor your furniture to your space and style — make it truly yours
              </p>
            </div>
          </motion.div>

          {/* 2. Free Maintenance & Repair — tall middle column (spans 2 rows) */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-4 md:row-span-2 bg-[#eaf5ed] rounded-[28px] p-7 flex flex-col justify-end min-h-[420px] md:min-h-0 overflow-hidden relative"
          >
            {/* Abstract curved background shapes */}
            <div className="absolute top-0 right-0 w-52 h-52 rounded-bl-[6rem] bg-[#3eb37c]/10 pointer-events-none" />
            <div className="absolute bottom-12 -left-12 w-48 h-48 rounded-full bg-[#3eb37c]/10 pointer-events-none" />

            {/* Middle Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#3eb37c]/20 text-[#2e7d32] flex items-center justify-center shrink-0 relative mb-6 shadow-sm">
              <Settings className="w-7 h-7 stroke-[2.2]" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-3 relative z-10">
              <h3 className="font-display font-bold text-gray-900 text-2xl leading-tight">
                Free Maintenance<br />&amp; Repair
              </h3>
              <p className="font-sans text-sm font-medium text-gray-600 leading-relaxed max-w-[260px]">
                If something stops working, we fix or replace it — quickly and responsibly, with no hidden cost
              </p>
            </div>
          </motion.div>

          {/* 3. Decorative Sky Blue Sliver — top-middle-right */}
          <motion.div
            variants={cardVariants}
            aria-hidden="true"
            className="hidden md:block md:col-span-1 bg-[#d9effb] rounded-[28px] relative overflow-hidden min-h-[280px] md:min-h-0"
          >
            <div className="absolute -top-4 -left-4 w-28 h-28 rounded-full bg-white/40 pointer-events-none" />
            <div className="absolute bottom-8 right-0 w-24 h-24 rounded-full bg-[#bae6fd]/50 pointer-events-none" />
          </motion.div>

          {/* 4. Try First, Pay Later — top-right */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-3 bg-[#eedecb] rounded-[28px] p-7 flex flex-col justify-between min-h-[280px] md:min-h-0 overflow-hidden relative"
          >
            {/* Top-Left Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white/90 text-[#e07a5f] flex items-center justify-center shrink-0 relative shadow-sm">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 relative z-10 mt-6">
              <h3 className="font-display font-bold text-gray-900 text-2xl leading-tight">
                Try First, Pay Later
              </h3>
              <p className="font-sans text-sm font-medium text-gray-600 leading-snug max-w-[210px]">
                Try it before you commit and pay later on selected products.
              </p>
            </div>
          </motion.div>

          {/* 5. Blush Pink Decorative Block — bottom-left */}
          <motion.div
            variants={cardVariants}
            aria-hidden="true"
            className="hidden md:block md:col-span-4 bg-[#efa899] rounded-[28px] relative overflow-hidden min-h-[100px] md:min-h-0"
          >
            <div className="absolute top-0 left-0 w-44 h-44 rounded-full bg-white/20 -translate-x-10 -translate-y-10 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-[#f8c8be]/40 translate-x-6 translate-y-6 pointer-events-none" />
          </motion.div>

          {/* 6. Consultation on Call — bottom-right */}
          <motion.div
            variants={cardVariants}
            className="md:col-span-4 bg-[#f8f2e9] rounded-[28px] px-7 py-5 flex items-center justify-between min-h-[100px] md:min-h-0 overflow-hidden relative"
          >
            {/* Background shape */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-white/50 pointer-events-none" />

            {/* Content Left */}
            <div className="flex flex-col gap-1 relative z-10 max-w-[320px]">
              <h3 className="font-display font-bold text-gray-900 text-xl leading-snug">
                Consultation on Call
              </h3>
              <p className="font-sans text-xs sm:text-sm font-medium text-gray-600 leading-snug">
                Not sure what you need? Talk to us and we'll help you plan the perfect setup.
              </p>
            </div>

            {/* Icon Right */}
            <div className="w-12 h-12 rounded-2xl bg-[#f4b6a6]/60 text-[#d96b52] flex items-center justify-center shrink-0 relative shadow-sm ml-3">
              <PhoneCall className="w-6 h-6 stroke-[2]" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhatMakesDifferent;

