import { NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

// Basic SKU validation
function validateSKU(sku: string): boolean {
  const cleaned = sku.replace(/\D/g, "")
  return cleaned.length === 6 || cleaned.length === 10
}

function calculateValidationScore(submission: {
  sku: string
  storeName: string
  storeCity: string
  storeState: string
  dateFound: string
  quantity?: string
  notes?: string
}): number {
  let score = 0

  // Valid SKU format
  if (validateSKU(submission.sku)) score += 20

  // Has store name
  if (submission.storeName.trim().length > 0) score += 10

  // Has state
  if (submission.storeState.length === 2) score += 10

  // Has city
  if (submission.storeCity.trim().length > 0) score += 10

  // Recent date (within last 30 days)
  const dateFound = new Date(submission.dateFound)
  const today = new Date()
  const daysDiff = Math.floor((today.getTime() - dateFound.getTime()) / (1000 * 60 * 60 * 24))
  if (daysDiff >= 0 && daysDiff <= 30) score += 20

  // Has quantity info
  if (submission.quantity && submission.quantity.trim().length > 0) score += 5

  // Has notes
  if (submission.notes && submission.notes.trim().length > 0) score += 5

  return score
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Basic validation
    if (!body.sku || !body.storeName || !body.storeState || !body.dateFound) {
      return NextResponse.json(
        { error: "Missing required fields: sku, storeName, storeState, dateFound" },
        { status: 400 }
      )
    }

    // Validate SKU format
    if (!validateSKU(body.sku)) {
      return NextResponse.json(
        { error: "Invalid SKU format. Must be 6 or 10 digits." },
        { status: 400 }
      )
    }

    const validationScore = calculateValidationScore(body)
    const cleanedSku = body.sku.replace(/\D/g, "")

    await sql`
      INSERT INTO submissions (
        sku, store_name, store_city, store_state, 
        date_found, quantity, notes, validation_score
      ) VALUES (
        ${cleanedSku},
        ${body.storeName.trim()},
        ${body.storeCity?.trim() || ""},
        ${body.storeState.toUpperCase()},
        ${body.dateFound},
        ${body.quantity?.trim() || null},
        ${body.notes?.trim() || null},
        ${validationScore}
      )
    `

    return NextResponse.json({
      success: true,
      message: "Thank you! Your find has been submitted for review.",
      validationScore,
    })
  } catch (error) {
    console.error("Error submitting find:", error)
    return NextResponse.json({ error: "Failed to submit find. Please try again." }, { status: 500 })
  }
}
