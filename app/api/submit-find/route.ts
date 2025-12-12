import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateSku } from "@/lib/sku"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 5

type RateBucket = number[]
const rateLimitMap: Map<string, RateBucket> =
  (globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit ??
  new Map()
;(globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit =
  rateLimitMap

const submissionSchema = z.object({
  itemName: z.string().min(1).max(75),
  sku: z.string(),
  storeCity: z.string().optional(),
  storeState: z.string().min(2).max(2),
  dateFound: z.string(),
  quantity: z.string().min(1),
  notes: z.string().optional(),
  website: z.string().optional(), // honeypot
})

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

    // Validate quantity (must be a number between 1 and 99)
    const qty = Number.parseInt(body.quantity, 10)
    if (Number.isNaN(qty) || qty < 1 || qty > 99) {
      return NextResponse.json(
        { error: "Quantity must be a number between 1 and 99." },
        { status: 400 }
      )
    }

    // Validate state is 2 characters
    if (body.storeState.length !== 2) {
      return NextResponse.json({ error: "State must be a 2‑letter code." }, { status: 400 })
    }

    // Format location as "City, State" for Google Sheets
    const city = body.storeCity?.trim() || ""
    const state = body.storeState.toUpperCase()
    const location = city ? `${city}, ${state}` : state

    // Prepare payload for Google Apps Script
    const sheetPayload = {
      "Item Name": body.itemName.trim(),
      SKU: normalizedSku,
      "Store (City, State)": location,
      "Purchase Date": body.dateFound,
      "Exact Quantity Found": String(qty),
      "Notes (optional)": body.notes?.trim() || "",
    }

    const appsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL
    if (!appsScriptUrl) {
      console.error("GOOGLE_APPS_SCRIPT_URL is not configured")
      return NextResponse.json(
        { error: "Submission service is not configured. Please try again later." },
        { status: 500 }
      )
    }

    const scriptResponse = await fetch(appsScriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(sheetPayload),
    })

    if (!scriptResponse.ok) {
      console.error("Google Apps Script error:", await scriptResponse.text())
      return NextResponse.json(
        { error: "Failed to submit find. Please try again." },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: "Thanks — your find is in the review queue.",
    })
  } catch (error) {
    console.error("Error submitting find:", error)
    return NextResponse.json({ error: "Failed to submit find. Please try again." }, { status: 500 })
  }
}
