import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ChevronLeft, Ruler, Scissors } from "lucide-react"
import { AvailabilityBadge, FabricCard, PriceBlock, fabricWhatsAppMessage } from "@/components/fabric-card"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { TrackView } from "@/components/track-view"
import { TrackedLink } from "@/components/tracked-link"
import { JsonLd } from "@/components/json-ld"
import { BRAND, PRODUCTS, SHOW_PRICES, SITE_URL, getProduct, whatsappHref } from "@/lib/constants"
import { EVENTS } from "@/lib/analytics"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) return {}
  const title = `قماش ${p.title}${p.origin ? ` – ${p.origin}` : ""}`
  const description = `${p.description}. اطلب قماش ${p.title} وتفصيل ثوبك الرجالي من قمة الشياكة في المكلا عبر واتساب.`
  return {
    title,
    description,
    alternates: { canonical: `/fabrics/${p.slug}` },
    openGraph: { title: `${title} | ${BRAND.name}`, description, url: `${SITE_URL}/fabrics/${p.slug}`, images: [{ url: p.image, alt: p.title }] },
    twitter: { images: [p.image] },
  }
}

export default async function FabricDetailPage({ params }: Params) {
  const { slug } = await params
  const product = getProduct(slug)
  if (!product) notFound()

  const related = PRODUCTS.filter((p) => p.slug !== product.slug)
    .sort((a, b) => Number(b.origin === product.origin) - Number(a.origin === product.origin))
    .slice(0, 3)

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    alternateName: product.titleEn,
    description: product.description,
    image: product.image,
    category: "أقمشة ثياب رجالية",
    ...(product.origin && { countryOfOrigin: product.origin }),
    brand: { "@type": "Brand", name: BRAND.name },
    ...(SHOW_PRICES ? { offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "YER",
      url: `${SITE_URL}/fabrics/${product.slug}`,
      seller: { "@id": `${SITE_URL}/#business` },
      ...(product.availability && {
        availability: {
          in_stock: "https://schema.org/InStock",
          limited: "https://schema.org/LimitedAvailability",
          out_of_stock: "https://schema.org/OutOfStock",
        }[product.availability],
      }),
    } } : {}),
  }

  return (
    <>
      <TrackView event={EVENTS.fabricDetailView} properties={{ fabric: product.slug }} />
      <JsonLd data={productSchema} />
      <JsonLd
        data={breadcrumbSchema([
          { name: "الأقمشة", path: "/fabrics" },
          { name: product.title, path: `/fabrics/${product.slug}` },
        ])}
      />

      <div className="bg-navy pt-20" />
      <section className="bg-ivory pb-16 pt-6 sm:pt-10">
        <div className="container-site">
          <nav aria-label="مسار التصفح" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1">
              <li><Link href="/" className="hover:text-navy">الرئيسية</Link></li>
              <li className="flex items-center gap-1"><ChevronLeft className="size-4" aria-hidden="true" /><Link href="/fabrics" className="hover:text-navy">الأقمشة</Link></li>
              <li className="flex items-center gap-1" aria-current="page"><ChevronLeft className="size-4" aria-hidden="true" /><span className="font-bold text-navy">{product.title}</span></li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-silver-light motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
              <Image
                src={product.image}
                alt={`قماش ${product.title}${product.origin ? ` – ${product.origin}` : ""}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-sm font-bold text-white">قماش {product.type}</span>
                <AvailabilityBadge product={product} className="text-sm" />
              </div>
              <h1 className="mt-4 text-3xl font-extrabold text-navy sm:text-4xl">{product.title}</h1>
              <p className="mt-1 text-sm font-medium tracking-wide text-silver-dark" dir="ltr" lang="en">{product.titleEn}</p>
              <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{product.description}.</p>

              <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-5">
                <PriceBlock product={product} large />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-muted-foreground">نوع القماش</dt>
                    <dd className="mt-1 font-extrabold text-navy">{product.type}</dd>
                  </div>
                  {product.origin && (
                    <div>
                      <dt className="text-xs text-muted-foreground">المنشأ</dt>
                      <dd className="mt-1 font-extrabold text-navy">{product.origin}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-4 border-t border-navy/10 pt-4 text-sm text-muted-foreground">
                  للسعر والألوان المتوفرة وموعد التسليم، تواصل معنا عبر واتساب.
                </p>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <WhatsAppLink
                  href={whatsappHref(fabricWhatsAppMessage(product))}
                  intent="whatsapp_fabric"
                  placement={`fabric_detail_${product.slug}`}
                  className="btn btn-navy"
                >
                  <WhatsAppIcon />
                  اطلب هذا القماش عبر واتساب
                </WhatsAppLink>
                <TrackedLink
                  href={`/design?fabric=${product.slug}`}
                  event={EVENTS.designStart}
                  properties={{ placement: "fabric_detail", fabric: product.slug }}
                  className="btn btn-outline-dark"
                >
                  <Scissors className="size-5" aria-hidden="true" />
                  صمم ثوبك بهذا القماش
                </TrackedLink>
              </div>

              <ul className="mt-8 space-y-3 text-navy">
                {[
                  "تفصيل حسب مقاسك بدقة",
                  "إمكانية حفظ مقاساتك لإعادة الطلب لاحقاً",
                  "نستقبل الطلبات من داخل المكلا وخارجها",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-3">
                    <span className="flex size-6 items-center justify-center rounded-full bg-sky-soft text-navy-soft">
                      <Check className="size-4" aria-hidden="true" />
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <Link href="/measurements" className="mt-6 inline-flex items-center gap-2 font-bold text-navy-soft underline-offset-4 hover:underline">
                <Ruler className="size-4" aria-hidden="true" />
                كيف أرسل مقاساتي؟
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-site">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="text-2xl font-extrabold text-navy sm:text-3xl">أقمشة أخرى قد تعجبك</h2>
            <Link href="/fabrics" className="shrink-0 text-sm font-bold text-navy-soft hover:underline">كل الأقمشة</Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <FabricCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
