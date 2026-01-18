import assert from "node:assert"
import { queryPennyItems, getHotItems } from "../lib/penny-list-query"
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

const now = new Date("2025-12-10T12:00:00Z").getTime()

// Basic filtering - no filters returns all items within window
const items = [
  clone(baseItem, { id: "1", dateAdded: "2025-12-10" }),
  clone(baseItem, { id: "2", dateAdded: "2025-12-09" }),
  clone(baseItem, { id: "3", dateAdded: "2025-11-15" }),
]
const resultAll = queryPennyItems(items, {}, now)
assert.strictEqual(resultAll.total, 3, "Should return all 3 items with no filters")

// Date range filtering - 1 month window (Dec 10 - 1 month = Nov 10, so Nov 15 is within window)
const result1m = queryPennyItems(items, { days: "1m" }, now)
assert.strictEqual(
  result1m.total,
  3,
  "1m window should return all 3 items (Nov 15 is within Nov 10-Dec 10)"
)

// Date range filtering - verify old items are excluded
const itemsWithOld = [
  clone(baseItem, { id: "1", dateAdded: "2025-12-10" }),
  clone(baseItem, { id: "2", dateAdded: "2025-10-01" }), // 70+ days old, outside 1m window
]
const result1mFiltered = queryPennyItems(itemsWithOld, { days: "1m" }, now)
assert.strictEqual(result1mFiltered.total, 1, "1m window should exclude items older than 1 month")

// State filtering
const itemsWithStates = [
  clone(baseItem, { id: "1", locations: { TX: 1, CA: 1 } }),
  clone(baseItem, { id: "2", locations: { TX: 2 } }),
  clone(baseItem, { id: "3", locations: { FL: 1 } }),
]
const resultTX = queryPennyItems(itemsWithStates, { state: "TX" }, now)
assert.strictEqual(resultTX.total, 2, "TX filter should return 2 items")

const resultFL = queryPennyItems(itemsWithStates, { state: "FL" }, now)
assert.strictEqual(resultFL.total, 1, "FL filter should return 1 item")

const resultNY = queryPennyItems(itemsWithStates, { state: "NY" }, now)
assert.strictEqual(resultNY.total, 0, "NY filter should return 0 items")

// Tier filtering
const itemsWithTiers = [
  clone(baseItem, { id: "1", tier: "Very Common" }),
  clone(baseItem, { id: "2", tier: "Common" }),
  clone(baseItem, { id: "3", tier: "Rare" }),
]
const resultVeryCommon = queryPennyItems(itemsWithTiers, { tier: "Very Common" }, now)
assert.strictEqual(resultVeryCommon.total, 1, "Very Common filter should return 1 item")

const resultCommon = queryPennyItems(itemsWithTiers, { tier: "Common" }, now)
assert.strictEqual(resultCommon.total, 1, "Common filter should return 1 item")

const resultAllTiers = queryPennyItems(itemsWithTiers, { tier: "all" }, now)
assert.strictEqual(resultAllTiers.total, 3, "all tier filter should return all items")

// Photo filtering
const itemsWithPhotos = [
  clone(baseItem, { id: "1", imageUrl: "https://example.com/photo.jpg" }),
  clone(baseItem, { id: "2", imageUrl: "" }),
  clone(baseItem, { id: "3", imageUrl: "  " }), // whitespace only
]
const resultWithPhoto = queryPennyItems(itemsWithPhotos, { photo: true }, now)
assert.strictEqual(resultWithPhoto.total, 1, "Photo filter should return 1 item with valid URL")

// Search filtering
const itemsForSearch = [
  clone(baseItem, { id: "1", name: "Hammer Tool", sku: "1000020590" }),
  clone(baseItem, { id: "2", name: "Screwdriver Set", sku: "1006656719" }),
  clone(baseItem, {
    id: "3",
    name: "Nail Box",
    sku: "1007155949",
    notes: "Great hammer companion",
  }),
]
const resultSearchName = queryPennyItems(itemsForSearch, { q: "hammer" }, now)
assert.strictEqual(resultSearchName.total, 2, "Search 'hammer' should match name and notes")

const resultSearchSku = queryPennyItems(itemsForSearch, { q: "1006656719" }, now)
assert.strictEqual(resultSearchSku.total, 1, "Search by SKU should return 1 item")

const resultSearchNoMatch = queryPennyItems(itemsForSearch, { q: "wrench" }, now)
assert.strictEqual(resultSearchNoMatch.total, 0, "Search 'wrench' should return 0 items")

// Sort options
const itemsForSort = [
  clone(baseItem, { id: "1", name: "Zebra", dateAdded: "2025-12-08", locations: { TX: 1 } }),
  clone(baseItem, { id: "2", name: "Apple", dateAdded: "2025-12-10", locations: { TX: 3, CA: 2 } }),
  clone(baseItem, { id: "3", name: "Mango", dateAdded: "2025-12-09", locations: { FL: 1 } }),
]

const resultNewest = queryPennyItems(itemsForSort, { sort: "newest" }, now)
assert.strictEqual(resultNewest.items[0].name, "Apple", "Newest first should be Apple (Dec 10)")

const resultOldest = queryPennyItems(itemsForSort, { sort: "oldest" }, now)
assert.strictEqual(resultOldest.items[0].name, "Zebra", "Oldest first should be Zebra (Dec 8)")

const resultMostReports = queryPennyItems(itemsForSort, { sort: "most-reports" }, now)
assert.strictEqual(
  resultMostReports.items[0].name,
  "Apple",
  "Most reports first should be Apple (5 reports)"
)

const resultAlphabetical = queryPennyItems(itemsForSort, { sort: "alphabetical" }, now)
assert.strictEqual(resultAlphabetical.items[0].name, "Apple", "Alphabetical first should be Apple")
assert.strictEqual(resultAlphabetical.items[2].name, "Zebra", "Alphabetical last should be Zebra")

// Combined filters
const combinedResult = queryPennyItems(itemsWithStates, { state: "TX", tier: "Rare" }, now)
assert.strictEqual(combinedResult.total, 2, "TX + Rare should return 2 items")

// Empty input
const emptyResult = queryPennyItems([], {}, now)
assert.strictEqual(emptyResult.total, 0, "Empty input should return 0 items")
assert.deepStrictEqual(emptyResult.items, [], "Empty input should return empty array")

// All-time date range
const oldItems = [
  clone(baseItem, { id: "1", dateAdded: "2020-01-01" }),
  clone(baseItem, { id: "2", dateAdded: "2025-12-10" }),
]
const resultAllTime = queryPennyItems(oldItems, { days: "all" }, now)
assert.strictEqual(resultAllTime.total, 2, "'all' date range should include old items")

// getHotItems tests
const hotItemsInput = [
  clone(baseItem, { id: "1", tier: "Very Common", dateAdded: "2025-12-10" }),
  clone(baseItem, { id: "2", tier: "Common", dateAdded: "2025-12-10" }),
  clone(baseItem, { id: "3", tier: "Very Common", dateAdded: "2025-11-01" }), // Too old
  clone(baseItem, { id: "4", tier: "Very Common", dateAdded: "2025-12-08" }),
]
const hotResult = getHotItems(hotItemsInput, 14, 6, now)
assert.strictEqual(
  hotResult.length,
  2,
  "Hot items should return 2 Very Common items within 14 days"
)
assert.strictEqual(hotResult[0].id, "1", "Most recent hot item should be first")

// Hot items respects limit
const manyHotItems = Array.from({ length: 10 }, (_, i) =>
  clone(baseItem, { id: String(i), tier: "Very Common", dateAdded: "2025-12-10" })
)
const hotLimited = getHotItems(manyHotItems, 14, 3, now)
assert.strictEqual(hotLimited.length, 3, "Hot items should respect limit of 3")

console.log("✅ All penny-list-query tests passed")
