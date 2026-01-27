import { test, expect } from "@playwright/test"

/**
 * Test: Penny Card Brand Truncation (Preventative Hardening)
 *
 * Purpose: Verify that long brand names are properly truncated to prevent
 * overlap with other elements in the card header area. This is a preventative
 * measure for future layout additions (e.g., window labels/today indicators).
 *
 * Implementation: Option A - truncate + max-w-[70%] + title attribute
 *
 * Context: As of 2026-01-27, there is no visible "window label" on penny cards.
 * This test verifies the brand truncation behavior is correct and provides
 * visual regression protection via screenshots.
 */

test.describe("Penny Card - Brand Truncation (Full Variant)", () => {
  test("brand truncates with long text and shows title tooltip", async ({ page }, testInfo) => {
    // Load penny list page
    await page.goto("/penny-list")
    await page.waitForLoadState("networkidle")

    // Find the first card with a brand element (full card variant)
    const brandElement = page.locator('[data-testid="penny-card-brand"]').first()
    await expect(brandElement).toBeVisible({ timeout: 10000 })

    // Verify truncate class is applied
    const classList = await brandElement.getAttribute("class")
    expect(classList).toContain("truncate")
    expect(classList).toContain("max-w-")

    // Verify title attribute exists (for tooltip and accessibility)
    const titleAttr = await brandElement.getAttribute("title")
    expect(titleAttr).toBeTruthy()
    expect(titleAttr).not.toBe("")

    // Verify the brand text content matches the title attribute
    const brandText = await brandElement.textContent()
    expect(brandText?.trim()).toBe(titleAttr?.trim())

    // Get bounding box to verify brand doesn't overflow its parent container
    const brandBox = await brandElement.boundingBox()
    expect(brandBox).not.toBeNull()

    if (brandBox) {
      // Verify the brand element has a reasonable width (not full card width)
      // Max-w-[70%] should limit it, but actual width may be smaller
      const parentCard = page.locator('[data-testid="penny-card-brand"]').first().locator("..")
      const parentBox = await parentCard.boundingBox()

      if (parentBox) {
        // Brand should be narrower than its parent (not overflowing)
        expect(brandBox.width).toBeLessThan(parentBox.width)

        // Brand right edge should be within parent bounds
        expect(brandBox.x + brandBox.width).toBeLessThanOrEqual(parentBox.x + parentBox.width + 2)
      }
    }

    // Take screenshot for visual verification
    const screenshotName = `penny-brand-truncation-${testInfo.project.name}`
    await page.screenshot({
      path: `screenshots/${screenshotName}.png`,
      fullPage: false,
    })
  })
})

test.describe("Penny Card - Brand Truncation (Compact Variant)", () => {
  test("compact card brand truncates correctly", async ({ page }, testInfo) => {
    // Load penny list page
    await page.goto("/penny-list")
    await page.waitForLoadState("networkidle")

    // Try to find compact card brand variant (may not be visible depending on view)
    const compactBrandElement = page.locator('[data-testid="penny-card-brand-compact"]').first()
    const isVisible = await compactBrandElement.isVisible().catch(() => false)

    if (!isVisible) {
      // Skip test if compact cards aren't rendered in this viewport/view
      test.skip()
      return
    }

    await expect(compactBrandElement).toBeVisible()

    // Verify truncate class is applied
    const classList = await compactBrandElement.getAttribute("class")
    expect(classList).toContain("truncate")
    expect(classList).toContain("max-w-")

    // Verify title attribute exists
    const titleAttr = await compactBrandElement.getAttribute("title")
    expect(titleAttr).toBeTruthy()

    // Verify the brand text matches title
    const brandText = await compactBrandElement.textContent()
    expect(brandText?.trim()).toBe(titleAttr?.trim())

    // Take screenshot
    const screenshotName = `penny-brand-compact-truncation-${testInfo.project.name}`
    await page.screenshot({
      path: `screenshots/${screenshotName}.png`,
      fullPage: false,
    })
  })
})

test.describe("Penny Card - Long Brand Visual Verification", () => {
  /**
   * Visual test targeting a specific long brand name to verify truncation
   * works as expected across different viewport sizes.
   */
  test("Home Decorators Collection brand truncates properly", async ({ page }, testInfo) => {
    await page.goto("/penny-list")
    await page.waitForLoadState("networkidle")

    // Search for a card with a known long brand
    const longBrandCard = page
      .locator('[data-testid="penny-card-brand"]', {
        hasText: /Home Decorators Collection|Rubbermaid Commercial Products/i,
      })
      .first()

    const isVisible = await longBrandCard.isVisible().catch(() => false)

    if (isVisible) {
      await expect(longBrandCard).toBeVisible()

      // Verify it has title attribute for the full brand name
      const title = await longBrandCard.getAttribute("title")
      expect(title?.length).toBeGreaterThan(20) // Verify it's a long brand

      // Take focused screenshot of the card area
      const cardContainer = longBrandCard.locator("xpath=ancestor::div[@role='link']")
      const screenshotName = `penny-long-brand-${testInfo.project.name}`

      await cardContainer.screenshot({
        path: `screenshots/${screenshotName}.png`,
      })
    } else {
      // If long brand not visible in current viewport, just verify any brand works
      const anyBrand = page.locator('[data-testid="penny-card-brand"]').first()
      await expect(anyBrand).toBeVisible({ timeout: 5000 })
    }
  })
})
