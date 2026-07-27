import { Star } from "lucide-react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import VideoTestimonial from "@/components/VideoTestimonial";
import lakshayWebm from "@/assets/testimonial-lakshay.webm";
import lakshayMp4 from "@/assets/testimonial-lakshay.mp4";
import lakshayPoster from "@/assets/testimonial-lakshay-poster.jpg";
import manasviWebm from "@/assets/testimonial-manasvi.webm";
import manasviMp4 from "@/assets/testimonial-manasvi.mp4";
import manasviPoster from "@/assets/testimonial-manasvi-poster.jpg";
import reel01Webm from "@/assets/testimonial-reel01.webm";
import reel01Mp4 from "@/assets/testimonial-reel01.mp4";
import reel01Poster from "@/assets/testimonial-reel01-poster.jpg";

// City is pending from the user — renders name-only until filled.
const videoTestimonials = [
  {
    name: "Lakshay",
    city: "",
    webmSrc: lakshayWebm,
    mp4Src: lakshayMp4,
    poster: lakshayPoster,
  },
  {
    name: "Manasvi",
    city: "",
    webmSrc: manasviWebm,
    mp4Src: manasviMp4,
    poster: manasviPoster,
  },
  {
    name: "Pranjal & Sejal",
    city: "",
    webmSrc: reel01Webm,
    mp4Src: reel01Mp4,
    poster: reel01Poster,
  },
];

const reviews = [
  {
    text: "I rented all my appliances from RentBasket and overall had a really good experience. The items were in great shape, clean, and handled professionally. Pricing felt fair for the convenience and quality. Would definitely recommend it to anyone looking for a hassle-free rental option.",
    name: "Pranjal A.",
    location: "Gurgaon",
    category: "appliances",
  },
  {
    text: "I've used RentBasket in three different flats across Gurgaon, and I can honestly say they're the best rental service I've come across. Every time I've needed to rent something, the process has been seamless, with no surprises or hassles.",
    name: "Shikhar B.",
    location: "Gurgaon",
    category: "combos",
  },
  {
    text: "RentBasket has been a savior in terms of furnishing our house and also maintaining the aesthetics. We rented beds with storage, household appliances and sofa sets and have been highly satisfied with their service.",
    name: "Urbi K.",
    location: "Gurgaon",
    category: "combos",
  },
  {
    text: "Bought a double bed on rent as well as appliances (Fridge & Washing Machine). All the products are in excellent condition. The owner & the staff are very courteous. They provided the stuff within four hours of my request.",
    name: "Sneha R.",
    location: "Gurgaon",
    category: "combos",
  },
  {
    text: "Exceptional value for money. The quality of their furniture is very good, especially considering how competitively priced their products are.",
    name: "Vikram T.",
    location: "Noida",
    category: "furniture",
  },
  {
    text: "I needed a queen size bed urgently so I preferred RentBasket and they delivered on time. The quality of the bed is very good and the staff is very polite and supportive. Awesome service!",
    name: "Neha K.",
    location: "Noida",
    category: "furniture",
  },
  {
    text: "I have rented washing machine and fridge through them. I had a really easy experience. I got the appliance delivered on the same day. Their rental is also very reasonable. Rentbasket team thank you for your great support.",
    name: "Amit D.",
    location: "Noida",
    category: "appliances",
  },
  {
    text: "Incredible furniture at unbeatable prices! The quality is top-notch, and they offer customization options to match your preferred color scheme. The team was super cooperative and made the whole process seamless!",
    name: "Pooja G.",
    location: "Noida",
    category: "furniture",
  },
  {
    text: "The items were in fantastic condition — clean, well-maintained, and handled professionally. The delivery and installation were spot on time. The staff were extremely polite, helpful, and courteous.",
    name: "Rohan B.",
    location: "Gurgaon",
    category: "appliances",
  },
  {
    text: "A reliable place to rent quality furniture and appliances within your budget. We rented a 5-seater sofa with a center table and received the best deal here. The same-day delivery was a great bonus!",
    name: "Divya P.",
    location: "Gurgaon",
    category: "furniture",
  },
  {
    text: "Highly satisfied with the service. I wanted the TV in 4–5 hrs and it was on my doorstep. Will 100% recommend.",
    name: "Karan S.",
    location: "Noida",
    category: "appliances",
  },
  {
    text: "They provided the best service. Hassle-free, fast service and quick refund of security deposit. Had a wonderful experience with them.",
    name: "Meera J.",
    location: "Noida",
    category: "combos",
  },
];

const filterTabs = [
  { key: "all", label: "All Reviews" },
  { key: "appliances", label: "Appliances" },
  { key: "furniture", label: "Furniture" },
  { key: "combos", label: "Full Sets" },
];


const StarRating = () => (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill="currentColor" className="text-jade-ink" />
    ))}
  </div>
);

const Avatar = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-mint-pale flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-jade-ink">{initial}</span>
    </div>
  );
};

const TestimonialCard = ({ text, name, location, className = "w-[78vw] max-w-[320px] md:w-[320px] shrink-0 mx-2" }) => (
  <div className={`bg-white rounded-2xl shadow-card p-5 flex flex-col gap-3 ${className}`}>
    <StarRating />
    <p className="text-sm text-ink-muted leading-relaxed flex-1">"{text}"</p>
    <div className="flex items-center gap-3 mt-1">
      <Avatar name={name} />
      <div>
        <p className="text-sm font-bold text-ink leading-tight">{name}</p>
        <p className="text-xs text-ink-muted">{location}</p>
      </div>
    </div>
  </div>
);

const RollingMarqueeRow = ({
  items,
  direction = "left",
  speedMobile = "75s",
  speedDesktop = "45s",
}) => {
  const loopItems = useMemo(() => {
    if (!items || items.length === 0) return [];
    let list = [...items];
    while (list.length < 8) {
      list = [...list, ...items];
    }
    return [...list, ...list];
  }, [items]);

  if (loopItems.length === 0) return null;

  const animClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="overflow-hidden w-full py-1.5 group/marquee">
      <div
        className={`flex w-max will-change-transform ${animClass} group-hover/marquee:[animation-play-state:paused]`}
        style={{
          "--marquee-speed": speedMobile,
          "--marquee-speed-md": speedDesktop,
        }}
      >
        {loopItems.map((r, i) => (
          <TestimonialCard
            key={i}
            {...r}
            className="w-[280px] sm:w-[320px] md:w-[360px] shrink-0 mx-2 sm:mx-3"
          />
        ))}
      </div>
    </div>
  );
};

const FilterTabs = ({ active, onChange }) => (
  <div className="flex justify-center gap-2 mb-6 flex-wrap px-4">
    {filterTabs.map((tab) => (
      <button
        key={tab.key}
        onClick={() => onChange(tab.key)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
          active === tab.key
            ? "bg-primary text-primary-foreground"
            : "bg-cream/50 text-ink-muted hover:bg-cream"
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const staggerClass = (index, total) => {
  if (total === 2) return index === 0 ? "md:mt-6" : "md:-mt-2";
  return index === 1 ? "md:mt-6" : "md:-mt-2";
};

const VideoTestimonialRow = ({ items }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [showTapHint, setShowTapHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowTapHint(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const deactivate = useCallback(() => setActiveIndex(null), []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0 md:overflow-visible md:justify-center md:gap-10">
        {items.map((item, index) => (
          <div
            key={item.name}
            className={`w-[58vw] sm:w-[52vw] shrink-0 snap-center md:w-[300px] lg:w-[340px] ${staggerClass(index, items.length)}`}
          >
            <VideoTestimonial
              {...item}
              active={activeIndex === index}
              dimmed={activeIndex !== null && activeIndex !== index}
              showTapHint={showTapHint}
              onToggle={() => {
                setShowTapHint(false);
                setActiveIndex((current) => (current === index ? null : index));
              }}
              onDeactivate={deactivate}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const ReviewsSection = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(
    () => (activeTab === "all" ? reviews : reviews.filter((r) => r.category === activeTab)),
    [activeTab]
  );

  const filteredRow1 = useMemo(() => {
    const half = Math.ceil(filtered.length / 2);
    return filtered.slice(0, half);
  }, [filtered]);

  const filteredRow2 = useMemo(() => {
    const half = Math.ceil(filtered.length / 2);
    return filtered.slice(half);
  }, [filtered]);

  return (
    <div className="flex flex-col gap-4">
      <FilterTabs active={activeTab} onChange={setActiveTab} />
      <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] flex flex-col gap-4">
        <RollingMarqueeRow items={filteredRow1} direction="left" speedMobile="75s" speedDesktop="45s" />
        {filteredRow2.length > 0 && (
          <RollingMarqueeRow items={filteredRow2} direction="right" speedMobile="75s" speedDesktop="45s" />
        )}
      </div>
    </div>
  );
};

const Testimonials = () => (

  <section className="pt-4 pb-14 md:pt-6 md:pb-20 overflow-hidden bg-white">
    {/* Section heading (moved here from the removed LovedByCustomers fan) */}
    <div className="text-center mb-6 md:mb-8 px-4 flex flex-col items-center gap-2">
      <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-ink tracking-tight leading-tight">
        Real Homes, Real Stories
      </h2>
      <p className="text-sm text-ink-muted">
        See why 500+ Gurgaon &amp; Noida residents rent with RentBasket
      </p>
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 border border-primary/15 text-xs sm:text-sm font-sans font-medium text-foreground">
        <span className="font-bold text-primary">4.9</span>
        <div className="flex text-gold">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} fill="currentColor" />
          ))}
        </div>
        <span className="text-muted-foreground">•</span>
        <span className="text-muted-foreground">500+ Verified Homes in NCR</span>
      </div>
    </div>

    <VideoTestimonialRow items={videoTestimonials} />

    {/* CTA bridge: answers "where does a persuaded viewer go" without
        competing with the reviews below for attention. Owns all the spacing
        between the video row and the reviews (tightened per D12). */}
    <div className="text-center mt-4 mb-8 md:mt-8 md:mb-16">
      <Link to="/catalog/" className="btn-outline inline-block">
        Browse the catalogue
      </Link>
    </div>

    <ReviewsSection />
  </section>
);

export default Testimonials;
