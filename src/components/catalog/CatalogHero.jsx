import { MapPin, Check } from "lucide-react";
import kuMascot from "@/assets/Ku_standing_proud.png";

/** Compact Ku — native square aspect, keeps catalog above the fold */
const KuMascotImage = ({ className = "" }) => (
  <img
    src={kuMascot}
    alt="RentBasket mascot Ku"
    className={`block h-auto object-contain ${className}`}
    loading="eager"
    decoding="async"
  />
);

const CatalogHero = () => {
  return (
    <section className="bg-background border-b border-border/50">
      <div className="section-container py-2 md:py-3">
        <div className="flex flex-row items-center justify-between gap-4 lg:gap-10">
          <div className="min-w-0 flex-1">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3 lg:mb-4">
              <MapPin className="w-3 h-3 shrink-0" />
              Delhi NCR
            </span>

            <h1 className="font-display text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold leading-tight text-foreground">
              Rent furniture and appliances for{" "}
              <span className="text-primary italic">every duration</span>
            </h1>

            <div className="mt-3 flex flex-wrap gap-2">
              {["3–12 month rentals", "Transparent pricing", "Free maintenance", "Free delivery & install"].map((label) => (
                <span key={label} className="inline-flex items-center gap-1.5 bg-secondary text-foreground text-xs font-semibold px-3 py-1.5 rounded-full border border-border">
                  <Check className="w-3 h-3 text-primary shrink-0" />
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="shrink-0 w-[110px] sm:w-[160px] lg:w-[252px]">
            <KuMascotImage className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
