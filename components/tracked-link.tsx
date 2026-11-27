"use client"

import Link from "next/link"
import { gaEvent, trackEvent, type GaEventName } from "@/lib/analytics"

type Props = React.ComponentProps<typeof Link> & {
  event: string
  properties?: Record<string, string | number | boolean | null>
  /** Optional GA4 event sent on click with the same properties. */
  ga?: GaEventName
}

/** Internal or external link that records an analytics event on click. */
export function TrackedLink({ event, properties, ga, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        trackEvent(event, properties)
        if (ga) gaEvent(ga, properties)
        onClick?.(e)
      }}
    />
  )
}
