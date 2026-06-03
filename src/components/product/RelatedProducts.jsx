import ProductCard from "@/components/catalog/ProductCard";
import { useRecommendations } from "@/hooks/useProducts";

const RelatedProducts = ({ productId }) => {
  const { data: related = [], isLoading } = useRecommendations(productId);

  if (isLoading) {
    return (
      <section className="bg-secondary/30 py-10 md:py-14">
        <div className="section-container">
          <div className="h-7 w-44 bg-secondary rounded animate-pulse mb-6 md:mb-8" />
          <div className="flex gap-5 md:gap-6 overflow-x-auto pb-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-[280px] sm:w-[320px] shrink-0 bg-card rounded-2xl h-[380px] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (related.length === 0) return null;

  return (
    <section className="bg-secondary/30 py-10 md:py-14">
      <div className="section-container">
        <h2 className="text-xl md:text-2xl font-display font-bold mb-6 md:mb-8">
          You may also like
        </h2>
        <div className="flex gap-5 md:gap-6 overflow-x-auto pb-5 pt-2 px-2 -mx-2 custom-scrollbar">
          {related.map((product) => (
            <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedProducts;
