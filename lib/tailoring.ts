// Thobe design options, measurement fields, and the unified WhatsApp
// order-message builder shared by every ordering flow on the site.

import { BRAND, SHOW_PRICES, formatPrice, type Product } from "@/lib/constants"

export type Option = { id: string; label: string; hint?: string; image?: string }

const img = (name: string) => `/design-options/${name}.webp`

// Tailoring styles approved by the shop.
export const THOBE_STYLES: Option[] = [
  { id: "saudi", label: "تفصيل سعودي" },
  { id: "qatari", label: "تفصيل قطري" },
  { id: "kuwaiti", label: "تفصيل كويتي" },
  { id: "emirati", label: "تفصيل إماراتي" },
]

// Colors approved by the shop. Availability per fabric is confirmed on order.
export const FABRIC_COLORS: (Option & { swatch: string })[] = [
  { id: "white", label: "أبيض", swatch: "#ffffff" },
  { id: "cream", label: "سكري", swatch: "#f1ead8" },
  { id: "beige", label: "بيج", swatch: "#d9c7a7" },
  { id: "desert", label: "صحراوي", swatch: "#c2a477" },
  { id: "grey", label: "رصاصي", swatch: "#8a8f96" },
  { id: "navy", label: "كحلي", swatch: "#1b2a4a" },
  { id: "black", label: "أسود", swatch: "#151515" },
  { id: "other", label: "لون آخر", hint: "اكتبه", swatch: "conic-gradient(#f1ead8,#8a8f96,#1b2a4a,#c2a477,#f1ead8)" },
]

// Fabric patterns approved by the shop.
export const PATTERNS: (Option & { popular?: boolean })[] = [
  { id: "bisht_threads", label: "خيوط البشت", hint: "الأكثر طلباً", popular: true },
  { id: "honeycomb", label: "خلية النحل" },
  { id: "honeycomb_striped", label: "خلية مع مقلم" },
  { id: "striped", label: "مقلم" },
  { id: "lined", label: "مخطط" },
  { id: "checks", label: "كاروهات" },
  { id: "plain", label: "سادة / بدون نقشة" },
]

// Approved collar models (shop reference sheet).
export const COLLARS: Option[] = [
  { id: "regular", label: "رقبة عادي", image: img("collar-regular") },
  { id: "chinese", label: "رقبة صيني", image: img("collar-chinese") },
  { id: "formal", label: "قلاب رسمي", image: img("collar-formal") },
  { id: "formal2", label: "قلاب رسمي 2", image: img("collar-formal-2") },
  { id: "french", label: "قلاب فرنسي", image: img("collar-french") },
]

// Approved cuff / sleeve models.
export const SLEEVES: Option[] = [
  { id: "plain", label: "سادة", image: img("cuff-plain") },
  { id: "plain_open", label: "سادة مفتوح", image: img("cuff-plain-open") },
  { id: "cufflink_formal", label: "كبك رسمي", image: img("cuff-formal") },
  { id: "cufflink_french", label: "كبك فرنسي", hint: "يدجبزور", image: img("cuff-french") },
  { id: "half_sleeve", label: "نص كم" },
]

// Approved placket (جبزور) / button models.
export const BUTTONS: Option[] = [
  { id: "square_visible", label: "مربع باين", hint: "أزرار ظاهرة", image: img("placket-square-visible") },
  { id: "triangle_visible", label: "مثلث باين", hint: "أزرار ظاهرة", image: img("placket-triangle-visible") },
  { id: "square_hidden", label: "مربع مخفي", hint: "أزرار مخفية", image: img("placket-square-hidden") },
  { id: "triangle_hidden", label: "مثلث مخفي", hint: "أزرار مخفية", image: img("placket-triangle-hidden") },
  { id: "square_zipper", label: "مربع سحاب", hint: "بسحاب", image: img("placket-square-zipper") },
  { id: "triangle_zipper", label: "مثلث سحاب", hint: "بسحاب", image: img("placket-triangle-zipper") },
]

// Approved chest-pocket models.
export const POCKETS: Option[] = [
  { id: "square", label: "مربع", image: img("pocket-square") },
  { id: "slanted", label: "مشطوف", image: img("pocket-slanted") },
  { id: "round", label: "دائري", image: img("pocket-round") },
  { id: "hidden", label: "مخفي", image: img("pocket-hidden") },
]

export function optionLabel(opts: Option[], id: string | undefined) {
  return opts.find((o) => o.id === id)?.label ?? ""
}

export type MeasurementKey = "length" | "shoulder" | "sleeve" | "width" | "neck" | "armhole" | "midArm" | "cuff"

/** Measurement unit used by the shop: inches. */
export const MEASUREMENT_UNIT = "إنش"

// The shop's approved measurements, in inches.
export const MEASUREMENT_FIELDS: { key: MeasurementKey; label: string; hint: string }[] = [
  { key: "length", label: "الطول", hint: "من أعلى الكتف حتى الكعب" },
  { key: "shoulder", label: "الكتف", hint: "من طرف الكتف إلى الطرف الآخر" },
  { key: "sleeve", label: "طول اليد", hint: "من الكتف حتى المعصم" },
  { key: "width", label: "العرض", hint: "عرض الثوب عند الصدر" },
  { key: "neck", label: "الرقبة", hint: "محيط قاعدة الرقبة" },
  { key: "armhole", label: "فتح اليد (الإبط)", hint: "اتساع الكم عند الإبط" },
  { key: "midArm", label: "وسط اليد", hint: "اتساع الكم عند منتصف الذراع" },
  { key: "cuff", label: "أسفل اليد (الكبك)", hint: "اتساع فتحة الكم عند المعصم" },
]

export type Measurements = Partial<Record<MeasurementKey, string>>

export type MeasurementProfile = {
  name: string
  phone: string
  city: string
  measurements: Measurements
  notes?: string
  savedAt: string
}

// ── Local measurement storage (this device only) ──────────────
// v2: inches and the approved measurement set.
const STORAGE_KEY = "qs_measurement_profile_v2"

export function loadProfile(): MeasurementProfile | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as MeasurementProfile
    return parsed && typeof parsed === "object" && parsed.measurements ? parsed : null
  } catch {
    return null
  }
}

export function saveProfile(profile: MeasurementProfile): boolean {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile))
    return true
  } catch {
    return false
  }
}

export function clearProfile() {
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

export function hasMeasurements(m: Measurements | undefined) {
  return !!m && Object.values(m).some((v) => v && v.trim() !== "")
}

// ── Unified WhatsApp message ──────────────────────────────────
export type OrderDetails = {
  kind: "design" | "fabric" | "reorder" | "measurements"
  /** Sequential number issued by /api/orders (never generated client-side). */
  orderNumber?: string
  name?: string
  phone?: string
  city?: string
  fabric?: Pick<Product, "title" | "price" | "currency"> | { title: string; price?: number; currency?: string }
  color?: string
  pattern?: string
  style?: string
  collar?: string
  sleeve?: string
  buttons?: string
  pocket?: string
  extras?: string[]
  measurementStatus?: string
  measurements?: Measurements
  quantity?: number
  notes?: string
}

const KIND_TITLE: Record<OrderDetails["kind"], string> = {
  design: "طلب تفصيل ثوب",
  fabric: "طلب قماش وتفصيل",
  reorder: "طلب إعادة تفصيل بالمقاسات المحفوظة",
  measurements: "حفظ مقاسات لدى المحل",
}

export function formatMeasurements(m: Measurements | undefined) {
  if (!m) return []
  return MEASUREMENT_FIELDS.filter((f) => m[f.key] && m[f.key]!.trim() !== "").map(
    (f) => `• ${f.label}: ${m[f.key]!.trim()} ${MEASUREMENT_UNIT}`,
  )
}

export function buildOrderMessage(o: OrderDetails) {
  const lines: string[] = []
  lines.push(`*${KIND_TITLE[o.kind]} – ${BRAND.name}*`)
  if (o.orderNumber) lines.push(`رقم الطلب: ${o.orderNumber}`)
  lines.push("")

  const customer: string[] = []
  if (o.name) customer.push(`الاسم: ${o.name}`)
  if (o.phone) customer.push(`رقم التواصل: ${o.phone}`)
  if (o.city) customer.push(`المدينة: ${o.city}`)
  if (customer.length) lines.push("*بيانات العميل*", ...customer, "")

  const thobe: string[] = []
  if (o.fabric) {
    const price = SHOW_PRICES && o.fabric.price ? ` (${formatPrice(o.fabric.price, o.fabric.currency)})` : ""
    thobe.push(`القماش: ${o.fabric.title}${price}`)
  }
  if (o.color) thobe.push(`اللون المطلوب: ${o.color}`)
  if (o.pattern) thobe.push(`النقشة: ${o.pattern}`)
  if (o.style) thobe.push(`الطراز: ${o.style}`)
  if (o.collar) thobe.push(`الياقة: ${o.collar}`)
  if (o.sleeve) thobe.push(`الأكمام: ${o.sleeve}`)
  if (o.buttons) thobe.push(`الأزرار (الجبزور): ${o.buttons}`)
  if (o.pocket) thobe.push(`الجيب: ${o.pocket}`)
  if (o.extras && o.extras.length) thobe.push(`تفاصيل إضافية: ${o.extras.join("، ")}`)
  if (o.quantity) thobe.push(`الكمية: ${o.quantity} ${o.quantity === 1 ? "ثوب" : "ثياب"}`)
  if (thobe.length) lines.push("*تفاصيل الثوب*", ...thobe, "")

  const meas = formatMeasurements(o.measurements)
  if (o.measurementStatus || meas.length) {
    lines.push(meas.length ? `*المقاس (بالإنش)*` : "*المقاس*")
    if (o.measurementStatus) lines.push(o.measurementStatus)
    lines.push(...meas, "")
  }

  if (o.notes && o.notes.trim()) lines.push("*ملاحظات*", o.notes.trim(), "")

  lines.push("أرجو تأكيد الطلب والسعر وموعد الاستلام. شكراً.")
  return lines.join("\n")
}

// ── Validation helpers ─────────────────────────────────────────
export const REQUIRED_MEASUREMENTS: MeasurementKey[] = ["length", "shoulder", "sleeve", "width", "neck"]

/** Converts Arabic-Indic / Persian digits to Latin digits. */
export function normalizeDigits(s: string) {
  return s
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 0x06f0))
}

/**
 * Accepts Yemeni mobiles (7XXXXXXXX, with or without +967/00967) and
 * international numbers written with + or 00 (8–15 digits).
 */
export function validatePhone(raw: string): { ok: boolean; normalized: string } {
  const s = normalizeDigits(raw).trim()
  const intl = /^(\+|00)/.test(s)
  let d = s.replace(/[^\d]/g, "")
  if (d.startsWith("00")) d = d.slice(2)
  if (/^7\d{8}$/.test(d)) return { ok: true, normalized: `+967${d}` }
  if (/^9677\d{8}$/.test(d)) return { ok: true, normalized: `+${d}` }
  if (intl && d.length >= 8 && d.length <= 15 && !d.startsWith("967")) return { ok: true, normalized: `+${d}` }
  return { ok: false, normalized: "" }
}

export function samePhone(a: string, b: string) {
  const x = validatePhone(a)
  const y = validatePhone(b)
  return x.ok && y.ok && x.normalized === y.normalized
}

export function measurementError(value: string | undefined) {
  if (!value || !value.trim()) return "مطلوب"
  const n = Number(normalizeDigits(value))
  if (!Number.isFinite(n) || n < 3 || n > 80) return "قيمة غير منطقية (3–80 إنش)"
  return ""
}
