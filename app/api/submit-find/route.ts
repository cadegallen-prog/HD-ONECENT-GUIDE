import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateSku } from "@/lib/sku"
import { getSupabaseClient } from "@/lib/supabase/client"

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
    const payload = {
      item_name: body.itemName.trim(),
      home_depot_sku_6_or_10_digits: normalizedSku,
      store_city_state: location,
      purchase_date: body.dateFound || null,
      exact_quantity_found: qty ?? null,
      notes_optional: body.notes?.trim() || null,
      timestamp: new Date().toISOString(),
    }

    const { error } = await supabase.from("Penny List").insert(payload)

    if (error) {
      console.error("Supabase insert error:", error)
      return NextResponse.json(
        { error: "Failed to submit find. Please try again." },
        { status: 500 }
      )
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
