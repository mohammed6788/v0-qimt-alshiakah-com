import { track } from "@vercel/analytics"
import { GA_ALLOWED_HOSTS, GA_MEASUREMENT_ID } from "@/lib/constants"

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

// The site only reports what it can actually observe. A WhatsApp order message
// being opened is a *lead*, not a sale:
//   1. whatsapp_click / whatsapp_order_start  → sent from the site (this file)
//   2. order_confirmed (shop staff confirmed) → NOT sent from the site
//   3. purchase (real revenue)                → NOT sent from the site
// Stages 2 and 3 are recorded later from the shop's own records, using the
// order reference (QS-0001…) — see docs/analytics/README.md.
export type GaEventName = "view_fabric" | "select_fabric" | "design_thobe" | "whatsapp_click" | "whatsapp_order_start"

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
  // Estimated order value, kept apart from GA4's revenue/value fields on purpose.
  "estimated_value",
  "estimated_currency",
  "order_ref",
])

/** Order references look like QS-0001; anything else is dropped. */
const ORDER_REF = /^QS-\d{4,8}$/

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
    if (k === "order_ref") {
      if (typeof v === "string" && ORDER_REF.test(v)) out[k] = v
      continue
    }
    const safe = safeValue(v)
    if (safe !== undefined) out[k] = safe
  }
  return out
}

declare global {
  interface Window {
    __gaEnabled?: boolean
    /** Set only on the allowed host when the URL has ?ga_debug=1. */
    __gaDebug?: boolean
  }
}

/** Sends one GA4 event to the site's GA4 stream only (not to Google Ads). */
export function gaEvent(name: GaEventName, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || !window.__gaEnabled || !window.gtag) return
  // Second, independent host check (the loader in app/layout.tsx is the first).
  if (!(GA_ALLOWED_HOSTS as readonly string[]).includes(window.location.hostname)) return
  // debug_mode on the event itself: gtag does not reliably mark events from the config-level
  // setting alone, and DebugView only shows events that carry it.
  window.gtag("event", name, { ...gaParams(params), ...(window.__gaDebug && { debug_mode: true }), send_to: GA_MEASUREMENT_ID })
}

export type WhatsAppIntent =
  | "whatsapp_order"
  | "whatsapp_booking"
  | "whatsapp_measurement"
  | "whatsapp_fabric"
  | "whatsapp_general"
  | "whatsapp_design_order"
  | "whatsapp_reorder"

/** WhatsApp links that start an order are reported as whatsapp_order_start instead of whatsapp_click. */
const ORDER_INTENTS: WhatsAppIntent[] = ["whatsapp_design_order", "whatsapp_reorder"]

/**
 * Google Ads conversion AW-18082853572/Q_umCKiWrKAcEMTlya5D — unchanged.
 * It measures the START of a WhatsApp conversation only (a lead), never a confirmed
 * order or a sale: no value, currency or transaction id is sent with it.
 * Fired for every WhatsApp contact; for order links, once per distinct order
 * (see trackWhatsAppOrderStart). The intent names (e.g. "whatsapp_design_order")
 * are internal labels for "opened WhatsApp with an order message".
 */
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

// Orders already reported in this page session (one per distinct order).
const startedOrders = new Set<string>()

type OrderStartParams = {
  flow: "design" | "reorder"
  fabric?: string
  quantity?: number
  customer_type?: string
  measure_mode?: string
  city_type?: string
  orderRef?: string | null
  /** Price × quantity shown to the customer; an estimate until the shop confirms. */
  estimatedValue?: number
}

/**
 * The customer opened WhatsApp with a ready order message. This is the start of a
 * conversation, not a confirmed order or a sale. Reported once per distinct order:
 * tapping "send" again for the same order is not counted again (GA4 or Google Ads).
 * Returns true when it was reported.
 */
export function trackWhatsAppOrderStart(
  orderKey: string,
  intent: Extract<WhatsAppIntent, "whatsapp_design_order" | "whatsapp_reorder">,
  placement: string,
  p: OrderStartParams,
) {
  if (startedOrders.has(orderKey)) {
    trackEvent(intent, { placement, repeat: true })
    return false
  }
  startedOrders.add(orderKey)
  const params = {
    flow: p.flow,
    fabric: p.fabric,
    quantity: p.quantity,
    customer_type: p.customer_type,
    measure_mode: p.measure_mode,
    city_type: p.city_type,
    numbered: !!p.orderRef,
    order_ref: p.orderRef ?? undefined,
    ...(p.estimatedValue !== undefined && { estimated_value: p.estimatedValue, estimated_currency: "YER" }),
  }
  const internal = Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined)) as EventProperties
  trackEvent(EVENTS.whatsappOrderStart, internal)
  gaEvent("whatsapp_order_start", params)
  trackWhatsAppClick(intent, placement) // keeps the existing Google Ads conversion
  return true
}

/** Named funnel events used across the site (kept in one place to avoid typos). */
export const EVENTS = {
  fabricListView: "fabric_list_view",
  fabricDetailsClick: "fabric_details_click",
  fabricDetailView: "fabric_detail_view",
  fabricSearch: "fabric_search",
  designStart: "design_start",
  designStep: "design_step",
  whatsappOrderStart: "whatsapp_order_start",
  measurementsSent: "measurements_sent",
  measurementsSaved: "measurements_saved",
  measurementsCleared: "measurements_cleared",
  phoneClick: "phone_click",
  socialClick: "social_click",
  mapClick: "map_click",
} as const
