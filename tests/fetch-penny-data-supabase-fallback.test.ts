import assert from "node:assert"
import test from "node:test"

import {
  createThenableMock,
  installSupabaseMocks,
  clearSupabaseMocks,
  createMockClient,
} from "./test-utils/supabase-mocks"

function createQueryBuilder(result: { data: unknown; error: unknown }) {
  const builder: any = {
    in: () => builder,
    or: () => builder,
    order: () => builder,
    limit: () => builder,
    then: (resolve: unknown, reject: unknown) =>
      Promise.resolve(result).then(
        resolve as (value: unknown) => unknown,
        reject as (reason: unknown) => unknown
      ),
  }
  return builder
}

function createTableAwareAnonMock(
  tableResults: Record<string, { data: unknown; error: unknown }>,
  requestedTables: string[]
) {
  return {
    from: (table: string) => {
      requestedTables.push(table)
      const result = tableResults[table] ?? {
        data: null,
        error: { message: `Unexpected table query: ${table}` },
      }
      return {
        select: () => createQueryBuilder(result),
        insert: async () => ({ error: null }),
      }
    },
  }
}

const basePennyListRow = {
  id: "row-1",
  purchase_date: "2026-02-24",
  item_name: "Item One",
  home_depot_sku_6_or_10_digits: "1009258128",
  exact_quantity_found: 1,
  store_city_state: "CA",
  image_url: "https://example.com/original.jpg",
  home_depot_url: null,
  internet_sku: null,
  timestamp: "2026-02-24T08:20:51.511Z",
  brand: "Unknown",
  model_number: null,
  upc: null,
  retail_price: null,
}

test("returns empty when anon view returns no rows", async () => {
  installSupabaseMocks({
    anon: createMockClient({
      select: () => createThenableMock({ data: [], error: null }),
    }),
  })

  // Dynamic import AFTER mocks are installed to avoid server-only error
  const { fetchPennyItemsFromSupabase } = await import("../lib/fetch-penny-data")

  const items = await fetchPennyItemsFromSupabase()
  assert.strictEqual(items.length, 0)

  clearSupabaseMocks()
})

test("hydrates enrichment overlay from enrichment_staging (item cache)", async () => {
  const requestedTables: string[] = []
  installSupabaseMocks({
    anon: createTableAwareAnonMock(
      {
        penny_list_public: { data: [basePennyListRow], error: null },
        enrichment_staging: {
          data: [
            {
              sku: "1009258128",
              item_name:
                "Modern 1-Spray 7.9 in. Dual Tub Wall Mount Fixed and Handheld Shower Heads 1.8 GPM in Matte Gold",
              brand: "Glacier Bay",
              upc: "012345678901",
              image_url: "https://example.com/canonical.jpg",
              home_depot_url: "https://www.homedepot.com/p/1009258128",
              internet_sku: 999000111,
              retail_price: 89.99,
              updated_at: "2026-02-17T06:08:45.434Z",
            },
          ],
          error: null,
        },
      },
      requestedTables
    ) as any,
  })

  const { fetchPennyItemsFromSupabase } = await import("../lib/fetch-penny-data")
  const items = await fetchPennyItemsFromSupabase()

  assert.strictEqual(items.length, 1)
  assert.strictEqual(
    items[0].name,
    "Modern 1-Spray 7.9 in. Dual Tub Wall Mount Fixed and Handheld Shower Heads 1.8 GPM in Matte Gold"
  )
  assert.strictEqual(items[0].brand, "Glacier Bay")
  assert.strictEqual(items[0].homeDepotUrl, "https://www.homedepot.com/p/1009258128")
  assert.ok(requestedTables.includes("enrichment_staging"))
  assert.ok(!requestedTables.includes("penny_item_enrichment"))

  clearSupabaseMocks()
})

test("falls back to legacy penny_item_enrichment when staging table is missing", async () => {
  const requestedTables: string[] = []
  installSupabaseMocks({
    anon: createTableAwareAnonMock(
      {
        penny_list_public: { data: [basePennyListRow], error: null },
        enrichment_staging: { data: null, error: { code: "PGRST205", message: "missing table" } },
        penny_item_enrichment: {
          data: [
            {
              sku: "1009258128",
              item_name: "Legacy Canonical Name",
              brand: "Legacy Brand",
              model_number: "LEGACY-01",
              upc: "000000000000",
              image_url: "https://example.com/legacy.jpg",
              home_depot_url: "https://www.homedepot.com/p/legacy",
              internet_sku: 111222333,
              retail_price: 49.99,
              updated_at: "2026-02-01T00:00:00.000Z",
            },
          ],
          error: null,
        },
      },
      requestedTables
    ) as any,
  })

  const { fetchPennyItemsFromSupabase } = await import("../lib/fetch-penny-data")
  const items = await fetchPennyItemsFromSupabase()

  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].name, "Legacy Canonical Name")
  assert.ok(requestedTables.includes("enrichment_staging"))
  assert.ok(requestedTables.includes("penny_item_enrichment"))

  clearSupabaseMocks()
})
