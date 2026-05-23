import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import mascotsCouch from "@/assets/ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const FreeServices = () => {
  return (
    <section className="bg-background pt-10 md:pt-14 pb-4 md:pb-6">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
          {/* Left: Free + list + CTAs */}
          <motion.div
            className="flex flex-col items-center lg:items-start"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {/* Free + bullets */}
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="font-display font-medium leading-none text-gradient-coral text-[64px] sm:text-[80px] md:text-[96px]">
                Free
              </span>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground font-sans font-semibold text-[20px] sm:text-[24px] md:text-[28px] tracking-tight">
                <li>Delivery</li>
                <li>Installation</li>
                <li>Maintenance</li>
              </ul>
            </div>

            {/* CTA */}
            <div className="flex flex-col gap-5 mt-10 md:mt-12 w-full max-w-[400px]">
              <Link
                to="/catalog"
                className="flex items-center justify-center h-[64px] rounded-full border-[3px] border-primary text-primary font-sans font-bold text-[18px] sm:text-[20px] tracking-tight bg-white hover:bg-primary/5 transition-colors shadow-soft active:scale-[0.98]"
              >
                Browse Catalogue
              </Link>
            </div>
          </motion.div>

          {/* Right: Mascots carrying couch */}
          <motion.div
            className="flex justify-center lg:justify-end"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.1 }}
          >
            <img
              src={mascotsCouch}
              alt="RentBasket mascots carrying a couch"
              className="w-full max-w-[420px] sm:max-w-[520px] md:max-w-[600px] h-auto mix-blend-multiply"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreeServices;
