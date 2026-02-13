export interface MonumetricBaselineMetrics {
  findSubmitRate: number
  reportFindClickRate: number
  pennyListAvgEngagementSeconds: number
  pennyListBounceRate?: number
  mobileRevenuePerSession?: number
}

export interface MonumetricDayMetrics {
  date: string
  reportFindViews: number
  pennyListViews: number
  findSubmit: number
  reportFindClick: number
  pennyListAvgEngagementSeconds: number
  pennyListBounceRate?: number
  pennyListMobileSessions?: number
  pennyListMobileRevenue?: number
  userFacingFlowBreakage?: boolean
}

export interface MonumetricGuardrailConfig {
  hardFindSubmitDropPct: number
  hardEngagementFloorSeconds: number
  requiredConsecutiveDays: number
  softReportFindClickDropMinPct: number
  softReportFindClickDropMaxPct: number
  softBounceRiseAbsolute: number
  noLiftMinPrimaryLiftPct: number
}

export interface GuardrailReason {
  code:
    | "hard_find_submit_drop"
    | "hard_engagement_floor"
    | "hard_flow_breakage"
    | "soft_report_find_click_drop"
    | "soft_bounce_rise"
    | "no_lift_guardrail_worsened"
  message: string
}

export interface MonumetricDayEvaluation extends MonumetricDayMetrics {
  findSubmitRate: number | null
  reportFindClickRate: number | null
  mobileRevenuePerSession: number | null
  mobileSessionRpm: number | null
  findSubmitDropPct: number | null
  reportFindClickDropPct: number | null
  engagementDeltaSeconds: number
  bounceRiseAbsolute: number | null
}

export interface MonumetricWindowSummary {
  evaluatedDays: number
  averageFindSubmitRate: number | null
  averageReportFindClickRate: number | null
  averageEngagementSeconds: number | null
  averageBounceRate: number | null
  averageMobileRevenuePerSession: number | null
  averageMobileSessionRpm: number | null
  primaryLiftPct: number | null
}

export type MonumetricGuardrailAction =
  | "hold"
  | "hard_rollback"
  | "soft_rollback"
  | "no_lift_rollback"

export interface MonumetricGuardrailReport {
  baseline: MonumetricBaselineMetrics
  config: MonumetricGuardrailConfig
  windowLabel: string
  endOfWindowB: boolean
  action: MonumetricGuardrailAction
  summary: MonumetricWindowSummary
  days: MonumetricDayEvaluation[]
  hardReasons: GuardrailReason[]
  softReasons: GuardrailReason[]
  noLiftReasons: GuardrailReason[]
  warnings: string[]
}

export const MONUMETRIC_GUARDRAIL_BASELINE: MonumetricBaselineMetrics = {
  findSubmitRate: 294 / 2451,
  reportFindClickRate: 180 / 27963,
  pennyListAvgEngagementSeconds: 104.7,
  pennyListBounceRate: 0.2793084446893512,
}

export const MONUMETRIC_GUARDRAIL_DEFAULTS: MonumetricGuardrailConfig = {
  hardFindSubmitDropPct: 0.2,
  hardEngagementFloorSeconds: 90,
  requiredConsecutiveDays: 2,
  softReportFindClickDropMinPct: 0.1,
  softReportFindClickDropMaxPct: 0.2,
  softBounceRiseAbsolute: 0.05,
  noLiftMinPrimaryLiftPct: 0.02,
}

interface EvaluateGuardrailOptions {
  days: MonumetricDayMetrics[]
  baseline?: Partial<MonumetricBaselineMetrics>
  config?: Partial<MonumetricGuardrailConfig>
  endOfWindowB?: boolean
  windowLabel?: string
}

interface Streak {
  startDate: string
  endDate: string
  days: number
}

function safeRatio(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(numerator) || !Number.isFinite(denominator) || denominator <= 0) {
    return null
  }
  return numerator / denominator
}

function safeDropPct(current: number | null, baseline: number): number | null {
  if (current === null || baseline <= 0) return null
  return (baseline - current) / baseline
}

function average(values: Array<number | null>): number | null {
  const filtered = values.filter((value): value is number => value !== null)
  if (filtered.length === 0) return null
  return filtered.reduce((sum, value) => sum + value, 0) / filtered.length
}

function collectStreaks(
  days: MonumetricDayEvaluation[],
  matches: (day: MonumetricDayEvaluation) => boolean
): Streak[] {
  const streaks: Streak[] = []

  let currentStart: string | null = null
  let currentEnd: string | null = null
  let currentLength = 0

  const flush = () => {
    if (!currentStart || !currentEnd || currentLength === 0) return
    streaks.push({
      startDate: currentStart,
      endDate: currentEnd,
      days: currentLength,
    })
  }

  for (const day of days) {
    if (matches(day)) {
      if (!currentStart) currentStart = day.date
      currentEnd = day.date
      currentLength += 1
      continue
    }
    flush()
    currentStart = null
    currentEnd = null
    currentLength = 0
  }

  flush()
  return streaks
}

function hasGuardrailWorsening(
  summary: MonumetricWindowSummary,
  baseline: MonumetricBaselineMetrics
): boolean {
  const findSubmitWorse =
    summary.averageFindSubmitRate !== null &&
    summary.averageFindSubmitRate < baseline.findSubmitRate
  const clickRateWorse =
    summary.averageReportFindClickRate !== null &&
    summary.averageReportFindClickRate < baseline.reportFindClickRate
  const engagementWorse =
    summary.averageEngagementSeconds !== null &&
    summary.averageEngagementSeconds < baseline.pennyListAvgEngagementSeconds
  const bounceWorse =
    baseline.pennyListBounceRate !== undefined &&
    summary.averageBounceRate !== null &&
    summary.averageBounceRate > baseline.pennyListBounceRate

  return findSubmitWorse || clickRateWorse || engagementWorse || bounceWorse
}

export function evaluateMonumetricGuardrails(
  options: EvaluateGuardrailOptions
): MonumetricGuardrailReport {
  const baseline: MonumetricBaselineMetrics = {
    ...MONUMETRIC_GUARDRAIL_BASELINE,
    ...options.baseline,
  }
  const config: MonumetricGuardrailConfig = {
    ...MONUMETRIC_GUARDRAIL_DEFAULTS,
    ...options.config,
  }

  const sortedDays = [...options.days].sort((a, b) => a.date.localeCompare(b.date))
  const warnings: string[] = []

  if (baseline.mobileRevenuePerSession === undefined) {
    warnings.push(
      "Baseline mobileRevenuePerSession is not set; no-lift rollback evaluation is disabled."
    )
  }

  if (baseline.pennyListBounceRate === undefined) {
    warnings.push(
      "Baseline pennyListBounceRate is not set; bounce-rise soft rollback guardrail is disabled."
    )
  }

  const days: MonumetricDayEvaluation[] = sortedDays.map((day) => {
    const findSubmitRate = safeRatio(day.findSubmit, day.reportFindViews)
    const reportFindClickRate = safeRatio(day.reportFindClick, day.pennyListViews)
    const mobileRevenuePerSession = safeRatio(
      day.pennyListMobileRevenue ?? NaN,
      day.pennyListMobileSessions ?? NaN
    )
    const mobileSessionRpm =
      mobileRevenuePerSession === null ? null : mobileRevenuePerSession * 1000

    return {
      ...day,
      findSubmitRate,
      reportFindClickRate,
      mobileRevenuePerSession,
      mobileSessionRpm,
      findSubmitDropPct: safeDropPct(findSubmitRate, baseline.findSubmitRate),
      reportFindClickDropPct: safeDropPct(reportFindClickRate, baseline.reportFindClickRate),
      engagementDeltaSeconds:
        day.pennyListAvgEngagementSeconds - baseline.pennyListAvgEngagementSeconds,
      bounceRiseAbsolute:
        baseline.pennyListBounceRate === undefined || day.pennyListBounceRate === undefined
          ? null
          : day.pennyListBounceRate - baseline.pennyListBounceRate,
    }
  })

  const summary: MonumetricWindowSummary = {
    evaluatedDays: days.length,
    averageFindSubmitRate: average(days.map((day) => day.findSubmitRate)),
    averageReportFindClickRate: average(days.map((day) => day.reportFindClickRate)),
    averageEngagementSeconds: average(days.map((day) => day.pennyListAvgEngagementSeconds)),
    averageBounceRate: average(days.map((day) => day.pennyListBounceRate ?? null)),
    averageMobileRevenuePerSession: average(days.map((day) => day.mobileRevenuePerSession)),
    averageMobileSessionRpm: average(days.map((day) => day.mobileSessionRpm)),
    primaryLiftPct: null,
  }

  if (
    baseline.mobileRevenuePerSession !== undefined &&
    baseline.mobileRevenuePerSession > 0 &&
    summary.averageMobileRevenuePerSession !== null
  ) {
    summary.primaryLiftPct =
      (summary.averageMobileRevenuePerSession - baseline.mobileRevenuePerSession) /
      baseline.mobileRevenuePerSession
  }

  const hardReasons: GuardrailReason[] = []
  const softReasons: GuardrailReason[] = []
  const noLiftReasons: GuardrailReason[] = []

  const findSubmitDropStreaks = collectStreaks(
    days,
    (day) => day.findSubmitDropPct !== null && day.findSubmitDropPct >= config.hardFindSubmitDropPct
  ).filter((streak) => streak.days >= config.requiredConsecutiveDays)

  if (findSubmitDropStreaks.length > 0) {
    const ranges = findSubmitDropStreaks
      .map((streak) => `${streak.startDate} -> ${streak.endDate} (${streak.days} days)`)
      .join(", ")
    hardReasons.push({
      code: "hard_find_submit_drop",
      message: `find_submit/report-find-views dropped by >=${Math.round(config.hardFindSubmitDropPct * 100)}% for ${config.requiredConsecutiveDays}+ consecutive days: ${ranges}.`,
    })
  }

  const engagementFloorStreaks = collectStreaks(
    days,
    (day) => day.pennyListAvgEngagementSeconds < config.hardEngagementFloorSeconds
  ).filter((streak) => streak.days >= config.requiredConsecutiveDays)

  if (engagementFloorStreaks.length > 0) {
    const ranges = engagementFloorStreaks
      .map((streak) => `${streak.startDate} -> ${streak.endDate} (${streak.days} days)`)
      .join(", ")
    hardReasons.push({
      code: "hard_engagement_floor",
      message: `/penny-list avg engagement stayed below ${config.hardEngagementFloorSeconds}s for ${config.requiredConsecutiveDays}+ consecutive days: ${ranges}.`,
    })
  }

  const flowBreakageDates = days
    .filter((day) => day.userFacingFlowBreakage === true)
    .map((day) => day.date)
  if (flowBreakageDates.length > 0) {
    hardReasons.push({
      code: "hard_flow_breakage",
      message: `User-facing mobile flow breakage flagged on: ${flowBreakageDates.join(", ")}.`,
    })
  }

  const reportFindClickSoftDates = days
    .filter(
      (day) =>
        day.reportFindClickDropPct !== null &&
        day.reportFindClickDropPct >= config.softReportFindClickDropMinPct &&
        day.reportFindClickDropPct <= config.softReportFindClickDropMaxPct
    )
    .map((day) => day.date)

  if (reportFindClickSoftDates.length > 0) {
    softReasons.push({
      code: "soft_report_find_click_drop",
      message: `report_find_click/penny-list-views dropped between ${Math.round(config.softReportFindClickDropMinPct * 100)}% and ${Math.round(config.softReportFindClickDropMaxPct * 100)}% on: ${reportFindClickSoftDates.join(", ")}.`,
    })
  }

  if (baseline.pennyListBounceRate !== undefined) {
    const bounceSoftDates = days
      .filter(
        (day) =>
          day.bounceRiseAbsolute !== null && day.bounceRiseAbsolute >= config.softBounceRiseAbsolute
      )
      .map((day) => day.date)

    if (bounceSoftDates.length > 0) {
      softReasons.push({
        code: "soft_bounce_rise",
        message: `/penny-list bounce rate rose by >=${Math.round(config.softBounceRiseAbsolute * 100)} absolute points on: ${bounceSoftDates.join(", ")}.`,
      })
    }
  }

  const endOfWindowB = options.endOfWindowB === true
  const primaryLiftPct = summary.primaryLiftPct
  const canEvaluateNoLift =
    endOfWindowB &&
    primaryLiftPct !== null &&
    baseline.mobileRevenuePerSession !== undefined &&
    baseline.mobileRevenuePerSession > 0

  if (canEvaluateNoLift) {
    const guardrailsWorsened = hasGuardrailWorsening(summary, baseline)
    const negligibleLift = primaryLiftPct <= config.noLiftMinPrimaryLiftPct

    if (guardrailsWorsened && negligibleLift) {
      noLiftReasons.push({
        code: "no_lift_guardrail_worsened",
        message: `End-of-Window-B check: primary lift (${(primaryLiftPct * 100).toFixed(2)}%) is <= ${(
          config.noLiftMinPrimaryLiftPct * 100
        ).toFixed(2)}% and at least one core guardrail worsened.`,
      })
    }
  }

  const action: MonumetricGuardrailAction =
    hardReasons.length > 0
      ? "hard_rollback"
      : softReasons.length > 0
        ? "soft_rollback"
        : noLiftReasons.length > 0
          ? "no_lift_rollback"
          : "hold"

  return {
    baseline,
    config,
    windowLabel: options.windowLabel ?? "window-b-test",
    endOfWindowB,
    action,
    summary,
    days,
    hardReasons,
    softReasons,
    noLiftReasons,
    warnings,
  }
}
