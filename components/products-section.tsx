import { ArrowLeft } from "lucide-react"
import { FabricCard } from "@/components/fabric-card"
import { TrackedLink } from "@/components/tracked-link"
import { PRODUCTS } from "@/lib/constants"

/** Home-page fabric preview — the full catalog lives at /fabrics. */
export function ProductsSection() {
  const featured = PRODUCTS.slice(0, 3)
  return (
    <section id="products" className="bg-ivory py-16 sm:py-24">
      <div className="container-site">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow !text-navy-soft">مختارات الأقمشة</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">أقمشة ثياب رجالية مختارة</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">أسعار واضحة، ومنشأ معروف، وطلب مباشر عبر واتساب.</p>
          </div>
          <TrackedLink href="/fabrics" event="home_all_fabrics_click" className="btn btn-outline-dark shrink-0">
            كل الأقمشة ({PRODUCTS.length})
            <ArrowLeft className="size-5" aria-hidden="true" />
          </TrackedLink>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <FabricCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}
