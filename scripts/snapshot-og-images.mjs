import { chromium } from "@playwright/test"
import { mkdirSync, copyFileSync } from "fs"
import { join } from "path"

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const pages = [
  { id: "homepage", url: "/api/og?page=homepage" },
  { id: "penny-list", url: "/api/og?page=penny-list" },
  { id: "report-find", url: "/api/og?page=report-find" },
  { id: "store-finder", url: "/api/og?page=store-finder" },
  { id: "guide", url: "/api/og?page=guide" },
  {
    id: "dynamic-sku",
    url: "/api/og?headline=Sample%20Product%20Name&subhead=A%20%240.01%20item%20found%20at%20Home%20Depot",
  },
]

async function main() {
  console.log("Taking OG image snapshots for verification...")
  console.log("─".repeat(50))

  const baseUrl = "http://localhost:3001"
  const outputDir = join(process.cwd(), "test-results", "og")
  mkdirSync(outputDir, { recursive: true })

  const browser = await chromium.launch()

  for (const page of pages) {
    console.log(`Capturing ${page.id}...`)

    const context = await browser.newContext({
      viewport: { width: OG_WIDTH, height: OG_HEIGHT },
    })
    const browserPage = await context.newPage()

    await browserPage.goto(`${baseUrl}${page.url}`, { waitUntil: "networkidle" })

    const outputPath = join(outputDir, `${page.id}.jpg`)
    await browserPage.screenshot({
      path: outputPath,
      type: "jpeg",
      quality: 95,
    })

    await context.close()
    console.log(`  ✓ Saved ${page.id}.jpg`)
  }

  await browser.close()

  // Also copy the static files for comparison
  console.log("\nCopying static OG files for comparison...")
  const staticFiles = ["homepage", "penny-list", "report-find", "store-finder", "guide"]
  for (const file of staticFiles) {
    const src = join(process.cwd(), "public", "og", `${file}.jpg`)
    const dest = join(outputDir, `static-${file}.jpg`)
    try {
      copyFileSync(src, dest)
      console.log(`  ✓ Copied static-${file}.jpg`)
    } catch {
      console.log(`  ⚠ Could not copy ${file}.jpg (may not exist yet)`)
    }
  }

  console.log("─".repeat(50))
  console.log(`✓ All snapshots saved to ${outputDir}`)
}

main().catch((error) => {
  console.error("Error:", error)
  process.exit(1)
})
