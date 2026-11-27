"use client"

import Link from "next/link"
import { trackEvent } from "@/lib/analytics"

type Props = React.ComponentProps<typeof Link> & {
  event: string
  properties?: Record<string, string | number | boolean | null>
}

/** Internal or external link that records an analytics event on click. */
export function TrackedLink({ event, properties, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackEvent(event, properties)
        onClick?.(e)
      }}
    />
  )
}
