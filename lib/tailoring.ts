// Thobe design options, measurement fields, and the unified WhatsApp
// order-message builder shared by every ordering flow on the site.

import { BRAND, formatPrice, type Product } from "@/lib/constants"

export type Option = { id: string; label: string; hint?: string }

// Thobe styles as listed on the shop signboard.
export const THOBE_STYLES: Option[] = [
  { id: "saudi", label: "سعودي" },
  { id: "emirati", label: "إماراتي" },
  { id: "kuwaiti", label: "كويتي" },
  { id: "consult", label: "أحتاج استشارة", hint: "نقترح عليك الأنسب" },
]

export const FABRIC_COLORS: (Option & { swatch: string })[] = [
  { id: "white", label: "أبيض", swatch: "#ffffff" },
  { id: "offwhite", label: "أوف وايت", swatch: "#f3efe4" },
  { id: "cream", label: "سكري / بيج", swatch: "#e3d6bd" },
  { id: "lightgrey", label: "رمادي فاتح", swatch: "#c9ccd1" },
  { id: "grey", label: "رمادي", swatch: "#8e939a" },
  { id: "sky", label: "سماوي فاتح", swatch: "#cfe6f3" },
  { id: "navy", label: "كحلي", swatch: "#1b2a4a" },
  { id: "other", label: "لون آخر", swatch: "conic-gradient(#f3efe4,#c9ccd1,#1b2a4a,#cfe6f3,#f3efe4)" },
]

export const COLLARS: Option[] = [
  { id: "classic", label: "ياقة كلاسيك مرتفعة", hint: "الشكل التقليدي للثوب السعودي" },
  { id: "mandarin", label: "ياقة صينية (مكة)", hint: "ياقة دائرية بدون قلاب" },
  { id: "folded", label: "ياقة قلاب", hint: "ياقة بطيّة مثل القميص" },
  { id: "consult", label: "حسب الاستشارة" },
]

export const SLEEVES: Option[] = [
  { id: "buttons", label: "كم بأزرار" },
  { id: "cufflinks", label: "كم كبك", hint: "لأزرار الكبك" },
  { id: "plain", label: "كم سادة" },
  { id: "consult", label: "حسب الاستشارة" },
]

export const BUTTONS: Option[] = [
  { id: "visible", label: "أزرار ظاهرة" },
  { id: "hidden", label: "أزرار مخفية" },
  { id: "consult", label: "حسب الاستشارة" },
]

export const EXTRAS: Option[] = [
  { id: "chest_pocket", label: "جيب صدر" },
  { id: "side_pockets", label: "جيوب جانبية" },
  { id: "phone_pocket", label: "جيب جوال داخلي" },
  { id: "pen_slot", label: "فتحة قلم" },
]

export type MeasurementKey =
  | "length"
  | "shoulder"
  | "chest"
  | "waist"
  | "sleeve"
  | "neck"
  | "wrist"
  | "bottom"

export const MEASUREMENT_FIELDS: { key: MeasurementKey; label: string; hint: string }[] = [
  { key: "length", label: "طول الثوب", hint: "من أعلى الكتف حتى الكعب" },
  { key: "shoulder", label: "عرض الكتف", hint: "من طرف الكتف إلى الطرف الآخر" },
  { key: "chest", label: "محيط الصدر", hint: "حول أعرض جزء من الصدر" },
  { key: "waist", label: "محيط الوسط", hint: "حول البطن عند السرة" },
  { key: "sleeve", label: "طول الكم", hint: "من الكتف حتى المعصم" },
  { key: "neck", label: "محيط الرقبة", hint: "حول قاعدة الرقبة" },
  { key: "wrist", label: "محيط المعصم", hint: "لفتحة الكم" },
  { key: "bottom", label: "عرض الذيل", hint: "عرض أسفل الثوب" },
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
const STORAGE_KEY = "qs_measurement_profile_v1"

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

// ── Order reference ────────────────────────────────────────────
// Generated in the browser so the customer and the shop can refer to
// the same request in WhatsApp. It is a reference, not a stored record.
export function generateOrderRef(date = new Date()) {
  const y = String(date.getFullYear()).slice(2)
  const m = String(date.getMonth() + 1).padStart(2, "0")
  const d = String(date.getDate()).padStart(2, "0")
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `QS-${y}${m}${d}-${rand}`
}

// ── Unified WhatsApp message ──────────────────────────────────
export type OrderDetails = {
  kind: "design" | "fabric" | "reorder" | "measurements"
  ref?: string
  name?: string
  phone?: string
  city?: string
  fabric?: Pick<Product, "title" | "price" | "currency"> | { title: string; price?: number; currency?: string }
  color?: string
  style?: string
  collar?: string
  sleeve?: string
  buttons?: string
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
    (f) => `• ${f.label}: ${m[f.key]!.trim()} سم`,
  )
}

export function buildOrderMessage(o: OrderDetails) {
  const lines: string[] = []
  lines.push(`*${KIND_TITLE[o.kind]} – ${BRAND.name}*`)
  if (o.ref) lines.push(`الرقم المرجعي: ${o.ref}`)
  lines.push("")

  const customer: string[] = []
  if (o.name) customer.push(`الاسم: ${o.name}`)
  if (o.phone) customer.push(`رقم التواصل: ${o.phone}`)
  if (o.city) customer.push(`المدينة: ${o.city}`)
  if (customer.length) lines.push("*بيانات العميل*", ...customer, "")

  const thobe: string[] = []
  if (o.fabric) {
    const price = o.fabric.price ? ` (${formatPrice(o.fabric.price, o.fabric.currency)})` : ""
    thobe.push(`القماش: ${o.fabric.title}${price}`)
  }
  if (o.color) thobe.push(`اللون: ${o.color}`)
  if (o.style) thobe.push(`الطراز: ${o.style}`)
  if (o.collar) thobe.push(`الياقة: ${o.collar}`)
  if (o.sleeve) thobe.push(`الأكمام: ${o.sleeve}`)
  if (o.buttons) thobe.push(`الأزرار: ${o.buttons}`)
  if (o.extras && o.extras.length) thobe.push(`إضافات: ${o.extras.join("، ")}`)
  if (o.quantity) thobe.push(`الكمية: ${o.quantity} ${o.quantity === 1 ? "ثوب" : "ثياب"}`)
  if (thobe.length) lines.push("*تفاصيل الثوب*", ...thobe, "")

  const meas = formatMeasurements(o.measurements)
  if (o.measurementStatus || meas.length) {
    lines.push("*المقاس*")
    if (o.measurementStatus) lines.push(o.measurementStatus)
    lines.push(...meas, "")
  }

  if (o.notes && o.notes.trim()) lines.push("*ملاحظات*", o.notes.trim(), "")

  lines.push("أرجو تأكيد الطلب والسعر النهائي وموعد الاستلام. شكراً.")
  return lines.join("\n")
}
