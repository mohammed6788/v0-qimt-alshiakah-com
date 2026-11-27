import { FabricImage } from "@/components/fabric-image"
import { ArrowLeft } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { TrackedLink } from "@/components/tracked-link"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import {
  AVAILABILITY_LABEL,
  AVAILABILITY_UNKNOWN,
  PRICE_LABEL,
  PRICE_ON_REQUEST,
  SHOW_PRICES,
  formatPrice,
  whatsappHref,
  type Product,
} from "@/lib/constants"
import { EVENTS } from "@/lib/analytics"
import { buildOrderMessage } from "@/lib/tailoring"
import { cn } from "@/lib/utils"

export function fabricWhatsAppMessage(p: Product) {
  return buildOrderMessage({
    kind: "fabric",
    fabric: p,
    notes: "أرغب بطلب تفصيل ثوب من هذا القماش، أرجو تأكيد التوفر والألوان المتاحة.",
  })
}

export function AvailabilityBadge({ product, className }: { product: Product; className?: string }) {
  const a = product.availability
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        a === "in_stock" && "bg-emerald-50 text-emerald-800",
        a === "limited" && "bg-amber-50 text-amber-800",
        a === "out_of_stock" && "bg-red-50 text-red-800",
        !a && "bg-silver-light text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          a === "in_stock" && "bg-emerald-600",
          a === "limited" && "bg-amber-600",
          a === "out_of_stock" && "bg-red-600",
          !a && "bg-silver-dark",
        )}
        aria-hidden="true"
      />
      {a ? AVAILABILITY_LABEL[a] : AVAILABILITY_UNKNOWN}
    </span>
  )
}

export function PriceBlock({ product, large }: { product: Product; large?: boolean }) {
  if (!SHOW_PRICES) return null
  if (product.price === undefined)
    return (
      <div>
        <p className={cn("font-semibold text-navy", large ? "text-xl" : "text-base")}>{PRICE_ON_REQUEST}</p>
        <p className="text-xs text-muted-foreground">{PRICE_LABEL}</p>
      </div>
    )
  const hasDiscount = product.compareAtPrice !== undefined && product.compareAtPrice > product.price
  return (
    <div data-testid="price-block">
      <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
        <p className={cn("num font-bold text-navy", large ? "text-[1.75rem] leading-snug" : "text-[1.375rem] leading-snug")}>
          {formatPrice(product.price, product.currency)}
        </p>
        {hasDiscount && (
          <>
            <s className={cn("num font-medium text-silver-dark", large ? "text-base" : "text-sm")}>
              <span className="sr-only">السعر قبل الخصم: </span>
              {formatPrice(product.compareAtPrice!, product.currency)}
            </s>
            <span className="num rounded-full bg-sky-soft px-2 py-0.5 text-xs font-semibold text-navy-soft">
              وفّر {formatPrice(product.compareAtPrice! - product.price, product.currency)}
            </span>
          </>
        )}
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">{PRICE_LABEL}</p>
    </div>
  )
}

export function FabricCard({ product, priority }: { product: Product; priority?: boolean }) {
  const href = `/fabrics/${product.slug}`
  return (
    <article className="card-surface group flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_-24px_rgba(1,29,69,0.45)]">
      <TrackedLink
        href={href}
        event={EVENTS.fabricDetailsClick}
        properties={{ fabric: product.slug, placement: "card_image" }}
        className="relative block aspect-[4/3] overflow-hidden bg-silver-light"
        tabIndex={-1}
        aria-hidden="true"
      >
        <FabricImage product={product} priority={priority} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="transition-transform duration-500 motion-safe:group-hover:scale-105" />
        {product.tag && product.tag !== product.type && (
          <span className="absolute right-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {product.tag}
          </span>
        )}
      </TrackedLink>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          <span className="rounded-full bg-navy px-2.5 py-1 font-semibold text-white">قماش {product.type}</span>
          <AvailabilityBadge product={product} />
        </div>
        <h3 className="type-title text-navy">
          <TrackedLink
            href={href}
            event={EVENTS.fabricDetailsClick}
            properties={{ fabric: product.slug, placement: "card_title" }}
            className="hover:text-navy-soft"
          >
            {product.title}
          </TrackedLink>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        {SHOW_PRICES && (
          <div className="mt-4 border-t border-navy/10 pt-4">
            <PriceBlock product={product} />
          </div>
        )}

        <div className="mt-auto grid pt-5 grid-cols-[1fr_auto] gap-2">
          <WhatsAppLink
            href={whatsappHref(fabricWhatsAppMessage(product))}
            intent="whatsapp_fabric"
            placement={`fabric_card_${product.slug}`}
            className="btn btn-navy min-h-11 px-3 text-sm"
          >
            <WhatsAppIcon className="size-4" />
            اطلب هذا القماش
          </WhatsAppLink>
          <TrackedLink
            href={href}
            event={EVENTS.fabricDetailsClick}
            properties={{ fabric: product.slug, placement: "card_button" }}
            className="btn btn-outline-dark min-h-11 px-3 text-sm"
            aria-label={`تفاصيل ${product.title}`}
          >
            التفاصيل
            <ArrowLeft className="size-4" aria-hidden="true" />
          </TrackedLink>
        </div>
      </div>
    </article>
  )
}
