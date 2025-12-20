import assert from "node:assert"
import test from "node:test"
import { NextRequest } from "next/server"

import { POST } from "../app/api/submit-find/route"

test("tampered enrichment fields are stripped and blanked before sheet append", async () => {
  const originalFetch = global.fetch
  const originalAppsScriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL

  let capturedBody: Record<string, unknown> | null = null

  process.env.GOOGLE_APPS_SCRIPT_URL = "https://example.invalid/script"
  global.fetch = (async (_input, init) => {
    if (init?.body && typeof init.body === "string") {
      capturedBody = JSON.parse(init.body)
    }
    return new Response("ok", { status: 200 })
  }) as typeof fetch

  try {
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
      },
    })

    const res = await POST(req)
    assert.strictEqual(res.status, 200)
    assert.ok(capturedBody, "expected sheet payload to be captured")
    assert.strictEqual(capturedBody?.["IMAGE URL"], "")
    assert.strictEqual(capturedBody?.["INTERNET SKU"], "")
    assert.strictEqual(capturedBody?.SKU, "123456")
    assert.strictEqual(capturedBody?.["Item Name"], "Test Item")
    assert.ok(!("imageUrl" in (capturedBody as Record<string, unknown>)))
    assert.ok(!("internetSku" in (capturedBody as Record<string, unknown>)))
  } finally {
    global.fetch = originalFetch
    if (originalAppsScriptUrl === undefined) {
      delete process.env.GOOGLE_APPS_SCRIPT_URL
    } else {
      process.env.GOOGLE_APPS_SCRIPT_URL = originalAppsScriptUrl
    }
  }
})
