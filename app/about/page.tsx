import type { Metadata } from "next"
import Image from "next/image"
import { Clock, Gem, Ruler, Sparkles, Target, Users } from "lucide-react"
import { PageHeader } from "@/components/site/page-header"
import { CtaBand } from "@/components/site/cta-band"
import { JsonLd } from "@/components/json-ld"
import { BRAND, IMAGES, SITE_URL } from "@/lib/constants"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

export const metadata: Metadata = {
  title: "من نحن – قصة قمة الشياكة",
  description:
    "قمة الشياكة للخياطة الرجالية في المكلا: شغف بالتفصيل الدقيق، جودة وإتقان، التزام بالمواعيد، وطموح لبناء علامة متخصصة في الخياطة الرجالية.",
  alternates: { canonical: "/about" },
  openGraph: { url: `${SITE_URL}/about`, title: "من نحن | قمة الشياكة" },
}

const VALUES = [
  { icon: Gem, title: "الجودة والإتقان", text: "أقمشة مختارة وخياطة متقنة تدوم معك." },
  { icon: Ruler, title: "دقة التفصيل", text: "من أول قياس إلى آخر خيط، كل تفصيلة محسوبة." },
  { icon: Clock, title: "الالتزام بالمواعيد", text: "نحدد موعد الاستلام بوضوح ونلتزم به." },
  { icon: Users, title: "تجربة العميل", text: "استشارة صادقة، تواصل سهل، ومقاسات محفوظة لطلبك القادم." },
]

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "من نحن", path: "/about" }])} />
      <PageHeader
        eyebrow="قصتنا"
        title={<>مو مجرد خياط… <span className="text-sky">إحنا قصة أناقة</span></>}
        breadcrumb={[{ href: "/about", label: "من نحن" }]}
      />

      <section className="bg-ivory py-16">
        <div className="container-site grid items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-lg leading-loose text-navy">
            <p>
              بدأت <strong>{BRAND.name}</strong> بشغف بسيط: أن يلبس كل رجل ثوبه وهو واثق أنه مختلف.
            </p>
            <p className="text-muted-foreground">
              نهتم بأدق التفاصيل، من أول قياس… إلى آخر خيط. ومن محلنا في الشرج بالمكلا نخدم عملاءنا في المدينة ومن خارجها، ونستقبل طلباتهم بسهولة عبر واتساب.
            </p>
            <p className="text-muted-foreground">
              هدفنا؟ لما تلبس ثوبك، تحس إنك <strong className="text-navy">«نسخة أقوى منك»</strong>.
            </p>
            <p className="text-2xl font-extrabold text-navy-soft">{BRAND.slogan}</p>
          </div>
          <figure className="overflow-hidden rounded-3xl bg-navy shadow-xl">
            <Image src={IMAGES.storefront} alt="واجهة محل قمة الشياكة للخياطة الرجالية في الشرج، المكلا" width={395} height={422} sizes="(max-width: 1024px) 100vw, 50vw" className="h-auto w-full" />
            <figcaption className="p-4 text-sm text-silver">محل قمة الشياكة – الشرج، المكلا (الفرع الجديد)</figcaption>
          </figure>
        </div>
      </section>

      <section className="navy-gradient py-16 text-white">
        <div className="container-site">
          <p className="eyebrow">ما نلتزم به</p>
          <h2 className="mt-2 text-3xl font-extrabold">قيم نخيط بها كل ثوب</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                <v.icon className="size-7 text-sky" aria-hidden="true" />
                <h3 className="mt-4 text-lg font-extrabold">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-silver">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-site grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-navy/10 p-6">
            <Sparkles className="size-7 text-navy-soft" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-extrabold text-navy">ماذا نقدم؟</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              <li>• تفصيل ثياب رجالية حسب المقاس (سعودي، إماراتي، كويتي)</li>
              <li>• أقمشة ثياب مختارة من مناشئ متعددة</li>
              <li>• قسم خاص بالتعديلات وإعادة ضبط المقاسات</li>
              <li>• استشارة في اختيار القماش والتصميم المناسب</li>
              <li>• حفظ المقاسات لإعادة الطلب بسهولة</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-navy/10 p-6">
            <Target className="size-7 text-navy-soft" aria-hidden="true" />
            <h2 className="mt-3 text-xl font-extrabold text-navy">طموحنا</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              أن نبني علامة يمنية متخصصة في الخياطة الرجالية، يثق بها الرجل في المكلا وحضرموت وخارجها، ويعود إليها في كل مناسبة.
            </p>
          </div>
        </div>
      </section>

      <CtaBand placement="about_cta" />
    </>
  )
}
