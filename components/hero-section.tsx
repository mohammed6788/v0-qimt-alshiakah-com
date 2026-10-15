import Link from "next/link"
import Image from "next/image"
import { MapPin, MessageCircle, Scissors } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { PRODUCTS, whatsappHref } from "@/lib/constants"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-[88svh] items-end justify-center overflow-hidden bg-black px-5 pb-16 pt-28 text-center sm:items-center sm:pb-20"
    >
      <Image src={PRODUCTS[0].image} alt="" fill priority sizes="100vw" className="object-cover object-center opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/75 to-black" aria-hidden="true" />
      <div className="relative z-10 max-w-3xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-black/40 px-4 py-2 text-sm font-bold text-gold backdrop-blur-sm">
          <MapPin className="size-4" aria-hidden="true" />
          المكلا · الشرج
        </p>
        <h1 className="mb-5 text-4xl font-bold leading-tight text-white text-balance sm:text-5xl md:text-7xl">
          قمة الشياكة <span className="gold-gradient">للخياطة الرجالية</span>
        </h1>
        <p className="mx-auto mb-9 max-w-xl text-lg leading-relaxed text-gray-200 text-pretty sm:text-xl">
          أناقة تبدأ من القماش، وتكتمل بتفصيل يناسبك.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أريد تفصيل ثوب من قمة الشياكة وأريد معرفة الأسعار والمقاسات.")}
            intent="whatsapp_order"
            placement="hero_order"
            className="btn-gold inline-flex min-h-14 items-center justify-center gap-2 rounded-xl px-8 py-4 text-lg font-bold text-black sm:px-10"
          >
            <MessageCircle className="size-5" aria-hidden="true" />
            اطلب ثوبك عبر واتساب
          </WhatsAppLink>
          <Link
            href="#products"
            className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-8 sm:px-10 py-4 rounded-xl text-white font-bold text-lg hover:bg-white/20 transition"
          >
            <Scissors className="size-5" aria-hidden="true" />
            شاهد الأقمشة
          </Link>
        </div>
        <p className="mt-6 text-sm text-gray-300">الأسعار المعروضة للقماش، والتوفر يُؤكّد عبر واتساب.</p>
      </div>
    </section>
  )
}
