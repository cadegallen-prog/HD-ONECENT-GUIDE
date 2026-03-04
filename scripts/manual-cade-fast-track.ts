#!/usr/bin/env tsx
/**
 * Cade Fast-Track Submit: Auto-create Penny List entries from pre-scraped items.
 *
 * Bypasses manual form submission. Upserts Item Cache, creates Penny List entry with
 * Georgia state, applies enrichment, and publishes immediately.
 *
 * Canonical use:
 *   /manual:cade
 *   { ...scraped json... }
 *
 * CLI usage:
 *   echo '{ "sku":"1009258128","name":"Widget" }' | npm run manual:cade-fast-track
 *   npm run manual:cade-fast-track -- -- --json '{"sku":"1009258128","name":"Widget"}'
 *   npm run manual:cade-fast-track -- -- --input ./.local/scraped.json
 */

import { mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { validateSku } from "../lib/sku"

type Args = {
  json: string | null
  inputPath: string | null
  dryRun: boolean
}

type PickResult = {
  defined: boolean
  value: unknown
}

type ManualNormalizedRow = {
  sku: string
  internet_number?: number | null
  barcode_upc?: string | null
  item_name?: string | null
  brand?: string | null
  model_number?: string | null
  retail_price?: number | null
  image_url?: string | null
  product_link?: string | null
}

type StagingUpsertRow = {
  sku: string
  internet_number?: number | null
  barcode_upc?: string | null
  item_name?: string | null
  brand?: string | null
  retail_price?: number | null
  image_url?: string | null
  product_link?: string | null
}

type CadeSubmitSummary = {
  received_items: number
  valid_items: number
  invalid_items: number
  duplicate_skus_collapsed: number
  dry_run: boolean
  cache_upserted: number
  penny_list_created: number
  penny_rows_enriched_by_cache: number
  penny_rows_cache_apply_skipped: number
  penny_rows_failed: number
  invalid_details: Array<{ sku: string; reason: string }>
  report_path?: string
  preview_rows?: ManualNormalizedRow[]
}

let cacheApplyRpcUnavailable = false

function tryLoadDotenv() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require("dotenv")
    dotenv.config({ path: ".env.local" })
  } catch {
    // Optional. Env may already be present.
  }
}

function parseArgs(argv: string[]): Args {
  const args: Args = { json: null, inputPath: null, dryRun: false }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--json" && argv[i + 1]) {
      args.json = argv[++i]
      continue
    }
    if (arg === "--input" && argv[i + 1]) {
      args.inputPath = argv[++i]
      continue
    }
    if (arg === "--dry-run") {
      args.dryRun = true
      continue
    }
    if (arg === "--help" || arg === "-h") {
      console.log("Cade Fast-Track Auto-Submit")
      console.log("")
      console.log("Usage:")
      console.log("  echo '{ ...json... }' | npm run manual:cade-fast-track")
      console.log("  npm run manual:cade-fast-track -- -- --json '{ ...json... }'")
      console.log("  npm run manual:cade-fast-track -- -- --input ./items.json")
      console.log("")
      console.log("Dry-run mode (validation only):")
      console.log("  npm run manual:cade-fast-track -- -- --dry-run < ./items.json")
      process.exit(0)
    }
  }

  return args
}

async function readPayload(args: Args): Promise<string> {
  if (args.json) return args.json
  if (args.inputPath) return await readFile(args.inputPath, "utf8")

  // Read from stdin
  return await new Promise((resolve) => {
    let stdin = ""
    process.stdin.on("data", (chunk) => {
      stdin += chunk
    })
    process.stdin.on("end", () => {
      resolve(stdin)
    })
  })
}

function pickFirstDefined(obj: Record<string, unknown>, keys: string[]): PickResult {
  for (const key of keys) {
    if (key in obj) {
      const value = obj[key]
      if (value !== undefined && value !== null) return { defined: true, value }
    }
  }
  return { defined: false, value: undefined }
}

function toNullableText(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) return value.trim()
  return null
}

function toNullablePositiveInt(value: unknown): number | null {
  const n = Number(value)
  return Number.isSafeInteger(n) && n > 0 ? n : null
}

function toNullablePrice(value: unknown): number | null {
  if (typeof value === "string" && value.startsWith("$")) {
    const n = parseFloat(value.replace("$", ""))
    return Number.isFinite(n) && n > 0 ? n : null
  }
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

function normalizeOne(raw: unknown):
  | {
      ok: false
      reason: string
      rawSku: string | null
    }
  | { ok: true; row: ManualNormalizedRow } {
  if (typeof raw !== "object" || raw === null) {
    return {
      ok: false,
      reason: "Not an object",
      rawSku: null,
    }
  }

  const skuPick = pickFirstDefined(raw as Record<string, unknown>, [
    "sku",
    "store_sku",
    "storeSku",
    "home_depot_sku_6_or_10_digits",
  ])

  if (!skuPick.defined) {
    return {
      ok: false,
      reason: "Missing SKU",
      rawSku: null,
    }
  }

  const skuRaw = String(skuPick.value).trim()
  const skuVal = validateSku(skuRaw)

  if (skuVal.error) {
    return {
      ok: false,
      reason: `Invalid SKU format: ${skuVal.error}`,
      rawSku: skuRaw,
    }
  }

  const row: ManualNormalizedRow = { sku: skuVal.normalized }

  const namePick = pickFirstDefined(raw as Record<string, unknown>, [
    "item_name",
    "itemName",
    "name",
    "title",
  ])
  if (namePick.defined) row.item_name = toNullableText(namePick.value)

  const brandPick = pickFirstDefined(raw as Record<string, unknown>, [
    "brand",
    "brand_name",
    "brandName",
  ])
  if (brandPick.defined) row.brand = toNullableText(brandPick.value)

  const modelPick = pickFirstDefined(raw as Record<string, unknown>, [
    "model",
    "model_number",
    "modelNumber",
  ])
  if (modelPick.defined) row.model_number = toNullableText(modelPick.value)

  const barcodePick = pickFirstDefined(raw as Record<string, unknown>, [
    "barcode_upc",
    "upc",
    "barcode",
    "gtin",
  ])
  if (barcodePick.defined) row.barcode_upc = toNullableText(barcodePick.value)

  const internetPick = pickFirstDefined(raw as Record<string, unknown>, [
    "internet_number",
    "internetNumber",
    "internet_sku",
    "internetSku",
  ])
  if (internetPick.defined) row.internet_number = toNullablePositiveInt(internetPick.value)

  const imagePick = pickFirstDefined(raw as Record<string, unknown>, [
    "image_url",
    "imageUrl",
    "image",
    "image_link",
  ])
  if (imagePick.defined) row.image_url = toNullableText(imagePick.value)

  const productLinkPick = pickFirstDefined(raw as Record<string, unknown>, [
    "product_link",
    "productLink",
    "product_url",
    "productUrl",
    "pageUrl",
    "home_depot_url",
    "homeDepotUrl",
    "url",
  ])
  if (productLinkPick.defined) row.product_link = toNullableText(productLinkPick.value)

  const retailPricePick = pickFirstDefined(raw as Record<string, unknown>, [
    "retail_price",
    "retailPrice",
    "price",
  ])
  if (retailPricePick.defined) row.retail_price = toNullablePrice(retailPricePick.value)

  return { ok: true, row }
}

function mergeRowsBySku(rows: ManualNormalizedRow[]): {
  merged: ManualNormalizedRow[]
  duplicates: number
} {
  const bySku = new Map<string, ManualNormalizedRow>()
  let duplicates = 0

  for (const row of rows) {
    const existing = bySku.get(row.sku)
    if (!existing) {
      bySku.set(row.sku, row)
      continue
    }

    duplicates += 1
    bySku.set(row.sku, {
      ...existing,
      ...row,
    })
  }

  return { merged: [...bySku.values()], duplicates }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value || !value.trim()) throw new Error(`Missing required env var: ${name}`)
  return value
}

function toStagingUpsertRow(row: ManualNormalizedRow): StagingUpsertRow {
  const staging: StagingUpsertRow = { sku: row.sku }

  if ("item_name" in row) staging.item_name = row.item_name ?? null
  if ("brand" in row) staging.brand = row.brand ?? null
  if ("barcode_upc" in row) staging.barcode_upc = row.barcode_upc ?? null
  if ("internet_number" in row) staging.internet_number = row.internet_number ?? null
  if ("image_url" in row) staging.image_url = row.image_url ?? null
  if ("product_link" in row) staging.product_link = row.product_link ?? null
  if ("retail_price" in row) staging.retail_price = row.retail_price ?? null

  return staging
}

function buildStagingUpdatePatch(row: StagingUpsertRow): Record<string, unknown> {
  const patch: Record<string, unknown> = {}

  if ("item_name" in row) patch.item_name = row.item_name ?? null
  if ("brand" in row) patch.brand = row.brand ?? null
  if ("barcode_upc" in row) patch.barcode_upc = row.barcode_upc ?? null
  if ("internet_number" in row) patch.internet_number = row.internet_number ?? null
  if ("image_url" in row) patch.image_url = row.image_url ?? null
  if ("product_link" in row) patch.product_link = row.product_link ?? null
  if ("retail_price" in row) patch.retail_price = row.retail_price ?? null

  return patch
}

function isInternetNumberUniqueConflict(
  error: { message?: string; details?: string } | null
): boolean {
  const message = String(error?.message || "")
  const details = String(error?.details || "")

  return (
    message.includes("idx_staging_internet_number") ||
    details.includes("idx_staging_internet_number") ||
    (message.includes("duplicate key") && details.includes("internet_number"))
  )
}

function buildCadeSubmitPatch(row: ManualNormalizedRow): Record<string, unknown> {
  const patch: Record<string, unknown> = {}

  if ("item_name" in row) patch.item_name = row.item_name ?? null
  if ("brand" in row) patch.brand = row.brand ?? null
  if ("model_number" in row) patch.model_number = row.model_number ?? null
  if ("barcode_upc" in row) patch.upc = row.barcode_upc ?? null
  if ("internet_number" in row) patch.internet_sku = row.internet_number ?? null
  if ("image_url" in row) patch.image_url = row.image_url ?? null
  if ("product_link" in row) patch.home_depot_url = row.product_link ?? null
  if ("retail_price" in row) patch.retail_price = row.retail_price ?? null

  return patch
}

async function createCadeSubmitPennyRow(
  supabase: ReturnType<typeof createClient>,
  row: ManualNormalizedRow,
  atIso: string
): Promise<{ id: string } | null> {
  const patch = buildCadeSubmitPatch(row)
  const insertPayload: Record<string, unknown> = {
    home_depot_sku_6_or_10_digits: row.sku,
    item_name:
      (typeof patch.item_name === "string" && patch.item_name.trim().length > 0
        ? patch.item_name
        : null) ?? `Item SKU ${row.sku}`,
    store_city_state: "Georgia", // Cade's location
    purchase_date: atIso.slice(0, 10),
    exact_quantity_found: 0, // Placeholder; quantity doesn't matter for Cade
    notes_optional: "Auto-submitted via Cade fast-track",
    timestamp: atIso,
    status: "complete", // Published immediately
    ...patch,
  }

  const { data, error } = await supabase
    .from("Penny List")
    .insert(insertPayload)
    .select("id")
    .single()

  if (error) {
    console.error(`Failed to create Penny List entry for ${row.sku}: ${error.message}`)
    return null
  }

  return data as { id: string } | null
}

type PennyRowForApply = {
  id: string
  internet_sku: number | null
}

async function fetchCreatedPennyRow(
  supabase: ReturnType<typeof createClient>,
  sku: string
): Promise<PennyRowForApply | null> {
  const { data, error } = await supabase
    .from("Penny List")
    .select("id,internet_sku")
    .eq("home_depot_sku_6_or_10_digits", sku)
    .order("timestamp", { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error(`Failed to fetch created Penny List row for ${sku}: ${error.message}`)
    return null
  }

  return data as PennyRowForApply | null
}

async function applyItemCacheToPennyRow(
  supabase: ReturnType<typeof createClient>,
  pennyRow: PennyRowForApply,
  sku: string
): Promise<boolean> {
  if (cacheApplyRpcUnavailable) return false

  const { data: rpcData, error: rpcError } = await supabase.rpc(
    "apply_item_cache_enrichment_for_penny_item",
    {
      p_penny_id: pennyRow.id,
      p_sku: sku,
      p_internet_number: pennyRow.internet_sku,
    }
  )

  if (rpcError) {
    const code = String((rpcError as { code?: string } | null)?.code || "")
    const message = String((rpcError as { message?: string } | null)?.message || "")
    const missingApplyRpc =
      code === "PGRST202" || message.includes("apply_item_cache_enrichment_for_penny_item")

    if (missingApplyRpc) {
      cacheApplyRpcUnavailable = true
      return false
    }

    console.error(`Failed to apply enrichment for ${sku}: ${rpcError.message}`)
    return false
  }

  const result = rpcData as { enriched?: boolean } | null
  return result?.enriched ?? false
}

async function main() {
  try {
    tryLoadDotenv()

    const args = parseArgs(process.argv.slice(2))
    const payload = await readPayload(args)

    if (!payload || !payload.trim()) {
      throw new Error("No JSON payload found. Provide stdin, --json, or --input.")
    }

    let rawItems: unknown[]
    try {
      const parsed = JSON.parse(payload)
      rawItems = Array.isArray(parsed)
        ? parsed
        : typeof parsed === "object" && parsed !== null
          ? Object.values(parsed as Record<string, unknown>)
          : []
    } catch (e) {
      throw new Error(`Failed to parse JSON: ${e instanceof Error ? e.message : String(e)}`)
    }

    const normalizedRows: ManualNormalizedRow[] = []
    const errors: Array<{ sku: string; reason: string }> = []

    for (const raw of rawItems) {
      const normalized = normalizeOne(raw)
      if (!normalized.ok) {
        errors.push({ sku: normalized.rawSku, reason: normalized.reason })
        continue
      }
      normalizedRows.push(normalized.row)
    }

    const deduped = mergeRowsBySku(normalizedRows)

    if (deduped.merged.length === 0) {
      throw new Error("All payload items were invalid; nothing to process.")
    }

    const summary: Record<string, unknown> = {
      received_items: rawItems.length,
      valid_items: normalizedRows.length,
      invalid_items: errors.length,
      duplicate_skus_collapsed: deduped.duplicates,
      dry_run: args.dryRun,
      cache_upserted: 0,
      penny_list_created: 0,
      penny_rows_enriched_by_cache: 0,
      penny_rows_cache_apply_skipped: 0,
      penny_rows_failed: 0,
      invalid_details: errors,
    }

    if (args.dryRun) {
      summary.preview_rows = deduped.merged
      console.log(JSON.stringify(summary, null, 2))
      return
    }

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

    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    const stagingRows = deduped.merged.map(toStagingUpsertRow)

    let upserted = 0
    for (const stagingRow of stagingRows) {
      const { error } = await supabase.from("enrichment_staging").upsert(stagingRow, {
        onConflict: "sku",
      })

      if (error) {
        const internetConflict =
          stagingRow.internet_number != null &&
          isInternetNumberUniqueConflict(error as { message?: string; details?: string } | null)

        if (!internetConflict || stagingRow.internet_number == null) {
          throw new Error(`Item Cache upsert failed: ${error.message}`)
        }

        const fallbackPatch = buildStagingUpdatePatch(stagingRow)
        const { error: fallbackError } = await supabase
          .from("enrichment_staging")
          .update(fallbackPatch)
          .eq("internet_number", stagingRow.internet_number)

        if (fallbackError) {
          throw new Error(
            `Item Cache internet_number fallback update failed: ${fallbackError.message}`
          )
        }
      }

      upserted += 1
    }
    summary.cache_upserted = upserted

    const nowIso = new Date().toISOString()

    for (const row of deduped.merged) {
      // Create new Penny List entry for this scraped item
      const created = await createCadeSubmitPennyRow(supabase, row, nowIso)
      if (!created) {
        summary.penny_rows_failed = Number(summary.penny_rows_failed) + 1
        continue
      }

      summary.penny_list_created = Number(summary.penny_list_created) + 1

      // Fetch the created row
      const pennyRow = await fetchCreatedPennyRow(supabase, row.sku)
      if (!pennyRow) {
        summary.penny_rows_failed = Number(summary.penny_rows_failed) + 1
        continue
      }

      // Apply Item Cache enrichment
      const enriched = await applyItemCacheToPennyRow(supabase, pennyRow, row.sku)
      if (enriched) {
        summary.penny_rows_enriched_by_cache = Number(summary.penny_rows_enriched_by_cache) + 1
      } else if (cacheApplyRpcUnavailable) {
        summary.penny_rows_cache_apply_skipped = Number(summary.penny_rows_cache_apply_skipped) + 1
      } else {
        summary.penny_rows_failed = Number(summary.penny_rows_failed) + 1
      }
    }

    const timestamp = new Date().toISOString().replace(/[:]/g, "-")
    const reportDir = path.join(process.cwd(), "reports", "manual-cade-fast-track")
    await mkdir(reportDir, { recursive: true })
    const reportPath = path.join(reportDir, `${timestamp}.json`)

    await writeFile(
      reportPath,
      JSON.stringify(
        {
          created_at: new Date().toISOString(),
          summary,
          rows: deduped.merged,
        },
        null,
        2
      ),
      "utf8"
    )

    summary.report_path = path.relative(process.cwd(), reportPath)
    console.log(JSON.stringify(summary, null, 2))
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

void main()
