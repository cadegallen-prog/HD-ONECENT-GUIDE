import assert from "node:assert"
import test from "node:test"

import { PLACEHOLDER_IMAGE_URL } from "../lib/image-cache"
import type { SupabasePennyEnrichmentRow, SupabasePennyRow } from "../lib/fetch-penny-data"
import { installSupabaseMocks, clearSupabaseMocks } from "./test-utils/supabase-mocks"

const baseRow: SupabasePennyRow = {
  id: "row-1",
  item_name: "Test Item",
  home_depot_sku_6_or_10_digits: 1001220867,
  exact_quantity_found: 1,
  store_city_state: "GA",
  purchase_date: "2025-12-01",
  image_url: null,
  notes_optional: null,
  home_depot_url: null,
  internet_sku: null,
  timestamp: "2025-12-01T12:00:00Z",
  brand: null,
  model_number: null,
  upc: null,
  retail_price: null,
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
      internet_sku: 205744536,
      home_depot_url: "https://www.homedepot.com/p/custom",
    }),
  ])

  assert.strictEqual(items[0].internetNumber, "205744536")
  assert.strictEqual(items[0].homeDepotUrl, "https://www.homedepot.com/p/custom")

  clearSupabaseMocks()
})

test("merges SO SKU and regular SKU rows by shared internet SKU and prefers 6-digit display SKU", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, {
      id: "row-so",
      home_depot_sku_6_or_10_digits: "1001092170",
      internet_sku: 205654866,
      item_name: "Chamberlain Universal Wireless Garage Door Keypad",
      store_city_state: "Bridgewater, MA",
      timestamp: "2026-02-16T03:25:45.943Z",
    }),
    clone(baseRow, {
      id: "row-regular",
      home_depot_sku_6_or_10_digits: "684283",
      internet_sku: 205654866,
      item_name: "Universal Wireless Garage Door Keypad",
      store_city_state: "Manual Add",
      timestamp: "2026-02-17T06:20:45.861Z",
    }),
  ])

  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].sku, "684283")
  assert.strictEqual(items[0].internetNumber, "205654866")
  assert.deepStrictEqual(items[0].locations, { MA: 1 })

  clearSupabaseMocks()
})

test("applies enrichment metadata and overrides core fields", async () => {
  installSupabaseMocks({})
  const { buildPennyItemsFromRows, applyEnrichment } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, { image_url: "https://example.com/original.jpg" }),
  ])

  const enrichment: SupabasePennyEnrichmentRow = {
    sku: "1001220867",
    item_name: "Enriched Name",
    brand: "Acme",
    model_number: "MD-100",
    upc: "000123456789",
    image_url: "https://example.com/enriched.jpg",
    home_depot_url: "https://www.homedepot.com/p/enriched",
    internet_sku: 205744536,
    updated_at: "2025-12-10T00:00:00Z",
    retail_price: null,
  }

  const enrichedItems = applyEnrichment(items, [enrichment])

  assert.strictEqual(enrichedItems[0].name, "Enriched Name")
  assert.strictEqual(enrichedItems[0].brand, "Acme")
  assert.strictEqual(enrichedItems[0].modelNumber, "MD-100")
  assert.strictEqual(enrichedItems[0].upc, "000123456789")
  assert.strictEqual(enrichedItems[0].imageUrl, "https://example.com/enriched.jpg")
  assert.strictEqual(enrichedItems[0].internetNumber, "205744536")
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
    internet_sku: 205744536,
    updated_at: "2025-12-10T00:00:00Z",
    retail_price: null,
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
    clone(baseRow, { id: "row-valid", home_depot_sku_6_or_10_digits: "1001220867" }),
  ])

  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].sku, "1001220867")

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

test("last seen uses timestamp (submission time) over purchase_date for freshness", async () => {
  // "Last Seen" should reflect when someone reported the find (timestamp),
  // not when they claim they found it (purchase_date). This ensures freshness
  // signals reflect actual platform activity and prevents "phantom activity"
  // from backdated submissions.
  installSupabaseMocks({})
  const { buildPennyItemsFromRows } = await import("../lib/fetch-penny-data")

  const items = buildPennyItemsFromRows([
    clone(baseRow, {
      timestamp: "2025-12-10T12:34:56Z",
      purchase_date: "2022-09-01T00:00:00Z",
    }),
  ])

  assert.strictEqual(items[0].lastSeenAt, new Date("2025-12-10T12:34:56Z").toISOString())

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
