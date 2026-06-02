import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const svgUrl = `${import.meta.env.BASE_URL}about-us.svg`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="w-full bg-white py-12 md:py-16">
        <h1 className="absolute opacity-[0.01] pointer-events-none text-[1px]">About RentBasket</h1>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <div className="w-full max-w-6xl shadow-card rounded-[32px] overflow-hidden border border-border bg-white p-2 sm:p-4">
            <img 
              src={svgUrl} 
              alt="About RentBasket Story and Mission" 
              className="w-full h-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
