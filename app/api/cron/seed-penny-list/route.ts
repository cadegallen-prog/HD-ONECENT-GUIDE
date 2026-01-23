import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { STATES } from "@/lib/states"

/**
 * Penny List Seeding Cron Endpoint
 *
 * Automatically seeds quality items from enrichment_staging to create social proof
 * and kickstart user participation.
 *
 * Schedule: Daily at 8:00 AM UTC (defined in vercel.json)
 * Flow:
 *   1. Authorize request via CRON_SECRET
 *   2. Validate environment variables
 *   3. Query enrichment_staging for unseeded quality items
 *   4. Apply quality filters (see filters below)
 *   5. Pick 3 random items
 *   6. For each item:
 *      - Generate synthetic submission (state rotation, today's date)
 *      - Insert to "Penny List" table
 *      - Mark as seeded in seeded_skus table
 *   7. Return summary (seeded count, SKUs)
 *
 * Quality Filters:
 *   - Retail price >= $15
 *   - Must have image_url and item_name
 *   - Popular brands (Milwaukee, DeWalt, Ryobi, etc.) OR retail price >= $30
 *   - Exclude junk (screws, bolts, nuts, washers, wire, nails, etc.)
 *   - Not already seeded
 *
 * State Rotation:
 *   - Cycles through all 50 states sequentially
 *   - Based on current seeded count modulo 50
 *   - Ensures geographic spread
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - CRON_SECRET (optional in development)
 */

interface EnrichmentStagingRow {
  sku: string
  item_name: string | null
  brand: string | null
  barcode_upc: string | null
  image_url: string | null
  product_link: string | null
  internet_number: number | null
  retail_price: string | number | null
}

interface SeededResult {
  sku: string
  name: string
  state: string
  pennyListId: string
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

/**
 * Get the next state in rotation based on current seeded count
 */
function getNextStates(startIndex: number, count: number): string[] {
  const states: string[] = []
  for (let i = 0; i < count; i++) {
    const index = (startIndex + i) % STATES.length
    states.push(STATES[index].code)
  }
  return states
}

function toNumber(value: string | number | null): number | null {
  const parsed = typeof value === "number" ? value : Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/**
 * Query unseeded quality items from enrichment database
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function queryQualityItems(supabase: any): Promise<EnrichmentStagingRow[]> {
  // Popular brands filter (case-insensitive)
  const popularBrands = [
    "milwaukee",
    "dewalt",
    "ryobi",
    "ridgid",
    "makita",
    "kobalt",
    "husky",
    "craftsman",
  ]

  // Junk keywords to exclude (case-insensitive)
  const junkKeywords = [
    "screw",
    "bolt",
    "nut ",
    "washer",
    "wire ",
    "wire,",
    "cable tie",
    "nail",
    "staple",
    "fastener",
    "anchor",
    "hanger",
  ]

  // Build query
  const { data: items, error } = (await supabase
    .from("enrichment_staging")
    .select(
      "sku, item_name, brand, barcode_upc, image_url, product_link, internet_number, retail_price"
    )
    .gte("retail_price", 15.0)
    .not("image_url", "is", null)
    .not("item_name", "is", null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .limit(1000)) as { data: EnrichmentStagingRow[] | null; error: any }

  if (error) {
    console.error("[seed-penny-list] Error querying enrichment table:", error)
    throw new Error(`Failed to query enrichment table: ${error.message}`)
  }

  if (!items || items.length === 0) {
    console.log("[seed-penny-list] No items found in enrichment table")
    return []
  }

  console.log(`[seed-penny-list] Found ${items.length} items with retail_price >= $15`)

  // Query seeded SKUs to exclude
  const { data: seededSkus, error: seededError } = (await supabase
    .from("seeded_skus")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .select("sku")) as { data: { sku: string }[] | null; error: any }

  if (seededError) {
    console.error("[seed-penny-list] Error querying seeded_skus:", seededError)
    throw new Error(`Failed to query seeded_skus: ${seededError.message}`)
  }

  const seededSet = new Set((seededSkus || []).map((row) => row.sku))
  console.log(`[seed-penny-list] Excluding ${seededSet.size} already-seeded SKUs`)

  // Filter items in memory (complex filters)
  const filtered = items.filter((item) => {
    // Must not be already seeded
    if (seededSet.has(item.sku)) return false

    const itemName = (item.item_name || "").toLowerCase()
    const brand = (item.brand || "").toLowerCase()
    const retailPrice = toNumber(item.retail_price) ?? 0

    // Exclude junk items
    if (junkKeywords.some((keyword) => itemName.includes(keyword))) {
      return false
    }

    // Must be either popular brand OR high value ($30+)
    const isPopularBrand = popularBrands.some((brandName) => brand.includes(brandName))
    const isHighValue = retailPrice >= 30.0

    return isPopularBrand || isHighValue
  }) as EnrichmentStagingRow[]

  console.log(`[seed-penny-list] After filtering: ${filtered.length} quality items available`)

  return filtered
}

/**
 * Seed items to Penny List
 */
async function seedItems(
  supabase: any, // eslint-disable-line @typescript-eslint/no-explicit-any
  items: EnrichmentStagingRow[],
  states: string[]
): Promise<SeededResult[]> {
  const results: SeededResult[] = []
  const today = new Date().toISOString().split("T")[0] // YYYY-MM-DD format

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const state = states[i]

    // queryQualityItems() filters out null item_name rows, but keep a runtime guard
    // so Next dev/Playwright builds stay type-safe and resilient to upstream data drift.
    if (!item.item_name) {
      console.error(`[seed-penny-list] Missing item_name for SKU ${item.sku}; skipping`)
      continue
    }

    // Generate random quantity (1-3)
    const quantity = Math.floor(Math.random() * 3) + 1

    // Build payload (same format as user submission)
    const payload = {
      home_depot_sku_6_or_10_digits: item.sku,
      item_name: item.item_name,
      store_city_state: state, // State-only (no city)
      purchase_date: today,
      exact_quantity_found: quantity,
      notes_optional: null, // No notes (blend in completely)
      timestamp: new Date().toISOString(),
      // Enrichment data
      brand: item.brand,
      model_number: null,
      upc: item.barcode_upc,
      image_url: item.image_url,
      home_depot_url: item.product_link,
      internet_sku: item.internet_number,
      retail_price: toNumber(item.retail_price),
    }

    // Insert to Penny List
    const { data: insertedRow, error: insertError } = (await supabase
      .from("Penny List")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert(payload as any)
      .select("id")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .single()) as { data: { id: string } | null; error: any }

    if (insertError || !insertedRow?.id) {
      console.error(`[seed-penny-list] Failed to insert SKU ${item.sku}:`, insertError)
      continue
    }

    const pennyListId = insertedRow.id as string

    // Mark as seeded
    const { error: seededError } = await supabase.from("seeded_skus").insert({
      sku: item.sku,
      penny_list_id: pennyListId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)

    if (seededError) {
      console.error(`[seed-penny-list] Failed to mark SKU ${item.sku} as seeded:`, seededError)
      // Don't continue - we don't want to seed the same SKU twice
      continue
    }

    console.log(`[seed-penny-list] ✅ Seeded: ${item.sku} (${item.item_name}) in ${state}`)

    results.push({
      sku: item.sku,
      name: item.item_name,
      state,
      pennyListId,
    })
  }

  return results
}

export async function GET(request: Request) {
  // 1. Authorization check
  if (!isAuthorized(request)) {
    console.error("[seed-penny-list] Unauthorized request")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[seed-penny-list] Missing Supabase environment variables")
    return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
  }

  console.log("[seed-penny-list] Starting cron job...")

  // 3. Initialize Supabase client with service role
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  try {
    // 4. Get current seeded count for state rotation
    const { count: seededCount, error: countError } = await supabase
      .from("seeded_skus")
      .select("*", { count: "exact", head: true })

    if (countError) {
      console.error("[seed-penny-list] Error getting seeded count:", countError)
      return NextResponse.json(
        { error: "Failed to get seeded count", details: countError.message },
        { status: 500 }
      )
    }

    const rotationIndex = seededCount || 0
    console.log(`[seed-penny-list] Current seeded count: ${rotationIndex}`)

    // 5. Query quality items
    const qualityItems = await queryQualityItems(supabase)

    if (qualityItems.length === 0) {
      console.log("[seed-penny-list] No quality items available to seed")
      return NextResponse.json({
        message: "No quality items available",
        seeded: 0,
        items: [],
      })
    }

    // 6. Pick 3 random items
    const itemsToSeed = qualityItems
      .sort(() => Math.random() - 0.5) // Shuffle
      .slice(0, 3)

    console.log(`[seed-penny-list] Selected ${itemsToSeed.length} items to seed`)

    // 7. Get next states in rotation
    const states = getNextStates(rotationIndex, itemsToSeed.length)
    console.log(`[seed-penny-list] State rotation: ${states.join(", ")}`)

    // 8. Seed items
    const results = await seedItems(supabase, itemsToSeed, states)

    // 9. Return summary
    const summary = {
      message: "Penny List seeding complete",
      seeded: results.length,
      rotationIndex,
      items: results,
    }

    console.log(`[seed-penny-list] Completed: ${results.length} items seeded`)

    return NextResponse.json(summary)
  } catch (error) {
    console.error("[seed-penny-list] Unexpected error:", error)
    return NextResponse.json(
      {
        error: "Seeding failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}
