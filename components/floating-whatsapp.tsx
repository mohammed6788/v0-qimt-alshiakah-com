"use client"

import Link from "next/link"
import { MessageCircle, Phone } from "lucide-react"
import { CONTACT, whatsappHref } from "@/lib/constants"
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics"

export function FloatingWhatsApp() {
  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex gap-2 rounded-2xl border border-white/10 bg-black/90 p-2 shadow-2xl backdrop-blur-md sm:hidden">
      <Link
        href={whatsappHref("السلام عليكم، أرغب في حجز تفصيل ثوب. ما خطوات الطلب؟")}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackWhatsAppClick("whatsapp_booking", "mobile_sticky_cta")}
        className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-green-500 px-4 font-bold text-white"
      >
        <MessageCircle className="size-5" aria-hidden="true" /> اطلب عبر واتساب
      </Link>
      <Link
        href={`tel:${CONTACT.phone}`}
        onClick={() => trackEvent("phone_click", { placement: "mobile_sticky_cta" })}
        className="flex min-h-12 items-center justify-center rounded-xl border border-white/20 px-4 text-white"
        aria-label="اتصال مباشر"
      >
        <Phone className="size-5" aria-hidden="true" />
      </Link>
    </div>
  )
}
