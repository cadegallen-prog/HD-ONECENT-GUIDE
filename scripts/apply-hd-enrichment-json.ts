#!/usr/bin/env tsx
/**
 * Apply a HomeDepot.com scrape JSON to Penny List enrichment fields (Option A).
 *
 * - Updates only enrichment fields on "Penny List" rows matching the SKU.
 * - Does NOT touch user report fields (store, date, qty, notes, etc).
 * - Skips overwriting with empty strings; skips retail_price when input price is blank/unparseable.
 *
 * Usage:
 *   tsx scripts/apply-hd-enrichment-json.ts --file path/to/hd.json            # dry-run (default)
 *   tsx scripts/apply-hd-enrichment-json.ts --file path/to/hd.json --apply   # apply changes
 *   cat hd.json | tsx scripts/apply-hd-enrichment-json.ts --stdin --apply
 */

import { readFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"

type HdItem = {
  sku?: string
  internetNumber?: string | number
  pageUrl?: string
  name?: string
  brand?: string
  price?: string
  model?: string
  upc?: string
  imageUrl?: string
}

type HdJson = Record<string, HdItem>

function tryLoadDotenv() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require("dotenv")
    dotenv.config({ path: ".env.local" })
  } catch {
    // optional; many environments preload env vars already
  }
}

function parseArgs(argv: string[]) {
  const args: {
    file?: string
    stdin?: boolean
    apply?: boolean
    help?: boolean
  } = {}

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--help" || a === "-h") args.help = true
    else if (a === "--file") args.file = argv[i + 1]
    else if (a === "--stdin") args.stdin = true
    else if (a === "--apply") args.apply = true
  }

  return args
}

function usageAndExit(code: number): never {
  console.log("Apply HomeDepot.com enrichment JSON (Option A)")
  console.log("")
  console.log("Usage:")
  console.log("  tsx scripts/apply-hd-enrichment-json.ts --file hd.json")
  console.log("  tsx scripts/apply-hd-enrichment-json.ts --file hd.json --apply")
  console.log("  cat hd.json | tsx scripts/apply-hd-enrichment-json.ts --stdin --apply")
  process.exit(code)
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

function cleanString(v: unknown): string | null {
  if (v == null) return null
  const s = String(v).trim()
  return s.length > 0 ? s : null
}

function parseUsdPrice(v: unknown): number | null {
  const s = cleanString(v)
  if (!s) return null
  const cleaned = s.replace(/\$/g, "").replace(/,/g, "").trim()
  const n = Number.parseFloat(cleaned)
  if (!Number.isFinite(n) || n <= 0) return null
  return n
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = ""
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (chunk) => (data += chunk))
    process.stdin.on("end", () => resolve(data))
    process.stdin.on("error", reject)
  })
}

function buildPatch(entryKey: string, item: HdItem) {
  const sku = cleanString(item.sku ?? entryKey)
  if (!sku) return null

  const patch: Record<string, unknown> = {}

  const itemName = cleanString(item.name)
  if (itemName) patch.item_name = itemName

  const brand = cleanString(item.brand)
  if (brand) patch.brand = brand

  const modelNumber = cleanString(item.model)
  if (modelNumber) patch.model_number = modelNumber

  const upc = cleanString(item.upc)
  if (upc) patch.upc = upc

  const imageUrl = cleanString(item.imageUrl)
  if (imageUrl) patch.image_url = imageUrl

  const pageUrl = cleanString(item.pageUrl)
  if (pageUrl) patch.home_depot_url = pageUrl

  const internetSkuRaw = cleanString(item.internetNumber)
  if (internetSkuRaw) {
    const n = Number.parseInt(internetSkuRaw, 10)
    if (Number.isFinite(n) && n > 0) patch.internet_sku = n
  }

  const retail = parseUsdPrice(item.price)
  if (retail != null) patch.retail_price = retail

  const keys = Object.keys(patch)
  if (keys.length === 0) return null

  return { sku, patch }
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) usageAndExit(0)
  if (!args.file && !args.stdin) usageAndExit(2)

  tryLoadDotenv()

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    process.env.VITE_SUPABASE_URL
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SECRET_KEY ??
    process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl) throw new Error("Missing Supabase URL (NEXT_PUBLIC_SUPABASE_URL preferred).")
  if (!serviceRoleKey) throw new Error("Missing service role key (SUPABASE_SERVICE_ROLE_KEY).")

  const inputText = args.stdin ? await readStdin() : readFileSync(args.file!, "utf8")
  const parsed = JSON.parse(inputText) as HdJson

  const updates: { sku: string; patch: Record<string, unknown> }[] = []
  for (const [k, v] of Object.entries(parsed)) {
    const built = buildPatch(k, v)
    if (built) updates.push(built)
  }

  if (updates.length === 0) {
    console.log("No updates parsed from input JSON.")
    return
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  console.log(`Loaded ${updates.length} SKUs from scrape JSON`)
  console.log(`Mode: ${args.apply ? "APPLY" : "DRY-RUN"}`)
  console.log("")

  let totalMatchedRows = 0
  let totalUpdatedRows = 0
  const missingInPennyList: string[] = []
  const errors: { sku: string; error: string }[] = []

  for (const u of updates) {
    const countRes = await supabase
      .from("Penny List")
      .select("id", { count: "exact", head: true })
      .eq("home_depot_sku_6_or_10_digits", u.sku)

    if (countRes.error) {
      errors.push({ sku: u.sku, error: countRes.error.message })
      continue
    }

    const matched = countRes.count ?? 0
    if (matched === 0) {
      missingInPennyList.push(u.sku)
      continue
    }

    totalMatchedRows += matched

    if (!args.apply) {
      console.log(
        `[dry-run] sku=${u.sku} matches=${matched} fields=${Object.keys(u.patch).join(",")}`
      )
      continue
    }

    const updateRes = await supabase
      .from("Penny List")
      .update(u.patch)
      .eq("home_depot_sku_6_or_10_digits", u.sku)
      .select("id")

    if (updateRes.error) {
      errors.push({ sku: u.sku, error: updateRes.error.message })
      continue
    }

    const updated = (updateRes.data ?? []).length
    totalUpdatedRows += updated
    console.log(`[apply] sku=${u.sku} updated_rows=${updated}`)
  }

  console.log("")
  console.log("Summary")
  console.log(`- input_skus: ${updates.length}`)
  console.log(`- penny_list_rows_matched: ${totalMatchedRows}`)
  if (args.apply) console.log(`- penny_list_rows_updated: ${totalUpdatedRows}`)
  console.log(`- missing_in_penny_list: ${missingInPennyList.length}`)
  console.log(`- errors: ${errors.length}`)

  if (missingInPennyList.length > 0) {
    console.log("")
    console.log("Missing in Penny List (first 20):")
    for (const sku of missingInPennyList.slice(0, 20)) console.log(`- ${sku}`)
  }

  if (errors.length > 0) {
    console.log("")
    console.log("Errors:")
    for (const e of errors) console.log(`- sku=${e.sku}: ${e.error}`)
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : String(err))
  process.exit(1)
})
