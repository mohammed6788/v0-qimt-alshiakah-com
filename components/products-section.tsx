"use client"

import Image from "next/image"
import { ArrowLeft } from "lucide-react"
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
    <section ref={sectionRef} id="products" className="bg-black py-20 text-white sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6">
        <div className="mb-12 max-w-xl space-y-4 sm:mb-16">
          <h2 className="text-4xl font-black md:text-6xl">
            أقمشة <span className="text-gold">قمة الشياكة</span>
          </h2>
          <p className="leading-relaxed text-gray-400">
            اختر القماش، راجع السعر، ثم أرسل استفسارك لتأكيد التوفر.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((product) => (
            <article key={product.id} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-3 sm:p-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gray-900">
                <Image
                  src={product.image}
                  alt={`${product.title} - قماش ${product.type}`}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute right-4 top-4 rounded-full bg-black/65 px-3 py-1.5 text-xs font-bold text-gold backdrop-blur-sm">
                  {product.tag}
                </div>
              </div>

              <div className="space-y-4 px-2 pb-2 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="mb-1 text-xs font-bold tracking-widest text-gold">{product.type}</p>
                    <h3 className="text-2xl font-black transition-colors group-hover:text-gold">{product.title}</h3>
                  </div>
                  <p className="shrink-0 text-2xl font-black text-gold">
                    {product.price.toLocaleString("ar-YE")} <span className="text-lg">{product.currency}</span>
                  </p>
                </div>
                <WhatsAppLink
                  href={whatsappHref(`أرغب بمعرفة سعر وتوفر ${product.title}`)}
                  intent="whatsapp_fabric"
                  placement={`product_inquiry_${product.id}`}
                  className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl border border-gold/40 px-4 py-3 font-bold text-gold transition-colors hover:bg-gold hover:text-black"
                >
                  اطلب عبر واتساب <ArrowLeft size={18} aria-hidden="true" />
                </WhatsAppLink>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-14 text-center sm:mt-20">
          <WhatsAppLink
            href={whatsappHref("السلام عليكم، أود معرفة الأقمشة المتوفرة وأسعارها وطريقة حجز تفصيل ثوب.")}
            intent="whatsapp_fabric"
            placement="products_whatsapp"
            className="inline-flex min-h-14 items-center gap-3 rounded-2xl bg-gold px-8 py-4 text-lg font-black text-black shadow-lg shadow-gold/20 transition-all hover:bg-white sm:px-12"
          >
            استفسر عن الأقمشة المتوفرة
            <ArrowLeft size={20} aria-hidden="true" />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  )
}
