import { createClient } from "@supabase/supabase-js"

type Options = {
  maxAgeHours?: number
}

function parseArgs(argv: string[]): Options {
  const options: Options = {}
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--max-age-hours") {
      const value = argv[i + 1]
      i++
      if (!value) throw new Error("Missing value for --max-age-hours")
      const parsed = Number(value)
      if (!Number.isFinite(parsed) || parsed <= 0) throw new Error("Invalid --max-age-hours value")
      options.maxAgeHours = parsed
    } else if (arg === "--help" || arg === "-h") {
      console.log("Usage: tsx scripts/print-enrichment-staging-status.ts [--max-age-hours N]")
      process.exit(0)
    }
  }
  return options
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl) {
    throw new Error(
      "Missing Supabase URL. Expected NEXT_PUBLIC_SUPABASE_URL (preferred) or SUPABASE_URL."
    )
  }
  if (!serviceRoleKey) {
    throw new Error("Missing service role key. Expected SUPABASE_SERVICE_ROLE_KEY.")
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  // DB reality: early versions of enrichment_staging used only `created_at`.
  // Some environments may have added `updated_at` later. Prefer `updated_at` when present,
  // otherwise fall back to `created_at`.
  const freshnessColumn = await (async () => {
    const probe = await supabase
      .from("enrichment_staging")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (!probe.error) return "updated_at" as const
    if (probe.error.message.includes("does not exist")) return "created_at" as const
    throw new Error(`Failed to probe freshness column: ${probe.error.message}`)
  })()

  // Total rows (exact count)
  const totalRes = await supabase
    .from("enrichment_staging")
    .select("sku", { count: "exact", head: true })
  if (totalRes.error) {
    throw new Error(`Failed to count enrichment_staging: ${totalRes.error.message}`)
  }
  const total = totalRes.count ?? 0

  // Latest freshness timestamp
  const latestRes = await supabase
    .from("enrichment_staging")
    .select(freshnessColumn)
    .order(freshnessColumn, { ascending: false })
    .limit(1)
    .maybeSingle()
  if (latestRes.error) {
    throw new Error(`Failed to fetch latest ${freshnessColumn}: ${latestRes.error.message}`)
  }
  const latestFreshnessAt =
    (latestRes.data as { updated_at?: string; created_at?: string } | null | undefined)?.[
      freshnessColumn
    ] ?? null

  const now = Date.now()
  const since1d = new Date(now - 24 * 60 * 60 * 1000).toISOString()
  const since7d = new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString()

  const last1dRes = await supabase
    .from("enrichment_staging")
    .select("sku", { count: "exact", head: true })
    .gte(freshnessColumn, since1d)
  if (last1dRes.error) throw new Error(`Failed to count last 24h: ${last1dRes.error.message}`)

  const last7dRes = await supabase
    .from("enrichment_staging")
    .select("sku", { count: "exact", head: true })
    .gte(freshnessColumn, since7d)
  if (last7dRes.error) throw new Error(`Failed to count last 7d: ${last7dRes.error.message}`)

  console.log("[enrichment_staging] status")
  console.log(`- total_rows: ${total}`)
  console.log(`- freshness_column: ${freshnessColumn}`)
  console.log(`- latest_freshness_at: ${latestFreshnessAt ?? "null"}`)
  console.log(`- updated_last_24h: ${last1dRes.count ?? 0}`)
  console.log(`- updated_last_7d: ${last7dRes.count ?? 0}`)

  // Field coverage (helps diagnose “everything except retail_price” scenarios)
  const coverageFields = [
    "retail_price",
    "item_name",
    "brand",
    "image_url",
    "product_link",
  ] as const
  for (const field of coverageFields) {
    const res = await supabase
      .from("enrichment_staging")
      .select("sku", { count: "exact", head: true })
      .not(field, "is", null)
    if (res.error) throw new Error(`Failed to count ${field} coverage: ${res.error.message}`)
    const count = res.count ?? 0
    const pct = total > 0 ? Math.round((count / total) * 100) : 0
    console.log(`- with_${field}: ${count} (${pct}%)`)
  }

  if (options.maxAgeHours != null) {
    if (!latestFreshnessAt) {
      console.error(
        `ERROR: latest_freshness_at is null; expected recent data (max age ${options.maxAgeHours}h)`
      )
      process.exit(2)
    }
    const ageMs = Date.now() - new Date(latestFreshnessAt).getTime()
    const maxAgeMs = options.maxAgeHours * 60 * 60 * 1000
    const ageHours = ageMs / (60 * 60 * 1000)
    if (!Number.isFinite(ageMs) || ageMs < 0) {
      console.error(`ERROR: Could not compute age from latest_freshness_at: ${latestFreshnessAt}`)
      process.exit(2)
    }
    if (ageMs > maxAgeMs) {
      console.error(
        `ERROR: Data is stale: ${ageHours.toFixed(1)}h old (max ${options.maxAgeHours}h)`
      )
      process.exit(2)
    }
    console.log(
      `OK: Freshness check passed (age ${ageHours.toFixed(1)}h <= ${options.maxAgeHours}h)`
    )
  }

  // Optional: sanity-check required env vars for local warmer
  // (We don't print values; this is just a helpful heads-up.)
  try {
    getRequiredEnv("PENNY_RAW_COOKIE")
    getRequiredEnv("PENNY_GUILD_ID")
    console.log("OK: Warm-up auth env vars present (PENNY_RAW_COOKIE, PENNY_GUILD_ID)")
  } catch {
    console.log("INFO: Warm-up auth env vars missing (PENNY_RAW_COOKIE and/or PENNY_GUILD_ID)")
    console.log("   Add them to `.env.local` (do not commit).")
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
