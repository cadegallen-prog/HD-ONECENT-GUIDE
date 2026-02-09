import { expect, test } from "@playwright/test"

test.describe("critical smoke lane", () => {
  test("app boots on homepage", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveTitle(/penny/i)
    await expect(
      page.getByRole("heading", { level: 1, name: /Live Home Depot Penny Finds/i })
    ).toBeVisible()
  })

  test("critical route /penny-list loads", async ({ page }) => {
    await page.goto("/penny-list")
    await expect(
      page.getByRole("heading", { level: 1, name: /Home Depot Penny Items List/i })
    ).toBeVisible()
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
})
