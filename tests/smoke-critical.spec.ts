import { expect, test } from "@playwright/test"

test.describe("critical smoke lane", () => {
  test("app boots on homepage", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/penny/i)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /Learn Home Depot penny items\. Check current community finds\./i,
      })
    ).toBeVisible()
  })

  test("critical route /penny-list loads", async ({ page }) => {
    await page.goto("/penny-list")
    await expect(
      page.getByRole("heading", { level: 1, name: /Home Depot Penny Items List/i })
    ).toBeVisible()
  })

  test("guide hub prioritizes the quick-start path", async ({ page }) => {
    await page.goto("/guide")

    await expect(
      page.getByRole("heading", { level: 1, name: /How to Find Home Depot Penny Items/i })
    ).toBeVisible()

    await expect(
      page.getByRole("heading", { level: 2, name: /What are penny items\?/i })
    ).toBeVisible()
    await expect(
      page.getByText(/Penny items are clearance products that reach a final price of \$0\.01\./i)
    ).toBeVisible()

    await expect(page.getByRole("heading", { level: 2, name: /Guide Chapters/i })).toBeVisible()
    await expect(page.getByText(/Start with Part 2 below and keep going in order/i)).toBeVisible()

    const partTwoChapter = page.getByRole("link", { name: /Clearance Lifecycle & Cadence/i })
    await expect(partTwoChapter).toBeVisible()
    await expect(partTwoChapter).toHaveAttribute("href", "/clearance-lifecycle")
  })

  test("core interaction works on report-find prefill basket flow", async ({ page }) => {
    await page.goto("/report-find?sku=1009258128&name=Smoke%20Item&src=card")

    await expect(page.locator("[data-testid='basket-item-1009258128']")).toBeVisible()

    await page.locator("#sku").fill("1009258127")
    await page.locator("#itemName").fill("Smoke Manual Item")
    await page.getByRole("button", { name: "Add item" }).click()

    await expect(page.locator("[data-testid='report-basket-list'] li")).toHaveCount(2)
  })

  test("legacy support route resolves to canonical transparency page", async ({ page }) => {
    await page.goto("/support")
    await expect(page).toHaveURL(/\/transparency\/?$/)
    await expect(page.getByRole("heading", { level: 1, name: /^Transparency$/i })).toBeVisible()
  })
})
