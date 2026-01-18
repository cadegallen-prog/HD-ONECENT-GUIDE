import assert from "node:assert"
import test from "node:test"

import { getHomeDepotProductUrl } from "../lib/home-depot"

test("uses internet SKU for direct product links when available", () => {
  const url = getHomeDepotProductUrl({ sku: "1001220867", internetNumber: "205744536" })
  assert.strictEqual(url, "https://www.homedepot.com/p/205744536")
})

test("prefers manual Home Depot URL when provided", () => {
  const url = getHomeDepotProductUrl({
    sku: "1001220867",
    internetNumber: "205744536",
    homeDepotUrl: "https://www.homedepot.com/p/custom-link",
  })
  assert.strictEqual(url, "https://www.homedepot.com/p/custom-link")
})

test("falls back to SKU search when internet SKU is missing", () => {
  const url = getHomeDepotProductUrl({ sku: "1001220867" })
  assert.strictEqual(url, "https://www.homedepot.com/s/1001220867")
})

test("returns homepage when no identifiers are present", () => {
  const url = getHomeDepotProductUrl({})
  assert.strictEqual(url, "https://www.homedepot.com/")
})
