import { Hero } from "@/components/hero";
import { TechnologiesSection } from "@/components/technologies-section";
import { FeaturesSection } from "@/components/features-section";
import { CTASection } from "@/components/cta-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TechnologiesSection />
      <FeaturesSection />
      <CTASection />
    </div>
  );
}
