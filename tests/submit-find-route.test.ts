import assert from "node:assert"
import test from "node:test"
import { NextRequest } from "next/server"
import { installSupabaseMocks, clearSupabaseMocks } from "./test-utils/supabase-mocks"

test("inserts only allowed fields into Supabase", async () => {
  const inserted: Record<string, unknown>[] = []
  const anonReadClient: any = {
    from: () => ({}),
  }
  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-123" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: new Date().toISOString().split("T")[0],
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
    home_depot_sku_6_or_10_digits: "1009876543",
    store_city_state: "Atlanta, GA",
    purchase_date: new Date().toISOString().split("T")[0],
    exact_quantity_found: 2,
    notes_optional: "Example note",
    timestamp: payload.timestamp,
  })
  assert.ok(typeof payload.timestamp === "string")
  clearSupabaseMocks()
})

test("uses service role insert (works even when anon inserts are blocked)", async () => {
  const anonInserted: Record<string, unknown>[] = []
  const serviceInserted: Record<string, unknown>[] = []

  const anonReadClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        anonInserted.push(payload)
        return {
          select: () => ({
            single: async () => ({
              data: null,
              error: { code: "42501", message: "anon insert should not be used" },
            }),
          }),
        }
      },
    }),
  }
  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        serviceInserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-456" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: new Date().toISOString().split("T")[0],
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
  assert.strictEqual(serviceInserted.length, 1)
  assert.strictEqual(anonInserted.length, 0)

  clearSupabaseMocks()
})

test("always overwrites item_name with enrichment canonical name", async () => {
  const inserted: Record<string, unknown>[] = []

  // Mock anon client with enrichment lookup that returns canonical name
  const anonReadClient: any = {
    from: () => ({
      select: () => ({
        eq: () => ({
          limit: () => ({
            maybeSingle: async () => ({
              data: {
                item_name: "Milwaukee M18 FUEL Hammer Drill/Driver Kit",  // Canonical
                brand: "Milwaukee",
                retail_price: 199.00,
                image_url: "https://example.com/image.jpg",
              },
              error: null,
            }),
          }),
        }),
      }),
    }),
  }

  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-overwrite" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "drill",  // User-provided (incomplete)
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: new Date().toISOString().split("T")[0],
      quantity: "1",
      notes: "",
      website: "",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.30",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 200)
  const payload = inserted[0] as Record<string, unknown>

  // Verify canonical name from enrichment is used (NOT user input)
  assert.strictEqual(
    payload.item_name,
    "Milwaukee M18 FUEL Hammer Drill/Driver Kit",
    "Should use canonical name from enrichment, not user input"
  )

  // Verify enrichment fields are included
  assert.strictEqual(payload.brand, "Milwaukee")
  assert.strictEqual(payload.retail_price, 199.00)
  assert.strictEqual(payload.image_url, "https://example.com/image.jpg")

  clearSupabaseMocks()
})

// Date validation tests
test("accepts date from 15 days ago", async () => {
  const inserted: Record<string, unknown>[] = []
  const anonReadClient: any = {
    from: () => ({}),
  }
  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-15days" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const fifteenDaysAgo = new Date()
  fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15)
  const dateStr = fifteenDaysAgo.toISOString().split("T")[0]

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: dateStr,
      quantity: "1",
      notes: "",
      website: "",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.20",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 200, "Should accept date from 15 days ago")
  assert.strictEqual(inserted.length, 1)
  clearSupabaseMocks()
})

test("rejects date from 31 days ago", async () => {
  const inserted: Record<string, unknown>[] = []
  const anonReadClient: any = {
    from: () => ({}),
  }
  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-31days" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const thirtyOneDaysAgo = new Date()
  thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31)
  const dateStr = thirtyOneDaysAgo.toISOString().split("T")[0]

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: dateStr,
      quantity: "1",
      notes: "",
      website: "",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.21",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 400, "Should reject date from 31 days ago")
  const data = await res.json()
  assert.ok(data.error.includes("30 days"), "Error should mention 30-day limit")
  assert.strictEqual(inserted.length, 0, "Should not insert rejected submission")
  clearSupabaseMocks()
})

test("rejects future date", async () => {
  const inserted: Record<string, unknown>[] = []
  const anonReadClient: any = {
    from: () => ({}),
  }
  const serviceRoleClient: any = {
    from: () => ({
      insert: (payload: Record<string, unknown>) => {
        inserted.push(payload)
        return {
          select: () => ({
            single: async () => ({ data: { id: "test-uuid-future" }, error: null }),
          }),
        }
      },
    }),
    rpc: async () => ({ data: { enriched: false }, error: null }),
  }

  installSupabaseMocks({ submitAnon: anonReadClient, submitServiceRole: serviceRoleClient })

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const dateStr = tomorrow.toISOString().split("T")[0]

  const { POST } = await import("../app/api/submit-find/route")
  const req = new NextRequest("http://localhost/api/submit-find", {
    method: "POST",
    body: JSON.stringify({
      itemName: "Test Item",
      sku: "1009876543",
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: dateStr,
      quantity: "1",
      notes: "",
      website: "",
    }),
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "203.0.113.22",
    },
  })

  const res = await POST(req)
  assert.strictEqual(res.status, 400, "Should reject future date")
  const data = await res.json()
  assert.ok(data.error.includes("future"), "Error should mention future date")
  assert.strictEqual(inserted.length, 0, "Should not insert rejected submission")
  clearSupabaseMocks()
})
