"use client"

import { MEASUREMENT_FIELDS, MEASUREMENT_UNIT, REQUIRED_MEASUREMENTS, measurementError, normalizeDigits, type Measurements } from "@/lib/tailoring"
import { cn } from "@/lib/utils"

type Props = {
  value: Measurements
  onChange: (m: Measurements) => void
  /** When true, required fields show validation messages. */
  showErrors?: boolean
  /** When false, empty fields are allowed and only filled values are checked. */
  enforceRequired?: boolean
}

/** Measurement inputs (inches). Required fields are marked; others are optional. */
export function MeasurementFields({ value, onChange, showErrors, enforceRequired = true }: Props) {
  return (
    <div className="mt-5 grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-4">
      {MEASUREMENT_FIELDS.map((f) => {
        const required = REQUIRED_MEASUREMENTS.includes(f.key)
        const err = showErrors ? measurementError(f.key, value[f.key], required && enforceRequired) : ""
        return (
          <label key={f.key} className="block min-w-0">
            <span className="field-label">
              {f.label}
              {required ? <span className="text-destructive"> *</span> : <span className="text-xs font-normal text-muted-foreground"> (اختياري)</span>}
            </span>
            <span className="relative block">
              <input
                className={cn("field-input pe-4 ps-12", err && "border-destructive")}
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
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-silver-dark">{MEASUREMENT_UNIT}</span>
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
