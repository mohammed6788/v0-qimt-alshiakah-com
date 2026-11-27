import type { Metadata } from "next"
import { ClipboardCheck, Lock, RotateCcw, Ruler, Smartphone, UserRound } from "lucide-react"
import { MeasurementsManager } from "@/components/measurements-manager"
import { PageHeader } from "@/components/site/page-header"
import { CtaBand } from "@/components/site/cta-band"
import { JsonLd } from "@/components/json-ld"
import { SITE_URL } from "@/lib/constants"
import { MEASUREMENT_FIELDS } from "@/lib/tailoring"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

export const metadata: Metadata = {
  title: "حفظ المقاسات وإعادة الطلب",
  description:
    "احفظ مقاسات ثوبك مرة واحدة وأعد طلب التفصيل من قمة الشياكة دون إعادة أخذ المقاس في كل مرة. مناسب للعملاء داخل المكلا وخارجها.",
  alternates: { canonical: "/measurements" },
  openGraph: { url: `${SITE_URL}/measurements`, title: "حفظ المقاسات وإعادة الطلب | قمة الشياكة" },
}

const JOURNEY = [
  { icon: UserRound, title: "سجّل بياناتك", text: "اسمك ورقم تواصلك، بموافقتك فقط." },
  { icon: Ruler, title: "احفظ مقاساتك", text: "أدخلها بنفسك أو نأخذها لك في المحل." },
  { icon: Smartphone, title: "استرجعها متى شئت", text: "تبقى محفوظة على جهازك ولدينا عند إرسالها." },
  { icon: RotateCcw, title: "أعد الطلب بضغطة", text: "اختر القماش والكمية ويصلنا طلبك عبر واتساب." },
]

const TIPS = [
  "استخدم شريط قياس قماشي (متر خياط) وليس مسطرة حديدية.",
  "قِف بشكل مستقيم وبملابس خفيفة، واطلب المساعدة من شخص آخر إن أمكن.",
  "لا تشدّ الشريط بقوة على الجسم ولا تتركه مرتخياً.",
  "إن كان لديك ثوب مقاسه مضبوط عليك، يمكنك قياسه وإرسال مقاساته.",
  "إن لم تكن متأكداً من مقاس ما، اتركه فارغاً وسنستكمله معك.",
]

export default function MeasurementsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "المقاسات", path: "/measurements" }])} />
      <PageHeader
        eyebrow="خدمة حصرية"
        title={<>مقاساتك محفوظة… <span className="text-sky">وطلبك القادم أسهل</span></>}
        description="نقدّم خدمة حفظ المقاسات إلكترونياً، لتعيد طلب ثوبك مستقبلاً دون الحاجة لأخذ المقاسات في كل مرة — سواء كنت في المكلا أو خارجها."
        breadcrumb={[{ href: "/measurements", label: "المقاسات" }]}
      />

      <section className="bg-ivory pb-16">
        <div className="container-site">
          <ol className="-mt-8 grid grid-cols-2 gap-3 sm:-mt-10 lg:grid-cols-4">
            {JOURNEY.map((j, i) => (
              <li key={j.title} className="card-surface p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-navy text-sky">
                    <j.icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-xs font-semibold text-silver-dark">الخطوة {i + 1}</span>
                </div>
                <h2 className="type-title mt-3 text-navy">{j.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{j.text}</p>
              </li>
            ))}
          </ol>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
            <MeasurementsManager />

            <aside className="space-y-4">
              <div className="card-surface p-5">
                <h2 className="type-title flex items-center gap-2 text-navy">
                  <Lock className="size-5 text-navy-soft" aria-hidden="true" />
                  أين تُحفظ بياناتك؟
                </h2>
                <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                  <li>• عند الضغط على «احفظ على جهازي» تُحفظ البيانات في متصفحك على هذا الجهاز فقط، ولا تُرفع إلى أي خادم.</li>
                  <li>• عند الضغط على «أرسل مقاساتي للمحل» تصلنا رسالة واتساب منك، ونحتفظ بمقاساتك لدينا لطلباتك القادمة.</li>
                  <li>• يمكنك حذف البيانات من جهازك في أي وقت.</li>
                </ul>
              </div>
              <div className="card-surface p-5">
                <h2 className="type-title flex items-center gap-2 text-navy">
                  <ClipboardCheck className="size-5 text-navy-soft" aria-hidden="true" />
                  من خارج المكلا؟
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  أرسل مقاساتك عبر النموذج، ونتواصل معك لتأكيد التفاصيل وطريقة الاستلام.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section id="guide" className="bg-white py-16">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow !text-navy-soft">دليل القياس</p>
            <h2 className="type-h2 mt-2 text-navy">كيف تأخذ مقاساتك بدقة؟</h2>
            <ul className="mt-6 space-y-3">
              {TIPS.map((t) => (
                <li key={t} className="flex gap-3 text-navy">
                  <span className="mt-2 size-2 shrink-0 rounded-full bg-sky" aria-hidden="true" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <dl className="grid gap-3 sm:grid-cols-2">
            {MEASUREMENT_FIELDS.map((f) => (
              <div key={f.key} className="rounded-xl border border-navy/10 p-4">
                <dt className="font-semibold text-navy">{f.label}</dt>
                <dd className="mt-1 text-sm text-muted-foreground">{f.hint}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <CtaBand title="مقاساتك جاهزة؟" text="صمّم ثوبك الجديد الآن، وسنستخدم مقاساتك المحفوظة تلقائياً." placement="measurements_cta" />
    </>
  )
}
