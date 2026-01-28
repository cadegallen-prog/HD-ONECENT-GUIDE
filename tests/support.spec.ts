import { test, expect } from "@playwright/test"

test("support page includes Rakuten CTA and no cashback link", async ({ page }) => {
  await page.goto("/support")

  await expect(page.getByRole("heading", { level: 1, name: "Support PennyCentral" })).toBeVisible()

  const rakutenCta = page.getByRole("link", { name: /Sign Up for Rakuten/i })
  await expect(rakutenCta).toHaveAttribute("href", "/go/rakuten")

  const pageContent = page.locator("main#main-content > section").first()
  await expect(pageContent).not.toContainText(/befrugal/i)
  await expect(pageContent.locator('a[href="/cashback"]')).toHaveCount(0)
})
