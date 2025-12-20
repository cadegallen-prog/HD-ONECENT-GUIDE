import assert from "node:assert"
import test from "node:test"

import { PLACEHOLDER_IMAGE_URL } from "../lib/image-cache"
import { getPennyList } from "../lib/fetch-penny-data"

type FetchLike = typeof fetch

async function withMockSheets(
  mainCsv: string,
  opts: { enrichmentCsv?: string } = {},
  fn: () => Promise<void>
) {
  const originalFetch = globalThis.fetch
  const originalSheetUrl = process.env.GOOGLE_SHEET_URL
  const originalEnrichmentUrl = process.env.GOOGLE_SHEET_ENRICHMENT_URL

  const mainUrl = "https://example.invalid/sheet.csv"
  const enrichmentUrl = "https://example.invalid/enrichment.csv"

  process.env.GOOGLE_SHEET_URL = mainUrl

  if (opts.enrichmentCsv) {
    process.env.GOOGLE_SHEET_ENRICHMENT_URL = enrichmentUrl
  } else {
    delete process.env.GOOGLE_SHEET_ENRICHMENT_URL
  }

  globalThis.fetch = (async (input: RequestInfo | URL) => {
    const url =
      typeof input === "string" ? input : input instanceof Request ? input.url : input.toString()

    if (opts.enrichmentCsv && url === enrichmentUrl) {
      return new Response(opts.enrichmentCsv, { status: 200 })
    }

    if (url === mainUrl) {
      return new Response(mainCsv, { status: 200 })
    }

    throw new Error(`Unexpected fetch URL in test: ${url}`)
  }) as FetchLike

  try {
    await fn()
  } finally {
    globalThis.fetch = originalFetch
    if (originalSheetUrl === undefined) {
      delete process.env.GOOGLE_SHEET_URL
    } else {
      process.env.GOOGLE_SHEET_URL = originalSheetUrl
    }

    if (originalEnrichmentUrl === undefined) {
      delete process.env.GOOGLE_SHEET_ENRICHMENT_URL
    } else {
      process.env.GOOGLE_SHEET_ENRICHMENT_URL = originalEnrichmentUrl
    }
  }
}

test("parses canonical IMAGE URL + INTERNET SKU headers", async () => {
  const csv = `Timestamp,Email Address,Item Name,Home Depot SKU (6 or 10 digits),Exact Quantity Found,"Store (City, State)",Purchase Date,IMAGE URL,Notes (Optional),"INTERNET SKU"
12/1/2025 00:00:00,,Test Item,1000001234,1,TX,2025-12-01,https://images.thdstatic.com/productImages/test.jpg,Example note,123456789
`

  await withMockSheets(csv, {}, async () => {
    const items = await getPennyList()
    assert.strictEqual(items.length, 1)
    assert.strictEqual(items[0].sku, "1000001234")
    assert.strictEqual(items[0].imageUrl, "https://images.thdstatic.com/productImages/test.jpg")
    assert.strictEqual(items[0].internetNumber, "123456789")
  })
})

test("reuses the first non-empty IMAGE URL across duplicate SKUs", async () => {
  const csv = `Timestamp,Email Address,Item Name,Home Depot SKU (6 or 10 digits),Exact Quantity Found,"Store (City, State)",Purchase Date,IMAGE URL,Notes (Optional)
12/1/2025 00:00:00,,Test Item,1000001234,1,TX,2025-12-01,,First note
12/2/2025 00:00:00,,Test Item,1000001234,1,TX,2025-12-02,https://images.thdstatic.com/productImages/second.jpg,Second note
12/3/2025 00:00:00,,Test Item,1000001234,1,TX,2025-12-03,,Third note
`

  await withMockSheets(csv, {}, async () => {
    const items = await getPennyList()
    assert.strictEqual(items.length, 1)
    assert.strictEqual(items[0].sku, "1000001234")
    assert.strictEqual(items[0].imageUrl, "https://images.thdstatic.com/productImages/second.jpg")
  })
})

test("applies enrichment sheet values when base rows are missing", async () => {
  const mainCsv = `Timestamp,Email Address,Item Name,Home Depot SKU (6 or 10 digits),Exact Quantity Found,"Store (City, State)",Purchase Date,IMAGE URL,Notes (Optional),INTERNET SKU
12/1/2025 00:00:00,,Test Item,1000001234,1,TX,2025-12-01,,First note,
`
  const enrichmentCsv = `Home Depot SKU (6 or 10 digits),IMAGE URL,INTERNET SKU
1000001234,https://images.thdstatic.com/productImages/enriched.jpg,987654321
`

  await withMockSheets(mainCsv, { enrichmentCsv }, async () => {
    const items = await getPennyList()
    assert.strictEqual(items.length, 1)
    assert.strictEqual(items[0].imageUrl, "https://images.thdstatic.com/productImages/enriched.jpg")
    assert.strictEqual(items[0].internetNumber, "987654321")
  })
})

test("falls back to placeholder image when IMAGE URL is missing", async () => {
  const csv = `Timestamp,Email Address,Item Name,Home Depot SKU (6 or 10 digits),Exact Quantity Found,"Store (City, State)",Purchase Date,IMAGE URL,Notes (Optional)
12/1/2025 00:00:00,,Test Item,1000001234,1,TX,2025-12-01,,First note
`

  await withMockSheets(csv, {}, async () => {
    const items = await getPennyList()
    assert.strictEqual(items.length, 1)
    assert.strictEqual(items[0].imageUrl, PLACEHOLDER_IMAGE_URL)
  })
})
