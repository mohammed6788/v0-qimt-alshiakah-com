"use client"

import { Phone } from "lucide-react"
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from "@/components/site/brand-icons"
import { CONTACT, whatsappHref } from "@/lib/constants"
import { EVENTS, trackEvent, trackWhatsAppClick } from "@/lib/analytics"

const CHANNELS = [
  {
    id: "whatsapp",
    title: "واتساب الطلبات",
    value: CONTACT.whatsappDisplay,
    href: whatsappHref("السلام عليكم، أرغب في الاستفسار عن تفصيل ثوب."),
    icon: WhatsAppIcon,
    primary: true,
    external: true,
  },
  { id: "phone", title: "اتصال مباشر", value: CONTACT.phoneDisplay, href: `tel:${CONTACT.phone}`, icon: Phone, external: false },
  { id: "instagram", title: "إنستغرام", value: "تابع أحدث الأقمشة", href: CONTACT.instagram, icon: InstagramIcon, external: true },
  { id: "tiktok", title: "تيك توك", value: "@qimtalshiakah", href: CONTACT.tiktok, icon: TikTokIcon, external: true },
] as const

export function ContactChannels() {
  return (
    <ul className="-mt-8 grid grid-cols-2 gap-3 sm:-mt-10 lg:grid-cols-4">
      {CHANNELS.map((c) => (
        <li key={c.id}>
          <a
            href={c.href}
            {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
            onClick={() => {
              if (c.id === "whatsapp") trackWhatsAppClick("whatsapp_general", "contact_page")
              else if (c.id === "phone") trackEvent(EVENTS.phoneClick, { placement: "contact_page" })
              else trackEvent(EVENTS.socialClick, { network: c.id, placement: "contact_page" })
            }}
            className={
              "card-surface flex h-full flex-col items-start gap-3 p-4 transition-colors sm:p-5 " +
              ("primary" in c && c.primary ? "!border-[#25D366]/40 !bg-[#25D366] text-white" : "hover:border-navy/30")
            }
          >
            <span className={"flex size-11 items-center justify-center rounded-xl " + ("primary" in c && c.primary ? "bg-white/20" : "bg-navy text-sky")}>
              <c.icon className="size-5" />
            </span>
            <span>
              <span className={"block font-extrabold " + ("primary" in c && c.primary ? "" : "text-navy")}>{c.title}</span>
              <span className={"block text-sm " + ("primary" in c && c.primary ? "text-white/90" : "text-muted-foreground")} dir="auto">
                {c.value}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  )
}
