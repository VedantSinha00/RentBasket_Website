import { Star } from "lucide-react";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Same review set used in the homepage Testimonials marquee (src/components/Testimonials.jsx).
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

const ReviewCard = ({ text, name, location }) => (
  <div className="bg-cream rounded-2xl shadow-card p-5 sm:p-6 flex flex-col gap-3">
    <StarRating />
    <p className="text-sm text-ink-muted leading-relaxed flex-1">&ldquo;{text}&rdquo;</p>
    <div className="flex items-center gap-3 mt-1">
      <Avatar name={name} />
      <div>
        <p className="text-sm font-bold text-ink leading-tight">{name}</p>
        <p className="text-xs text-ink-muted">{location}</p>
      </div>
    </div>
  </div>
);

const FilterTabs = ({ active, onChange }) => (
  <div className="flex justify-center gap-2 mb-8 flex-wrap px-4">
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

const Reviews = () => {
  const [activeTab, setActiveTab] = useState("all");

  const filtered = useMemo(
    () => (activeTab === "all" ? reviews : reviews.filter((r) => r.category === activeTab)),
    [activeTab]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 md:mb-10">
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
                Customer Reviews
              </h1>
              <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-lg mx-auto mb-4">
                See why 500+ Gurgaon &amp; Noida residents rent with RentBasket.
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

            <FilterTabs active={activeTab} onChange={setActiveTab} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((review, i) => (
                <ReviewCard key={i} {...review} />
              ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Reviews;
