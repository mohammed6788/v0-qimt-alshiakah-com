import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { TrendSection } from "@/components/trend-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { ProductsSection } from "@/components/products-section"
import { DesignSection } from "@/components/design-section"
import { GallerySection } from "@/components/gallery-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { LocationSection } from "@/components/location-section"
import { FooterSection } from "@/components/footer-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"

export default function Home() {
  return (
    <main>
      <Navigation />
      <HeroSection />
      <TrendSection />
      <AboutSection />
      <ServicesSection />
      <ProductsSection />
      <DesignSection />
      <GallerySection />
      <TestimonialsSection />
      <LocationSection />
      <FooterSection />
      <FloatingWhatsApp />
    </main>
  )
}
