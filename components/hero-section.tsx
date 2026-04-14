import Link from "next/link"

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center text-center px-4 pt-20 min-h-[90vh]"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1594932224828-94e00507ed63?q=80&w=2000&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 leading-tight text-balance">
          هنا تبدأ أناقتك… <br />
          <span className="gold-gradient">وهنا تُفصّل هيبتك</span>
        </h1>
        <p className="text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed text-pretty">
          في قمة الشياكة، ما نبيع قماش… <br />
          نصنع حضورك من أول نظرة.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#design"
            className="btn-gold px-8 sm:px-10 py-4 rounded-lg text-black font-bold text-lg"
          >
            اطلب ثوبك الآن
          </Link>
          <Link
            href="#gallery"
            className="bg-white/10 backdrop-blur-md border border-white/20 px-8 sm:px-10 py-4 rounded-lg text-white font-bold text-lg hover:bg-white/20 transition"
          >
            شاهد الموديلات
          </Link>
        </div>
      </div>
    </section>
  )
}
