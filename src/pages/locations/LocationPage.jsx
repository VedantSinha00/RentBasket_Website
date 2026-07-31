import { useParams, Link } from "react-router-dom";
import { MapPin, Phone, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import NotFound from "@/pages/NotFound";
import { locations } from "@/data/locations";

const LocationPage = () => {
  const { citySlug } = useParams();
  const location = locations.find((l) => l.slug === citySlug);

  if (!location) return <NotFound />;

  const { city, hasOffice, intro, popularRentals, areas, faqs } = location;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `RentBasket ${city}`,
    areaServed: city,
    address: { "@type": "PostalAddress", addressLocality: city, addressRegion: "Delhi NCR", addressCountry: "IN" },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Seo
        title={`Furniture & Appliances on Rent in ${city}`}
        description={`Rent furniture and appliances in ${city} with free delivery${hasOffice ? ", installation, and maintenance" : ""}. Sofas, beds, wardrobes, fridges, and washing machines available on flexible monthly plans.`}
        keywords={`furniture on rent ${city.toLowerCase()}, furniture rental ${city.toLowerCase()}, appliances on rent ${city.toLowerCase()}`}
        path={`/rent-in/${citySlug}/`}
        jsonLd={[jsonLd, faqJsonLd]}
      />
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
                Furniture &amp; Appliances on Rent in {city}
              </h1>
              <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-xl mx-auto">
                {intro}
              </p>
            </div>

            {/* Popular Rentals */}
            <section className="mb-14">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-4">
                Popular Rentals in {city}
              </h2>
              <div className="flex flex-wrap gap-3">
                {popularRentals.map((item) => (
                  <Link
                    key={item}
                    to={`/catalog?q=${encodeURIComponent(item)}`}
                    className="px-4 py-2 rounded-full bg-mint text-jade-ink text-sm font-sans font-bold hover:opacity-80 transition-opacity"
                  >
                    {item} on Rent
                  </Link>
                ))}
              </div>
            </section>

            {/* Why RentBasket */}
            <section className="mb-14 bg-cream rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-3">
                Why RentBasket in {city}
              </h2>
              <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed">
                {hasOffice
                  ? `With a local office in ${city}, we offer free delivery, free installation, and fast service response for every monthly rental.`
                  : `We serve ${city} from our nearby Gurgaon and Noida offices, with free delivery and installation on serviceable orders.`}
                {" "}Flexible 3/6/12-month plans, a refundable security deposit, and free relocation if you move within our service area.
              </p>
            </section>

            {/* Areas We Serve */}
            <section className="mb-14">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-4">
                Areas We Serve in {city}
              </h2>
              <div className="flex flex-wrap gap-2">
                {areas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs sm:text-sm font-sans text-ink-muted"
                  >
                    <MapPin className="w-3.5 h-3.5 text-jade-ink" />
                    {area}
                  </span>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="mb-16">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-4">
                {city} FAQs
              </h2>
              <div className="flex flex-col gap-3">
                {faqs.map(({ q, a }) => (
                  <div key={q} className="bg-cream rounded-2xl p-5">
                    <p className="font-sans font-semibold text-ink mb-1.5">{q}</p>
                    <p className="font-sans text-sm text-ink-muted leading-relaxed">{a}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Contact CTA */}
            <div className="bg-cream rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-semibold text-lg sm:text-xl text-ink">
                  Ready to set up your {city} home?
                </h3>
                <p className="text-sm text-ink-muted font-sans mt-1">
                  Share your pin code and we'll confirm what's available near you.
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <a href="tel:+919959858473" className="btn-outline-pine flex-1 md:flex-none whitespace-nowrap !h-11 !px-5 !py-0 text-sm">
                  <Phone className="w-4 h-4" />
                  Call Us
                </a>
                <a href="https://wa.me/919959858473" target="_blank" rel="noopener noreferrer" className="btn-pine flex-1 md:flex-none whitespace-nowrap !h-11 !px-5 !py-0 text-sm">
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default LocationPage;
