import { Quote, Star } from "lucide-react"

const testimonials = [
  {
    text: "أول مرة ألبس ثوب وأحس إنه معمول لي فعلاً.. اهتمام غريب بالتفاصيل",
  },
  {
    text: "تفصيل دقيق + تعامل راقي جداً.. بصراحة يستاهلون كل ريال يدفع فيهم",
  },
  {
    text: "صار مكاني الأول بدون تفكير، شكراً لقمة الشياكة على هذا الإبداع",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 px-5 bg-black text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-bold mb-16 italic text-balance">
          كلامهم عنّا… <span className="text-gold">أهم من كلامنا</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 border border-white/10 rounded-2xl relative hover:border-gold/30 transition-colors duration-300"
            >
              <Quote className="w-8 h-8 text-gold mb-6" />
              <p className="text-base sm:text-lg italic leading-relaxed text-gray-300">
                {testimonial.text}
              </p>
              <div className="mt-8 flex text-gold gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
