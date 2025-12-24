import { chromium } from "@playwright/test"
import { mkdirSync, statSync } from "fs"
import { join } from "path"
import { OG_MAIN_PAGES, OG_VARIANTS } from "../lib/og"

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const JPEG_QUALITY = 90

const pages = OG_MAIN_PAGES.map((id) => ({ id, ...OG_VARIANTS[id] }))

async function generateOGImage(page: (typeof pages)[number], baseUrl: string) {
  console.log(`Generating OG image for ${page.id}...`)

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: OG_WIDTH, height: OG_HEIGHT },
  })
  const browserPage = await context.newPage()

  // Navigate to the OG endpoint
  const url = `${baseUrl}/api/og?page=${encodeURIComponent(page.id)}&headline=${encodeURIComponent(
    page.headline
  )}&subhead=${encodeURIComponent(page.subhead)}`
  await browserPage.goto(url, { waitUntil: "networkidle" })

  // Ensure output directory exists
  mkdirSync(join(process.cwd(), "public", "og"), { recursive: true })

  // Take screenshot as JPEG for smaller file sizes
  const outputPath = join(process.cwd(), "public", "og", `${page.id}.jpg`)
  await browserPage.screenshot({
    path: outputPath,
    type: "jpeg",
    quality: JPEG_QUALITY,
  })

  await browser.close()

  // Log file size
  const stats = statSync(outputPath)
  const sizeKB = Math.round(stats.size / 1024)
  console.log(`✓ Generated ${page.id}.jpg (${sizeKB}KB)`)

  if (sizeKB > 300) {
    console.warn(`  ⚠ WARNING: ${page.id}.jpg exceeds 300KB recommendation!`)
  }
}

async function main() {
  console.log("Generating static OG images using Playwright...")
  console.log("─".repeat(50))

  // Use localhost:3001 as baseUrl
  const baseUrl = "http://localhost:3001"

  console.log(`Using base URL: ${baseUrl}`)
  console.log("Make sure the dev server is running on port 3001!")
  console.log("─".repeat(50))

  for (const page of pages) {
    await generateOGImage(page, baseUrl)
  }

  console.log("─".repeat(50))
  console.log(`✓ All ${pages.length} OG images generated successfully!`)
  console.log("\nFiles created:")
  pages.forEach((page) => console.log(`  - public/og/${page.id}.jpg`))
}

main().catch((error) => {
  console.error("Error generating OG images:", error)
  process.exit(1)
})
