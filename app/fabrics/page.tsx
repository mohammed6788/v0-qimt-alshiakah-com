import type { Metadata } from "next"
import { FabricCatalog } from "@/components/fabric-catalog"
import { PageHeader } from "@/components/site/page-header"
import { JsonLd } from "@/components/json-ld"
import { CtaBand } from "@/components/site/cta-band"
import { PRODUCTS, SITE_URL } from "@/lib/constants"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

export const metadata: Metadata = {
  title: "أقمشة ثياب رجالية – الأسعار والأنواع",
  description:
    "تصفح أقمشة الثياب الرجالية في قمة الشياكة بالمكلا: ياباني، كوري، صيني وتايلاندي. قارن الأسعار والمنشأ واطلب القماش وتفصيل ثوبك عبر واتساب.",
  alternates: { canonical: "/fabrics" },
  openGraph: { url: `${SITE_URL}/fabrics`, title: "أقمشة ثياب رجالية | قمة الشياكة" },
}

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "أقمشة قمة الشياكة",
  itemListElement: PRODUCTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_URL}/fabrics/${p.slug}`,
    name: p.title,
  })),
}

export default function FabricsPage() {
  return (
    <>
      <JsonLd data={itemList} />
      <JsonLd data={breadcrumbSchema([{ name: "الأقمشة", path: "/fabrics" }])} />
      <PageHeader
        eyebrow="كتالوج الأقمشة"
        title="أقمشة ثياب رجالية مختارة"
        description="قارن بين الأقمشة حسب المنشأ والسعر، ثم اطلب القماش مباشرة عبر واتساب أو صمّم ثوبك خطوة بخطوة."
        breadcrumb={[{ href: "/fabrics", label: "الأقمشة" }]}
      />
      <section className="bg-ivory pb-20">
        <div className="container-site">
          <FabricCatalog />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            الأسعار المعروضة حسب آخر تحديث من المحل، ويتم تأكيد السعر النهائي والتوفر والألوان عند الطلب عبر واتساب.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
