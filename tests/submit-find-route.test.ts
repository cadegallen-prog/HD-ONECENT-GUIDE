import assert from "node:assert"
import test from "node:test"
import { NextRequest } from "next/server"
import { installSupabaseMocks, clearSupabaseMocks } from "./test-utils/supabase-mocks"

test("inserts only allowed fields into Supabase", async () => {
  const inserted: Record<string, unknown>[] = []
  const insertSpy = async (payload: Record<string, unknown>) => {
    inserted.push(payload)
    return { error: null }
  }
  const mockClient = {
    from: () => ({ insert: insertSpy }),
  }

  installSupabaseMocks({ submitAnon: mockClient as any })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "123456",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: "2025-12-01",
      quantity: "2",
      notes: "Example note",
      website: "",
      imageUrl: "https://malicious.example/image.jpg",
      internetSku: "999999",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.10",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 200)
  const payload = inserted[0] as Record<string, unknown>
  assert.deepStrictEqual(payload, {
    item_name: "Test Item",
    home_depot_sku_6_or_10_digits: "123456",
    store_city_state: "Atlanta, GA",
    purchase_date: "2025-12-01",
    exact_quantity_found: 2,
    notes_optional: "Example note",
    timestamp: payload.timestamp,
  })
  assert.ok(typeof payload.timestamp === "string")
  clearSupabaseMocks()
})

test("falls back to service role insert when anon is RLS-blocked", async () => {
  const permissionError = {
    code: "42501",
    message: "new row violates row-level security policy for table Penny List",
  }

  const anonInserted: Record<string, unknown>[] = []
  const serviceInserted: Record<string, unknown>[] = []

  const anonClient = {
    from: () => ({
      insert: async (payload: Record<string, unknown>) => {
        anonInserted.push(payload)
        return { error: permissionError }
      },
    }),
  }

  const serviceClient = {
    from: () => ({
      insert: async (payload: Record<string, unknown>) => {
        serviceInserted.push(payload)
        return { error: null }
      },
    }),
  }

  installSupabaseMocks({ submitAnon: anonClient as any, submitServiceRole: serviceClient as any })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "123456",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: "2025-12-01",
      quantity: "2",
      notes: "Example note",
      website: "",
      imageUrl: "https://malicious.example/image.jpg",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.11",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 200)
  assert.strictEqual(anonInserted.length, 1)
  assert.strictEqual(serviceInserted.length, 1)
  assert.deepStrictEqual(serviceInserted[0], anonInserted[0])

  clearSupabaseMocks()
})

test("does not retry with service role when fallback disabled", async () => {
  process.env.SUPABASE_ALLOW_SERVICE_ROLE_FALLBACK = "0"

  const permissionError = {
    code: "42501",
    message: "new row violates row-level security policy for table Penny List",
  }

  const anonInserted: Record<string, unknown>[] = []
  const serviceInserted: Record<string, unknown>[] = []

  const anonClient = {
    from: () => ({
      insert: async (payload: Record<string, unknown>) => {
        anonInserted.push(payload)
        return { error: permissionError }
      },
    }),
  }

  const serviceClient = {
    from: () => ({
      insert: async (payload: Record<string, unknown>) => {
        serviceInserted.push(payload)
        return { error: null }
      },
    }),
  }

  installSupabaseMocks({ submitAnon: anonClient as any, submitServiceRole: serviceClient as any })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "123456",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: "2025-12-01",
      quantity: "2",
      notes: "Example note",
      website: "",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.12",
    },
  })

  const res = await POST(req)
  // When fallback disabled, the handler should not retry and should return 500
  assert.strictEqual(res.status, 500)
  assert.strictEqual(anonInserted.length, 1)
  assert.strictEqual(serviceInserted.length, 0)

  clearSupabaseMocks()
  delete process.env.SUPABASE_ALLOW_SERVICE_ROLE_FALLBACK
})
