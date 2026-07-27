import { useEffect, useMemo, useRef, useState } from "react";
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

// Continuous auto-scroll speed, in px/second.
const AUTO_SPEED = 40;

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

const RentingCarousel = () => {
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

  const fewItems = !isLoading && items.length < 5;

  // True circular strip: the item list is rendered twice back-to-back and
  // moved with a CSS transform (not scrollLeft). Because both halves are
  // pixel-identical, the offset can be wrapped with a modulo the instant it
  // passes one set's width — there's no "end" to reach and no reset to
  // disguise, so the motion never has a seam to hide.
  const loopItems = useMemo(
    () => (!fewItems && items.length > 0 ? [...items, ...items] : items),
    [items, fewItems]
  );

  const [autoScroll, setAutoScroll] = useState(true);
  const trackRef = useRef(null);
  const rafRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

  // Current transform offset, in px. A ref (not state) because it updates
  // every animation frame — putting it in state would re-render constantly.
  const offsetRef = useRef(0);
  const setWidthRef = useRef(0);

  const applyOffset = () => {
    const track = trackRef.current;
    if (!track) return;
    track.style.transform = `translateX(-${offsetRef.current}px)`;
  };

  // Measures one copy of the list (gap-inclusive) so the wrap point is exact.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || fewItems || items.length === 0) return;
    const cards = track.children;
    if (cards.length < items.length * 2) return;
    const first = cards[0];
    const firstOfSecondSet = cards[items.length];
    setWidthRef.current = firstOfSecondSet.offsetLeft - first.offsetLeft;
  }, [items, loopItems, fewItems]);

  // Continuous rAF-driven scroll — no discrete jumps, so there's nothing to
  // visibly "snap." The offset wraps via modulo against one set's width,
  // which is invisible because both copies are identical.
  useEffect(() => {
    if (!autoScroll || fewItems || items.length === 0 || prefersReducedMotion) return;
    let last = performance.now();
    const tick = (now) => {
      const dt = now - last;
      last = now;
      const setWidth = setWidthRef.current;
      if (setWidth > 0) {
        offsetRef.current = (offsetRef.current + AUTO_SPEED * (dt / 1000)) % setWidth;
        applyOffset();
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoScroll, items.length, fewItems, prefersReducedMotion]);

  const nudge = (dir) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    const setWidth = setWidthRef.current;
    if (setWidth > 0) {
      const cardStep = setWidth / items.length;
      offsetRef.current =
        ((offsetRef.current + dir * cardStep) % setWidth + setWidth) % setWidth;
      applyOffset();
    }
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  // Manual drag/swipe: same offset + modulo wrap as the auto-loop and the
  // arrow buttons, so all three input methods move through the same
  // seamless circular track.
  const dragRef = useRef(null);

  const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  const onDragStart = (e) => {
    if (fewItems) return;
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    dragRef.current = { startX: pointerX(e), startOffset: offsetRef.current };
  };

  const onDragMove = (e) => {
    if (!dragRef.current) return;
    const setWidth = setWidthRef.current;
    if (setWidth <= 0) return;
    const delta = dragRef.current.startX - pointerX(e);
    offsetRef.current =
      ((dragRef.current.startOffset + delta) % setWidth + setWidth) % setWidth;
    applyOffset();
  };

  const onDragEnd = () => {
    if (!dragRef.current) return;
    dragRef.current = null;
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  // Data failure: hide the whole section rather than skeleton-forever.
  if (!isLoading && (isError || items.length === 0)) return null;

  return (
    <section className="bg-mint-pale">
      <Wave color="text-white" />
      <div className="section-container py-12 md:py-16">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <h2 className="font-display font-semibold text-ink tracking-tight text-center mb-2 md:mb-10"
              style={{ fontSize: "clamp(1.875rem, 3.5vw, 2.75rem)", lineHeight: 1.1, letterSpacing: "-0.01em" }}>
            <span className="md:hidden">What people are renting</span>
            <span className="hidden md:inline">What people are renting in Gurgaon &amp; Noida</span>
          </h2>
          <p className="md:hidden text-center text-ink-muted font-sans text-sm mb-8">
            in Gurgaon &amp; Noida
          </p>

          {isLoading ? (
            <CardSkeleton />
          ) : (
            <div className="relative">
              <div
                className={`overflow-hidden pb-4 ${fewItems ? "flex justify-center" : ""}`}
              >
                <div
                  ref={trackRef}
                  className={`flex gap-4 md:gap-6 will-change-transform ${fewItems ? "flex-wrap justify-center" : "w-max"}`}
                  onTouchStart={onDragStart}
                  onTouchMove={onDragMove}
                  onTouchEnd={onDragEnd}
                  onMouseDown={onDragStart}
                  onMouseMove={onDragMove}
                  onMouseUp={onDragEnd}
                  onMouseLeave={onDragEnd}
                >
                  {loopItems.map((item, i) => {
                    const startingPrice = getStartingPrice(item);
                    return (
                      <Link
                        to={`/product/${item.id}`}
                        key={i < items.length ? item.id : `${item.id}-dup`}
                        draggable={false}
                        className="group shrink-0 w-[260px] flex flex-col bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        <div className={`h-[260px] w-full flex items-center justify-center p-6 overflow-hidden shrink-0 ${TINTS[i % TINTS.length]}`}>
                          <ProductImage
                            src={item.images?.[0] || item.image}
                            alt={item.name}
                            draggable={false}
                            className="h-full w-full object-contain block group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
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
                    onClick={() => nudge(-1)}
                    className="hidden md:flex absolute -left-5 lg:-left-6 top-[112px] -translate-y-1/2 bg-white w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Previous products"
                  >
                    <ChevronLeft className="w-5 h-5 text-jade-ink" />
                  </button>
                  <button
                    onClick={() => nudge(1)}
                    className="hidden md:flex absolute -right-5 lg:-right-6 top-[112px] -translate-y-1/2 bg-white w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
