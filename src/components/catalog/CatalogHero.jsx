import { MapPin } from "lucide-react";
import kuMascot from "@/assets/ChatGPT Image Jan 26, 2026 at 02_25_22 AM.png";

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
      <div className="section-container py-6 md:py-8">
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

            <p className="mt-2 text-sm lg:text-base text-muted-foreground leading-relaxed max-w-xl">
              From 1 day to 12 months — flexible rentals, transparent pricing,
              free maintenance, delivery and installation.
            </p>
          </div>

          <div className="shrink-0 w-[248px] sm:w-[360px] lg:w-[567px]">
            <KuMascotImage className="w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
