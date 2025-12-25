import assert from "node:assert"
import test from "node:test"

import { getHomeDepotProductUrl } from "../lib/home-depot"

test("uses internet SKU for direct product links when available", () => {
  const url = getHomeDepotProductUrl({ sku: "123456", internetNumber: "987654321" })
  assert.strictEqual(url, "https://www.homedepot.com/p/987654321")
})

test("prefers manual Home Depot URL when provided", () => {
  const url = getHomeDepotProductUrl({
    sku: "123456",
    internetNumber: "987654321",
    homeDepotUrl: "https://www.homedepot.com/p/custom-link",
  })
  assert.strictEqual(url, "https://www.homedepot.com/p/custom-link")
})

test("falls back to SKU search when internet SKU is missing", () => {
  const url = getHomeDepotProductUrl({ sku: "123456" })
  assert.strictEqual(url, "https://www.homedepot.com/s/123456")
})

test("returns homepage when no identifiers are present", () => {
  const url = getHomeDepotProductUrl({})
  assert.strictEqual(url, "https://www.homedepot.com/")
})
