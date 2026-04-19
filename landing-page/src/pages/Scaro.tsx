import ScaroHero from "@/components/scaro/ScaroHero";
import ScaroFeatures from "@/components/scaro/ScaroFeatures";
import TechArchitecture from "@/components/scaro/TechArchitecture";
import ScaroCTA from "@/components/scaro/ScaroCTA";
import ScaroFooter from "@/components/scaro/ScaroFooter";

const Scaro = () => {
  return (
    <main className="min-h-screen bg-background">
      <ScaroHero />
      <ScaroFeatures />
      <TechArchitecture />
      <ScaroCTA />
      <ScaroFooter />
    </main>
  );
};

export default Scaro;
