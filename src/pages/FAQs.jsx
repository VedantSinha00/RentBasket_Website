import { useState } from "react";
import { ChevronDown, Phone, MessageSquare } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const faqs = [
  {
    q: "How does the rental booking process work?",
    a: "Booking with RentBasket is simple. Browse our catalogue, select your desired products and rental duration, and add them to your basket. When you click checkout, fill in your address and delivery details. Since this is V1, you will be redirected to WhatsApp with your itemized quote to confirm the details. You pay 50% upfront to confirm the booking, and the remaining 50% upon delivery."
  },
  {
    q: "What KYC verification is required before delivery?",
    a: "To ensure safety and secure transactions, we require: (1) A valid Government Photo ID (Aadhaar Card, PAN Card, or Passport) and (2) Address proof of your new residence (registered Rent Agreement, Utility Bill, or Company Joining/Relocation Letter). Our verification team will review these before dispatching your products."
  },
  {
    q: "How is the security deposit calculated and refunded?",
    a: "The refundable security deposit is calculated as a multiple of the product's monthly list rent (typically 2x). It is 100% interest-free and refundable. Once your rental duration ends and the items are picked up, our QA team will inspect the assets. The refund is processed directly to your bank account within 7–10 working days of return."
  },
  {
    q: "Are delivery, installation, and setup free?",
    a: "Yes! Delivery, professional installation, and demo are entirely free for all monthly rentals in our serviceable zones across Gurgaon and Noida (Delhi NCR). Our expert technicians handle the entire heavy lifting and setup."
  },
  {
    q: "What is your policy on damages and normal wear-and-tear?",
    a: "We expect normal wear-and-tear from daily use, such as minor scuffs on wood or slight fabric wear, which incur absolutely zero charges. However, major structural damages, deep burns, severe water damage from negligence, or missing parts are charged. Repair costs will be deducted from your security deposit."
  },
  {
    q: "Is maintenance and repair service free?",
    a: "Yes, all manufacturing defects and functional issues (such as an AC not cooling or a washing machine error code) are fully covered. Simply contact our support, and we will send a technician to repair or replace the item at no cost."
  },
  {
    q: "Can I relocate my rented items if I move?",
    a: "Yes! If you are relocating within our serviceable areas in Gurgaon or Noida, RentBasket offers a one-time free relocation service. Our team will safely uninstall, transport, and reinstall your rented items at your new address."
  },
  {
    q: "What is the minimum lock-in period, and can I cancel early?",
    a: "Our minimum rental lock-in period is 3 months. If you wish to cancel and return your items before the end of your selected tenure or before the 3-month mark, a foreclosure fee will be charged based on the standard non-discounted rates or the remaining lock-in period."
  }
];

const FAQs = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-background">
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
