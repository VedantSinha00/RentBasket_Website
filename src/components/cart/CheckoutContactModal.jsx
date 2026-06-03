import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Phone } from "lucide-react";

const GURGAON_NUMBER = "9959858473";
const NOIDA_NUMBER = "9958004438";

const CheckoutContactModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-card w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-elevated overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all active:scale-95"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pt-8 pb-6 md:px-8 md:pt-10">
              {/* Header */}
              <div className="text-center mb-7 pr-6">
                <h3 className="font-display text-xl md:text-2xl font-bold leading-snug">
                  Our Consultants are{" "}
                  <span className="text-gradient-coral">happy to help you</span>
                </h3>
              </div>

              {/* Phone CTA buttons */}
              <div className="flex flex-col gap-3">
                <a
                  href={`tel:+91${GURGAON_NUMBER}`}
                  className="btn-gradient-coral flex flex-col items-center gap-1 py-3.5 px-3 text-center no-underline"
                >
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[13px] font-bold tracking-wide tabular-nums">
                      {GURGAON_NUMBER}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">
                    Gurgaon
                  </span>
                </a>
                <a
                  href={`tel:+91${NOIDA_NUMBER}`}
                  className="btn-gradient-coral flex flex-col items-center gap-1 py-3.5 px-3 text-center no-underline"
                >
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="text-[13px] font-bold tracking-wide tabular-nums">
                      {NOIDA_NUMBER}
                    </span>
                  </div>
                  <span className="text-[10px] font-semibold opacity-80 uppercase tracking-widest">
                    Noida
                  </span>
                </a>
              </div>
            </div>

            {/* Footer strip */}
            <div className="gradient-coral px-6 py-3 text-center">
              <p className="text-[11px] text-white/90 font-bold tracking-widest uppercase">
                ✦ Currently serving Gurgaon &amp; Noida
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CheckoutContactModal;
