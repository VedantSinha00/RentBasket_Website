import { useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import RentingCarousel from "@/components/RentingCarousel";
import FurnitureGallery from "@/components/FurnitureGallery";
import WhatMakesDifferent from "@/components/WhatMakesDifferent";
import MythOrFact from "@/components/MythOrFact";
import Testimonials from "@/components/Testimonials";
import FAQsTeaser from "@/components/FAQsTeaser";
import Footer from "@/components/Footer";

const Index = () => {
  const carouselRef = useRef(null);

  const scrollToCarousel = () => {
    carouselRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection onScrollToCarousel={scrollToCarousel} />
        <RentingCarousel innerRef={carouselRef} />
        <FurnitureGallery />
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
