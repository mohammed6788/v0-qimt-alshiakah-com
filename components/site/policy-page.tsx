import Link from "next/link"
import { PageHeader } from "@/components/site/page-header"
import { CtaBand } from "@/components/site/cta-band"
import { JsonLd } from "@/components/json-ld"
import { breadcrumbSchema } from "@/lib/breadcrumbs"
import { POLICY_LINKS } from "@/lib/constants"

export type PolicySection = { title: string; points: React.ReactNode[] }

type Props = {
  path: string
  label: string
  eyebrow: string
  title: React.ReactNode
  description: React.ReactNode
  intro?: React.ReactNode
  sections: PolicySection[]
  updated: string
}

/** Shared layout for the guarantee, privacy and terms pages. */
export function PolicyPage({ path, label, eyebrow, title, description, intro, sections, updated }: Props) {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: label, path }])} />
      <PageHeader eyebrow={eyebrow} title={title} description={description} breadcrumb={[{ href: path, label }]} compact />

      <section className="bg-ivory py-12 sm:py-16">
        <div className="container-site grid gap-8 lg:grid-cols-[1fr_260px]">
          <article className="space-y-6">
            {intro && <div className="card-surface p-5 text-base text-navy sm:p-6">{intro}</div>}
            {sections.map((s, i) => (
              <section key={s.title} className="card-surface p-5 sm:p-6" aria-labelledby={`policy-${i}`}>
                <h2 id={`policy-${i}`} className="type-h3 text-navy">
                  <span className="num me-2 text-sky">{i + 1}.</span>
                  {s.title}
                </h2>
                <ul className="mt-4 space-y-3 text-muted-foreground">
                  {s.points.map((p, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-navy-soft" aria-hidden="true" />
                      <span className="text-pretty">{p}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            <p className="text-sm text-muted-foreground">آخر تحديث: {updated}</p>
          </article>

          <aside className="h-fit lg:sticky lg:top-28">
            <nav aria-label="سياسات المتجر" className="card-surface p-5">
              <h2 className="text-sm font-semibold text-navy">سياسات المتجر</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {POLICY_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={l.href === path ? "page" : undefined}
                      className={l.href === path ? "font-semibold text-navy" : "text-navy-soft hover:underline"}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      <CtaBand placement={`policy_${path.slice(1)}`} />
    </>
  )
}
