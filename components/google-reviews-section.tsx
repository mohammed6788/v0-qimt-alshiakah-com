import { ExternalLink, MapPin, Quote, Star } from "lucide-react"
import { CONTACT, GOOGLE_REVIEWS } from "@/lib/constants"

function Stars({ value, className }: { value: number; className?: string }) {
  return (
    <span className={`inline-flex gap-0.5 ${className ?? ""}`} role="img" aria-label={`${value} من 5 نجوم`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`size-4 ${i <= value ? "fill-amber-400 text-amber-400" : "text-silver"}`} aria-hidden="true" />
      ))}
    </span>
  )
}

/** Reviews copied from the shop's Google Maps listing, with links to read and add more. */
export function GoogleReviewsSection() {
  const reviews = GOOGLE_REVIEWS
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <section id="reviews" className="bg-ivory py-16 sm:py-24" aria-labelledby="reviews-title">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow !text-navy-soft">آراء عملائنا على Google</p>
            <h2 id="reviews-title" className="type-h2 mt-2 text-navy">
              كلامهم عنّا… أهم من كلامنا
            </h2>
            {reviews.length > 0 && (
              <p className="mt-3 flex items-center gap-2 text-navy">
                <span className="num text-xl font-bold">{avg.toFixed(1)}</span>
                <Stars value={Math.round(avg)} />
                <span className="text-sm text-muted-foreground">من تقييمات Google</span>
              </p>
            )}
          </div>
          <a href={CONTACT.maps} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark shrink-0">
            <MapPin className="size-5" aria-hidden="true" />
            {reviews.length ? "كل التقييمات على Google" : "اقرأ تقييماتنا على Google"}
            <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>

        {reviews.length > 0 ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <li key={i} className="card-surface flex flex-col p-5">
                <Quote className="size-6 text-sky" aria-hidden="true" />
                <p className="mt-3 flex-1 text-navy text-pretty">{r.text}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-navy/10 pt-3">
                  <span className="font-semibold text-navy">{r.author}</span>
                  <Stars value={r.rating} />
                </div>
                {r.date && <p className="mt-1 text-xs text-muted-foreground">{r.date}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <div className="card-surface mt-8 flex flex-col items-center gap-3 p-8 text-center">
            <Stars value={5} className="[&_svg]:size-6" />
            <p className="type-title text-navy">جرّبت تفصيلنا؟ شاركنا رأيك على Google</p>
            <p className="max-w-lg text-muted-foreground">تقييمك يساعد غيرك يختار خياطه بثقة، ويساعدنا نتطور. افتح صفحتنا على خرائط Google واضغط «كتابة مراجعة».</p>
          </div>
        )}
      </div>
    </section>
  )
}
