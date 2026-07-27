import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RentingCarousel from "@/components/RentingCarousel";
import WhatMakesDifferent from "@/components/WhatMakesDifferent";
import MythOrFact from "@/components/MythOrFact";
import Testimonials from "@/components/Testimonials";
import FAQsTeaser from "@/components/FAQsTeaser";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <RentingCarousel />
        <WhatMakesDifferent />
        <MythOrFact />
        <Testimonials />
        <FAQsTeaser />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
