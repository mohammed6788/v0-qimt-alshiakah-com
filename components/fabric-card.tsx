import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { WhatsAppLink } from "@/components/whatsapp-link"
import { TrackedLink } from "@/components/tracked-link"
import { WhatsAppIcon } from "@/components/site/brand-icons"
import {
  AVAILABILITY_LABEL,
  AVAILABILITY_UNKNOWN,
  PRICE_LABEL,
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
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold",
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
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price
  return (
    <div>
      <p className={cn("font-extrabold text-navy", large ? "text-3xl" : "text-xl")}>
        {formatPrice(product.price, product.currency)}
        {hasDiscount && (
          <s className="ms-2 text-sm font-medium text-silver-dark">
            <span className="sr-only">السعر قبل الخصم: </span>
            {formatPrice(product.compareAtPrice!, product.currency)}
          </s>
        )}
      </p>
      <p className="text-xs text-muted-foreground">{PRICE_LABEL}</p>
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
        <Image
          src={product.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
        {product.tag && product.tag !== product.type && (
          <span className="absolute right-3 top-3 rounded-full bg-navy/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-sm">
            {product.tag}
          </span>
        )}
      </TrackedLink>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs">
          {product.origin && (
            <span className="rounded-full border border-navy/15 px-2.5 py-1 font-bold text-navy-soft">
              المنشأ: {product.origin}
            </span>
          )}
          <AvailabilityBadge product={product} />
        </div>
        <h3 className="text-xl font-extrabold text-navy">
          <TrackedLink
            href={href}
            event={EVENTS.fabricDetailsClick}
            properties={{ fabric: product.slug, placement: "card_title" }}
            className="hover:text-navy-soft"
          >
            {product.title}
          </TrackedLink>
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

        <div className="mt-4 border-t border-navy/10 pt-4">
          <PriceBlock product={product} />
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
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
