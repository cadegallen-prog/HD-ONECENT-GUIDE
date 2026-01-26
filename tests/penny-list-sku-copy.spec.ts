import { test, expect } from "@playwright/test"
import path from "node:path"
import { readFileSync } from "node:fs"

test.describe("Penny List - SKU pill copy", () => {
  test("clicking SKU pill copies SKU to clipboard and shows toast", async ({ page }) => {
    // Load page
    await page.goto("/penny-list")
    await page.waitForLoadState("networkidle")

    // Ensure the fixture contains at least one SKU
    const fixturePath = path.join(process.cwd(), "data", "penny-list.json")
    const fixtureText = readFileSync(fixturePath, "utf8")
    const fixtureItems = JSON.parse(fixtureText) as Array<{ sku?: string }>
    const fixtureSku = fixtureItems.find((i) => i?.sku)?.sku
    expect(fixtureSku, "Fixture must contain at least one SKU").toBeTruthy()

    // Mock clipboard.writeText for deterministic behavior
    await page.evaluate(() => {
      // @ts-ignore
      window.navigator.clipboard = { writeText: (text: string) => Promise.resolve(text) }
    })

    // Prefer explicit SKU pill (full card), but fall back to any visible Copy SKU button (compact cards)
    let skuButton = page.getByRole("button", { name: /Copy SKU/ }).first()
    const visible = await skuButton.isVisible().catch(() => false)
    if (!visible) {
      skuButton = page.locator('[data-test="penny-card-sku"]').first()
    }
    await expect(skuButton).toBeVisible()

    // Click the SKU copy control - should not navigate away and should show a "Copied SKU" toast
    await skuButton.click()

    await expect(page.getByText(/Copied SKU/)).toBeVisible({ timeout: 5000 })
    await expect(page).toHaveURL(/\/penny-list/)
  })
})
