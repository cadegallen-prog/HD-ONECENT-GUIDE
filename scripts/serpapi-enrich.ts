/**
 * SerpApi Home Depot Enrichment Script (v2 - with credit-saving)
 *
 * Uses SerpApi's Home Depot Search API to fetch product data.
 * Features:
 * - Negative caching: Tracks failed SKUs and skips them until retry window
 * - Fallback search: If SKU fails, tries item name
 * - Exponential backoff: Failed items wait longer before retry
 *
 * Usage:
 *   npx tsx scripts/serpapi-enrich.ts              # Enrich up to 10 items
 *   npx tsx scripts/serpapi-enrich.ts --limit 5    # Limit to 5 items
 *   npx tsx scripts/serpapi-enrich.ts --test       # Test with 1 item only
 *   npx tsx scripts/serpapi-enrich.ts --sku 123456 # Test specific SKU
 *   npx tsx scripts/serpapi-enrich.ts --retry      # Retry failed items past retry window
 *   npx tsx scripts/serpapi-enrich.ts --force      # Overwrite existing fields when SerpApi returns values
 */

import { config } from "dotenv"
import { resolve } from "path"
import { createClient } from "@supabase/supabase-js"

// Load env
config({ path: resolve(process.cwd(), ".env.local") })

const SERPAPI_BASE_URL = "https://serpapi.com/search.json"

class SerpApiCreditsExhaustedError extends Error {
  constructor(message: string) {
    super(message)
    this.name = "SerpApiCreditsExhaustedError"
  }
}

// Retry windows in days
const RETRY_WINDOWS = {
  first_fail: 30, // First failure: wait 30 days
  second_fail: 90, // Second failure: wait 90 days
  third_fail: 180, // Third+ failure: wait 180 days
}

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
  source: string
  searchTerm: string // Track what search term worked
}

interface PennyItem {
  sku: string
  itemName: string | null
}

// Type for Penny List table rows
interface PennyListRow {
  home_depot_sku_6_or_10_digits: string | number | null
  item_name: string | null
}

// Type for penny_item_enrichment table rows
interface EnrichmentRow {
  sku: string
  status: string | null
  retry_after: string | null
  attempt_count: number | null
  item_name: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  retail_price: number | null
}

// Parse CLI args
function parseArgs() {
  const args = process.argv.slice(2)
  let limit = 10
  let testMode = false
  let specificSku: string | null = null
  let retryMode = false
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
    if (args[i] === "--retry") retryMode = true
    if (args[i] === "--force") force = true
  }

  return { limit, testMode, specificSku, retryMode, force }
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

function buildCanonicalHomeDepotUrl(params: {
  sku: string
  homeDepotUrl: string | null
  internetSku: number | null
}): string {
  const manual = (params.homeDepotUrl || "").trim()
  if (manual) return manual

  if (hasValidInternetSku(params.internetSku)) {
    return `https://www.homedepot.com/p/${Number(params.internetSku)}`
  }

  return `https://www.homedepot.com/s/${params.sku}`
}

function getMissingSerpApiFields(row: EnrichmentRow): string[] {
  const missing: string[] = []
  if (!hasNonEmptyText(row.item_name)) missing.push("item_name")
  if (!hasNonEmptyText(row.brand)) missing.push("brand")
  if (!hasNonEmptyText(row.model_number)) missing.push("model_number")
  if (!hasNonEmptyText(row.image_url)) missing.push("image_url")
  if (!hasNonEmptyText(row.home_depot_url) && !hasValidInternetSku(row.internet_sku)) {
    missing.push("home_depot_url/internet_sku")
  }
  if (!hasValidRetailPrice(row.retail_price)) missing.push("retail_price")
  return missing
}

// Clean item name for search (remove model numbers, adjectives, etc.)
function cleanItemName(name: string): string {
  return (
    name
      // Remove model numbers (alphanumeric sequences)
      .replace(/\b[A-Z0-9]{5,}\b/gi, "")
      // Remove common filler words
      .replace(/\b(the|a|an|with|for|and|or)\b/gi, "")
      // Remove measurements
      .replace(/\b\d+(\.\d+)?\s*(in|ft|mm|cm|oz|lb|gal|qt|pk|ct)\b\.?/gi, "")
      // Remove extra spaces
      .replace(/\s+/g, " ")
      .trim()
      // Take first ~50 chars to avoid too-long queries
      .substring(0, 50)
      .trim()
  )
}

// Optimize image URL
function optimizeImageUrl(url: string | null): string | null {
  if (!url) return null
  if (url.includes("thdstatic.com") || url.includes("homedepot.com")) {
    return url.replace(/\/\d+\.jpg(\?.*)?$/, "/1000.jpg")
  }
  return url
}

// Calculate retry date based on attempt count
function getRetryDate(attemptCount: number): string {
  let days = RETRY_WINDOWS.first_fail
  if (attemptCount >= 3) days = RETRY_WINDOWS.third_fail
  else if (attemptCount >= 2) days = RETRY_WINDOWS.second_fail

  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

function normalizeUpcCandidate(value: unknown): string | null {
  if (!value) return null
  const digits = String(value).replace(/\D/g, "")
  if (digits.length === 12 || digits.length === 13 || digits.length === 14) return digits
  return null
}

function extractUpcFromJsonLd(data: unknown): string | null {
  if (!data) return null

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = extractUpcFromJsonLd(item)
      if (found) return found
    }
    return null
  }

  if (typeof data !== "object") return null

  const record = data as Record<string, unknown>
  const direct = normalizeUpcCandidate(
    record.gtin12 ?? record.gtin13 ?? record.gtin14 ?? record.upc
  )
  if (direct) return direct

  for (const value of Object.values(record)) {
    const found = extractUpcFromJsonLd(value)
    if (found) return found
  }

  return null
}

async function fetchUpcFromHomeDepotPage(homeDepotUrl: string): Promise<string | null> {
  if (!hasNonEmptyText(homeDepotUrl)) return null

  try {
    const response = await fetch(homeDepotUrl, {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        accept: "text/html,application/xhtml+xml",
      },
    })

    if (!response.ok) return null
    const html = await response.text()

    const jsonLdRegex = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi

    let match: RegExpExecArray | null
    while ((match = jsonLdRegex.exec(html)) !== null) {
      const payload = match[1]
      if (!payload) continue
      try {
        const parsed = JSON.parse(payload)
        const upc = extractUpcFromJsonLd(parsed)
        if (upc) return upc
      } catch {
        // ignore malformed JSON-LD blocks
      }
    }

    // Fallback heuristic: sometimes UPC appears in inline JSON
    const inlineUpc = normalizeUpcCandidate(
      html.match(/\"(?:gtin12|gtin13|gtin14|upc)\"\\s*:\\s*\"(\\d{12,14})\"/i)?.[1]
    )
    if (inlineUpc) return inlineUpc

    return null
  } catch {
    return null
  }
}

// Search SerpApi with a query term
async function searchSerpApi(
  query: string,
  apiKey: string
): Promise<SerpApiSearchResult["products"]> {
  const params = new URLSearchParams({
    engine: "home_depot",
    q: query,
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
    console.log(`   ⚠️ Fetch error: ${error}`)
    return undefined
  }
}

// Check if a search result is likely a match for the original item name
function isLikelyMatch(resultTitle: string, originalName: string): boolean {
  const resultLower = resultTitle.toLowerCase()
  const originalLower = originalName.toLowerCase()

  // Words to ignore (common words + measurements)
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

  // Extract key words (4+ chars, not common/measurement words, letters only)
  const getKeywords = (s: string): string[] => {
    const words = s
      .split(/[\s,.\-\/]+/)
      .map((w) => w.replace(/[^a-z]/gi, "").toLowerCase())
      .filter((w) => w.length >= 4 && !stopWords.has(w))
    // Use Set to remove duplicates
    return [...new Set(words)].slice(0, 6)
  }

  const originalKeywords = getKeywords(originalLower)

  // If no meaningful keywords, can't validate - be conservative and reject
  if (originalKeywords.length < 2) {
    console.log(`   ⚠️ Not enough keywords to validate (${originalKeywords.join(", ")})`)
    return false
  }

  // Count how many original keywords appear in result
  let matches = 0
  for (const kw of originalKeywords) {
    if (resultLower.includes(kw)) matches++
  }

  // Require at least 50% keyword overlap for a match
  const matchRatio = matches / originalKeywords.length
  console.log(
    `   📊 Match check: ${matches}/${originalKeywords.length} keywords (${Math.round(matchRatio * 100)}%)`
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
  console.log(`   🔍 Trying SKU: ${sku}`)
  creditsUsed++
  let products = await searchSerpApi(sku, apiKey)

  if (products && products.length > 0) {
    return {
      result: extractProduct(sku, products[0], sku),
      searchTerm: sku,
      creditsUsed,
    }
  }

  // Strategy 2: If SKU failed and we have item name, try that
  // BUT validate the result to avoid false positives
  if (itemName) {
    const cleanedName = cleanItemName(itemName)
    if (cleanedName.length >= 10) {
      console.log(`   🔍 Trying item name: "${cleanedName.substring(0, 30)}..."`)
      creditsUsed++
      products = await searchSerpApi(cleanedName, apiKey)

      if (products && products.length > 0) {
        const topResult = products[0]
        // Validate: Does the result actually match the original item?
        if (isLikelyMatch(topResult.title, itemName)) {
          console.log(`   ✓ Result matches original item name`)
          return {
            result: extractProduct(sku, topResult, cleanedName),
            searchTerm: cleanedName,
            creditsUsed,
          }
        } else {
          console.log(`   ⚠️ Result doesn't match: "${topResult.title.substring(0, 40)}..."`)
          console.log(`   ⚠️ Skipping to avoid wrong product data`)
        }
      }
    }
  }

  // All strategies failed
  return { result: null, searchTerm: sku, creditsUsed }
}

// Extract product data from SerpApi result
function extractProduct(
  originalSku: string,
  product: NonNullable<SerpApiSearchResult["products"]>[0],
  searchTerm: string
): EnrichmentResult {
  // Extract image from thumbnails
  let imageUrl: string | null = null
  if (product.thumbnails && product.thumbnails[0]) {
    const thumbArray = product.thumbnails[0]
    imageUrl = thumbArray[4] || thumbArray[thumbArray.length - 1] || thumbArray[0] || null
  }

  // Extract internet SKU from product_id
  let internetSku: number | null = null
  if (product.product_id) {
    const parsed = parseInt(product.product_id, 10)
    if (!isNaN(parsed)) internetSku = parsed
  }

  // Build proper Home Depot URL
  let homeDepotUrl = product.link
  if (homeDepotUrl && homeDepotUrl.includes("apionline.homedepot.com")) {
    homeDepotUrl = homeDepotUrl.replace("apionline.homedepot.com", "www.homedepot.com")
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
    source: "serpapi",
    searchTerm,
  }
}

// Get items that need enrichment (with negative cache awareness)
async function getItemsToEnrich(
  supabase: ReturnType<typeof createClient<any, any, any>>,
  limit: number,
  retryMode: boolean
): Promise<PennyItem[]> {
  // Get all items from Penny List with item names
  const { data: pennyItems, error: pennyError } = await supabase
    .from("Penny List")
    .select("home_depot_sku_6_or_10_digits, item_name")
    .order("timestamp", { ascending: false })
    .limit(500)

  if (pennyError) {
    console.error("❌ Failed to fetch Penny List:", pennyError.message)
    return []
  }

  // Get enrichment rows for all SKUs (used to skip already-complete items and honor retry windows)
  const { data: enrichedItems, error: enrichError } = await supabase
    .from("penny_item_enrichment")
    .select(
      "sku,status,retry_after,attempt_count,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price"
    )

  if (enrichError && enrichError.code !== "PGRST205") {
    console.error("❌ Failed to fetch enrichment:", enrichError.message)
    return []
  }

  // Build lookup map
  const enrichmentMap = new Map<string, EnrichmentRow>()
  for (const item of enrichedItems || []) {
    const typedItem = item as unknown as EnrichmentRow
    const sku = normalizeSku(typedItem.sku)
    if (sku) {
      enrichmentMap.set(sku, typedItem)
    }
  }

  const now = new Date()
  const needsEnrichment: PennyItem[] = []
  const seen = new Set<string>()

  let skippedNotFound = 0
  let skippedComplete = 0

  for (const item of pennyItems || []) {
    const typedItem = item as unknown as PennyListRow
    const sku = normalizeSku(typedItem.home_depot_sku_6_or_10_digits)
    if (!sku || seen.has(sku)) continue
    seen.add(sku)

    const existing = enrichmentMap.get(sku)

    if (!existing) {
      // Never tried before - enrich it
      needsEnrichment.push({ sku, itemName: typedItem.item_name })
      if (needsEnrichment.length >= limit) break
      continue
    }

    const status = existing.status || "enriched"

    if (status === "not_found" || status === "error") {
      // Failed before - check if retry window passed
      if (retryMode && existing.retry_after) {
        const retryDate = new Date(existing.retry_after)
        if (now >= retryDate) {
          console.log(`   ♻️ Retrying ${sku} (past retry window)`)
          needsEnrichment.push({ sku, itemName: typedItem.item_name })
        } else {
          skippedNotFound++
        }
      } else {
        skippedNotFound++
      }

      if (needsEnrichment.length >= limit) break
      continue
    }

    const missing = getMissingSerpApiFields(existing)
    if (missing.length === 0) {
      skippedComplete++
      continue
    }

    needsEnrichment.push({ sku, itemName: typedItem.item_name })
    if (needsEnrichment.length >= limit) break
  }

  console.log(`   📊 Penny List items: ${pennyItems?.length || 0}`)
  console.log(`   ✅ Already complete (skipped): ${skippedComplete}`)
  console.log(`   ⏭️ Skipped (not_found, waiting): ${skippedNotFound}`)
  console.log(`   📦 To process: ${needsEnrichment.length}`)

  return needsEnrichment
}

async function main() {
  const { limit, testMode, specificSku, retryMode, force } = parseArgs()

  console.log("🔍 SerpApi Home Depot Enrichment (v2 - credit-saving)")
  console.log(`   Mode: ${testMode ? "TEST (1 item)" : `Normal (up to ${limit} items)`}`)
  if (retryMode) console.log("   ♻️ Retry mode: Will retry failed items past their window")
  if (force)
    console.log("   ⚠️ Force mode: Will overwrite existing fields when SerpApi returns values")
  if (specificSku) console.log(`   Specific SKU: ${specificSku}`)
  console.log()

  // Validate credentials
  const serpApiKey = process.env.SERPAPI_KEY
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serpApiKey) {
    console.error("❌ Missing SERPAPI_KEY")
    process.exit(1)
  }
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("❌ Missing Supabase credentials")
    process.exit(1)
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  console.log("✅ Connected to Supabase")

  // Get items to enrich
  let itemsToEnrich: PennyItem[]

  if (specificSku) {
    const normalized = normalizeSku(specificSku)
    if (!normalized) {
      console.error(`❌ Invalid SKU format: ${specificSku}`)
      process.exit(1)
    }
    itemsToEnrich = [{ sku: normalized, itemName: null }]
  } else {
    console.log("📋 Finding items that need enrichment...")
    itemsToEnrich = await getItemsToEnrich(supabase, limit, retryMode)
  }

  if (itemsToEnrich.length === 0) {
    console.log("\n✅ All items enriched or waiting for retry! Nothing to do.")
    process.exit(0)
  }

  console.log(`\n📦 Processing ${itemsToEnrich.length} item(s)...\n`)

  // Process each item
  let success = 0
  let failed = 0
  let totalCredits = 0

  for (let i = 0; i < itemsToEnrich.length; i++) {
    const { sku, itemName } = itemsToEnrich[i]
    console.log(`[${i + 1}/${itemsToEnrich.length}] SKU: ${sku}`)
    if (itemName) console.log(`   📝 Item name: ${itemName.substring(0, 40)}...`)

    const { data: existingRow, error: existingError } = await supabase
      .from("penny_item_enrichment")
      .select(
        "sku,status,retry_after,attempt_count,item_name,brand,model_number,upc,image_url,home_depot_url,internet_sku,retail_price"
      )
      .eq("sku", sku)
      .maybeSingle()

    if (existingError && existingError.code !== "PGRST205") {
      console.log(`   ⚠️ Failed to fetch existing enrichment row: ${existingError.message}`)
    }

    const existingTyped = (existingRow as unknown as EnrichmentRow | null) ?? null
    if (existingTyped) {
      const missing = getMissingSerpApiFields(existingTyped)
      if (missing.length === 0 && !force) {
        console.log("   ✅ Already complete (skipping)")
        success++
        continue
      }
      if (missing.length > 0) {
        console.log(`   🧩 Missing: ${missing.join(", ")}`)
      }
    }

    const { result, searchTerm, creditsUsed } = await smartEnrich(sku, itemName, serpApiKey)
    totalCredits += creditsUsed

    if (result && result.item_name) {
      console.log(`   ✅ Found: ${result.item_name.substring(0, 50)}...`)
      console.log(`   📷 Image: ${result.image_url ? "Yes" : "No"}`)
      console.log(`   🔢 Internet SKU: ${result.internet_sku || "N/A"}`)

      const patch: Record<string, unknown> = {
        sku: result.sku,
        source: "serpapi",
        status: "enriched",
        attempt_count: 1,
        retry_after: null,
        last_search_term: searchTerm,
        updated_at: new Date().toISOString(),
      }

      const current =
        existingTyped && normalizeSku(existingTyped.sku) === normalizeSku(result.sku)
          ? existingTyped
          : null

      // Fill-blanks-only by default (overwrite only with --force)
      if (hasNonEmptyText(result.item_name) && (force || !hasNonEmptyText(current?.item_name))) {
        patch.item_name = result.item_name
      }
      if (hasNonEmptyText(result.brand) && (force || !hasNonEmptyText(current?.brand))) {
        patch.brand = result.brand
      }
      if (
        hasNonEmptyText(result.model_number) &&
        (force || !hasNonEmptyText(current?.model_number))
      ) {
        patch.model_number = result.model_number
      }
      if (hasNonEmptyText(result.image_url) && (force || !hasNonEmptyText(current?.image_url))) {
        patch.image_url = result.image_url
      }
      if (
        hasValidInternetSku(result.internet_sku) &&
        (force || !hasValidInternetSku(current?.internet_sku))
      ) {
        patch.internet_sku = result.internet_sku
      }
      if (
        hasValidRetailPrice(result.retail_price) &&
        (force || !hasValidRetailPrice(current?.retail_price))
      ) {
        patch.retail_price = result.retail_price
      }

      // Always ensure a canonical Home Depot URL exists (but don't overwrite unless --force)
      const canonicalHomeDepotUrl = buildCanonicalHomeDepotUrl({
        sku: result.sku,
        homeDepotUrl: result.home_depot_url || current?.home_depot_url || null,
        internetSku: result.internet_sku ?? current?.internet_sku ?? null,
      })
      if (
        hasNonEmptyText(canonicalHomeDepotUrl) &&
        (force || !hasNonEmptyText(current?.home_depot_url))
      ) {
        patch.home_depot_url = canonicalHomeDepotUrl
      }

      // Best-effort UPC fetch (does not cost SerpApi credits). Only fills blanks unless --force.
      if (force || !hasNonEmptyText(current?.upc)) {
        const upc = await fetchUpcFromHomeDepotPage(canonicalHomeDepotUrl)
        if (hasNonEmptyText(upc) && (force || !hasNonEmptyText(current?.upc))) {
          patch.upc = upc
          console.log(`   🏷️ UPC: ${upc}`)
        }
      }

      const { error } = await supabase
        .from("penny_item_enrichment")
        .upsert(patch, { onConflict: "sku" })

      if (error) {
        console.log(`   ⚠️ DB error: ${error.message}`)
        failed++
      } else {
        console.log(`   💾 Saved to database`)
        success++
      }
    } else {
      // All search strategies failed - save as not_found
      console.log(
        `   ❌ No results found (tried ${creditsUsed} search${creditsUsed > 1 ? "es" : ""})`
      )

      // Get current attempt count
      const { data: existing } = await supabase
        .from("penny_item_enrichment")
        .select("attempt_count")
        .eq("sku", sku)
        .maybeSingle()

      const attemptCount = (existing?.attempt_count || 0) + 1
      const retryAfter = getRetryDate(attemptCount)

      const { error } = await supabase.from("penny_item_enrichment").upsert(
        {
          sku,
          status: "not_found",
          attempt_count: attemptCount,
          retry_after: retryAfter,
          last_search_term: searchTerm,
          source: "serpapi",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "sku" }
      )

      if (error) {
        console.log(`   ⚠️ Failed to save not_found status: ${error.message}`)
      } else {
        const daysUntilRetry = Math.ceil(
          (new Date(retryAfter).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        )
        console.log(`   ⏭️ Marked as not_found (retry in ${daysUntilRetry} days)`)
      }
      failed++
    }

    // Small delay between items
    if (i < itemsToEnrich.length - 1) {
      await new Promise((r) => setTimeout(r, 500))
    }
  }

  console.log("\n" + "=".repeat(50))
  console.log("🎉 Done!")
  console.log(`   Success: ${success}`)
  console.log(`   Failed (marked not_found): ${failed}`)
  console.log(`   Credits used: ~${totalCredits}`)
  console.log("=".repeat(50))
}

main().catch((error) => {
  if (error instanceof SerpApiCreditsExhaustedError) {
    console.log("⚠️  SerpApi credits exhausted; exiting cleanly (no-op).")
    console.log(`   ${error.message}`)
    process.exit(0)
  }

  console.error(error)
  process.exit(1)
})
