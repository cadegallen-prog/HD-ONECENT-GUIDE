import assert from "node:assert"
import test from "node:test"
import { isLowQualityItemName, shouldPreferEnrichedName } from "../lib/item-name-quality"

test("flags generic single-descriptor names as low quality", () => {
  assert.strictEqual(isLowQualityItemName("Coast headlamp", "Coast"), true)
  assert.strictEqual(isLowQualityItemName("headlamp"), true)
  assert.strictEqual(isLowQualityItemName("drill"), true)
})

test("accepts detailed model-rich names as high quality", () => {
  assert.strictEqual(
    isLowQualityItemName(
      "Coast FLX65R 700 Lumen Bilingual Voice Control Rechargeable LED Headlamp",
      "Coast"
    ),
    false
  )
  assert.strictEqual(
    isLowQualityItemName("Milwaukee M18 FUEL Hammer Drill/Driver Kit", "Milwaukee"),
    false
  )
})

test("prefers enriched candidate when current name is low quality", () => {
  assert.strictEqual(
    shouldPreferEnrichedName(
      "Coast headlamp",
      "Coast FLX65R 700 Lumen Bilingual Voice Control Rechargeable LED Headlamp",
      "Coast"
    ),
    true
  )
})

test("keeps current name when candidate is lower quality", () => {
  assert.strictEqual(
    shouldPreferEnrichedName(
      "Coast FLX65R 700 Lumen Bilingual Voice Control Rechargeable LED Headlamp",
      "Coast headlamp",
      "Coast"
    ),
    false
  )
})
