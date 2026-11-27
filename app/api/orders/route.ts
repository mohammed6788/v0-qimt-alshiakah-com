import { NextResponse, type NextRequest } from "next/server"
import { allowRequest, nextOrderNumber, orderStoreConfigured } from "@/lib/order-store"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const KINDS = new Set(["design", "reorder"])

/** Issues the next sequential order number (QS-0001, QS-0002, …). */
export async function POST(req: NextRequest) {
  // Only accept requests from this site's own pages.
  const origin = req.headers.get("origin")
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host")
  if (!origin || !host || new URL(origin).host !== host) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 })
  }

  let kind = ""
  try {
    const body = (await req.json()) as { kind?: unknown }
    kind = typeof body.kind === "string" ? body.kind : ""
  } catch {
    /* invalid body */
  }
  if (!KINDS.has(kind)) return NextResponse.json({ error: "invalid_kind" }, { status: 400 })

  if (!orderStoreConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 })
  }

  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown"
    if (!(await allowRequest(ip))) return NextResponse.json({ error: "rate_limited" }, { status: 429 })
    const orderNumber = await nextOrderNumber(kind)
    return NextResponse.json({ orderNumber }, { headers: { "Cache-Control": "no-store" } })
  } catch (e) {
    console.error("[orders] failed to issue order number", e)
    return NextResponse.json({ error: "unavailable" }, { status: 503 })
  }
}
