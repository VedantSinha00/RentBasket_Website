import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="section-container py-12 md:py-20 max-w-3xl text-center">
        <h1 className="font-display font-semibold text-3xl md:text-4xl text-foreground mb-4">
          About RentBasket
        </h1>
        <p className="text-muted-foreground font-sans max-w-lg mx-auto mb-10">
          We are on a mission to redefine how urban professionals set up their homes.
        </p>

        <div className="bg-card border border-border rounded-3xl p-8 md:p-12 text-left space-y-6">
          <h2 className="font-display font-semibold text-xl sm:text-2xl text-foreground">
            Our Story &amp; Philosophy
          </h2>
          <p className="text-muted-foreground font-sans leading-relaxed">
            RentBasket was founded to solve a simple yet frustrating problem: the high cost, hassle, and commitment of buying furniture and appliances for short-to-medium-term stays. Whether you are moving to Gurgaon or Noida for a new job, college, or project, we believe you shouldn't have to choose between a blank apartment and expensive ownership.
          </p>
          <p className="text-muted-foreground font-sans leading-relaxed">
            Our core promise is simple: <strong>"Premium home, zero ownership headache."</strong> We curate top-quality furniture and energy-efficient appliances, package them with free delivery and installation, and offer flexible tenures that fit your life.
          </p>
          <div className="h-px bg-border my-6" />
          <h3 className="font-display font-semibold text-lg text-foreground">
            Why RentBasket?
          </h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground font-sans">
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Premium Quality Products
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Free Professional Setup &amp; Delivery
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Refundable Deposits &amp; 50/50 Payments
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary font-bold">✓</span>
              Free Maintenance &amp; Relocation Assistance
            </li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
