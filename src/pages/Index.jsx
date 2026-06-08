import { useState, useRef } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FurnitureGallery from "@/components/FurnitureGallery";
import FreeServices from "@/components/FreeServices";
import ResponsibilitySection from "@/components/ResponsibilitySection";
// import HowItWorks from "@/components/HowItWorks";
// import FoundersSection from "@/components/FoundersSection";
import MythOrFact from "@/components/MythOrFact";
import Testimonials from "@/components/Testimonials";
import WhatMakesDifferent from "@/components/WhatMakesDifferent";
import DownloadSection from "@/components/DownloadSection";
import Footer from "@/components/Footer";
import AppDownloadCard from "@/components/AppDownloadCard";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("Furniture");
  const galleryRef = useRef(null);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen dot-bg">
      <Header />
      <main>
        <HeroSection
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
        />
        <AppDownloadCard />
        <div ref={galleryRef} className="-mt-2">
          <FurnitureGallery activeCategory={activeCategory} />
        </div>
        <FreeServices />
        <ResponsibilitySection />
        {/* v1: How it works — hidden for this release */}
        {/* <HowItWorks /> */}
        {/* v1: Founders — hidden for this release */}
        {/* <FoundersSection /> */}
        <MythOrFact />
        <Testimonials />
        <DownloadSection />
        <WhatMakesDifferent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
