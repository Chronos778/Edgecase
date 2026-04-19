import HeroSection from "@/components/landing/HeroSection";
import WhySection from "@/components/landing/WhySection";
import { ScaroGridFeatures } from "@/components/landing/ScaroGridFeatures";
import TrustSection from "@/components/landing/TrustSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

import Navbar from "@/components/landing/Navbar";

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <WhySection />
      <ScaroGridFeatures />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
