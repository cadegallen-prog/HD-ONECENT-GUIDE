import { test, expect } from "@playwright/test"

test("terms of service loads and shows effective date", async ({ page }) => {
  await page.goto("/terms-of-service")

  await expect(page.getByRole("heading", { level: 1, name: "Terms of Service" })).toBeVisible()
  await expect(page.locator("body")).toContainText("Last Updated:")
  await expect(page.locator("body")).toContainText("March 1, 2026")
})
