import { Layers, MessageCircle, Package, Ruler } from "lucide-react"

const STEPS = [
  { icon: Layers, title: "اختر القماش", text: "تصفّح الأقمشة وتعرّف على أنواعها." },
  { icon: Ruler, title: "حدّد التفاصيل والمقاس", text: "صمّم ثوبك وأرسل مقاساتك أو استخدم المحفوظة." },
  { icon: MessageCircle, title: "أرسل الطلب عبر واتساب", text: "رسالة منظمة بكل اختياراتك، ونؤكد معك التفاصيل والموعد." },
  { icon: Package, title: "استلم ثوبك", text: "في الموعد المتفق عليه، من المحل أو حسب الترتيب معك." },
]

/** "How to order" — four clear steps. */
export function TrendSection() {
  return (
    <section className="navy-gradient py-16 text-white sm:py-24">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">طريقة الطلب</p>
          <h2 className="type-h2 mt-2">من اختيار القماش إلى استلام ثوبك</h2>
        </div>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-6">
              <span className="num absolute left-5 top-4 text-4xl font-bold text-white/10" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <s.icon className="size-7 text-sky" aria-hidden="true" />
              <h3 className="type-title mt-4">{s.title}</h3>
              <p className="mt-1.5 text-sm text-silver">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
