import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type Props = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: { href: string; label: string }[]
  children?: React.ReactNode
}

/** Shared navy page header used by every inner page. */
export function PageHeader({ eyebrow, title, description, breadcrumb, children }: Props) {
  return (
    <section className="navy-gradient pb-12 pt-28 text-white sm:pb-16 sm:pt-32">
      <div className="container-site motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500">
        {breadcrumb && (
          <nav aria-label="مسار التصفح" className="mb-5 text-sm text-silver">
            <ol className="flex flex-wrap items-center gap-1">
              <li>
                <Link href="/" className="hover:text-white">الرئيسية</Link>
              </li>
              {breadcrumb.map((b) => (
                <li key={b.href} className="flex items-center gap-1">
                  <ChevronLeft className="size-4 text-silver-dark" aria-hidden="true" />
                  <Link href={b.href} className="hover:text-white">{b.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="text-3xl font-extrabold leading-tight text-balance sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-silver text-pretty">{description}</p>}
        {children}
      </div>
    </section>
  )
}
