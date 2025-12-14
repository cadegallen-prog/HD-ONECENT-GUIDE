import { test, expect } from "@playwright/test"

const routes = [
  { path: "/", heading: "Find $0.01 Items at Home Depot" },
  { path: "/penny-list", heading: "Penny List: Latest Community Leads" },
  { path: "/report-find", heading: "Report a Penny Find" },
  { path: "/store-finder", heading: "Store Finder" },
  { path: "/about", heading: "About Penny Central" },
] as const

const FIXED_NOW = new Date("2025-12-10T12:00:00Z").getTime()

test.describe("visual smoke (light/dark, mobile/desktop)", () => {
  for (const { path, heading } of routes) {
    test(`renders ${path}`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = []
      page.on("pageerror", (err) => consoleErrors.push(err.message))
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text())
      })

      const theme = testInfo.project.name.includes("dark") ? "dark" : "light"
      await page.addInitScript((preferredTheme: string) => {
        try {
          localStorage.setItem("theme", preferredTheme)
        } catch {
          // ignore
        }
      }, theme)

      // Freeze time in the browser to avoid relative-date drift.
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

      // Leaflet tiles are network/dynamic; block them to avoid noisy failures.
      if (path === "/store-finder") {
        await page.route("**/tile.openstreetmap.org/**", (route) => route.abort())
      }

      await page.goto(path)

      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible()
      expect(consoleErrors, `Console errors on ${path}`).toEqual([])
    })
  }
})
