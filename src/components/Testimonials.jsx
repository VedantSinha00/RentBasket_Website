import { Star } from "lucide-react";
import { useState } from "react";

const reviews = [
  {
    text: "I rented all my appliances from RentBasket and overall had a really good experience. The items were in great shape, clean, and handled professionally. Pricing felt fair for the convenience and quality. Would definitely recommend it to anyone looking for a hassle-free rental option.",
    name: "Rahul S.",
    location: "Gurgaon",
  },
  {
    text: "I've used RentBasket in three different flats across Gurgaon, and I can honestly say they're the best rental service I've come across. Every time I've needed to rent something, the process has been seamless, with no surprises or hassles.",
    name: "Priya M.",
    location: "Gurgaon",
  },
  {
    text: "RentBasket has been a savior in terms of furnishing our house and also maintaining the aesthetics. We rented beds with storage, household appliances and sofa sets and have been highly satisfied with their service.",
    name: "Ankit V.",
    location: "Gurgaon",
  },
  {
    text: "Bought a double bed on rent as well as appliances (Fridge & Washing Machine). All the products are in excellent condition. The owner & the staff are very courteous. They provided the stuff within four hours of my request.",
    name: "Sneha R.",
    location: "Gurgaon",
  },
  {
    text: "Exceptional value for money. The quality of their furniture is very good, especially considering how competitively priced their products are.",
    name: "Vikram T.",
    location: "Noida",
  },
  {
    text: "I needed a queen size bed urgently so I preferred RentBasket and they delivered on time. The quality of the bed is very good and the staff is very polite and supportive. Awesome service!",
    name: "Neha K.",
    location: "Noida",
  },
  {
    text: "I have rented washing machine and fridge through them. I had a really easy experience. I got the appliance delivered on the same day. Their rental is also very reasonable. Rentbasket team thank you for your great support.",
    name: "Amit D.",
    location: "Noida",
  },
  {
    text: "Incredible furniture at unbeatable prices! The quality is top-notch, and they offer customization options to match your preferred color scheme. The team was super cooperative and made the whole process seamless!",
    name: "Pooja G.",
    location: "Noida",
  },
  {
    text: "The items were in fantastic condition — clean, well-maintained, and handled professionally. The delivery and installation were spot on time. The staff were extremely polite, helpful, and courteous.",
    name: "Rohan B.",
    location: "Gurgaon",
  },
  {
    text: "A reliable place to rent quality furniture and appliances within your budget. We rented a 5-seater sofa with a center table and received the best deal here. The same-day delivery was a great bonus!",
    name: "Divya P.",
    location: "Gurgaon",
  },
  {
    text: "Highly satisfied with the service. I wanted the TV in 4–5 hrs and it was on my doorstep. Will 100% recommend.",
    name: "Karan S.",
    location: "Noida",
  },
  {
    text: "They provided the best service. Hassle-free, fast service and quick refund of security deposit. Had a wonderful experience with them.",
    name: "Meera J.",
    location: "Noida",
  },
];

const row1 = reviews.slice(0, 6);
const row2 = reviews.slice(6, 12);

const StarRating = () => (
  <div className="flex gap-1 mb-3">
    {[...Array(5)].map((_, i) => (
      <Star key={i} size={14} fill="currentColor" className="text-gold" />
    ))}
  </div>
);

const Avatar = ({ name }) => {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
      <span className="text-sm font-bold text-primary">{initial}</span>
    </div>
  );
};

const TestimonialCard = ({ text, name, location }) => (
  <div className="w-[280px] md:w-[320px] shrink-0 bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 mx-3">
    <StarRating />
    <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{text}"</p>
    <div className="flex items-center gap-3 mt-1">
      <Avatar name={name} />
      <div>
        <p className="text-sm font-bold text-foreground leading-tight">{name}</p>
        <p className="text-xs text-muted-foreground">{location}</p>
      </div>
    </div>
  </div>
);

const MarqueeRow = ({ items, duration, reverse = false }) => {
  const doubled = [...items, ...items];
  const [paused, setPaused] = useState(false);
  return (
    <div
      className="relative flex overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div
        className="flex"
        style={{
          animation: `marquee-scroll ${duration}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        {doubled.map((r, i) => (
          <TestimonialCard key={i} {...r} />
        ))}
      </div>
    </div>
  );
};

const Testimonials = () => (
  <section className="py-14 md:py-20 overflow-hidden">
    <div className="section-container mb-10">
      <p className="text-primary font-sans font-semibold text-sm uppercase tracking-widest mb-3">
        Our Reviews
      </p>
      <h2 className="font-display font-extrabold text-4xl md:text-6xl text-foreground leading-tight mb-3">
        Loved by RentBasket homes.
      </h2>
      <p className="text-muted-foreground font-sans text-base">
        Real reviews from real customers across Delhi NCR.
      </p>
    </div>

    <div className="flex flex-col gap-4">
      <MarqueeRow items={row1} duration={35} />
      <MarqueeRow items={row2} duration={45} reverse={true} />
    </div>

    <style>{`
      @keyframes marquee-scroll {
        from { transform: translateX(0); }
        to { transform: translateX(-50%); }
      }
    `}</style>
  </section>
);

export default Testimonials;
