import { test, expect } from "@playwright/test"
import { REPORT_FIND_BASKET_ITEM_LIMIT } from "../lib/constants"

function buildBasket(count: number) {
  return Array.from({ length: count }, (_, index) => ({
    sku: `1009258${String(100 + index).padStart(3, "0")}`,
    itemName: `Seeded Item ${index + 1}`,
    quantity: null,
    addedVia: "prefill" as const,
  }))
}

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

    await page.locator("#sku").fill("1009258128")
    await page.locator("#itemName").fill("Test Merge Item")
    await page.locator("#quantity").fill("2")
    await page.getByRole("button", { name: "Add item" }).click()

    await page.locator("#sku").fill("1009258128")
    await page.locator("#itemName").fill("Test Merge Item")
    await page.locator("#quantity").fill("3")
    await page.getByRole("button", { name: "Add item" }).click()

    const basketItem = page.locator("[data-testid='basket-item-1009258128']")
    await expect(basketItem).toContainText("SKU 1009-258-128")
    await expect(basketItem).toContainText("Qty 5")
    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(1)
  })

  test("blocks the 11th unique manual add without changing the basket count", async ({ page }) => {
    await page.goto("/report-find")

    for (let index = 0; index < REPORT_FIND_BASKET_ITEM_LIMIT; index += 1) {
      await page.locator("#sku").fill(`1009258${String(100 + index).padStart(3, "0")}`)
      await page.locator("#itemName").fill(`Manual Item ${index + 1}`)
      await page.getByRole("button", { name: "Add item" }).click()
    }

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(
      REPORT_FIND_BASKET_ITEM_LIMIT
    )

    await page
      .locator("#sku")
      .fill(`1009258${String(100 + REPORT_FIND_BASKET_ITEM_LIMIT).padStart(3, "0")}`)
    await page.locator("#itemName").fill("Manual Item 11")
    await page.getByRole("button", { name: "Add item" }).click()

    await expect(
      page.getByText(
        `Basket full. Submit these ${REPORT_FIND_BASKET_ITEM_LIMIT} items first, then add more.`
      )
    ).toBeVisible()
    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(
      REPORT_FIND_BASKET_ITEM_LIMIT
    )
  })

  test("blocks a new prefill add when the basket is already at the cap", async ({ page }) => {
    await page.addInitScript((basket) => {
      window.sessionStorage.setItem("pc_report_basket_v1", JSON.stringify(basket))
    }, buildBasket(REPORT_FIND_BASKET_ITEM_LIMIT))

    await page.goto("/report-find?sku=1010352067&name=Overflow%20Prefill&src=card")

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(
      REPORT_FIND_BASKET_ITEM_LIMIT
    )
    await expect(
      page.getByText(
        `Basket full. Submit these ${REPORT_FIND_BASKET_ITEM_LIMIT} items first, then add more.`
      )
    ).toBeVisible()
    await expect(page.locator("[data-testid='basket-item-1010352067']")).toHaveCount(0)
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
