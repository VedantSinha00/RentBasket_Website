import { MapPin } from "lucide-react";
import kuMascot from "@/assets/ChatGPT Image Jan 26, 2026 at 02_25_22 AM.png";

/** Compact Ku — native square aspect, keeps catalog above the fold */
const KuMascotImage = ({ className = "" }) => (
  <img
    src={kuMascot}
    alt="RentBasket mascot Ku"
    className={`block h-auto w-auto max-w-full object-contain ${className}`}
    width={600}
    height={800}
    loading="eager"
    decoding="async"
  />
);

const CatalogHero = () => {
  return (
    <section className="bg-background border-b border-border/50">
      <div className="section-container py-6 md:py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 lg:gap-10">
          <div className="min-w-0 flex-1 order-2 sm:order-1">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3 sm:mb-4">
              <MapPin className="w-3 h-3 shrink-0" />
              Delhi NCR
            </span>

            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight text-foreground">
              Rent furniture and appliances for{" "}
              <span className="text-primary italic">every duration</span>
            </h1>

            <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl">
              From 1 day to 12 months — flexible rentals, transparent pricing,
              free maintenance, delivery and installation.
            </p>
          </div>

          <div className="order-1 sm:order-2 flex shrink-0 justify-center sm:justify-end">
            <KuMascotImage className="w-[180px] sm:w-[210px] lg:w-[252px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
