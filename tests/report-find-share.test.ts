import assert from "node:assert"
import test from "node:test"
import { buildFacebookShareText } from "../lib/report-find-share"

test("builds stable SKU-only Facebook share text with city, state, and quantities", () => {
  const text = buildFacebookShareText(
    [
      { sku: "1009258128", quantity: null },
      { sku: "1002374965", quantity: 2 },
      { sku: "1010352067", quantity: 1 },
    ],
    {
      storeCity: "Atlanta",
      storeState: "GA",
      dateFound: "2026-03-03",
    }
  )

  assert.strictEqual(
    text,
    [
      "Atlanta, GA on 2026-03-03",
      "",
      "SKUs:",
      "- 1009-258-128",
      "- 1002-374-965 x2",
      "- 1010-352-067",
      "",
      "Report your own finds: https://www.pennycentral.com/report-find",
    ].join("\n")
  )
})

test("falls back to state-only context when city is blank", () => {
  const text = buildFacebookShareText([{ sku: "1009258128", quantity: null }], {
    storeCity: "   ",
    storeState: "FL",
    dateFound: "2026-03-03",
  })

  assert.strictEqual(
    text,
    [
      "FL on 2026-03-03",
      "",
      "SKUs:",
      "- 1009-258-128",
      "",
      "Report your own finds: https://www.pennycentral.com/report-find",
    ].join("\n")
  )
})

test("omits quantity when absent or one and keeps output SKU-only", () => {
  const text = buildFacebookShareText(
    [
      { sku: "1009258128", quantity: null },
      { sku: "1010352067", quantity: 1 },
      { sku: "1002374965", quantity: 3 },
    ],
    {
      storeCity: "Tampa",
      storeState: "FL",
      dateFound: "2026-03-01",
    }
  )

  assert.ok(!text.includes(" x1"))
  assert.ok(!text.includes("Item Name"))
  assert.ok(text.includes("- 1009-258-128"))
  assert.ok(text.includes("- 1010-352-067"))
  assert.ok(text.includes("- 1002-374-965 x3"))
  assert.ok(text.endsWith("Report your own finds: https://www.pennycentral.com/report-find"))
})
