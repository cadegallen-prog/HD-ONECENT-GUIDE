import { test, expect } from "@playwright/test"

const paths = ["/", "/penny-list", "/store-finder", "/about"]

test.describe("visual smoke (light/dark, mobile/desktop)", () => {
  for (const path of paths) {
    test(`renders ${path}`, async ({ page }, testInfo) => {
      const theme = testInfo.project.name.includes("dark") ? "dark" : "light"
      await page.addInitScript((preferredTheme: string) => {
        try {
          localStorage.setItem("theme", preferredTheme)
        } catch {
          // ignore
        }
      }, theme)
      await page.goto(path)
      await expect(page).toHaveScreenshot(
        `${testInfo.project.name}-${path === "/" ? "home" : path.replace(/\//g, "-")}.png`,
        {
          fullPage: true,
          maxDiffPixelRatio: 0.02,
        }
      )
    })
  }
})
