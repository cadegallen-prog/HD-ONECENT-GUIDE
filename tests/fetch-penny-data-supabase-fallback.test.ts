import assert from "node:assert"
import test from "node:test"

import type { SupabasePennyRow, SupabasePennyEnrichmentRow } from "../lib/fetch-penny-data"
import {
  createThenableMock,
  installSupabaseMocks,
  clearSupabaseMocks,
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

  // Enrichment row matching the penny item SKU (required with hideUnenriched=true default)
  const enrichmentRow: SupabasePennyEnrichmentRow = {
    sku: "1000001234",
    item_name: "Fallback Item",
    brand: null,
    model_number: null,
    upc: null,
    image_url: null,
    home_depot_url: null,
    internet_sku: null,
    updated_at: "2025-12-01T12:00:00Z",
    source: "manual",
  }

  // Create table-aware mock clients
  const createTableAwareMock = (pennyData: unknown[], enrichmentData: unknown[]) => ({
    from: (table: string) => ({
      select: () =>
        createThenableMock({
          data: table === "penny_item_enrichment" ? enrichmentData : pennyData,
          error: null,
        }),
      insert: async () => ({ error: null }),
    }),
  })

  installSupabaseMocks({
    anon: createTableAwareMock([], []) as any,
    serviceRole: createTableAwareMock([row], [enrichmentRow]) as any,
  })

  // Dynamic import AFTER mocks are installed to avoid server-only error
  const { fetchPennyItemsFromSupabase } = await import("../lib/fetch-penny-data")

  const items = await fetchPennyItemsFromSupabase()
  assert.strictEqual(items.length, 1)
  assert.strictEqual(items[0].sku, "1000001234")
  assert.strictEqual(items[0].name, "Fallback Item")

  clearSupabaseMocks()
})
