import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const mascotUrl = "https://www.figma.com/api/mcp/asset/16332cb1-7534-49d4-9463-03d9752cf0e1";

const reviews = [
  {
    name: "Rahul S.",
    location: "Gurgaon",
    segments: [
      { text: "I rented all my appliances from RentBasket and overall had a really good experience. The items were in great shape, clean, and handled professionally. The delivery and installation were done on time and staff was very polite and helpful, which I really appreciated. Pricing felt fair for the convenience and quality. " },
      { text: "It really elevates my Home for a great House Party! 😉", highlight: true },
      { text: " Would definitely recommend if anyone looking for a hassle-free rental option." },
    ],
  },
  {
    name: "Priya M.",
    location: "Gurgaon",
    segments: [
      { text: "I've " },
      { text: "used RentBasket in three different flats across Gurgaon,", highlight: true },
      { text: " and I can honestly say they're the best rental service I've come across. Their rates are affordable, the quality of the products is consistently great, and their service is always on time. What really stands out is how smoothly everything goes — every time I've needed to rent something, the process has been seamless, with no surprises or hassles. If you're looking for furniture or appliance rentals in Gurgaon, I'd definitely recommend giving RentBasket a try!" },
    ],
  },
  {
    name: "Ankit V.",
    location: "Gurgaon",
    segments: [
      { text: "RentBasket has been a savior in terms of furnishing our house and also maintaining the aesthetics of the house.", highlight: true },
      { text: " We rented out multiple products like beds with storage, household appliances and sofa sets and have been highly satisfied with their service as well as their commitment towards any issues ever faced. Thanks to the team at RentBasket for always being around to solve our issues quickly :)" },
    ],
  },
  {
    name: "Divya P.",
    location: "Gurgaon",
    segments: [
      { text: "A reliable place to rent quality furniture and appliances within your budget. We rented a " },
      { text: "5-seater sofa with a center table", highlight: true },
      { text: " and received the best deal here. The " },
      { text: "same-day delivery", highlight: true },
      { text: " was a great bonus — thank you for the prompt service!" },
    ],
  },
  {
    name: "Sneha R.",
    location: "Noida",
    segments: [
      { text: "Overall it was a good experience to rent furniture & appliances from RentBasket. " },
      { text: "Quality of everything is very good.", highlight: true },
      { text: " Provided new TV, washing machine & microwave. Team of RentBasket is " },
      { text: "very cooperative, supportive & nice.", highlight: true },
      { text: " I wish them all the very best!" },
    ],
  },
];

const StarRating = ({ size = 16 }) => (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={size} fill="currentColor" className="text-gold" />
    ))}
  </div>
);

const HIGHLIGHT_CLASS = "text-primary font-semibold underline decoration-primary/20 decoration-2 underline-offset-4";

// Trim the last N words of a string, keeping a leading ellipsis if trimmed.
const tailWords = (text, n) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return text;
  return "… " + words.slice(-n).join(" ");
};

// Keep the first N words of a string, adding a trailing ellipsis if trimmed.
const headWords = (text, n) => {
  const words = text.trim().split(/\s+/);
  if (words.length <= n) return text;
  return words.slice(0, n).join(" ") + " …";
};

// Build a short preview centered on the highlighted segment: a few words of
// lead-in context, the full highlight, then a few words of trailing context.
const previewSegments = (segments, { lead = 4, trail = 8 } = {}) => {
  const hi = segments.findIndex((s) => s.highlight);
  if (hi === -1) {
    // No highlight: just show the opening.
    return [{ text: headWords(segments.map((s) => s.text).join(""), 14) }];
  }
  const out = [];
  const before = segments.slice(0, hi).map((s) => s.text).join("");
  if (before.trim()) out.push({ text: tailWords(before, lead) + " " });
  out.push({ ...segments[hi] });
  const after = segments.slice(hi + 1).map((s) => s.text).join("");
  if (after.trim()) out.push({ text: " " + headWords(after, trail) });
  return out;
};

const ReviewText = ({ segments }) => (
  <p className="text-sm text-muted-foreground leading-relaxed font-sans">
    {segments.map((seg, i) =>
      seg.highlight ? (
        <span key={i} className={HIGHLIGHT_CLASS}>{seg.text}</span>
      ) : (
        <span key={i}>{seg.text}</span>
      )
    )}
  </p>
);

const Avatar = ({ name }) => {
  const initial = name ? name.charAt(0).toUpperCase() : "U";
  return (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
      <span className="text-xs font-bold text-primary">{initial}</span>
    </div>
  );
};

const ReviewCard = ({ review, className = "" }) => (
  <div
    className={`bg-card border border-border/50 rounded-2xl p-5 w-[280px] md:w-[320px] h-full flex flex-col justify-between ${className}`}
    style={{ boxShadow: "var(--shadow-card)" }}
  >
    <div>
      <StarRating />
      <ReviewText segments={review.segments} />
    </div>
    <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/30">
      <Avatar name={review.name} />
      <div>
        <p className="text-sm font-bold text-foreground leading-tight">{review.name}</p>
        <p className="text-xs text-muted-foreground">{review.location}</p>
      </div>
    </div>
  </div>
);

const FloatingBgCard = ({ review, rotate, tx, ty, blur, opacity, index }) => {
  const duration = 6 + (index % 4) * 1.5;
  const delay = (index % 3) * 0.8;
  
  return (
    <motion.div
      className="absolute bg-card border border-border/40 rounded-2xl p-4 w-[260px] pointer-events-none select-none"
      style={{
        filter: `blur(${blur}px)`,
        boxShadow: "var(--shadow-soft)",
        opacity,
      }}
      animate={{
        transform: [
          `rotate(${rotate}deg) translate(${tx}px, ${ty}px)`,
          `rotate(${rotate}deg) translate(${tx}px, ${ty - 10}px)`,
          `rotate(${rotate}deg) translate(${tx}px, ${ty}px)`
        ]
      }}
      transition={{
        repeat: Infinity,
        duration: duration,
        delay: delay,
        ease: "easeInOut"
      }}
    >
      <StarRating size={12} />
      <p className="text-[11px] text-muted-foreground leading-relaxed font-sans line-clamp-4">
        {review.segments.map((s) => s.text).join("")}
      </p>
      {review.name && (
        <div className="flex justify-end mt-2 text-[10px] text-muted-foreground/60 font-medium font-sans">
          — {review.name}, {review.location}
        </div>
      )}
    </motion.div>
  );
};

const bgCards = [
  [3, -4,  -280,  30,  1, 0.65],
  [4,  3,   280,  30,  1, 0.65],
  [0, -3,  -160,  220,  2, 0.55],
  [1,  4,   160,  220,  2, 0.55],
  [2,  2,     0,  250,  2, 0.50],
  [0,  5,  -420, -40,  3, 0.45],
  [1, -5,   420, -40,  3, 0.45],
  [3,  6,  -300,  330,  3, 0.35],
  [4, -6,   300,  330,  3, 0.35],
  [4,  3,  -200, -130,  2, 0.38],
  [0, -3,   200, -130,  2, 0.38],
  [2,  8,  -520,  10,  5, 0.25],
  [3, -8,   520,  10,  5, 0.25],
];

const CollapsibleMobileCard = ({ review, expanded, onToggle, offsetX, rotate, zIndex, marginTop }) => (
  <motion.div
    layout
    onClick={onToggle}
    className="cursor-pointer"
    animate={{
      marginTop,
      x: expanded ? 0 : offsetX,
      rotate: expanded ? 0 : rotate,
    }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    style={{
      zIndex: expanded ? 50 : zIndex,
    }}
  >
    <div
      className="bg-card border border-border/50 rounded-2xl p-5 w-[280px] flex flex-col shadow-xl"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <StarRating />
      <ReviewText segments={expanded ? review.segments : previewSegments(review.segments)} />
      <button
        type="button"
        className="self-start mt-3 text-xs font-semibold text-primary"
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
      >
        {expanded ? "Show less" : "Read more"}
      </button>
      <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border/30">
        <Avatar name={review.name} />
        <div>
          <p className="text-sm font-bold text-foreground leading-tight">{review.name}</p>
          <p className="text-xs text-muted-foreground">{review.location}</p>
        </div>
      </div>
    </div>
  </motion.div>
);

// [reviewIndex, rotate, side, offset, top, blur, opacity]
const mobileBgCards = [
  [3, -5, "left", "-30px", "120px", 2, 0.5],
  [4, 6, "right", "-30px", "260px", 2, 0.5],
  [0, 4, "left", "-20px", "420px", 3, 0.4],
];

const LovedByCustomers = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedMobile, setExpandedMobile] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const center = () => {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
    };
    center();
    window.addEventListener("resize", center);
    return () => window.removeEventListener("resize", center);
  }, []);

  return (
    <section className="pt-14 md:pt-20 bg-white">
      <div className="section-container text-center mb-[-8px] relative z-0">
        <h2 className="font-display font-bold text-4xl md:text-6xl text-foreground leading-tight">
          Loved by Customers
        </h2>
      </div>

      {/* Mobile layout: mascot-on-top + static staggered vertical card stack */}
      <div className="md:hidden relative px-4 pb-10 overflow-hidden">
        {/* Blurred faded background cards */}
        {mobileBgCards.map(([ri, rotate, side, offset, top, blur, opacity], i) => (
          <div
            key={i}
            className="absolute bg-card border border-border/40 rounded-2xl p-4 w-[200px] pointer-events-none select-none"
            style={{
              transform: `rotate(${rotate}deg)`,
              [side]: offset,
              top,
              filter: `blur(${blur}px)`,
              boxShadow: "var(--shadow-soft)",
              opacity,
            }}
          >
            <StarRating size={12} />
            <p className="text-[11px] text-muted-foreground leading-relaxed font-sans line-clamp-4">
              {reviews[ri].segments.map((s) => s.text).join("")}
            </p>
          </div>
        ))}

        {/* Mascot sitting on top of the stack */}
        <motion.img
          src={mascotUrl}
          alt="RentBasket mascot"
          className="relative z-10 w-60 mx-auto -mb-10 pointer-events-none select-none"
          draggable={false}
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />

        {/* Staggered review cards (collapsible) */}
        <div className="relative z-20 flex flex-col items-center">
          {reviews.slice(0, 3).map((review, idx) => {
            const offsetX = [-24, 32, -16];
            const rotates = [-2, 2, -2];
            // Cards overlap by -24px in the collapsed stack. Remove the overlap
            // when the card directly above is expanded, so this card drops down
            // clear of it instead of tucking underneath.
            const overlap = idx === 0 || expandedMobile === idx - 1 ? 0 : -24;
            return (
              <CollapsibleMobileCard
                key={idx}
                review={review}
                expanded={expandedMobile === idx}
                onToggle={() => setExpandedMobile((cur) => (cur === idx ? null : idx))}
                offsetX={offsetX[idx]}
                rotate={rotates[idx]}
                zIndex={20 + idx}
                marginTop={overlap}
              />
            );
          })}
        </div>
      </div>

      {/* Desktop layout: fanned overlapping card cluster */}
      <div ref={scrollRef} className="hidden md:block overflow-x-auto overflow-y-hidden no-scrollbar">
        <div className="relative flex items-end justify-center min-h-[560px] md:min-h-[680px] w-[1400px] pb-8">
        {/* Background blurred cards */}
        {bgCards.map(([ri, rotate, tx, ty, blur, opacity], i) => (
          <FloatingBgCard
            key={i}
            review={reviews[ri]}
            rotate={rotate}
            tx={tx}
            ty={ty}
            blur={blur}
            opacity={opacity}
            index={i}
          />
        ))}

        {/* Mascot + foreground cards */}
        <motion.div
          className="relative flex flex-col items-center z-10 self-end"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.img
            src={mascotUrl}
            alt="RentBasket mascot"
            className="w-80 md:w-[30rem] relative z-10 -mb-6 pointer-events-none select-none"
            draggable={false}
            animate={{
              y: [0, -8, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: "easeInOut",
            }}
          />
          <div className="relative flex items-start justify-center mt-2 px-4">
            {reviews.slice(0, 3).map((review, idx) => {
              const isHovered = hoveredIndex === idx;
              const isAnyHovered = hoveredIndex !== null;
              
              const initialRotates = [-3, 1, 3];
              
              return (
                <motion.div
                  key={idx}
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className="relative shrink-0 cursor-pointer"
                  style={{
                    zIndex: isHovered ? 40 : (idx === 1 ? 30 : 20),
                  }}
                  animate={{
                    scale: isHovered ? 1.04 : 1,
                    rotate: isHovered ? 0 : initialRotates[idx],
                    y: isHovered ? -15 : 0,
                    x: isHovered ? (idx === 0 ? -30 : idx === 2 ? 30 : 0) : 0,
                    opacity: isAnyHovered && !isHovered ? 0.5 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 350, damping: 22 }}
                >
                  <ReviewCard 
                    review={review} 
                    className={idx === 1 ? "shadow-2xl" : "shadow-xl"}
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
};


export default LovedByCustomers;
