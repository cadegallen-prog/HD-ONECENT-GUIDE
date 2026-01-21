import { test, expect } from "@playwright/test"

const routes = [
  { path: "/", heading: "Live Home Depot Penny Finds" },
  { path: "/penny-list", heading: "Home Depot Penny Items List (Live $0.01 Finds)" },
  { path: "/report-find", heading: "Report a Penny Find" },
  { path: "/store-finder", heading: "Store Finder" },
  { path: "/about", heading: "About PennyCentral" },
] as const

test.describe("visual smoke (light/dark, mobile/desktop)", () => {
  for (const { path, heading } of routes) {
    test(`renders ${path}`, async ({ page, context }, testInfo) => {
      const consoleErrors: string[] = []
      page.on("pageerror", (err) => consoleErrors.push(err.message))
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text()
          // Ignore Vercel analytics scripts (not injected in CI)
          if (text.includes("_vercel/insights") || text.includes("_vercel/speed-insights")) return
          // Ignore external image failures (HD CDN images may not load in CI; UI has fallback)
          if (text.includes("Failed to load resource")) return
          consoleErrors.push(text)
        }
      })

      const theme = testInfo.project.name.includes("dark") ? "dark" : "light"
      await page.addInitScript((preferredTheme: string) => {
        try {
          localStorage.setItem("theme", preferredTheme)
        } catch {
          // ignore
        }
      }, theme)

      // Leaflet tiles are network/dynamic; block them to avoid noisy failures.
      if (path === "/store-finder") {
        // Avoid GeolocationPositionError noise in headless runs.
        await context.grantPermissions(["geolocation"])
        await context.setGeolocation({ latitude: 39.8283, longitude: -98.5795 })

        await page.route("**/tile.openstreetmap.org/**", (route) => route.abort())
      }

      await page.goto(path)

      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible()

      await page.evaluate(() => {
        const active = document.activeElement as HTMLElement | null
        active?.blur?.()
      })

      await testInfo.attach(
        `screenshot-${testInfo.project.name}-${path.replaceAll("/", "_") || "_"}`,
        {
          body: await page.screenshot({ caret: "initial" }),
          contentType: "image/png",
        }
      )

      // Filter out known third-party console noise (ads/consent scripts, id5, ezoic) so
      // our tests only fail on real application errors.
      const allowedConsoleRegex = /(ezoic|id5-sync|g\.ezoic\.net|cdn\.id5-sync\.com|ezintegration)/i
      const filtered = consoleErrors.filter((m) => !allowedConsoleRegex.test(m))
      expect(filtered, `Console errors on ${path} (filtered)`).toEqual([])
    })
  }
})
