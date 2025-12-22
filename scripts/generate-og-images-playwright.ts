import { chromium } from "@playwright/test"
import { mkdirSync } from "fs"
import { join } from "path"

const OG_WIDTH = 1200
const OG_HEIGHT = 630

const pages = [
  {
    id: "homepage",
    headline: "Home Depot Penny List & Guide",
  },
  {
    id: "penny-list",
    headline: "Home Depot Penny List",
  },
  {
    id: "report-find",
    headline: "Report a Home Depot Penny Find",
  },
  {
    id: "store-finder",
    headline: "Find Nearby Home Depot Stores",
  },
  {
    id: "guide",
    headline: "How to Find Home Depot Penny Items",
  },
]

async function generateOGImage(page: (typeof pages)[number], baseUrl: string) {
  console.log(`Generating OG image for ${page.id}...`)

  const browser = await chromium.launch()
  const context = await browser.newContext({
    viewport: { width: OG_WIDTH, height: OG_HEIGHT },
  })
  const browserPage = await context.newPage()

  // Navigate to the OG endpoint
  const url = `${baseUrl}/api/og?headline=${encodeURIComponent(page.headline)}`
  await browserPage.goto(url, { waitUntil: "networkidle" })

  // Ensure output directory exists
  mkdirSync(join(process.cwd(), "public", "og"), { recursive: true })

  // Take screenshot
  const outputPath = join(process.cwd(), "public", "og", `${page.id}.png`)
  await browserPage.screenshot({ path: outputPath })

  await browser.close()

  console.log(`✓ Generated ${page.id}.png`)
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
  pages.forEach((page) => console.log(`  - public/og/${page.id}.png`))
}

main().catch((error) => {
  console.error("Error generating OG images:", error)
  process.exit(1)
})
