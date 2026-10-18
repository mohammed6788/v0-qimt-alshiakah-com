"use client"

import { ArrowLeft, Sparkles } from "lucide-react"
import { useEffect, useRef } from "react"
import { PRODUCTS, whatsappHref } from "@/lib/constants"
import { trackEvent } from "@/lib/analytics"
import { WhatsAppLink } from "@/components/whatsapp-link"

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("product_view", { product_count: PRODUCTS.length })
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="products" className="bg-[#161512] py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto mb-12 max-w-xl space-y-4 text-center sm:mb-16">
          <p className="text-sm font-bold tracking-[0.18em] text-gold">اختيارات الأقمشة</p>
          <h2 className="text-4xl font-black md:text-6xl">أقمشة قمة الشياكة</h2>
          <p className="leading-relaxed text-stone-300">
            اختر النوع الذي يناسبك، وللتأكد من التوفر ومعرفة السعر تواصل معنا مباشرة.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 sm:p-6">
              <div className="mb-6 flex items-center justify-between gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold">
                  <Sparkles className="size-5" aria-hidden="true" />
                </span>
                <span className="rounded-full border border-gold/25 px-3 py-1 text-xs font-bold text-gold">{product.type}</span>
              </div>
              <h3 className="text-2xl font-black">{product.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-stone-400">
                لمعرفة السعر والتوفر، تواصل معنا عبر واتساب.
              </p>
              <WhatsAppLink
                href={whatsappHref(`أرغب بمعرفة سعر وتوفر ${product.title}`)}
                intent="whatsapp_fabric"
                placement={`product_inquiry_${product.id}`}
                className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gold/40 px-4 py-3 font-bold text-gold transition-colors hover:bg-gold hover:text-black"
              >
                تواصل لمعرفة السعر <ArrowLeft size={18} aria-hidden="true" />
              </WhatsAppLink>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center sm:mt-16">
          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أود معرفة الأقمشة المتوفرة وأسعارها وطريقة حجز تفصيل ثوب.")}
            intent="whatsapp_fabric"
            placement="products_whatsapp"
            className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gold px-8 py-4 text-lg font-black text-black transition-all hover:bg-white"
          >
            تواصل لمعرفة الأسعار
            <ArrowLeft size={20} aria-hidden="true" />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}
