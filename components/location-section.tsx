import Image from "next/image"
import { MapPin, Navigation2, Truck } from "lucide-react"
import { TrackedLink } from "@/components/tracked-link"
import { CONTACT, FULL_ADDRESS, IMAGES } from "@/lib/constants"
import { EVENTS } from "@/lib/analytics"

export function LocationSection() {
  return (
    <section id="location" className="bg-ivory py-16 sm:py-24">
      <div className="container-site grid items-center gap-10 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md lg:order-2">
          <Image
            src={IMAGES.storefront}
            alt="واجهة محل قمة الشياكة للخياطة الرجالية في الشرج، المكلا"
            width={395}
            height={422}
            sizes="(max-width: 1024px) 100vw, 448px"
            className="h-auto w-full rounded-3xl shadow-xl"
          />
          <span className="absolute -bottom-4 right-6 rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white shadow-lg">{CONTACT.address.note}</span>
        </div>
        <div>
          <p className="eyebrow !text-navy-soft">زورونا</p>
          <h2 className="type-h2 mt-2 text-navy">محلنا في المكلا – الشرج</h2>
          <p className="mt-4 flex items-start gap-2 text-base text-navy">
            <MapPin className="mt-1 size-5 shrink-0 text-navy-soft" aria-hidden="true" />
            {FULL_ADDRESS}
          </p>
          <div className="mt-6 flex items-start gap-3 rounded-2xl bg-white p-4 text-navy shadow-sm">
            <Truck className="mt-0.5 size-6 shrink-0 text-navy-soft" aria-hidden="true" />
            <p>
              <strong>من خارج المكلا؟</strong> نستقبل طلبك ومقاساتك عبر واتساب ونرتّب معك التفاصيل.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <TrackedLink href={CONTACT.maps} target="_blank" rel="noopener noreferrer" event={EVENTS.mapClick} properties={{ placement: "home_location" }} className="btn btn-navy">
              <Navigation2 className="size-5" aria-hidden="true" />
              الاتجاهات في الخريطة
            </TrackedLink>
            <TrackedLink href="/contact" event="home_contact_click" className="btn btn-outline-dark">
              كل وسائل التواصل
            </TrackedLink>
          </div>
        </div>
      </div>
    </section>
  )
}
