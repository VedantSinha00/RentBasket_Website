import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import kuMascot from "@/assets/ku-pondering.png";

const EmptyCart = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center">
      <img
        src={kuMascot}
        alt=""
        aria-hidden="true"
        className="w-28 h-28 md:w-32 md:h-32 object-contain mb-6"
        loading="eager"
        decoding="async"
      />
      <h2 className="text-xl md:text-2xl font-display font-bold text-ink mb-2">
        Your basket is empty
      </h2>
      <p className="text-sm md:text-base text-ink-muted max-w-md mb-8 leading-relaxed">
        Explore furniture and appliances for flexible rental durations. Free delivery and installation included.
      </p>
      <Link
        to="/catalog"
        className="btn-pine py-3 px-8 text-sm md:text-base inline-flex items-center gap-2"
      >
        Browse Catalogue
        <ArrowRight className="w-4 h-4" />
      </Link>
      <p className="text-xs text-ink-muted mt-4">
        Have a question?{" "}
        <a href="tel:+919959858473" className="text-ink font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded">
          Call us at +91 9959858473
        </a>
      </p>
    </div>
  );
};

export default EmptyCart;
