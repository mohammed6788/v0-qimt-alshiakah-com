import Link from "next/link"
import { MapPin, MessageCircle, Scissors } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { whatsappHref } from "@/lib/constants"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden text-center px-5 pt-24 pb-14 min-h-[88svh] bg-gradient-to-b from-black via-black/95 to-black"
    >
      <div className="max-w-3xl relative z-10">
        <p className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-2 text-sm font-bold text-gold mb-6">
          <MapPin className="size-4" aria-hidden="true" />
          المكلا · الشرج
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          قمة الشياكة <span className="gold-gradient">للخياطة الرجالية</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed text-pretty">
          تفصيل ثياب رجالية أنيقة في المكلا، مع اختيار القماش والتصميم والمقاس المناسب لك.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أريد تفصيل ثوب من قمة الشياكة وأريد معرفة الأسعار والمقاسات.")}
            placement="hero_order"
            className="btn-gold inline-flex items-center justify-center gap-2 px-8 sm:px-10 py-4 rounded-xl text-black font-bold text-lg"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            اطلب ثوبك عبر واتساب
          </WhatsAppLink>
          <Link
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-8 sm:px-10 py-4 rounded-xl text-white font-bold text-lg hover:bg-white/20 transition"
          >
            <Scissors className="size-5" aria-hidden="true" />
            شاهد الأقمشة والأسعار
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-400">الأسعار المعروضة للقماش، والتوفر يُؤكّد عبر واتساب.</p>
      </div>
    </section>
  )
}
