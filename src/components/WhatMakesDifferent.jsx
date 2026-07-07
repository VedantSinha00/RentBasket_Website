import { useState } from "react";
import { Truck, Wrench, Home, Package, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const features = [
  {
    icon: Truck,
    title: "Free Delivery & Installation",
    description: "Move in faster. We deliver and install at no extra cost in Delhi NCR.",
  },
  {
    icon: Wrench,
    title: "Free Maintenance & Repair",
    description: "If something stops working, we fix or replace it — quickly and responsibly.",
  },
  {
    icon: Home,
    title: "Complete Home Setup under ₹6,000/mo",
    description: "Set up your entire home with smart, affordable combinations and essentials.",
  },
  {
    icon: Package,
    title: "Free Relocation Support",
    description: "Life changes. Your furniture plan should too. Relocate hassle-free.",
  },
];

const WhatMakesDifferent = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="bg-cream/35 py-8 md:py-12 border-t border-b border-border/20">
      <div className="section-container">

        {/* Editorial Title */}
        <div className="text-center max-w-xl mx-auto mb-6 md:mb-8 px-4">
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground tracking-tight">
            What makes RentBasket different
          </h2>
          <p className="font-sans text-sm text-muted-foreground mt-1.5">
            Zero hassle, transparent pricing, built for relocation.
          </p>
        </div>

        {/* ── Laptop/Desktop Layout (4-Column Grid) ── */}
        <motion.div
          className="hidden md:grid grid-cols-4 gap-4 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="bg-background border border-border/40 rounded-2xl p-4 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 flex flex-col gap-2.5"
                variants={cardVariants}
              >
                <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 border border-primary/10">
                  <Icon className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-display font-semibold text-foreground text-md leading-snug">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-muted-foreground leading-snug">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* ── Mobile Viewport Layout (Compact Vertical Accordion) ── */}
        <div className="md:hidden flex flex-col gap-2 w-full max-w-sm mx-auto px-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isActive = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-background border border-border/40 rounded-xl overflow-hidden transition-all duration-300 shadow-soft"
              >
                <button
                  onClick={() => setActiveIndex(isActive ? -1 : index)}
                  className="w-full flex items-center justify-between p-3 text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/5 flex items-center justify-center text-primary shrink-0">
                      <Icon className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                    <h3 className="font-display font-semibold text-foreground text-[14px] sm:text-base leading-none">
                      {feature.title}
                    </h3>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-350 shrink-0 ml-2 ${isActive ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="px-3 pb-3 font-sans text-[13px] text-muted-foreground leading-snug pl-[38px]"
                    >
                      {feature.description}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default WhatMakesDifferent;
