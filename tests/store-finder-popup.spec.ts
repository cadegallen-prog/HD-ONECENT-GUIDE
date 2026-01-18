import { test, expect } from "@playwright/test"

const FIXED_NOW = new Date("2025-12-10T12:00:00Z").getTime()

test.describe("store finder popup (screenshots)", () => {
  test("popup is compact and readable", async ({ page, context }, testInfo) => {
    const consoleErrors: string[] = []
    page.on("pageerror", (err) => consoleErrors.push(err.message))
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        const text = msg.text()
        if (text.includes("_vercel/insights") || text.includes("_vercel/speed-insights")) return
        consoleErrors.push(text)
      }
    })
    page.on("response", (response) => {
      if (response.status() === 404) {
        const url = response.url()
        if (!url.includes("_vercel/insights") && !url.includes("_vercel/speed-insights")) {
          consoleErrors.push(`404: ${url}`)
        }
      }
    })

    // Avoid GeolocationPositionError noise in headless runs.
    await context.grantPermissions(["geolocation"])
    await context.setGeolocation({ latitude: 39.8283, longitude: -98.5795 })

    const theme = testInfo.project.name.includes("dark") ? "dark" : "light"
    await page.addInitScript((preferredTheme: string) => {
      try {
        localStorage.setItem("theme", preferredTheme)
      } catch {
        // ignore
      }
    }, theme)

    // Freeze time in the browser to avoid drift.
    await page.addInitScript((fixedNow: number) => {
      const RealDate = Date
      class MockDate extends RealDate {
        constructor(...args: unknown[]) {
          if (args.length === 0) {
            super(fixedNow)
          } else {
            super(...(args as ConstructorParameters<typeof RealDate>))
          }
        }

        static now() {
          return fixedNow
        }
      }

      // @ts-expect-error override Date for deterministic tests
      window.Date = MockDate
    }, FIXED_NOW)

    await page.goto("/store-finder")

    // Wait for stores to load (status text changes from "0 of 0")
    await page.waitForFunction(
      () => {
        const statusEl = Array.from(document.querySelectorAll("p")).find((p) =>
          p.textContent?.includes("stores")
        )
        return statusEl && statusEl.textContent && !statusEl.textContent.includes("0 of 0")
      },
      { timeout: 15000 }
    )

    // Wait for the map to mount and at least one marker to render.
    const markers = page.locator(".leaflet-marker-icon")
    await expect(markers.first()).toBeVisible({ timeout: 20000 })

    // Wait for at least one tile to load so the map look is representative.
    await page.locator(".leaflet-tile-loaded").first().waitFor({ timeout: 60000 })

    // Select a store via the list panel (always in viewport), which then opens the marker popup.
    const list = page.locator(".divide-y.divide-border").first()
    const listItems = list.locator("> div")
    await expect(listItems.first()).toBeVisible()
    const itemToSelect = (await listItems.count()) > 1 ? listItems.nth(1) : listItems.first()
    await itemToSelect.click()

    const leafletPopup = page.locator(".leaflet-popup.store-popup").last()
    await expect(leafletPopup).toBeVisible()

    const popup = page.locator(".store-popup-card").last()
    await expect(popup).toBeVisible()

    // Leaflet may pan/position the popup right after click; let it settle.
    await page.waitForTimeout(800)

    // Attach screenshots for review (desktop/mobile, light/dark via Playwright projects).
    await testInfo.attach("store-finder-popup", {
      body: await page.locator(".store-popup-card").last().screenshot(),
      contentType: "image/png",
    })

    await testInfo.attach("store-finder-page", {
      body: await page.screenshot({ fullPage: true }),
      contentType: "image/png",
    })

    const allowedConsoleRegex = /(ezoic|id5-sync|g\.ezoic\.net|cdn\.id5-sync\.com|ezintegration)/i
    const filtered = consoleErrors.filter((m) => !allowedConsoleRegex.test(m))
    expect(filtered, "Console errors on /store-finder (filtered)").toEqual([])
  })
})
