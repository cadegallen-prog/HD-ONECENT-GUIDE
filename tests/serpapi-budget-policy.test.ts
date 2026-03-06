import assert from "node:assert"
import test from "node:test"

import { decideSerpApiRunBudget } from "../lib/enrichment/serpapi-budget-policy"

function policyEnv(overrides: Record<string, string> = {}): NodeJS.ProcessEnv {
  return {
    SERPAPI_MONTHLY_CAP: "250",
    SERPAPI_MONTHLY_RESERVE: "10",
    SERPAPI_MIN_DAILY_CREDITS: "4",
    SERPAPI_MAX_DAILY_CREDITS: "12",
    SERPAPI_MAX_CREDITS_PER_RUN: "6",
    SERPAPI_ESTIMATED_CREDITS_PER_ITEM: "3",
    SERPAPI_BILLING_RESET_ANCHOR_ISO: "2026-03-18T00:00:00.000Z",
    SERPAPI_BACKFILL_WINDOW_MINUTES_BEFORE_RESET: "360",
    SERPAPI_LATE_MONTH_HIGH_REMAINING_CREDITS: "45",
    SERPAPI_LATE_MONTH_BACKFILL_DAILY_CAP: "28",
    SERPAPI_LATE_MONTH_BACKFILL_MAX_RUN_CREDITS: "14",
    SERPAPI_PRE_RESET_GUARD_MINUTES: "60",
    SERPAPI_POST_RESET_GUARD_MINUTES: "60",
    ...overrides,
  }
}

test("not in backfill mode before configured reset-proximity window", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-17T10:00:00.000Z"),
      monthlyCreditsUsed: 150,
      todayCreditsUsed: 2,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, true)
  assert.strictEqual(decision.reason, "ok")
  assert.strictEqual(decision.inLateMonthBackfillMode, false)
})

test("enters backfill mode inside configured reset-proximity window", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-17T20:30:00.000Z"),
      monthlyCreditsUsed: 150,
      todayCreditsUsed: 5,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, true)
  assert.strictEqual(decision.reason, "ok")
  assert.strictEqual(decision.inLateMonthBackfillMode, true)
  assert.strictEqual(decision.targetDailyCredits, 28)
  assert.strictEqual(decision.runBudgetCredits, 14)
})

test("pre-reset guard still blocks runs even inside backfill window", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-17T23:20:00.000Z"),
      monthlyCreditsUsed: 150,
      todayCreditsUsed: 5,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, false)
  assert.strictEqual(decision.reason, "pre_reset_guard")
  assert.strictEqual(decision.runBudgetCredits, 0)
})

test("post-reset guard still blocks runs", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-18T00:30:00.000Z"),
      monthlyCreditsUsed: 0,
      todayCreditsUsed: 0,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, false)
  assert.strictEqual(decision.reason, "post_reset_guard")
  assert.strictEqual(decision.runBudgetCredits, 0)
})

test("backfill activation does not use broad day-threshold semantics", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-17T12:00:00.000Z"),
      monthlyCreditsUsed: 150,
      todayCreditsUsed: 5,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, true)
  assert.strictEqual(decision.reason, "ok")
  assert.strictEqual(decision.inLateMonthBackfillMode, false)
})

test("backfill activation is tied to billing-cycle reset, not calendar-month boundaries", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-05-17T20:30:00.000Z"),
      monthlyCreditsUsed: 150,
      todayCreditsUsed: 5,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, true)
  assert.strictEqual(decision.reason, "ok")
  assert.strictEqual(decision.inLateMonthBackfillMode, true)
})

test("last UTC day of month does not activate backfill unless billing reset is near", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-30T18:00:00.000Z"),
      monthlyCreditsUsed: 150,
      todayCreditsUsed: 1,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, true)
  assert.strictEqual(decision.reason, "ok")
  assert.strictEqual(decision.inLateMonthBackfillMode, false)
})

test("fails closed when daily budget is exhausted", () => {
  const decision = decideSerpApiRunBudget({
    snapshot: {
      now: new Date("2026-04-10T12:00:00.000Z"),
      monthlyCreditsUsed: 100,
      todayCreditsUsed: 12,
    },
    env: policyEnv(),
  })

  assert.strictEqual(decision.allowed, false)
  assert.strictEqual(decision.reason, "daily_budget_exhausted")
  assert.strictEqual(decision.runBudgetCredits, 0)
})
