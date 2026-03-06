interface IntRange {
  min: number
  max: number
}

export interface SerpApiGapFetchPlan {
  processLimit: number
  staleQueryLimit: number
  recentQueryLimit: number
}

export interface SerpApiGapCandidate<Row> {
  row: Row
  ageMinutes: number
  missingCount: number
  staleEscalated: boolean
}

function clamp(value: number, range: IntRange): number {
  return Math.min(range.max, Math.max(range.min, value))
}

function normalizePositiveInt(value: number, fallback: number, range: IntRange): number {
  if (!Number.isFinite(value)) return fallback
  return clamp(Math.floor(value), range)
}

export function buildSerpApiGapFetchPlan(args: {
  requestedLimit: number
  recommendedItemLimit: number
  ignoreBudget?: boolean
}): SerpApiGapFetchPlan {
  const processLimit = normalizePositiveInt(args.requestedLimit, 1, { min: 1, max: 200 })
  const recommendedItemLimit = args.ignoreBudget
    ? processLimit
    : normalizePositiveInt(args.recommendedItemLimit, processLimit, { min: 1, max: 200 })

  const expansionBase = Math.max(processLimit, recommendedItemLimit)

  return {
    processLimit,
    staleQueryLimit: clamp(Math.max(processLimit * 2, expansionBase * 3, 12), {
      min: processLimit,
      max: 240,
    }),
    recentQueryLimit: clamp(Math.max(processLimit * 4, expansionBase * 4, 24), {
      min: processLimit,
      max: 320,
    }),
  }
}

export function getSerpApiGapAgeMinutes(timestamp: string | null | undefined, now: Date): number {
  if (!timestamp) return Number.POSITIVE_INFINITY
  const parsed = Date.parse(timestamp)
  if (!Number.isFinite(parsed)) return Number.POSITIVE_INFINITY
  return Math.max(0, Math.floor((now.getTime() - parsed) / 60000))
}

export function prioritizeSerpApiGapCandidates<Row>(
  candidates: Array<SerpApiGapCandidate<Row>>,
  processLimit: number
): Row[] {
  const cappedProcessLimit = normalizePositiveInt(processLimit, 1, { min: 1, max: 200 })

  return [...candidates]
    .sort((a, b) => {
      if (a.staleEscalated !== b.staleEscalated) return a.staleEscalated ? -1 : 1

      if (a.staleEscalated && b.staleEscalated) {
        if (a.ageMinutes !== b.ageMinutes) return b.ageMinutes - a.ageMinutes
      } else if (a.ageMinutes !== b.ageMinutes) {
        return a.ageMinutes - b.ageMinutes
      }

      if (a.missingCount !== b.missingCount) return b.missingCount - a.missingCount
      return 0
    })
    .slice(0, cappedProcessLimit)
    .map((candidate) => candidate.row)
}
