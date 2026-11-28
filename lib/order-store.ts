// Server-only: sequential order numbers (QS-0001, QS-0002, …) stored in
// Redis through the Upstash REST API (Vercel Marketplace → Upstash Redis).
// No personal data is stored — only the number, the order type and the time.

const SEQ_KEY = "qs:order_seq"

function credentials() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  return url && token ? { url: url.replace(/\/$/, ""), token } : null
}

export function orderStoreConfigured() {
  return credentials() !== null
}

async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const c = credentials()
  if (!c) throw new Error("order store not configured")
  const res = await fetch(`${c.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands.map((cmd) => cmd.map(String))),
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  if (!res.ok) throw new Error(`order store HTTP ${res.status}`)
  const data = (await res.json()) as { result?: unknown; error?: string }[]
  const err = data.find((d) => d.error)
  if (err) throw new Error(`order store error: ${err.error}`)
  return data.map((d) => d.result)
}

export function formatOrderNumber(n: number) {
  return `QS-${String(n).padStart(4, "0")}`
}

/** Per-client rate limit (fixed window). Returns true when allowed. */
export async function allowRequest(clientKey: string, limit = 15, windowSeconds = 3600) {
  const key = `qs:rl:${clientKey}`
  const [count] = await pipeline([
    ["INCR", key],
    ["EXPIRE", key, windowSeconds, "NX"],
  ])
  return Number(count) <= limit
}

export async function nextOrderNumber(kind: string) {
  const [n] = await pipeline([["INCR", SEQ_KEY]])
  const seq = Number(n)
  if (!Number.isInteger(seq) || seq < 1) throw new Error("invalid sequence value")
  const number = formatOrderNumber(seq)
  // INCR is atomic in Redis: concurrent requests can never receive the same number.
  // The metadata below is informational; if it fails, the reserved number is still
  // returned (otherwise it would be lost and the customer would get no number).
  try {
    await pipeline([["HSET", `qs:order:${number}`, "kind", kind, "created_at", new Date().toISOString()]])
  } catch (e) {
    console.error("[orders] could not store order metadata", number, e)
  }
  return number
}
