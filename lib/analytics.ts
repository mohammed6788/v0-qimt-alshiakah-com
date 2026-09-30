import { track } from "@vercel/analytics"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, eventName: string, parameters?: Record<string, string>) => void
  }
}

export function trackWhatsAppClick(placement: string) {
  if (typeof window === "undefined") return

  window.dataLayer ??= []
  window.dataLayer.push({ event: "whatsapp_click", placement })
  track("WhatsApp Click", { placement })
  window.gtag?.("event", "conversion", {
    send_to: "AW-18082853572/Q_umCKiWrKAcEMTlya5D",
    event_category: "engagement",
    event_label: placement,
  })
}
