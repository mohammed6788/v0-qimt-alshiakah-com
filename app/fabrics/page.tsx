import type { Metadata } from "next"
import { pageOpenGraph } from "@/lib/seo"
import { FabricCatalog } from "@/components/fabric-catalog"
import { PageHeader } from "@/components/site/page-header"
import { JsonLd } from "@/components/json-ld"
import { CtaBand } from "@/components/site/cta-band"
import { PRODUCTS, SITE_URL } from "@/lib/constants"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

export const metadata: Metadata = {
  title: "أقمشة ثياب رجالية – الأنواع والمناشئ",
  description:
    "تصفح أقمشة الثياب الرجالية في قمة الشياكة بالمكلا: ياباني، سميرا أميس، خلية النحل، كوري، صيني وشتوي. تعرّف على الأنواع واطلب القماش وتفصيل ثوبك عبر واتساب.",
  alternates: { canonical: "/fabrics" },
  openGraph: pageOpenGraph("/fabrics", "أقمشة ثياب رجالية | قمة الشياكة"),
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
        description="تصفّح أنواع الأقمشة: ياباني، سميرا أميس، خلية النحل، كوري، صيني وشتوي، ثم اطلب القماش مباشرة عبر واتساب أو صمّم ثوبك خطوة بخطوة."
        breadcrumb={[{ href: "/fabrics", label: "الأقمشة" }]}
        image={{ src: "/brand/fabrics-stack.webp", alt: "تشكيلة من أقمشة الثياب الرجالية بدرجات ألوان هادئة", width: 1200, height: 790 }}
      />
      <section className="bg-ivory pb-20">
        <div className="container-site">
          <FabricCatalog />
          <p className="mt-8 text-center text-sm text-muted-foreground">
            جميع الأسعار بالريال اليمني وشاملة القماش والتفصيل. توفّر الألوان يؤكده فريقنا عند الطلب.
          </p>
        </div>
      </section>
      <CtaBand />
    </>
  )
}
