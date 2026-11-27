"use client"

import { useEffect } from "react"
import { trackEvent } from "@/lib/analytics"

type Props = { event: string; properties?: Record<string, string | number | boolean | null> }

/** Fires a single analytics event when the page/section mounts. */
export function TrackView({ event, properties }: Props) {
  useEffect(() => {
    trackEvent(event, properties)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event])
  return null
}
