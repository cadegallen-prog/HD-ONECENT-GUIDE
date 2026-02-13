import assert from "node:assert"
import test from "node:test"

import { evaluateMonumetricGuardrails } from "../lib/ads/guardrail-report"

test("triggers hard rollback on consecutive find-submit guardrail drops", () => {
  const report = evaluateMonumetricGuardrails({
    baseline: {
      findSubmitRate: 0.12,
      reportFindClickRate: 0.006,
      pennyListAvgEngagementSeconds: 104.7,
      pennyListBounceRate: 0.28,
      mobileRevenuePerSession: 0.2,
    },
    days: [
      {
        date: "2026-02-12",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 9,
        reportFindClick: 7,
        pennyListAvgEngagementSeconds: 100,
        pennyListBounceRate: 0.29,
      },
      {
        date: "2026-02-13",
        reportFindViews: 100,
        pennyListViews: 980,
        findSubmit: 8,
        reportFindClick: 6,
        pennyListAvgEngagementSeconds: 98,
        pennyListBounceRate: 0.3,
      },
    ],
  })

  assert.strictEqual(report.action, "hard_rollback")
  assert.ok(report.hardReasons.some((reason) => reason.code === "hard_find_submit_drop"))
})

test("triggers hard rollback when flow breakage is flagged", () => {
  const report = evaluateMonumetricGuardrails({
    days: [
      {
        date: "2026-02-12",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 14,
        reportFindClick: 8,
        pennyListAvgEngagementSeconds: 105,
        userFacingFlowBreakage: true,
      },
    ],
  })

  assert.strictEqual(report.action, "hard_rollback")
  assert.ok(report.hardReasons.some((reason) => reason.code === "hard_flow_breakage"))
})

test("triggers soft rollback on report-find-click drop and bounce rise", () => {
  const report = evaluateMonumetricGuardrails({
    baseline: {
      findSubmitRate: 0.12,
      reportFindClickRate: 0.01,
      pennyListAvgEngagementSeconds: 104.7,
      pennyListBounceRate: 0.28,
    },
    days: [
      {
        date: "2026-02-12",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 12,
        reportFindClick: 8.8,
        pennyListAvgEngagementSeconds: 104,
        pennyListBounceRate: 0.34,
      },
    ],
  })

  assert.strictEqual(report.action, "soft_rollback")
  assert.ok(report.softReasons.some((reason) => reason.code === "soft_report_find_click_drop"))
  assert.ok(report.softReasons.some((reason) => reason.code === "soft_bounce_rise"))
})

test("triggers no-lift rollback at end of window B when lift is negligible and guardrails worsen", () => {
  const report = evaluateMonumetricGuardrails({
    endOfWindowB: true,
    baseline: {
      findSubmitRate: 0.12,
      reportFindClickRate: 0.01,
      pennyListAvgEngagementSeconds: 104.7,
      pennyListBounceRate: 0.28,
      mobileRevenuePerSession: 0.2,
    },
    days: [
      {
        date: "2026-02-12",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 11,
        reportFindClick: 9.6,
        pennyListAvgEngagementSeconds: 103,
        pennyListBounceRate: 0.29,
        pennyListMobileSessions: 1000,
        pennyListMobileRevenue: 202,
      },
      {
        date: "2026-02-13",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 11,
        reportFindClick: 9.5,
        pennyListAvgEngagementSeconds: 102.5,
        pennyListBounceRate: 0.285,
        pennyListMobileSessions: 1000,
        pennyListMobileRevenue: 202,
      },
    ],
  })

  assert.strictEqual(report.action, "no_lift_rollback")
  assert.ok(report.noLiftReasons.some((reason) => reason.code === "no_lift_guardrail_worsened"))
})

test("holds when primary lift is healthy and guardrails remain stable", () => {
  const report = evaluateMonumetricGuardrails({
    endOfWindowB: true,
    baseline: {
      findSubmitRate: 0.12,
      reportFindClickRate: 0.01,
      pennyListAvgEngagementSeconds: 104.7,
      pennyListBounceRate: 0.28,
      mobileRevenuePerSession: 0.2,
    },
    days: [
      {
        date: "2026-02-12",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 13,
        reportFindClick: 10.2,
        pennyListAvgEngagementSeconds: 110,
        pennyListBounceRate: 0.27,
        pennyListMobileSessions: 1000,
        pennyListMobileRevenue: 235,
      },
      {
        date: "2026-02-13",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 13,
        reportFindClick: 10.1,
        pennyListAvgEngagementSeconds: 111,
        pennyListBounceRate: 0.269,
        pennyListMobileSessions: 1000,
        pennyListMobileRevenue: 236,
      },
    ],
  })

  assert.strictEqual(report.action, "hold")
  assert.strictEqual(report.hardReasons.length, 0)
  assert.strictEqual(report.softReasons.length, 0)
  assert.strictEqual(report.noLiftReasons.length, 0)
})
