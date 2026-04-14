import { Scissors, Ruler, Handshake, Zap } from "lucide-react"

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
    icon: Zap,
    title: "تنفيذ سريع",
    description: "جودة عالية في وقت قياسي لضمان رضاك التام.",
  },
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 px-5 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-16">
          إيش نقدّم لك؟
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="text-center p-8 bg-card rounded-2xl card-shadow hover:-translate-y-2 transition duration-300"
            >
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <service.icon className="w-7 h-7 text-gold" />
              </div>
              <h3 className="font-bold text-xl mb-4">{service.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
