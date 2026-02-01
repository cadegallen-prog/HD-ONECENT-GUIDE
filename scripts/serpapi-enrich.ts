/**
 * SerpApi Home Depot Enrichment Script (v3 - Penny List Gaps)
 *
 * Uses SerpApi's Home Depot Search API to fetch product data.
 * This script is a BACKUP enrichment source that fills gaps in Penny List rows.
 *
 * Key changes in v3:
 * - Queries Penny List directly for rows with missing fields (not staging table)
 * - Updates Penny List rows directly (not staging table)
 * - No status/retry tracking (simplified)
 * - Primary enrichment now comes from staging queue (staging-warmer.py)
 *
 * Usage:
 *   npx tsx scripts/serpapi-enrich.ts              # Enrich up to 10 items
 *   npx tsx scripts/serpapi-enrich.ts --limit 5    # Limit to 5 items
 *   npx tsx scripts/serpapi-enrich.ts --test       # Test with 1 item only
 *   npx tsx scripts/serpapi-enrich.ts --sku 1009258128 # Test specific SKU
 *   npx tsx scripts/serpapi-enrich.ts --force      # Overwrite existing fields
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"
import { randomUUID } from "crypto"
import {
  fetchUpcFromHomeDepotProductWithSerpApi,
  getSerpApiDeliveryZip,
  SerpApiCreditsExhaustedError,
} from "../lib/serpapi/home-depot"
import { getHomeDepotProductUrl } from "../lib/home-depot"

// Load env
config({ path: resolve(process.cwd(), ".env.local") })

const SERPAPI_BASE_URL = "https://serpapi.com/search.json"
const GAP_LOOKBACK_DAYS = 30

interface SerpApiSearchResult {
  search_metadata?: { status: string }
  search_information?: { total_results: number }
  products?: Array<{
    position: number
    product_id: string
    title: string
    thumbnails?: Array<string[]>
    link: string
    model_number?: string
    brand?: string
    rating?: number
    reviews?: number
    price?: number
  }>
  error?: string
}

interface EnrichmentResult {
  sku: string
  item_name: string | null
  brand: string | null
  model_number: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  retail_price: number | null
  upc: string | null
  searchTerm: string
}

// Type for Penny List rows with gaps
interface PennyListGapRow {
  id: string
  home_depot_sku_6_or_10_digits: string | number | null
  item_name: string | null
  brand: string | null
  image_url: string | null
  retail_price: number | null
  internet_sku: number | null
  home_depot_url: string | null
  model_number: string | null
  upc: string | null
  enrichment_attempts: number
  enrichment_provenance?: Record<string, unknown> | null
}

// Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2)
  let limit = 10
  let testMode = false
  let specificSku: string | null = null
  let force = false

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10)
    if (args[i] === "--test") {
      testMode = true
      limit = 1
    }
    if (args[i] === "--sku" && args[i + 1]) {
      specificSku = args[++i]
      limit = 1
    }
    if (args[i] === "--force") force = true
  }

  return { limit, testMode, specificSku, force }
}

// Normalize SKU to valid format
function normalizeSku(sku: string | number | null): string | null {
  if (!sku) return null
  const str = String(sku).trim().replace(/\D/g, "")
  if (str.length === 6) return str
  if (str.length === 10 && (str.startsWith("100") || str.startsWith("101"))) return str
  return null
}

function hasNonEmptyText(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0
}

function hasValidInternetSku(value: unknown): boolean {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) && n > 0
}

function hasValidRetailPrice(value: unknown): boolean {
  const n = typeof value === "number" ? value : Number(value)
  return Number.isFinite(n) && n > 0
}

function isConfirmedAbsentByStaging(
  provenance: Record<string, unknown> | null | undefined,
  field: "upc" | "internet_sku"
): boolean {
  const entry = (provenance?.[field] ?? null) as unknown as {
    source?: unknown
    confirmed_absent?: unknown
  } | null

  return entry?.source === "staging" && entry?.confirmed_absent === true
}

// Check which fields are missing on a Penny List row
function getMissingFields(row: PennyListGapRow): string[] {
  const missing: string[] = []
  if (!hasNonEmptyText(row.item_name)) missing.push("item_name")
  if (!hasNonEmptyText(row.brand)) missing.push("brand")
  if (!hasNonEmptyText(row.image_url)) missing.push("image_url")
  if (!hasValidRetailPrice(row.retail_price)) missing.push("retail_price")
  return missing
}

// Clean item name for search (remove model numbers, adjectives, etc.)
function cleanItemName(name: string): string {
  return name
    .replace(/\b[A-Z0-9]{5,}\b/gi, "")
    .replace(/\b(the|a|an|with|for|and|or)\b/gi, "")
    .replace(/\b\d+(\.\d+)?\s*(in|ft|mm|cm|oz|lb|gal|qt|pk|ct)\b\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, 50)
    .trim()
}

// Determine whether a hostname is an allowed Home Depot domain or subdomain
function isAllowedHomeDepotHost(hostname: string): boolean {
  const allowedRoots = ["thdstatic.com", "homedepot.com"]
  return allowedRoots.some((root) => {
    return (
      hostname === root ||
      (hostname.endsWith("." + root) && hostname.length > root.length + 1)
    )
  })
}

// Optimize image URL
function optimizeImageUrl(url: string | null): string | null {
  if (!url) return null

  let hostname: string | null = null
  try {
    const parsed = new URL(url)
    hostname = parsed.hostname
  } catch {
    // If the URL cannot be parsed, return it unchanged
    return url
  }

  if (hostname && isAllowedHomeDepotHost(hostname)) {
    return url.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
  }

  return url
}

// Search SerpApi with a query term
async function searchSerpApi(
  query: string,
  apiKey: string
): Promise<SerpApiSearchResult["products"]> {
  const deliveryZip = getSerpApiDeliveryZip()
  const params = new URLSearchParams({
    engine: "home_depot",
    q: query,
    delivery_zip: deliveryZip,
    api_key: apiKey,
  })

  try {
    const response = await fetch(`${SERPAPI_BASE_URL}?${params.toString()}`)
    const data: SerpApiSearchResult = await response.json()

    if (data.error) {
      const msg = data.error.toLowerCase()
      const looksLikeCredits =
        msg.includes("exceeded") ||
        msg.includes("quota") ||
        msg.includes("credit") ||
        msg.includes("limit") ||
        msg.includes("payment") ||
        msg.includes("plan")

      if (looksLikeCredits) {
        throw new SerpApiCreditsExhaustedError(data.error)
      }

      if (!data.error.includes("hasn't returned any results")) {
        console.log(`   ?? SerpApi: ${data.error}`)
      }
      return undefined
    }

    return data.products
  } catch (error) {
    if (error instanceof SerpApiCreditsExhaustedError) throw error
    console.log(`   Warning: Fetch error: ${error}`)
    return undefined
  }
}

// Check if a search result is likely a match for the original item name
function isLikelyMatch(resultTitle: string, originalName: string): boolean {
  const resultLower = resultTitle.toLowerCase()
  const originalLower = originalName.toLowerCase()

  const stopWords = new Set([
    "the",
    "and",
    "for",
    "with",
    "pack",
    "set",
    "kit",
    "home",
    "depot",
    "in.",
    "ft.",
    "mm",
    "cm",
    "oz.",
    "lb.",
    "gal",
  ])

  const getKeywords = (s: string): string[] => {
    const words = s
      .split(/[\s,.\-\/]+/)
      .map((w) => w.replace(/[^a-z]/gi, "").toLowerCase())
      .filter((w) => w.length >= 4 && !stopWords.has(w))
    return [...new Set(words)].slice(0, 6)
  }

  const originalKeywords = getKeywords(originalLower)

  if (originalKeywords.length < 2) {
    console.log(`   Warning: Not enough keywords to validate (${originalKeywords.join(", ")})`)
    return false
  }

  let matches = 0
  for (const kw of originalKeywords) {
    if (resultLower.includes(kw)) matches++
  }

  const matchRatio = matches / originalKeywords.length
  console.log(
    `   Match check: ${matches}/${originalKeywords.length} keywords (${Math.round(matchRatio * 100)}%)`
  )
  return matchRatio >= 0.5
}

// Try to enrich using multiple search strategies
async function smartEnrich(
  sku: string,
  itemName: string | null,
  apiKey: string
): Promise<{ result: EnrichmentResult | null; searchTerm: string; creditsUsed: number }> {
  let creditsUsed = 0

  // Strategy 1: Search by SKU
  console.log(`   Trying SKU: ${sku}`)
  creditsUsed++
  let products = await searchSerpApi(sku, apiKey)

  if (products && products.length > 0) {
    // Prefer a result whose title matches the existing item_name when available.
    // This prevents accidentally enriching the wrong product when the SKU query is ambiguous.
    let candidate: NonNullable<SerpApiSearchResult["products"]>[0] | null = products[0]
    if (itemName) {
      const topMatches = candidate ? isLikelyMatch(candidate.title, itemName) : false
      if (!topMatches) {
        const alt = products.slice(1, 4).find((p) => isLikelyMatch(p.title, itemName))
        if (alt) candidate = alt
        else {
          console.log(`   Warning: SKU result doesn't match item name; skipping SKU result`)
          candidate = null
        }
      }
    }

    if (candidate) {
      return {
        result: extractProduct(sku, candidate, sku),
        searchTerm: sku,
        creditsUsed,
      }
    }
  }

  // Strategy 2: If SKU failed and we have item name, try that
  if (itemName) {
    const cleanedName = cleanItemName(itemName)
    if (cleanedName.length >= 10) {
      console.log(`   Trying item name: "${cleanedName.substring(0, 30)}..."`)
      creditsUsed++
      products = await searchSerpApi(cleanedName, apiKey)

      if (products && products.length > 0) {
        const topResult = products[0]
        if (isLikelyMatch(topResult.title, itemName)) {
          console.log(`   Result matches original item name`)
          return {
            result: extractProduct(sku, topResult, cleanedName),
            searchTerm: cleanedName,
            creditsUsed,
          }
        } else {
          console.log(`   Warning: Result doesn't match: "${topResult.title.substring(0, 40)}..."`)
          console.log(`   Warning: Skipping to avoid wrong product data`)
        }
      }
    }
  }

  return { result: null, searchTerm: sku, creditsUsed }
}

// Extract product data from SerpApi result
function extractProduct(
  originalSku: string,
  product: NonNullable<SerpApiSearchResult["products"]>[0],
  searchTerm: string
): EnrichmentResult {
  let imageUrl: string | null = null
  if (product.thumbnails && product.thumbnails[0]) {
    const thumbArray = product.thumbnails[0]
    imageUrl = thumbArray[4] || thumbArray[thumbArray.length - 1] || thumbArray[0] || null
  }

  let internetSku: number | null = null
  if (product.product_id) {
    const parsed = parseInt(product.product_id, 10)
    if (!isNaN(parsed)) internetSku = parsed
  }

  let homeDepotUrl = product.link
  if (homeDepotUrl) {
    try {
      const parsedUrl = new URL(homeDepotUrl)
      if (parsedUrl.hostname === "apionline.homedepot.com") {
        parsedUrl.hostname = "www.homedepot.com"
        homeDepotUrl = parsedUrl.toString()
      }
    } catch {
      // If URL parsing fails, fall back to the original value
    }
  }

  let retailPrice: number | null = null
  if (product.price !== undefined && product.price !== null) {
    const candidate =
      typeof product.price === "number"
        ? product.price
        : Number(String(product.price).replace(/[^0-9.]/g, ""))
    if (!Number.isNaN(candidate) && Number.isFinite(candidate)) {
      retailPrice = candidate
    }
  }

  return {
    sku: originalSku,
    item_name: product.title || null,
    brand: product.brand || null,
    model_number: product.model_number || null,
    image_url: optimizeImageUrl(imageUrl),
    home_depot_url: homeDepotUrl || null,
    internet_sku: internetSku,
    retail_price: retailPrice,
    upc: null, // Will be fetched separately
    searchTerm,
  }
}

// Get Penny List rows that have missing fields (gaps)
async function getPennyListGaps(
  supabase: ReturnType<typeof createClient>,
  limit: number
): Promise<PennyListGapRow[]> {
  const sinceIso = new Date(Date.now() - GAP_LOOKBACK_DAYS * 24 * 60 * 60 * 1000).toISOString()

  // Query Penny List for rows missing key fields
  const { data, error } = await supabase
    .from("Penny List")
    .select(
      "id, home_depot_sku_6_or_10_digits, item_name, brand, image_url, retail_price, internet_sku, home_depot_url, model_number, upc, enrichment_attempts, enrichment_provenance"
    )
    .or("item_name.is.null,brand.is.null,image_url.is.null,retail_price.is.null")
    .lt("enrichment_attempts", 2) // Skip items that already failed 2x
    .gte("timestamp", sinceIso) // Only enrich recent activity (limits SerpApi spend)
    .order("timestamp", { ascending: false })
    .limit(limit * 2) // Fetch more to account for filtering

  if (error) {
    console.error("Failed to fetch Penny List gaps:", error.message)
    return []
  }

  // Filter to rows that actually have missing fields and valid SKUs
  const gaps: PennyListGapRow[] = []
  const seenSkus = new Set<string>()

  for (const row of data || []) {
    const typedRow = row as unknown as PennyListGapRow
    const sku = normalizeSku(typedRow.home_depot_sku_6_or_10_digits)

    if (!sku) continue
    if (seenSkus.has(sku)) continue // Dedup by SKU

    const missing = getMissingFields(typedRow)
    if (missing.length === 0) continue

    seenSkus.add(sku)
    gaps.push(typedRow)

    if (gaps.length >= limit) break
  }

  return gaps
}

async function safeInsertSerpApiLogStart(
  supabase: ReturnType<typeof createClient>,
  payload: {
    run_id: string
    started_at: string
  }
): Promise<boolean> {
  try {
    const { error } = await supabase.from("serpapi_logs").insert(payload)
    if (error) {
      console.log(`Warning: Failed to write serpapi_logs (start): ${error.message}`)
      return false
    }
    return true
  } catch (error) {
    console.log(`Warning: Failed to write serpapi_logs (start): ${String(error)}`)
    return false
  }
}

async function safeUpdateSerpApiLogEnd(
  supabase: ReturnType<typeof createClient>,
  runId: string,
  payload: {
    finished_at: string
    items_processed: number
    credits_attempted: number
    skus_enriched: string[]
  }
): Promise<void> {
  try {
    const { error } = await supabase.from("serpapi_logs").update(payload).eq("run_id", runId)
    if (error) {
      console.log(`Warning: Failed to write serpapi_logs (end): ${error.message}`)
    }
  } catch (error) {
    console.log(`Warning: Failed to write serpapi_logs (end): ${String(error)}`)
  }
}

// Update a Penny List row directly with enrichment data
async function updatePennyListRow(
  supabase: ReturnType<typeof createClient>,
  id: string,
  enrichment: EnrichmentResult,
  currentRow: PennyListGapRow,
  force: boolean
): Promise<boolean> {
  const patch: Record<string, unknown> = {}
  const nowIso = new Date().toISOString()
  const deliveryZip = getSerpApiDeliveryZip()
  const baseProv = (currentRow.enrichment_provenance ?? {}) as Record<string, unknown>
  const nextProv: Record<string, unknown> = {
    ...baseProv,
    _schema: 1,
    _serpapi: {
      at: nowIso,
      delivery_zip: deliveryZip,
      search_term: enrichment.searchTerm,
    },
  }
  const provEntry = { source: "serpapi", at: nowIso, delivery_zip: deliveryZip }

  // Fill-blanks-only (merge rules) unless --force
  if (hasNonEmptyText(enrichment.item_name) && (force || !hasNonEmptyText(currentRow.item_name))) {
    patch.item_name = enrichment.item_name
    nextProv.item_name = provEntry
  }
  if (hasNonEmptyText(enrichment.brand) && (force || !hasNonEmptyText(currentRow.brand))) {
    patch.brand = enrichment.brand
    nextProv.brand = provEntry
  }
  if (
    hasNonEmptyText(enrichment.model_number) &&
    (force || !hasNonEmptyText(currentRow.model_number))
  ) {
    patch.model_number = enrichment.model_number
    nextProv.model_number = provEntry
  }
  if (hasNonEmptyText(enrichment.image_url) && (force || !hasNonEmptyText(currentRow.image_url))) {
    patch.image_url = enrichment.image_url
    nextProv.image_url = provEntry
  }
  if (
    hasValidInternetSku(enrichment.internet_sku) &&
    !isConfirmedAbsentByStaging(currentRow.enrichment_provenance, "internet_sku") &&
    (force || !hasValidInternetSku(currentRow.internet_sku))
  ) {
    patch.internet_sku = enrichment.internet_sku
    nextProv.internet_sku = { ...provEntry, confirmed_absent: false }
  }
  if (
    hasValidRetailPrice(enrichment.retail_price) &&
    (force || !hasValidRetailPrice(currentRow.retail_price))
  ) {
    patch.retail_price = enrichment.retail_price
    nextProv.retail_price = provEntry
  }

  // Always ensure a canonical Home Depot URL exists
  const canonicalHomeDepotUrl = getHomeDepotProductUrl({
    sku: enrichment.sku,
    homeDepotUrl: enrichment.home_depot_url || currentRow.home_depot_url || null,
    internetNumber: enrichment.internet_sku ?? currentRow.internet_sku ?? null,
  })
  if (
    hasNonEmptyText(canonicalHomeDepotUrl) &&
    (force || !hasNonEmptyText(currentRow.home_depot_url))
  ) {
    patch.home_depot_url = canonicalHomeDepotUrl
    nextProv.home_depot_url = provEntry
  }

  // UPC if available
  if (
    hasNonEmptyText(enrichment.upc) &&
    !isConfirmedAbsentByStaging(currentRow.enrichment_provenance, "upc") &&
    (force || !hasNonEmptyText(currentRow.upc))
  ) {
    patch.upc = enrichment.upc
    nextProv.upc = { ...provEntry, confirmed_absent: false }
  }

  if (Object.keys(patch).length === 0) {
    console.log(`   No fields to update`)
    return true
  }

  patch.enrichment_provenance = nextProv

  const { error } = await supabase.from("Penny List").update(patch).eq("id", id)

  if (error) {
    console.log(`   Warning: DB error: ${error.message}`)
    return false
  }

  console.log(`   Saved ${Object.keys(patch).length} field(s) to Penny List`)
  return true
}

async function main() {
  const { limit, testMode, specificSku, force } = parseArgs()
  const runId = randomUUID()

  console.log("SerpApi Home Depot Enrichment (v3 - Penny List Gaps)")
  console.log(`   Mode: ${testMode ? "TEST (1 item)" : `Normal (up to ${limit} items)`}`)
  console.log(`   delivery_zip: ${getSerpApiDeliveryZip()}`)
  console.log(`   gap_lookback_days: ${GAP_LOOKBACK_DAYS}`)
  if (force) console.log("   Warning: Force mode: Will overwrite existing fields")
  if (specificSku) console.log(`   Specific SKU: ${specificSku}`)
  console.log()

  // Validate credentials
  const serpApiKey = process.env.SERPAPI_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serpApiKey) {
    console.error("Missing SERPAPI_KEY")
    process.exit(1)
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  console.log("Connected to Supabase")

  const logEnabled = await safeInsertSerpApiLogStart(supabase, {
    run_id: runId,
    started_at: new Date().toISOString(),
  })

  // Get items to enrich
  let itemsToEnrich: PennyListGapRow[]

  if (specificSku) {
    const normalized = normalizeSku(specificSku)
    if (!normalized) {
      console.error(`Invalid SKU format: ${specificSku}`)
      process.exit(1)
    }

    // Fetch the specific row
    const { data, error } = await supabase
      .from("Penny List")
      .select(
        "id, home_depot_sku_6_or_10_digits, item_name, brand, image_url, retail_price, internet_sku, home_depot_url, model_number, upc, enrichment_attempts, enrichment_provenance"
      )
      .eq("home_depot_sku_6_or_10_digits", normalized)
      .limit(1)
      .single()

    if (error || !data) {
      console.error(`SKU ${normalized} not found in Penny List`)
      process.exit(1)
    }

    itemsToEnrich = [data as unknown as PennyListGapRow]
  } else {
    console.log("Finding Penny List rows with gaps...")
    itemsToEnrich = await getPennyListGaps(supabase, limit)
  }

  if (itemsToEnrich.length === 0) {
    console.log("\nNo recent gaps to enrich; skipping.")

    if (logEnabled) {
      await safeUpdateSerpApiLogEnd(supabase, runId, {
        finished_at: new Date().toISOString(),
        items_processed: 0,
        credits_attempted: 0,
        skus_enriched: [],
      })
    }

    process.exit(0)
  }

  console.log(`\nProcessing ${itemsToEnrich.length} item(s) with gaps...\n`)

  // Process each item
  let success = 0
  let failed = 0
  let totalCredits = 0
  const skusEnriched: string[] = []

  for (let i = 0; i < itemsToEnrich.length; i++) {
    const row = itemsToEnrich[i]
    const sku = normalizeSku(row.home_depot_sku_6_or_10_digits)
    if (!sku) continue

    console.log(`[${i + 1}/${itemsToEnrich.length}] SKU: ${sku}`)
    const missing = getMissingFields(row)
    console.log(`   Missing: ${missing.join(", ")}`)

    // Log if row is approaching max attempts
    if (row.enrichment_attempts >= 1) {
      console.log(`   Warning: ${row.enrichment_attempts} previous attempt(s)`)
    }

    if (row.item_name) console.log(`   Item name: ${row.item_name.substring(0, 40)}...`)

    const { result, searchTerm, creditsUsed } = await smartEnrich(sku, row.item_name, serpApiKey)
    totalCredits += creditsUsed

    if (result && result.item_name) {
      console.log(`   Found: ${result.item_name.substring(0, 50)}...`)
      console.log(`   Image: ${result.image_url ? "Yes" : "No"}`)
      console.log(`   Internet SKU: ${result.internet_sku || "N/A"}`)

      // UPC extraction must use SerpApi (direct HomeDepot.com fetch is bot-blocked).
      const needUpc =
        !hasNonEmptyText(row.upc) && !isConfirmedAbsentByStaging(row.enrichment_provenance, "upc")

      const productIdCandidate = result.internet_sku ?? row.internet_sku ?? null
      const canUseProductId =
        hasValidInternetSku(productIdCandidate) &&
        !isConfirmedAbsentByStaging(row.enrichment_provenance, "internet_sku")

      if (needUpc && canUseProductId) {
        totalCredits++ // home_depot_product call
        const upc = await fetchUpcFromHomeDepotProductWithSerpApi({
          apiKey: serpApiKey,
          productId: String(productIdCandidate),
          deliveryZip: getSerpApiDeliveryZip(),
        })

        if (upc) {
          result.upc = upc
          console.log(`   UPC: ${upc}`)
        }
      }

      const updated = await updatePennyListRow(supabase, row.id, result, row, force)
      if (updated) {
        success++
        skusEnriched.push(sku)
      } else {
        failed++
      }
    } else {
      console.log(`   No results found (tried ${creditsUsed} search${creditsUsed > 1 ? "es" : ""})`)

      // Increment attempt counter on failure
      const currentAttempts = row.enrichment_attempts || 0
      await supabase
        .from("Penny List")
        .update({ enrichment_attempts: currentAttempts + 1 })
        .eq("id", row.id)

      console.log(`   Updated enrichment_attempts: ${currentAttempts} → ${currentAttempts + 1}`)
      failed++
    }

    // Small delay between items
    if (i < itemsToEnrich.length - 1) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log("Done!")
  console.log(`   Success: ${success}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Credits used: ~${totalCredits}`)
  console.log("=".repeat(50))

  if (logEnabled) {
    await safeUpdateSerpApiLogEnd(supabase, runId, {
      finished_at: new Date().toISOString(),
      items_processed: itemsToEnrich.length,
      credits_attempted: totalCredits,
      skus_enriched: [...new Set(skusEnriched)],
    })
  }
}

main().catch((error) => {
  if (error instanceof SerpApiCreditsExhaustedError) {
    console.log("Warning: SerpApi credits exhausted; exiting cleanly (no-op).")
    console.log(`   ${error.message}`)
    process.exit(0)
  }

  console.error(error)
  process.exit(1)
})
