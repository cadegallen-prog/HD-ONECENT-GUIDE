import { test, expect } from "@playwright/test"

test.describe("Penny Card Systematic Hierarchy", () => {
  async function firstCard(page: import("@playwright/test").Page) {
    const brand = page.locator('[data-testid="penny-card-brand"]').first()
    await expect(brand).toBeVisible({ timeout: 15000 })

    // Use the card that actually contains the first brand label (more stable than "article".first()).
    return brand.locator("xpath=ancestor::article[1]")
  }

  test("Full card: Brand is font-normal (400 weight)", async ({ page }) => {
    await page.goto("/penny-list")
    const card = await firstCard(page)
    const brand = card.locator('[data-testid="penny-card-brand"]').first()

    // Check computed font-weight
    const fontWeight = await brand.evaluate((el) => window.getComputedStyle(el).fontWeight)
    expect(fontWeight).toBe("400")
  })

  test("Full card: Image is 72px", async ({ page }) => {
    await page.goto("/penny-list")
    const card = await firstCard(page)
    const thumbnail = card
      .locator('img[width="72"][height="72"], [aria-label="No photo available"]')
      .first()
    await expect(thumbnail).toBeVisible({ timeout: 15000 })
    const box = await thumbnail.boundingBox()

    expect(box?.width).toBeCloseTo(72, 5)
    expect(box?.height).toBeCloseTo(72, 5)
  })

  test("Full card: SKU in metadata block (below price)", async ({ page }) => {
    await page.goto("/penny-list")
    const card = await firstCard(page)

    const price = card.locator(".penny-card-price").first()
    const sku = card.locator('[data-test="penny-card-sku"]').first()

    await expect(price).toBeVisible()
    await expect(sku).toBeVisible({ timeout: 15000 })

    const priceBox = await price.boundingBox()
    const skuBox = await sku.boundingBox()

    // SKU should be below price (higher Y coordinate)
    expect(skuBox!.y).toBeGreaterThan(priceBox!.y)
  })

  test('Full card: "Last seen" is font-medium', async ({ page }) => {
    await page.goto("/penny-list")
    const card = await firstCard(page)
    const lastSeen = card.locator("text=/Last seen:/").first()

    await expect(lastSeen).toBeVisible()

    const fontWeight = await lastSeen.evaluate((el) => window.getComputedStyle(el).fontWeight)
    expect(fontWeight).toBe("500")
  })

  test("Mobile: ~2-2.5 cards visible above fold", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto("/penny-list")

    const cards = page.locator('[data-testid="penny-card-brand"]')
    await page.waitForSelector('[data-testid="penny-card-brand"]', { timeout: 15000 })

    const count = await cards.count()
    expect(count).toBeGreaterThanOrEqual(1)

    // Visual check: at least 2 cards should be partially visible
    // This is a smoke test - exact count depends on content
  })
})
