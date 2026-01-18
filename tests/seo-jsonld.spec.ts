import { test, expect } from "@playwright/test"
import { readFileSync } from "node:fs"
import path from "node:path"

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
