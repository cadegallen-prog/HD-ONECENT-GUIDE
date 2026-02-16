import { test, expect } from "@playwright/test"
import { readFileSync } from "node:fs"
import path from "node:path"

function hasJsonLdType(value: unknown, type: string): boolean {
  if (!value) return false

  if (Array.isArray(value)) {
    return value.some((item) => hasJsonLdType(item, type))
  }

  if (typeof value === "object") {
    const record = value as Record<string, unknown>
    const atType = record["@type"]
    if (typeof atType === "string" && atType === type) return true
    if (Array.isArray(atType) && atType.includes(type)) return true
  }

  return false
}

test("SKU pages contain Product and Breadcrumb JSON-LD for top skus", async ({ page }) => {
  const fixturePath = path.join(process.cwd(), "data", "penny-list.json")
  const fixtureText = readFileSync(fixturePath, "utf8")
  const fixtureItems = JSON.parse(fixtureText) as Array<{ sku?: string }>
  const skus = fixtureItems
    .map((i) => i?.sku)
    .filter((v): v is string => Boolean(v))
    .slice(0, 2)

  expect(skus.length, "Fixture must contain at least one SKU").toBeGreaterThan(0)

  for (const sku of skus) {
    await page.goto(`/sku/${sku}`)
    const scripts = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((n) => n.textContent)
    )
    const jsons = scripts.map((s) => {
      try {
        return JSON.parse(s || "")
      } catch {
        return null
      }
    })
    const product = jsons.find(
      (j) =>
        j &&
        (j["@type"] === "Product" || (Array.isArray(j) && j.some((x) => x["@type"] === "Product")))
    )
    const hasBreadcrumb = jsons.some((j) => j && j["@type"] === "BreadcrumbList")

    expect(product).toBeTruthy()
    expect(hasBreadcrumb).toBeTruthy()
    // product should include sku and image
    if (product) {
      expect(product.sku || product["sku"]).toBeTruthy()
      const image = product.image || (product["image"] && (product["image"][0] || product["image"]))
      expect(image).toBeTruthy()
    }
  }
})

test("/guide contains CollectionPage, BreadcrumbList, FAQPage, and HowTo JSON-LD", async ({
  page,
}) => {
  await page.goto("/guide")

  const scripts = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
    nodes.map((n) => n.textContent)
  )

  const jsons = scripts
    .map((s) => {
      try {
        return JSON.parse(s || "")
      } catch {
        return null
      }
    })
    .filter(Boolean)

  expect(jsons.some((j) => hasJsonLdType(j, "CollectionPage"))).toBeTruthy()
  expect(jsons.some((j) => hasJsonLdType(j, "BreadcrumbList"))).toBeTruthy()
  expect(jsons.some((j) => hasJsonLdType(j, "FAQPage"))).toBeTruthy()
  expect(jsons.some((j) => hasJsonLdType(j, "HowTo"))).toBeTruthy()

  const faqPage = jsons.find((j) => hasJsonLdType(j, "FAQPage")) as
    | { mainEntity?: unknown[] }
    | undefined
  const howTo = jsons.find((j) => hasJsonLdType(j, "HowTo")) as { step?: unknown[] } | undefined

  expect(Array.isArray(faqPage?.mainEntity)).toBeTruthy()
  expect((faqPage?.mainEntity || []).length).toBeGreaterThanOrEqual(3)
  expect(Array.isArray(howTo?.step)).toBeTruthy()
  expect((howTo?.step || []).length).toBeGreaterThanOrEqual(4)
})
