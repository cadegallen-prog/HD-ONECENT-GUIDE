import { NextRequest, NextResponse } from "next/server"

// Basic SKU validation - must be exactly 6 or 10 digits
function validateSKU(sku: string): boolean {
  const cleaned = sku.replace(/\D/g, "")
  return cleaned.length === 6 || cleaned.length === 10
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields (storeName is now optional)
    if (!body.itemName || !body.sku || !body.storeState || !body.dateFound) {
      return NextResponse.json(
        { error: "Missing required fields: itemName, sku, storeState, dateFound" },
        { status: 400 }
      )
    }

    // Validate Item Name length
    if (body.itemName.trim().length === 0 || body.itemName.trim().length > 75) {
      return NextResponse.json(
        { error: "Item name must be between 1 and 75 characters." },
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

    // Validate state is 2 characters
    if (body.storeState.length !== 2) {
      return NextResponse.json({ error: "State must be a 2-letter code." }, { status: 400 })
    }

    const cleanedSku = body.sku.replace(/\D/g, "")

    // Format location as "City, State" for Google Sheets
    const city = body.storeCity?.trim() || ""
    const state = body.storeState.toUpperCase()
    const location = city ? `${city}, ${state}` : state

    // Prepare payload for Google Apps Script
    const sheetPayload = {
      "Item Name": body.itemName.trim(),
      SKU: cleanedSku,
      "Store (City, State)": location,
      "Purchase Date": body.dateFound,
      "Exact Quantity Found": body.quantity?.trim() || "",
      "Notes (optional)": body.notes?.trim() || "",
    }

    // POST to Google Apps Script webhook
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
      message: "Thanks! Your find has been added to the Penny List.",
    })
  } catch (error) {
    console.error("Error submitting find:", error)
    return NextResponse.json({ error: "Failed to submit find. Please try again." }, { status: 500 })
  }
}
