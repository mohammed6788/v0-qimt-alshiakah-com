import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

export function TrendSection() {
  return (
    <section className="bg-black py-16 px-5 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-gold font-bold tracking-widest text-sm">
            طريقك لطلب الثوب
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6">
            كيف تطلب ثوبك؟
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8">
            أربع خطوات واضحة من اختيار القماش حتى استلام ثوبك.
          </p>
          <Link href="#products" className="inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3 font-bold text-black hover:bg-white transition-colors">
            تصفح الأقمشة والأسعار <ArrowLeft className="size-5" aria-hidden="true" />
          </Link>
        </div>
        <div className="relative">
          <div className="relative z-10 rounded-2xl shadow-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 p-7 sm:p-10">
            <h3 className="text-2xl font-bold text-white mb-6">مسار طلب واضح</h3>
            <ol className="space-y-5">
              {[
                "اختر القماش المناسب لك.",
                "أرسل طلبك عبر واتساب.",
                "نستكمل المقاس والتفاصيل.",
                "استلم ثوبك.",
              ].map((step, index) => (
                <li key={step} className="flex items-start gap-3 text-gray-200">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gold text-sm font-black text-black">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <p className="mt-7 flex items-center gap-2 text-sm text-gold"><CheckCircle2 className="size-4" aria-hidden="true" /> تواصل واحد يكفي لبدء الطلب.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
