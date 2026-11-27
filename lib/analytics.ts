import { track } from "@vercel/analytics"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void
  }
}

type EventProperties = Record<string, string | number | boolean | null>

export function trackEvent(name: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return

  window.dataLayer ??= []
  window.dataLayer.push({ event: name, ...properties })
  // Also reported to Google Analytics 4 when NEXT_PUBLIC_GA_ID is configured.
  window.gtag?.("event", name, properties)
  track(name, properties)
}

export type WhatsAppIntent =
  | "whatsapp_order"
  | "whatsapp_booking"
  | "whatsapp_measurement"
  | "whatsapp_fabric"
  | "whatsapp_general"
  | "whatsapp_design_order"
  | "whatsapp_reorder"

export function trackWhatsAppClick(intent: WhatsAppIntent, placement: string) {
  trackEvent(intent, { placement })
  if (typeof window === "undefined") return

  window.gtag?.("event", "conversion", {
    send_to: "AW-18082853572/Q_umCKiWrKAcEMTlya5D",
    event_category: "engagement",
    event_label: `${intent}:${placement}`,
  })
}

/** Named funnel events used across the site (kept in one place to avoid typos). */
export const EVENTS = {
  fabricListView: "fabric_list_view",
  fabricDetailsClick: "fabric_details_click",
  fabricDetailView: "fabric_detail_view",
  fabricSearch: "fabric_search",
  designStart: "design_start",
  designStep: "design_step",
  orderSubmit: "order_submit",
  measurementsSaved: "measurements_saved",
  measurementsCleared: "measurements_cleared",
  phoneClick: "phone_click",
  socialClick: "social_click",
  mapClick: "map_click",
} as const
