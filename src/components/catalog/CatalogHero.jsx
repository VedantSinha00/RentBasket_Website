import { MapPin } from "lucide-react";
import mascotVideo from "@/assets/Ku Saying Hi.webm";

const KuMascotVideo = ({ className = "" }) => (
  <video
    src={mascotVideo}
    className={`block w-full h-auto ${className}`}
    autoPlay
    loop
    muted
    playsInline
    aria-label="RentBasket mascot Ku saying hello"
  />
);

const CatalogHero = () => {
  return (
    <section className="bg-cream/50">
      <div className="section-container py-12 md:py-16">
        {/* Mobile */}
        <div className="lg:hidden flex flex-col">
          <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4 w-fit">
            <MapPin className="w-3 h-3" />
            Delhi NCR
          </span>

          <div className="mb-6 flex justify-center">
            <KuMascotVideo className="max-w-[280px] sm:max-w-[320px]" />
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4 text-foreground">
            Rent furniture and appliances for{" "}
            <span className="text-primary italic">every duration</span>
          </h1>

          <p className="text-base text-muted-foreground leading-relaxed max-w-lg">
            From 1 day to 12 months — flexible rentals, transparent pricing,
            free maintenance, delivery and installation.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex items-center gap-12 xl:gap-16">
          <div className="flex-1 min-w-0">
            <span className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3.5 py-1.5 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5" />
              Delhi NCR
            </span>

            <h1 className="font-display text-4xl xl:text-5xl font-bold leading-tight mb-5 text-foreground">
              Rent furniture and appliances
              <br />
              for{" "}
              <span className="text-primary italic">every duration</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              From 1 day to 12 months — flexible rentals, transparent pricing,
              free maintenance, delivery and installation.
            </p>
          </div>

          <div className="flex-shrink-0 flex justify-center">
            <KuMascotVideo className="max-w-[320px] xl:max-w-[380px]" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogHero;
