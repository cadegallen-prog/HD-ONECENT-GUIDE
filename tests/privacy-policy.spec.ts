import { test, expect } from "@playwright/test"

test("privacy policy loads and contains required disclosures", async ({ page }) => {
  await page.goto("/privacy-policy")

  const policyContent = page.locator("main#main-content")
  await expect(page.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeVisible()
  await expect(policyContent).toContainText(/Google Analytics tracking via GA4/i)
  await expect(policyContent).toContainText(/Measurement ID: G-DJ4RJRX05E/i)
  await expect(policyContent).toContainText(/Monumetric/i)
  await expect(policyContent).toContainText(/Ezoic/i)
  await expect(policyContent).toContainText(/Resend/i)
  await expect(policyContent).toContainText(/Analytics and advertising technologies/i)
  await expect(policyContent).toContainText(/Google/i)
  await expect(policyContent).toContainText(/adssettings\.google\.com/i)
  await expect(policyContent).toContainText(/aboutads\.info\/choices/i)
  await expect(policyContent).not.toContainText(/Rakuten/i)
  await expect(policyContent).not.toContainText(/\baffiliate\b/i)
  await expect(policyContent).not.toContainText(/referral compensation/i)
  await expect(policyContent).not.toContainText(/paypal/i)
  await expect(policyContent).not.toContainText(/donation/i)
  await expect(policyContent).toContainText(/Global Privacy Control|GPC/i)
  await expect(policyContent).toContainText(/do-not-sell-or-share/i)
  await expect(page.locator("#ezoic-privacy-policy-embed")).toHaveCount(1)
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
