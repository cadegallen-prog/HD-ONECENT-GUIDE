import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { sendWeeklyDigest, delay } from "@/lib/email-sender"

/**
 * Weekly Email Digest Cron Endpoint
 *
 * Sends penny list updates to all active subscribers every Sunday at 8 AM UTC.
 *
 * Schedule: Every Sunday at 8:00 AM UTC (defined in vercel.json)
 * Flow:
 *   1. Authorize request via CRON_SECRET
 *   2. Validate environment variables
 *   3. Query active subscribers from email_subscribers table
 *   4. Query penny items from last 7 days
 *   5. Process and aggregate items (group by SKU, calculate stats)
 *   6. Send emails via Resend API
 *   7. Return summary (sent/failed counts)
 *
 * Required env vars:
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - RESEND_API_KEY
 *   - CRON_SECRET
 *   - NEXT_PUBLIC_SITE_URL
 */

interface PennyListRow {
  id: string
  home_depot_sku_6_or_10_digits: string
  item_name: string
  brand: string | null
  image_url: string | null
  home_depot_url: string | null
  store_city_state: string
  purchase_date: string
  timestamp: string
  retail_price: string | null
  internet_sku: string | null
}

interface ProcessedItem {
  sku: string
  name: string
  brand: string | null
  imageUrl: string | null
  homeDepotUrl: string | null
  retailPrice: string | null
  locations: Record<string, number>
  reportCount: number
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
 * Process and aggregate penny items by SKU
 *
 * Groups items by SKU, aggregates locations (state -> count), and sorts by report count
 */
function processItems(rawItems: PennyListRow[]): ProcessedItem[] {
  const itemMap = new Map<string, ProcessedItem>()

  for (const item of rawItems) {
    const sku = item.home_depot_sku_6_or_10_digits || item.internet_sku || "UNKNOWN"

    // Extract state from "City, ST" format
    const stateParts = item.store_city_state?.split(",")
    const state = stateParts && stateParts.length > 1 ? stateParts[1].trim() : "Unknown"

    if (itemMap.has(sku)) {
      // Existing SKU - increment location count and report count
      const existing = itemMap.get(sku)!
      existing.locations[state] = (existing.locations[state] || 0) + 1
      existing.reportCount += 1
    } else {
      // New SKU - create entry
      itemMap.set(sku, {
        sku,
        name: item.item_name || "Unknown Item",
        brand: item.brand,
        imageUrl: item.image_url,
        homeDepotUrl: item.home_depot_url,
        retailPrice: item.retail_price,
        locations: { [state]: 1 },
        reportCount: 1,
      })
    }
  }

  // Convert to array and sort by report count (most popular first)
  return Array.from(itemMap.values()).sort((a, b) => b.reportCount - a.reportCount)
}

/**
 * Calculate summary statistics
 */
function calculateStats(items: ProcessedItem[]) {
  const itemCount = items.length
  const reportCount = items.reduce((sum, item) => sum + item.reportCount, 0)

  // Find most active state
  const stateCounts = new Map<string, number>()
  for (const item of items) {
    for (const [state, count] of Object.entries(item.locations)) {
      stateCounts.set(state, (stateCounts.get(state) || 0) + count)
    }
  }

  let mostActiveState = "Unknown"
  let maxCount = 0
  for (const [state, count] of stateCounts.entries()) {
    if (count > maxCount) {
      maxCount = count
      mostActiveState = state
    }
  }

  return {
    itemCount,
    reportCount,
    mostActiveState: `${mostActiveState} (${maxCount})`,
  }
}

export async function GET(request: Request) {
  // CRON PAUSED (2026-02-03): User requested hold on emails until content validation.
  // Set FORCE_RUN_DIGEST=true in .env to bypass this pause for testing.
  if (process.env.FORCE_RUN_DIGEST === "true") {
    return _original_GET(request)
  }

  return NextResponse.json({
    status: "paused",
    message: "Weekly digest cron is paused pending content review. See SESSION_LOG.",
  })
}

// Renamed from GET to pause execution while preserving type safety
async function _original_GET(request: Request) {
  // 1. Authorization check
  if (!isAuthorized(request)) {
    console.error("[send-weekly-digest] Unauthorized request")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // 2. Validate environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const resendApiKey = process.env.RESEND_API_KEY
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("[send-weekly-digest] Missing Supabase environment variables")
    return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
  }

  if (!resendApiKey) {
    console.error("[send-weekly-digest] Missing RESEND_API_KEY")
    return NextResponse.json(
      { error: "Missing RESEND_API_KEY environment variable" },
      { status: 500 }
    )
  }

  if (!siteUrl) {
    console.error("[send-weekly-digest] Missing NEXT_PUBLIC_SITE_URL")
    return NextResponse.json(
      { error: "Missing NEXT_PUBLIC_SITE_URL environment variable" },
      { status: 500 }
    )
  }

  console.log("[send-weekly-digest] Starting cron job...")

  // 3. Initialize Supabase client with service role
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  // 4. Query active subscribers
  const { data: subscribers, error: subscribersError } = await supabase
    .from("email_subscribers")
    .select("email, unsubscribe_token")
    .eq("is_active", true)

  if (subscribersError) {
    console.error("[send-weekly-digest] Error fetching subscribers:", subscribersError)
    return NextResponse.json(
      { error: "Failed to fetch subscribers", details: subscribersError.message },
      { status: 500 }
    )
  }

  if (!subscribers || subscribers.length === 0) {
    console.log("[send-weekly-digest] No active subscribers found")
    return NextResponse.json({
      message: "No active subscribers",
      sent: 0,
      failed: 0,
      totalSubscribers: 0,
      itemsIncluded: 0,
    })
  }

  console.log(`[send-weekly-digest] Found ${subscribers.length} active subscribers`)

  // 5. Query penny items from last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: rawItems, error: itemsError } = await supabase
    .from("Penny List")
    .select(
      `
      id,
      home_depot_sku_6_or_10_digits,
      item_name,
      brand,
      image_url,
      home_depot_url,
      store_city_state,
      purchase_date,
      timestamp,
      retail_price,
      internet_sku
    `
    )
    .gte("timestamp", sevenDaysAgo.toISOString())
    .order("timestamp", { ascending: false })
    .limit(100)

  if (itemsError) {
    console.error("[send-weekly-digest] Error fetching penny items:", itemsError)
    return NextResponse.json(
      { error: "Failed to fetch penny items", details: itemsError.message },
      { status: 500 }
    )
  }

  console.log(`[send-weekly-digest] Found ${rawItems?.length || 0} raw penny items`)

  // 6. Process items (group, aggregate, sort)
  const processedItems = processItems(rawItems || [])
  const topItems = processedItems.slice(0, 15)
  const stats = calculateStats(processedItems)

  console.log(
    `[send-weekly-digest] Processed ${processedItems.length} unique items, sending top ${topItems.length}`
  )
  console.log(`[send-weekly-digest] Stats:`, stats)

  // 7. Send emails to all subscribers
  let sentCount = 0
  let failCount = 0
  const results: Array<{ email: string; success: boolean; error?: string; messageId?: string }> = []

  // Rate limiting: Resend free tier = 100 emails/day
  // Add warning if approaching limit
  if (subscribers.length > 95) {
    console.warn(
      `[send-weekly-digest] WARNING: ${subscribers.length} subscribers approaching Resend free tier limit (100/day)`
    )
  }

  for (const subscriber of subscribers) {
    try {
      const unsubscribeUrl = `${siteUrl}/api/unsubscribe?token=${subscriber.unsubscribe_token}`

      const result = await sendWeeklyDigest(
        resendApiKey,
        subscriber.email,
        topItems,
        stats,
        unsubscribeUrl,
        sevenDaysAgo
      )

      if (result.success) {
        sentCount++
        results.push({
          email: subscriber.email,
          success: true,
          messageId: result.messageId,
        })
      } else {
        failCount++
        results.push({
          email: subscriber.email,
          success: false,
          error: result.error,
        })
        console.error(`[send-weekly-digest] Failed to send to ${subscriber.email}:`, result.error)
      }

      // Rate limiting: 100ms delay between emails (10 emails/sec max)
      await delay(100)
    } catch (error) {
      failCount++
      const errorMsg = error instanceof Error ? error.message : String(error)
      results.push({
        email: subscriber.email,
        success: false,
        error: errorMsg,
      })
      console.error(`[send-weekly-digest] Unexpected error sending to ${subscriber.email}:`, error)
    }
  }

  // 8. Return summary
  const summary = {
    message: "Weekly digest sent",
    sent: sentCount,
    failed: failCount,
    totalSubscribers: subscribers.length,
    itemsIncluded: topItems.length,
    stats,
    results,
  }

  console.log(`[send-weekly-digest] Completed: ${sentCount} sent, ${failCount} failed`)

  return NextResponse.json(summary)
}
