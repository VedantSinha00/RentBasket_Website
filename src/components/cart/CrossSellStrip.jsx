import { useState, useMemo } from "react";
import { Plus, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { DURATION_OPTIONS } from "@/data/products";
import { discountedRent } from "@/lib/pricing";
import { useProducts } from "@/hooks/useProducts";
import { toast } from "sonner";

function shuffled(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const CrossSellStrip = () => {
  const { cartItems, addToCart } = useCart();
  const { data: products = [] } = useProducts();
  const [refreshKey, setRefreshKey] = useState(0);

  // Pick 4 random products not already in cart; re-shuffles on each refresh
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const suggestions = useMemo(() => {
    const cartProductIds = new Set(cartItems.map((i) => i.productId));
    const pool = products.filter((p) => !cartProductIds.has(p.id));
    return shuffled(pool).slice(0, 4);
  }, [cartItems, products, refreshKey]);

  if (suggestions.length === 0) return null;

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const firstDuration = (product) =>
    DURATION_OPTIONS.find((d) => (product.pricing_by_duration?.[d.key] ?? 0) > 0)?.key ?? "3_months";

  const getDisplayPrice = (product) => {
    const key = firstDuration(product);
    return discountedRent(product.pricing_by_duration[key] ?? 0, product.percent_discount);
  };

  const handleQuickAdd = (product) => {
    const defaultDuration = firstDuration(product);
    const basePrice = discountedRent(product.pricing_by_duration[defaultDuration], product.percent_discount);
    const label = DURATION_OPTIONS.find((d) => d.key === defaultDuration)?.label || "3 Months";

    addToCart({
      productId: product.id,
      name: product.name,
      duration: defaultDuration,
      durationLabel: label,
      price: basePrice,
      quantity: 1,
      startDate: new Date().toISOString().split("T")[0],
      deposit: 0, // Zero deposit incentive for recommendations
      image: product.image,
      category: product.category,
      rent: product.pricing_by_duration[defaultDuration],
      percent_discount: product.percent_discount,
      security_multiple: 0, // Zero deposit incentive
      isRecommendation: true,
    });

    toast.success(`${product.name} added to cart`, {
      description: `${label} plan · ₹${basePrice.toLocaleString("en-IN")}/mo (Zero Deposit)`,
    });
  };

  const handleAddAll = () => {
    suggestions.forEach((product) => {
      const defaultDuration = firstDuration(product);
      const label = DURATION_OPTIONS.find((d) => d.key === defaultDuration)?.label || "3 Months";
      const basePrice = discountedRent(product.pricing_by_duration[defaultDuration], product.percent_discount);
      addToCart({
        productId: product.id,
        name: product.name,
        duration: defaultDuration,
        durationLabel: label,
        price: basePrice,
        quantity: 1,
        startDate: new Date().toISOString().split("T")[0],
        adv_security: product.adv_security,
        image: product.image,
        category: product.category,
        rent: product.pricing_by_duration[defaultDuration],
        percent_discount: product.percent_discount,
        security_multiple: product.security_multiple,
      });
    });

    toast.success(`${suggestions.length} products added to cart!`);
  };

  return (
    <section className="mt-8 md:mt-10">
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg md:text-xl font-display font-bold text-foreground">
            Complete your home setup
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Recommendations for you
          </p>
        </div>
        {products.length - cartItems.length > 4 && (
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-full transition-colors group"
          >
            <RefreshCcw className="w-3.5 h-3.5 group-active:rotate-180 transition-transform duration-500" />
            Shuffle
          </button>
        )}
      </div>



      {/* Product cards - Grid instead of scroll */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {suggestions.map((product) => {
          const displayPrice = getDisplayPrice(product);
          const basePrice = getDisplayPrice(product);

          return (
            <div
              key={product.id}
              className="bg-card border rounded-2xl p-3.5 flex flex-col shadow-soft hover:shadow-card transition-all hover:-translate-y-1 border-border"
            >
              {/* Thumbnail */}
              <Link
                to={`/product/${product.id}`}
                className="w-full aspect-square bg-white rounded-xl overflow-hidden mb-3 block group"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </Link>

              {/* Name */}
              <Link to={`/product/${product.id}`} className="flex-1">
                <h4 className="text-[12px] font-bold text-foreground line-clamp-2 mb-1.5 hover:text-primary transition-colors leading-tight">
                  {product.name}
                </h4>
              </Link>

              {/* Price & Rating */}
              <div className="mb-2">
                <div className="flex items-end justify-between">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-extrabold text-primary">
                      ₹{basePrice.toLocaleString("en-IN")}/mo
                    </span>
                  </div>
                  {product.rating != null && (
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] font-bold text-amber-500">★</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">{product.rating}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-[9px] text-success-muted-foreground font-bold bg-success-muted px-1.5 py-0.5 rounded inline-block border border-success-border">
                  <s className="text-muted-foreground font-medium mr-1 opacity-70">₹{product.deposit}</s> ₹0 Deposit
                </div>
              </div>

              {/* Add button */}
              <button
                onClick={() => handleQuickAdd(product)}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl border-2 border-primary/20 text-primary text-[11px] font-bold hover:bg-primary hover:text-white hover:border-primary transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CrossSellStrip;
