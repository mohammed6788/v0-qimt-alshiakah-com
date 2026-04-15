import Link from "next/link"
import { MapPin } from "lucide-react"

export function LocationSection() {
  return (
    <section className="py-20 px-5 bg-card">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 items-center">
        <div className="flex-1 w-full">
          <div className="rounded-3xl overflow-hidden h-80 sm:h-96 border-4 border-secondary shadow-xl">
            <iframe
              src="https://www.google.com/maps?q=%D8%AE%D9%8A%D8%A7%D8%B7+%D9%82%D9%85%D8%A9+%D8%A7%D9%84%D8%B4%D9%8A%D8%A7%D9%83%D8%A9+%7C+%D9%84%D8%A3%D8%AD%D8%AF%D8%AB+%D8%A7%D9%84%D8%A7%D9%82%D9%85%D8%B4%D8%A9+%D8%A7%D9%84%D8%B1%D8%AC%D8%A7%D9%84%D9%8A%D8%A9%D8%8C+%D8%B4%D8%A7%D8%B1%D8%B9+%D8%A7%D9%84%D8%AD%D8%B7%D8%A8+%D9%88%D8%A7%D9%84%D8%B1%D9%85%D8%A7%D9%85+%D9%85%D9%82%D8%A7%D8%A8%D9%84+%D9%83%D8%B4%D8%AE%D8%A9+%D9%8A%D8%A7%D8%B9%D9%8A%D8%A7%D9%84%D8%8C+%D8%A7%D9%84%D9%85%D9%83%D9%84%D8%A7%D8%8C+%D8%A7%D9%84%D9%8A%D9%85%D9%86&ftid=0x3de8e5121df0b77b:0x17a2f38c265e252c&entry=gps&shh=CAE&lucs=,94297699,94284505,94231188,94280568,47071704,94218641,94282134,94286869&g_ep=CAISEjI2LjE0LjAuODkxOTAzMTgwMBgAIIgnKkgsOTQyOTc2OTksOTQyODQ1MDUsOTQyMzExODgsOTQyODA1NjgsNDcwNzE3MDQsOTQyMTg2NDEsOTQyODIxMzQsOTQyODY4NjlCAllF&skid=268a804a-f7f9-4c89-9c80-704c38783351&g_st=iw"
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
