import assert from "node:assert"
import {
  computeFreshnessMetrics,
  extractStateFromLocation,
  filterValidPennyItems,
  formatRelativeDate,
} from "../lib/penny-list-utils"
import type { PennyItem } from "../lib/fetch-penny-data"

const baseItem: PennyItem = {
  id: "1",
  name: "Test Item",
  sku: "1001220867",
  price: 0.01,
  dateAdded: "2025-12-10",
  tier: "Rare",
  status: "",
  quantityFound: "",
  imageUrl: "",
  notes: "",
  locations: {},
}

function clone(item: PennyItem, overrides: Partial<PennyItem>): PennyItem {
  return { ...item, ...overrides }
}

// State extraction
assert.strictEqual(extractStateFromLocation("Dallas, TX"), "TX")
assert.strictEqual(extractStateFromLocation("Store 123 - Phoenix AZ"), "AZ")
assert.strictEqual(extractStateFromLocation("Miami, fl"), "FL")
assert.strictEqual(extractStateFromLocation("Anchorage, Alaska"), "AK")
assert.strictEqual(extractStateFromLocation("CA"), "CA")
assert.strictEqual(extractStateFromLocation("Houston TX 77001"), "TX")
assert.strictEqual(extractStateFromLocation(""), "")

// Validation gating
const validItems = filterValidPennyItems([
  clone(baseItem, {}),
  clone(baseItem, { id: "2", sku: "", name: "Missing SKU" }),
  clone(baseItem, { id: "3", sku: "999999", dateAdded: "invalid-date" }),
])
assert.strictEqual(validItems.length, 1)
assert.strictEqual(validItems[0].sku, "1001220867")

// Freshness metrics
const now = new Date("2025-12-10T12:00:00Z").getTime()
const metrics = computeFreshnessMetrics(
  [
    clone(baseItem, { dateAdded: "2025-12-10" }),
    clone(baseItem, { id: "2", dateAdded: "2025-12-09" }),
    clone(baseItem, { id: "3", dateAdded: "2025-11-15" }),
  ],
  now
)
assert.deepStrictEqual(metrics, { newLast24h: 1, totalLast30d: 3 })

// Freshness metrics - edge cases
const edgeMetrics = computeFreshnessMetrics(
  [
    clone(baseItem, { dateAdded: "2025-12-10" }), // Today
    clone(baseItem, { id: "2", dateAdded: "2025-12-10" }), // Today (duplicate)
    clone(baseItem, { id: "3", dateAdded: "2025-11-11" }), // 29 days ago (within window)
    clone(baseItem, { id: "4", dateAdded: "2025-11-09" }), // 31 days ago (outside window)
    clone(baseItem, { id: "5", dateAdded: "invalid" }), // Invalid date
  ],
  now
)
assert.deepStrictEqual(edgeMetrics, { newLast24h: 2, totalLast30d: 3 })

// Relative date formatting
assert.strictEqual(formatRelativeDate("2025-12-10", new Date("2025-12-10")), "Today")
assert.strictEqual(formatRelativeDate("2025-12-09", new Date("2025-12-10")), "Yesterday")
assert.strictEqual(formatRelativeDate("2025-11-30", new Date("2025-12-10")), "10 days ago")
assert.strictEqual(formatRelativeDate("2025-09-15", new Date("2025-12-10")), "Sep 14")

// Relative date formatting - edge cases
assert.strictEqual(formatRelativeDate("2025-12-08", new Date("2025-12-10")), "2 days ago")
assert.strictEqual(formatRelativeDate("2025-11-26", new Date("2025-12-10")), "14 days ago")
assert.strictEqual(formatRelativeDate("2025-11-25", new Date("2025-12-10")), "Nov 24")
assert.strictEqual(formatRelativeDate("invalid-date", new Date("2025-12-10")), "invalid-date")
assert.strictEqual(formatRelativeDate("2025-12-11", new Date("2025-12-10")), "Dec 10")

// Validation - comprehensive edge cases
const complexValidation = filterValidPennyItems([
  clone(baseItem, { id: "1" }), // Valid
  clone(baseItem, { id: "2", name: "  " }), // Whitespace name
  clone(baseItem, { id: "3", sku: "  " }), // Whitespace SKU
  clone(baseItem, { id: "4", name: "Valid", sku: "999", dateAdded: "" }), // Empty date
  clone(baseItem, { id: "5", name: "Valid", sku: "888", dateAdded: "2025-13-32" }), // Invalid date format
])
assert.strictEqual(complexValidation.length, 1)
assert.strictEqual(complexValidation[0].id, "1")

console.log("✅ All penny-list-utils tests passed")
