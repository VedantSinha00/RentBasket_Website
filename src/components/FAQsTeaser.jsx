import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import Wave from "@/components/Wave";

// Top questions pulled from the real FAQs page content (src/pages/FAQs.jsx) —
// not placeholder copy. Kept to 5 per spec §5.8.
const faqs = [
  {
    q: "How does the rental booking process work?",
    a: "Browse our catalogue, select your desired products and rental duration, and add them to your basket. When you click checkout, fill in your address and delivery details. You pay 50% upfront to confirm the booking, and the remaining 50% upon delivery.",
  },
  {
    q: "How is the security deposit calculated and refunded?",
    a: "The refundable security deposit is calculated as a multiple of the product's monthly list rent (typically 2x). It is 100% interest-free and refundable, processed to your bank account within 7–10 working days of return.",
  },
  {
    q: "Are delivery, installation, and setup free?",
    a: "Yes! Delivery, professional installation, and demo are entirely free for all monthly rentals in our serviceable zones across Gurgaon and Noida (Delhi NCR).",
  },
  {
    q: "Is maintenance and repair service free?",
    a: "Yes, all manufacturing defects and functional issues are fully covered. Simply contact our support, and we will send a technician to repair or replace the item at no cost.",
  },
  {
    q: "Can I relocate my rented items if I move?",
    a: "Yes! If you are relocating within our serviceable areas in Gurgaon or Noida, RentBasket offers a one-time free relocation service.",
  },
];

const FAQsTeaser = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="bg-cream">
      <Wave color="text-white" />
      <div className="section-container py-12 md:py-16">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2
            className="font-display font-semibold text-ink tracking-tight text-center mb-8 md:mb-10 text-balance"
            style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.01em" }}
          >
            Questions people actually ask
          </h2>

          <Accordion.Root type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="bg-white rounded-2xl overflow-hidden shadow-soft"
              >
                <Accordion.Header>
                  <Accordion.Trigger className="group w-full flex items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl">
                    <span className="font-sans font-semibold text-ink text-base">
                      {faq.q}
                    </span>
                    <ChevronDown className="w-5 h-5 text-jade-ink shrink-0 transition-transform duration-300 group-data-[state=open]:rotate-180" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                  <p className="px-6 pb-5 font-sans text-sm text-ink-muted leading-relaxed border-t border-border pt-4">
                    {faq.a}
                  </p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>

          <div className="text-center mt-8">
            <Link
              to="/faqs"
              className="font-sans font-semibold text-sm text-jade-ink hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              All questions →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQsTeaser;
