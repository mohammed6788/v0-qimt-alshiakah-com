"use client"

import { usePathname } from "next/navigation"
import { Phone } from "lucide-react"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { CONTACT, whatsappHref } from "@/lib/constants"
import { EVENTS, trackEvent, trackWhatsAppClick } from "@/lib/analytics"

const MESSAGE = "السلام عليكم، أرغب في طلب تفصيل ثوب من قمة الشياكة. ما خطوات الطلب؟"

/**
 * Persistent order access:
 *  - mobile: thumb-reachable bottom bar (WhatsApp + call)
 *  - desktop: compact floating WhatsApp button
 * Hidden on /design, which has its own sticky order bar.
 */
export function FloatingWhatsApp() {
  const pathname = usePathname()
  if (pathname.startsWith("/design")) return null

  return (
    <>
      <div style={{ bottom: "max(0.75rem, env(safe-area-inset-bottom))" }} className="fixed inset-x-3 z-40 flex gap-2 rounded-2xl border border-white/10 bg-navy-deep/95 p-2 shadow-2xl backdrop-blur-md sm:hidden">
        <a
          href={whatsappHref(MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick("whatsapp_order", "mobile_sticky_bar")}
          className="btn btn-primary flex-1"
        >
          <WhatsAppIcon />
          اطلب عبر واتساب
        </a>
        <a
          href={`tel:${CONTACT.phone}`}
          onClick={() => trackEvent(EVENTS.phoneClick, { placement: "mobile_sticky_bar" })}
          className="btn btn-outline-light px-4"
          aria-label="اتصال مباشر"
        >
          <Phone className="size-5" aria-hidden="true" />
        </a>
      </div>

      <a
        href={whatsappHref(MESSAGE)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("whatsapp_order", "desktop_floating")}
        aria-label="اطلب عبر واتساب"
        className="fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-6 z-40 hidden size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-4 ring-white/30 transition-transform hover:scale-105 sm:flex"
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </>
  )
}
