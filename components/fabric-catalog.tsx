"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { FabricCard } from "@/components/fabric-card"
import { PRODUCTS } from "@/lib/constants"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { cn } from "@/lib/utils"

// Fabric types in the order they appear in the catalog.
const TYPES = Array.from(new Set(PRODUCTS.map((p) => p.type)))
const countByType = (t: string) => PRODUCTS.filter((p) => p.type === t).length

function normalize(s: string) {
  return s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/\s+/g, "")
}

export function FabricCatalog() {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<string>("all")
  const searchTracked = useRef(false)

  useEffect(() => {
    trackEvent(EVENTS.fabricListView, { product_count: PRODUCTS.length })
  }, [])

  const results = useMemo(() => {
    const q = normalize(query)
    return PRODUCTS.filter((p) => {
      if (type !== "all" && p.type !== type) return false
      if (!q) return true
      return [p.title, p.titleEn, p.description, p.type, p.origin ?? ""].some((f) => normalize(f).includes(q))
    })
  }, [query, type])

  const activeFilters = (type !== "all" ? 1 : 0) + (query ? 1 : 0)

  const reset = () => {
    setQuery("")
    setType("all")
  }

  return (
    <div>
      <div className="card-surface -mt-8 space-y-4 p-4 sm:-mt-10 sm:p-5">
        <label className="relative block">
          <span className="sr-only">ابحث عن قماش</span>
          <Search className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-silver-dark" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              if (!searchTracked.current && e.target.value.length > 1) {
                searchTracked.current = true
                trackEvent(EVENTS.fabricSearch)
              }
            }}
            placeholder="ابحث باسم القماش أو نوعه…"
            className="field-input pr-12"
          />
        </label>

        <div className="flex items-start gap-3">
          <SlidersHorizontal className="mt-2 size-5 shrink-0 text-navy-soft" aria-hidden="true" />
          <FilterRow label="نوع القماش">
            <Chip active={type === "all"} onClick={() => setType("all")}>
              الكل ({PRODUCTS.length})
            </Chip>
            {TYPES.map((t) => (
              <Chip
                key={t}
                active={type === t}
                onClick={() => {
                  setType(t)
                  trackEvent("fabric_type_filter", { type: t })
                }}
              >
                {t} ({countByType(t)})
              </Chip>
            ))}
          </FilterRow>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4" aria-live="polite">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "قماش" : "أقمشة"}
          {type !== "all" && ` · قماش ${type}`}
        </p>
        {activeFilters > 0 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-semibold text-navy-soft underline-offset-4 hover:underline">
            <X className="size-4" aria-hidden="true" /> مسح الفلاتر
          </button>
        )}
      </div>

      {results.length > 0 ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((p, i) => (
            <FabricCard key={p.id} product={p} priority={i < 2} />
          ))}
        </div>
      ) : (
        <div className="card-surface mt-5 p-10 text-center">
          <p className="type-h3 text-navy">لا توجد أقمشة مطابقة للبحث.</p>
          <p className="mt-2 text-muted-foreground">جرّب كلمة أخرى أو امسح الفلاتر، أو اسألنا مباشرة عبر واتساب.</p>
          <button type="button" onClick={reset} className="btn btn-outline-dark mt-5">
            عرض كل الأقمشة
          </button>
        </div>
      )}
    </div>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex min-w-0 items-center gap-2">
      <span className="hidden shrink-0 text-sm font-semibold text-navy sm:inline">{label}:</span>
      <div className="-mx-1 flex min-w-0 gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">{children}</div>
    </div>
  )
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors",
        active ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40",
      )}
    >
      {children}
    </button>
  )
}
