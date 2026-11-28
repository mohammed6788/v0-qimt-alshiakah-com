"use client"

import { useCallback, useRef, useState } from "react"
import { openPendingWindow, requestOrderNumber } from "@/lib/order-number"

/**
 * One order the customer is sending through WhatsApp.
 * - `id` is random and unique per order (never derived from the order's content,
 *   never sent to analytics): it is what stops double counting.
 * - `fingerprint` is the order content when it was started: if the customer edits
 *   anything afterwards, that is a different order (new id, new order number).
 */
type Attempt = {
  id: string
  fingerprint: string
  number: string | null
  numberRequested: boolean
  counted: boolean
}

export type SendOutcome = "opened" | "cancelled" | "busy"

function newId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
  }
}

type SendArgs = {
  kind: "design" | "reorder"
  /** Builds the final wa.me URL once the order number is known (or unavailable). */
  buildUrl: (orderNumber: string | null) => string
  /** Called exactly once per order, only when WhatsApp was actually opened. */
  onFirstOpen: (orderId: string, orderNumber: string | null) => void
}

/**
 * Sending an order to WhatsApp, with:
 * - double taps → one order, one count, one number;
 * - edits after sending → a new order (new id and number, so numbers never repeat);
 * - `startNewOrder()` → a separate order with the same details, counted on its own;
 * - a closed/blocked WhatsApp tab → nothing counted; retrying keeps the same number.
 */
export function useOrderSubmission(fingerprint: string) {
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [sending, setSending] = useState(false)
  const [lastOutcome, setLastOutcome] = useState<{ outcome: SendOutcome; fingerprint: string } | null>(null)
  const busy = useRef(false)

  // An attempt only belongs to the order content it was started for.
  const current = attempt && attempt.fingerprint === fingerprint ? attempt : null

  const send = useCallback(
    async ({ kind, buildUrl, onFirstOpen }: SendArgs): Promise<SendOutcome> => {
      if (busy.current) return "busy"
      busy.current = true
      const win = openPendingWindow()
      setSending(true)
      let a: Attempt = current ?? { id: newId(), fingerprint, number: null, numberRequested: false, counted: false }
      try {
        // Ask for a number once per order; if the service failed and nothing was sent yet,
        // a retry asks again (the number must match the message the customer sends).
        if (!a.numberRequested || (a.number === null && !a.counted)) {
          a = { ...a, number: await requestOrderNumber(kind), numberRequested: true }
        }
        const url = buildUrl(a.number)
        let outcome: SendOutcome
        if (win && !win.closed) {
          try {
            win.opener = null
            win.location.href = url
            outcome = "opened"
          } catch {
            outcome = "cancelled"
          }
        } else if (win && win.closed) {
          // The customer closed the new tab before WhatsApp loaded.
          outcome = "cancelled"
        } else {
          // Popups blocked: continue in this tab. Count first — this page is about to unload.
          if (!a.counted) {
            onFirstOpen(a.id, a.number)
            a = { ...a, counted: true }
          }
          setAttempt(a)
          window.location.href = url
          return "opened"
        }
        if (outcome === "opened" && !a.counted) {
          onFirstOpen(a.id, a.number)
          a = { ...a, counted: true }
        }
        setAttempt(a)
        setLastOutcome({ outcome, fingerprint })
        return outcome
      } finally {
        busy.current = false
        setSending(false)
      }
    },
    [current, fingerprint],
  )

  /** Starts a separate order with the same details (its own id and order number). */
  const startNewOrder = useCallback(() => {
    setAttempt(null)
    setLastOutcome(null)
  }, [])

  return {
    sending,
    /** WhatsApp was opened for the current order content. */
    sent: !!current?.counted,
    /** The last tap did not open WhatsApp (tab closed): nothing was counted. */
    cancelled: lastOutcome?.outcome === "cancelled" && lastOutcome.fingerprint === fingerprint && !current?.counted,
    orderNumber: current?.number ?? null,
    send,
    startNewOrder,
  }
}
