import { useState } from "react";
import { ChevronDown, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { faqs } from "@/data/faqs";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background">
      <Seo
        title="Furniture & Appliance Rental FAQs"
        description="Answers to common questions about renting furniture and appliances from RentBasket in Delhi NCR — deposits, KYC, delivery, maintenance, relocation, and payments."
        keywords="furniture rental faq, appliance rental faq, rentbasket faq, furniture on rent questions delhi ncr"
        path="/faqs/"
        jsonLd={faqJsonLd}
      />
      <Header />
      <main className="section-container py-12 md:py-20 max-w-3xl">
        <div className="text-center mb-12">
          <h1 className="font-display font-bold text-3xl md:text-5xl text-ink leading-tight">
            Questions people actually ask
          </h1>
        </div>

        <div className="bg-cream rounded-3xl p-4 sm:p-6">
          <div className="flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-soft transition-all"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="group w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl"
                  >
                    <span className="font-sans font-semibold text-ink text-base leading-snug pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-jade-ink shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen &&
                      (prefersReducedMotion ? (
                        <div className="overflow-hidden">
                          <p className="px-6 pb-5 font-sans text-sm text-ink-muted leading-relaxed border-t border-border pt-4">
                            {faq.a}
                          </p>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="px-6 pb-5 font-sans text-sm text-ink-muted leading-relaxed border-t border-border pt-4">
                            {faq.a}
                          </p>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact CTA card */}
        <div className="mt-16 bg-cream rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-semibold text-lg sm:text-xl text-ink">
              Still have questions?
            </h3>
            <p className="text-sm text-ink-muted font-sans mt-1">
              Our team is ready to assist you with custom requirements or support queries.
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <a
              href="tel:+919959858473"
              className="btn-outline-pine flex-1 md:flex-none whitespace-nowrap !h-11 !px-5 !py-0 text-sm"
            >
              <Phone className="w-4 h-4" />
              Call Gurgaon
            </a>
            <a
              href="https://wa.me/919959858473"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pine flex-1 md:flex-none whitespace-nowrap !h-11 !px-5 !py-0 text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FAQs;
