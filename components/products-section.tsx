"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PRODUCTS, CONTACT } from "@/lib/constants"

export function ProductsSection() {
  return (
    <section id="products" className="py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-6xl font-black">
              مجموعة <span className="text-gold">الأقمشة</span>
            </h2>
            <p className="text-gray-400 max-w-md leading-relaxed">
              تشكيلة متميزة من أفخر الأقمشة العالمية والمحلية بأسعار منافسة تستحق الثقة
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group">
              <div className="relative aspect-[3/4] rounded-[30px] overflow-hidden bg-gray-900 border border-gold/10 mb-8">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority={product.id <= 3}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <Link
                    href={`${CONTACT.whatsapp}?text=أريد معرفة المزيد عن ${product.title}`}
                    className="w-full bg-gold text-black py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white transition-colors"
                  >
                    صمّم مثله <ArrowLeft size={18} />
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
                <div className="pt-4 border-t border-gold/20">
                  <p className="text-3xl font-black text-gold">
                    {product.price.toLocaleString("ar-YE")} <span className="text-lg">{product.currency}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">السعر الأساسي للمتر</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <Link
            href={CONTACT.whatsapp}
            className="inline-flex items-center gap-3 bg-gold text-black px-12 py-5 rounded-2xl font-black text-lg hover:bg-white transition-all duration-300 shadow-lg shadow-gold/30"
          >
            تصفح جميع الأقمشة والتصاميم
            <ArrowLeft size={20} />
          </Link>
        </div>
      </div>
    </section>
  )
}
