import { MapPin } from "lucide-react"

export default function LocationSection() {
  return (
    <section className="py-20 px-5 bg-card">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="text-secondary" />
            <h2 className="text-xl font-bold">موقع قمة الشياكة</h2>
          </div>
          <div className="rounded-3xl overflow-hidden h-80 sm:h-96 border-4 border-secondary shadow-xl">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3862.1619458018968!2d49.122192299999995!3d14.532727599999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3de8e5121df0b77b%3A0x17a2f38c265e317c!2sAl%20Mukalla!5e0!3m2!1sen!2sye!4v1714580189682!5m2!1sen!2sye"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="موقع قمة الشياكة"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
