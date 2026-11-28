"use client"

import { ArrowUpLeft, MapPin, MessageSquareQuote } from "lucide-react"
import { CONTACT, REVIEW_LINKS } from "@/lib/constants"
import { trackEvent } from "@/lib/analytics"

const ORDINALS = ["الأول", "الثاني", "الثالث", "الرابع", "الخامس", "السادس"]

/**
 * Links to real customer reviews on the shop's Google Maps listing.
 * Only the links are shown — no names, texts or stars are copied onto the site,
 * so each review is read exactly as it was published on Google.
 */
export function GoogleReviewsSection() {
  return (
    <section id="reviews" className="bg-ivory py-16 sm:py-24" aria-labelledby="reviews-title">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow !text-navy-soft">من Google Maps</p>
          <h2 id="reviews-title" className="type-h2 mt-2 text-navy">
            آراء عملائنا وتقييماتهم
          </h2>
          <p className="mt-3 text-muted-foreground text-pretty">
            تجارب حقيقية كتبها عملاؤنا بأنفسهم على خرائط Google. اضغط على أي تقييم لقراءته كاملاً كما نُشر.
          </p>
        </div>

        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REVIEW_LINKS.map((href, i) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("review_link_click", { index: i + 1 })}
                aria-label={`اقرأ تقييم العميل ${ORDINALS[i] ?? i + 1} على Google Maps (يفتح في نافذة جديدة)`}
                className="group relative flex h-full min-h-20 items-center gap-4 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm transition-[border-color,box-shadow] hover:border-sky hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky sm:min-h-36 sm:flex-col sm:items-start sm:justify-between sm:gap-6 sm:p-5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-navy text-sky">
                  <MessageSquareQuote className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1 sm:flex-none">
                  <span className="block font-semibold text-navy">تقييم العميل {ORDINALS[i] ?? i + 1}</span>
                  <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-navy-soft group-hover:text-navy">
                    اقرأ التقييم على Google Maps
                    <ArrowUpLeft className="size-4" aria-hidden="true" />
                  </span>
                </span>
                <span className="num text-2xl font-bold text-silver sm:absolute sm:left-5 sm:top-5 sm:text-3xl" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <a
            href={CONTACT.mapsAllReviews}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackEvent("reviews_all_click")}
            className="btn btn-navy justify-center"
          >
            <MapPin className="size-5" aria-hidden="true" />
            عرض جميع التقييمات على Google Maps
          </a>
          <p className="text-sm text-muted-foreground">تُفتح التقييمات في خرائط Google.</p>
        </div>
      </div>
    </section>
  )
}
