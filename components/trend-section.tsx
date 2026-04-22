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
          <div className="flex gap-4 pt-4">
            <div className="flex items-center justify-center w-32 h-32 rounded-lg bg-gold/10 border border-gold/30">
              <span className="text-gold font-bold text-center text-sm">نقشة خلية النحل</span>
            </div>
            <div className="flex items-center justify-center w-32 h-32 rounded-lg bg-gold/10 border border-gold/30">
              <span className="text-gold font-bold text-center text-sm">تفاصيل دقيقة</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gold blur-3xl opacity-10 rounded-2xl" />
          <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 p-12">
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <span className="text-5xl mb-4">✨</span>
              <h3 className="text-2xl font-bold text-gold">جودة فاخرة</h3>
              <p className="text-gray-400 mt-2">أقمشة يابانية وكورية وتايلاندية</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
