import { useCallback, useEffect, useState, useMemo } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import ProductImage from "@/components/ui/ProductImage";
import { discountedRent } from "@/lib/pricing";
import Wave from "@/components/Wave";

// Same curated picks as the legacy FurnitureGallery strip, resolved against
// the live catalog so images/names/links stay in sync with real data.
const FEATURED_PRODUCT_IDS = [
  "1054", "36", "1036", "13", "41", "16", "1041", "15",
];

const TINTS = ["bg-sky", "bg-sand", "bg-mint-pale", "bg-blush"];

const getStartingPrice = (product) => {
  const pricing = product.pricing_by_duration ?? {};
  const prices = Object.values(pricing)
    .filter((v) => (v ?? 0) > 0)
    .map((v) => discountedRent(v, product.percent_discount));
  return prices.length ? Math.min(...prices) : null;
};

const CardSkeleton = () => (
  <div className="flex gap-4 md:gap-6 overflow-hidden">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="shrink-0 w-[260px] h-[340px] rounded-2xl bg-white/60 animate-pulse"
      />
    ))}
  </div>
);

const RentingCarousel = ({ innerRef }) => {
  const { data: products = [], isLoading, isError } = useProducts();
  const prefersReducedMotion = useReducedMotion();

  const items = useMemo(() => {
    // Out-of-stock guard: never show an item the cart would reject.
    const inStock = products.filter((p) => p.stock_status !== "out_of_stock");
    const byId = new Map(inStock.map((p) => [String(p.id), p]));

    const curated = FEATURED_PRODUCT_IDS.map((id) => byId.get(id)).filter(Boolean);
    if (curated.length >= 6) return curated.slice(0, 10);

    const shown = new Set(curated.map((p) => String(p.id)));
    const backfill = inStock.filter((p) => p.is_trending && !shown.has(String(p.id)));
    return [...curated, ...backfill].slice(0, 10);
  }, [products]);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback((api) => {
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Data failure: hide the whole section rather than skeleton-forever.
  if (!isLoading && (isError || items.length === 0)) return null;

  const fewItems = !isLoading && items.length < 5;

  return (
    <section ref={innerRef} className="bg-mint-pale">
      <Wave color="text-white" />
      <div className="section-container py-12 md:py-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-display font-semibold text-ink tracking-tight text-center mb-8 md:mb-10"
              style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            What people are renting in Gurgaon &amp; Noida
          </h2>

          {isLoading ? (
            <CardSkeleton />
          ) : (
            <div className="relative">
              <div
                className={`overflow-hidden ${fewItems ? "flex justify-center" : ""}`}
                ref={fewItems ? null : emblaRef}
              >
                <div className={`flex gap-4 md:gap-6 ${fewItems ? "flex-wrap justify-center" : ""}`}>
                  {items.map((item, i) => {
                    const startingPrice = getStartingPrice(item);
                    return (
                      <Link
                        to={`/product/${item.id}`}
                        key={item.id}
                        className="group shrink-0 w-[260px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <div className={`h-[260px] w-full flex items-center justify-center p-6 overflow-hidden shrink-0 ${TINTS[i % TINTS.length]}`}>
                          <ProductImage
                            src={item.images?.[0] || item.image}
                            alt={item.name}
                            className="h-full w-full object-contain block group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <div className="p-4 flex flex-col gap-1 text-left">
                          <h3 className="font-display font-semibold text-ink text-base truncate leading-snug">
                            {item.name}
                          </h3>
                          {startingPrice != null && (
                            <span className="font-sans font-semibold text-jade-ink text-sm mt-0.5 leading-none">
                              ₹{startingPrice.toLocaleString("en-IN")}/mo
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {!fewItems && (
                <>
                  <button
                    onClick={() => emblaApi?.scrollPrev()}
                    disabled={!canPrev}
                    className="hidden md:flex absolute -left-5 lg:-left-6 top-[112px] -translate-y-1/2 bg-white w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Previous products"
                  >
                    <ChevronLeft className="w-5 h-5 text-jade-ink" />
                  </button>
                  <button
                    onClick={() => emblaApi?.scrollNext()}
                    disabled={!canNext}
                    className="hidden md:flex absolute -right-5 lg:-right-6 top-[112px] -translate-y-1/2 bg-white w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Next products"
                  >
                    <ChevronRight className="w-5 h-5 text-jade-ink" />
                  </button>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default RentingCarousel;
