import Link from "next/link"
import { MapPin } from "lucide-react"

export function LocationSection() {
  return (
    <section className="py-20 px-5 bg-card">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <div className="rounded-3xl overflow-hidden h-80 sm:h-96 border-4 border-secondary shadow-xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.0989358903435!2d49.12219239999999!3d14.5327276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3de8e5121df0b77b%3A0x17a2f38c265e252c!2z2LHYp9mFINin2YTZhCDYp9mE2YTYp9mGIHzZiNmE2YTZhNin2YU!5e0!3m2!1sar!2s!4v1640000000000"
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
            href="https://www.google.com/maps/place/%D8%AE%D9%8A%D8%A7%D8%B7+%D9%82%D9%85%D8%A9+%D8%A7%D9%84%D8%B4%D9%8A%D8%A7%D9%83%D8%A9+%7C+%D9%84%D8%A3%D8%AD%D8%AF%D8%AB+%D8%A7%D9%84%D8%A7%D9%82%D9%85%D8%B4%D8%A9+%D8%A7%D9%84%D8%B1%D8%AC%D8%A7%D9%84%D9%8A%D8%A9%D8%8C+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D9%84%D8%AD%D8%B7%D8%A8+%D9%88%D8%A7%D9%84%D8%B1%D9%85%D8%A7%D9%85+%D9%85%D9%82%D8%A7%D8%A8%D9%84+%D9%83%D8%B4%D8%AE%D8%A9+%D9%8A%D8%A7%D8%B9%D9%8A%D8%A7%D9%84%D8%8C+%D8%A7%D9%84%D9%85%D9%83%D9%84%D8%A7%D8%8C+%D8%A7%D9%84%D9%8A%D9%85%D9%86&ftid=0x3de8e5121df0b77b:0x17a2f38c265e252c&entry=gps"
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
