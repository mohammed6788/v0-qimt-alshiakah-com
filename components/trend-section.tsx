import Image from "next/image"

export function TrendSection() {
  return (
    <section className="bg-black py-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-gold font-bold tracking-widest uppercase text-sm">
            وصل حديثاً
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-6 italic">
            ترند 2026 وصل
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl leading-relaxed mb-8">
            قماش خلية النحل مع مقلم <br />
            أناقة هادئة… لكن تأثيرها صاخب
          </p>
          <div className="flex gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gold/30">
              <Image
                src="https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=400"
                alt="قماش خلية نحل"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gold/30">
              <Image
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400"
                alt="تفاصيل الثوب"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gold blur-3xl opacity-10" />
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=800"
              alt="ثوب جاهز فخم"
              width={800}
              height={600}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
