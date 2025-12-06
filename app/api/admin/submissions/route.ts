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

const filePath = path.join(process.cwd(), "data", "pending-submissions.json")

async function readSubmissions(): Promise<FindSubmission[]> {
  try {
    const fileContent = await fs.readFile(filePath, "utf-8")
    return JSON.parse(fileContent)
  } catch {
    return []
  }
}

async function writeSubmissions(submissions: FindSubmission[]): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(submissions, null, 2))
}

// GET - List all submissions
export async function GET() {
  try {
    const submissions = await readSubmissions()
    return NextResponse.json({ submissions })
  } catch (error) {
    console.error("Error reading submissions:", error)
    return NextResponse.json({ error: "Failed to load submissions" }, { status: 500 })
  }
}

// PATCH - Approve or reject submission
export async function PATCH(request: NextRequest) {
  try {
    const { id, action } = await request.json()

    if (!id || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    const submissions = await readSubmissions()
    const index = submissions.findIndex((s) => s.id === id)

    if (index === -1) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 })
    }

    submissions[index].status = action === "approve" ? "approved" : "rejected"
    await writeSubmissions(submissions)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating submission:", error)
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 })
  }
}

// DELETE - Remove submission
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Missing submission ID" }, { status: 400 })
    }

    const submissions = await readSubmissions()
    const filtered = submissions.filter((s) => s.id !== id)
    await writeSubmissions(filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting submission:", error)
    return NextResponse.json({ error: "Failed to delete submission" }, { status: 500 })
  }
}
