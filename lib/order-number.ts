// Client helper: asks the server for the next sequential order number.
// Returns null when numbering is unavailable — the order is still sent,
// and the team assigns the number manually (no number is ever invented).
export async function requestOrderNumber(kind: "design" | "reorder"): Promise<string | null> {
  try {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind }),
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) return null
    const data = (await res.json()) as { orderNumber?: unknown }
    return typeof data.orderNumber === "string" && /^QS-\d{4,}$/.test(data.orderNumber) ? data.orderNumber : null
  } catch {
    return null
  }
}

/**
 * Opens WhatsApp in a way that survives the async number request:
 * a window is opened synchronously inside the click (so popup blockers and
 * iOS allow it), then pointed at the final wa.me link.
 */
export function openPendingWindow(): Window | null {
  try {
    return window.open("", "_blank")
  } catch {
    return null
  }
}

export function navigateTo(win: Window | null, url: string) {
  if (win) {
    // The customer closed the new tab themselves: keep them on the page.
    if (win.closed) return
    try {
      win.opener = null
      win.location.href = url
      return
    } catch {
      /* fall through */
    }
  }
  // Popups blocked: open WhatsApp in the current tab.
  window.location.href = url
}
