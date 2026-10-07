import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { LOGOS } from '@/lib/constants'
import './globals.css'

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://qimt-alshiakah.com'),
  title: 'قمة الشياكة | خياطة وتفصيل ثياب رجالية في المكلا',
  description: 'قمة الشياكة للخياطة الرجالية في الشرج، المكلا. تصفح الأقمشة والأسعار المعروضة وتواصل عبر واتساب لتأكيد المقاس والتفصيل.',
  openGraph: {
    title: 'قمة الشياكة | خياطة وتفصيل ثياب رجالية في المكلا',
    description: 'تصفح الأقمشة والأسعار المعروضة وتواصل لتأكيد المقاس والتفصيل في المكلا.',
    locale: 'ar_YE',
    type: 'website',
    siteName: 'قمة الشياكة',
    url: 'https://qimt-alshiakah.com',
    images: [{ url: LOGOS.default, alt: 'شعار قمة الشياكة' }],
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'قمة الشياكة | خياطة وتفصيل ثياب رجالية في المكلا',
    description: 'تصفح الأقمشة والأسعار المعروضة وتواصل لتأكيد المقاس والتفصيل في المكلا.',
    images: [LOGOS.default],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  themeColor: '#D4AF37',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ar" dir="rtl" className="scroll-smooth motion-reduce:scroll-auto bg-background">
      <body className={`${tajawal.variable} font-sans antialiased`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:right-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-black"
        >
          انتقل إلى المحتوى الرئيسي
        </a>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18082853572"
          strategy="afterInteractive"
        />
        <Script id="google-ads" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){window.dataLayer.push(arguments);} window.gtag = gtag; gtag('js', new Date()); gtag('config', 'AW-18082853572');`}
        </Script>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        <SpeedInsights />
      </body>
    </html>
  )
}
