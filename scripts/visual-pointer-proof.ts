/**
 * Visual Pointer Replay & Proof Script
 *
 * Reads a captured artifact JSON, launches Playwright against the dev server,
 * relocates the captured target using the selector bundle, and writes a proof
 * screenshot + summary.
 *
 * Usage:
 *   npx tsx scripts/visual-pointer-proof.ts --artifact <path-to-capture.json>
 */

import { chromium, type Page, type BrowserContext } from "playwright"
import { readFile, writeFile, mkdir } from "node:fs/promises"
import { join, dirname } from "node:path"

interface SelectorCandidate {
  strategy: string
  selector: string
  confidence: string
}

interface CapturePayload {
  captureId: string
  url: string
  pathname: string
  viewportWidth: number
  viewportHeight: number
  primarySelector: string
  selectorCandidates: SelectorCandidate[]
  targetTag: string
  targetTextSnippet: string
  pcId: string | null
}

interface Artifact {
  capture: CapturePayload
  note?: string | null
  savedAt: string
}

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:3001"

function parseArgs(): { artifactPath: string } {
  const args = process.argv.slice(2)
  const flagIndex = args.indexOf("--artifact")
  if (flagIndex === -1 || !args[flagIndex + 1]) {
    console.error("Usage: npx tsx scripts/visual-pointer-proof.ts --artifact <path>")
    process.exit(1)
  }
  return { artifactPath: args[flagIndex + 1] }
}

async function loadArtifact(path: string): Promise<Artifact> {
  const raw = await readFile(path, "utf-8")
  return JSON.parse(raw) as Artifact
}

function toPlaywrightSelector(candidate: SelectorCandidate): string | null {
  switch (candidate.strategy) {
    case "data-pc-id":
    case "data-testid":
    case "css-path":
      return candidate.selector
    case "aria-role-name": {
      // role=button[name="..."] → getByRole is better but we use locator strings
      const match = candidate.selector.match(/^role=(\w+)\[name="(.+)"\]$/)
      if (match) {
        return `role=${match[1]}[name="${match[2]}"]`
      }
      const simpleMatch = candidate.selector.match(/^role=(\w+)$/)
      if (simpleMatch) {
        return `role=${simpleMatch[1]}`
      }
      return null
    }
    case "text":
      return candidate.selector
    default:
      return null
  }
}

async function tryLocate(
  page: Page,
  candidates: SelectorCandidate[]
): Promise<{
  found: boolean
  usedStrategy: string | null
  usedSelector: string | null
}> {
  for (const candidate of candidates) {
    const selector = toPlaywrightSelector(candidate)
    if (!selector) continue

    try {
      const locator = page.locator(selector).first()
      const visible = await locator.isVisible({ timeout: 3000 })
      if (visible) {
        return { found: true, usedStrategy: candidate.strategy, usedSelector: selector }
      }
    } catch {
      // Selector didn't match or timed out, try next
    }
  }
  return { found: false, usedStrategy: null, usedSelector: null }
}

async function main() {
  const { artifactPath } = parseArgs()
  const artifact = await loadArtifact(artifactPath)
  const capture = artifact.capture

  console.log(`Replaying capture: ${capture.captureId}`)
  console.log(`  URL: ${capture.pathname}`)
  console.log(`  Primary selector: ${capture.primarySelector}`)
  console.log(`  Candidates: ${capture.selectorCandidates.length}`)

  const browser = await chromium.launch({ headless: true })
  const context: BrowserContext = await browser.newContext({
    viewport: { width: capture.viewportWidth, height: capture.viewportHeight },
  })
  const page = await context.newPage()

  const fullUrl = `${BASE_URL}${capture.pathname}`
  console.log(`  Navigating to: ${fullUrl}`)
  await page.goto(fullUrl, { waitUntil: "networkidle" })

  // Attempt to locate using the full selector chain
  const result = await tryLocate(page, capture.selectorCandidates)

  const outputDir = join(dirname(artifactPath), "proof")
  await mkdir(outputDir, { recursive: true })

  const screenshotPath = join(outputDir, "replay-proof.png")
  const summaryPath = join(outputDir, "replay-summary.json")

  if (result.found && result.usedSelector) {
    console.log(`  FOUND via ${result.usedStrategy}: ${result.usedSelector}`)

    // Highlight the target element
    const locator = page.locator(result.usedSelector).first()
    await locator.evaluate((el) => {
      el.style.outline = "3px solid #e74c3c"
      el.style.outlineOffset = "2px"
    })

    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log(`  Screenshot: ${screenshotPath}`)
  } else {
    console.log("  NOT FOUND — taking full-page screenshot for diagnosis")
    await page.screenshot({ path: screenshotPath, fullPage: true })
  }

  const summary = {
    captureId: capture.captureId,
    replayedAt: new Date().toISOString(),
    pathname: capture.pathname,
    viewport: { width: capture.viewportWidth, height: capture.viewportHeight },
    found: result.found,
    usedStrategy: result.usedStrategy,
    usedSelector: result.usedSelector,
    candidatesAttempted: capture.selectorCandidates.length,
    screenshotPath,
  }

  await writeFile(summaryPath, JSON.stringify(summary, null, 2), "utf-8")
  console.log(`  Summary: ${summaryPath}`)

  await browser.close()

  if (!result.found) {
    console.error("  REPLAY FAILED — target not found with any selector candidate")
    process.exit(1)
  }

  console.log("  REPLAY SUCCESS")
}

main().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
