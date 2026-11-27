"use client"

import { Phone } from "lucide-react"
import { SOCIAL_ICONS, WhatsAppIcon } from "@/components/site/brand-icons"
import { CONTACT, SOCIAL_LINKS, whatsappHref } from "@/lib/constants"
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
] as const

/** All social accounts share one username. */
export function SocialRow({ placement }: { placement: string }) {
  return (
    <div className="card-surface mt-3 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
      <p className="font-semibold text-navy">
        تابعنا على جميع المنصات: <span dir="ltr" className="text-navy-soft">@{CONTACT.handle}</span>
      </p>
      <ul className="flex flex-wrap gap-2">
        {SOCIAL_LINKS.map((l) => {
          const Icon = SOCIAL_ICONS[l.id]
          return (
            <li key={l.id}>
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l.label}
                title={l.label}
                onClick={() => trackEvent(EVENTS.socialClick, { network: l.id, placement })}
                className="flex size-11 items-center justify-center rounded-xl bg-navy text-sky transition-colors hover:bg-navy-soft"
              >
                <Icon />
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function ContactChannels() {
  return (
    <>
    <ul className="-mt-8 grid grid-cols-2 gap-3 sm:-mt-10">
      {CHANNELS.map((c) => (
        <li key={c.id}>
          <a
            href={c.href}
            {...(c.external && { target: "_blank", rel: "noopener noreferrer" })}
            onClick={() => {
              if (c.id === "whatsapp") trackWhatsAppClick("whatsapp_general", "contact_page")
              else trackEvent(EVENTS.phoneClick, { placement: "contact_page" })
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
              <span className={"block font-semibold " + ("primary" in c && c.primary ? "" : "text-navy")}>{c.title}</span>
              <span className={"block text-sm " + ("primary" in c && c.primary ? "text-white/90" : "text-muted-foreground")} dir="auto">
                {c.value}
              </span>
            </span>
          </a>
        </li>
      ))}
    </ul>
    <SocialRow placement="contact_page" />
    </>
  )
}
