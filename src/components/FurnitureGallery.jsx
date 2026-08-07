import { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import ProductImage from "@/components/ui/ProductImage";
import { discountedRent } from "@/lib/pricing";

// Cheapest post-discount monthly rent across a product's available durations.
// Mirrors ProductCard's pricing (pricing_by_duration + percent_discount).
// Returns null if the product has no priced duration.
const getStartingPrice = (product) => {
  const pricing = product.pricing_by_duration ?? {};
  const prices = Object.values(pricing)
    .filter((v) => (v ?? 0) > 0)
    .map((v) => discountedRent(v, product.percent_discount));
  return prices.length ? Math.min(...prices) : null;
};

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
        className="shrink-0 w-[210px] md:w-[250px] h-[300px] md:h-[350px] rounded-2xl bg-secondary animate-pulse shadow-soft"
      />
    ))}
  </div>
);

// Continuous auto-scroll speed, in px/second.
const AUTO_SPEED = 20;

const FurnitureGallery = () => {
  const { data: products = [], isLoading } = useProducts();
  const [autoScroll, setAutoScroll] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [randomProducts, setRandomProducts] = useState([]);
  const trackRef = useRef(null);
  const row1TrackRef = useRef(null);
  const row2TrackRef = useRef(null);
  const row1OffsetRef = useRef(0);
  const row2OffsetRef = useRef(0);
  const row1SetWidthRef = useRef(0);
  const row2SetWidthRef = useRef(0);
  const row1DragRef = useRef(null);
  const row2DragRef = useRef(null);
  const rafRef = useRef(null);
  const resumeTimeoutRef = useRef(null);

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

  // Select 16 random products once on page load (excluding those in the horizontal marquee)
  useEffect(() => {
    if (products.length > 0 && items.length > 0 && randomProducts.length === 0) {
      const shownIds = new Set(items.map((p) => String(p.id)));
      const candidates = products.filter(
        (p) => !shownIds.has(String(p.id)) && p.stock_status === "in_stock"
      );
      // Shuffle candidates and pick 16
      const shuffled = [...candidates].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 16));
    }
  }, [products, items, randomProducts.length]);

  // Measure the width of one loop copy for Row 2 and Row 3
  useEffect(() => {
    if (!isExpanded || randomProducts.length < 16) return;

    const measureRow = (trackRef, setWidthRef) => {
      const track = trackRef.current;
      if (!track) return;
      const cards = track.children;
      if (cards.length < 16) return;
      const first = cards[0];
      const firstOfSecondSet = cards[8]; // start of second copy
      setWidthRef.current = firstOfSecondSet.offsetLeft - first.offsetLeft;
    };

    // Measure after rendering settles
    const timer = setTimeout(() => {
      measureRow(row1TrackRef, row1SetWidthRef);
      measureRow(row2TrackRef, row2SetWidthRef);
    }, 200);

    return () => clearTimeout(timer);
  }, [isExpanded, randomProducts]);

  // True circular strip: the item list is rendered twice back-to-back and
  // moved with a CSS transform (not scrollLeft). Because both halves are
  // pixel-identical, the offset can be wrapped with a modulo the instant it
  // passes one set's width — there's no "end" to reach and no reset to
  // disguise, so the motion never has a seam to hide. This still renders a
  // finite, fixed number of nodes (2x the list) rather than an unbounded/
  // infinitely-growing DOM.
  const loopItems = useMemo(
    () => (items.length > 0 ? [...items, ...items] : items),
    [items]
  );

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
    if (!track || items.length === 0) return;
    const cards = track.children;
    if (cards.length < items.length * 2) return;
    const first = cards[0];
    const firstOfSecondSet = cards[items.length];
    setWidthRef.current = firstOfSecondSet.offsetLeft - first.offsetLeft;
  }, [items, loopItems]);

  // Continuous rAF-driven scroll for all three carousels
  useEffect(() => {
    if (!autoScroll || items.length === 0) return;
    let last = performance.now();

    const tick = (now) => {
      const dt = now - last;
      last = now;
      const delta = AUTO_SPEED * (dt / 1000);

      // 1. Main Track (Row 1 of page - right-to-left)
      const mainWidth = setWidthRef.current;
      if (mainWidth > 0 && trackRef.current) {
        offsetRef.current = (offsetRef.current + delta) % mainWidth;
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      // 2. Expanded Row 1 (Row 2 of page - left-to-right)
      if (isExpanded && randomProducts.length >= 16) {
        const row1Width = row1SetWidthRef.current;
        if (row1Width > 0 && row1TrackRef.current) {
          row1OffsetRef.current = (row1OffsetRef.current - delta + row1Width) % row1Width;
          row1TrackRef.current.style.transform = `translateX(-${row1OffsetRef.current}px)`;
        }

        // 3. Expanded Row 2 (Row 3 of page - right-to-left)
        const row2Width = row2SetWidthRef.current;
        if (row2Width > 0 && row2TrackRef.current) {
          row2OffsetRef.current = (row2OffsetRef.current + delta) % row2Width;
          row2TrackRef.current.style.transform = `translateX(-${row2OffsetRef.current}px)`;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [autoScroll, items.length, isExpanded, randomProducts.length]);

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

  const nudgeRow1 = (dir) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    const setWidth = row1SetWidthRef.current;
    if (setWidth > 0) {
      const cardStep = setWidth / 8;
      // Row 2 is left-to-right (opposite direction), so we subtract dir
      row1OffsetRef.current =
        ((row1OffsetRef.current - dir * cardStep) % setWidth + setWidth) % setWidth;
      row1TrackRef.current.style.transform = `translateX(-${row1OffsetRef.current}px)`;
    }
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  const nudgeRow2 = (dir) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    const setWidth = row2SetWidthRef.current;
    if (setWidth > 0) {
      const cardStep = setWidth / 8;
      // Row 3 is right-to-left (standard direction), so we add dir
      row2OffsetRef.current =
        ((row2OffsetRef.current + dir * cardStep) % setWidth + setWidth) % setWidth;
      row2TrackRef.current.style.transform = `translateX(-${row2OffsetRef.current}px)`;
    }
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  // Manual drag/swipe: same offset + modulo wrap as the auto-loop and the
  // arrow buttons, so all three input methods move through the same
  // seamless circular track.
  const dragRef = useRef(null);

  const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

  // Main row drag handlers
  const onDragStart = (e) => {
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

  // Row 2 Drag Handlers (Left-to-Right)
  const onRow1DragStart = (e) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    row1DragRef.current = { startX: pointerX(e), startOffset: row1OffsetRef.current };
  };

  const onRow1DragMove = (e) => {
    if (!row1DragRef.current) return;
    const setWidth = row1SetWidthRef.current;
    if (setWidth <= 0) return;
    const delta = row1DragRef.current.startX - pointerX(e);
    row1OffsetRef.current =
      ((row1DragRef.current.startOffset + delta) % setWidth + setWidth) % setWidth;
    row1TrackRef.current.style.transform = `translateX(-${row1OffsetRef.current}px)`;
  };

  const onRow1DragEnd = () => {
    if (!row1DragRef.current) return;
    row1DragRef.current = null;
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  // Row 3 Drag Handlers (Right-to-Left)
  const onRow2DragStart = (e) => {
    setAutoScroll(false);
    clearTimeout(resumeTimeoutRef.current);
    row2DragRef.current = { startX: pointerX(e), startOffset: row2OffsetRef.current };
  };

  const onRow2DragMove = (e) => {
    if (!row2DragRef.current) return;
    const setWidth = row2SetWidthRef.current;
    if (setWidth <= 0) return;
    const delta = row2DragRef.current.startX - pointerX(e);
    row2OffsetRef.current =
      ((row2DragRef.current.startOffset + delta) % setWidth + setWidth) % setWidth;
    row2TrackRef.current.style.transform = `translateX(-${row2OffsetRef.current}px)`;
  };

  const onRow2DragEnd = () => {
    if (!row2DragRef.current) return;
    row2DragRef.current = null;
    resumeTimeoutRef.current = setTimeout(() => setAutoScroll(true), 2000);
  };

  return (
    <section className="bg-cream/40 pt-0 pb-4 md:pb-10 -mt-1">
      <div className="section-container">
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-foreground tracking-tight mb-4 md:mb-6 text-center md:text-left">
          What people are renting in <span className="whitespace-nowrap">Gurgaon &amp; Noida</span>
        </h2>
        {/* Catalog scroll */}
        <div className="relative">
          {/* Right-edge fade to hint at more content */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 z-10 bg-gradient-to-l from-cream/60 to-transparent" />

          {isLoading ? (
            <GallerySkeleton />
          ) : (
            <div className="overflow-hidden pb-4">
              <div
                ref={trackRef}
                className="flex gap-4 md:gap-6 w-max will-change-transform"
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
                      className="group shrink-0 w-[210px] md:w-[250px] flex flex-col bg-white border border-border/40 rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                    >
                      {/* Product image */}
                      <div className="h-[220px] md:h-[260px] w-full bg-muted/5 flex items-center justify-center p-3 border-b border-border/20 overflow-hidden shrink-0">
                        <ProductImage
                          src={item.images?.[0] || item.image}
                          alt={item.name}
                          draggable={false}
                          className="h-full w-full object-contain block group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
                        />
                      </div>

                      {/* Product info */}
                      <div className="p-4 flex flex-col gap-1 text-left">
                        <h3 className="font-display font-semibold text-foreground text-sm truncate leading-snug">
                          {item.name}
                        </h3>
                        {startingPrice != null && (
                          <span className="font-sans font-bold text-primary text-xs mt-1 leading-none">
                            From ₹{startingPrice.toLocaleString("en-IN")}/mo
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Scroll nudge buttons */}
          <button
            onClick={() => nudge(-1)}
            className="flex absolute -left-2 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-9 h-9 md:w-11 md:h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </button>
          <button
            onClick={() => nudge(1)}
            className="flex absolute -right-2 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-9 h-9 md:w-11 md:h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
          </button>
        </div>

        {/* Toggle Button */}
        {randomProducts.length > 0 && !isExpanded && (
          <div className="mt-2 text-center">
            <button
              onClick={() => setIsExpanded(true)}
              className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 mx-auto group py-1.5 px-3 rounded-md hover:bg-muted/10"
            >
              <span>Explore More Products</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Expanded Random Products Carousel (2 Rows) */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 overflow-hidden"
            >
              <div className="flex flex-col gap-6 pt-3 mt-1">
                {/* Row 1 Wrapper */}
                <div className="relative group/row-1">
                  {/* Left fade */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-r from-cream/60 to-transparent" />
                  {/* Right fade */}
                  <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 z-10 bg-gradient-to-l from-cream/60 to-transparent" />

                  {/* Track Container */}
                  <div className="overflow-hidden pb-4 px-2 md:px-4">
                    <div
                      ref={row1TrackRef}
                      className="flex gap-4 md:gap-6 w-max will-change-transform"
                      onTouchStart={onRow1DragStart}
                      onTouchMove={onRow1DragMove}
                      onTouchEnd={onRow1DragEnd}
                      onMouseDown={onRow1DragStart}
                      onMouseMove={onRow1DragMove}
                      onMouseUp={onRow1DragEnd}
                      onMouseLeave={onRow1DragEnd}
                    >
                      {[...randomProducts.slice(0, 8), ...randomProducts.slice(0, 8)].map((item, i) => {
                        const startingPrice = getStartingPrice(item);
                        return (
                          <Link
                            to={`/product/${item.id}`}
                            key={i}
                            draggable={false}
                            className="group shrink-0 w-[210px] md:w-[250px] flex flex-col bg-white border border-border/40 rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                          >
                            {/* Product image */}
                            <div className="h-[220px] md:h-[260px] w-full bg-muted/5 flex items-center justify-center p-3 border-b border-border/20 overflow-hidden shrink-0">
                              <ProductImage
                                src={item.images?.[0] || item.image}
                                alt={item.name}
                                draggable={false}
                                className="h-full w-full object-contain block group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
                              />
                            </div>

                            {/* Product info */}
                            <div className="p-4 flex flex-col gap-1 text-left">
                              <h3 className="font-display font-semibold text-foreground text-sm truncate leading-snug">
                                {item.name}
                              </h3>
                              {startingPrice != null && (
                                <span className="font-sans font-bold text-primary text-xs mt-1 leading-none">
                                  From ₹{startingPrice.toLocaleString("en-IN")}/mo
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 1 Navigation arrows */}
                  <button
                    onClick={() => nudgeRow1(-1)}
                    className="flex absolute -left-2 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-9 h-9 md:w-11 md:h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => nudgeRow1(1)}
                    className="flex absolute -right-2 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-9 h-9 md:w-11 md:h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </button>
                </div>

                {/* Row 2 Wrapper */}
                <div className="relative group/row-2">
                  {/* Left fade */}
                  <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-12 z-10 bg-gradient-to-r from-cream/60 to-transparent" />
                  {/* Right fade */}
                  <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-16 z-10 bg-gradient-to-l from-cream/60 to-transparent" />

                  {/* Track Container */}
                  <div className="overflow-hidden pb-4 px-2 md:px-4">
                    <div
                      ref={row2TrackRef}
                      className="flex gap-4 md:gap-6 w-max will-change-transform"
                      onTouchStart={onRow2DragStart}
                      onTouchMove={onRow2DragMove}
                      onTouchEnd={onRow2DragEnd}
                      onMouseDown={onRow2DragStart}
                      onMouseMove={onRow2DragMove}
                      onMouseUp={onRow2DragEnd}
                      onMouseLeave={onRow2DragEnd}
                    >
                      {[...randomProducts.slice(8, 16), ...randomProducts.slice(8, 16)].map((item, i) => {
                        const startingPrice = getStartingPrice(item);
                        return (
                          <Link
                            to={`/product/${item.id}`}
                            key={i}
                            draggable={false}
                            className="group shrink-0 w-[210px] md:w-[250px] flex flex-col bg-white border border-border/40 rounded-2xl overflow-hidden shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
                          >
                            {/* Product image */}
                            <div className="h-[220px] md:h-[260px] w-full bg-muted/5 flex items-center justify-center p-3 border-b border-border/20 overflow-hidden shrink-0">
                              <ProductImage
                                src={item.images?.[0] || item.image}
                                alt={item.name}
                                draggable={false}
                                className="h-full w-full object-contain block group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none"
                              />
                            </div>

                            {/* Product info */}
                            <div className="p-4 flex flex-col gap-1 text-left">
                              <h3 className="font-display font-semibold text-foreground text-sm truncate leading-snug">
                                {item.name}
                              </h3>
                              {startingPrice != null && (
                                <span className="font-sans font-bold text-primary text-xs mt-1 leading-none">
                                  From ₹{startingPrice.toLocaleString("en-IN")}/mo
                                </span>
                              )}
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Row 2 Navigation arrows */}
                  <button
                    onClick={() => nudgeRow2(-1)}
                    className="flex absolute -left-2 md:-left-4 lg:-left-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-9 h-9 md:w-11 md:h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </button>
                  <button
                    onClick={() => nudgeRow2(1)}
                    className="flex absolute -right-2 md:-right-4 lg:-right-6 top-1/2 -translate-y-1/2 bg-white hover:bg-cream w-9 h-9 md:w-11 md:h-11 rounded-full shadow-elevated items-center justify-center transition-all hover:scale-105 z-10"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-foreground" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default FurnitureGallery;
