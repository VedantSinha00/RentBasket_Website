import { Link } from "react-router-dom";
import mascotSofa from "@/assets/ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png";

const benefits = ["Delivery", "Installation", "Maintenance"];

const FreeBenefits = () => {
  return (
    <section className="section-container py-6 md:py-12 lg:py-16 bg-background">
      <div className="flex flex-col items-center text-center w-full mt-8 lg:mt-0 gap-10 lg:gap-16">
        <div className="order-3 lg:order-1 w-full flex justify-center px-2">
          <img
            src={mascotSofa}
            alt="RentBasket mascots carrying sofa"
            className="w-full max-w-2xl sm:w-4/5 md:w-3/4 lg:w-[360px] lg:max-w-none xl:w-[400px] object-contain"
          />
        </div>

        <div className="order-1 lg:order-2 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 w-full max-w-4xl">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 lg:block lg:text-left">
            <h2 className="text-5xl sm:text-6xl lg:text-5xl font-bold lg:mb-4">
              <span className="text-primary">Free</span>
            </h2>
            <ul className="space-y-1 lg:space-y-2 text-left">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-start gap-2 text-base sm:text-md font-semibold text-muted-foreground"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-foreground mt-1.5 lg:mt-2 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs sm:max-w-sm lg:max-w-none lg:w-auto shrink-0">
            <Link to="/catalog" className="w-full">
              <button className="btn-outline py-2.5 px-6 text-sm w-full lg:py-3 lg:px-8 lg:text-base whitespace-nowrap">
                Browse Catalogue
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeBenefits;
