import { test, expect } from "@playwright/test"

test("verified pennies: SKU image loads", async ({ page }) => {
  await page.goto("/verified-pennies")

  const search = page.getByRole("searchbox", { name: /search verified penny items/i })
  await expect(search).toBeVisible()

  await search.fill("613231")

  const card = page.locator("a", { hasText: "SKU: 613231" }).first()
  await expect(card).toBeVisible()

  const img = card.locator("img").first()
  await expect(img).toBeVisible()

  await expect(img).toHaveAttribute("src", /_next\/image\?url=.*images\.thdstatic\.com/i)

  const imgHandle = await img.elementHandle()
  expect(imgHandle).not.toBeNull()
  await page.waitForFunction((el) => {
    const imgEl = el as HTMLImageElement
    return Boolean(imgEl && imgEl.complete && imgEl.naturalWidth > 0)
  }, imgHandle)
})
