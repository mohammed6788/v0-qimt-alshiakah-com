import Image from "next/image"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

type Props = {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  breadcrumb?: { href: string; label: string }[]
  children?: React.ReactNode
  /** Optional decorative photo shown beside the title (below it on mobile). */
  image?: { src: string; alt: string; width: number; height: number }
  /** Shorter header on mobile (task pages where the content should start sooner). */
  compact?: boolean
}

/** Shared navy page header used by every inner page. */
export function PageHeader({ eyebrow, title, description, breadcrumb, children, image, compact }: Props) {
  return (
    <section className={`navy-gradient text-white sm:pb-16 sm:pt-32 ${compact ? "pb-12 pt-24" : "pb-12 pt-28"}`}>
      <div
        className={`container-site motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-500 ${image ? "grid items-center gap-6 md:grid-cols-[1.1fr_1fr] md:gap-10" : ""}`}
      >
        <div>
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
        <h1 className="type-h1">{title}</h1>
        {description && <p className={`mt-3 max-w-2xl text-base text-silver text-pretty ${compact ? "hidden sm:block" : ""}`}>{description}</p>}
        {children}
        </div>
        {image && (
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl ring-1 ring-white/10 md:aspect-[4/3]">
            <Image src={image.src} alt={image.alt} fill priority sizes="(max-width: 768px) 100vw, 45vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/40 to-transparent" aria-hidden="true" />
          </div>
        )}
      </div>
    </section>
  )
}
