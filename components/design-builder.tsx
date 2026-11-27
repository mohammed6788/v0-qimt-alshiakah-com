"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import { ArrowLeft, ArrowRight, ClipboardList, Pencil } from "lucide-react"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { EditSheet } from "@/components/design/edit-sheet"
import {
  CONSULT_FABRIC,
  AvailabilityNotice,
  ButtonsSection,
  CollarSection,
  ColorSection,
  FabricSection,
  MeasureSection,
  PocketSection,
  QuantityStepper,
  SleeveSection,

  initialDesign,
  sectionError,
  type DesignState,
  type SectionKey,
  type SectionProps,
} from "@/components/design/sections"
import { getProduct, whatsappHref } from "@/lib/constants"
import { navigateTo, openPendingWindow, requestOrderNumber } from "@/lib/order-number"
import { EVENTS, trackEvent, trackWhatsAppClick } from "@/lib/analytics"
import {
  BUTTONS,
  COLLARS,
  FABRIC_COLORS,
  POCKETS,
  SLEEVES,
  THOBE_STYLES,
  buildOrderMessage,
  hasMeasurements,
  loadProfile,
  optionLabel,
  saveProfile,
  validatePhone,
  type MeasurementProfile,
} from "@/lib/tailoring"
import { cn } from "@/lib/utils"

// ── Steps ────────────────────────────────────────────────────
type StepId = SectionKey | "review"

const STEPS: { id: StepId; title: string; short: string }[] = [
  { id: "fabric", title: "اختر القماش", short: "القماش" },
  { id: "color", title: "اللون المطلوب", short: "اللون" },
  { id: "collar", title: "التفصيل والياقة", short: "الياقة" },
  { id: "sleeve", title: "تصميم الأكمام", short: "الأكمام" },
  { id: "buttons", title: "الأزرار (الجبزور)", short: "الأزرار" },
  { id: "pocket", title: "الجيب والإضافات والكمية", short: "الجيب" },
  { id: "measure", title: "المقاسات", short: "المقاس" },
  { id: "review", title: "بياناتك ومراجعة الطلب", short: "المراجعة" },
]

const SECTION_COMPONENT: Record<SectionKey, (p: SectionProps & { saved: MeasurementProfile | null }) => React.ReactNode> = {
  fabric: (p) => <FabricSection {...p} />,
  color: (p) => <ColorSection {...p} />,
  collar: (p) => <CollarSection {...p} />,
  sleeve: (p) => <SleeveSection {...p} />,
  buttons: (p) => <ButtonsSection {...p} />,
  pocket: (p) => <PocketSection {...p} />,
  measure: (p) => <MeasureSection {...p} />,
}

type EditKey = SectionKey | "quantity"

const SECTION_KEYS: SectionKey[] = ["fabric", "color", "collar", "sleeve", "buttons", "pocket", "measure"]

// ── Customer ─────────────────────────────────────────────────
type Customer = { name: string; phone: string; cityMode: "" | "mukalla" | "other"; city: string; notes: string; saveConsent: boolean }
const initialCustomer: Customer = { name: "", phone: "", cityMode: "", city: "", notes: "", saveConsent: false }

function customerErrors(c: Customer) {
  const e: Partial<Record<keyof Customer, string>> = {}
  const name = c.name.trim()
  if (name.length < 2 || !/[\p{L}]/u.test(name)) e.name = "اكتب اسمك (حرفان على الأقل)"
  if (!validatePhone(c.phone).ok) e.phone = "اكتب رقم جوال صحيح، مثل 7XXXXXXXX أو رقم دولي يبدأ بـ +"
  if (!c.cityMode) e.cityMode = "حدد مدينتك"
  if (c.cityMode === "other" && c.city.trim().length < 2) e.city = "اكتب اسم المدينة"
  return e
}

// Only design choices (no personal data) are kept for the browser session.
const DRAFT_KEY = "qs_design_draft_v2"
const DRAFT_FIELDS = ["fabric", "color", "customColor", "style", "collar", "sleeve", "buttons", "pocket", "extrasNote", "quantity"] as const

function loadDraft(): Partial<DesignState> {
  try {
    const raw = window.sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return {}
    const d = JSON.parse(raw) as Partial<DesignState>
    const out: Partial<DesignState> = {}
    for (const k of DRAFT_FIELDS) if (d[k] !== undefined) (out as Record<string, unknown>)[k] = d[k]
    return out
  } catch {
    return {}
  }
}

function saveDraft(st: DesignState) {
  try {
    const out: Record<string, unknown> = {}
    for (const k of DRAFT_FIELDS) out[k] = st[k]
    window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(out))
  } catch {
    /* storage unavailable */
  }
}

// ── Component ────────────────────────────────────────────────
export function DesignBuilder() {
  const [hydrated, setHydrated] = useState(false)
  const [step, setStep] = useState(0)
  const [st, setSt] = useState<DesignState>(initialDesign)
  const [customer, setCustomer] = useState<Customer>(initialCustomer)
  const [saved, setSaved] = useState<MeasurementProfile | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const [submitAttempted, setSubmitAttempted] = useState(false)
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [editKey, setEditKey] = useState<EditKey | null>(null)
  const [editDraft, setEditDraft] = useState<DesignState>(initialDesign)
  const [editErrors, setEditErrors] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)
  const [inputFocused, setInputFocused] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const firstStepRender = useRef(true)

  const set = useCallback((patch: Partial<DesignState>) => setSt((p) => ({ ...p, ...patch })), [])
  const setC = (patch: Partial<Customer>) => setCustomer((p) => ({ ...p, ...patch }))

  // Restore draft, apply ?fabric=, detect a device profile (not shown until verified).
  useEffect(() => {
    const draft = loadDraft()
    // Read ?fabric= after mount so the page can be prerendered (no layout shift).
    const slug = new URLSearchParams(window.location.search).get("fabric")
    setSt((p) => ({ ...p, ...draft, ...(slug && getProduct(slug) ? { fabric: slug } : {}) }))
    setSaved(loadProfile())
    setHydrated(true)
    trackEvent(EVENTS.designStart, { placement: "design_page", prefilled_fabric: slug ?? "none" })
  }, [])

  useEffect(() => {
    if (hydrated) saveDraft(st)
  }, [st, hydrated])

  // Hide the sticky bar while the on-screen keyboard is likely open.
  useEffect(() => {
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement &&
      (el.tagName === "TEXTAREA" || el.tagName === "SELECT" || (el.tagName === "INPUT" && !["checkbox", "radio", "button"].includes((el as HTMLInputElement).type)))
    const onIn = (e: FocusEvent) => isField(e.target) && setInputFocused(true)
    const onOut = () => setInputFocused(false)
    document.addEventListener("focusin", onIn)
    document.addEventListener("focusout", onOut)
    return () => {
      document.removeEventListener("focusin", onIn)
      document.removeEventListener("focusout", onOut)
    }
  }, [])

  useEffect(() => {
    if (firstStepRender.current) {
      firstStepRender.current = false
      return
    }
    trackEvent(EVENTS.designStep, { step: STEPS[step].id, index: step + 1 })
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step])

  // ── Derived values ──
  const product = getProduct(st.fabric)
  const colorLabel = st.color === "other" ? st.customColor.trim() || "لون آخر" : optionLabel(FABRIC_COLORS, st.color)
  const city = customer.cityMode === "mukalla" ? "المكلا" : customer.cityMode === "other" ? customer.city.trim() : ""
  const includeMeasurements =
    (st.customerType === "new" && st.newMode === "enter") || (st.customerType === "returning" && st.returningMode === "device" && st.deviceVerified)

  const measurementStatus = useMemo(() => {
    if (st.customerType === "new") {
      if (st.newMode === "enter") return "عميل جديد – المقاسات مرفقة"
      if (st.newMode === "whatsapp") return "عميل جديد – سأرسل المقاسات عبر واتساب"
      if (st.newMode === "visit") return "عميل جديد – سأزور المحل لأخذ المقاس"
    }
    if (st.customerType === "returning") {
      if (st.returningMode === "shop")
        return `عميل سابق – أرجو استرجاع مقاساتي المحفوظة لديكم برقم ${validatePhone(st.registeredPhone).normalized || st.registeredPhone}`
      if (st.returningMode === "device" && st.deviceVerified) return "عميل سابق – مقاساتي المحفوظة مرفقة"
    }
    return ""
  }, [st])

  const fabricText = product ? `${product.title} (قماش ${product.type})` : st.fabric === CONSULT_FABRIC ? "أحتاج مساعدة في اختيار القماش" : ""

  const orderDetails = {
    kind: "design" as const,
    name: customer.name.trim(),
    phone: validatePhone(customer.phone).normalized || customer.phone.trim(),
    city,
    fabric: fabricText ? { title: fabricText } : undefined,
    color: colorLabel,
    style: optionLabel(THOBE_STYLES, st.style),
    collar: optionLabel(COLLARS, st.collar),
    sleeve: optionLabel(SLEEVES, st.sleeve),
    buttons: optionLabel(BUTTONS, st.buttons),
    pocket: optionLabel(POCKETS, st.pocket),
    extras: st.extrasNote.trim() ? [st.extrasNote.trim()] : [],
    quantity: st.quantity,
    measurementStatus,
    measurements: includeMeasurements ? st.measurements : undefined,
    notes: customer.notes,
  }
  const message = buildOrderMessage({ ...orderDetails, orderNumber: orderNumber ?? undefined })

  const sectionIssues = SECTION_KEYS.map((k) => ({ key: k, error: sectionError(k, st) })).filter((x) => x.error)
  const custErr = customerErrors(customer)
  const canSend = sectionIssues.length === 0 && Object.keys(custErr).length === 0

  // ── Navigation ──
  const current = STEPS[step]
  const isLast = current.id === "review"

  const goNext = () => {
    if (current.id !== "review" && sectionError(current.id, st)) {
      setShowErrors(true)
      return
    }
    setShowErrors(false)
    if (STEPS[step + 1]?.id === "review" && !customer.phone && st.returningMode === "shop" && st.registeredPhone) {
      setC({ phone: st.registeredPhone })
    }
    setStep((v) => Math.min(v + 1, STEPS.length - 1))
  }
  const goBack = () => {
    setShowErrors(false)
    setStep((v) => Math.max(v - 1, 0))
  }

  // ── Edit sheet ──
  const openEdit = (key: EditKey) => {
    setSummaryOpen(false)
    setEditDraft(st)
    setEditErrors(false)
    setEditKey(key)
    trackEvent("design_edit_open", { field: key })
  }
  const confirmEdit = () => {
    if (!editKey) return
    const err = editKey === "quantity" ? "" : sectionError(editKey, editDraft)
    // Changing the fabric may invalidate the color; surface it right away.
    if (err) {
      setEditErrors(true)
      return
    }
    setSt(editDraft)
    setEditKey(null)
    if (editKey === "fabric" && sectionError("color", editDraft)) {
      setTimeout(() => openEditFrom(editDraft, "color"), 250)
    }
  }
  const openEditFrom = (base: DesignState, key: EditKey) => {
    setEditDraft(base)
    setEditErrors(false)
    setEditKey(key)
  }

  // ── Send ──
  const onSend = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setSubmitAttempted(true)
    if (!canSend) {
      document.getElementById("order-issues")?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }
    if (sending) return
    // Open WhatsApp's window inside the click, then fill in the final link.
    const win = openPendingWindow()
    setSending(true)
    const number = orderNumber ?? (await requestOrderNumber("design"))
    if (number) setOrderNumber(number)
    navigateTo(win, whatsappHref(buildOrderMessage({ ...orderDetails, orderNumber: number ?? undefined })))
    setSending(false)
    if (customer.saveConsent && st.customerType === "new" && st.newMode === "enter" && hasMeasurements(st.measurements)) {
      const ok = saveProfile({
        name: customer.name.trim(),
        phone: validatePhone(customer.phone).normalized,
        city,
        measurements: st.measurements,
        savedAt: new Date().toISOString(),
      })
      if (ok) trackEvent(EVENTS.measurementsSaved, { placement: "design_builder" })
    }
    trackEvent(EVENTS.orderSubmit, {
      flow: "design",
      fabric: st.fabric,
      quantity: st.quantity,
      customer_type: st.customerType,
      measure_mode: st.newMode || st.returningMode,
      city_type: customer.cityMode,
      numbered: !!number,
    })
    trackWhatsAppClick("whatsapp_design_order", "design_review")
    setSent(true)
  }

  // ── Summary rows ──
  const rows: { key: EditKey; k: string; v: string; err?: string }[] = [
    { key: "fabric", k: "القماش", v: fabricText, err: sectionError("fabric", st) },
    { key: "color", k: "اللون المطلوب", v: st.color ? colorLabel : "", err: sectionError("color", st) },
    { key: "collar", k: "التفصيل والياقة", v: [optionLabel(THOBE_STYLES, st.style), optionLabel(COLLARS, st.collar)].filter(Boolean).join(" · "), err: sectionError("collar", st) },
    { key: "sleeve", k: "الأكمام", v: optionLabel(SLEEVES, st.sleeve), err: sectionError("sleeve", st) },
    { key: "buttons", k: "الأزرار", v: optionLabel(BUTTONS, st.buttons), err: sectionError("buttons", st) },
    { key: "pocket", k: "الجيب والإضافات", v: [optionLabel(POCKETS, st.pocket), st.extrasNote.trim()].filter(Boolean).join(" · "), err: st.pocket ? "" : "اختر نوع الجيب" },
    { key: "quantity", k: "الكمية", v: `${st.quantity} ${st.quantity === 1 ? "ثوب" : "ثياب"}` },
    { key: "measure", k: "المقاسات", v: measurementStatus, err: sectionError("measure", st) },
  ]
  const doneCount = SECTION_KEYS.filter((k) => !sectionError(k, st)).length

  const stickyHidden = inputFocused || editKey !== null || summaryOpen

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Progress */}
      <div className="card-surface -mt-8 p-4 sm:-mt-10 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-navy">
            الخطوة {step + 1} من {STEPS.length}
          </p>
          <button
            type="button"
            onClick={() => setSummaryOpen(true)}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ivory px-3 text-sm font-semibold text-navy-soft hover:bg-sky-soft lg:hidden"
          >
            <ClipboardList className="size-4" aria-hidden="true" />
            الملخص ({doneCount}/{SECTION_KEYS.length})
          </button>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {STEPS.map((s, i) => (
            <span key={s.id} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", i <= step ? "bg-navy" : "bg-silver-light", i === step && "bg-sky")} />
          ))}
        </div>
        <ol className="mt-3 hidden gap-1 md:flex" aria-label="خطوات التصميم">
          {STEPS.map((s, i) => (
            <li key={s.id} className="flex-1">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                aria-current={i === step ? "step" : undefined}
                className={cn(
                  "w-full truncate rounded-lg px-1 py-1.5 text-center text-xs font-semibold transition-colors",
                  i === step ? "bg-navy text-white" : i < step ? "text-navy-soft hover:bg-sky-soft" : "text-silver-dark",
                )}
              >
                {s.short}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div key={current.id} className="min-w-0 rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(1,29,69,0.04)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:p-7">
          <h2 className="type-h2 mb-5 text-navy">{current.title}</h2>

          {current.id !== "review" && SECTION_COMPONENT[current.id]({ st, set, showErrors, saved })}

          {current.id === "review" && (
            <div className="space-y-8">
              <SummaryList rows={rows} onEdit={openEdit} showErrors={submitAttempted} />

              <fieldset className="space-y-4">
                <legend className="type-h3 mb-1 text-navy">بياناتك للتواصل</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="الاسم" required error={submitAttempted ? custErr.name : undefined}>
                    <input className="field-input" name="name" autoComplete="name" maxLength={60} value={customer.name} onChange={(e) => setC({ name: e.target.value })} />
                  </Field>
                  <Field label="رقم الجوال" required error={submitAttempted ? custErr.phone : undefined}>
                    <input
                      className="field-input"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      dir="ltr"
                      maxLength={20}
                      value={customer.phone}
                      onChange={(e) => setC({ phone: e.target.value })}
                      placeholder="7XX XXX XXX"
                    />
                  </Field>
                </div>
                <div>
                  <span className="field-label">
                    المدينة <span className="text-destructive">*</span>
                  </span>
                  <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="المدينة">
                    {(["mukalla", "other"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={customer.cityMode === c}
                        onClick={() => setC({ cityMode: c })}
                        className={cn(
                          "min-h-12 rounded-2xl border font-medium text-navy transition-colors",
                          customer.cityMode === c ? "border-navy bg-sky-soft shadow-[0_0_0_1px_var(--navy)]" : "border-navy/12",
                        )}
                      >
                        {c === "mukalla" ? "داخل المكلا" : "خارج المكلا"}
                      </button>
                    ))}
                  </div>
                  {submitAttempted && custErr.cityMode && <p className="mt-1 text-sm font-semibold text-destructive">{custErr.cityMode}</p>}
                  {customer.cityMode === "other" && (
                    <Field label="اسم المدينة" required error={submitAttempted ? custErr.city : undefined} className="mt-3">
                      <input className="field-input" name="city" maxLength={40} value={customer.city} onChange={(e) => setC({ city: e.target.value })} placeholder="مثال: سيئون" />
                    </Field>
                  )}
                </div>
                <Field label="ملاحظات إضافية (اختياري)">
                  <textarea
                    className="field-input min-h-24 py-3"
                    name="notes"
                    maxLength={500}
                    value={customer.notes}
                    onChange={(e) => setC({ notes: e.target.value })}
                    placeholder="مثال: الثوب لمناسبة زواج، أحتاجه قبل تاريخ معيّن…"
                  />
                </Field>
                {st.customerType === "new" && st.newMode === "enter" && hasMeasurements(st.measurements) && (
                  <label className="flex items-start gap-3 rounded-2xl bg-ivory p-4 text-sm text-navy">
                    <input type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[#011d45]" checked={customer.saveConsent} onChange={(e) => setC({ saveConsent: e.target.checked })} />
                    <span>
                      احفظ اسمي ورقمي ومقاساتي <strong>على هذا الجهاز فقط</strong> لإعادة الطلب لاحقاً (اختياري). لا تُرفع لأي خادم، ويمكن حذفها من صفحة المقاسات.
                    </span>
                  </label>
                )}
              </fieldset>

              {submitAttempted && !canSend && (
                <div id="order-issues" className="rounded-2xl border border-destructive/30 bg-red-50 p-4" role="alert">
                  <p className="font-semibold text-destructive">لا يمكن إرسال الطلب قبل استكمال:</p>
                  <ul className="mt-2 space-y-1 text-sm text-destructive">
                    {sectionIssues.map((x) => (
                      <li key={x.key}>
                        •{" "}
                        <button type="button" className="font-semibold underline underline-offset-4" onClick={() => openEdit(x.key)}>
                          {x.error}
                        </button>
                      </li>
                    ))}
                    {Object.values(custErr).map((m) => (
                      <li key={m}>• {m}</li>
                    ))}
                  </ul>
                </div>
              )}

              <details className="rounded-2xl bg-ivory p-4">
                <summary className="cursor-pointer font-semibold text-navy">معاينة رسالة واتساب</summary>
                {!orderNumber && <p className="mt-3 text-xs text-muted-foreground">يُضاف رقم الطلب (مثل QS-0001) تلقائياً عند الإرسال.</p>}
                <pre className="mt-3 whitespace-pre-wrap break-words font-sans text-sm text-navy" data-testid="message-preview">
                  {message}
                </pre>
              </details>

              <AvailabilityNotice />
              <p className="text-sm text-muted-foreground">
                بعد الإرسال يراجع فريقنا طلبك عبر واتساب ويؤكد معك التفاصيل والسعر وموعد الاستلام.
              </p>

              {sent && (
                <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800" role="status" data-testid="sent-status">
                  {orderNumber ? (
                    <>
                      رقم طلبك: <span className="num" dir="ltr">{orderNumber}</span>. أكمل الإرسال من واتساب، وسيتواصل معك فريقنا لتأكيد الطلب.
                    </>
                  ) : (
                    "تم تجهيز رسالة طلبك. أكمل الإرسال من واتساب، وسيزوّدك فريقنا برقم الطلب عند تأكيده."
                  )}
                </p>
              )}
            </div>
          )}

          {/* Desktop/tablet step controls */}
          <div className="mt-8 hidden items-center justify-between gap-3 border-t border-navy/10 pt-6 sm:flex">
            <button type="button" onClick={goBack} disabled={step === 0} className="btn btn-outline-dark">
              <ArrowRight className="size-5" aria-hidden="true" />
              السابق
            </button>
            {isLast ? (
              <a href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" aria-busy={sending} onClick={onSend} className="btn bg-[#25D366] px-8 text-white hover:bg-[#1ebe5a]" data-testid="send-desktop">
                <WhatsAppIcon />
                {sending ? "جارٍ تجهيز الطلب…" : "أرسل الطلب عبر واتساب"}
              </a>
            ) : (
              <button type="button" onClick={goNext} className="btn btn-navy px-8">
                التالي: {STEPS[step + 1].short}
                <ArrowLeft className="size-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Live summary (desktop) */}
        <aside className="sticky top-24 hidden rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(1,29,69,0.04)] lg:block" aria-label="ملخص ثوبك">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="type-h3 text-navy">ملخص ثوبك</h2>
            <span className="text-xs font-semibold text-muted-foreground">
              {doneCount}/{SECTION_KEYS.length}
            </span>
          </div>
          {product && (
            <div className="mb-3 flex items-center gap-3">
              <span className="relative size-14 overflow-hidden rounded-xl bg-silver-light">
                <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span className="text-sm">
                <span className="block font-semibold text-navy">{product.title}</span>
                <span className="block text-muted-foreground">قماش {product.type}</span>
              </span>
            </div>
          )}
          <SummaryList rows={rows} onEdit={openEdit} compact />
        </aside>
      </div>

      {/* Bottom spacer so the sticky bar never covers the last field (incl. iPhone safe area). */}
      <div className="h-[calc(5.5rem+env(safe-area-inset-bottom))] sm:hidden" aria-hidden="true" />

      {/* Mobile sticky controls */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-navy-deep/95 px-3 pt-3 backdrop-blur-md transition-transform duration-200 sm:hidden",
          stickyHidden && "translate-y-full",
        )}
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
        data-testid="sticky-bar"
        aria-hidden={stickyHidden}
      >
        <div className="flex gap-2">
          <button type="button" onClick={goBack} disabled={step === 0} className="btn btn-outline-light px-4" aria-label="الخطوة السابقة" tabIndex={stickyHidden ? -1 : 0}>
            <ArrowRight className="size-5" aria-hidden="true" />
          </button>
          {isLast ? (
            <a
              href={whatsappHref(message)}
              target="_blank"
              rel="noopener noreferrer"
              aria-busy={sending}
              onClick={onSend}
              className="btn flex-1 bg-[#25D366] text-white"
              data-testid="send-mobile"
              tabIndex={stickyHidden ? -1 : 0}
            >
              <WhatsAppIcon />
              {sending ? "جارٍ تجهيز الطلب…" : "أرسل الطلب عبر واتساب"}
            </a>
          ) : (
            <button type="button" onClick={goNext} className="btn btn-primary flex-1" data-testid="next-mobile" tabIndex={stickyHidden ? -1 : 0}>
              التالي: {STEPS[step + 1].short}
              <ArrowLeft className="size-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Summary sheet (mobile) */}
      <EditSheet open={summaryOpen} onOpenChange={setSummaryOpen} title="ملخص ثوبك" description="اضغط على أي عنصر لتعديله.">
        <SummaryList rows={rows} onEdit={openEdit} />
      </EditSheet>

      {/* Edit sheet */}
      <EditSheet
        open={editKey !== null}
        onOpenChange={(o) => !o && setEditKey(null)}
        title={editKey === "quantity" ? "الكمية" : editKey ? `تعديل: ${STEPS.find((s) => s.id === editKey)?.title}` : ""}
        footer={
          <div className="flex gap-2">
            <button type="button" onClick={() => setEditKey(null)} className="btn btn-outline-dark">
              إلغاء
            </button>
            <button type="button" onClick={confirmEdit} className="btn btn-navy flex-1" data-testid="sheet-confirm">
              تأكيد الاختيار
            </button>
          </div>
        }
      >
        {editKey === "quantity" && (
          <QuantityStepper st={editDraft} set={(p) => setEditDraft((d) => ({ ...d, ...p }))} />
        )}
        {editKey && editKey !== "quantity" &&
          SECTION_COMPONENT[editKey]({
            st: editDraft,
            set: (p) => setEditDraft((d) => ({ ...d, ...p })),
            showErrors: editErrors,
            saved,
          })}
      </EditSheet>
    </div>
  )
}

function SummaryList({
  rows,
  onEdit,
  compact,
  showErrors,
}: {
  rows: { key: EditKey; k: string; v: string; err?: string }[]
  onEdit: (k: EditKey) => void
  compact?: boolean
  showErrors?: boolean
}) {
  return (
    <ul className="divide-y divide-navy/8" data-testid={compact ? "summary-compact" : "summary"}>
      {rows.map((r) => {
        const missing = !r.v || !!r.err
        return (
          <li key={r.key}>
            <button
              type="button"
              onClick={() => onEdit(r.key)}
              className={cn("flex w-full items-center justify-between gap-3 text-start transition-colors hover:bg-ivory", compact ? "rounded-lg px-1 py-2" : "rounded-xl px-2 py-3")}
              aria-label={`تعديل ${r.k}`}
            >
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">{r.k}</span>
                <span className={cn("block font-medium", compact && "text-sm", missing ? (showErrors ? "text-destructive" : "text-silver-dark") : "text-navy")}>
                  {r.v && !r.err ? r.v : showErrors && r.err ? r.err : "لم يُحدَّد بعد"}
                </span>
              </span>
              <span className={cn("flex shrink-0 items-center justify-center rounded-full text-navy-soft", compact ? "size-8" : "size-10 bg-ivory")}>
                <Pencil className="size-4" aria-hidden="true" />
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

function Field({ label, required, error, className, children }: { label: string; required?: boolean; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1 block text-sm font-semibold text-destructive" role="alert">
          {error}
        </span>
      )}
    </label>
  )
}

