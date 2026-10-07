import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { TrendSection } from "@/components/trend-section"
import { AboutSection } from "@/components/about-section"
import { ServicesSection } from "@/components/services-section"
import { ProductsSection } from "@/components/products-section"
import { DesignSection } from "@/components/design-section"
import { GallerySection } from "@/components/gallery-section"
import { LocationSection } from "@/components/location-section"
import { FooterSection } from "@/components/footer-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { BRAND, CONTACT, LOGOS } from "@/lib/constants"

const structuredData = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "Tailor"],
  "@id": "https://qimt-alshiakah.com/#business",
  name: BRAND.name,
  url: "https://qimt-alshiakah.com",
  telephone: "+967738360254",
  image: LOGOS.default,
  logo: LOGOS.default,
  description:
    "تفصيل ثياب رجالية حسب الطلب واختيار الأقمشة في الشرج، المكلا، حضرموت.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "الشرج، خلف دلة حضرموت للبهارات",
    addressLocality: "المكلا",
    addressRegion: "حضرموت",
    addressCountry: "YE",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 14.5327276,
    longitude: 49.1221924,
  },
  hasMap: CONTACT.maps,
  sameAs: [CONTACT.instagram],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+967738360254",
    contactType: "customer service",
    availableLanguage: "ar",
  },
}

export default function Home() {
  return (
    <main id="main-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <Navigation />
      <HeroSection />
      <TrendSection />
      <AboutSection />
      <ServicesSection />
      <ProductsSection />
      <DesignSection />
      <GallerySection />
      <LocationSection />
      <FooterSection />
      <FloatingWhatsApp />
    </main>
  )
}
