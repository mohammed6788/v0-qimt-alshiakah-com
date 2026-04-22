import Image from "next/image"
import { PRODUCTS } from "@/lib/constants"

const galleryItems = PRODUCTS.map((product) => ({
  src: product.image,
  alt: product.title,
  label: product.type,
}))

export function GallerySection() {
  return (
    <section id="gallery" className="py-20 px-5 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
          <h2 className="text-3xl sm:text-4xl font-bold italic underline decoration-gold underline-offset-8">
            شوف الشغل قبل لا تحكم
          </h2>
          <div className="text-gold hidden md:block">معرض أعمال قمة الشياكة</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl h-72 sm:h-80"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold border-2 border-white px-4 py-2 rounded">
                  {item.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
