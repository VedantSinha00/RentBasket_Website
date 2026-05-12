import { Star } from "lucide-react";
import mascotVideo from "@/assets/kling_20260104_Image_to_Video_Just_Make__1408_0.mp4";

const HeroSection = () => {
  return (
    <section className="section-container py-6 md:py-12 lg:py-16 bg-background">
      <div className="flex flex-col lg:items-center lg:text-center">
        <div className="order-1 lg:order-2 flex justify-center w-full mb-4 lg:mb-0">
          <div className="overflow-hidden h-[200px] sm:h-[240px] lg:h-[350px] xl:h-[400px] 2xl:h-[420px]">
            <video
              src={mascotVideo}
              className="w-full max-h-full object-contain lg:w-80 xl:w-96 2xl:w-[700px]"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>

        <div className="order-2 lg:order-1 flex flex-col justify-center items-center text-center px-1">
          <h1 className="font-display text-4xl sm:text-5xl xl:text-5xl 2xl:text-6xl font-normal leading-tight mb-2 lg:mb-4 gradient-hero-text">
            <span className="headline-accent">Comfort</span> for your home
          </h1>
          <h1 className="font-display text-4xl sm:text-5xl xl:text-5xl 2xl:text-6xl font-normal leading-tight mb-6 lg:mb-8 gradient-hero-text">
            without the hassle of ownership
          </h1>
        </div>

        <div className="order-3 flex items-center justify-center gap-6 sm:gap-8 mb-6 lg:mb-8 mt-4 lg:mt-0">
          <div className="text-center">
            <div className="text-5xl sm:text-6xl lg:text-4xl font-bold text-primary">
              2000+
            </div>
            <div className="text-lg sm:text-xl lg:text-sm text-muted-foreground">
              Happy Customers
            </div>
          </div>
          <div className="text-center flex items-center gap-1 sm:gap-2">
            <div>
              <div className="flex text-5xl sm:text-6xl lg:text-4xl font-bold text-gold items-center justify-center gap-1">
                <Star className="w-7 h-7 sm:w-8 sm:h-8 lg:w-6 lg:h-6 fill-gold text-gold mt-1 shrink-0" />
                <span className="text-primary">4.9</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-sm text-muted-foreground">
                Google Rating!
              </div>
            </div>
          </div>
        </div>

        <div className="order-4 text-center lg:w-full">
          <p className="text-xl sm:text-2xl text-muted-foreground font-semibold">
            Rent furniture and
          </p>
          <p className="text-xl sm:text-2xl text-muted-foreground font-semibold">
            appliances in <span className="text-primary font-semibold">Delhi NCR</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
