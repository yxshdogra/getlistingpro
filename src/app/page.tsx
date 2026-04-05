import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import WhatWeDoSection from "@/components/WhatWeDoSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import PricingSection from "@/components/PricingSection";
import TrustSection from "@/components/TrustSection";
import BottomCTA from "@/components/BottomCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <ProblemSection />
        <WhatWeDoSection />
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <PricingSection />
        <TrustSection />
        <BottomCTA />
      </main>
      <Footer />
    </>
  );
}
