import type { Metadata, Viewport } from 'next'
import { Tajawal } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const tajawal = Tajawal({ 
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal"
})

export const metadata: Metadata = {
  title: 'قمة الشياكة | هيبة الحضور',
  description: 'في قمة الشياكة، ما نبيع قماش… نصنع حضورك من أول نظرة. تفصيل ثياب رجالية فاخرة حسب الطلب',
  keywords: ['ثياب رجالية', 'تفصيل', 'خياطة', 'قمة الشياكة', 'المكلا', 'حضرموت'],
  openGraph: {
    title: 'قمة الشياكة | هيبة الحضور',
    description: 'في قمة الشياكة، ما نبيع قماش… نصنع حضورك من أول نظرة',
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
      <body className={`${tajawal.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
