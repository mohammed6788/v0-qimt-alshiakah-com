import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal"
})

export const metadata: Metadata = {
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
    locale: 'ar_SA',
  },
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
    <html lang="ar" dir="rtl" className="scroll-smooth bg-background">
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18082853572"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18082853572');
            `,
          }}
        />
      </head>
      <body className={`${tajawal.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
