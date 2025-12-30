import assert from "node:assert"
import test from "node:test"

import { PLACEHOLDER_IMAGE_URL } from "../lib/image-cache"
import type { SupabasePennyEnrichmentRow, SupabasePennyRow } from "../lib/fetch-penny-data"
import { installSupabaseMocks, clearSupabaseMocks } from "./test-utils/supabase-mocks"

const baseRow: SupabasePennyRow = {
  id: "row-1",
  item_name: "Test Item",
  home_depot_sku_6_or_10_digits: 1000001234,
  exact_quantity_found: 1,
  store_city_state: "GA",
  purchase_date: "2025-12-01",
  image_url: null,
  notes_optional: null,
  home_depot_url: null,
  internet_sku: null,
  timestamp: "2025-12-01T12:00:00Z",
}

function clone(row: SupabasePennyRow, overrides: Partial<SupabasePennyRow>): SupabasePennyRow {
  return { ...row, ...overrides }
}

test("aggregates duplicate SKUs and prefers the latest timestamp for freshness + naming", async () => {
  installSupabaseMocks({}) // Install mocks to allow server-only import
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, {
      id: "row-1",
      item_name: "Older Name",
      store_city_state: "GA",
      timestamp: "2025-12-01T12:00:00Z",
    }),
    clone(baseRow, {
      id: "row-2",
      item_name: "Newest Name",
      store_city_state: "FL",
      timestamp: "2025-12-03T15:00:00Z",
    }),
  ])

  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].name, "Newest Name")
  assert.strictEqual(items[0].dateAdded, new Date("2025-12-03T15:00:00Z").toISOString())
  assert.deepStrictEqual(items[0].locations, { GA: 1, FL: 1 })

  clearSupabaseMocks()
})

test("reuses the first non-empty image and falls back to placeholder when absent", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, { image_url: "https://example.com/first.jpg" }),
    clone(baseRow, {
      id: "row-2",
      timestamp: "2025-12-02T00:00:00Z",
      image_url: "",
    }),
  ])

  assert.strictEqual(items[0].imageUrl, "https://example.com/first.jpg")

  const noImageItems = buildPennyItemsFromRows([clone(baseRow, { image_url: null })])
  assert.strictEqual(noImageItems[0].imageUrl, PLACEHOLDER_IMAGE_URL)

  clearSupabaseMocks()
})

test("stores enrichment fields from Supabase rows", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, {
      internet_sku: 987654321,
      home_depot_url: "https://www.homedepot.com/p/custom",
    }),
  ])

  assert.strictEqual(items[0].internetNumber, "987654321")
  assert.strictEqual(items[0].homeDepotUrl, "https://www.homedepot.com/p/custom")

  clearSupabaseMocks()
})

test("applies enrichment metadata and overrides core fields", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows, applyEnrichment } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, { image_url: "https://example.com/original.jpg" }),
  ])

  const enrichment: SupabasePennyEnrichmentRow = {
    sku: "1000001234",
    item_name: "Enriched Name",
    brand: "Acme",
    model_number: "MD-100",
    upc: "000123456789",
    image_url: "https://example.com/enriched.jpg",
    home_depot_url: "https://www.homedepot.com/p/enriched",
    internet_sku: 987654321,
    updated_at: "2025-12-10T00:00:00Z",
    source: "manual",
  }

  const enrichedItems = applyEnrichment(items, [enrichment])

  assert.strictEqual(enrichedItems[0].name, "Enriched Name")
  assert.strictEqual(enrichedItems[0].brand, "Acme")
  assert.strictEqual(enrichedItems[0].modelNumber, "MD-100")
  assert.strictEqual(enrichedItems[0].upc, "000123456789")
  assert.strictEqual(enrichedItems[0].imageUrl, "https://example.com/enriched.jpg")
  assert.strictEqual(enrichedItems[0].internetNumber, "987654321")
  assert.strictEqual(enrichedItems[0].homeDepotUrl, "https://www.homedepot.com/p/enriched")

  clearSupabaseMocks()
})

test("ignores enrichment rows with invalid SKUs", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows, applyEnrichment } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([clone(baseRow, { image_url: null })])

  const enrichment: SupabasePennyEnrichmentRow = {
    sku: "123",
    item_name: "Bad SKU",
    brand: "Bad",
    model_number: "BAD",
    upc: "000000000000",
    image_url: "https://example.com/bad.jpg",
    home_depot_url: "https://www.homedepot.com/p/bad",
    internet_sku: 123456,
    updated_at: "2025-12-10T00:00:00Z",
    source: "manual",
  }

  // Use hideUnenriched: false since this test is about SKU validation, not filtering
  const enrichedItems = applyEnrichment(items, [enrichment], { hideUnenriched: false })

  assert.strictEqual(enrichedItems[0].name, "Test Item")
  assert.strictEqual(enrichedItems[0].brand, undefined)

  clearSupabaseMocks()
})

test("filters out invalid SKUs and keeps valid rows only", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, { home_depot_sku_6_or_10_digits: "123" }), // invalid length
    clone(baseRow, { id: "row-valid", home_depot_sku_6_or_10_digits: "123456" }),
  ])

  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].sku, "123456")

  clearSupabaseMocks()
})

test("uses purchase_date when timestamp is missing or invalid", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, {
      timestamp: null,
      purchase_date: "2025-12-24",
    }),
    clone(baseRow, {
      id: "row-2",
      timestamp: "not-a-date",
      purchase_date: "2025-12-25",
    }),
  ])

  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].dateAdded, new Date("2025-12-25T00:00:00Z").toISOString())

  clearSupabaseMocks()
})

test("computes tier from aggregate report counts and state spread", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const manyReportsSameState = buildPennyItemsFromRows(
    Array.from({ length: 6 }, (_, idx) =>
      clone(baseRow, {
        id: `row-${idx + 1}`,
        store_city_state: "GA",
        timestamp: `2025-12-0${idx + 1}T12:00:00Z`,
      })
    )
  )
  assert.strictEqual(manyReportsSameState.length, 1)
  assert.strictEqual(manyReportsSameState[0].tier, "Very Common")

  const fourStates = buildPennyItemsFromRows([
    clone(baseRow, { store_city_state: "GA" }),
    clone(baseRow, { id: "row-2", store_city_state: "FL" }),
    clone(baseRow, { id: "row-3", store_city_state: "TX" }),
    clone(baseRow, { id: "row-4", store_city_state: "NC" }),
  ])
  assert.strictEqual(fourStates.length, 1)
  assert.strictEqual(fourStates[0].tier, "Very Common")

  clearSupabaseMocks()
})
