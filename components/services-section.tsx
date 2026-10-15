import { Scissors, Ruler, Handshake, MapPin } from "lucide-react"

const services = [
  {
    icon: Scissors,
    title: "تفصيل حسب الطلب",
    description: "ثياب رجالية تُصمم خصيصاً لتناسب مقاسك وشخصيتك.",
  },
  {
    icon: Ruler,
    title: "إعادة ضبط المقاسات",
    description: "نعدل ثوبك المفضل ليرجع يضبط عليك كأنه جديد.",
  },
  {
    icon: Handshake,
    title: "استشارات التصميم",
    description: "نساعدك تختار أنسب نوع قماش وتصميم للمناسبة.",
  },
  {
    icon: MapPin,
    title: "في المكلا - الشرج",
    description: "تواصل معنا أو زر المعرض لتحديد ما يناسب طلبك.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="bg-secondary px-5 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold sm:mb-16 sm:text-4xl">
          لماذا قمة الشياكة؟
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {services.map((service, index) => (
            <div
              key={index}
              className="rounded-2xl border border-black/5 bg-card p-5 text-center sm:p-7"
            >
              <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold/10 sm:mb-5 sm:size-14">
                <service.icon className="size-6 text-gold" aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-bold sm:text-lg">{service.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
