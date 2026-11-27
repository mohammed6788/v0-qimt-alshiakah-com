import { Check, RotateCcw, Ruler, Scissors } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { EVENTS } from "@/lib/analytics"

/** Home: design-your-thobe invitation + saved-measurements highlight. */
export function DesignSection() {
  return (
    <section id="design" className="bg-white py-16 sm:py-24">
      <div className="container-site grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col rounded-3xl bg-navy p-7 text-white sm:p-10">
          <Scissors className="size-9 text-sky" aria-hidden="true" />
          <h2 className="type-h2 mt-5">ثوبك… على ذوقك</h2>
          <p className="mt-3 text-silver">اختر القماش واللون والياقة والأكمام والأزرار والإضافات، وشاهد ملخص طلبك قبل الإرسال.</p>
          <ul className="mt-6 space-y-2 text-silver-light">
            {["ثماني خطوات سهلة بيد واحدة", "ملخص واضح قبل الإرسال", "رسالة واتساب منظمة برقم طلب"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Check className="size-5 text-sky" aria-hidden="true" /> {t}
              </li>
            ))}
          </ul>
          <TrackedLink href="/design" event={EVENTS.designStart} properties={{ placement: "home_design_card" }} className="btn btn-primary mt-8 self-start">
            ابدأ تصميم ثوبك
          </TrackedLink>
        </div>

        <div className="flex flex-col rounded-3xl border-2 border-sky/40 bg-sky-soft p-7 sm:p-10">
          <span className="inline-flex items-center gap-2 self-start rounded-full bg-navy px-3 py-1 text-xs font-semibold text-sky">ميزة تميّزنا</span>
          <Ruler className="mt-5 size-9 text-navy-soft" aria-hidden="true" />
          <h2 className="type-h2 mt-4 text-navy">مقاساتك محفوظة إلكترونياً</h2>
          <p className="mt-3 text-navy/80">
            احفظ مقاساتك مرة واحدة، وأعد طلب ثوبك مستقبلاً دون إعادة القياس في كل مرة — حتى لو كنت خارج المكلا. يراجع موظفنا مقاساتك السابقة ويؤكدها معك قبل التفصيل.
          </p>
          <div className="mt-auto flex flex-col gap-3 pt-8 sm:flex-row">
            <TrackedLink href="/measurements" event="home_measurements_click" className="btn btn-navy">
              <Ruler className="size-5" aria-hidden="true" />
              احفظ مقاساتك
            </TrackedLink>
            <TrackedLink href="/measurements" event="home_reorder_click" className="btn btn-outline-dark">
              <RotateCcw className="size-5" aria-hidden="true" />
              أعد طلب ثوبك
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
