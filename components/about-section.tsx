import Link from "next/link"
import { BRAND } from "@/lib/constants"

export function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 sm:py-20">
      <div className="container-site max-w-3xl text-center">
        <h2 className="type-h2 text-navy">
          مو مجرد خياط… <span className="text-navy-soft">إحنا قصة أناقة</span>
        </h2>
        <p className="mt-5 text-base text-muted-foreground text-pretty">
          نهتم بأدق التفاصيل، من أول قياس… إلى آخر خيط. هدفنا؟ لما تلبس ثوبك، تحس إنك «نسخة أقوى منك».
        </p>
        <p className="type-h3 mt-5 text-navy">{BRAND.slogan}</p>
        <Link href="/about" className="mt-6 inline-block font-semibold text-navy-soft underline underline-offset-4">
          اقرأ قصتنا
        </Link>
      </div>
    </section>
  )
}
