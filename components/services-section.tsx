import { Gem, Ruler, Shirt, Wrench } from "lucide-react"

// Pillars as presented on the brand's official materials.
const services = [
  { icon: Gem, title: "جودة وإتقان", description: "خياطة متقنة بتشطيب نظيف يدوم." },
  { icon: Shirt, title: "أقمشة فاخرة", description: "ياباني، سميرا أميس، خلية النحل، كوري، صيني وشتوي." },
  { icon: Ruler, title: "تفصيل حسب المقاس", description: "سعودي، إماراتي، كويتي — على مقاسك." },
  { icon: Wrench, title: "قسم خاص بالتعديلات", description: "نعيد ضبط ثوبك ليرجع كأنه جديد." },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-white py-16 sm:py-20">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow !text-navy-soft">لماذا قمة الشياكة؟</p>
          <h2 className="type-h2 mt-2 text-navy">تفصيل عصري… وجودة عالية</h2>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="rounded-2xl border border-navy/10 bg-ivory p-5 text-center transition-colors hover:border-sky/50 sm:p-7">
              <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-navy text-sky sm:size-14">
                <s.icon className="size-6" aria-hidden="true" />
              </span>
              <h3 className="type-title mt-4 text-navy">{s.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
