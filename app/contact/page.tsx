import type { Metadata } from "next"
import Image from "next/image"
import { MapPin, Navigation2, Phone, Truck } from "lucide-react"
import { PageHeader } from "@/components/site/page-header"
import { JsonLd } from "@/components/json-ld"
import { ContactChannels } from "@/components/contact-channels"
import { TrackedLink } from "@/components/tracked-link"
import { CONTACT, FULL_ADDRESS, IMAGES, SITE_URL } from "@/lib/constants"
import { EVENTS } from "@/lib/analytics"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

export const metadata: Metadata = {
  title: "تواصل معنا – موقع المحل في المكلا الشرج",
  description:
    "تواصل مع قمة الشياكة للخياطة الرجالية عبر واتساب أو الاتصال المباشر، أو زرنا في المكلا – الشرج، نهاية الشارع الرابع مقابل كشخة ياعيال. نستقبل الطلبات من خارج المكلا.",
  alternates: { canonical: "/contact" },
  openGraph: { url: `${SITE_URL}/contact`, title: "تواصل معنا | قمة الشياكة" },
}

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "تواصل معنا", path: "/contact" }])} />
      <PageHeader
        eyebrow="نحن قريبون منك"
        title="تواصل معنا"
        description="اختر الطريقة الأسهل لك. أسرع طريقة للطلب هي واتساب."
        breadcrumb={[{ href: "/contact", label: "تواصل معنا" }]}
      />

      <section className="bg-ivory pb-16">
        <div className="container-site">
          <ContactChannels />

          <div className="mt-6 flex items-start gap-4 rounded-2xl border-2 border-sky/40 bg-sky-soft p-5 text-navy">
            <Truck className="mt-0.5 size-7 shrink-0 text-navy-soft" aria-hidden="true" />
            <div>
              <h2 className="type-h3">نستقبل طلبات العملاء من خارج المكلا</h2>
              <p className="mt-1">
                أرسل اختيارك ومقاساتك عبر واتساب، ونتواصل معك لتأكيد التفاصيل والسعر وطريقة الاستلام.{" "}
                <TrackedLink href="/measurements" event="outside_mukalla_click" className="font-semibold underline underline-offset-4">
                  أرسل مقاساتك من هنا
                </TrackedLink>
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="overflow-hidden rounded-3xl border border-navy/10 bg-white">
              <iframe
                src={CONTACT.mapsEmbed}
                className="block h-80 w-full sm:h-[26rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="خريطة موقع قمة الشياكة في المكلا – الشرج"
                allowFullScreen
              />
            </div>
            <div className="card-surface flex flex-col p-6">
              <h2 className="type-h3 flex items-center gap-2 text-navy">
                <MapPin className="size-6 text-navy-soft" aria-hidden="true" />
                موقع المحل ({CONTACT.address.note})
              </h2>
              <address className="mt-3 not-italic text-navy">{FULL_ADDRESS}</address>
              <Image src={IMAGES.storefront} alt="واجهة محل قمة الشياكة" width={395} height={422} className="mt-4 h-48 w-full rounded-xl object-cover object-top" sizes="(max-width: 1024px) 100vw, 33vw" />
              <div className="mt-5 grid gap-3">
                <TrackedLink
                  href={CONTACT.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  event={EVENTS.mapClick}
                  properties={{ placement: "contact_page" }}
                  className="btn btn-navy"
                >
                  <Navigation2 className="size-5" aria-hidden="true" />
                  افتح الاتجاهات في Google Maps
                </TrackedLink>
                <TrackedLink href={`tel:${CONTACT.phone}`} event={EVENTS.phoneClick} properties={{ placement: "contact_map_card" }} className="btn btn-outline-dark">
                  <Phone className="size-5" aria-hidden="true" />
                  اتصل قبل الزيارة
                </TrackedLink>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
