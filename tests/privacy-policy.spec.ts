import { test, expect } from "@playwright/test"

test("privacy policy loads and contains required disclosures", async ({ page }) => {
  await page.goto("/privacy-policy")

  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible()
  await expect(page.locator("body")).not.toContainText(/ezoic/i)
  await expect(page.locator("body")).toContainText(/Google Analytics 4|GA4/)
  await expect(page.locator("body")).toContainText(/Rakuten/i)
})

test("privacy policy CCPA anchor works", async ({ page }) => {
  await page.goto("/privacy-policy#ccpa")

  const ccpaSection = page.locator("#ccpa")
  await expect(ccpaSection).toBeVisible()
  await expect(ccpaSection).toBeInViewport()

  await expect(ccpaSection.getByRole("heading", { name: /California Residents/i })).toBeVisible()
})
