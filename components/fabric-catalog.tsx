"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { FabricCard } from "@/components/fabric-card"
import { PRODUCTS } from "@/lib/constants"
import { EVENTS, trackEvent } from "@/lib/analytics"
import { cn } from "@/lib/utils"

type Sort = "featured" | "price_asc" | "price_desc"

const ORIGINS = Array.from(new Set(PRODUCTS.map((p) => p.origin).filter(Boolean))) as string[]
const PRICES = PRODUCTS.map((p) => p.price)
const MIN_PRICE = Math.min(...PRICES)
const MAX_PRICE = Math.max(...PRICES)

const PRICE_BANDS = [
  { id: "all", label: "كل الأسعار", test: () => true },
  { id: "lt35", label: "أقل من 35,000", test: (n: number) => n < 35000 },
  { id: "35to50", label: "35,000 – 50,000", test: (n: number) => n >= 35000 && n <= 50000 },
  { id: "gt50", label: "أكثر من 50,000", test: (n: number) => n > 50000 },
] as const

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
  const [origin, setOrigin] = useState<string>("all")
  const [band, setBand] = useState<(typeof PRICE_BANDS)[number]["id"]>("all")
  const [sort, setSort] = useState<Sort>("featured")
  const searchTracked = useRef(false)

  useEffect(() => {
    trackEvent(EVENTS.fabricListView, { product_count: PRODUCTS.length })
  }, [])

  const results = useMemo(() => {
    const q = normalize(query)
    const bandTest = PRICE_BANDS.find((b) => b.id === band)!.test
    const list = PRODUCTS.filter((p) => {
      if (origin !== "all" && p.origin !== origin) return false
      if (!bandTest(p.price)) return false
      if (!q) return true
      return [p.title, p.titleEn, p.description, p.type, p.origin ?? ""].some((f) => normalize(f).includes(q))
    })
    if (sort === "price_asc") return [...list].sort((a, b) => a.price - b.price)
    if (sort === "price_desc") return [...list].sort((a, b) => b.price - a.price)
    return list
  }, [query, origin, band, sort])

  const activeFilters = (origin !== "all" ? 1 : 0) + (band !== "all" ? 1 : 0) + (query ? 1 : 0)

  const reset = () => {
    setQuery("")
    setOrigin("all")
    setBand("all")
    setSort("featured")
  }

  return (
    <div>
      <div className="card-surface -mt-8 space-y-4 p-4 sm:-mt-10 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
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
              placeholder="ابحث باسم القماش أو المنشأ…"
              className="field-input pr-12"
            />
          </label>
          <label className="block">
            <span className="sr-only">ترتيب النتائج</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field-input">
              <option value="featured">الترتيب: المميز أولاً</option>
              <option value="price_asc">السعر: من الأقل للأعلى</option>
              <option value="price_desc">السعر: من الأعلى للأقل</option>
            </select>
          </label>
        </div>

        <div className="flex items-start gap-3">
          <SlidersHorizontal className="mt-2 size-5 shrink-0 text-navy-soft" aria-hidden="true" />
          <div className="min-w-0 flex-1 space-y-3">
            <FilterRow label="المنشأ / النوع">
              <Chip active={origin === "all"} onClick={() => setOrigin("all")}>الكل</Chip>
              {ORIGINS.map((o) => (
                <Chip key={o} active={origin === o} onClick={() => setOrigin(o)}>
                  {o}
                </Chip>
              ))}
            </FilterRow>
            <FilterRow label="السعر">
              {PRICE_BANDS.map((b) => (
                <Chip key={b.id} active={band === b.id} onClick={() => setBand(b.id)}>
                  {b.label}
                </Chip>
              ))}
            </FilterRow>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between gap-4" aria-live="polite">
        <p className="text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "قماش" : "أقمشة"} · الأسعار من {MIN_PRICE.toLocaleString("en-US")} إلى{" "}
          {MAX_PRICE.toLocaleString("en-US")} ر.ي
        </p>
        {activeFilters > 0 && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 text-sm font-bold text-navy-soft underline-offset-4 hover:underline">
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
          <p className="text-lg font-bold text-navy">لا توجد أقمشة مطابقة للبحث.</p>
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
      <span className="hidden shrink-0 text-sm font-bold text-navy sm:inline">{label}:</span>
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
        "min-h-10 shrink-0 whitespace-nowrap rounded-full border px-4 text-sm font-bold transition-colors",
        active ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40",
      )}
    >
      {children}
    </button>
  )
}
