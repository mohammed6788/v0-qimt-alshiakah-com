"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useEffect, useRef } from "react"
import { PRODUCTS, CONTACT, whatsappHref } from "@/lib/constants"
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics"

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent("Products Viewed", { product_count: PRODUCTS.length })
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="products" className="py-20 sm:py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black">
              أقمشة <span className="text-gold">قمة الشياكة</span>
            </h2>
            <p className="text-gray-400 max-w-md leading-relaxed">
              اختر القماش المناسب، وشاهد السعر المعروض قبل التواصل لتأكيد التوفر والتفصيل.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] rounded-[30px] overflow-hidden bg-gray-900 border border-gold/10 mb-8">
                <Image
                  src={product.image}
                  alt={`${product.title} - قماش ${product.type}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <Link
                    href={whatsappHref(`أرغب بمعرفة سعر وتوفر ${product.title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackWhatsAppClick(`product_inquiry_${product.id}`)}
                    className="w-full bg-gold text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white transition-colors"
                  >
                    استفسر عن القماش <ArrowLeft size={18} aria-hidden="true" />
                  </Link>
                </div>
                <div className="absolute top-6 right-6 bg-gold text-black text-[10px] font-black uppercase px-4 py-2 rounded-full tracking-tight">
                  {product.tag}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gold font-bold uppercase tracking-widest mb-2">
                    {product.type}
                  </p>
                  <h3 className="text-2xl font-black group-hover:text-gold transition-colors line-clamp-2">
                    {product.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed h-12 line-clamp-2">
                  {product.description}
                </p>
                <div className="pt-4 border-t border-gold/20 space-y-3">
                  <div>
                    <p className="text-3xl font-black text-gold">
                      {product.price.toLocaleString("ar-YE")} <span className="text-lg">{product.currency}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-2">السعر المعروض للقماش</p>
                  </div>
                  <p className="text-xs text-gold font-bold bg-gold/10 px-3 py-2 rounded-lg">
                    اسألنا عن توفر القماش والسعر
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href={whatsappHref("السلام عليكم، أود معرفة الأقمشة المتوفرة وأسعارها وطريقة حجز تفصيل ثوب.")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick("products_whatsapp")}
            className="inline-flex items-center gap-3 bg-gold text-black px-12 py-5 rounded-2xl font-black text-lg hover:bg-white transition-all duration-300 shadow-lg shadow-gold/30"
          >
            استفسر عن الأقمشة المتوفرة
            <ArrowLeft size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  )
}
