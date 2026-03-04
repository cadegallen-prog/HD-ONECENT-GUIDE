import assert from "node:assert"
import { getFreshestHomeProofTimestamp } from "../lib/home-proof"

assert.strictEqual(
  getFreshestHomeProofTimestamp([
    { dateAdded: "2026-03-01T10:00:00.000Z", lastSeenAt: "2026-03-02T09:00:00.000Z" },
    { dateAdded: "2026-03-03T08:00:00.000Z", lastSeenAt: undefined },
  ]),
  "2026-03-03T08:00:00.000Z"
)

assert.strictEqual(
  getFreshestHomeProofTimestamp([
    { dateAdded: "2026-03-01T10:00:00.000Z", lastSeenAt: "2026-03-04T01:15:00.000Z" },
    { dateAdded: "2026-03-03T08:00:00.000Z", lastSeenAt: "2026-03-03T09:00:00.000Z" },
  ]),
  "2026-03-04T01:15:00.000Z"
)

assert.strictEqual(
  getFreshestHomeProofTimestamp([
    { dateAdded: "invalid-date", lastSeenAt: undefined },
    { dateAdded: "", lastSeenAt: "also-invalid" },
  ]),
  null
)

console.log("✅ All home-proof tests passed")
