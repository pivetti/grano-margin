import { CrushMarginCalculator } from "@/components/CrushMarginCalculator";
import { BenefitsSection } from "@/components/BenefitsSection";
import { ExplanationSection } from "@/components/ExplanationSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <main>
        <CrushMarginCalculator />
        <ExplanationSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
}
