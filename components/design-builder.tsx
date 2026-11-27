"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeft, ArrowRight, Check, Pencil, ShieldCheck } from "lucide-react"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { PRODUCTS, getProduct, whatsappHref } from "@/lib/constants"
import { EVENTS, trackEvent, trackWhatsAppClick } from "@/lib/analytics"
import {
  BUTTONS,
  COLLARS,
  EXTRAS,
  FABRIC_COLORS,
  MEASUREMENT_FIELDS,
  SLEEVES,
  THOBE_STYLES,
  buildOrderMessage,
  generateOrderRef,
  hasMeasurements,
  loadProfile,
  saveProfile,
  type MeasurementProfile,
  type Measurements,
  type Option,
} from "@/lib/tailoring"
import { cn } from "@/lib/utils"

const CONSULT_FABRIC = "consult"

type MeasureMode = "saved" | "enter" | "on_file" | "visit" | "whatsapp"

const MEASURE_MODES: { id: MeasureMode; label: string; hint: string }[] = [
  { id: "enter", label: "سأدخل مقاساتي الآن", hint: "بالسنتيمتر – ويمكنك حفظها لإعادة الطلب" },
  { id: "on_file", label: "مقاساتي محفوظة لديكم", hint: "من طلب سابق في قمة الشياكة" },
  { id: "visit", label: "سأزور المحل لأخذ المقاس", hint: "المكلا – الشرج" },
  { id: "whatsapp", label: "سأرسل المقاسات عبر واتساب", hint: "مناسب للعملاء من خارج المكلا" },
]

const STEPS = [
  { id: "fabric", title: "نوع القماش" },
  { id: "color", title: "لون القماش" },
  { id: "collar", title: "الطراز والياقة" },
  { id: "sleeve", title: "تصميم الأكمام" },
  { id: "buttons", title: "نوع الأزرار" },
  { id: "extras", title: "تفاصيل إضافية" },
  { id: "measure", title: "المقاس" },
  { id: "review", title: "المراجعة والإرسال" },
] as const

type State = {
  fabric: string
  color: string
  customColor: string
  style: string
  collar: string
  sleeve: string
  buttons: string
  extras: string[]
  quantity: number
  notes: string
  measureMode: MeasureMode | ""
  measurements: Measurements
  name: string
  phone: string
  cityMode: "mukalla" | "other"
  city: string
  saveConsent: boolean
}

const initialState: State = {
  fabric: "",
  color: "",
  customColor: "",
  style: "",
  collar: "",
  sleeve: "",
  buttons: "",
  extras: [],
  quantity: 1,
  notes: "",
  measureMode: "",
  measurements: {},
  name: "",
  phone: "",
  cityMode: "mukalla",
  city: "",
  saveConsent: false,
}

const label = (opts: Option[], id: string) => opts.find((o) => o.id === id)?.label ?? ""

export function DesignBuilder() {
  const params = useSearchParams()
  const [step, setStep] = useState(0)
  const [s, setS] = useState<State>(initialState)
  const [saved, setSaved] = useState<MeasurementProfile | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [orderRef, setOrderRef] = useState("")
  const [sent, setSent] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const firstRender = useRef(true)

  const set = <K extends keyof State>(key: K, value: State[K]) => setS((prev) => ({ ...prev, [key]: value }))

  // Prefill from ?fabric= and from a measurement profile saved on this device.
  useEffect(() => {
    const slug = params.get("fabric")
    const profile = loadProfile()
    setSaved(profile)
    setS((prev) => ({
      ...prev,
      fabric: slug && getProduct(slug) ? slug : prev.fabric,
      ...(profile && {
        name: profile.name,
        phone: profile.phone,
        cityMode: profile.city && profile.city !== "المكلا" ? "other" : "mukalla",
        city: profile.city && profile.city !== "المكلا" ? profile.city : "",
        measureMode: hasMeasurements(profile.measurements) ? "saved" : prev.measureMode,
        measurements: profile.measurements,
      }),
    }))
    setOrderRef(generateOrderRef())
    trackEvent(EVENTS.designStart, { placement: "design_page", prefilled_fabric: slug ?? "none" })
  }, [params])

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    trackEvent(EVENTS.designStep, { step: STEPS[step].id, index: step + 1 })
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }, [step])

  const product = s.fabric && s.fabric !== CONSULT_FABRIC ? getProduct(s.fabric) : undefined
  const colorLabel = s.color === "other" ? s.customColor || "لون آخر" : label(FABRIC_COLORS, s.color)
  const city = s.cityMode === "mukalla" ? "المكلا" : s.city.trim()

  const measurementStatus = useMemo(() => {
    switch (s.measureMode) {
      case "saved":
        return "المقاسات المحفوظة لدي (مرفقة أدناه)"
      case "enter":
        return hasMeasurements(s.measurements) ? "مقاساتي (مرفقة أدناه)" : "سأرسل المقاسات لاحقاً"
      case "on_file":
        return "مقاساتي محفوظة لديكم من طلب سابق"
      case "visit":
        return "سأزور المحل لأخذ المقاس"
      case "whatsapp":
        return "سأرسل المقاسات عبر واتساب"
      default:
        return ""
    }
  }, [s.measureMode, s.measurements])

  const includeMeasurements = s.measureMode === "saved" || s.measureMode === "enter"

  const message = buildOrderMessage({
    kind: "design",
    ref: orderRef,
    name: s.name.trim(),
    phone: s.phone.trim(),
    city,
    fabric: product ?? (s.fabric === CONSULT_FABRIC ? { title: "أحتاج مساعدة في اختيار القماش" } : undefined),
    color: colorLabel,
    style: label(THOBE_STYLES, s.style),
    collar: label(COLLARS, s.collar),
    sleeve: label(SLEEVES, s.sleeve),
    buttons: label(BUTTONS, s.buttons),
    extras: s.extras.map((id) => label(EXTRAS, id)),
    quantity: s.quantity,
    measurementStatus,
    measurements: includeMeasurements ? s.measurements : undefined,
    notes: s.notes,
  })

  const stepComplete = (i: number): boolean => {
    switch (STEPS[i].id) {
      case "fabric":
        return !!s.fabric
      case "color":
        return !!s.color && (s.color !== "other" || s.customColor.trim().length > 0)
      case "collar":
        return !!s.collar
      case "sleeve":
        return !!s.sleeve
      case "buttons":
        return !!s.buttons
      case "extras":
        return s.quantity >= 1
      case "measure":
        return !!s.measureMode
      default:
        return true
    }
  }

  const validateContact = () => {
    const e: Record<string, string> = {}
    if (s.name.trim().length < 2) e.name = "يرجى كتابة الاسم"
    const digits = s.phone.replace(/\D/g, "")
    if (digits.length < 7 || digits.length > 15) e.phone = "يرجى كتابة رقم تواصل صحيح"
    if (s.cityMode === "other" && !s.city.trim()) e.city = "يرجى كتابة اسم المدينة"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => {
    if (!stepComplete(step)) {
      setErrors({ step: "يرجى اختيار أحد الخيارات للمتابعة" })
      return
    }
    setErrors({})
    setStep((v) => Math.min(v + 1, STEPS.length - 1))
  }
  const goBack = () => {
    setErrors({})
    setStep((v) => Math.max(v - 1, 0))
  }

  const onSend = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!validateContact()) {
      e.preventDefault()
      return
    }
    if (s.saveConsent && includeMeasurements && hasMeasurements(s.measurements)) {
      const ok = saveProfile({
        name: s.name.trim(),
        phone: s.phone.trim(),
        city,
        measurements: s.measurements,
        savedAt: new Date().toISOString(),
      })
      if (ok) trackEvent(EVENTS.measurementsSaved, { placement: "design_builder" })
    }
    trackEvent(EVENTS.orderSubmit, {
      flow: "design",
      fabric: s.fabric,
      quantity: s.quantity,
      measure_mode: s.measureMode,
      city_type: s.cityMode,
    })
    trackWhatsAppClick("whatsapp_design_order", "design_review")
    setSent(true)
  }

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* Progress */}
      <div className="card-surface -mt-8 p-4 sm:-mt-10 sm:p-5">
        <div className="flex items-center justify-between text-sm">
          <p className="font-bold text-navy">
            الخطوة {step + 1} من {STEPS.length}: <span className="text-navy-soft">{current.title}</span>
          </p>
          <p className="text-muted-foreground">{Math.round(((step + 1) / STEPS.length) * 100)}%</p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-silver-light" role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="تقدم تصميم الثوب">
          <div className="h-full rounded-full bg-gradient-to-l from-sky to-navy-soft transition-[width] duration-500" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <ol className="mt-4 hidden gap-1 md:flex">
          {STEPS.map((st, i) => (
            <li key={st.id} className="flex-1">
              <button
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i > step}
                className={cn(
                  "w-full truncate rounded-lg px-1 py-1 text-center text-xs font-bold transition-colors",
                  i === step ? "bg-navy text-white" : i < step ? "text-navy-soft hover:bg-sky-soft" : "text-silver-dark",
                )}
              >
                {st.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div key={current.id} className="card-surface p-5 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300 sm:p-7">
          <h2 className="text-2xl font-extrabold text-navy">{current.title}</h2>

          {current.id === "fabric" && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PRODUCTS.map((p) => (
                <ChoiceCard key={p.slug} selected={s.fabric === p.slug} onSelect={() => set("fabric", p.slug)} name="fabric">
                  <span className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-silver-light">
                    <Image src={p.image} alt="" fill sizes="64px" className="object-cover" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-navy">{p.title}</span>
                    <span className="block text-sm text-muted-foreground">قماش {p.type}</span>
                  </span>
                </ChoiceCard>
              ))}
              <ChoiceCard selected={s.fabric === CONSULT_FABRIC} onSelect={() => set("fabric", CONSULT_FABRIC)} name="fabric">
                <span className="min-w-0">
                  <span className="block font-bold text-navy">ساعدوني في الاختيار</span>
                  <span className="block text-sm text-muted-foreground">نقترح عليك الأنسب لمناسبتك وميزانيتك</span>
                </span>
              </ChoiceCard>
              <Link href="/fabrics" className="text-sm font-bold text-navy-soft underline-offset-4 hover:underline sm:col-span-2">
                قارن الأقمشة بالتفصيل في صفحة الأقمشة
              </Link>
            </div>
          )}

          {current.id === "color" && (
            <>
              <p className="mt-2 text-sm text-muted-foreground">نؤكد لك توفر اللون في القماش المختار عند الطلب.</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {FABRIC_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    role="radio"
                    aria-checked={s.color === c.id}
                    onClick={() => set("color", c.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-colors",
                      s.color === c.id ? "border-navy bg-sky-soft" : "border-navy/10 hover:border-navy/30",
                    )}
                  >
                    <span className="size-12 rounded-full border border-navy/15 shadow-inner" style={{ background: c.swatch }} aria-hidden="true" />
                    <span className="text-sm font-bold text-navy">{c.label}</span>
                  </button>
                ))}
              </div>
              {s.color === "other" && (
                <label className="mt-4 block">
                  <span className="field-label">اكتب اللون المطلوب</span>
                  <input className="field-input" value={s.customColor} onChange={(e) => set("customColor", e.target.value)} placeholder="مثال: زيتي فاتح" />
                </label>
              )}
            </>
          )}

          {current.id === "collar" && (
            <>
              <h3 className="mt-5 font-bold text-navy">طراز الثوب <span className="text-sm font-normal text-muted-foreground">(اختياري)</span></h3>
              <OptionGrid options={THOBE_STYLES} value={s.style} onChange={(v) => set("style", v)} name="style" />
              <h3 className="mt-6 font-bold text-navy">نوع الياقة</h3>
              <OptionGrid options={COLLARS} value={s.collar} onChange={(v) => set("collar", v)} name="collar" />
            </>
          )}

          {current.id === "sleeve" && <OptionGrid options={SLEEVES} value={s.sleeve} onChange={(v) => set("sleeve", v)} name="sleeve" />}

          {current.id === "buttons" && <OptionGrid options={BUTTONS} value={s.buttons} onChange={(v) => set("buttons", v)} name="buttons" />}

          {current.id === "extras" && (
            <>
              <p className="mt-2 text-sm text-muted-foreground">اختر ما يناسبك (اختياري).</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {EXTRAS.map((x) => {
                  const on = s.extras.includes(x.id)
                  return (
                    <button
                      key={x.id}
                      type="button"
                      role="checkbox"
                      aria-checked={on}
                      onClick={() => set("extras", on ? s.extras.filter((i) => i !== x.id) : [...s.extras, x.id])}
                      className={cn(
                        "flex min-h-14 items-center gap-3 rounded-xl border-2 px-4 text-start font-bold text-navy transition-colors",
                        on ? "border-navy bg-sky-soft" : "border-navy/10 hover:border-navy/30",
                      )}
                    >
                      <span className={cn("flex size-6 items-center justify-center rounded-md border-2", on ? "border-navy bg-navy text-white" : "border-navy/25")}>
                        {on && <Check className="size-4" aria-hidden="true" />}
                      </span>
                      {x.label}
                    </button>
                  )
                })}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-[180px_1fr]">
                <div>
                  <span className="field-label" id="qty-label">الكمية</span>
                  <div className="flex items-center gap-2" role="group" aria-labelledby="qty-label">
                    <button type="button" className="btn btn-outline-dark size-12 px-0" onClick={() => set("quantity", Math.max(1, s.quantity - 1))} aria-label="إنقاص الكمية">−</button>
                    <output className="w-12 text-center text-xl font-extrabold text-navy" aria-live="polite">{s.quantity}</output>
                    <button type="button" className="btn btn-outline-dark size-12 px-0" onClick={() => set("quantity", Math.min(20, s.quantity + 1))} aria-label="زيادة الكمية">+</button>
                  </div>
                </div>
                <label className="block">
                  <span className="field-label">ملاحظات</span>
                  <textarea
                    className="field-input min-h-24 py-3"
                    value={s.notes}
                    onChange={(e) => set("notes", e.target.value)}
                    placeholder="مثال: الثوب لمناسبة زواج، أحتاجه قبل تاريخ معيّن…"
                    maxLength={500}
                  />
                </label>
              </div>
            </>
          )}

          {current.id === "measure" && (
            <>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {saved && hasMeasurements(saved.measurements) && (
                  <ChoiceCard
                    selected={s.measureMode === "saved"}
                    onSelect={() => setS((p) => ({ ...p, measureMode: "saved", measurements: saved.measurements }))}
                    name="measure"
                    className="sm:col-span-2"
                  >
                    <ShieldCheck className="size-6 shrink-0 text-navy-soft" aria-hidden="true" />
                    <span>
                      <span className="block font-bold text-navy">استخدم مقاساتي المحفوظة على هذا الجهاز</span>
                      <span className="block text-sm text-muted-foreground">
                        باسم {saved.name} · حُفظت {new Date(saved.savedAt).toLocaleDateString("ar-EG")}
                      </span>
                    </span>
                  </ChoiceCard>
                )}
                {MEASURE_MODES.map((m) => (
                  <ChoiceCard key={m.id} selected={s.measureMode === m.id} onSelect={() => set("measureMode", m.id)} name="measure">
                    <span>
                      <span className="block font-bold text-navy">{m.label}</span>
                      <span className="block text-sm text-muted-foreground">{m.hint}</span>
                    </span>
                  </ChoiceCard>
                ))}
              </div>
              {(s.measureMode === "enter" || s.measureMode === "saved") && (
                <MeasurementFields value={s.measurements} onChange={(m) => setS((p) => ({ ...p, measurements: m, measureMode: "enter" }))} />
              )}
              <Link href="/measurements#guide" className="mt-4 inline-block text-sm font-bold text-navy-soft underline-offset-4 hover:underline">
                دليل أخذ المقاسات
              </Link>
            </>
          )}

          {current.id === "review" && (
            <div className="mt-5 space-y-6">
              <SummaryList s={s} product={product} colorLabel={colorLabel} measurementStatus={measurementStatus} onEdit={setStep} />

              <fieldset className="space-y-4">
                <legend className="mb-2 font-bold text-navy">بياناتك للتواصل</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="الاسم" error={errors.name}>
                    <input className="field-input" autoComplete="name" value={s.name} onChange={(e) => set("name", e.target.value)} />
                  </Field>
                  <Field label="رقم التواصل" error={errors.phone}>
                    <input className="field-input" type="tel" inputMode="tel" autoComplete="tel" dir="ltr" value={s.phone} onChange={(e) => set("phone", e.target.value)} placeholder="7XX XXX XXX" />
                  </Field>
                </div>
                <div>
                  <span className="field-label">المدينة</span>
                  <div className="grid grid-cols-2 gap-3">
                    {(["mukalla", "other"] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        role="radio"
                        aria-checked={s.cityMode === c}
                        onClick={() => set("cityMode", c)}
                        className={cn("min-h-12 rounded-xl border-2 font-bold text-navy", s.cityMode === c ? "border-navy bg-sky-soft" : "border-navy/10")}
                      >
                        {c === "mukalla" ? "داخل المكلا" : "خارج المكلا"}
                      </button>
                    ))}
                  </div>
                  {s.cityMode === "other" && (
                    <Field label="اسم المدينة" error={errors.city} className="mt-3">
                      <input className="field-input" value={s.city} onChange={(e) => set("city", e.target.value)} placeholder="مثال: سيئون" />
                    </Field>
                  )}
                </div>
                {includeMeasurements && hasMeasurements(s.measurements) && (
                  <label className="flex items-start gap-3 rounded-xl bg-sky-soft p-4 text-sm text-navy">
                    <input type="checkbox" className="mt-0.5 size-5 accent-[#011d45]" checked={s.saveConsent} onChange={(e) => set("saveConsent", e.target.checked)} />
                    <span>
                      احفظ اسمي ورقمي ومقاساتي <strong>على هذا الجهاز</strong> لأستخدمها في الطلبات القادمة. لا تُرسل هذه البيانات لأي جهة، وتصلنا فقط ضمن رسالة واتساب التي ترسلها بنفسك.
                    </span>
                  </label>
                )}
              </fieldset>

              <details className="rounded-xl border border-navy/10 bg-ivory p-4">
                <summary className="cursor-pointer font-bold text-navy">معاينة رسالة واتساب</summary>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-navy">{message}</pre>
              </details>

              {sent && (
                <p className="rounded-xl bg-emerald-50 p-4 text-sm font-bold text-emerald-800" role="status">
                  تم تجهيز طلبك برقم {orderRef}. أكمل الإرسال من واتساب، وسنرد عليك لتأكيد التفاصيل والسعر وموعد الاستلام.
                </p>
              )}
            </div>
          )}

          {errors.step && (
            <p className="mt-4 text-sm font-bold text-destructive" role="alert">
              {errors.step}
            </p>
          )}

          {/* Desktop step controls */}
          <div className="mt-8 hidden items-center justify-between gap-3 sm:flex">
            <button type="button" onClick={goBack} disabled={step === 0} className="btn btn-outline-dark">
              <ArrowRight className="size-5" aria-hidden="true" />
              السابق
            </button>
            {isLast ? (
              <a href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" onClick={onSend} className="btn btn-primary bg-[#25D366] px-8 text-white hover:bg-[#1ebe5a]">
                <WhatsAppIcon />
                أرسل الطلب عبر واتساب
              </a>
            ) : (
              <button type="button" onClick={goNext} className="btn btn-navy px-8">
                التالي
                <ArrowLeft className="size-5" aria-hidden="true" />
              </button>
            )}
          </div>
        </div>

        {/* Live summary (desktop) */}
        <aside className="card-surface sticky top-24 hidden p-5 lg:block" aria-label="ملخص اختياراتك">
          <h2 className="text-lg font-extrabold text-navy">ملخص ثوبك</h2>
          {product && (
            <div className="mt-4 flex items-center gap-3">
              <span className="relative size-14 overflow-hidden rounded-lg bg-silver-light">
                <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <span>
                <span className="block font-bold text-navy">{product.title}</span>
                <span className="block text-sm text-navy-soft">قماش {product.type}</span>
              </span>
            </div>
          )}
          <dl className="mt-4 space-y-2 text-sm">
            <MiniRow k="اللون" v={s.color ? colorLabel : ""} />
            <MiniRow k="الطراز" v={label(THOBE_STYLES, s.style)} />
            <MiniRow k="الياقة" v={label(COLLARS, s.collar)} />
            <MiniRow k="الأكمام" v={label(SLEEVES, s.sleeve)} />
            <MiniRow k="الأزرار" v={label(BUTTONS, s.buttons)} />
            <MiniRow k="الإضافات" v={s.extras.map((id) => label(EXTRAS, id)).join("، ")} />
            <MiniRow k="الكمية" v={String(s.quantity)} />
            <MiniRow k="المقاس" v={measurementStatus} />
          </dl>
          {orderRef && <p className="mt-4 border-t border-navy/10 pt-3 text-xs text-muted-foreground">الرقم المرجعي: <span dir="ltr">{orderRef}</span></p>}
        </aside>
      </div>

      {/* Mobile sticky step controls — reachable with one thumb */}
      <div className="fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-2xl border border-white/10 bg-navy-deep/95 p-2 shadow-2xl backdrop-blur-md sm:hidden">
        <button type="button" onClick={goBack} disabled={step === 0} className="btn btn-outline-light px-4" aria-label="الخطوة السابقة">
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
        {isLast ? (
          <a href={whatsappHref(message)} target="_blank" rel="noopener noreferrer" onClick={onSend} className="btn flex-1 bg-[#25D366] text-white">
            <WhatsAppIcon />
            أرسل الطلب عبر واتساب
          </a>
        ) : (
          <button type="button" onClick={goNext} className="btn btn-primary flex-1">
            التالي: {STEPS[step + 1].title}
            <ArrowLeft className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  )
}

function ChoiceCard({
  selected,
  onSelect,
  name,
  className,
  children,
}: {
  selected: boolean
  onSelect: () => void
  name: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      data-group={name}
      onClick={onSelect}
      className={cn(
        "relative flex min-h-16 items-center gap-3 rounded-xl border-2 p-3 text-start transition-colors",
        selected ? "border-navy bg-sky-soft" : "border-navy/10 bg-white hover:border-navy/30",
        className,
      )}
    >
      {children}
      {selected && (
        <span className="absolute left-3 top-3 flex size-6 items-center justify-center rounded-full bg-navy text-white">
          <Check className="size-4" aria-hidden="true" />
        </span>
      )}
    </button>
  )
}

function OptionGrid({ options, value, onChange, name }: { options: Option[]; value: string; onChange: (v: string) => void; name: string }) {
  return (
    <div role="radiogroup" className="mt-3 grid gap-3 sm:grid-cols-2">
      {options.map((o) => (
        <ChoiceCard key={o.id} selected={value === o.id} onSelect={() => onChange(o.id)} name={name}>
          <span className="pe-6">
            <span className="block font-bold text-navy">{o.label}</span>
            {o.hint && <span className="block text-sm text-muted-foreground">{o.hint}</span>}
          </span>
        </ChoiceCard>
      ))}
    </div>
  )
}

export function MeasurementFields({ value, onChange }: { value: Measurements; onChange: (m: Measurements) => void }) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {MEASUREMENT_FIELDS.map((f) => (
        <label key={f.key} className="block">
          <span className="field-label">{f.label}</span>
          <span className="relative block">
            <input
              className="field-input pe-4 ps-12"
              inputMode="decimal"
              dir="ltr"
              value={value[f.key] ?? ""}
              onChange={(e) => onChange({ ...value, [f.key]: e.target.value.replace(/[^\d.٠-٩]/g, "").slice(0, 5) })}
              aria-describedby={`hint-${f.key}`}
            />
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-silver-dark">سم</span>
          </span>
          <span id={`hint-${f.key}`} className="mt-1 block text-xs text-muted-foreground">{f.hint}</span>
        </label>
      ))}
    </div>
  )
}

function Field({ label, error, className, children }: { label: string; error?: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="field-label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm font-bold text-destructive" role="alert">{error}</span>}
    </label>
  )
}

function MiniRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className={cn("text-end font-bold", v ? "text-navy" : "text-silver-dark")}>{v || "—"}</dd>
    </div>
  )
}

function SummaryList({
  s,
  product,
  colorLabel,
  measurementStatus,
  onEdit,
}: {
  s: State
  product: ReturnType<typeof getProduct>
  colorLabel: string
  measurementStatus: string
  onEdit: (i: number) => void
}) {
  const rows: { k: string; v: string; step: number }[] = [
    { k: "القماش", v: product ? `${product.title} – ${product.type}` : "مساعدة في الاختيار", step: 0 },
    { k: "اللون", v: colorLabel, step: 1 },
    { k: "الطراز / الياقة", v: [label(THOBE_STYLES, s.style), label(COLLARS, s.collar)].filter(Boolean).join(" · "), step: 2 },
    { k: "الأكمام", v: label(SLEEVES, s.sleeve), step: 3 },
    { k: "الأزرار", v: label(BUTTONS, s.buttons), step: 4 },
    { k: "الإضافات والكمية", v: [s.extras.map((id) => label(EXTRAS, id)).join("، ") || "بدون إضافات", `${s.quantity} ثوب`].join(" · "), step: 5 },
    { k: "المقاس", v: measurementStatus, step: 6 },
  ]
  return (
    <div className="divide-y divide-navy/10 rounded-xl border border-navy/10">
      {rows.map((r) => (
        <div key={r.k} className="flex items-center justify-between gap-3 p-3 sm:p-4">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{r.k}</p>
            <p className="font-bold text-navy">{r.v || "—"}</p>
          </div>
          <button type="button" onClick={() => onEdit(r.step)} className="flex size-10 shrink-0 items-center justify-center rounded-lg text-navy-soft hover:bg-sky-soft" aria-label={`تعديل ${r.k}`}>
            <Pencil className="size-4" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
  )
}
