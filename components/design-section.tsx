import { MessageCircle, Ruler, UserRound } from "lucide-react"
import { whatsappHref } from "@/lib/constants"
import { WhatsAppLink } from "@/components/whatsapp-link"

const steps = [
  "اختيار نوع القماش (قطن، سميراميس، تترون...)",
  "تحديد درجة اللون المناسبة لبشرتك",
  "اختيار شكل الياقة والأكمام والأزرار",
]

export function DesignSection() {
  return (
    <section id="design" className="py-20 px-5 bg-black text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            ثوبك… <span className="text-gold">على مزاجك</span>
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl mb-10">
            اختار التفاصيل اللي تمثلك، وخلّي الباقي علينا.
          </p>

          <ul className="space-y-6 mb-10">
            {steps.map((step, index) => (
              <li key={index} className="flex items-center gap-4">
                <span className="w-10 h-10 border border-gold rounded-full flex items-center justify-center text-gold shrink-0">
                  {index + 1}
                </span>
                <span className="text-base sm:text-lg">{step}</span>
              </li>
            ))}
          </ul>

          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أرغب في حجز تفصيل ثوب جديد. ما الخطوات والمواعيد المتاحة؟")}
            placement="design_booking"
            className="btn-gold inline-flex items-center gap-2 px-8 sm:px-12 py-4 rounded-xl text-black font-bold text-lg sm:text-xl"
          >
            <MessageCircle className="size-6" aria-hidden="true" />
            احجز موعدًا عبر واتساب
          </WhatsAppLink>
          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أريد معرفة طريقة أخذ المقاس لتفصيل ثوب من قمة الشياكة.")}
            placement="size_inquiry"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-gold underline underline-offset-4"
          >
            <Ruler className="size-4" aria-hidden="true" />
            اسأل عن المقاس
          </WhatsAppLink>
        </div>
        <div className="flex-1 w-full max-w-md lg:max-w-none bg-white/5 p-8 rounded-3xl border border-white/10">
          <UserRound className="w-48 h-48 sm:w-64 sm:h-64 mx-auto text-gold/20" strokeWidth={0.5} />
        </div>
      </div>
    </section>
  )
}
