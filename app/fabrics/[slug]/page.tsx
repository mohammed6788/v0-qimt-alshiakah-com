import Image from "next/image"
import type { Metadata } from "next"
import { FabricImage } from "@/components/fabric-image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Check, ChevronLeft, Ruler, Scissors } from "lucide-react"
import { AvailabilityBadge, FabricCard, PriceBlock, fabricWhatsAppMessage } from "@/components/fabric-card"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { TrackView } from "@/components/track-view"
import { TrackedLink } from "@/components/tracked-link"
import { JsonLd } from "@/components/json-ld"
import { BRAND, PRODUCTS, SHOW_PRICES, SITE_URL, getProduct, whatsappHref, colorCount } from "@/lib/constants"
import { EVENTS } from "@/lib/analytics"
import { breadcrumbSchema } from "@/lib/breadcrumbs"
import { pageOpenGraph } from "@/lib/seo"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const p = getProduct(slug)
  if (!p) return {}
  const name = p.title.startsWith("قماش") ? p.title : `قماش ${p.title}`
  const title = `${name}${p.origin ? ` – ${p.origin}` : ""}`
  const description = `${p.description}. اطلب ${p.title} وتفصيل ثوبك الرجالي من قمة الشياكة في المكلا عبر واتساب.`
  return {
    title,
    description,
    alternates: { canonical: `/fabrics/${p.slug}` },
    openGraph: pageOpenGraph(`/fabrics/${p.slug}`, `${title} | ${BRAND.name}`, description, p.image ? { url: p.image, alt: p.title } : undefined),
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
    description: product.description,
    ...(product.image && { image: `${SITE_URL}${product.image}` }),
    category: "أقمشة ثياب رجالية",
    ...(product.origin && { countryOfOrigin: product.origin }),
    brand: { "@type": "Brand", name: BRAND.name },
    ...(SHOW_PRICES && product.price !== undefined ? { offers: {
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
              <li className="flex items-center gap-1" aria-current="page"><ChevronLeft className="size-4" aria-hidden="true" /><span className="font-semibold text-navy">{product.title}</span></li>
            </ol>
          </nav>

          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-silver-light motion-safe:animate-in motion-safe:fade-in motion-safe:duration-500">
              <FabricImage product={product} alt={`${product.title.startsWith("قماش") ? product.title : `قماش ${product.title}`}${product.origin ? ` – ${product.origin}` : ""}`} priority sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-navy px-3 py-1 text-sm font-semibold text-white">قماش {product.type}</span>
                <AvailabilityBadge product={product} className="text-sm" />
              </div>
              <h1 className="type-h1 mt-4 text-navy">{product.title}</h1>
              <p className="mt-4 text-base text-muted-foreground">{product.description}.</p>

              <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-5">
                <PriceBlock product={product} large />
                <dl className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs text-muted-foreground">نوع القماش</dt>
                    <dd className="type-title mt-1 text-navy">{product.type}</dd>
                  </div>
                  {product.origin && (
                    <div>
                      <dt className="text-xs text-muted-foreground">المنشأ</dt>
                      <dd className="type-title mt-1 text-navy">{product.origin}</dd>
                    </div>
                  )}
                </dl>
                <p className="mt-4 border-t border-navy/10 pt-4 text-sm text-muted-foreground">
                  توفّر اللون وموعد التسليم يؤكدهما فريقنا عبر واتساب قبل اعتماد الطلب.
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
              <Link href="/measurements" className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-soft underline-offset-4 hover:underline">
                <Ruler className="size-4" aria-hidden="true" />
                كيف أرسل مقاساتي؟
              </Link>
            </div>
          </div>
        </div>
      </section>

      {product.colorOptions && product.colorOptions.length > 0 && (
        <section className="bg-ivory pb-16" aria-labelledby="colors-heading">
          <div className="container-site">
            <h2 id="colors-heading" className="type-h2 text-navy">الألوان المتوفرة ({colorCount(product.colorOptions.length)})</h2>
            <p className="mt-2 text-muted-foreground">اختر اللون برقمه عند الطلب، ويؤكد فريقنا توفّره قبل اعتماد الطلب.</p>
            <ul className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {product.colorOptions.map((o) => (
                <li key={o.id} className="overflow-hidden rounded-2xl border border-navy/10 bg-white">
                  <span className="relative block aspect-[4/3]">
                    <Image src={o.image} alt={`${product.title} – ${o.label}`} fill sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw" className="object-cover" />
                  </span>
                  <span className="block px-2 py-2 text-center text-sm font-medium text-navy">
                    <span className="num text-muted-foreground">{o.number}</span> · {o.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="container-site">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="type-h2 text-navy">أقمشة أخرى قد تعجبك</h2>
            <Link href="/fabrics" className="shrink-0 text-sm font-semibold text-navy-soft hover:underline">كل الأقمشة</Link>
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
