import { test, expect } from '@playwright/test'

test('SKU pages contain Product and Breadcrumb JSON-LD for top skus', async ({ page }) => {
  const skus = ['1009876543', '1000001234']
  for (const sku of skus) {
    await page.goto(`/sku/${sku}`)
    const scripts = await page.$$eval('script[type="application/ld+json"]', (nodes) => nodes.map((n) => n.textContent))
    const jsons = scripts.map((s) => { try { return JSON.parse(s || '') } catch (e) { return null } })
    const product = jsons.find((j) => j && (j['@type'] === 'Product' || (Array.isArray(j) && j.some((x) => x['@type'] === 'Product'))))
    const hasBreadcrumb = jsons.some((j) => j && j['@type'] === 'BreadcrumbList')

    expect(product).toBeTruthy()
    expect(hasBreadcrumb).toBeTruthy()
    // product should include sku and image
    if (product) {
      expect(product.sku || product['sku']).toBeTruthy()
      const image = product.image || (product['image'] && (product['image'][0] || product['image']))
      expect(image).toBeTruthy()
    }
  }
})