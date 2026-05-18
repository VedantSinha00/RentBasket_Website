import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import mascotVideo from "@/assets/kling_20260104_Image_to_Video_Just_Make__1408_0.mp4";

const categories = ["Furniture", "Appliances", "Combos", "Bestsellers"];

const HeroSection = ({ activeCategory = "Furniture", onCategoryChange }) => {
  return (
    <section className="relative flex bg-background overflow-hidden min-h-[380px] lg:min-h-[440px] pb-0">
      {/* Left: headline + stats + category tabs + CTA */}
      <div className="flex flex-col justify-center px-10 lg:px-16 xl:px-20 z-10 w-[44%] shrink-0 gap-6">

        <h1 className="font-display font-semibold leading-[1.08] tracking-tight text-foreground text-[32px] lg:text-[40px] xl:text-[48px] 2xl:text-[54px]">
          <span className="font-script font-normal text-primary mr-1 text-[1.15em]">Rent</span>{" "}
          quality furniture &amp; appliances in{" "}
          <span className="text-primary">Delhi&nbsp;NCR</span>
        </h1>

        {/* Stats */}
        <div className="flex items-center gap-8 xl:gap-12">
          <div>
            <div className="font-sans font-extrabold italic text-primary leading-none text-[36px] lg:text-[44px] xl:text-[52px] tracking-[-0.04em]">
              2000+
            </div>
            <div className="font-sans font-bold text-[#868585] text-sm xl:text-base mt-1 tracking-tight">
              Happy Customers
            </div>
          </div>
          <a
            href="https://rentbasket.short.gy/reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Read our 4.9 Google reviews (opens in new tab)"
          >
            <div className="flex items-center gap-1.5 leading-none">
              <Star className="w-8 h-8 xl:w-10 xl:h-10 fill-gold text-gold shrink-0" />
              <span className="font-sans font-extrabold italic text-primary text-[36px] lg:text-[44px] xl:text-[52px] tracking-[-0.04em]">
              4.9
              </span>
            </div>
            <div className="font-sans font-bold text-[#868585] text-sm xl:text-base mt-1 tracking-tight">
              Google Rating
            </div>
          </a>
        </div>

        {/* Category tabs — clicking jumps to the catalog below */}
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {categories.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => onCategoryChange?.(cat)}
                className={`relative font-sans font-semibold text-[17px] lg:text-[20px] xl:text-[22px] pb-1.5 tracking-tight transition-colors ${
                  isActive ? "text-primary" : "text-[#868585] hover:text-foreground"
                }`}
              >
                {cat}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          to={
            activeCategory === "Combos"
              ? "/catalog?category=Complete%20Home%20Setup"
              : `/catalog?category=${encodeURIComponent(activeCategory)}`
          }
          className="self-start flex items-center justify-center h-[52px] px-8 rounded-full border-[2.5px] border-primary text-primary font-sans font-bold text-[16px] xl:text-[18px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-soft active:scale-[0.98]"
        >
          Browse Catalogue
        </Link>
      </div>

      {/* Right: full mascot video — uncropped, at 90% of container */}
      <div className="flex-1 relative flex items-center justify-center">
        <video
          src={mascotVideo}
          className="w-[90%] h-[90%] object-contain"
          autoPlay
          loop
          muted
          playsInline
          aria-label="RentBasket mascot Ku waving hello"
        />
      </div>
    </section>
  );
};

export default HeroSection;
