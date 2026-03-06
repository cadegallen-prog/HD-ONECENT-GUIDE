import assert from "node:assert"
import test from "node:test"

import {
  buildSerpApiGapFetchPlan,
  getSerpApiGapAgeMinutes,
  prioritizeSerpApiGapCandidates,
} from "../lib/enrichment/serpapi-gap-selection"

test("requested limit stays authoritative even when the budget recommendation is higher", () => {
  const plan = buildSerpApiGapFetchPlan({
    requestedLimit: 1,
    recommendedItemLimit: 4,
  })

  assert.strictEqual(plan.processLimit, 1)
  assert.ok(plan.staleQueryLimit > 1)
  assert.ok(plan.recentQueryLimit > 1)
})

test("stale candidates outrank fresh ones and processing stays capped", () => {
  const now = new Date("2026-03-06T12:00:00.000Z")

  const rows = {
    staleOldest: { id: "stale-oldest" },
    staleNewer: { id: "stale-newer" },
    freshNewest: { id: "fresh-newest" },
  }

  const result = prioritizeSerpApiGapCandidates(
    [
      {
        row: rows.freshNewest,
        ageMinutes: getSerpApiGapAgeMinutes("2026-03-06T11:50:00.000Z", now),
        missingCount: 4,
        staleEscalated: false,
      },
      {
        row: rows.staleNewer,
        ageMinutes: getSerpApiGapAgeMinutes("2026-03-06T09:30:00.000Z", now),
        missingCount: 1,
        staleEscalated: true,
      },
      {
        row: rows.staleOldest,
        ageMinutes: getSerpApiGapAgeMinutes("2026-03-06T08:00:00.000Z", now),
        missingCount: 2,
        staleEscalated: true,
      },
    ],
    2
  )

  assert.deepStrictEqual(result, [rows.staleOldest, rows.staleNewer])
})

test("fresh candidates stay newest-first when no rows are stale", () => {
  const now = new Date("2026-03-06T12:00:00.000Z")

  const rows = {
    newest: { id: "fresh-newest" },
    older: { id: "fresh-older" },
  }

  const result = prioritizeSerpApiGapCandidates(
    [
      {
        row: rows.older,
        ageMinutes: getSerpApiGapAgeMinutes("2026-03-06T10:30:00.000Z", now),
        missingCount: 4,
        staleEscalated: false,
      },
      {
        row: rows.newest,
        ageMinutes: getSerpApiGapAgeMinutes("2026-03-06T11:45:00.000Z", now),
        missingCount: 1,
        staleEscalated: false,
      },
    ],
    2
  )

  assert.deepStrictEqual(result, [rows.newest, rows.older])
})
