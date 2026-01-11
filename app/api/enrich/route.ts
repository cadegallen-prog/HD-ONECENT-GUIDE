import { NextResponse } from "next/server"
import { getSupabaseServiceRoleClient } from "@/lib/supabase/client"
import { validateSku } from "@/lib/sku"

/**
 * POST /api/enrich
 * Receives enrichment data from the bookmarklet and upserts to penny_item_enrichment table.
 * Protected by a simple API key check.
 */

// Simple API key for bookmarklet auth (should be set in env)
const ENRICH_API_KEY = process.env.ENRICH_API_KEY || "penny-enrich-2024"

interface EnrichmentPayload {
  sku: string
  internetNumber?: string
  name?: string
  brand?: string
  model?: string
  upc?: string
  imageUrl?: string
  homeDepotUrl?: string
  retailPrice?: number
}

export async function POST(request: Request) {
  try {
    // Check API key
    const authHeader = request.headers.get("x-api-key")
    if (authHeader !== ENRICH_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as EnrichmentPayload

    // Validate SKU
    const skuCheck = validateSku(body.sku)
    if (skuCheck.error || !skuCheck.normalized) {
      return NextResponse.json({ error: `Invalid SKU: ${skuCheck.error}` }, { status: 400 })
    }

    const sku = skuCheck.normalized

    // Get service role client for write access
    const supabase = getSupabaseServiceRoleClient()
    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Parse internet SKU
    let internetSku: number | null = null
    if (body.internetNumber) {
      const parsed = parseInt(body.internetNumber, 10)
      if (!isNaN(parsed)) internetSku = parsed
    }

    // Parse retail price
    let retailPrice: number | null = null
    if (typeof body.retailPrice === "number" && body.retailPrice > 0) {
      retailPrice = body.retailPrice
    }

    // Upsert enrichment data
    const { error } = await supabase.from("penny_item_enrichment").upsert(
      {
        sku,
        item_name: body.name || null,
        brand: body.brand || null,
        model_number: body.model || null,
        upc: body.upc || null,
        image_url: body.imageUrl || null,
        home_depot_url: body.homeDepotUrl || null,
        internet_sku: internetSku,
        retail_price: retailPrice,
        source: "bookmarklet",
        status: "enriched",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "sku" }
    )

    if (error) {
      console.error("Enrichment upsert error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      sku,
      message: `Enrichment saved for SKU ${sku}`,
    })
  } catch (error) {
    console.error("Enrichment API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

// CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://www.homedepot.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
    },
  })
}
