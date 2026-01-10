import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateSku } from "@/lib/sku"
import { getSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase/client"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5

type RateBucket = number[]
const rateLimitMap: Map<string, RateBucket> =
  (globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit ??
  new Map()
;(globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit =
  rateLimitMap

const submissionSchema = z
  .object({
    itemName: z.string().min(1).max(75),
    sku: z.string(),
    storeCity: z.string().optional(),
    storeState: z.string().min(2).max(2),
    dateFound: z.string(),
    quantity: z.string().optional(),
    notes: z.string().optional(),
    website: z.string().optional(), // honeypot
  })
  .strip() // Strip any extra fields (photoUrl/upload attempts are ignored).

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (request as any).ip || "unknown"
}
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const bucket = rateLimitMap.get(ip) ?? []
  const recent = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  if (recent.length >= RATE_LIMIT_MAX) return false
  recent.push(now)
  rateLimitMap.set(ip, recent)
  return true
}

type SupabaseClientLike = ReturnType<typeof getSupabaseClient>

function getSupabaseServerClient(): SupabaseClientLike {
  const override = (globalThis as { __supabaseClientOverride?: SupabaseClientLike })
    .__supabaseClientOverride
  if (override) return override
  return getSupabaseClient()
}

type EnrichmentData = {
  item_name?: string | null
  brand?: string | null
  model_number?: string | null
  upc?: string | null
  image_url?: string | null
  home_depot_url?: string | null
  internet_sku?: number | null
  retail_price?: number | null
}

/**
 * Lookup enrichment data cascade:
 * 1. Check penny_item_enrichment table
 * 2. If not found, check existing Penny List rows with same SKU
 * 3. If still not found, return null
 *
 * @returns {enrichment data, should delete enrichment row}
 */
async function lookupEnrichment(
  supabase: SupabaseClientLike,
  sku: string
): Promise<{ data: EnrichmentData | null; deleteEnrichmentRow: boolean }> {
  // Safety: if test overrides provide a minimal client without select/eq chaining, skip enrichment
  if (!supabase || typeof supabase.from !== "function") {
    return { data: null, deleteEnrichmentRow: false }
  }
  try {
    // Step 1: Check penny_item_enrichment table
    const { data: enrichmentRow, error: enrichmentError } = await supabase
      .from("penny_item_enrichment")
      .select(
        "item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price"
      )
      .eq("sku", sku)
      .maybeSingle()

    if (!enrichmentError && enrichmentRow) {
      return { data: enrichmentRow as EnrichmentData, deleteEnrichmentRow: true }
    }

    // Step 2: Check existing Penny List rows with same SKU
    const { data: existingRows, error: existingError } = await supabase
      .from("Penny List")
      .select(
        "item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price"
      )
      .eq("home_depot_sku_6_or_10_digits", sku)
      .limit(1)
      .maybeSingle()

    if (!existingError && existingRows) {
      return { data: existingRows as EnrichmentData, deleteEnrichmentRow: false }
    }
  } catch (error) {
    // Skip enrichment if client is minimally mocked (tests) or query builder is incomplete
    console.warn("Error during enrichment lookup, skipping enrichment:", error)
  }

  // Step 3: No enrichment data found
  return { data: null, deleteEnrichmentRow: false }
}

/**
 * Delete enrichment row after successful insert (using service role to bypass RLS)
 */
async function deleteEnrichmentRow(sku: string): Promise<void> {
  try {
    const serviceClient = getSupabaseServiceRoleClient()
    await serviceClient.from("penny_item_enrichment").delete().eq("sku", sku)
  } catch (error) {
    // Log warning but don't fail the request - enrichment deletion is non-critical
    console.warn(`Failed to delete enrichment row for SKU ${sku}:`, error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many submissions from this device. Please try again later." },
        { status: 429 }
      )
    }

    const parsed = submissionSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Missing or invalid required fields. Please check the form and try again." },
        { status: 400 }
      )
    }

    const body = parsed.data

    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 })
    }

    const skuCheck = validateSku(body.sku)
    if (skuCheck.error) {
      return NextResponse.json({ error: skuCheck.error }, { status: 400 })
    }

    const normalizedSku = skuCheck.normalized

    // Block obvious test/spam SKUs
    const spamPatterns = [
      /^1{10}$/, // 1111111111
      /^(12345678|1234567890|123456789|12345|123456)$/, // Sequential
      /^10{9,}$/, // 1000000000, 1000000001, etc.
      /^(\d)\1{5,}$/, // 6+ repeating digits
    ]

    if (spamPatterns.some((pattern) => pattern.test(normalizedSku.toString()))) {
      return NextResponse.json(
        {
          error:
            "This SKU appears to be invalid. Please double-check and enter a real Home Depot SKU.",
        },
        { status: 400 }
      )
    }

    // Validate quantity (optional, but if provided must be 1-99)
    let qty: number | undefined
    if (body.quantity && body.quantity.trim().length > 0) {
      qty = Number.parseInt(body.quantity, 10)
      if (Number.isNaN(qty) || qty < 1 || qty > 99) {
        return NextResponse.json(
          { error: "Quantity must be a number between 1 and 99." },
          { status: 400 }
        )
      }
    }

    // Validate state is 2 characters
    if (body.storeState.length !== 2) {
      return NextResponse.json({ error: "State must be a 2‑letter code." }, { status: 400 })
    }

    // Format location as "City, State" for Google Sheets
    const city = body.storeCity?.trim() || ""
    const state = body.storeState.toUpperCase()
    const location = city ? `${city}, ${state}` : state

    const supabase = getSupabaseServerClient()

    // Lookup enrichment data (cascade: enrichment table → existing rows → null)
    const lookupResult = await lookupEnrichment(supabase, normalizedSku)
    const { data: enrichment, deleteEnrichmentRow: shouldDeleteEnrichment } = lookupResult

    // Build payload with enrichment data merged in (only include enrichment fields when present)
    const payload: Record<string, unknown> = {
      // User-provided canonical data (always from user input)
      home_depot_sku_6_or_10_digits: normalizedSku,
      store_city_state: location,
      purchase_date: body.dateFound || null,
      exact_quantity_found: qty ?? null,
      notes_optional: body.notes?.trim() || null,
      timestamp: new Date().toISOString(),

      // Enrichment name override (preferred) or user-provided item name
      item_name: enrichment?.item_name?.trim() || body.itemName.trim(),
    }

    if (enrichment) {
      if (enrichment.brand?.trim()) payload.brand = enrichment.brand.trim()
      if (enrichment.model_number?.trim()) payload.model_number = enrichment.model_number.trim()
      if (enrichment.upc?.trim()) payload.upc = enrichment.upc.trim()
      if (typeof enrichment.retail_price === "number")
        payload.retail_price = enrichment.retail_price
      if (enrichment.image_url?.trim()) payload.image_url = enrichment.image_url.trim()
      if (enrichment.home_depot_url?.trim())
        payload.home_depot_url = enrichment.home_depot_url.trim()
      if (typeof enrichment.internet_sku === "number")
        payload.internet_sku = enrichment.internet_sku
    }

    const { error } = await supabase.from("Penny List").insert(payload)

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to submit find. Please try again." },
        { status: 500 }
      )
    }

    // Delete enrichment row after successful insert (if it came from enrichment table)
    if (shouldDeleteEnrichment) {
      await deleteEnrichmentRow(normalizedSku)
    }

    return NextResponse.json({
      success: true,
      message: "Thanks — your find is now on the Penny List.",
    })
  } catch (error) {
    console.error("Error submitting find:", error)
    return NextResponse.json({ error: "Failed to submit find. Please try again." }, { status: 500 })
  }
}
