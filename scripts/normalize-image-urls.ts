#!/usr/bin/env node

/**
 * Normalize all image URLs in penny_item_enrichment to use -64_600 variant
 *
 * Image URL Strategy:
 * - Database: All URLs stored as -64_600.jpg (canonical source, high quality, reasonable file size)
 * - SKU pages (full-size display): Use 600px as-is (~60-80 KB)
 * - Related items cards (medium): Downconvert to 400px (~40-60 KB)
 * - Penny List (72px thumbnails): Downconvert to 300px (~20-30 KB)
 *
 * Usage:
 *   npx tsx scripts/normalize-image-urls.ts
 *
 * This script:
 * 1. Fetches all items with imageUrl from penny_item_enrichment
 * 2. Converts all variants to -64_600.jpg (sweet spot: crisp + reasonable size)
 * 3. Updates only items that have a different URL
 * 4. Reports before/after stats
 */

import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

/**
 * Normalize image URL to -64_600 variant
 */
function normalizeImageUrl(url: string | null): string | null {
  if (!url) return null

  const trimmed = url.trim()

  let hostname: string
  try {
    const parsedUrl = new URL(trimmed)
    hostname = parsedUrl.hostname
  } catch {
    // If the URL cannot be parsed, leave it unchanged
    return trimmed
  }

  const isThdstaticHost =
    hostname === "thdstatic.com" || hostname.endsWith(".thdstatic.com")
  if (!isThdstaticHost) return trimmed

  // Replace any -64_XXX variant with -64_600.jpg
  const normalized = trimmed.replace(/-64_\d+\.jpg$/i, "-64_600.jpg")
  return normalized === trimmed ? trimmed : normalized
}

async function main() {
  // Normalize both tables: penny_list_public (main) and penny_item_enrichment (metadata)
  await normalizeTable("penny_list_public", "id")
  await normalizeTable("penny_item_enrichment", "sku")

  console.log(`\n📐 Image strategy:`)
  console.log(`   - Database: -64_600.jpg (canonical)`)
  console.log(`   - SKU pages: 600px (full-size)`)
  console.log(`   - Related items: 400px (downconverted)`)
  console.log(`   - Penny List: 300px (downconverted)`)
}

async function normalizeTable(tableName: string, pkColumn: string) {
  console.log(`\n🔍 Fetching all items from ${tableName}...`)

  const { data, error } = await supabase
    .from(tableName)
    .select(`${pkColumn}, image_url`)
    .not("image_url", "is", null)

  if (error) {
    console.error(`❌ Error fetching from ${tableName}:`, error.message)
    return
  }

  if (!data || data.length === 0) {
    console.log(`ℹ️  No items found with imageUrl in ${tableName}`)
    return
  }

  console.log(`📦 Found ${data.length} items with imageUrl in ${tableName}\n`)

  let changed = 0
  let unchanged = 0
  const updates: Array<{ pk: string; old: string; new: string }> = []

  for (const item of data) {
    const normalized = normalizeImageUrl(item.image_url)

    if (normalized === item.image_url) {
      unchanged++
    } else {
      changed++
      updates.push({
        pk: item[pkColumn] as string,
        old: item.image_url,
        new: normalized!,
      })
    }
  }

  console.log(`📊 Analysis:`)
  console.log(`   ✅ Already normalized: ${unchanged}`)
  console.log(`   🔄 Need updating: ${changed}\n`)

  if (changed === 0) {
    console.log("✨ All images are already normalized to -64_600!")
    return
  }

  // Show sample of changes
  if (updates.length > 0) {
    console.log(`📝 Sample changes (first 3):`)
    updates.slice(0, 3).forEach((u) => {
      console.log(`   ${pkColumn.toUpperCase()} ${u.pk}:`)
      console.log(`     OLD: ${u.old}`)
      console.log(`     NEW: ${u.new}\n`)
    })
  }

  // Perform updates
  console.log(`⏳ Updating ${changed} items...`)

  let success = 0
  let failed = 0

  for (const update of updates) {
    const { error: updateError } = await supabase
      .from(tableName)
      .update({ image_url: update.new })
      .eq(pkColumn, update.pk)

    if (updateError) {
      console.error(`   ❌ ${pkColumn} ${update.pk}: ${updateError.message}`)
      failed++
    } else {
      success++
    }
  }

  console.log(`\n✅ Complete for ${tableName}!`)
  console.log(`   Updated: ${success}`)
  console.log(`   Failed: ${failed}`)
  console.log(`   Total images: ${data.length}`)
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
