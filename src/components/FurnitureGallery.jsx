import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductImage from "@/components/ui/ProductImage";

// Curated hero carousel — a fixed set of 8 real catalog products, pinned by their
// live amenity_type_id (the API is the source of truth, so the images, names and
// links stay in sync with the catalog instead of being hardcoded local assets).
// Order here is the order shown in the strip.
const FEATURED_PRODUCT_IDS = [
  "1054", // Premium Upholstered Queen Double Bed - Storage
  "36",   // Double Door Fridge
  "1036", // 6-Seater Sheesham Wood Dining Table (Cushioned)
  "13",   // Fully Automatic Washing Machine
  "41",   // Premium Revolving Chair
  "16",   // Microwave (Solo) 20 L
  "1041", // 7-Seater L-Shaped Sofa with Center Table & 2 Puffies - Green
  "15",   // Water Purifier
];

// Target number of cards in the strip — matches the curated list length.
const TARGET_CARD_COUNT = FEATURED_PRODUCT_IDS.length;

/** Square skeleton card shown per-slot while the catalog is loading. */
const GallerySkeleton = () => (
  <div className="flex gap-4 md:gap-6 overflow-hidden pb-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="shrink-0 w-[220px] md:w-[260px] aspect-square rounded-2xl bg-secondary animate-pulse shadow-elevated"
      />
    ))}
  </div>
);

const FurnitureGallery = () => {
  const { data: products = [], isLoading } = useProducts();
  const [autoScroll, setAutoScroll] = useState(true);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  // Resolve the curated list to real products, then make it fail-safe.
  //
  // Hardik's 8 pinned products are ALWAYS shown first, in order, whenever they
  // exist in the catalog. The fallback below is purely a safety net for DB drift
  // (a SKU retired, re-seeded, or renumbered): any pinned ID that's missing would
  // otherwise leave the strip short — or empty if a bulk re-seed wipes all 8. So
  // we backfill only the *missing* slots with trending products (skipping any
  // already shown) to keep the strip full at 8. In the normal case where all 8
  // exist, the backfill contributes nothing and you see exactly Hardik's list.
  const items = useMemo(() => {
    const byId = new Map(products.map((p) => [String(p.id), p]));

    // 1. The curated picks that actually exist right now, in Hardik's order.
    const curated = FEATURED_PRODUCT_IDS
      .map((id) => byId.get(id))
      .filter(Boolean);

    if (curated.length >= TARGET_CARD_COUNT) return curated;

    // 2. Backfill only the missing slots from trending products (the API's
    //    is_trending flag), excluding anything already in the strip.
    const shown = new Set(curated.map((p) => String(p.id)));
    const backfill = products.filter(
      (p) => p.is_trending && !shown.has(String(p.id))
    );

    // 3. Last-resort widen: if there still aren't enough trending products,
    //    fall back to any remaining catalog product so the strip never goes
    //    empty (API up but no trending items flagged).
    if (curated.length + backfill.length < TARGET_CARD_COUNT) {
      const backfillIds = new Set(backfill.map((p) => String(p.id)));
      const rest = products.filter(
        (p) => !shown.has(String(p.id)) && !backfillIds.has(String(p.id))
      );
      backfill.push(...rest);
    }

    return [...curated, ...backfill].slice(0, TARGET_CARD_COUNT);
  }, [products]);

  // A trailing clone of the first card lets the strip keep scrolling forward
  // past the "end" instead of jump-cutting backwards to restart. Once the
  // clone scrolls into view, we snap (no animation) back to the real first
  // card at scrollLeft 0 — same artwork in the same spot, so the reset is
  // invisible — giving the illusion of an infinite forward loop with only
  // one extra DOM node instead of duplicating the whole list.
  const loopItems = useMemo(
    () => (items.length > 0 ? [...items, items[0]] : items),
    [items]
  );

  // Tracks where the strip is heading rather than reading scrollLeft off the
  // DOM (which is unreliable mid-animation — smooth scrolls can take longer
  // than the tick interval, so the previous approach read stale positions
  // and drifted into a visible backward jump). targetRef is the single
  // source of truth for "where we last told the browser to scroll to."
  const targetRef = useRef(0);

  const scrollToNext = (c, step) => {
    const max = c.scrollWidth - c.clientWidth;
    const next = targetRef.current + step;
    if (next >= max - 4) {
      // Glide onto the cloned first card, then swap to the real card 0 at
      // the same visual position right as the animation finishes.
      targetRef.current = max;
      c.scrollTo({ left: max, behavior: "smooth" });
      setTimeout(() => {
        targetRef.current = 0;
        c.scrollTo({ left: 0, behavior: "auto" });
      }, 500);
    } else {
      targetRef.current = next;
      c.scrollTo({ left: next, behavior: "smooth" });
    }
  };

  // Auto-scroll horizontally; wraps forward through the trailing clone.
  useEffect(() => {
    if (!autoScroll || items.length === 0) return;
    const c = containerRef.current;
    if (c) targetRef.current = c.scrollLeft;
    intervalRef.current = setInterval(() => {
      const c = containerRef.current;
      if (!c) return;
      scrollToNext(c, 320);
    }, 3500);
    return () => clearInterval(intervalRef.current);
  }, [autoScroll, items.length]);

  const nudge = (dir) => {
    setAutoScroll(false);
    const c = containerRef.current;
    if (!c) return;
    const max = c.scrollWidth - c.clientWidth;
    if (dir > 0) {
      scrollToNext(c, 360);
    } else if (targetRef.current <= 4) {
      // Scrolling left from the very start wraps to the clone at the end,
      // then silently snaps to the real last card underneath it.
      targetRef.current = max;
      c.scrollTo({ left: max, behavior: "auto" });
    } else {
      const next = Math.max(0, targetRef.current - 360);
      targetRef.current = next;
      c.scrollTo({ left: next, behavior: "smooth" });
    }
    setTimeout(() => setAutoScroll(true), 8000);
  };

  return (
    <section className="bg-cream/40 pt-0 pb-8 md:pb-10 -mt-1">
      <div className="section-container">
        {/* Catalog scroll */}
        <div className="relative">
          {/* Right-edge fade to hint at more content */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 z-10 bg-gradient-to-l from-cream/60 to-transparent" />

          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <div
              ref={containerRef}
              className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {loopItems.map((item, i) => (
                <Link
                  to={`/product/${item.id}`}
                  key={i === loopItems.length - 1 ? `${item.id}-clone` : item.id}
                  className="group shrink-0 snap-start w-[220px] md:w-[260px] aspect-square rounded-2xl overflow-hidden shadow-elevated bg-white hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.18)] hover:-translate-y-1 transition-all duration-300"
                >
                  <ProductImage
                    src={item.images?.[0] || item.image}
                    alt={item.name}
                    className="h-full w-full object-contain block group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </Link>
              ))}
            </div>
          )}

          {/* Scroll nudge buttons (desktop) */}
          <button
            onClick={() => nudge(-1)}
            className="hidden md:flex absolute -left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => nudge(1)}
            className="hidden md:flex absolute -right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-11 h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FurnitureGallery;
