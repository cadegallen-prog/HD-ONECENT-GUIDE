import assert from "node:assert"
import test from "node:test"

import {
  MONUMETRIC_GUIDE_SECONDARY_SLOT_ID,
  MONUMETRIC_IN_CONTENT_SLOT_ID,
  MONUMETRIC_MOBILE_STICKY_SLOT_ID,
  MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID,
} from "../lib/ads/launch-config"
import { getActiveAdRoutePlan } from "../lib/ads/slot-plan"

test("returns no inventory on excluded routes", () => {
  const plan = getActiveAdRoutePlan("/report-find")

  assert.strictEqual(plan.policy.eligibility, "exclude")
  assert.deepStrictEqual(plan.inventory, [])
  assert.strictEqual(plan.providerManaged, false)
  assert.deepStrictEqual(plan.inContentSlotIds, [])
  assert.deepStrictEqual(plan.requeueSlotIds, [])
  assert.deepStrictEqual(plan.slotPolicies, {})
})

test("returns provider-managed inventory for /guide hub", () => {
  const plan = getActiveAdRoutePlan("/guide")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
  assert.deepStrictEqual(plan.inContentSlotIds, [
    MONUMETRIC_IN_CONTENT_SLOT_ID,
    MONUMETRIC_GUIDE_SECONDARY_SLOT_ID,
  ])
  assert.deepStrictEqual(plan.requeueSlotIds, [
    MONUMETRIC_IN_CONTENT_SLOT_ID,
    MONUMETRIC_GUIDE_SECONDARY_SLOT_ID,
  ])
  assert.deepStrictEqual(plan.slotPolicies, {
    [MONUMETRIC_IN_CONTENT_SLOT_ID]: {
      reserveMinHeightPx: 250,
      collapseAfterMs: 7000,
      maxPerRoute: 1,
      mobileEnabled: true,
      desktopEnabled: true,
    },
    [MONUMETRIC_GUIDE_SECONDARY_SLOT_ID]: {
      reserveMinHeightPx: 250,
      collapseAfterMs: 7000,
      maxPerRoute: 1,
      mobileEnabled: true,
      desktopEnabled: true,
    },
  })
})

test("returns provider-managed inventory for canonical guide chapter routes", () => {
  const plan = getActiveAdRoutePlan("/what-are-pennies")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
  assert.deepStrictEqual(plan.inContentSlotIds, [MONUMETRIC_IN_CONTENT_SLOT_ID])
  assert.deepStrictEqual(plan.requeueSlotIds, [MONUMETRIC_IN_CONTENT_SLOT_ID])
  assert.deepStrictEqual(plan.slotPolicies, {
    [MONUMETRIC_IN_CONTENT_SLOT_ID]: {
      reserveMinHeightPx: 250,
      collapseAfterMs: 7000,
      maxPerRoute: 1,
      mobileEnabled: true,
      desktopEnabled: true,
    },
  })
})

test("returns provider-managed inventory for legacy /guide chapter routes", () => {
  const plan = getActiveAdRoutePlan("/guide/what-are-pennies")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
  assert.deepStrictEqual(plan.inContentSlotIds, [])
  assert.deepStrictEqual(plan.requeueSlotIds, [])
  assert.deepStrictEqual(plan.slotPolicies, {})
})

test("returns provider-managed inventory for /penny-list", () => {
  const plan = getActiveAdRoutePlan("/penny-list")

  assert.strictEqual(plan.policy.eligibility, "allow")
  assert.deepStrictEqual(plan.inventory, ["provider_managed"])
  assert.strictEqual(plan.providerManaged, true)
  assert.deepStrictEqual(plan.inContentSlotIds, [MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID])
  assert.deepStrictEqual(plan.requeueSlotIds, [MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID])
  assert.deepStrictEqual(plan.slotPolicies, {
    [MONUMETRIC_PENNY_LIST_IN_CONTENT_SLOT_ID]: {
      reserveMinHeightPx: 250,
      collapseAfterMs: 7000,
      maxPerRoute: 1,
      mobileEnabled: true,
      desktopEnabled: true,
    },
    [MONUMETRIC_MOBILE_STICKY_SLOT_ID]: {
      reserveMinHeightPx: 50,
      collapseAfterMs: 7000,
      maxPerRoute: 1,
      mobileEnabled: true,
      desktopEnabled: false,
    },
  })
})

test("returns provider-managed inventory for dynamic utility routes", () => {
  const skuPlan = getActiveAdRoutePlan("/sku/1009258128")
  const statePlan = getActiveAdRoutePlan("/pennies/tx")

  assert.strictEqual(skuPlan.policy.eligibility, "allow")
  assert.deepStrictEqual(skuPlan.inventory, ["provider_managed"])
  assert.strictEqual(skuPlan.providerManaged, true)
  assert.deepStrictEqual(skuPlan.inContentSlotIds, [])
  assert.deepStrictEqual(skuPlan.requeueSlotIds, [])
  assert.deepStrictEqual(skuPlan.slotPolicies, {})

  assert.strictEqual(statePlan.policy.eligibility, "allow")
  assert.deepStrictEqual(statePlan.inventory, ["provider_managed"])
  assert.strictEqual(statePlan.providerManaged, true)
  assert.deepStrictEqual(statePlan.inContentSlotIds, [])
  assert.deepStrictEqual(statePlan.requeueSlotIds, [])
  assert.deepStrictEqual(statePlan.slotPolicies, {})
})

test("keeps unknown routes provider-managed unless hard-excluded", () => {
  const unknown = getActiveAdRoutePlan("/new-landing-page")

  assert.strictEqual(unknown.policy.eligibility, "allow")
  assert.deepStrictEqual(unknown.inventory, ["provider_managed"])
  assert.strictEqual(unknown.providerManaged, true)
  assert.deepStrictEqual(unknown.inContentSlotIds, [])
  assert.deepStrictEqual(unknown.requeueSlotIds, [])
  assert.deepStrictEqual(unknown.slotPolicies, {})
})
