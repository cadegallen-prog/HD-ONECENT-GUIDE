#!/usr/bin/env tsx
/**
 * Enrichment Staging Consumption Metrics
 *
 * Shows how effectively the enrichment_staging table is being consumed
 * and what value it's providing (fields filled, SerpAPI cost savings, etc).
 *
 * Usage:
 *   tsx scripts/enrichment-metrics.ts
 *   npm run metrics:enrichment
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error("Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)")
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

// SerpAPI pricing: $50/1000 credits = $0.05 per credit
// Each enrichment requires 2-3 credits (we'll use 2.5 as average)
const SERPAPI_CREDITS_PER_ITEM = 2.5
const SERPAPI_COST_PER_CREDIT = 0.05
const SERPAPI_COST_PER_ITEM = SERPAPI_CREDITS_PER_ITEM * SERPAPI_COST_PER_CREDIT // $0.125

interface FieldStats {
  [key: string]: number
}

async function main() {
  console.log("=".repeat(60))
  console.log("ENRICHMENT STAGING CONSUMPTION METRICS")
  console.log("=".repeat(60))
  console.log()

  // 1. Penny List totals
  const pennyRes = await supabase.from("Penny List").select("*", { count: "exact", head: true })

  if (pennyRes.error) {
    throw new Error(`Failed to count Penny List: ${pennyRes.error.message}`)
  }

  const totalPennyItems = pennyRes.count || 0
  console.log(`📊 PENNY LIST OVERVIEW`)
  console.log(`   Total items: ${totalPennyItems}`)
  console.log()

  // 2. Items enriched from staging
  const enrichedRes = await supabase
    .from("Penny List")
    .select("id, timestamp, enrichment_provenance")
    .not("enrichment_provenance", "is", null)

  if (enrichedRes.error) {
    throw new Error(`Failed to fetch enriched items: ${enrichedRes.error.message}`)
  }

  const enrichedItems = enrichedRes.data || []
  const stagingEnrichedItems = enrichedItems.filter((item: any) => {
    return item.enrichment_provenance?._staging != null
  })

  const enrichmentRate =
    totalPennyItems > 0 ? ((stagingEnrichedItems.length / totalPennyItems) * 100).toFixed(1) : "0.0"

  console.log(`✅ STAGING ENRICHMENT SUCCESS`)
  console.log(`   Items enriched from staging: ${stagingEnrichedItems.length}`)
  console.log(`   Enrichment rate: ${enrichmentRate}% of Penny List`)
  console.log()

  // 3. Match type breakdown
  const matchTypes: { [key: string]: number } = {}
  stagingEnrichedItems.forEach((item: any) => {
    const matchType = item.enrichment_provenance?._staging?.match_type || "unknown"
    matchTypes[matchType] = (matchTypes[matchType] || 0) + 1
  })

  console.log(`🎯 MATCH TYPE BREAKDOWN`)
  Object.entries(matchTypes)
    .sort((a, b) => b[1] - a[1])
    .forEach(([type, count]) => {
      const pct = ((count / stagingEnrichedItems.length) * 100).toFixed(1)
      console.log(`   ${type.padEnd(20)} ${count.toString().padStart(5)} (${pct}%)`)
    })
  console.log()

  // 4. Fields filled statistics
  const fieldsToCheck = [
    "item_name",
    "brand",
    "image_url",
    "home_depot_url",
    "barcode_upc",
    "internet_sku",
  ]

  const fieldsFilled: FieldStats = {}
  const confirmedAbsent: FieldStats = {}

  stagingEnrichedItems.forEach((item: any) => {
    const prov = item.enrichment_provenance
    fieldsToCheck.forEach((field) => {
      if (prov?.[field]?.source === "staging") {
        fieldsFilled[field] = (fieldsFilled[field] || 0) + 1

        if (prov[field].confirmed_absent === true) {
          confirmedAbsent[field] = (confirmedAbsent[field] || 0) + 1
        }
      }
    })
  })

  console.log(`📝 FIELDS FILLED BY STAGING`)
  fieldsToCheck.forEach((field) => {
    const count = fieldsFilled[field] || 0
    const absent = confirmedAbsent[field] || 0
    const pct =
      stagingEnrichedItems.length > 0
        ? ((count / stagingEnrichedItems.length) * 100).toFixed(1)
        : "0.0"

    let display = `   ${field.padEnd(20)} ${count.toString().padStart(5)} (${pct}%)`
    if (absent > 0) {
      display += ` [${absent} confirmed absent]`
    }
    console.log(display)
  })
  console.log()

  // 5. Consumption timeline (recent activity)
  const now = Date.now()
  const oneDay = 24 * 60 * 60 * 1000
  const sevenDays = 7 * oneDay
  const thirtyDays = 30 * oneDay

  const consumedLast24h = stagingEnrichedItems.filter((item: any) => {
    const timestamp = new Date(item.timestamp).getTime()
    return now - timestamp <= oneDay
  }).length

  const consumedLast7d = stagingEnrichedItems.filter((item: any) => {
    const timestamp = new Date(item.timestamp).getTime()
    return now - timestamp <= sevenDays
  }).length

  const consumedLast30d = stagingEnrichedItems.filter((item: any) => {
    const timestamp = new Date(item.timestamp).getTime()
    return now - timestamp <= thirtyDays
  }).length

  console.log(`📈 CONSUMPTION TIMELINE`)
  console.log(`   Last 24 hours:  ${consumedLast24h} items`)
  console.log(`   Last 7 days:    ${consumedLast7d} items`)
  console.log(`   Last 30 days:   ${consumedLast30d} items`)
  console.log()

  // 6. Staging queue status
  const stagingRes = await supabase
    .from("enrichment_staging")
    .select("*", { count: "exact", head: true })

  if (stagingRes.error) {
    throw new Error(`Failed to count enrichment_staging: ${stagingRes.error.message}`)
  }

  const stagingQueueSize = stagingRes.count || 0

  console.log(`📦 STAGING QUEUE STATUS`)
  console.log(`   Items waiting in queue: ${stagingQueueSize}`)

  const utilizationRate =
    stagingQueueSize + stagingEnrichedItems.length > 0
      ? (
          (stagingEnrichedItems.length / (stagingQueueSize + stagingEnrichedItems.length)) *
          100
        ).toFixed(1)
      : "0.0"

  console.log(`   Utilization rate: ${utilizationRate}%`)
  console.log(`   (consumed / (consumed + waiting))`)
  console.log()

  // 7. Cost savings estimate
  const itemsEnrichedFromStaging = stagingEnrichedItems.length
  const creditsAvoided = itemsEnrichedFromStaging * SERPAPI_CREDITS_PER_ITEM
  const estimatedSavings = itemsEnrichedFromStaging * SERPAPI_COST_PER_ITEM

  console.log(`💰 ESTIMATED COST SAVINGS`)
  console.log(`   Items enriched from staging: ${itemsEnrichedFromStaging}`)
  console.log(`   SerpAPI credits avoided: ${creditsAvoided.toFixed(0)} credits`)
  console.log(`   Estimated savings: $${estimatedSavings.toFixed(2)}`)
  console.log(
    `   (@ ${SERPAPI_CREDITS_PER_ITEM} credits/item × $${SERPAPI_COST_PER_CREDIT}/credit = $${SERPAPI_COST_PER_ITEM}/item)`
  )
  console.log()

  // 8. Summary verdict
  console.log("=".repeat(60))
  console.log("SUMMARY")
  console.log("=".repeat(60))

  if (stagingEnrichedItems.length === 0) {
    console.log("⚠️  No items enriched from staging yet")
    console.log("   Staging warmer may not have run, or no finds submitted yet")
  } else if (parseFloat(enrichmentRate) >= 80) {
    console.log("✅ Staging enrichment is HIGHLY EFFECTIVE")
    console.log(
      `   ${enrichmentRate}% of items enriched, saving $${estimatedSavings.toFixed(2)} in API costs`
    )
  } else if (parseFloat(enrichmentRate) >= 50) {
    console.log("✅ Staging enrichment is WORKING WELL")
    console.log(`   ${enrichmentRate}% of items enriched, providing solid value`)
  } else if (parseFloat(enrichmentRate) >= 20) {
    console.log("⚠️  Staging enrichment has MODERATE impact")
    console.log(`   ${enrichmentRate}% enrichment rate - consider running warmer more frequently`)
  } else {
    console.log("⚠️  Staging enrichment has LOW impact")
    console.log(
      `   ${enrichmentRate}% enrichment rate - may need more staging data or better matching`
    )
  }
  console.log()
}

main().catch((err) => {
  console.error("Error:", err.message)
  process.exit(1)
})
