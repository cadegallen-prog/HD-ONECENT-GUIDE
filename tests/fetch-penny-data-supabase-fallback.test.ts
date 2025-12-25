import assert from "node:assert"
import test from "node:test"

import type { SupabasePennyRow } from "../lib/fetch-penny-data"
import {
  createThenableMock,
  installSupabaseMocks,
  clearSupabaseMocks,
  createMockClient,
} from "./test-utils/supabase-mocks"

test("falls back to service role read when anon returns empty", async () => {
  const row: SupabasePennyRow = {
    id: "row-1",
    item_name: "Fallback Item",
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

  installSupabaseMocks({
    anon: createMockClient({
      select: () => createThenableMock({ data: [], error: null }),
    }),
    serviceRole: createMockClient({
      select: () => createThenableMock({ data: [row], error: null }),
    }),
  })

  // Dynamic import AFTER mocks are installed to avoid server-only error
  const { fetchPennyItemsFromSupabase } = await import("../lib/fetch-penny-data")

  const items = await fetchPennyItemsFromSupabase()
  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].sku, "1000001234")
  assert.strictEqual(items[0].name, "Fallback Item")

  clearSupabaseMocks()
})
