"use client"

import Link from "next/link"
import { MapPin, Phone } from "lucide-react"
import { Logo } from "@/components/site/logo"
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/site/brand-icons"
import { NAV_LINKS } from "@/components/navigation"
import { BRAND, CONTACT, FULL_ADDRESS, whatsappHref } from "@/lib/constants"
import { EVENTS, trackEvent, trackWhatsAppClick } from "@/lib/analytics"

export function FooterSection() {
  return (
    <footer className="navy-gradient border-t border-white/10 pb-28 pt-16 text-silver-light sm:pb-12">
      <div className="container-site grid gap-12 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div className="space-y-5">
          <Logo size={56} />
          <p className="max-w-sm leading-relaxed text-silver">
            {BRAND.tagline}. نستقبل طلبات العملاء في المكلا ومن خارجها.
          </p>
          <p className="silver-text text-xl font-extrabold">{BRAND.slogan}</p>
        </div>

        <nav aria-label="روابط الموقع">
          <h2 className="mb-4 text-sm font-bold tracking-widest text-sky">روابط سريعة</h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-3 md:grid-cols-1">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="mb-4 text-sm font-bold tracking-widest text-sky">تواصل معنا</h2>
          <ul className="space-y-3">
            <li>
              <a
                href={whatsappHref("السلام عليكم، لدي استفسار عن تفصيل ثوب.")}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("whatsapp_general", "footer")}
                className="flex items-center gap-3 hover:text-white"
              >
                <WhatsAppIcon className="size-5 text-sky" />
                <span>واتساب الطلبات: <span dir="ltr">{CONTACT.whatsappDisplay}</span></span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${CONTACT.phone}`}
                onClick={() => trackEvent(EVENTS.phoneClick, { placement: "footer" })}
                className="flex items-center gap-3 hover:text-white"
              >
                <Phone className="size-5 text-sky" aria-hidden="true" />
                <span>اتصال مباشر: <span dir="ltr">{CONTACT.phoneDisplay}</span></span>
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-sky" aria-hidden="true" />
              <span className="leading-relaxed">{FULL_ADDRESS}</span>
            </li>
          </ul>
          <div className="mt-5 flex gap-2">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="إنستغرام قمة الشياكة"
              onClick={() => trackEvent(EVENTS.socialClick, { network: "instagram", placement: "footer" })}
              className="flex size-11 items-center justify-center rounded-xl border border-white/15 hover:border-sky hover:text-sky"
            >
              <InstagramIcon />
            </a>
            <a
              href={CONTACT.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="تيك توك قمة الشياكة"
              onClick={() => trackEvent(EVENTS.socialClick, { network: "tiktok", placement: "footer" })}
              className="flex size-11 items-center justify-center rounded-xl border border-white/15 hover:border-sky hover:text-sky"
            >
              <TikTokIcon />
            </a>
          </div>
        </div>
      </div>

      <div className="container-site mt-12 border-t border-white/10 pt-6 text-sm text-silver-dark">
        © {new Date().getFullYear()} {BRAND.fullName}. جميع الحقوق محفوظة.
      </div>
    </footer>
  )
}
