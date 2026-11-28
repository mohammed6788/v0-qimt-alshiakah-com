import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { IBM_Plex_Sans_Arabic } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navigation } from "@/components/navigation"
import { FooterSection } from "@/components/footer-section"
import { FloatingWhatsApp } from "@/components/floating-whatsapp"
import { JsonLd } from "@/components/json-ld"
import { BRAND, CONTACT, LOGOS, SITE_URL } from "@/lib/constants"
import "./globals.css"

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
})

// Google Analytics 4 (G-XXXXXXX) and Search Console verification are set in
// Vercel → Project → Settings → Environment Variables; nothing loads while unset.
const GA_ID = process.env.NEXT_PUBLIC_GA_ID?.trim()
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
  // Site icons, generated from the original logo (public/brand/logo.png): re-centred on the
  // logo's own navy so the whole mark fits Google's circular crop in search results.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
        <Script id="google-ads" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', 'AW-18082853572');${GA_ID ? ` gtag('config', ${JSON.stringify(GA_ID)});` : ""}`}
        </Script>
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
