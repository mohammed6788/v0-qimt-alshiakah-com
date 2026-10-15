import { track } from "@vercel/analytics"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, eventName: string, parameters?: Record<string, string>) => void
  }
}

type EventProperties = Record<string, string | number | boolean | null>

export function trackEvent(name: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return

  window.dataLayer ??= []
  window.dataLayer.push({ event: name, ...properties })
  track(name, properties)
}

export type WhatsAppIntent =
  | "whatsapp_order"
  | "whatsapp_booking"
  | "whatsapp_measurement"
  | "whatsapp_fabric"
  | "whatsapp_general"

export function trackWhatsAppClick(intent: WhatsAppIntent, placement: string) {
  trackEvent(intent, { placement })
  if (typeof window === "undefined") return

  window.gtag?.("event", "conversion", {
    send_to: "AW-18082853572/Q_umCKiWrKAcEMTlya5D",
    event_category: "engagement",
    event_label: `${intent}:${placement}`,
  })
}
