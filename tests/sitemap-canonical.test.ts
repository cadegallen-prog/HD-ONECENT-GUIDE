import assert from "node:assert"
import test from "node:test"

import sitemap from "../app/sitemap"

test("sitemap includes canonical transparency route and excludes legacy support route", () => {
  const urls = sitemap().map((entry) => entry.url)

  assert.ok(urls.includes("https://www.pennycentral.com/transparency"))
  assert.ok(!urls.includes("https://www.pennycentral.com/support"))
})
