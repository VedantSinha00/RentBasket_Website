import { useParams, Link } from "react-router-dom";
import { Phone, MessageSquare } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import NotFound from "@/pages/NotFound";
import { productCategories } from "@/data/productCategories";

const ProductCategoryPage = () => {
  const { categorySlug } = useParams();
  const category = productCategories.find((c) => c.slug === categorySlug);

  if (!category) return <NotFound />;

  const { name, intro, keywords } = category;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${name} on Rent`,
    description: intro,
    offers: { "@type": "AggregateOffer", areaServed: "Delhi NCR", priceCurrency: "INR" },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between">
      <Seo
        title={`${name} on Rent in Delhi NCR`}
        description={`${intro} Free delivery, installation, and maintenance across Gurgaon and Noida.`}
        keywords={keywords.join(", ")}
        path={`/rent/${categorySlug}/`}
        jsonLd={jsonLd}
      />
      <div>
        <Header />
        <main className="w-full bg-white py-12 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground mb-3">
                {name} on Rent in Delhi NCR
              </h1>
              <p className="text-muted-foreground font-sans text-sm sm:text-base max-w-xl mx-auto">
                {intro}
              </p>
            </div>

            <div className="flex justify-center mb-14">
              <Link
                to={`/catalog?q=${encodeURIComponent(name)}`}
                className="btn-pine !h-11 !px-6 !py-0 text-sm"
              >
                Browse {name} Options
              </Link>
            </div>

            <section className="mb-14 bg-cream rounded-3xl p-6 sm:p-8">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-3">
                Why Rent a {name} from RentBasket
              </h2>
              <p className="font-sans text-sm sm:text-base text-ink-muted leading-relaxed">
                Every {name.toLowerCase()} rental includes free delivery, free installation, and free maintenance
                for the length of your plan. Choose 3, 6, or 12-month terms, pay a refundable security deposit,
                and swap or return the item when your needs change.
              </p>
            </section>

            <section className="mb-16">
              <h2 className="font-display font-semibold text-xl sm:text-2xl text-ink mb-4">
                Also Searched As
              </h2>
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-3 py-1.5 rounded-full border border-border text-xs sm:text-sm font-sans text-ink-muted"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </section>

            <div className="bg-cream rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-display font-semibold text-lg sm:text-xl text-ink">
                  Ready to rent a {name.toLowerCase()}?
                </h3>
                <p className="text-sm text-ink-muted font-sans mt-1">
                  Talk to us for availability, pricing, and delivery timelines.
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

export default ProductCategoryPage;
