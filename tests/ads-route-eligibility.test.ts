import assert from "node:assert"
import test from "node:test"

import {
  getAdRoutePolicy,
  isRouteAdEligible,
  normalizeRoutePath,
} from "../lib/ads/route-eligibility"

test("normalizes query strings and trailing slashes", () => {
  assert.strictEqual(normalizeRoutePath("/guide/?tab=1"), "/guide")
  assert.strictEqual(normalizeRoutePath("/penny-list/#top"), "/penny-list")
  assert.strictEqual(normalizeRoutePath(""), "/")
})

test("returns provider-managed allow policy for /penny-list", () => {
  const policy = getAdRoutePolicy("/penny-list")

  assert.strictEqual(policy.eligibility, "allow")
  assert.deepStrictEqual(policy.inventory, ["provider_managed"])
})

test("returns provider-managed allow policy for guide and utility routes", () => {
  const guidePolicy = getAdRoutePolicy("/what-are-pennies")
  const guideHubPolicy = getAdRoutePolicy("/guide")
  const skuPolicy = getAdRoutePolicy("/sku/1009258128")
  const statePolicy = getAdRoutePolicy("/pennies/tx")

  assert.strictEqual(guidePolicy.eligibility, "allow")
  assert.deepStrictEqual(guidePolicy.inventory, ["provider_managed"])

  assert.strictEqual(guideHubPolicy.eligibility, "allow")
  assert.deepStrictEqual(guideHubPolicy.inventory, ["provider_managed"])

  assert.strictEqual(skuPolicy.eligibility, "allow")
  assert.deepStrictEqual(skuPolicy.inventory, ["provider_managed"])

  assert.strictEqual(statePolicy.eligibility, "allow")
  assert.deepStrictEqual(statePolicy.inventory, ["provider_managed"])
})

test("returns exclude policy for protected/support/internal surfaces", () => {
  assert.strictEqual(getAdRoutePolicy("/report-find").eligibility, "exclude")
  assert.strictEqual(getAdRoutePolicy("/store-finder").eligibility, "exclude")
  assert.strictEqual(getAdRoutePolicy("/api/penny-list").eligibility, "exclude")
  assert.strictEqual(getAdRoutePolicy("/lists/abc123").eligibility, "exclude")
  assert.strictEqual(getAdRoutePolicy("/auth/callback").eligibility, "exclude")
  assert.strictEqual(getAdRoutePolicy("/privacy-policy").eligibility, "exclude")
})

test("defaults unknown routes to provider-managed allow", () => {
  const policy = getAdRoutePolicy("/unknown-future-route")

  assert.strictEqual(policy.eligibility, "allow")
  assert.deepStrictEqual(policy.inventory, ["provider_managed"])
  assert.strictEqual(isRouteAdEligible("/unknown-future-route"), true)
})

test("flags exclusion and eligibility correctly", () => {
  assert.strictEqual(isRouteAdEligible("/report-find"), false)
  assert.strictEqual(isRouteAdEligible("/api/penny-list"), false)
  assert.strictEqual(isRouteAdEligible("/guide"), true)
})
