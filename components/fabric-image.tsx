import Image from "next/image"
import { Layers } from "lucide-react"
import type { Product } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Props = { product: Product; sizes: string; priority?: boolean; className?: string; alt?: string; compact?: boolean }

/** Fabric photo, or a branded placeholder until the shop supplies one (the fabric is still orderable). */
export function FabricImage({ product, sizes, priority, className, alt = "", compact }: Props) {
  if (product.image) {
    return <Image src={product.image} alt={alt} fill priority={priority} sizes={sizes} className={cn("object-cover", className)} />
  }
  return (
    <span
      className="absolute inset-0 flex items-center justify-center bg-navy [background-image:repeating-linear-gradient(135deg,rgba(195,201,211,0.10)_0_1px,transparent_1px_10px)]"
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
    >
      {/* Only the photo is pending — the fabric itself is available to order. */}
      {compact ? (
        <Layers className="size-6 text-silver" aria-hidden="true" />
      ) : (
        <span className="text-center text-sm font-medium text-silver">صورة القماش قريباً</span>
      )}
    </span>
  )
}
