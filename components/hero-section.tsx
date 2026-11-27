import Image from "next/image"
import { Clock, Layers, MapPin, Ruler, Scissors } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { BRAND, IMAGES } from "@/lib/constants"
import { EVENTS } from "@/lib/analytics"

const PROMISES = [
  { icon: Clock, title: "سرعة في الإنجاز", text: "ودقة في مواعيد التسليم" },
  { icon: Ruler, title: "مقاساتك محفوظة", text: "يراجعها موظفنا عند إعادة الطلب" },
  { icon: MapPin, title: "داخل المكلا وخارجها", text: "اطلب من أي مكان" },
]

export function HeroSection() {
  return (
    <section id="home" className="navy-gradient relative isolate overflow-hidden pt-24 text-white sm:pt-28">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#c3c9d3_0_1px,transparent_1px_22px)]"
        aria-hidden="true"
      />
      <div className="container-site grid items-center gap-10 pb-12 lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pb-20">
        <div className="motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
          <p className="eyebrow mb-5 rounded-full border border-sky/30 bg-white/5 px-4 py-2">
            <MapPin className="size-4" aria-hidden="true" />
            خياطة رجالية في المكلا · الشرج
          </p>
          <h1 className="type-hero">
            ثوبك يُفصَّل لك
            <span className="silver-text block pb-1">بدقة تليق بحضورك</span>
          </h1>
          <p className="mt-4 max-w-xl text-base text-silver text-pretty">
            {BRAND.tagline}. اختر قماشك، صمّم تفاصيل ثوبك، وأرسل طلبك عبر واتساب بسهولة.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <TrackedLink href="/design" event={EVENTS.designStart} properties={{ placement: "hero" }} className="btn btn-primary min-h-14 px-8">
              <Scissors className="size-5" aria-hidden="true" />
              صمم ثوبك
            </TrackedLink>
            <TrackedLink href="/fabrics" event="hero_fabrics_click" className="btn btn-outline-light min-h-14 px-8">
              <Layers className="size-5" aria-hidden="true" />
              استكشف الأقمشة
            </TrackedLink>
          </div>

          <p className="mt-6 text-sm font-medium text-silver-dark">— {BRAND.slogan}</p>
        </div>

        <div className="relative mx-auto w-full max-w-xl motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 motion-safe:duration-700">
          <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-br from-sky/25 via-transparent to-silver/10 blur-2xl" aria-hidden="true" />
          <div className="overflow-hidden rounded-[1.75rem] border border-white/10 shadow-2xl">
            <Image
              src={IMAGES.heroThobe}
              alt="ثوب رجالي أبيض مفصّل على مجسم في مشغل قمة الشياكة"
              width={572}
              height={384}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
              className="h-auto w-full"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 bg-navy-deep/60">
        <ul className="container-site grid grid-cols-3 divide-x divide-white/10 py-5">
          {PROMISES.map((p) => (
            <li key={p.title} className="flex flex-col items-center gap-2 px-2 text-center sm:flex-row sm:gap-3 sm:text-start">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky/10 text-sky">
                <p.icon className="size-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block text-sm font-semibold sm:text-base">{p.title}</span>
                <span className="hidden text-sm text-silver sm:block">{p.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
