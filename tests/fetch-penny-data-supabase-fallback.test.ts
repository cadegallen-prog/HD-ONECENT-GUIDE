import assert from "node:assert"
import test from "node:test"

import {
  createThenableMock,
  installSupabaseMocks,
  clearSupabaseMocks,
  createMockClient,
} from "./test-utils/supabase-mocks"

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
