import { test, expect } from "@playwright/test"

const paths = ["/", "/penny-list", "/store-finder", "/about"]
const FIXED_NOW = new Date("2025-12-10T12:00:00Z").getTime()

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

      // Freeze time in the browser to avoid relative-date snapshot drift.
      await page.addInitScript((fixedNow: number) => {
        const RealDate = Date
        class MockDate extends RealDate {
          constructor(...args: ConstructorParameters<typeof RealDate>) {
            if (args.length === 0) {
              super(fixedNow)
            } else {
              super(...args)
            }
          }

          static now() {
            return fixedNow
          }
        }

        // @ts-expect-error override Date for deterministic tests
        window.Date = MockDate
      }, FIXED_NOW)

      // Leaflet tiles are network/dynamic; block them for stable snapshots.
      if (path === "/store-finder") {
        await page.route("**/tile.openstreetmap.org/**", (route) => route.abort())
      }

      await page.goto(path)
      const maxDiffPixelRatio = path === "/store-finder" ? 0.12 : 0.02

      await expect(page).toHaveScreenshot(
        `${testInfo.project.name}-${path === "/" ? "home" : path.replace(/\//g, "-")}.png`,
        {
          fullPage: true,
          maxDiffPixelRatio,
          timeout: 15000,
        }
      )
    })
  }
})
