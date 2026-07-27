import { MapPin, Phone, Mail, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-12 md:py-20 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-4xl text-ink">
            Contact &amp; Locations
          </h1>
          <p className="text-ink-muted mt-2 font-sans max-w-lg mx-auto">
            Find our offices in Gurgaon &amp; Noida, or reach out to our team instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Gurgaon Office */}
          <div className="bg-mint-pale rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft">
            <h2 className="font-display font-semibold text-xl text-ink flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-mint text-jade-ink flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              Gurgaon Office
            </h2>
            <div className="space-y-3 font-sans text-ink-muted text-sm sm:text-base">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-jade-ink mt-0.5 shrink-0" />
                <span>
                  C9/2, Lower Ground Floor,<br />
                  Ardee City, Sector 52,<br />
                  Gurugram, Haryana 122003
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-jade-ink shrink-0" />
                <a href="tel:+919959858473" className="hover:text-ink transition-colors">
                  +91 99598 58473
                </a>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=C9/2,+Lower+Ground+Floor,+Ardee+City,+Sector+52,+Gurugram,+Haryana+122003"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 px-4 rounded-full border border-pine text-pine font-sans font-bold text-xs hover:bg-pine hover:text-white transition-colors items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View on Google Maps
              </a>
            </div>
          </div>

          {/* Noida Office */}
          <div className="bg-sky rounded-3xl p-6 sm:p-8 space-y-4 shadow-soft">
            <h2 className="font-display font-semibold text-xl text-ink flex items-center gap-2">
              <span className="w-9 h-9 rounded-lg bg-mint text-jade-ink flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </span>
              Noida Office
            </h2>
            <div className="space-y-3 font-sans text-ink-muted text-sm sm:text-base">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-5 h-5 text-jade-ink mt-0.5 shrink-0" />
                <span>
                  Plot No B.L.K 15, Basement,<br />
                  Sector 116, Noida,<br />
                  UP 201301
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-5 h-5 text-jade-ink shrink-0" />
                <a href="tel:+919958004438" className="hover:text-ink transition-colors">
                  +91 99580 04438
                </a>
              </div>
            </div>
            <div className="pt-2">
              <a
                href="https://maps.google.com/?q=Plot+No+B.L.K+15,+Basement,+Sector+116,+Noida,+UP+201301"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 px-4 rounded-full border border-pine text-pine font-sans font-bold text-xs hover:bg-pine hover:text-white transition-colors items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Support details */}
        <div className="bg-cream rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-soft">
          <h2 className="font-display font-semibold text-xl text-ink">
            Customer Support Channels
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm sm:text-base text-ink-muted font-sans">
            <a
              href="mailto:support@rentbasket.com"
              className="flex items-center gap-2 hover:text-ink transition-colors"
            >
              <Mail className="w-5 h-5 text-jade-ink" />
              support@rentbasket.com
            </a>
            <span className="hidden sm:inline text-border">|</span>
            <a
              href="https://wa.me/919959858473"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-ink transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-jade-ink" />
              WhatsApp Support (+91 99598 58473)
            </a>
          </div>
          <div className="pt-2">
            <a
              href="https://wa.me/919959858473"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pine inline-flex items-center justify-center gap-2 h-11 px-6"
            >
              <MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
