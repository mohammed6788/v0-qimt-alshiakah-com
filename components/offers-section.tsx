import { BadgePercent, Scissors } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { PRODUCTS, formatPrice } from "@/lib/constants"

/** Current discounts, generated from PRICES in lib/constants (no separate list to keep in sync). */
export function OffersSection() {
  const offers = PRODUCTS.filter((p) => p.price !== undefined && p.compareAtPrice !== undefined && p.compareAtPrice > p.price).sort(
    (a, b) => b.compareAtPrice! - b.price! - (a.compareAtPrice! - a.price!),
  )
  if (offers.length === 0) return null
  const best = offers[0].compareAtPrice! - offers[0].price!

  return (
    <section id="offers" className="bg-ivory py-16 sm:py-24" aria-labelledby="offers-title">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow !text-navy-soft">العروض والخصومات</p>
            <h2 id="offers-title" className="type-h2 mt-2 text-navy">
              خصومات حتى <span className="num">{formatPrice(best)}</span> على ثوبك
            </h2>
            <p className="mt-2 max-w-xl text-muted-foreground">أسعار شاملة القماش والتفصيل. العروض سارية حتى إشعار آخر.</p>
          </div>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {offers.map((p) => {
            const save = p.compareAtPrice! - p.price!
            const pct = Math.round((save / p.compareAtPrice!) * 100)
            return (
              <li key={p.slug} className="card-surface flex flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">قماش {p.type}</p>
                    <h3 className="type-title mt-1 text-navy">{p.title}</h3>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-sky-soft px-3 py-1 text-sm font-bold text-navy">
                    <BadgePercent className="size-4" aria-hidden="true" />
                    <span className="num">-{pct}%</span>
                  </span>
                </div>
                <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="num text-2xl font-bold text-navy">{formatPrice(p.price!, p.currency)}</span>
                  <del className="num text-sm text-silver-dark">{formatPrice(p.compareAtPrice!, p.currency)}</del>
                </p>
                <p className="mt-1 text-sm font-semibold text-navy-soft">
                  وفّر <span className="num">{formatPrice(save, p.currency)}</span> على كل ثوب
                </p>
                <TrackedLink
                  href={`/design?fabric=${p.slug}`}
                  event="offer_design_click"
                  properties={{ fabric: p.slug }}
                  className="btn btn-primary mt-5 min-h-11 justify-center text-sm"
                >
                  <Scissors className="size-4" aria-hidden="true" />
                  صمّم ثوبك بهذا العرض
                </TrackedLink>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
