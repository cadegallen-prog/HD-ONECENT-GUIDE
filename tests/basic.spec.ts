import { test, expect } from "@playwright/test"

test("homepage loads and has a title", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/penny/i)
})

test("navbar shows Guide link after hydration", async ({ page }) => {
  await page.goto("/")
  const width = page.viewportSize()?.width ?? 1280

  if (width < 768) {
    await page.getByRole("button", { name: /toggle menu/i }).click()
    const mobileMenu = page.locator("div.mobile-menu-animate")

    const guideLink = mobileMenu.getByRole("link", { name: /^Guide$/i })
    await expect(guideLink).toBeVisible()
    const decisionQualityLink = mobileMenu.getByRole("link", { name: /^Decision Quality$/i })
    await expect(decisionQualityLink).toBeVisible()
    const guideToggle = mobileMenu.getByRole("button", { name: /toggle guide chapters/i })
    await expect(guideToggle).toBeVisible()
    await guideToggle.click()
    await expect(mobileMenu.getByRole("link", { name: /Guide Hub/i })).toBeVisible()
    return
  }

  const guideLink = page.getByRole("navigation").getByRole("link", { name: "Guide" }).first()
  await expect(guideLink).toBeVisible()
  const decisionQualityLink = page
    .getByRole("navigation")
    .getByRole("link", { name: /^Decision Quality$/i })
    .first()
  await expect(decisionQualityLink).toBeVisible()
  const guideToggle = page
    .getByRole("navigation")
    .getByRole("button", { name: /toggle guide chapters/i })
    .first()
  await expect(guideToggle).toBeVisible()
})
