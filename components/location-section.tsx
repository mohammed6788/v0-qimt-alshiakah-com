import Link from "next/link"
import { MapPin } from "lucide-react"

export function LocationSection() {
  return (
    <section className="py-20 px-5 bg-card">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <div className="rounded-3xl overflow-hidden h-80 sm:h-96 border-4 border-secondary shadow-xl">
            <iframe
              src="https://maps.app.goo.gl/ZFsgUUkoquzwGaeo8?g_st=ic"
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
        <div className="flex-1 text-right">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">زورنا في المعرض</h2>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-loose flex items-start gap-2">
            <MapPin className="w-6 h-6 text-gold shrink-0 mt-1" />
            <span>
              حضرموت - المكلا - الشرج <br />
              خلف دلة حضرموت للبهارات
            </span>
          </p>
          <Link
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-8 py-4 rounded-xl font-bold hover:bg-gold hover:text-black transition-colors duration-300 inline-block"
          >
            افتح الموقع في الخريطة
          </Link>
        </div>
      </div>
    </section>
  )
}
