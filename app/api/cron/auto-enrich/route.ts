import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Auto-Enrichment Cron Endpoint
 *
 * Called by Vercel Cron to automatically enrich SKUs.
 * Uses ScraperAPI to fetch product data from Home Depot.
 *
 * Schedule: Every 6 hours (configurable in vercel.json)
 * Rate: ~15 SKUs per run = 60 SKUs/day
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - SCRAPER_API_KEY
 *   - CRON_SECRET (for authorization)
 */

const BATCH_SIZE = 15 // SKUs per cron run
const DELAY_MS = 5000 // 5 seconds between requests

// Known brands that should stay uppercase
const KNOWN_BRANDS = [
  "DEWALT",
  "MILWAUKEE",
  "RIDGID",
  "RYOBI",
  "MAKITA",
  "BOSCH",
  "KOHLER",
  "MOEN",
  "DELTA",
  "PFISTER",
  "HUSKY",
  "EVERBILT",
  "HDX",
  "GLACIER BAY",
  "HAMPTON BAY",
  "DEFIANT",
  "COMMERCIAL ELECTRIC",
  "VIGORO",
  "BEHR",
  "GLIDDEN",
  "PPG",
  "RUST-OLEUM",
  "DAP",
  "GE",
  "LG",
  "SAMSUNG",
  "WHIRLPOOL",
  "MAYTAG",
  "FRIGIDAIRE",
  "TORO",
  "ECHO",
  "EGO",
  "STIHL",
  "DIABLO",
  "IRWIN",
  "STANLEY",
  "CRAFTSMAN",
  "WERNER",
  "GORILLA",
  "3M",
  "WD-40",
  "CLR",
  "ZINSSER",
  "LIFEPROOF",
  "TRAFFICMASTER",
  "METALUX",
  "HALO",
  "LEVITON",
]

/**
 * Normalizes a brand name for consistent display.
 */
function normalizeBrand(brand: string | null): string | null {
  if (!brand) return null

  const trimmed = brand.replace(/\s+/g, " ").trim()
  const upper = trimmed.toUpperCase()

  // Check if it's a known brand
  for (const known of KNOWN_BRANDS) {
    if (upper === known || upper === known.replace(/\s+/g, "")) {
      return known
    }
  }

  // Title case for unknown brands
  return trimmed.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
}

/**
 * Normalizes a product name for consistent display.
 */
function normalizeProductName(name: string | null, brand: string | null): string | null {
  if (!name) return null

  let normalized = name.replace(/\s+/g, " ").trim()

  // Remove brand from beginning if duplicated
  if (brand) {
    const brandLower = brand.toLowerCase()
    if (normalized.toLowerCase().startsWith(brandLower)) {
      normalized = normalized
        .slice(brand.length)
        .replace(/^[\s-:]+/, "")
        .trim()
    }
  }

  // Title Case
  normalized = normalized.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())

  // Keep abbreviations uppercase
  const abbreviations = [
    "HD",
    "LED",
    "USB",
    "AC",
    "DC",
    "UV",
    "PVC",
    "ABS",
    "HVAC",
    "CFM",
    "PSI",
    "RPM",
    "GPM",
    "BTU",
  ]
  for (const abbr of abbreviations) {
    normalized = normalized.replace(new RegExp(`\\b${abbr}\\b`, "gi"), abbr)
  }

  // Standardize units (lowercase with period)
  const units = ["in", "ft", "mm", "cm", "oz", "lb", "gal", "qt", "pk", "ct", "sq"]
  for (const unit of units) {
    // First pass: match units WITH periods (to normalize spacing)
    const withPeriod = new RegExp(`(\\d)\\s*${unit}\\.`, "gi")
    normalized = normalized.replace(withPeriod, (_, digit) => `${digit} ${unit}.`)

    // Second pass: match units WITHOUT periods (add period)
    // Only match if followed by space or end, not if followed by another character
    const withoutPeriod = new RegExp(`(\\d)\\s*${unit}(?=\\s|$)`, "gi")
    normalized = normalized.replace(withoutPeriod, (_, digit) => `${digit} ${unit}.`)
  }

  return normalized
}

// Verify cron authorization
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  // Vercel Cron sends the secret as Bearer token
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true
  }

  // Also allow if no secret configured (development)
  if (!cronSecret && process.env.NODE_ENV === "development") {
    return true
  }

  return false
}

// Simple HTTP fetch with timeout
async function fetchWithTimeout(url: string, timeoutMs = 30000): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })
    return await response.text()
  } finally {
    clearTimeout(timeout)
  }
}

// Parse Home Depot product page
function parseProductPage(html: string, sku: string) {
  const result: Record<string, string | number | null> = {
    sku,
    item_name: null,
    brand: null,
    model_number: null,
    image_url: null,
    home_depot_url: null,
    internet_sku: null,
  }

  // Brand (extract first, needed for name normalization)
  const brandMatch = html.match(/<[^>]*data-testid="product-brand"[^>]*>([^<]+)</)
  const rawBrand = brandMatch ? brandMatch[1].trim() : null
  result.brand = normalizeBrand(rawBrand)

  // Title (normalize with brand context)
  const titleMatch =
    html.match(/<h1[^>]*data-testid="product-title"[^>]*>([^<]+)</) ||
    html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/)
  const rawTitle = titleMatch ? titleMatch[1].trim() : null
  result.item_name = normalizeProductName(rawTitle, result.brand as string | null)

  // Image
  const imageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/)
  if (imageMatch) {
    let url = imageMatch[1]
    if (url.includes("thdstatic.com")) {
      url = url.replace(/\/\d+\.jpg(\?.*)?$/, "/400.jpg")
    }
    result.image_url = url
  }

  // Internet SKU from canonical URL
  const canonicalMatch = html.match(/\/p\/[^/]+\/(\d{9,12})/)
  if (canonicalMatch) result.internet_sku = parseInt(canonicalMatch[1], 10)

  // Home Depot URL (use canonical URL for direct product link, not search)
  const urlMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/)
  if (urlMatch) result.home_depot_url = urlMatch[1]

  return result
}

// Scrape a single SKU using ScraperAPI
async function scrapeSKU(sku: string, apiKey: string) {
  const targetUrl = `https://www.homedepot.com/s/${sku}`
  const scraperUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(targetUrl)}&render=true`

  const html = await fetchWithTimeout(scraperUrl, 60000)
  return parseProductPage(html, sku)
}

export async function GET(request: Request) {
  // Authorization check
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Validate env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const scraperApiKey = process.env.SCRAPER_API_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
  }

  if (!scraperApiKey) {
    return NextResponse.json({ error: "Missing SCRAPER_API_KEY" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Get SKUs that need enrichment
  // Priority: SKUs in Penny List that don't have enrichment yet
  const { data: pennyListItems, error: listError } = await supabase
    .from("Penny List")
    .select("home_depot_sku_6_or_10_digits")
    .order("timestamp", { ascending: false })
    .limit(100)

  if (listError) {
    return NextResponse.json(
      { error: "Failed to fetch Penny List", details: listError },
      { status: 500 }
    )
  }

  // Get existing enrichment SKUs
  const { data: existingEnrichment } = await supabase.from("penny_item_enrichment").select("sku")

  const enrichedSkus = new Set((existingEnrichment || []).map((e) => String(e.sku)))

  // Find SKUs that need enrichment
  const skusToEnrich: string[] = []
  for (const item of pennyListItems || []) {
    const sku = String(item.home_depot_sku_6_or_10_digits).replace(/\D/g, "")
    if (sku.length >= 6 && !enrichedSkus.has(sku) && !skusToEnrich.includes(sku)) {
      skusToEnrich.push(sku)
      if (skusToEnrich.length >= BATCH_SIZE) break
    }
  }

  if (skusToEnrich.length === 0) {
    return NextResponse.json({
      message: "No SKUs need enrichment",
      processed: 0,
      success: 0,
      failed: 0,
    })
  }

  // Process SKUs
  const results: Array<{ sku: string; success: boolean; error?: string }> = []
  let successCount = 0
  let failCount = 0

  for (let i = 0; i < skusToEnrich.length; i++) {
    const sku = skusToEnrich[i]

    try {
      const data = await scrapeSKU(sku, scraperApiKey)

      const hasName = typeof data.item_name === "string" && Boolean(data.item_name.trim())
      if (!hasName) {
        results.push({ sku, success: false, error: "Missing item name (scrape failed)" })
        failCount++
        continue
      }
      const { error: upsertError } = await supabase.from("penny_item_enrichment").upsert(
        {
          ...data,
          source: "auto",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "sku" }
      )

      if (upsertError) {
        results.push({ sku, success: false, error: upsertError.message })
        failCount++
      } else {
        results.push({ sku, success: true })
        successCount++
      }
    } catch (e) {
      results.push({ sku, success: false, error: String(e) })
      failCount++
    }

    // Delay between requests
    if (i < skusToEnrich.length - 1) {
      await new Promise((r) => setTimeout(r, DELAY_MS))
    }
  }

  return NextResponse.json({
    message: "Auto-enrichment complete",
    processed: skusToEnrich.length,
    success: successCount,
    failed: failCount,
    results,
  })
}
