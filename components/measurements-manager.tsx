"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Pencil, RotateCcw, Save, Scissors, ShieldCheck, Trash2 } from "lucide-react"
import { MeasurementFields } from "@/components/design-builder"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import { PRODUCTS, whatsappHref } from "@/lib/constants"
import { EVENTS, trackEvent, trackWhatsAppClick } from "@/lib/analytics"
import {
  MEASUREMENT_FIELDS,
  buildOrderMessage,
  clearProfile,
  generateOrderRef,
  hasMeasurements,
  loadProfile,
  saveProfile,
  type MeasurementProfile,
  type Measurements,
} from "@/lib/tailoring"
import { cn } from "@/lib/utils"

type Draft = { name: string; phone: string; city: string; notes: string; measurements: Measurements; consent: boolean }

const emptyDraft: Draft = { name: "", phone: "", city: "المكلا", notes: "", measurements: {}, consent: false }

export function MeasurementsManager() {
  const [ready, setReady] = useState(false)
  const [profile, setProfile] = useState<MeasurementProfile | null>(null)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState<Draft>(emptyDraft)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState("")
  const [reorderFabric, setReorderFabric] = useState("")
  const [reorderQty, setReorderQty] = useState(1)

  useEffect(() => {
    const p = loadProfile()
    setProfile(p)
    setEditing(!p)
    setReady(true)
  }, [])

  const validate = (requireConsent: boolean) => {
    const e: Record<string, string> = {}
    if (draft.name.trim().length < 2) e.name = "يرجى كتابة الاسم"
    const digits = draft.phone.replace(/\D/g, "")
    if (digits.length < 7 || digits.length > 15) e.phone = "يرجى كتابة رقم تواصل صحيح"
    if (!hasMeasurements(draft.measurements)) e.measurements = "أدخل مقاساً واحداً على الأقل"
    if (requireConsent && !draft.consent) e.consent = "يلزم موافقتك لحفظ البيانات على هذا الجهاز"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const toProfile = (): MeasurementProfile => ({
    name: draft.name.trim(),
    phone: draft.phone.trim(),
    city: draft.city.trim(),
    notes: draft.notes.trim(),
    measurements: draft.measurements,
    savedAt: new Date().toISOString(),
  })

  const onSave = () => {
    if (!validate(true)) return
    const p = toProfile()
    if (saveProfile(p)) {
      setProfile(p)
      setEditing(false)
      setStatus("تم حفظ مقاساتك على هذا الجهاز. يمكنك الآن إعادة الطلب في أي وقت.")
      trackEvent(EVENTS.measurementsSaved, { placement: "measurements_page" })
    } else {
      setStatus("تعذّر الحفظ على هذا المتصفح (قد يكون في وضع التصفح الخاص). أرسل مقاساتك لنا عبر واتساب لنحتفظ بها.")
    }
  }

  const sendToShopHref = whatsappHref(
    buildOrderMessage({
      kind: "measurements",
      name: draft.name.trim(),
      phone: draft.phone.trim(),
      city: draft.city.trim(),
      measurements: draft.measurements,
      notes: draft.notes || "أرجو حفظ مقاساتي لديكم للطلبات القادمة.",
    }),
  )

  const onSendToShop = (e: React.MouseEvent) => {
    if (!validate(false)) {
      e.preventDefault()
      return
    }
    if (draft.consent) {
      const p = toProfile()
      if (saveProfile(p)) setProfile(p)
    }
    trackWhatsAppClick("whatsapp_measurement", "measurements_send_to_shop")
    trackEvent(EVENTS.orderSubmit, { flow: "measurements" })
  }

  const startEdit = () => {
    if (profile) {
      setDraft({
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        notes: profile.notes ?? "",
        measurements: profile.measurements,
        consent: true,
      })
    }
    setErrors({})
    setStatus("")
    setEditing(true)
  }

  const onDelete = () => {
    if (!window.confirm("هل تريد حذف مقاساتك المحفوظة من هذا الجهاز؟")) return
    clearProfile()
    setProfile(null)
    setDraft(emptyDraft)
    setEditing(true)
    setStatus("تم حذف بياناتك من هذا الجهاز.")
    trackEvent(EVENTS.measurementsCleared)
  }

  const reorderFabricProduct = PRODUCTS.find((p) => p.slug === reorderFabric)
  const reorderHref = profile
    ? whatsappHref(
        buildOrderMessage({
          kind: "reorder",
          ref: generateOrderRef(),
          name: profile.name,
          phone: profile.phone,
          city: profile.city,
          fabric: reorderFabricProduct ?? { title: "نفس القماش السابق أو حسب الاستشارة" },
          quantity: reorderQty,
          measurementStatus: "نفس مقاساتي المحفوظة (مرفقة أدناه)",
          measurements: profile.measurements,
          notes: profile.notes,
        }),
      )
    : "#"

  if (!ready) return <div className="card-surface h-72 animate-pulse" aria-hidden="true" />

  return (
    <div className="space-y-6">
      {status && (
        <p className="rounded-xl bg-sky-soft p-4 text-sm font-bold text-navy" role="status">
          {status}
        </p>
      )}

      {profile && !editing && (
        <div className="card-surface overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-navy p-5 text-white">
            <div className="flex items-center gap-3">
              <ShieldCheck className="size-7 text-sky" aria-hidden="true" />
              <div>
                <p className="text-lg font-extrabold">مقاسات {profile.name}</p>
                <p className="text-sm text-silver">محفوظة على هذا الجهاز · {new Date(profile.savedAt).toLocaleDateString("ar-EG")}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={startEdit} className="btn btn-outline-light min-h-10 px-3 text-sm">
                <Pencil className="size-4" aria-hidden="true" /> تعديل
              </button>
              <button type="button" onClick={onDelete} className="btn min-h-10 border border-white/20 px-3 text-sm text-white hover:bg-red-600">
                <Trash2 className="size-4" aria-hidden="true" /> حذف
              </button>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-px bg-navy/10 sm:grid-cols-4">
            {MEASUREMENT_FIELDS.map((f) => (
              <div key={f.key} className="bg-white p-4">
                <dt className="text-xs text-muted-foreground">{f.label}</dt>
                <dd className="mt-1 text-lg font-extrabold text-navy">
                  {profile.measurements[f.key] ? `${profile.measurements[f.key]} سم` : "—"}
                </dd>
              </div>
            ))}
          </dl>

          <div className="space-y-4 p-5">
            <h3 className="text-lg font-extrabold text-navy">أعد طلب ثوبك بنفس المقاسات</h3>
            <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
              <label className="block">
                <span className="field-label">القماش</span>
                <select className="field-input" value={reorderFabric} onChange={(e) => setReorderFabric(e.target.value)}>
                  <option value="">نفس القماش السابق / حسب الاستشارة</option>
                  {PRODUCTS.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">الكمية</span>
                <select className="field-input" value={reorderQty} onChange={(e) => setReorderQty(Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={reorderHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  trackWhatsAppClick("whatsapp_reorder", "measurements_reorder")
                  trackEvent(EVENTS.orderSubmit, { flow: "reorder", fabric: reorderFabric || "same", quantity: reorderQty })
                }}
                className="btn bg-[#25D366] text-white hover:bg-[#1ebe5a]"
              >
                <RotateCcw className="size-5" aria-hidden="true" />
                أرسل طلب إعادة التفصيل
              </a>
              <Link href="/design" className="btn btn-outline-dark">
                <Scissors className="size-5" aria-hidden="true" />
                صمم ثوباً جديداً بمقاساتي
              </Link>
            </div>
          </div>
        </div>
      )}

      {editing && (
        <div className="card-surface p-5 sm:p-7">
          <h3 className="text-xl font-extrabold text-navy">{profile ? "تعديل مقاساتك" : "سجّل مقاساتك"}</h3>
          <p className="mt-1 text-sm text-muted-foreground">القياسات بالسنتيمتر. اكتب ما تعرفه منها، ونستكمل الباقي معك.</p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <TextField label="الاسم" error={errors.name}>
              <input className="field-input" autoComplete="name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </TextField>
            <TextField label="رقم التواصل" error={errors.phone}>
              <input className="field-input" type="tel" inputMode="tel" dir="ltr" autoComplete="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
            </TextField>
            <TextField label="المدينة">
              <input className="field-input" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} />
            </TextField>
          </div>

          <MeasurementFields value={draft.measurements} onChange={(m) => setDraft({ ...draft, measurements: m })} />
          {errors.measurements && <p className="mt-2 text-sm font-bold text-destructive" role="alert">{errors.measurements}</p>}

          <label className="mt-5 block">
            <span className="field-label">ملاحظات على المقاس (اختياري)</span>
            <textarea
              className="field-input min-h-20 py-3"
              maxLength={300}
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              placeholder="مثال: أفضّل الثوب واسعاً قليلاً عند الصدر"
            />
          </label>

          <label className={cn("mt-5 flex items-start gap-3 rounded-xl p-4 text-sm text-navy", errors.consent ? "bg-red-50" : "bg-sky-soft")}>
            <input type="checkbox" className="mt-0.5 size-5 accent-[#011d45]" checked={draft.consent} onChange={(e) => setDraft({ ...draft, consent: e.target.checked })} />
            <span>
              أوافق على حفظ اسمي ورقمي ومقاساتي <strong>على هذا الجهاز فقط</strong> لاستخدامها في الطلبات القادمة، ويمكنني حذفها في أي وقت.
              {errors.consent && <span className="mt-1 block font-bold text-destructive">{errors.consent}</span>}
            </span>
          </label>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" onClick={onSave} className="btn btn-navy">
              <Save className="size-5" aria-hidden="true" />
              احفظ على جهازي
            </button>
            <a href={sendToShopHref} target="_blank" rel="noopener noreferrer" onClick={onSendToShop} className="btn bg-[#25D366] text-white hover:bg-[#1ebe5a]">
              <WhatsAppIcon />
              أرسل مقاساتي للمحل للحفظ
            </a>
          </div>
          {profile && (
            <button type="button" onClick={() => setEditing(false)} className="mt-4 text-sm font-bold text-navy-soft hover:underline">
              إلغاء التعديل
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function TextField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm font-bold text-destructive" role="alert">{error}</span>}
    </label>
  )
}
