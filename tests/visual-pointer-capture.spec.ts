import { expect, test } from "@playwright/test"

test.describe("visual pointer capture", () => {
  test("captures a selector packet from penny-list heading", async ({ page }) => {
    await page.goto("/penny-list?visualPointer=1")

    const toggleRegion = page.getByTestId("visual-pointer-toggle")
    const toggleButton = toggleRegion.getByRole("button")
    await expect(toggleButton).toBeVisible()
    await expect(toggleButton).toContainText("Feedback Mode: Off")

    await toggleButton.click()
    await expect(toggleButton).toContainText("Feedback Mode: On")

    await page
      .getByRole("heading", { name: /Home Depot Penny Items List \(Live \$0\.01 Finds\)/ })
      .click()

    const captureJson = page.getByTestId("visual-pointer-json")
    await expect(captureJson).toBeVisible()

    const raw = await captureJson.textContent()
    expect(raw).toBeTruthy()

    const parsed = JSON.parse(raw || "{}") as {
      primarySelector?: string
      selectorCandidates?: Array<{ selector?: string }>
      source?: string
    }

    expect(parsed.primarySelector).toBeTruthy()
    expect(Array.isArray(parsed.selectorCandidates)).toBe(true)
    expect((parsed.selectorCandidates || []).length).toBeGreaterThan(0)
    expect(parsed.selectorCandidates?.[0]?.selector).toBeTruthy()
    expect(parsed.source).toBe("source_unavailable")

    await expect(toggleButton).toContainText("Feedback Mode: Off")
  })
})
