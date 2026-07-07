import { motion } from "framer-motion";
import mascotsCouch from "@/assets/ChatGPT Image Jan 17, 2026, 02_58_19 AM 1.png";

const SplashScreen = () => (
  <motion.div
    className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-background"
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5, ease: "easeInOut" }}
  >
    {/* Placeholder content — swap for real branding/animation later */}
    <img
      src={mascotsCouch}
      alt="RentBasket mascots carrying a couch"
      className="w-72 sm:w-96 md:w-[32rem] mix-blend-multiply -translate-x-[3%]"
    />
    <span className="font-display text-2xl font-bold text-foreground">
      Rent<span className="text-primary">Basket</span>
    </span>
  </motion.div>
);

export default SplashScreen;
