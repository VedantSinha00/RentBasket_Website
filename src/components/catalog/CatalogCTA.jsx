import mascotPeek from "@/assets/mascot-peek.png";

const CatalogCTA = () => {
  return (
    <section className="relative bg-cream overflow-hidden">
      <div className="section-container py-12 md:py-20">
        <div className="max-w-2xl mx-auto text-center relative">
          <img
            src={mascotPeek}
            alt=""
            aria-hidden="true"
            className="hidden lg:block absolute -top-20 -right-4 xl:-right-12 w-16 xl:w-20 h-auto select-none pointer-events-none"
          />
          <h2 className="text-2xl md:text-4xl font-display font-bold mb-4">
            Need help choosing the right setup?
          </h2>
          <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            Our team can help you find the perfect furniture and appliances for
            your home, budget, and timeline.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <a
              href="tel:+919959858473"
              className="btn-outline-pine py-3 px-7 text-sm md:text-base"
            >
              Talk to Us
            </a>
            <a
              href="tel:+919959858473"
              className="text-jade-ink font-semibold text-sm md:text-base hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
            >
              +91 99598 58473
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CatalogCTA;
