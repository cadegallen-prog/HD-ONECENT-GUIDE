import { expect, test, type Page } from "@playwright/test"

type OverflowSnapshot = {
  innerWidth: number
  documentWidth: number
  bodyWidth: number
}

async function assertNoHorizontalOverflow(page: Page) {
  const snapshot = await page.evaluate<OverflowSnapshot>(() => ({
    innerWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body?.scrollWidth ?? 0,
  }))

  expect(snapshot.documentWidth).toBeLessThanOrEqual(snapshot.innerWidth + 1)
  expect(snapshot.bodyWidth).toBeLessThanOrEqual(snapshot.innerWidth + 1)
}

async function getNavbarState(page: Page) {
  return page.evaluate(() => {
    const nav = document.querySelector("nav")
    if (!(nav instanceof HTMLElement)) {
      return null
    }

    const rect = nav.getBoundingClientRect()
    const transform = getComputedStyle(nav).transform

    return {
      top: rect.top,
      bottom: rect.bottom,
      transform,
    }
  })
}

test.describe("mobile chrome collapse behavior", () => {
  test("mobile /penny-list hides and restores both top bars smoothly", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "This behavior is mobile-specific.")

    await page.goto("/penny-list")
    await page.waitForSelector('[data-mobile-utility-bar="true"]')
    await page.waitForTimeout(600)
    await assertNoHorizontalOverflow(page)

    await page.evaluate(() => window.scrollTo({ top: 280, behavior: "instant" }))
    await page.waitForTimeout(250)

    const hiddenNavbar = await getNavbarState(page)
    expect(hiddenNavbar).not.toBeNull()
    expect(hiddenNavbar?.bottom ?? 999).toBeLessThanOrEqual(2)

    const hiddenBarTransform = await page
      .locator('[data-mobile-utility-bar="true"]')
      .evaluate((el) => {
        return getComputedStyle(el as HTMLElement).transform
      })
    expect(hiddenBarTransform).not.toBe("none")

    await page.evaluate(() => window.scrollTo({ top: 20, behavior: "instant" }))
    await page.waitForTimeout(250)

    const visibleNavbar = await getNavbarState(page)
    expect(visibleNavbar).not.toBeNull()
    expect(visibleNavbar?.top ?? -999).toBeGreaterThanOrEqual(-1)

    await assertNoHorizontalOverflow(page)
  })

  test("mobile non-penny routes keep the primary navbar visible", async ({ page, isMobile }) => {
    test.skip(!isMobile, "This behavior is mobile-specific.")

    await page.goto("/guide")
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo({ top: 320, behavior: "instant" }))
    await page.waitForTimeout(250)

    const navbar = await getNavbarState(page)
    expect(navbar).not.toBeNull()
    expect(navbar?.top ?? -999).toBeGreaterThanOrEqual(-1)
    await assertNoHorizontalOverflow(page)
  })

  test("desktop /penny-list never applies mobile navbar collapse", async ({ page, isMobile }) => {
    test.skip(isMobile, "Desktop-only assertion.")

    await page.goto("/penny-list")
    await page.waitForTimeout(300)
    await page.evaluate(() => window.scrollTo({ top: 420, behavior: "instant" }))
    await page.waitForTimeout(250)

    const navbar = await getNavbarState(page)
    expect(navbar).not.toBeNull()
    expect(navbar?.top ?? -999).toBeGreaterThanOrEqual(-1)
    await assertNoHorizontalOverflow(page)
  })
})
