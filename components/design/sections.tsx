"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Check, Info, Minus, Plus, ShieldCheck, Store, UserPlus, UserRoundCheck } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { FabricImage } from "@/components/fabric-image"
import { MeasurementFields } from "@/components/design/measurement-fields"
import { PRODUCTS, SHOW_PRICES, colorCount, colorOptionLabel, formatPrice, getProduct, whatsappHref } from "@/lib/constants"
import {
  BUTTONS,
  COLLARS,
  FABRIC_COLORS,
  PATTERNS,
  POCKETS,
  REQUIRED_MEASUREMENTS,
  SLEEVES,
  THOBE_STYLES,
  measurementError,
  samePhone,
  validatePhone,
  type MeasurementProfile,
  type Measurements,
  type Option,
} from "@/lib/tailoring"
import { cn } from "@/lib/utils"

// ── Design state ─────────────────────────────────────────────
export const CONSULT_FABRIC = "consult"

export type NewMode = "enter" | "whatsapp" | "visit"
export type ReturningMode = "shop" | "device"

export type DesignState = {
  fabric: string
  color: string
  customColor: string
  pattern: string
  style: string
  collar: string
  sleeve: string
  buttons: string
  pocket: string
  extrasNote: string
  quantity: number
  // measurements
  customerType: "" | "new" | "returning"
  newMode: "" | NewMode
  returningMode: "" | ReturningMode
  measurements: Measurements
  registeredPhone: string
  deviceVerified: boolean
}

export const initialDesign: DesignState = {
  fabric: "",
  color: "",
  customColor: "",
  pattern: "",
  style: "",
  collar: "",
  sleeve: "",
  buttons: "",
  pocket: "",
  extrasNote: "",
  quantity: 1,
  customerType: "",
  newMode: "",
  returningMode: "",
  measurements: {},
  registeredPhone: "",
  deviceVerified: false,
}

export type SectionProps = {
  st: DesignState
  set: (patch: Partial<DesignState>) => void
  showErrors?: boolean
}

/** Colors allowed for the chosen fabric (all colors until the shop confirms a list). */
/** Readable name of the chosen color (photographed fabric color, approved color, or free text). */
export function colorName(fabric: string, color: string, customColor: string) {
  if (color === "other") return customColor.trim() || "لون آخر"
  const photo = getProduct(fabric)?.colorOptions?.find((o) => o.id === color)
  if (photo) return colorOptionLabel(photo)
  return FABRIC_COLORS.find((c) => c.id === color)?.label ?? ""
}

/** Color ids valid for a fabric (used to drop a color when the fabric changes). */
function allowedColorIds(fabric: string) {
  const photos = getProduct(fabric)?.colorOptions
  if (photos?.length) return [...photos.map((o) => o.id), "other"]
  return colorsFor(fabric).list.map((c) => c.id)
}

export function colorsFor(fabric: string) {
  const confirmedIds = getProduct(fabric)?.colors
  if (!confirmedIds?.length) return { list: FABRIC_COLORS, confirmed: false }
  // A fabric whose color is fixed (e.g. Japanese white) offers only that color.
  return { list: FABRIC_COLORS.filter((c) => confirmedIds.includes(c.id)), confirmed: true }
}

/** Validates a ?fabric= catalog slug. */
export function fabricFromParam(slug: string | null): string | null {
  return slug && getProduct(slug) ? slug : null
}

/** Human-readable fabric name for the summary and the WhatsApp message. */
export function fabricLabel(fabric: string) {
  const product = getProduct(fabric)
  if (product) return product.title
  return fabric === CONSULT_FABRIC ? "أحتاج مساعدة في اختيار القماش" : ""
}

// ── Validation per section ───────────────────────────────────
export type SectionKey = "fabric" | "color" | "collar" | "sleeve" | "buttons" | "pocket" | "measure"

export function sectionError(key: SectionKey, st: DesignState): string {
  switch (key) {
    case "fabric":
      return st.fabric ? "" : "اختر القماش"
    case "color":
      if (!st.color) return "اختر اللون"
      if (st.color === "other" && !st.customColor.trim()) return "اكتب اللون المطلوب"
      return ""
    case "collar":
      if (!st.style) return "اختر نوع التفصيل"
      return st.collar ? "" : "اختر نوع الياقة"
    case "sleeve":
      return st.sleeve ? "" : "اختر تصميم الأكمام"
    case "buttons":
      return st.buttons ? "" : "اختر نوع الأزرار"
    case "pocket":
      if (!st.pocket) return "اختر نوع الجيب"
      return st.quantity >= 1 && st.quantity <= 20 ? "" : "الكمية بين 1 و 20"
    case "measure":
      if (!st.customerType) return "حدد إن كنت عميلاً جديداً أو سابقاً"
      if (st.customerType === "new") {
        if (!st.newMode) return "اختر طريقة تزويدنا بالمقاسات"
        if (st.newMode === "enter" && REQUIRED_MEASUREMENTS.some((k) => measurementError(st.measurements[k])))
          return "أكمل المقاسات المطلوبة (*) بقيم صحيحة"
        return ""
      }
      if (!st.returningMode) return "اختر مكان حفظ مقاساتك"
      if (st.returningMode === "shop") return validatePhone(st.registeredPhone).ok ? "" : "اكتب رقم الجوال المسجّل لدينا بشكل صحيح"
      return st.deviceVerified ? "" : "تحقق من رقم جوالك لاستخدام المقاسات المحفوظة"
  }
}

// ── Building blocks ──────────────────────────────────────────
function Tile({
  selected,
  onSelect,
  className,
  children,
  label,
}: {
  selected: boolean
  onSelect: () => void
  className?: string
  children: React.ReactNode
  label?: string
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onSelect}
      className={cn(
        "relative flex rounded-2xl border text-start transition-[border-color,background-color,box-shadow] duration-200",
        selected ? "border-navy bg-sky-soft shadow-[0_0_0_1px_var(--navy)]" : "border-navy/12 bg-white hover:border-navy/35",
        className,
      )}
    >
      {children}
      {selected && (
        <span className="absolute left-2.5 top-2.5 flex size-6 items-center justify-center rounded-full bg-navy text-white">
          <Check className="size-4" aria-hidden="true" />
        </span>
      )}
    </button>
  )
}

export function ImageOptionGrid({
  options,
  value,
  onChange,
  label,
  cols = "grid-cols-2 sm:grid-cols-3",
}: {
  options: Option[]
  value: string
  onChange: (id: string) => void
  label: string
  cols?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("grid gap-3", cols)}>
      {options.map((o) => (
        <Tile key={o.id} selected={value === o.id} onSelect={() => onChange(o.id)} label={o.hint ? `${o.label} – ${o.hint}` : o.label} className="flex-col items-center p-3">
          {o.image && (
            <span className="relative block aspect-square w-full max-w-[120px] overflow-hidden rounded-xl bg-white">
              <Image src={o.image} alt="" fill sizes="120px" className="object-contain p-1" />
            </span>
          )}
          <span className="mt-2 text-center font-medium text-navy">{o.label}</span>
          {o.hint && <span className="text-center text-xs text-muted-foreground">{o.hint}</span>}
        </Tile>
      ))}
    </div>
  )
}

function TextOptionGrid({ options, value, onChange, label }: { options: Option[]; value: string; onChange: (id: string) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="grid grid-cols-2 gap-3">
      {options.map((o) => (
        <Tile key={o.id} selected={value === o.id} onSelect={() => onChange(o.id)} className="min-h-14 items-center px-4 py-3">
          <span className="pe-7 font-medium text-navy">{o.label}</span>
        </Tile>
      ))}
    </div>
  )
}

function ErrorText({ show, text }: { show?: boolean; text: string }) {
  if (!show || !text) return null
  return (
    <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-destructive" role="alert">
      {text}
    </p>
  )
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="type-title mb-3 mt-6 text-navy first:mt-0">{children}</h3>
}

/** Reminder that availability and details are confirmed by the shop. */
export function AvailabilityNotice({ className }: { className?: string }) {
  return (
    <p className={cn("flex items-start gap-2.5 rounded-2xl bg-sky-soft px-4 py-3 text-sm text-navy", className)} data-testid="availability-notice">
      <Info className="mt-0.5 size-4 shrink-0 text-navy-soft" aria-hidden="true" />
      <span>توفّر القماش واللون وتفاصيل التفصيل يؤكدها فريقنا معك قبل اعتماد الطلب.</span>
    </p>
  )
}

// ── Sections ─────────────────────────────────────────────────
export function FabricSection({ st, set, showErrors }: SectionProps) {
  const pick = (id: string) => {
    // Drop a color that is not offered for the new fabric.
    const keepColor = !st.color || allowedColorIds(id).includes(st.color)
    set({ fabric: id, ...(keepColor ? {} : { color: "", customColor: "" }) })
  }
  return (
    <>
      <AvailabilityNotice className="mb-4" />
      <div role="radiogroup" aria-label="نوع القماش" className="grid gap-3 sm:grid-cols-2">
        {PRODUCTS.map((p) => (
          <Tile key={p.slug} selected={st.fabric === p.slug} onSelect={() => pick(p.slug)} label={p.title} className="min-h-20 items-center gap-3 p-2.5">
            <span className="relative block size-16 shrink-0 overflow-hidden rounded-xl bg-silver-light">
              <FabricImage product={p} sizes="64px" compact />
            </span>
            <span className="min-w-0 pe-7">
              <span className="block font-semibold text-navy">{p.title}</span>
              <span className="block text-xs text-muted-foreground">{p.description}</span>
              {SHOW_PRICES && <span className="num block text-sm font-bold text-navy">{p.price !== undefined ? formatPrice(p.price, p.currency) : "السعر عند الطلب"}</span>}
            </span>
          </Tile>
        ))}
        <Tile selected={st.fabric === CONSULT_FABRIC} onSelect={() => set({ fabric: CONSULT_FABRIC })} className="min-h-20 items-center p-4">
          <span className="pe-7">
            <span className="block font-semibold text-navy">ساعدوني في اختيار القماش</span>
            <span className="block text-sm text-muted-foreground">نقترح عليك الأنسب لمناسبتك</span>
          </span>
        </Tile>
      </div>
      <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-navy/10 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">محتار في اختيار القماش؟ راسلنا وسنقترح عليك الأنسب.</p>
        <WhatsAppLink
          href={whatsappHref("السلام عليكم، أحتاج مساعدة في اختيار قماش مناسب لتفصيل ثوب.")}
          intent="whatsapp_fabric"
          placement="design_fabric_help"
          className="btn btn-outline-dark min-h-11 shrink-0 px-4 text-sm"
        >
          <WhatsAppIcon className="size-4" />
          ساعدني في الاختيار عبر واتساب
        </WhatsAppLink>
      </div>
      <Link href="/fabrics" className="mt-3 inline-block text-sm font-semibold text-navy-soft underline-offset-4 hover:underline">
        تفاصيل كل الأقمشة
      </Link>
      <ErrorText show={showErrors} text={sectionError("fabric", st)} />
    </>
  )
}

export function ColorSection({ st, set, showErrors }: SectionProps) {
  const { list, confirmed } = colorsFor(st.fabric)
  const photos = getProduct(st.fabric)?.colorOptions
  if (photos?.length) {
    return (
      <>
        <p className="mb-4 text-sm text-muted-foreground">
          ألوان {fabricLabel(st.fabric)} المتوفرة ({colorCount(photos.length)}). يؤكد فريقنا توفّر اللون قبل اعتماد الطلب.
        </p>
        <SubHeading>اللون</SubHeading>
        <div role="radiogroup" aria-label="اللون المطلوب" className="grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
          {photos.map((o) => (
            <Tile key={o.id} selected={st.color === o.id} onSelect={() => set({ color: o.id })} label={colorOptionLabel(o)} className="flex-col overflow-hidden p-0">
              <span className="relative block aspect-[4/3] w-full">
                <Image src={o.image} alt="" fill sizes="(max-width: 640px) 33vw, 20vw" className="object-cover" />
              </span>
              <span className="px-1 py-2 text-center text-xs font-medium leading-snug text-navy sm:text-sm">
                <span className="num text-muted-foreground">{o.number}</span> · {o.label}
              </span>
            </Tile>
          ))}
          <Tile selected={st.color === "other"} onSelect={() => set({ color: "other" })} label="لون آخر" className="items-center justify-center p-3 text-center">
            <span className="text-sm font-medium text-navy">لون آخر</span>
          </Tile>
        </div>
        {st.color === "other" && (
          <label className="mt-4 block">
            <span className="field-label">اكتب اللون المطلوب</span>
            <input className="field-input" maxLength={40} value={st.customColor} onChange={(e) => set({ customColor: e.target.value })} placeholder="مثال: زيتي فاتح" />
          </label>
        )}
        <PatternPicker st={st} set={set} />
        <ErrorText show={showErrors} text={sectionError("color", st)} />
      </>
    )
  }
  return (
    <>
      <p className="mb-4 text-sm text-muted-foreground">
        {confirmed
          ? `اللون المعتمد لـ${fabricLabel(st.fabric)}.`
          : "ألواننا المعتمدة. يؤكد فريقنا توفّر اللون في القماش المختار قبل اعتماد الطلب."}
      </p>
      <SubHeading>اللون</SubHeading>
      <div role="radiogroup" aria-label="اللون المطلوب" className="grid grid-cols-4 gap-2 sm:gap-3">
        {list.map((c) => (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={st.color === c.id}
            onClick={() => set({ color: c.id })}
            className={cn(
              "flex flex-col items-center gap-2 rounded-2xl border px-1 py-3 transition-colors",
              st.color === c.id ? "border-navy bg-sky-soft shadow-[0_0_0_1px_var(--navy)]" : "border-navy/12 hover:border-navy/35",
            )}
          >
            <span className="size-10 rounded-full border border-navy/15 shadow-inner sm:size-12" style={{ background: c.swatch }} aria-hidden="true" />
            <span className="text-center text-xs font-medium leading-snug text-navy sm:text-sm">{c.label}</span>
          </button>
        ))}
      </div>
      {st.color === "other" && (
        <label className="mt-4 block">
          <span className="field-label">اكتب اللون المطلوب</span>
          <input className="field-input" maxLength={40} value={st.customColor} onChange={(e) => set({ customColor: e.target.value })} placeholder="مثال: زيتي فاتح" />
        </label>
      )}
      <PatternPicker st={st} set={set} />
      <ErrorText show={showErrors} text={sectionError("color", st)} />
    </>
  )
}

function PatternPicker({ st, set }: SectionProps) {
  return (
    <>
      <SubHeading>النقشة (اختياري)</SubHeading>
      <div role="radiogroup" aria-label="النقشة" className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {PATTERNS.map((o) => (
          <Tile key={o.id} selected={st.pattern === o.id} onSelect={() => set({ pattern: st.pattern === o.id ? "" : o.id })} label={o.label} className="min-h-14 items-center px-4 py-3">
            <span className="pe-7">
              <span className="block font-medium text-navy">{o.label}</span>
              {o.popular && <span className="mt-1 inline-block rounded-full bg-navy px-2 py-0.5 text-[11px] font-semibold text-sky">الأكثر طلباً</span>}
            </span>
          </Tile>
        ))}
      </div>
    </>
  )
}

export function CollarSection({ st, set, showErrors }: SectionProps) {
  return (
    <>
      <SubHeading>نوع التفصيل</SubHeading>
      <TextOptionGrid options={THOBE_STYLES} value={st.style} onChange={(v) => set({ style: v })} label="نوع التفصيل" />
      <SubHeading>نوع الياقة</SubHeading>
      <ImageOptionGrid options={COLLARS} value={st.collar} onChange={(v) => set({ collar: v })} label="نوع الياقة" />
      <ErrorText show={showErrors} text={sectionError("collar", st)} />
    </>
  )
}

export function SleeveSection({ st, set, showErrors }: SectionProps) {
  return (
    <>
      <ImageOptionGrid options={SLEEVES} value={st.sleeve} onChange={(v) => set({ sleeve: v })} label="تصميم الأكمام" cols="grid-cols-2" />
      <ErrorText show={showErrors} text={sectionError("sleeve", st)} />
    </>
  )
}

export function ButtonsSection({ st, set, showErrors }: SectionProps) {
  return (
    <>
      <ImageOptionGrid options={BUTTONS} value={st.buttons} onChange={(v) => set({ buttons: v })} label="نوع الأزرار" cols="grid-cols-2 sm:grid-cols-3" />
      <ErrorText show={showErrors} text={sectionError("buttons", st)} />
    </>
  )
}

export function QuantityStepper({ st, set }: SectionProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-ivory p-3">
      <span className="font-semibold text-navy" id="qty-label">
        الكمية
      </span>
      <div className="flex items-center gap-2" role="group" aria-labelledby="qty-label">
        <button type="button" className="btn btn-outline-dark size-12 bg-white px-0" onClick={() => set({ quantity: Math.max(1, st.quantity - 1) })} disabled={st.quantity <= 1} aria-label="إنقاص الكمية">
          <Minus className="size-5" aria-hidden="true" />
        </button>
        <output className="num w-10 text-center text-xl font-semibold text-navy" aria-live="polite" data-testid="qty">
          {st.quantity}
        </output>
        <button type="button" className="btn btn-outline-dark size-12 bg-white px-0" onClick={() => set({ quantity: Math.min(20, st.quantity + 1) })} disabled={st.quantity >= 20} aria-label="زيادة الكمية">
          <Plus className="size-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}

export function PocketSection(props: SectionProps) {
  const { st, set, showErrors } = props
  return (
    <>
      <SubHeading>نوع الجيب</SubHeading>
      <ImageOptionGrid options={POCKETS} value={st.pocket} onChange={(v) => set({ pocket: v })} label="نوع الجيب" cols="grid-cols-2 sm:grid-cols-4" />
      <SubHeading>تفاصيل إضافية (اختياري)</SubHeading>
      <textarea
        className="field-input min-h-20 py-3"
        maxLength={300}
        value={st.extrasNote}
        onChange={(e) => set({ extrasNote: e.target.value })}
        placeholder="مثال: جيب جوال داخلي، تطريز الاسم…"
        aria-label="تفاصيل إضافية"
      />
      <div className="mt-6">
        <QuantityStepper {...props} />
      </div>
      <ErrorText show={showErrors} text={sectionError("pocket", st)} />
    </>
  )
}

type MeasureProps = SectionProps & { saved: MeasurementProfile | null }

const NEW_MODES: { id: NewMode; label: string; hint: string }[] = [
  { id: "enter", label: "سأدخل مقاساتي الآن", hint: "بالإنش (هنش)" },
  { id: "whatsapp", label: "سأرسلها عبر واتساب", hint: "مناسب لمن هم خارج المكلا" },
  { id: "visit", label: "سأزور المحل للقياس", hint: "المكلا – الشرج" },
]

export function MeasureSection({ st, set, showErrors, saved }: MeasureProps) {
  const [verifyPhone, setVerifyPhone] = useState("")
  const [verifyError, setVerifyError] = useState("")
  const [showSaved, setShowSaved] = useState(false)
  const hasDeviceProfile = !!saved

  const verify = () => {
    if (!validatePhone(verifyPhone).ok) return setVerifyError("اكتب رقم جوال صحيح")
    if (saved && samePhone(verifyPhone, saved.phone)) {
      setVerifyError("")
      set({ deviceVerified: true, measurements: saved.measurements })
    } else {
      setVerifyError("الرقم لا يطابق المقاسات المحفوظة على هذا الجهاز. يمكنك اختيار «محفوظة لدى المحل» ليراجعها فريقنا.")
    }
  }

  return (
    <>
      <div role="radiogroup" aria-label="نوع العميل" className="grid grid-cols-2 gap-3">
        <Tile selected={st.customerType === "new"} onSelect={() => set({ customerType: "new" })} className="flex-col items-center gap-2 p-4 text-center">
          <UserPlus className="size-7 text-navy-soft" aria-hidden="true" />
          <span className="font-semibold text-navy">عميل جديد</span>
          <span className="text-xs text-muted-foreground">أول طلب لدينا</span>
        </Tile>
        <Tile selected={st.customerType === "returning"} onSelect={() => set({ customerType: "returning" })} className="flex-col items-center gap-2 p-4 text-center">
          <UserRoundCheck className="size-7 text-navy-soft" aria-hidden="true" />
          <span className="font-semibold text-navy">عميل سابق</span>
          <span className="text-xs text-muted-foreground">مقاساتي محفوظة</span>
        </Tile>
      </div>

      {st.customerType === "new" && (
        <>
          <SubHeading>كيف تزوّدنا بالمقاسات؟</SubHeading>
          <div role="radiogroup" aria-label="طريقة المقاسات" className="grid gap-3 sm:grid-cols-3">
            {NEW_MODES.map((m) => (
              <Tile key={m.id} selected={st.newMode === m.id} onSelect={() => set({ newMode: m.id })} className="min-h-16 items-center px-4 py-3">
                <span className="pe-7">
                  <span className="block font-medium text-navy">{m.label}</span>
                  <span className="block text-xs text-muted-foreground">{m.hint}</span>
                </span>
              </Tile>
            ))}
          </div>
          {st.newMode === "enter" && (
            <>
              <MeasurementFields value={st.measurements} onChange={(m) => set({ measurements: m })} showErrors={showErrors} />
              <Link href="/measurements#guide" target="_blank" className="mt-3 inline-block text-sm font-semibold text-navy-soft underline-offset-4 hover:underline">
                دليل أخذ المقاسات
              </Link>
            </>
          )}
        </>
      )}

      {st.customerType === "returning" && (
        <>
          <SubHeading>أين مقاساتك محفوظة؟</SubHeading>
          <div role="radiogroup" aria-label="مكان المقاسات المحفوظة" className="grid gap-3 sm:grid-cols-2">
            <Tile selected={st.returningMode === "shop"} onSelect={() => set({ returningMode: "shop" })} className="min-h-16 items-center gap-3 px-4 py-3">
              <Store className="size-6 shrink-0 text-navy-soft" aria-hidden="true" />
              <span className="pe-7">
                <span className="block font-medium text-navy">محفوظة لدى المحل</span>
                <span className="block text-xs text-muted-foreground">يراجعها فريقنا برقم جوالك</span>
              </span>
            </Tile>
            {hasDeviceProfile && (
              <Tile selected={st.returningMode === "device"} onSelect={() => set({ returningMode: "device" })} className="min-h-16 items-center gap-3 px-4 py-3">
                <ShieldCheck className="size-6 shrink-0 text-navy-soft" aria-hidden="true" />
                <span className="pe-7">
                  <span className="block font-medium text-navy">محفوظة على هذا الجهاز</span>
                  <span className="block text-xs text-muted-foreground">تتطلب التحقق برقم الجوال</span>
                </span>
              </Tile>
            )}
          </div>

          {st.returningMode === "shop" && (
            <label className="mt-5 block">
              <span className="field-label">
                رقم الجوال المسجّل لدينا <span className="text-destructive">*</span>
              </span>
              <input
                className={cn("field-input", showErrors && !validatePhone(st.registeredPhone).ok && "border-destructive")}
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                value={st.registeredPhone}
                onChange={(e) => set({ registeredPhone: e.target.value })}
                placeholder="7XX XXX XXX"
              />
              <span className="mt-1.5 block text-xs text-muted-foreground">
                لا يتم عرض مقاساتك هنا. سيراجع فريقنا المقاسات المحفوظة لديه بهذا الرقم ويؤكدها معك عبر واتساب.
              </span>
            </label>
          )}

          {st.returningMode === "device" && saved && (
            <div className="mt-5">
              {st.deviceVerified ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900" role="status">
                  <p className="font-semibold">تم التحقق ✓ سيتم إرفاق مقاساتك المحفوظة بالطلب.</p>
                  <button type="button" className="mt-2 font-semibold underline underline-offset-4" onClick={() => setShowSaved((v) => !v)}>
                    {showSaved ? "إخفاء المقاسات" : "عرض المقاسات للمراجعة"}
                  </button>
                  {showSaved && <MeasurementFields value={st.measurements} onChange={(m) => set({ measurements: m })} />}
                </div>
              ) : (
                <>
                  <span className="field-label">أدخل رقم جوالك للتحقق</span>
                  <div className="flex gap-2">
                    <input
                      className="field-input"
                      type="tel"
                      inputMode="tel"
                      dir="ltr"
                      value={verifyPhone}
                      onChange={(e) => setVerifyPhone(e.target.value)}
                      placeholder="7XX XXX XXX"
                      aria-label="رقم الجوال للتحقق"
                    />
                    <button type="button" onClick={verify} className="btn btn-navy shrink-0 px-5">
                      تحقق
                    </button>
                  </div>
                  {verifyError && (
                    <p className="mt-2 text-sm font-semibold text-destructive" role="alert">
                      {verifyError}
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      <ErrorText show={showErrors} text={sectionError("measure", st)} />
    </>
  )
}
