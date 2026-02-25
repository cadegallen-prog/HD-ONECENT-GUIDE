import { NextResponse } from "next/server"
import { writeFile, mkdir } from "node:fs/promises"
import { join } from "node:path"
import { isVisualPointerEnvironmentEnabled } from "@/lib/visual-pointer/env"

export const runtime = "nodejs"

const MAX_SNIPPET_LENGTH = 200
const MAX_PAYLOAD_SIZE = 32_768

function sanitizeText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return ""
  return value.slice(0, maxLength).replace(/[\x00-\x1f]/g, "")
}

function formatTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-").replace("T", "T").slice(0, 19)
}

export async function POST(request: Request) {
  if (!isVisualPointerEnvironmentEnabled()) {
    return NextResponse.json({ ok: false, error: "not found" }, { status: 404 })
  }

  const contentLength = request.headers.get("content-length")
  if (contentLength && Number(contentLength) > MAX_PAYLOAD_SIZE) {
    return NextResponse.json({ ok: false, error: "payload too large" }, { status: 400 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: "invalid json" }, { status: 400 })
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ ok: false, error: "missing body" }, { status: 400 })
  }

  const { capture, note } = body as { capture?: Record<string, unknown>; note?: string }

  if (!capture || typeof capture !== "object" || !capture.captureId || !capture.primarySelector) {
    return NextResponse.json({ ok: false, error: "invalid capture payload" }, { status: 400 })
  }

  // Sanitize text fields to prevent injection
  const sanitized = {
    ...capture,
    targetTextSnippet: sanitizeText(capture.targetTextSnippet, MAX_SNIPPET_LENGTH),
    targetLabel: capture.targetLabel ? sanitizeText(capture.targetLabel, MAX_SNIPPET_LENGTH) : null,
  }

  const timestamp = formatTimestamp()
  const relativeDir = `reports/visual-pointing/${timestamp}`
  const absoluteDir = join(process.cwd(), relativeDir)

  await mkdir(absoluteDir, { recursive: true })

  const artifact = {
    capture: sanitized,
    note: note ? sanitizeText(note, 500) : null,
    savedAt: new Date().toISOString(),
  }

  const filePath = join(absoluteDir, "capture.json")
  await writeFile(filePath, JSON.stringify(artifact, null, 2), "utf-8")

  const artifactPath = `${relativeDir}/capture.json`
  return NextResponse.json({ ok: true, artifactPath })
}
