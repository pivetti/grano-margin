import { CrushMarginCalculator } from "@/components/CrushMarginCalculator";
import { BenefitsSection } from "@/components/BenefitsSection";
import { ExplanationSection } from "@/components/ExplanationSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { MobileStickyCTA } from "@/components/MobileStickyCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>
        <HeroSection />
        <CrushMarginCalculator />
        <ExplanationSection />
        <BenefitsSection />
      </main>
      <Footer />
      <MobileStickyCTA />
    </div>
  );
}
