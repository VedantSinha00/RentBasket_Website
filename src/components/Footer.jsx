import { MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import footerLogo from "@/assets/rentbasket-footer-logo.svg";

const Footer = () => {
  return (
    <footer className="bg-pine text-white overflow-hidden">
      <div className="section-container pt-16 pb-2 md:pt-24">
        {/* Brand */}
        <div className="mb-10 text-center">
          <h3 className="font-display font-bold text-lg mb-1">RentBasket</h3>
          <p className="text-sm text-mint leading-relaxed">
            Comfort for your home,<br />without the hassle of ownership.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 w-full">
          {/* Quick Links & Policies */}
          <div className="space-y-6">
            <div>
              <h4 className="font-display font-bold text-sm mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-mint">
                <li>
                  <Link
                    to="/catalog"
                    className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                  >
                    Browse Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/faqs"
                    className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms-n-conditions"
                    className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                  >
                    Terms &amp; Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/shipping-returns"
                    className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                  >
                    Shipping &amp; Returns
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-white hover:underline underline-offset-4 transition-colors duration-200 inline-block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-6 ml-auto w-fit">
            {/* Gurgaon */}
            <div>
              <h4 className="font-display font-bold text-sm mb-2">
                Gurgaon Office
              </h4>
              <div className="text-sm text-mint space-y-2">
                <Link
                  to="/contact"
                  className="flex items-start gap-2 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-left leading-snug">
                    C9/2, Lower Ground Floor,<br />
                    Ardee City, Sector 52,<br />
                    Gurugram, Haryana 122003
                  </span>
                </Link>
                <a
                  href="tel:+919959858473"
                  className="flex items-center gap-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 9959858473</span>
                </a>
              </div>
            </div>

            {/* Noida */}
            <div>
              <h4 className="font-display font-bold text-sm mb-2">Noida Office</h4>
              <div className="text-sm text-mint space-y-2">
                <Link
                  to="/contact"
                  className="flex items-start gap-2 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                >
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="text-left leading-snug">
                    Plot No B.L.K 15, Basement,<br />
                    Sector 116, Noida,<br />
                    UP 201301
                  </span>
                </Link>
                <a
                  href="tel:+919958004438"
                  className="flex items-center gap-2 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade focus-visible:ring-offset-2 focus-visible:ring-offset-pine rounded"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>+91 9958004438</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright — extra bottom clearance on mobile so the floating
            WhatsApp button never sits on top of this line */}
        <div className="flex flex-col items-center justify-center gap-2 mt-12 pt-8 pb-16 md:pb-0 border-t border-white/15">
          <p className="text-sm text-mint text-center">
            © 2023-2026 RentBasket, a brand of IG RentOK Private Limited. All rights reserved.
          </p>
        </div>

        {/* Signature wordmark — bleeds off the bottom edge, decorative only */}
        <div
          aria-hidden="true"
          className="mt-6 select-none pointer-events-none flex justify-center"
          style={{ userSelect: "none" }}
        >
          <img
            src={footerLogo}
            alt=""
            className="w-full max-w-4xl"
            style={{ transform: "translateY(25%)" }}
          />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
