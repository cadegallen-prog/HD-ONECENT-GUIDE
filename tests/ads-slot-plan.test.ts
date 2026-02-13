import assert from "node:assert"
import test from "node:test"

import { getActiveAdRoutePlan } from "../lib/ads/slot-plan"

test("returns no inventory on excluded routes", () => {
  const plan = getActiveAdRoutePlan("/report-find")

  assert.strictEqual(plan.policy.eligibility, "exclude")
  assert.deepStrictEqual(plan.inventory, [])
  assert.strictEqual(plan.providerManaged, false)
})

test("returns provider-managed inventory for /guide hub", () => {
  const plan = getActiveAdRoutePlan("/guide")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
})

test("returns provider-managed inventory for canonical guide chapter routes", () => {
  const plan = getActiveAdRoutePlan("/what-are-pennies")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
})

test("returns provider-managed inventory for legacy /guide chapter routes", () => {
  const plan = getActiveAdRoutePlan("/guide/what-are-pennies")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
})

test("returns provider-managed inventory for /penny-list", () => {
  const plan = getActiveAdRoutePlan("/penny-list")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
})

test("returns provider-managed inventory for dynamic utility routes", () => {
  const skuPlan = getActiveAdRoutePlan("/sku/1009258128")
  const statePlan = getActiveAdRoutePlan("/pennies/tx")

  assert.strictEqual(skuPlan.policy.eligibility, "allow")
  assert.deepStrictEqual(skuPlan.inventory, ["provider_managed"])
  assert.strictEqual(skuPlan.providerManaged, true)

  assert.strictEqual(statePlan.policy.eligibility, "allow")
  assert.deepStrictEqual(statePlan.inventory, ["provider_managed"])
  assert.strictEqual(statePlan.providerManaged, true)
})

test("keeps unknown routes provider-managed unless hard-excluded", () => {
  const unknown = getActiveAdRoutePlan("/new-landing-page")

  assert.strictEqual(unknown.policy.eligibility, "allow")
  assert.deepStrictEqual(unknown.inventory, ["provider_managed"])
  assert.strictEqual(unknown.providerManaged, true)
})
