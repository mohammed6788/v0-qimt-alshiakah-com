import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { IBM_Plex_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { FooterSection } from "@/components/footer-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { JsonLd } from "@/components/json-ld"
import { BRAND, CONTACT, GA_HOST_PATTERN, GA_MEASUREMENT_ID, LOGOS, SITE_URL } from "@/lib/constants"
import "./globals.css"

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})

// Search Console verification is set in Vercel → Settings → Environment Variables.
const GOOGLE_SITE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim()

const DEFAULT_TITLE = "قمة الشياكة | خياطة رجالية وتفصيل ثياب في المكلا"
const DEFAULT_DESCRIPTION =
  "خياطة رجالية في المكلا – الشرج: تفصيل ثياب رجالية وثوب سعودي حسب المقاس، أقمشة فاخرة، وحفظ المقاسات، وطلب سهل عبر واتساب من داخل المكلا وخارجها."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: DEFAULT_TITLE, template: "%s | قمة الشياكة" },
  description: DEFAULT_DESCRIPTION,
  applicationName: BRAND.name,
  keywords: [
    "خياطة رجالية في المكلا",
    "تفصيل ثياب رجالية",
    "تفصيل ثوب سعودي",
    "خياطة ثياب في حضرموت",
    "أقمشة ثياب رجالية",
    "خياط المكلا",
    "قمة الشياكة",
  ],
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    locale: "ar_YE",
    type: "website",
    siteName: BRAND.name,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
  ...(GOOGLE_SITE_VERIFICATION && { verification: { google: GOOGLE_SITE_VERIFICATION } }),
}

export const viewport: Viewport = {
  themeColor: "#011d45",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

const businessSchema = {
  "@context": "https://schema.org",
  "@type": ["Tailor", "ClothingStore"],
  "@id": `${SITE_URL}/#business`,
  name: BRAND.fullName,
  alternateName: [BRAND.name, BRAND.nameEn],
  slogan: BRAND.slogan,
  url: SITE_URL,
  telephone: CONTACT.phone,
  image: `${SITE_URL}${LOGOS.full}`,
  logo: `${SITE_URL}${LOGOS.full}`,
  description: "تفصيل ثياب رجالية حسب المقاس وبيع أقمشة الثياب في الشرج، المكلا، حضرموت، مع استقبال طلبات العملاء من خارج المكلا عبر واتساب.",
  priceRange: "$$",
  currenciesAccepted: "YER",
  address: {
    "@type": "PostalAddress",
    streetAddress: `${CONTACT.address.district}، ${CONTACT.address.street}`,
    addressLocality: CONTACT.address.city,
    addressRegion: CONTACT.address.region,
    addressCountry: "YE",
  },
  geo: { "@type": "GeoCoordinates", latitude: CONTACT.geo.lat, longitude: CONTACT.geo.lng },
  hasMap: CONTACT.maps,
  areaServed: [
    { "@type": "City", name: "المكلا" },
    { "@type": "AdministrativeArea", name: "حضرموت" },
    { "@type": "Country", name: "اليمن" },
  ],
  sameAs: [CONTACT.instagram, CONTACT.tiktok, CONTACT.facebook, CONTACT.youtube, CONTACT.x],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: `+${CONTACT.whatsappNumber}`,
      contactType: "sales",
      availableLanguage: "ar",
      description: "واتساب الطلبات",
    },
    {
      "@type": "ContactPoint",
      telephone: CONTACT.phone,
      contactType: "customer service",
      availableLanguage: "ar",
    },
  ],
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${plexArabic.variable} scroll-smooth motion-reduce:scroll-auto`}>
      <body className="font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-navy"
        >
          انتقل إلى المحتوى الرئيسي
        </a>
        <JsonLd data={businessSchema} />
        <Navigation />
        <main id="main-content">{children}</main>
        <FooterSection />
        <FloatingWhatsApp />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-18082853572" strategy="afterInteractive" />
        <Script id="google-tag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', 'AW-18082853572');` +
            // GA4: the same gtag.js serves Google Ads and GA4. GA4 only collects on the real
            // domain (or with ?ga_debug=1 for testing, shown in GA4 DebugView).
            `(function(){var d=/[?&]ga_debug=1(&|$)/.test(location.search);if(!d&&!new RegExp(${JSON.stringify(GA_HOST_PATTERN)}).test(location.hostname))return;window.__gaEnabled=true;gtag('config',${JSON.stringify(GA_MEASUREMENT_ID)},d?{debug_mode:true}:{});})();`}
        </Script>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
