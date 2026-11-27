import type { Metadata } from "next"
import { Suspense } from "react"
import { DesignBuilder } from "@/components/design-builder"
import { PageHeader } from "@/components/site/page-header"
import { JsonLd } from "@/components/json-ld"
import { SITE_URL } from "@/lib/constants"
import { breadcrumbSchema } from "@/lib/breadcrumbs"

export const metadata: Metadata = {
  title: "صمم ثوبك – تفصيل ثوب سعودي حسب المقاس",
  description:
    "صمّم ثوبك الرجالي خطوة بخطوة: القماش، اللون، الياقة، الأكمام، الأزرار والمقاس، ثم أرسل طلب التفصيل جاهزاً عبر واتساب إلى قمة الشياكة في المكلا.",
  alternates: { canonical: "/design" },
  openGraph: { url: `${SITE_URL}/design`, title: "صمم ثوبك | قمة الشياكة" },
}

export default function DesignPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "صمم ثوبك", path: "/design" }])} />
      <PageHeader
        eyebrow="تجربة التفصيل"
        title="صمّم ثوبك على ذوقك"
        description="اختر قماشك وتفاصيل ثوبك من موديلاتنا المعتمدة، وراجع الملخص قبل الإرسال. يصلنا طلبك منظماً عبر واتساب لنؤكده معك."
        breadcrumb={[{ href: "/design", label: "صمم ثوبك" }]}
      />
      <section className="bg-ivory pb-10 sm:pb-20">
        <div className="container-site">
          <Suspense fallback={<div className="card-surface -mt-10 h-64 animate-pulse" />}>
            <DesignBuilder />
          </Suspense>
        </div>
      </section>
    </>
  )
}
