"use client"

import { useEffect } from "react"
import { gaEvent, trackEvent, type GaEventName } from "@/lib/analytics"

type Props = {
  event: string
  properties?: Record<string, string | number | boolean | null>
  /** Optional GA4 event sent once with the same properties. */
  ga?: GaEventName
}

/** Fires a single analytics event when the page/section mounts. */
export function TrackView({ event, properties, ga }: Props) {
  useEffect(() => {
    trackEvent(event, properties)
    if (ga) gaEvent(ga, properties)
    // Re-fires when moving between pages that share this component (e.g. fabric → fabric).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, JSON.stringify(properties)])
  return null
}
