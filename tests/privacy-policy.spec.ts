import { test, expect } from "@playwright/test"

test("privacy policy loads and contains required disclosures", async ({ page }) => {
  await page.goto("/privacy-policy")

  const body = page.locator("body")
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible()
  await expect(body).not.toContainText(/ezoic/i)
  await expect(body).toContainText(/Analytics and advertising technologies/i)
  await expect(body).toContainText(/Rakuten/i)
  await expect(body).toContainText(/Global Privacy Control|GPC/i)
  await expect(body).toContainText(/do-not-sell-or-share/i)
})

test("privacy policy CCPA anchor works", async ({ page }) => {
  await page.goto("/privacy-policy#ccpa")

  const ccpaSection = page.locator("#ccpa")
  await expect(ccpaSection).toBeVisible()
  await expect(ccpaSection).toBeInViewport()
  await expect(
    ccpaSection.getByRole("heading", { name: /U\.S\. Privacy Rights \(including CCPA\/CPRA\)/i })
  ).toBeVisible()
})
