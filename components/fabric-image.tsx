import Image from "next/image"
import type { Product } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Props = { product: Product; sizes: string; priority?: boolean; className?: string; alt?: string; compact?: boolean }

/** Fabric photo, or a branded placeholder until the shop supplies one. */
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
      <span className={cn("text-center font-medium text-silver", compact ? "text-[10px] leading-tight" : "text-sm")}>
        {compact ? "قريباً" : "الصورة قريباً"}
      </span>
    </span>
  )
}
