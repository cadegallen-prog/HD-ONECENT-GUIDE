import { test, expect } from "@playwright/test"

test.describe("Report Find Prefill", () => {
  test("adds prefill item to basket from query params", async ({ page }) => {
    await page.goto("/report-find?sku=1009258128&name=Test%20Item&src=card")

    const basketItem = page.locator("[data-testid='basket-item-1009258128']")
    await expect(basketItem).toBeVisible()
    await expect(basketItem).toContainText("Test Item")
  })

  test("does not duplicate prefill item after reload in same session", async ({ page }) => {
    await page.goto("/report-find?sku=1009258128&name=Test%20Item&src=card")
    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(1)

    await page.reload()

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(1)
  })

  test("merges duplicate manual add by SKU and increments quantity", async ({ page }) => {
    await page.goto("/report-find")

    await page.getByLabel(/^Item Name/i).fill("First Item")
    await page.locator("#sku").fill("1009258128")
    await page.locator("#quantity").fill("2")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.getByLabel(/^Item Name/i).fill("Updated Item")
    await page.locator("#sku").fill("1009258128")
    await page.locator("#quantity").fill("3")
    await page.getByRole("button", { name: "Add item" }).click()

    const basketItem = page.locator("[data-testid='basket-item-1009258128']")
    await expect(basketItem).toContainText("Updated Item")
    await expect(basketItem).toContainText("Qty 5")
    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(1)
  })

  test("handles empty params gracefully", async ({ page }) => {
    await page.goto("/report-find")

    await expect(page.locator("[data-testid='report-basket-list']")).toHaveCount(0)
    await expect(page.getByText("No items added yet.")).toBeVisible()
  })

  test("handles special characters in prefill name", async ({ page }) => {
    const specialName = `Test's Item & \"Quotes\" <tag>`
    const encoded = encodeURIComponent(specialName)

    await page.goto(`/report-find?sku=1009258128&name=${encoded}&src=card`)

    const basketItem = page.locator("[data-testid='basket-item-1009258128']")
    await expect(basketItem).toContainText(specialName)
  })
})
