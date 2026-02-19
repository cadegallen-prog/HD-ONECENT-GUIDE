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

  test("guide hub shows worth-it filter scaffold", async ({ page }) => {
    await page.goto("/guide")

    const worthItSection = page.locator("#worth-it-filter")

    await expect(
      worthItSection.getByRole("heading", { level: 2, name: /Worth-It Filter/i })
    ).toBeVisible()

    const lanes = ["Use", "Gift", "Donate", "Resell", "Skip"]
    for (const lane of lanes) {
      await expect(
        worthItSection.getByRole("heading", { level: 3, name: new RegExp(`^${lane}$`) })
      ).toBeVisible()
    }

    const cta = worthItSection.getByRole("link", { name: /Apply the in-store strategy/i })
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute("href", "/in-store-strategy")
  })

  test("core interaction works on report-find prefill edit", async ({ page }) => {
    await page.goto("/report-find?sku=1009258128&name=Smoke%20Item&src=card")

    const skuInput = page.locator("#sku")
    const editButton = page.getByRole("button", { name: "Edit SKU number" })

    await expect(skuInput).toHaveValue("1009-258-128")
    await expect(skuInput).toBeDisabled()
    await editButton.click()
    await expect(skuInput).toBeEnabled()
    await skuInput.fill("1009258127")
    await expect(skuInput).toHaveValue("1009-258-127")
  })

  test("legacy support route resolves to canonical transparency page", async ({ page }) => {
    await page.goto("/support")
    await expect(page).toHaveURL(/\/transparency\/?$/)
    await expect(page.getByRole("heading", { level: 1, name: /^Transparency$/i })).toBeVisible()
  })
})
