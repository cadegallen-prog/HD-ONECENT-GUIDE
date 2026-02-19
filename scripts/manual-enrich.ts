#!/usr/bin/env tsx
/**
 * Manual Add -> Item Cache upsert + Penny List upsert/update.
 *
 * Canonical use:
 *   /manual
 *   { ...json... }
 *
 * CLI usage:
 *   echo '{ "sku":"1009258128","name":"Widget" }' | npm run manual:enrich
 *   npm run manual:enrich -- -- --json '{"sku":"1009258128","name":"Widget"}'
 *   npm run manual:enrich -- -- --input ./.local/manual.json
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

type PennyListApplyResult = {
  pennyRowsFound: number
  pennyRowsEnriched: number
  pennyRowsFailed: number
  cacheApplySkipped: boolean
}

type PennyListManualPatchResult = {
  updated: number
  failed: number
}

type NormalizeResult =
  | { ok: true; row: ManualNormalizedRow }
  | { ok: false; reason: string; rawSku: string | null }

type PennyRowForManual = {
  id: string
  internet_sku: number | null
  enrichment_provenance?: Record<string, unknown> | null
}

let cacheApplyRpcUnavailable = false

const KNOWN_ITEM_KEYS = new Set([
  "sku",
  "store_sku",
  "storeSku",
  "home_depot_sku_6_or_10_digits",
  "item_name",
  "itemName",
  "name",
  "title",
  "brand",
  "brand_name",
  "brandName",
  "model",
  "model_number",
  "modelNumber",
  "internet_number",
  "internetNumber",
  "internet_sku",
  "internetSku",
  "barcode_upc",
  "upc",
  "barcode",
  "gtin",
  "image_url",
  "imageUrl",
  "image",
  "image_link",
  "product_link",
  "productLink",
  "product_url",
  "productUrl",
  "pageUrl",
  "home_depot_url",
  "homeDepotUrl",
  "url",
  "retail_price",
  "retailPrice",
  "price",
  "details",
  "description",
])

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
      console.log("Manual Add enrichment")
      console.log("")
      console.log("Usage:")
      console.log('  echo \'{"sku":"1009258128","name":"Widget"}\' | npm run manual:enrich')
      console.log('  npm run manual:enrich -- -- --json \'{"sku":"1009258128","name":"Widget"}\'')
      console.log("  npm run manual:enrich -- -- --input ./.local/manual.json")
      console.log("  npm run manual:enrich -- -- --dry-run")
      process.exit(0)
    }
  }

  return args
}

async function readStdin(): Promise<string> {
  return await new Promise((resolve) => {
    let data = ""
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (chunk) => {
      data += chunk
    })
    process.stdin.on("end", () => resolve(data))
    if (process.stdin.isTTY) resolve("")
  })
}

function stripManualCommandPrefix(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed.startsWith("/manual")) return raw
  return trimmed.slice("/manual".length).trim()
}

function stripCodeFence(raw: string): string {
  const trimmed = raw.trim()
  const match = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i)
  return match ? match[1] : raw
}

async function resolveJsonInput(args: Args): Promise<string> {
  if (args.json && args.json.trim()) return args.json.trim()
  if (args.inputPath) return await readFile(path.resolve(process.cwd(), args.inputPath), "utf8")

  const stdinRaw = await readStdin()
  const cleaned = stripCodeFence(stripManualCommandPrefix(stdinRaw)).trim()
  if (cleaned) return cleaned

  throw new Error("No JSON payload found. Provide stdin, --json, or --input.")
}

function pickFirstDefined(record: Record<string, unknown>, aliases: string[]): PickResult {
  for (const key of aliases) {
    if (Object.prototype.hasOwnProperty.call(record, key)) {
      return { defined: true, value: record[key] }
    }
  }
  return { defined: false, value: undefined }
}

function toNullableText(value: unknown): string | null {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  return text ? text : null
}

function toNullablePositiveInt(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const digits = String(value).trim().replace(/\D/g, "")
  if (!digits) return null
  const parsed = Number.parseInt(digits, 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function toNullablePrice(value: unknown): number | null {
  if (value === null || value === undefined) return null
  const cleaned = String(value)
    .trim()
    .replace(/[^0-9.]/g, "")
  if (!cleaned) return null
  const parsed = Number(cleaned)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return Math.round(parsed * 100) / 100
}

function looksLikeSingleItem(record: Record<string, unknown>): boolean {
  for (const key of Object.keys(record)) {
    if (KNOWN_ITEM_KEYS.has(key)) return true
  }
  return false
}

function extractRawItems(payload: unknown): Record<string, unknown>[] {
  if (Array.isArray(payload)) {
    return payload.filter(
      (item): item is Record<string, unknown> =>
        Boolean(item) && typeof item === "object" && !Array.isArray(item)
    )
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return []
  }

  const obj = payload as Record<string, unknown>

  for (const containerKey of ["items", "data", "records"]) {
    const container = obj[containerKey]
    if (Array.isArray(container)) {
      return container.filter(
        (item): item is Record<string, unknown> =>
          Boolean(item) && typeof item === "object" && !Array.isArray(item)
      )
    }
  }

  if (looksLikeSingleItem(obj)) {
    return [obj]
  }

  const out: Record<string, unknown>[] = []
  for (const [key, value] of Object.entries(obj)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue
    const candidate = { ...(value as Record<string, unknown>) }
    if (!Object.prototype.hasOwnProperty.call(candidate, "sku")) {
      const skuCheck = validateSku(key)
      if (!skuCheck.error) candidate.sku = skuCheck.normalized
    }
    out.push(candidate)
  }
  return out
}

function normalizeOne(raw: Record<string, unknown>): NormalizeResult {
  const skuPick = pickFirstDefined(raw, [
    "sku",
    "store_sku",
    "storeSku",
    "home_depot_sku_6_or_10_digits",
  ])
  const rawSkuText = toNullableText(skuPick.value)
  if (!rawSkuText) return { ok: false, reason: "Missing sku", rawSku: null }

  const skuCheck = validateSku(rawSkuText)
  if (skuCheck.error) {
    return { ok: false, reason: skuCheck.error, rawSku: rawSkuText }
  }

  const row: ManualNormalizedRow = { sku: skuCheck.normalized }

  const itemNamePick = pickFirstDefined(raw, ["item_name", "itemName", "name", "title"])
  if (itemNamePick.defined) row.item_name = toNullableText(itemNamePick.value)

  const brandPick = pickFirstDefined(raw, ["brand", "brand_name", "brandName"])
  if (brandPick.defined) row.brand = toNullableText(brandPick.value)

  const modelPick = pickFirstDefined(raw, ["model", "model_number", "modelNumber"])
  if (modelPick.defined) row.model_number = toNullableText(modelPick.value)

  const barcodePick = pickFirstDefined(raw, ["barcode_upc", "upc", "barcode", "gtin"])
  if (barcodePick.defined) row.barcode_upc = toNullableText(barcodePick.value)

  const internetPick = pickFirstDefined(raw, [
    "internet_number",
    "internetNumber",
    "internet_sku",
    "internetSku",
  ])
  if (internetPick.defined) row.internet_number = toNullablePositiveInt(internetPick.value)

  const imagePick = pickFirstDefined(raw, ["image_url", "imageUrl", "image", "image_link"])
  if (imagePick.defined) row.image_url = toNullableText(imagePick.value)

  const productLinkPick = pickFirstDefined(raw, [
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

  const retailPricePick = pickFirstDefined(raw, ["retail_price", "retailPrice", "price"])
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

function buildManualPennyPatch(row: ManualNormalizedRow): Record<string, unknown> {
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

function buildManualProvenance(
  existing: Record<string, unknown> | null | undefined,
  row: ManualNormalizedRow,
  atIso: string
): Record<string, unknown> {
  const base = existing && typeof existing === "object" ? existing : {}
  const updates: Record<string, unknown> = {
    _schema: 1,
    _manual: {
      source: "manual_add",
      at: atIso,
    },
  }

  if ("item_name" in row) updates.item_name = { source: "manual", at: atIso }
  if ("brand" in row) updates.brand = { source: "manual", at: atIso }
  if ("model_number" in row) updates.model_number = { source: "manual", at: atIso }
  if ("image_url" in row) updates.image_url = { source: "manual", at: atIso }
  if ("product_link" in row) updates.home_depot_url = { source: "manual", at: atIso }
  if ("retail_price" in row) updates.retail_price = { source: "manual", at: atIso }

  if ("barcode_upc" in row) {
    updates.upc = {
      source: "manual",
      at: atIso,
      confirmed_absent: row.barcode_upc == null,
    }
  }
  if ("internet_number" in row) {
    updates.internet_sku = {
      source: "manual",
      at: atIso,
      confirmed_absent: row.internet_number == null,
    }
  }

  return { ...base, ...updates }
}

async function fetchPennyRowsForSku(
  supabase: ReturnType<typeof createClient>,
  sku: string
): Promise<PennyRowForManual[]> {
  const { data, error } = await supabase
    .from("Penny List")
    .select("id,internet_sku,enrichment_provenance")
    .eq("home_depot_sku_6_or_10_digits", sku)

  if (error) throw new Error(`Failed to fetch Penny List rows for ${sku}: ${error.message}`)
  return (data ?? []) as PennyRowForManual[]
}

async function ensurePennyRowsForSku(
  supabase: ReturnType<typeof createClient>,
  row: ManualNormalizedRow,
  atIso: string
): Promise<{ inserted: number; rows: PennyRowForManual[] }> {
  const existing = await fetchPennyRowsForSku(supabase, row.sku)
  if (existing.length > 0) {
    return { inserted: 0, rows: existing }
  }

  const patch = buildManualPennyPatch(row)
  const insertPayload: Record<string, unknown> = {
    home_depot_sku_6_or_10_digits: row.sku,
    item_name:
      (typeof patch.item_name === "string" && patch.item_name.trim().length > 0
        ? patch.item_name
        : `Manual Add SKU ${row.sku}`) ?? `Manual Add SKU ${row.sku}`,
    store_city_state: "Manual Add",
    purchase_date: atIso.slice(0, 10),
    exact_quantity_found: 1,
    notes_optional: "Manual Add via /manual",
    timestamp: atIso,
    status: "pending",
    ...patch,
    enrichment_provenance: buildManualProvenance(null, row, atIso),
  }

  const { error } = await supabase.from("Penny List").insert(insertPayload)
  if (error)
    throw new Error(`Failed to insert missing Penny List row for ${row.sku}: ${error.message}`)

  const insertedRows = await fetchPennyRowsForSku(supabase, row.sku)
  return {
    inserted: 1,
    rows: insertedRows,
  }
}

async function applyItemCacheToPennyRowsForSku(
  supabase: ReturnType<typeof createClient>,
  sku: string
): Promise<PennyListApplyResult> {
  const rows = await fetchPennyRowsForSku(supabase, sku)
  if (cacheApplyRpcUnavailable) {
    return {
      pennyRowsFound: rows.length,
      pennyRowsEnriched: 0,
      pennyRowsFailed: 0,
      cacheApplySkipped: true,
    }
  }

  let enriched = 0
  let failed = 0

  for (const row of rows) {
    const { data: rpcData, error: rpcError } = await supabase.rpc(
      "apply_item_cache_enrichment_for_penny_item",
      {
        p_penny_id: row.id,
        p_sku: sku,
        p_internet_number: row.internet_sku,
      }
    )

    if (rpcError) {
      const code = String((rpcError as { code?: string } | null)?.code || "")
      const message = String((rpcError as { message?: string } | null)?.message || "")
      const missingApplyRpc =
        code === "PGRST202" || message.includes("apply_item_cache_enrichment_for_penny_item")

      if (missingApplyRpc) {
        cacheApplyRpcUnavailable = true
        return {
          pennyRowsFound: rows.length,
          pennyRowsEnriched: 0,
          pennyRowsFailed: 0,
          cacheApplySkipped: true,
        }
      }

      failed += 1
      continue
    }

    const result = rpcData as { enriched?: boolean } | null
    if (result?.enriched) enriched += 1
  }

  return {
    pennyRowsFound: rows.length,
    pennyRowsEnriched: enriched,
    pennyRowsFailed: failed,
    cacheApplySkipped: false,
  }
}

async function applyManualPatchToPennyRowsForSku(
  supabase: ReturnType<typeof createClient>,
  row: ManualNormalizedRow,
  atIso: string
): Promise<PennyListManualPatchResult> {
  const basePatch = buildManualPennyPatch(row)
  if (Object.keys(basePatch).length === 0) return { updated: 0, failed: 0 }

  const rows = await fetchPennyRowsForSku(supabase, row.sku)
  let updated = 0
  let failed = 0

  for (const pennyRow of rows) {
    const patch: Record<string, unknown> = {
      ...basePatch,
      enrichment_provenance: buildManualProvenance(
        pennyRow.enrichment_provenance ?? null,
        row,
        atIso
      ),
    }

    const { error } = await supabase.from("Penny List").update(patch).eq("id", pennyRow.id)
    if (error) {
      failed += 1
      continue
    }

    updated += 1
  }

  return { updated, failed }
}

async function main() {
  try {
    tryLoadDotenv()
    const args = parseArgs(process.argv.slice(2))
    const inputText = await resolveJsonInput(args)
    const parsed = JSON.parse(inputText) as unknown
    const rawItems = extractRawItems(parsed)

    if (rawItems.length === 0) {
      throw new Error("No valid item objects found in payload.")
    }

    const normalizedRows: ManualNormalizedRow[] = []
    const errors: Array<{ sku: string | null; reason: string }> = []

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
      penny_rows_found: 0,
      penny_rows_inserted: 0,
      penny_rows_enriched_by_cache: 0,
      penny_rows_cache_apply_skipped: 0,
      penny_rows_updated_by_manual: 0,
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

    // Keep explicit checks for founder-facing error clarity.
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
      const ensured = await ensurePennyRowsForSku(supabase, row, nowIso)
      summary.penny_rows_inserted = Number(summary.penny_rows_inserted) + ensured.inserted

      const applyResult = await applyItemCacheToPennyRowsForSku(supabase, row.sku)
      summary.penny_rows_found = Number(summary.penny_rows_found) + applyResult.pennyRowsFound
      summary.penny_rows_enriched_by_cache =
        Number(summary.penny_rows_enriched_by_cache) + applyResult.pennyRowsEnriched
      summary.penny_rows_failed = Number(summary.penny_rows_failed) + applyResult.pennyRowsFailed
      if (applyResult.cacheApplySkipped) {
        summary.penny_rows_cache_apply_skipped =
          Number(summary.penny_rows_cache_apply_skipped) + applyResult.pennyRowsFound
      }

      const manualPatchResult = await applyManualPatchToPennyRowsForSku(supabase, row, nowIso)
      summary.penny_rows_updated_by_manual =
        Number(summary.penny_rows_updated_by_manual) + manualPatchResult.updated
      summary.penny_rows_failed = Number(summary.penny_rows_failed) + manualPatchResult.failed
    }

    const timestamp = new Date().toISOString().replace(/[:]/g, "-")
    const reportDir = path.join(process.cwd(), "reports", "manual-enrich")
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
