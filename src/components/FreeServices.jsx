import { Link } from "react-router-dom";
import mascotsCouch from "@/assets/ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png";

const FreeServices = () => {
  return (
    <section className="bg-background pt-16 md:pt-24 pb-6 md:pb-8">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Free + list + CTAs */}
          <div className="flex flex-col items-center lg:items-start">
            {/* Free + bullets */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span
                className="font-display font-medium leading-none bg-clip-text text-transparent text-[64px] sm:text-[80px] md:text-[96px]"
                style={{
                  backgroundImage:
                    "linear-gradient(99.5deg, hsl(4, 73%, 51%) 3%, hsl(351, 88%, 53%) 35%, hsl(6, 100%, 77%) 73%)",
                }}
              >
                Free
              </span>
              <ul className="list-disc pl-5 space-y-1 text-[#868585] font-sans font-semibold text-[20px] sm:text-[24px] md:text-[28px] tracking-tight">
                <li>Delivery</li>
                <li>Installation</li>
                <li>Maintenance</li>
              </ul>
            </div>

            {/* CTAs */}
            <div className="flex flex-col gap-5 mt-10 md:mt-12 w-full max-w-[400px]">
              <Link
                to="/catalog"
                className="flex items-center justify-center h-[64px] rounded-full border-[3px] border-primary text-primary font-sans font-bold text-[18px] sm:text-[20px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-soft active:scale-[0.98]"
              >
                Browse Catalogue
              </Link>
              <a
                href="#download"
                className="flex items-center justify-center h-[64px] rounded-full font-sans font-bold text-white text-[18px] sm:text-[20px] tracking-tight transition-all shadow-elevated hover:opacity-95 active:scale-[0.98]"
                style={{
                  background:
                    "linear-gradient(86.35deg, hsl(4, 69%, 50%) 14.8%, hsl(351, 88%, 50%) 50.1%, hsl(28, 99%, 76%) 129.4%)",
                  boxShadow:
                    "inset 0 2px 16px rgba(255,255,255,0.55), 0 8px 24px rgba(215,47,38,0.25)",
                }}
              >
                Get home setup quote
              </a>
            </div>
          </div>

          {/* Right: Mascots carrying couch */}
          <div className="flex justify-center lg:justify-end">
            <img
              src={mascotsCouch}
              alt="RentBasket mascots carrying a couch"
              className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[600px] h-auto mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FreeServices;
