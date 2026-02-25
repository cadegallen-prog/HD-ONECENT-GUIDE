import assert from "node:assert"
import test from "node:test"

import { sanitizeEventParams } from "../lib/analytics"

test("remaps reserved acquisition-like keys to safe names", () => {
  const result = sanitizeEventParams({
    source: "nav-desktop",
    medium: "header",
    campaign: "spring_launch",
    skuMasked: "1234",
  })

  assert.deepStrictEqual(result, {
    ui_source: "nav-desktop",
    pc_source: "nav-desktop",
    pc_medium: "header",
    pc_campaign: "spring_launch",
    skuMasked: "1234",
  })
})

test("normalizes legacy src to ui_source", () => {
  const result = sanitizeEventParams({ src: "card", skuMasked: "9876" })

  assert.deepStrictEqual(result, {
    ui_source: "card",
    skuMasked: "9876",
  })
})

test("keeps explicit ui_source while still remapping source defensively", () => {
  const result = sanitizeEventParams({ ui_source: "hero-secondary", source: "legacy-key" })

  assert.deepStrictEqual(result, {
    ui_source: "hero-secondary",
    pc_source: "legacy-key",
  })
})

test("preserves explicit safe keys over remapped duplicates", () => {
  const result = sanitizeEventParams({ pc_source: "manual", source: "legacy-key" })

  assert.deepStrictEqual(result, {
    pc_source: "manual",
    ui_source: "legacy-key",
  })
})

test("removes sensitive report identifiers from payload params", () => {
  const result = sanitizeEventParams({
    sku: "1009258128",
    name: "Sensitive Name",
    itemName: "Sensitive Item",
    upc: "123456789012",
    internet_sku: 123456,
    skuMasked: "8128",
    ui_source: "card",
  })

  assert.deepStrictEqual(result, {
    skuMasked: "8128",
    ui_source: "card",
  })
})
