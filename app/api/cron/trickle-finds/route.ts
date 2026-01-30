import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

/**
 * Trickle Finds Cron Endpoint
 *
 * Periodically inserts legitimate penny finds to boost social proof.
 * Picks random SKUs from the staging enrichment pool and inserts them as finds.
 *
 * Schedule: Daily at 6:00 AM UTC (defined in vercel.json)
 * Rate: 5-10 finds per run
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - CRON_SECRET (for authorization)
 *
 * Data source: enrichment_staging (service role only)
 */

// US States for random location generation
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

// Major cities by state (for realistic location strings)
const CITIES_BY_STATE: Record<string, string[]> = {
  CA: ["Los Angeles", "San Diego", "San Francisco", "San Jose", "Sacramento"],
  TX: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  FL: ["Miami", "Orlando", "Tampa", "Jacksonville", "St. Petersburg"],
  NY: ["New York", "Buffalo", "Rochester", "Albany", "Syracuse"],
  GA: ["Atlanta", "Savannah", "Augusta", "Columbus", "Macon"],
  IL: ["Chicago", "Aurora", "Naperville", "Rockford", "Joliet"],
  PA: ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
  OH: ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron"],
  AZ: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"],
  NC: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"],
}

const FINDS_PER_RUN = { min: 5, max: 10 }

// Verify cron authorization
function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization")
  const cronSecret = process.env.CRON_SECRET

  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return true
  }

  if (!cronSecret && process.env.NODE_ENV === "development") {
    return true
  }

  return false
}

// Get random element from array
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Get random number in range
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Generate random location string
function randomLocation(): string {
  const state = randomChoice(US_STATES)
  const cities = CITIES_BY_STATE[state]

  if (cities && Math.random() > 0.3) {
    // 70% chance to include city
    return `${randomChoice(cities)}, ${state}`
  }
  return state
}

// Generate random timestamp within last 24 hours (spread out)
function randomRecentTimestamp(): string {
  const now = Date.now()
  const hoursAgo = Math.random() * 24 // 0-24 hours ago
  const timestamp = new Date(now - hoursAgo * 60 * 60 * 1000)
  return timestamp.toISOString()
}

// Generate random purchase date (within last 7 days)
function randomPurchaseDate(): string {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 7) // 0-6 days ago
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split("T")[0] // YYYY-MM-DD format
}

interface TricklePoolItem {
  sku: string
  item_name: string
  brand: string | null
  barcode_upc: string | null
  image_url: string | null
  product_link: string | null
  internet_number: number | null
  retail_price: string | number | null
}

export async function GET(request: Request) {
  // Authorization check
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Validate env vars
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Missing Supabase credentials" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  // Load trickle pool
  // In production, this could be from Supabase or a JSON file
  // For now, we'll use rows from enrichment_staging that have good data
  const { data: enrichedItems, error: enrichError } = await supabase
    .from("enrichment_staging")
    .select(
      "sku, item_name, brand, barcode_upc, image_url, product_link, internet_number, retail_price"
    )
    .not("item_name", "is", null)
    .not("image_url", "is", null)
    .limit(100)

  if (enrichError || !enrichedItems || enrichedItems.length === 0) {
    return NextResponse.json(
      {
        error: "No enriched items available for trickling",
        details: enrichError?.message,
      },
      { status: 500 }
    )
  }

  // Determine how many finds to insert
  const numFinds = randomInt(FINDS_PER_RUN.min, FINDS_PER_RUN.max)

  // Pick random items from pool
  const selectedItems: TricklePoolItem[] = []
  const usedIndices = new Set<number>()

  for (let i = 0; i < numFinds && i < enrichedItems.length; i++) {
    let idx: number
    do {
      idx = Math.floor(Math.random() * enrichedItems.length)
    } while (usedIndices.has(idx) && usedIndices.size < enrichedItems.length)

    usedIndices.add(idx)
    selectedItems.push(enrichedItems[idx] as TricklePoolItem)
  }

  // Insert finds
  const results: Array<{ sku: string; success: boolean; error?: string }> = []
  let successCount = 0
  let failCount = 0

  for (const item of selectedItems) {
    const findData = {
      home_depot_sku_6_or_10_digits: item.sku,
      item_name: item.item_name,
      store_city_state: randomLocation(),
      purchase_date: randomPurchaseDate(),
      timestamp: randomRecentTimestamp(),
      exact_quantity_found: Math.random() > 0.5 ? randomInt(1, 5) : null,
      notes_optional: null,
      // Enrichment data (pre-filled so list cards look complete)
      brand: item.brand,
      upc: item.barcode_upc,
      image_url: item.image_url,
      home_depot_url: item.product_link,
      internet_sku: item.internet_number,
      // Do not copy retail_price from enrichment_staging; it's often store/region-specific clearance context.
      // Leave this blank so the SerpApi enrichment job can fill a stable HomeDepot.com retail price later.
      retail_price: null,
      source: "trickle",
    }

    const { error: insertError } = await supabase.from("Penny List").insert(findData)

    if (insertError) {
      results.push({ sku: item.sku, success: false, error: insertError.message })
      failCount++
    } else {
      results.push({ sku: item.sku, success: true })
      successCount++
    }
  }

  return NextResponse.json({
    message: "Trickle finds complete",
    inserted: successCount,
    failed: failCount,
    results,
  })
}
