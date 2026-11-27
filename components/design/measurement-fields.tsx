"use client"

import { MEASUREMENT_FIELDS, REQUIRED_MEASUREMENTS, measurementError, normalizeDigits, type Measurements } from "@/lib/tailoring"
import { cn } from "@/lib/utils"

type Props = {
  value: Measurements
  onChange: (m: Measurements) => void
  /** When true, required fields show validation messages. */
  showErrors?: boolean
}

/** Measurement inputs (cm). Required fields are marked; others are optional. */
export function MeasurementFields({ value, onChange, showErrors }: Props) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
      {MEASUREMENT_FIELDS.map((f) => {
        const required = REQUIRED_MEASUREMENTS.includes(f.key)
        const err = showErrors && required ? measurementError(value[f.key]) : ""
        return (
          <label key={f.key} className="block min-w-0">
            <span className="field-label">
              {f.label}
              {required ? <span className="text-destructive"> *</span> : <span className="text-xs font-normal text-muted-foreground"> (اختياري)</span>}
            </span>
            <span className="relative block">
              <input
                className={cn("field-input pe-4 ps-11", err && "border-destructive")}
                inputMode="decimal"
                dir="ltr"
                name={`m_${f.key}`}
                aria-invalid={!!err}
                aria-required={required}
                value={value[f.key] ?? ""}
                onChange={(e) =>
                  onChange({ ...value, [f.key]: normalizeDigits(e.target.value).replace(/[^\d.]/g, "").slice(0, 5) })
                }
                aria-describedby={`hint-${f.key}`}
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-silver-dark">سم</span>
            </span>
            <span id={`hint-${f.key}`} className={cn("mt-1 block text-xs", err ? "font-semibold text-destructive" : "text-muted-foreground")}>
              {err || f.hint}
            </span>
          </label>
        )
      })}
    </div>
  )
}
