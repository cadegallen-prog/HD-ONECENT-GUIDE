import { test, expect } from "@playwright/test"
import { mkdir } from "node:fs/promises"
import path from "node:path"

test.describe("SKU detail related items (screenshots)", () => {
  test("shows related items and stays console-clean", async ({ page }, testInfo) => {
    const consoleErrors: string[] = []
    page.on("pageerror", (err) => consoleErrors.push(err.message))
    page.on("console", (msg) => {
      if (msg.type() !== "error") return
      const text = msg.text()
      if (text.includes("_vercel/insights") || text.includes("_vercel/speed-insights")) return
      consoleErrors.push(text)
    })

    await page.goto("/penny-list")

    // Wait for content to load
    await page.waitForLoadState("networkidle")

    // Card/table views use click navigation rather than <a href="/sku/...">,
    // so keep this deterministic by navigating to a known fixture SKU.
    await page.goto("/sku/1009876543")
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({ timeout: 10000 })
    const relatedHeading = page.getByRole("heading", { name: "Related penny items" })
    await expect(relatedHeading).toBeVisible()

    const slug = testInfo.project.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()
    const outDir = path.join(process.cwd(), "reports", "verification")
    await mkdir(outDir, { recursive: true })

    await page.screenshot({
      path: path.join(outDir, `sku-related-items-${slug}.png`),
      fullPage: true,
    })

    await page
      .locator("section,div", { has: relatedHeading })
      .first()
      .screenshot({ path: path.join(outDir, `sku-related-items-block-${slug}.png`) })

    expect(consoleErrors, "Console errors on /penny-list → SKU page").toEqual([])
  })
})
