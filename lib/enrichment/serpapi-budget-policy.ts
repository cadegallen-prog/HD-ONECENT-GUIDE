interface IntRange {
  min: number
  max: number
}

export interface SerpApiBudgetPolicy {
  monthlyCap: number
  monthlyReserve: number
  minDailyCredits: number
  maxDailyCredits: number
  maxCreditsPerRun: number
  estimatedCreditsPerItem: number
  lateMonthHighRemainingCredits: number
  lateMonthBackfillDailyCap: number
  lateMonthBackfillMaxRunCredits: number
  backfillWindowMinutesBeforeReset: number
  billingResetAnchorIso: string
  preResetGuardMinutes: number
  postResetGuardMinutes: number
}

export interface SerpApiBudgetSnapshot {
  now: Date
  monthlyCreditsUsed: number
  todayCreditsUsed: number
}

export interface SerpApiRunBudgetDecision {
  allowed: boolean
  reason:
    | "ok"
    | "pre_reset_guard"
    | "post_reset_guard"
    | "monthly_budget_exhausted"
    | "daily_budget_exhausted"
  policy: SerpApiBudgetPolicy
  monthCapUsable: number
  monthCreditsRemaining: number
  daysUntilReset: number
  targetDailyCredits: number
  dailyCreditsRemaining: number
  runBudgetCredits: number
  recommendedItemLimit: number
  inLateMonthBackfillMode: boolean
  nextResetAtIso: string
}

const DEFAULT_BILLING_RESET_ANCHOR_ISO = "2026-03-18T00:00:00.000Z"

function parsePositiveInt(raw: string | undefined, fallback: number, range: IntRange): number {
  const parsed = Number.parseInt(String(raw || "").trim(), 10)
  if (!Number.isFinite(parsed)) return fallback
  return Math.min(range.max, Math.max(range.min, parsed))
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseIsoTimestamp(raw: string | undefined, fallbackIso: string): string {
  const candidate = String(raw || "").trim()
  if (!candidate) return fallbackIso
  const parsed = Date.parse(candidate)
  if (!Number.isFinite(parsed)) return fallbackIso
  return new Date(parsed).toISOString()
}

function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0)
  )
}

function daysInUtcMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
}

function addUtcMonthsFromAnchor(anchor: Date, monthOffset: number): Date {
  const targetMonthIndex = anchor.getUTCMonth() + monthOffset
  const targetYear = anchor.getUTCFullYear() + Math.floor(targetMonthIndex / 12)
  const targetMonth = ((targetMonthIndex % 12) + 12) % 12
  const targetDay = Math.min(anchor.getUTCDate(), daysInUtcMonth(targetYear, targetMonth))

  return new Date(
    Date.UTC(
      targetYear,
      targetMonth,
      targetDay,
      anchor.getUTCHours(),
      anchor.getUTCMinutes(),
      anchor.getUTCSeconds(),
      anchor.getUTCMilliseconds()
    )
  )
}

export function resolveSerpApiBudgetPolicy(
  env: NodeJS.ProcessEnv = process.env
): SerpApiBudgetPolicy {
  return {
    monthlyCap: parsePositiveInt(env.SERPAPI_MONTHLY_CAP, 250, { min: 1, max: 10000 }),
    monthlyReserve: parsePositiveInt(env.SERPAPI_MONTHLY_RESERVE, 10, { min: 0, max: 9999 }),
    minDailyCredits: parsePositiveInt(env.SERPAPI_MIN_DAILY_CREDITS, 4, { min: 1, max: 250 }),
    maxDailyCredits: parsePositiveInt(env.SERPAPI_MAX_DAILY_CREDITS, 12, { min: 1, max: 250 }),
    maxCreditsPerRun: parsePositiveInt(env.SERPAPI_MAX_CREDITS_PER_RUN, 6, { min: 1, max: 250 }),
    estimatedCreditsPerItem: parsePositiveInt(env.SERPAPI_ESTIMATED_CREDITS_PER_ITEM, 3, {
      min: 1,
      max: 6,
    }),
    lateMonthHighRemainingCredits: parsePositiveInt(
      env.SERPAPI_LATE_MONTH_HIGH_REMAINING_CREDITS,
      45,
      {
        min: 1,
        max: 10000,
      }
    ),
    lateMonthBackfillDailyCap: parsePositiveInt(env.SERPAPI_LATE_MONTH_BACKFILL_DAILY_CAP, 28, {
      min: 1,
      max: 250,
    }),
    lateMonthBackfillMaxRunCredits: parsePositiveInt(
      env.SERPAPI_LATE_MONTH_BACKFILL_MAX_RUN_CREDITS,
      14,
      {
        min: 1,
        max: 250,
      }
    ),
    backfillWindowMinutesBeforeReset: parsePositiveInt(
      env.SERPAPI_BACKFILL_WINDOW_MINUTES_BEFORE_RESET,
      360,
      {
        min: 15,
        max: 1440,
      }
    ),
    billingResetAnchorIso: parseIsoTimestamp(
      env.SERPAPI_BILLING_RESET_ANCHOR_ISO,
      DEFAULT_BILLING_RESET_ANCHOR_ISO
    ),
    preResetGuardMinutes: parsePositiveInt(
      env.SERPAPI_PRE_RESET_GUARD_MINUTES || env.SERPAPI_RESET_GUARD_MINUTES,
      60,
      {
        min: 15,
        max: 720,
      }
    ),
    postResetGuardMinutes: parsePositiveInt(env.SERPAPI_POST_RESET_GUARD_MINUTES, 60, {
      min: 15,
      max: 720,
    }),
  }
}

export function decideSerpApiRunBudget(args: {
  snapshot: SerpApiBudgetSnapshot
  env?: NodeJS.ProcessEnv
}): SerpApiRunBudgetDecision {
  const policy = resolveSerpApiBudgetPolicy(args.env)
  const now = args.snapshot.now

  const cycleBounds = getBillingCycleBounds(now, policy.billingResetAnchorIso)
  const resetStart = new Date(cycleBounds.startIso)
  const nextReset = new Date(cycleBounds.endIso)

  const msSinceReset = now.getTime() - resetStart.getTime()
  const msUntilReset = nextReset.getTime() - now.getTime()

  const inPostResetGuard =
    msSinceReset >= 0 && msSinceReset < policy.postResetGuardMinutes * 60 * 1000
  const inPreResetGuard =
    msUntilReset > 0 && msUntilReset <= policy.preResetGuardMinutes * 60 * 1000

  const usableMonthCap = Math.max(0, policy.monthlyCap - policy.monthlyReserve)
  const monthCreditsRemaining = Math.max(
    0,
    usableMonthCap - Math.max(0, args.snapshot.monthlyCreditsUsed)
  )

  const daysUntilReset = Math.max(1, Math.ceil(msUntilReset / (24 * 60 * 60 * 1000)))
  const baselineDailyCredits = clamp(
    Math.ceil(monthCreditsRemaining / daysUntilReset),
    Math.min(policy.minDailyCredits, policy.maxDailyCredits),
    Math.max(policy.minDailyCredits, policy.maxDailyCredits)
  )

  const highLateMonthRemainder = monthCreditsRemaining >= policy.lateMonthHighRemainingCredits

  const inBackfillWindowBeforeReset =
    msUntilReset > policy.preResetGuardMinutes * 60 * 1000 &&
    msUntilReset <= policy.backfillWindowMinutesBeforeReset * 60 * 1000

  const inLateMonthBackfillMode =
    highLateMonthRemainder && inBackfillWindowBeforeReset && !inPostResetGuard

  const targetDailyCredits = inLateMonthBackfillMode
    ? Math.min(policy.lateMonthBackfillDailyCap, monthCreditsRemaining)
    : baselineDailyCredits

  const maxCreditsPerRun = inLateMonthBackfillMode
    ? policy.lateMonthBackfillMaxRunCredits
    : policy.maxCreditsPerRun

  const dailyCreditsRemaining = Math.max(
    0,
    targetDailyCredits - Math.max(0, args.snapshot.todayCreditsUsed)
  )
  const runBudgetCredits = Math.max(
    0,
    Math.min(dailyCreditsRemaining, monthCreditsRemaining, maxCreditsPerRun)
  )

  const recommendedItemLimit = runBudgetCredits
    ? Math.max(1, Math.floor(runBudgetCredits / Math.max(1, policy.estimatedCreditsPerItem)))
    : 0

  if (inPostResetGuard) {
    return {
      allowed: false,
      reason: "post_reset_guard",
      policy,
      monthCapUsable: usableMonthCap,
      monthCreditsRemaining,
      daysUntilReset,
      targetDailyCredits,
      dailyCreditsRemaining,
      runBudgetCredits: 0,
      recommendedItemLimit: 0,
      inLateMonthBackfillMode,
      nextResetAtIso: nextReset.toISOString(),
    }
  }

  if (inPreResetGuard) {
    return {
      allowed: false,
      reason: "pre_reset_guard",
      policy,
      monthCapUsable: usableMonthCap,
      monthCreditsRemaining,
      daysUntilReset,
      targetDailyCredits,
      dailyCreditsRemaining,
      runBudgetCredits: 0,
      recommendedItemLimit: 0,
      inLateMonthBackfillMode,
      nextResetAtIso: nextReset.toISOString(),
    }
  }

  if (monthCreditsRemaining <= 0) {
    return {
      allowed: false,
      reason: "monthly_budget_exhausted",
      policy,
      monthCapUsable: usableMonthCap,
      monthCreditsRemaining,
      daysUntilReset,
      targetDailyCredits,
      dailyCreditsRemaining,
      runBudgetCredits: 0,
      recommendedItemLimit: 0,
      inLateMonthBackfillMode,
      nextResetAtIso: nextReset.toISOString(),
    }
  }

  if (runBudgetCredits <= 0) {
    return {
      allowed: false,
      reason: "daily_budget_exhausted",
      policy,
      monthCapUsable: usableMonthCap,
      monthCreditsRemaining,
      daysUntilReset,
      targetDailyCredits,
      dailyCreditsRemaining,
      runBudgetCredits: 0,
      recommendedItemLimit: 0,
      inLateMonthBackfillMode,
      nextResetAtIso: nextReset.toISOString(),
    }
  }

  return {
    allowed: true,
    reason: "ok",
    policy,
    monthCapUsable: usableMonthCap,
    monthCreditsRemaining,
    daysUntilReset,
    targetDailyCredits,
    dailyCreditsRemaining,
    runBudgetCredits,
    recommendedItemLimit,
    inLateMonthBackfillMode,
    nextResetAtIso: nextReset.toISOString(),
  }
}

export function getUtcDayBounds(date: Date): { startIso: string; endIso: string } {
  const start = startOfUtcDay(date)
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000)
  return { startIso: start.toISOString(), endIso: end.toISOString() }
}

export function getBillingCycleBounds(
  date: Date,
  billingResetAnchorIso = DEFAULT_BILLING_RESET_ANCHOR_ISO
): { startIso: string; endIso: string } {
  const anchorIso = parseIsoTimestamp(billingResetAnchorIso, DEFAULT_BILLING_RESET_ANCHOR_ISO)
  const anchor = new Date(anchorIso)

  let cycleOffset =
    (date.getUTCFullYear() - anchor.getUTCFullYear()) * 12 +
    (date.getUTCMonth() - anchor.getUTCMonth())

  let start = addUtcMonthsFromAnchor(anchor, cycleOffset)
  if (start.getTime() > date.getTime()) {
    cycleOffset -= 1
    start = addUtcMonthsFromAnchor(anchor, cycleOffset)
  }

  const end = addUtcMonthsFromAnchor(anchor, cycleOffset + 1)
  return { startIso: start.toISOString(), endIso: end.toISOString() }
}
