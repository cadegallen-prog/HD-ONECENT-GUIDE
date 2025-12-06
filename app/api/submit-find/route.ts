import { NextRequest, NextResponse } from "next/server"
import { promises as fs } from "fs"
import path from "path"

interface FindSubmission {
  id: string
  sku: string
  storeName: string
  storeCity: string
  storeState: string
  dateFound: string
  quantity?: string
  notes?: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  validationScore?: number
}

// Basic SKU validation
function validateSKU(sku: string): boolean {
  const cleaned = sku.replace(/\D/g, "")
  return cleaned.length === 6 || cleaned.length === 10
}

// Calculate basic fraud score
function calculateValidationScore(
  submission: Omit<FindSubmission, "id" | "submittedAt" | "status" | "validationScore">
): number {
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

    // Calculate validation score
    const validationScore = calculateValidationScore(body)

    // Create submission object
    const submission: FindSubmission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sku: body.sku.replace(/\D/g, ""), // Clean SKU
      storeName: body.storeName.trim(),
      storeCity: body.storeCity?.trim() || "",
      storeState: body.storeState.toUpperCase(),
      dateFound: body.dateFound,
      quantity: body.quantity?.trim(),
      notes: body.notes?.trim(),
      submittedAt: new Date().toISOString(),
      status: "pending",
      validationScore,
    }

    // Read existing submissions
    const filePath = path.join(process.cwd(), "data", "pending-submissions.json")
    let submissions: FindSubmission[] = []

    try {
      const fileContent = await fs.readFile(filePath, "utf-8")
      submissions = JSON.parse(fileContent)
    } catch {
      // File doesn't exist or is empty, start with empty array
      submissions = []
    }

    // Add new submission
    submissions.push(submission)

    // Write back to file
    await fs.writeFile(filePath, JSON.stringify(submissions, null, 2))

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
