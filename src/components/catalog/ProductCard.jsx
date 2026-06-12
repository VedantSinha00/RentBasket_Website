import { forwardRef, useState } from "react";
import { Heart } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import ProductImage from "@/components/ui/ProductImage";

const ProductCard = forwardRef(({ product }, ref) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);
  const [showPricingLadder, setShowPricingLadder] = useState(false);
  const navigate = useNavigate();

  const pricing = product.pricing_by_duration ?? {};

  // Duration chips — only durations with a real price
  const previewChips = DURATION_OPTIONS.filter((d) => (pricing[d.key] ?? 0) > 0);

  const defaultDuration = (pricing["12_months"] ?? 0) > 0
    ? "12_months"
    : (previewChips[0]?.key || "12_months");
  const [selectedDuration, setSelectedDuration] = useState(defaultDuration);

  const disc = (key) => discountedRent(pricing[key], product.percent_discount);
  const currentPrice = disc(selectedDuration);
  const currentPriceList = pricing[selectedDuration];

  // Pricing ladder for hover tooltip — only available durations
  const pricingLadder = previewChips.map((d) => ({
    label: d.label,
    price: disc(d.key),
    suffix: "/mo",
  }));

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: "easeOut" } }}
      className="group bg-card border border-border rounded-2xl overflow-hidden shadow-soft hover:shadow-elevated transition-shadow duration-200 cursor-pointer"
      onMouseEnter={() => setShowPricingLadder(true)}
      onMouseLeave={() => setShowPricingLadder(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-white overflow-hidden">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {product.is_trending ? (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-[10px] md:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
            Trending
          </span>
        ) : null}

        {/* Wishlist button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
            }`}
          />
        </button>

        {/* Hover Pricing Ladder */}
        <AnimatePresence>
          {showPricingLadder && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent p-4 pt-8 hidden md:block"
            >
              <div className="grid grid-cols-4 gap-1">
                {pricingLadder.map((item) => (
                  <div key={item.label} className="text-center">
                    <div className="text-[10px] text-white/70 mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-xs text-white font-semibold">
                      ₹{item.price.toLocaleString("en-IN")}
                      <span className="text-[9px] font-normal">
                        {item.suffix}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-sm md:text-base text-foreground leading-snug mb-2 line-clamp-1">
          {product.name}
        </h3>

        {/* Pricing Preview */}
        <div className="mb-3">
          <div className="flex items-center justify-center gap-1.5 flex-wrap">
            {currentPriceList > currentPrice && (
              <span className="text-xs text-muted-foreground line-through">
                ₹{currentPriceList.toLocaleString("en-IN")}
              </span>
            )}
            <span className="text-lg md:text-xl font-bold text-primary leading-none">
              ₹{currentPrice.toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-muted-foreground">/month</span>
            {currentPriceList > currentPrice && (
              <span className="text-xs font-semibold text-success-muted-foreground bg-success-muted px-1.5 py-0.5 rounded-full">
                {product.percent_discount}% off
              </span>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="max-h-0 opacity-0 overflow-hidden pointer-events-none group-hover:max-h-14 group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 ease-out mt-0 group-hover:mt-3">
          <button
            onClick={() => navigate(`/product/${product.id}`)}
            className="w-full btn-outline text-sm py-2.5 hover:bg-primary hover:text-primary-foreground"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
