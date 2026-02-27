import { test, expect } from "@playwright/test"

test.describe("Report Find Batch Submit", () => {
  test("shows mixed success summary and keeps failed item for retry", async ({ page }) => {
    let submitCount = 0

    await page.route("**/api/submit-find", async (route) => {
      submitCount += 1
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          mode: "batch",
          attempted: 2,
          successCount: 1,
          failedCount: 1,
          succeeded: [{ index: 0, sku: "1009258128" }],
          failed: [{ index: 1, sku: "1009258127", message: "Simulated failure" }],
          message: "Submitted 1 of 2 item(s).",
        }),
      })
    })

    await page.goto("/report-find")

    await page.locator("#storeState").selectOption("FL")
    await page.locator("#dateFound").fill(new Date().toISOString().split("T")[0])

    await page.locator("#sku").fill("1009258128")
    await page.locator("#itemName").fill("Batch Item One")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.locator("#sku").fill("1009258127")
    await page.locator("#itemName").fill("Batch Item Two")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.getByRole("button", { name: /Submit all \(2\)/i }).click()

    await expect(page.getByText("Submitted 1 of 2 item(s).")).toBeVisible()
    await expect(page.getByText(/Simulated failure/)).toBeVisible()

    await expect(page.locator("[data-testid='basket-item-1009258127']")).toBeVisible()
    await expect(page.locator("[data-testid='basket-item-1009258128']")).toHaveCount(0)
    expect(submitCount).toBe(1)
  })
})
