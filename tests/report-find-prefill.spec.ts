import { test, expect } from "@playwright/test"

test.describe("Report Find Prefill", () => {
  test("prefills SKU and name from query params", async ({ page }) => {
    await page.goto("/report-find?sku=1001234567&name=Test%20Item&src=card")

    const skuInput = page.locator("#sku")
    const nameInput = page.locator("#itemName")

    await expect(skuInput).toHaveValue("1001-234-567")
    await expect(nameInput).toHaveValue("Test Item")
  })

  test("prefilled SKU is read-only until Edit is clicked", async ({ page }) => {
    await page.goto("/report-find?sku=1001234567&name=Test%20Item&src=card")

    const skuInput = page.locator("#sku")

    // SKU should be disabled when prefilled
    await expect(skuInput).toBeDisabled()
    await expect(skuInput).toHaveValue("1001-234-567")

    // Edit button should be visible
    const editButton = page.getByRole("button", { name: "Edit SKU number" })
    await expect(editButton).toBeVisible()

    // Click Edit to unlock
    await editButton.click()

    // SKU should now be enabled
    await expect(skuInput).toBeEnabled()
    await expect(editButton).not.toBeVisible()
  })

  test("does not overwrite user edits after prefill", async ({ page }) => {
    await page.goto("/report-find?sku=1001234567&name=Prefilled%20Item&src=card")

    const skuInput = page.locator("#sku")
    const nameInput = page.locator("#itemName")

    await expect(skuInput).toHaveValue("1001-234-567")
    await expect(nameInput).toHaveValue("Prefilled Item")

    // Click Edit to unlock SKU first
    const editButton = page.getByRole("button", { name: "Edit SKU number" })
    await editButton.click()

    await nameInput.fill("User Entered Item")
    await skuInput.fill("999999")

    await expect(nameInput).toHaveValue("User Entered Item")
    await expect(skuInput).toHaveValue("999-999")
  })

  test("does not re-apply prefill after user clears a field", async ({ page }) => {
    await page.goto("/report-find?sku=1001234567&name=Prefilled%20Item&src=card")

    const skuInput = page.locator("#sku")
    await expect(skuInput).toHaveValue("1001-234-567")

    // Click Edit to unlock SKU first
    const editButton = page.getByRole("button", { name: "Edit SKU number" })
    await editButton.click()

    await skuInput.fill("")
    await expect(skuInput).toHaveValue("")
  })

  test("handles empty params gracefully", async ({ page }) => {
    await page.goto("/report-find")

    const skuInput = page.locator("#sku")
    const nameInput = page.locator("#itemName")

    await expect(skuInput).toHaveValue("")
    await expect(nameInput).toHaveValue("")
  })

  test("truncates overly long params", async ({ page }) => {
    const longSku = "1".repeat(50)
    const longName = "A".repeat(200)

    await page.goto(`/report-find?sku=${longSku}&name=${longName}&src=card`)

    const skuInput = page.locator("#sku")
    const nameInput = page.locator("#itemName")

    await expect(skuInput).toHaveValue("1111-111-111")

    const nameValue = await nameInput.inputValue()
    expect(nameValue.length).toBeLessThanOrEqual(75)
  })

  test("does not show SKU error for valid 10-digit prefill", async ({ page }) => {
    await page.goto("/report-find?sku=1001234567&name=Test%20Item&src=card")

    await expect(page.locator("#sku-error")).toHaveCount(0)
  })

  test("handles special characters in name", async ({ page }) => {
    const specialName = `Test's Item & "Quotes" <tag>`
    const encoded = encodeURIComponent(specialName)

    await page.goto(`/report-find?sku=1001234567&name=${encoded}&src=card`)

    const nameInput = page.getByLabel(/Item Name/i)
    await expect(nameInput).toHaveValue(specialName)
  })
})
