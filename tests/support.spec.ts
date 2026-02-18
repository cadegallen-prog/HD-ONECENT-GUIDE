import { test, expect } from "@playwright/test"

test("legacy support route redirects to transparency and retains disclosures", async ({ page }) => {
  await page.goto("/support")

  await expect(page).toHaveURL(/\/transparency\/?$/)

  await expect(page.getByRole("heading", { level: 1, name: /^Transparency$/i })).toBeVisible()

  const pageContent = page.locator("main#main-content")
  await expect(pageContent).toContainText(/Advertising/i)
  await expect(pageContent).not.toContainText(/Rakuten/i)
  await expect(pageContent).not.toContainText(/affiliate/i)
  await expect(pageContent).not.toContainText(/referral compensation/i)
  await expect(pageContent).not.toContainText(/paypal/i)
  await expect(pageContent).not.toContainText(/donation/i)
  await expect(page.getByRole("link", { name: /Contact Us/i })).toHaveAttribute("href", "/contact")
  await expect(pageContent).not.toContainText(/befrugal/i)
  await expect(pageContent.locator('a[href="/cashback"]')).toHaveCount(0)
})
