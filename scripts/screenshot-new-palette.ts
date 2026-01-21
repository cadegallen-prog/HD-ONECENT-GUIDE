import { chromium } from "playwright"
import { mkdir } from "fs/promises"
import { join } from "path"

async function captureScreenshots() {
  const browser = await chromium.launch()
  const context = await browser.newContext({
    colorScheme: "dark", // Force dark mode
    viewport: { width: 1920, height: 1080 },
  })
  const page = await context.newPage()

  const outputDir = join(process.cwd(), "reports", "palette-screenshots")
  await mkdir(outputDir, { recursive: true })

  const pages = [
    { url: "http://localhost:3001", name: "homepage-dark" },
    { url: "http://localhost:3001/penny-list", name: "penny-list-dark" },
    { url: "http://localhost:3001/guide", name: "guide-dark" },
  ]

  console.log("📸 Capturing dark mode screenshots with Technical Grid palette...\n")

  for (const { url, name } of pages) {
    console.log(`Capturing: ${name}`)
    await page.goto(url, { waitUntil: "networkidle" })
    await page.waitForTimeout(500) // Let animations settle
    await page.screenshot({
      path: join(outputDir, `${name}.png`),
      fullPage: false, // Above the fold only
    })
    console.log(`✓ Saved: ${name}.png`)
  }

  // Also capture mobile view of penny list
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto("http://localhost:3001/penny-list", { waitUntil: "networkidle" })
  await page.waitForTimeout(500)
  await page.screenshot({
    path: join(outputDir, "penny-list-mobile-dark.png"),
    fullPage: false,
  })
  console.log("✓ Saved: penny-list-mobile-dark.png")

  await browser.close()

  console.log(`\n✅ All screenshots saved to: ${outputDir}`)
}

captureScreenshots().catch(console.error)
