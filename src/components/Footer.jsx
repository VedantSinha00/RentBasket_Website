import { MapPin, Phone } from "lucide-react";
import logo from "@/assets/7 1.png";

const Footer = () => {
  return (
    <footer className="bg-background border-none">
      {/* Wave decoration */}
      <div className="h-24 bg-gradient-to-b from-secondary to-transparent"></div>

      <div className="section-container py-12">
        {/* Brand */}
        <div className="gap-2 pl-12 lg:pl-28 mb-6">
          <h3 className="font-bold text-lg mb-2 font-sans">RentBasket</h3>
          <p className="text-sm text-muted-foreground pb-2 font-sans">
            Comfort for your home
          </p>
          <p className="text-sm text-muted-foreground pb-2 font-sans">
            without the hassle of ownership.
          </p>
        </div>
        <div
          className="grid grid-cols-2 gap-3"
          style={{
            width: "90%",
            margin: "auto",
            paddingLeft: "5%",
          }}
        >
          <div className="space-y-6">
            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-sm mb-4 font-sans">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Browse Products
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    Combo Deals
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-primary transition-colors font-sans"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-6">
            {/* Gurgaon */}
            <div>
              <h4 className="font-bold text-sm mb-2 font-sans">
                Gurgaon Office
              </h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 font-sans" />
                  Sector 52, Ardee City
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 font-sans" />
                  +91 9958858473
                </p>
              </div>
            </div>

            {/* Noida */}
            <div>
              <h4 className="font-bold text-sm mb-2 font-sans">Noida Office</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 font-sans" />
                  Sector 116
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 font-sans" />
                  +91 9958004438
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Icons & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center sm:text-left font-sans order-2 sm:order-1">
            © 2025 RentBasket. All rights reserved.
          </p>
          <div className="order-1 sm:order-2 shrink-0">
            <img
              src={logo}
              alt="RentBasket mascot"
              className="w-16 h-16 md:w-20 md:h-20 object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
