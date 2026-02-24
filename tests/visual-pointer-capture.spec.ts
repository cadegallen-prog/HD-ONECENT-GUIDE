import { expect, test, type Page } from "@playwright/test"

interface ParsedCapture {
  pcId?: string | null
  primarySelector?: string
  selectorCandidates?: Array<{ strategy?: string; selector?: string }>
  source?:
    | "source_unavailable"
    | {
        pcId?: string
        route?: string
        component?: string
        file?: string
        line?: number
      }
}

async function armCaptureMode(page: Page) {
  const toggleRegion = page.getByTestId("visual-pointer-toggle")
  const toggleButton = toggleRegion.getByRole("button")
  await expect(toggleButton).toBeVisible()
  await expect(toggleButton).toContainText("Feedback Mode: Off")
  await toggleButton.click()
  await expect(toggleButton).toContainText("Feedback Mode: On")
  return toggleButton
}

async function readCapturePacket(page: Page): Promise<ParsedCapture> {
  const captureJson = page.getByTestId("visual-pointer-json")
  await expect(captureJson).toBeVisible()
  const raw = await captureJson.textContent()
  expect(raw).toBeTruthy()
  return JSON.parse(raw || "{}") as ParsedCapture
}

test.describe("visual pointer capture", () => {
  test("captures anchored packet from /penny-list report cta", async ({ page }) => {
    await page.goto("/penny-list?visualPointer=1")

    const toggleButton = await armCaptureMode(page)
    const reportCta = page.locator('[data-pc-id="penny-list.report-cta"]')
    await expect(reportCta).toBeVisible()
    await reportCta.click()

    const parsed = await readCapturePacket(page)
    expect(parsed.pcId).toBe("penny-list.report-cta")
    expect(parsed.primarySelector).toContain('[data-pc-id="penny-list.report-cta"]')
    expect(Array.isArray(parsed.selectorCandidates)).toBe(true)
    expect((parsed.selectorCandidates || []).length).toBeGreaterThan(0)
    expect(parsed.selectorCandidates?.[0]?.strategy).toBe("data-pc-id")

    expect(parsed.source).not.toBe("source_unavailable")
    if (parsed.source && parsed.source !== "source_unavailable") {
      expect(parsed.source.route).toBe("/penny-list")
      expect(parsed.source.component).toBe("PennyListClient")
      expect(parsed.source.file).toContain("components/penny-list-client.tsx")
      expect(parsed.source.line).toBeGreaterThan(0)
    }

    await expect(toggleButton).toContainText("Feedback Mode: Off")
  })

  test("captures unanchored packet from /penny-list heading", async ({ page }) => {
    await page.goto("/penny-list?visualPointer=1")

    const toggleButton = await armCaptureMode(page)
    await page
      .getByRole("heading", { name: /Home Depot Penny Items List \(Live \$0\.01 Finds\)/ })
      .click()

    const parsed = await readCapturePacket(page)
    expect(parsed.primarySelector).toBeTruthy()
    expect(Array.isArray(parsed.selectorCandidates)).toBe(true)
    expect((parsed.selectorCandidates || []).length).toBeGreaterThan(0)
    expect(parsed.selectorCandidates?.[0]?.selector).toBeTruthy()
    expect(parsed.source).toBe("source_unavailable")
    await expect(toggleButton).toContainText("Feedback Mode: Off")
  })

  test("captures anchored packet from /store-finder search input", async ({ page }) => {
    await page.goto("/store-finder?visualPointer=1")

    const toggleButton = await armCaptureMode(page)
    const searchInput = page.locator('[data-pc-id="store-finder.search-input"]')
    await expect(searchInput).toBeVisible()
    await searchInput.click()

    const parsed = await readCapturePacket(page)
    expect(parsed.pcId).toBe("store-finder.search-input")
    expect(parsed.primarySelector).toContain('[data-pc-id="store-finder.search-input"]')
    expect(parsed.source).not.toBe("source_unavailable")

    if (parsed.source && parsed.source !== "source_unavailable") {
      expect(parsed.source.route).toBe("/store-finder")
      expect(parsed.source.component).toBe("StoreFinderPage")
      expect(parsed.source.file).toContain("app/store-finder/page.tsx")
      expect(parsed.source.line).toBeGreaterThan(0)
    }

    await expect(toggleButton).toContainText("Feedback Mode: Off")
  })
})
