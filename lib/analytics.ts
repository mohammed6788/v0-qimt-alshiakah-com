import { track } from "@vercel/analytics"
import { GA_MEASUREMENT_ID } from "@/lib/constants"

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (command: string, eventName: string, parameters?: Record<string, unknown>) => void
  }
}

type EventProperties = Record<string, string | number | boolean | null>

/** Internal funnel event (Vercel Analytics + dataLayer). Not sent to GA4 — see gaEvent. */
export function trackEvent(name: string, properties: EventProperties = {}) {
  if (typeof window === "undefined") return

  window.dataLayer ??= []
  window.dataLayer.push({ event: name, ...properties })
  track(name, properties)
}

// ─────────────────────────────────────────────────────────────
// Google Analytics 4
// page_view is sent automatically by GA4 (first load + every client-side
// route change via enhanced measurement), so it is never sent manually here.
// Only the events below reach GA4, and only with whitelisted, non-personal
// parameters: no names, phone numbers, measurements or free text.
// ─────────────────────────────────────────────────────────────

export type GaEventName = "view_fabric" | "select_fabric" | "design_thobe" | "whatsapp_click" | "order_submit"

const GA_PARAMS = new Set([
  "fabric",
  "placement",
  "intent",
  "flow",
  "quantity",
  "customer_type",
  "measure_mode",
  "city_type",
  "numbered",
  "value",
  "currency",
])

/** Rejects anything that could be personal data (phone-like digit runs, e-mails) and long text. */
function safeValue(v: unknown): string | number | boolean | undefined {
  if (typeof v === "number") return Number.isFinite(v) ? v : undefined
  if (typeof v === "boolean") return v
  if (typeof v !== "string") return undefined
  const s = v.trim()
  if (!s || s.length > 60 || /\d{6,}/.test(s.replace(/[\s-]/g, "")) || s.includes("@")) return undefined
  return s
}

export function gaParams(params: Record<string, unknown>) {
  const out: Record<string, string | number | boolean> = {}
  for (const [k, v] of Object.entries(params)) {
    if (!GA_PARAMS.has(k)) continue
    const safe = safeValue(v)
    if (safe !== undefined) out[k] = safe
  }
  return out
}

declare global {
  interface Window {
    __gaEnabled?: boolean
  }
}

/** Sends one GA4 event to the site's GA4 stream only (not to Google Ads). */
export function gaEvent(name: GaEventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.__gaEnabled || !window.gtag) return
  window.gtag("event", name, { ...gaParams(params), send_to: GA_MEASUREMENT_ID })
}

export type WhatsAppIntent =
  | "whatsapp_order"
  | "whatsapp_booking"
  | "whatsapp_measurement"
  | "whatsapp_fabric"
  | "whatsapp_general"
  | "whatsapp_design_order"
  | "whatsapp_reorder"

/** WhatsApp links that submit an order are reported as order_submit instead of whatsapp_click. */
const ORDER_INTENTS: WhatsAppIntent[] = ["whatsapp_design_order", "whatsapp_reorder"]

export function trackWhatsAppClick(intent: WhatsAppIntent, placement: string) {
  trackEvent(intent, { placement })
  if (typeof window === "undefined") return
  if (!ORDER_INTENTS.includes(intent)) gaEvent("whatsapp_click", { intent, placement })

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
