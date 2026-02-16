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

    const guideButton = page.getByRole("button", { name: /^Guide$/i })
    await expect(guideButton).toBeVisible()

    await guideButton.click()
    await expect(page.getByRole("link", { name: /Start Here: Guide Hub/i })).toBeVisible()
    return
  }

  const guideLink = page.getByRole("navigation").getByRole("link", { name: "Guide" }).first()
  await expect(guideLink).toBeVisible()
})
