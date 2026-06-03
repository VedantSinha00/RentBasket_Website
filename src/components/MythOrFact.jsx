import React, { useState } from "react";
import { HelpCircle, Check } from "lucide-react";

const Card = ({ belief, reality }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="group h-[260px] sm:h-[300px] md:h-[320px] w-full [perspective:1000px] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
    >
      <div
        className={`relative h-full w-full rounded-2xl transition-all duration-700 [transform-style:preserve-3d] shadow-soft group-hover:shadow-card ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* FRONT SIDE (BELIEF - RED GRADIENT) */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-gradient-to-br from-[#DF252F] via-[#E61E2A] to-[#B51019] p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden border border-primary/20"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(0deg)",
          }}
        >
          {/* Decorative faint background icon */}
          <HelpCircle className="absolute -right-4 -bottom-4 w-24 h-24 text-white/[0.04] stroke-[1] pointer-events-none" />

          {/* Belief Label - Absolutely positioned to sit exactly in the top gap */}
          <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 text-white rounded-full font-sans font-extrabold tracking-widest text-[11px] sm:text-xs uppercase border border-white/20 shadow-sm z-20">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Belief
          </div>

          {/* Belief Text */}
          <h3 className="text-white text-base sm:text-lg md:text-xl font-sans font-extrabold leading-snug px-2 sm:px-4 z-10 text-balance">
            "{belief}"
          </h3>

          {/* Flip Hint */}
          <p className="absolute bottom-4 text-[10px] font-sans font-bold text-white/70 tracking-wider uppercase">
            Click to reveal truth ↗
          </p>
        </div>

        {/* BACK SIDE (REALITY - WARM CREAM) */}
        <div
          className="absolute inset-0 h-full w-full rounded-2xl bg-[#FCFAF7] border border-border/80 p-6 sm:p-8 flex flex-col items-center justify-center text-center overflow-hidden transition-colors group-hover:border-primary/20"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          {/* Decorative faint background check */}
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-primary/[0.02] rounded-full flex items-center justify-center pointer-events-none">
            <Check className="w-16 h-16 text-primary stroke-[3]" />
          </div>

          {/* Reality Label - Symmetrical absolute positioning */}
          <div className="absolute top-6 sm:top-8 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 bg-red-100/80 text-primary rounded-full font-sans font-extrabold tracking-widest text-[11px] sm:text-xs uppercase border border-primary/15 shadow-sm z-20">
            ★ Reality
          </div>

          {/* Reality Text */}
          <p className="text-neutral-900 text-sm sm:text-base md:text-[16px] leading-relaxed font-sans font-semibold z-10 px-2 text-balance">
            {reality}
          </p>

          {/* Flip Hint */}
          <p className="absolute bottom-4 text-[10px] font-sans font-bold text-muted-foreground/60 tracking-wider uppercase flex items-center gap-1 group-hover:text-primary transition-colors">
            Click to flip back ↺
          </p>
        </div>
      </div>
    </div>
  );
};

const MythOrFact = () => {
  const data = [
    {
      belief: "Buying is always cheaper than renting.",
      reality:
        "Renting is more economical for usage up to ~30 months compared to buying - plus you avoid resale hassles and depreciation.",
    },
    {
      belief: "Rental furniture is always old or broken.",
      reality:
        "RentBasket products are either new or in mint condition. Every item goes through sanitization and strict quality checks before delivery.",
    },
    {
      belief: "Rentals have boring designs and limited options.",
      reality:
        "RentBasket offers modern, stylish furniture with multiple designs and color options to match your home.",
    },
    {
      belief: "Rental plans are full of hidden costs and traps.",
      reality:
        "RentBasket believes in transparent pricing with no hidden costs - what you see is what you pay.",
    },
    {
      belief: "Repairs are slow when you rent.",
      reality:
        "RentBasket has a proven track record of fast service, and repairs are handled quickly and at no additional cost.",
    },
    {
      belief: "You must be locked in for long periods.",
      reality:
        "RentBasket offers flexible lock-in options ranging from just 3 months to 12 months, so you can rent for exactly as long as you need.",
    },
  ];

  return (
    <section className="bg-background py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-8 md:mb-12">
        {/* Responsive Section Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display mb-3 md:mb-4 tracking-tight">
          Belief or Reality?
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-xl mx-auto">
          Let's bust the most common myths about renting home furniture and appliances.
        </p>
      </div>
      <div className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {data.map((item, index) => (
            <Card key={index} belief={item.belief} reality={item.reality} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default MythOrFact;
