import { HeroSection } from "@/components/hero-section"
import { ServicesSection } from "@/components/services-section"
import { ProductsSection } from "@/components/products-section"
import { DesignSection } from "@/components/design-section"
import { TrendSection } from "@/components/trend-section"
import { AboutSection } from "@/components/about-section"
import { LocationSection } from "@/components/location-section"
import { CtaBand } from "@/components/site/cta-band"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <DesignSection />
      <TrendSection />
      <AboutSection />
      <LocationSection />
      <CtaBand placement="home_final_cta" />
    </>
  )
}
