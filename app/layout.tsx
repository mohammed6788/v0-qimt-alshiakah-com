import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LOGOS } from '@/lib/constants'
import './globals.css'

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal"
})

export const metadata: Metadata = {
  metadataBase: new URL('https://qimt-alshiakah.com'),
  title: 'قمة الشياكة | تفصيل ثياب رجالية فاخرة في المكلا',
  description: 'في قمة الشياكة، ما نبيع قماش… نصنع حضورك من أول نظرة. تفصيل ثياب رجالية فاخرة حسب الطلب بأفضل الأقمشة اليابانية والكورية والتايلاندية',
  keywords: [
    'خياط رجالي',
    'تفصيل ثياب رجالية',
    'خياطة ثوب سعودي',
    'تفصيل ثوب',
    'خياط قريب مني',
    'خياطة فاخرة',
    'ثياب رجالية تفصيل',
    'أفضل خياط رجالي',
    'خياط ثياب في المكلا',
    'تفصيل ثوب سعودي فاخر',
    'خياطة حسب الطلب',
    'خياط محترف',
    'تفصيل ثوب رجالي',
    'خياطة تقليدية وعصرية',
    'أسعار تفصيل الثوب',
    'خياط ثوب سريع',
    'تفصيل ثوب للمناسبات',
    'خياطة بجودة عالية',
    'خياط رجالي قريب',
    'محل تفصيل ثياب رجالية',
    'قمة الشياكة',
    'المكلا',
    'حضرموت',
    'اليمن'
  ].join(', '),
  openGraph: {
    title: 'قمة الشياكة | تفصيل ثياب رجالية فاخرة',
    description: 'خياطة وتفصيل ثياب رجالية حسب الطلب بجودة عالية وأقمشة فاخرة',
    locale: 'ar_YE',
    type: 'website',
    siteName: 'قمة الشياكة',
    url: 'https://qimt-alshiakah.com',
    images: [{ url: LOGOS.default, alt: 'شعار قمة الشياكة' }],
  },
  alternates: { canonical: '/' },
  twitter: {
    card: 'summary_large_image',
    title: 'قمة الشياكة | تفصيل ثياب رجالية فاخرة',
    description: 'تفصيل ثياب رجالية حسب الطلب في المكلا، حضرموت.',
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
      </body>
    </html>
  )
}
