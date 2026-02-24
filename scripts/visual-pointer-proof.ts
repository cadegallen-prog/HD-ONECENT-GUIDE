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

import { chromium, type Page, type BrowserContext, type Locator } from "playwright"
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

  if (flagIndex !== -1 && args[flagIndex + 1]) {
    return { artifactPath: args[flagIndex + 1] }
  }

  const positionalPath = args.find((value) => !value.startsWith("-"))
  if (positionalPath) {
    return { artifactPath: positionalPath }
  }

  console.error(
    "Usage: npx tsx scripts/visual-pointer-proof.ts --artifact <path>  (or positional <path>)"
  )
  process.exit(1)
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
  async function isVisibleWithScroll(locator: Locator): Promise<boolean> {
    try {
      if (await locator.isVisible({ timeout: 1500 })) {
        return true
      }
    } catch {
      // keep trying with scroll fallback
    }

    try {
      await locator.scrollIntoViewIfNeeded({ timeout: 1500 })
      return await locator.isVisible({ timeout: 2000 })
    } catch {
      return false
    }
  }

  // Retry once to handle delayed rendering after navigation.
  for (let attempt = 1; attempt <= 2; attempt++) {
    for (const candidate of candidates) {
      const selector = toPlaywrightSelector(candidate)
      if (!selector) continue

      try {
        const locator = page.locator(selector).first()
        const count = await locator.count()
        if (count === 0) continue

        if (await isVisibleWithScroll(locator)) {
          return { found: true, usedStrategy: candidate.strategy, usedSelector: selector }
        }
      } catch {
        // Selector didn't match or timed out, try next
      }
    }

    if (attempt === 1) {
      await page.waitForTimeout(350)
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
    await locator.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {
      // Best effort. If scrolling fails, still attempt highlight/screenshot.
    })
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
