import { expect, test } from "@playwright/test"

test.describe("critical smoke lane", () => {
  test("app boots on homepage", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/penny/i)
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: /See live Home Depot penny finds before you make the trip\./i,
      })
    ).toBeVisible()
    await expect(page.getByRole("link", { name: /Learn how it works/i }).first()).toBeVisible()
    await expect(page.getByRole("link", { name: /Check the Penny List/i }).first()).toBeVisible()
    await expect(page.getByTestId("home-proof-hero-media")).toBeVisible()
    await expect
      .poll(async () => page.getByTestId("home-proof-hero-media").getAttribute("data-proof-visual"))
      .toMatch(/loaded|fallback/)
  })

  test("critical route /penny-list loads", async ({ page }) => {
    await page.goto("/penny-list")
    await expect(
      page.getByRole("heading", { level: 1, name: /Home Depot Penny Items List/i })
    ).toBeVisible()
  })

  test("penny-list never renders DIY as title case", async ({ page }) => {
    await page.goto("/penny-list")
    await expect(
      page.getByRole("heading", { level: 1, name: /Home Depot Penny Items List/i })
    ).toBeVisible()

    const pageText = await page.locator("main").innerText()
    expect(pageText).not.toMatch(/\bDiy\b/)

    if (/\bDIY\b/.test(pageText)) {
      await expect(page.getByText(/\bDIY\b/).first()).toBeVisible()
    }
  })

  test("guide route now acts as the canonical long-form guide", async ({ page }) => {
    await page.goto("/guide")

    await expect(
      page.getByRole("heading", { level: 1, name: /How to Find Home Depot Penny Items/i })
    ).toBeVisible()
    await expect(page.getByTestId("guide-jump-nav")).toBeVisible()
    await expect(
      page.getByRole("link", { name: /How to scout before a store trip/i }).first()
    ).toHaveAttribute("href", "#scout-before-a-store-trip")
    await expect(
      page.getByRole("heading", { level: 2, name: /What penny items are/i })
    ).toBeVisible()
    await expect(
      page.getByRole("heading", { level: 2, name: /What to do after a confirmed find/i })
    ).toBeVisible()
  })

  test("report-find page includes Back-button basket guidance", async ({ page }) => {
    await page.goto("/report-find")

    await expect(
      page.getByText(
        /Coming from the Penny List\? Use your browser Back button in this tab to return to the list and keep adding items before you submit\. Your basket stays here\./i
      )
    ).toBeVisible()
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
