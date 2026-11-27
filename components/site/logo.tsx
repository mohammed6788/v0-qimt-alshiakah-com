import Image from "next/image"
import Link from "next/link"
import { BRAND, LOGOS } from "@/lib/constants"
import { cn } from "@/lib/utils"

type Props = { size?: number; withText?: boolean; className?: string; priority?: boolean }

/** Official logo — rendered as supplied (no recoloring or redraw). */
export function Logo({ size = 44, withText = true, className, priority }: Props) {
  return (
    <Link href="/" className={cn("flex items-center gap-3", className)} aria-label={`${BRAND.name} – الصفحة الرئيسية`}>
      <Image
        src={size > 96 ? LOGOS.default : LOGOS.small}
        alt={`شعار ${BRAND.name}`}
        width={size}
        height={size}
        priority={priority}
        className="rounded-xl ring-1 ring-white/10"
      />
      {withText && (
        <span className="flex flex-col leading-snug">
          <span className="text-lg font-bold text-white">{BRAND.name}</span>
          <span className="text-xs font-normal text-silver">للخياطة الرجالية</span>
        </span>
      )}
    </Link>
  )
}
