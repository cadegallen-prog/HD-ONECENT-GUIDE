import { createHash } from "node:crypto"
import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateSku } from "@/lib/sku"
import { getSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase/client"
import { enrichHomeDepotSkuWithSerpApi } from "@/lib/enrichment/serpapi-home-depot-enrich"
import { getSerpApiDeliveryZip, SerpApiCreditsExhaustedError } from "@/lib/serpapi/home-depot"
import { isLowQualityItemName } from "@/lib/item-name-quality"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 30 // Allows batch submissions (e.g., stack of receipts)
const BATCH_SUBMIT_MAX_ITEMS = 10

const DUPLICATE_SKU_WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const RAPID_FIRE_COOLDOWN_MS = 5_000 // 5 seconds between submissions

function parseBooleanEnvFlag(value: string | undefined): boolean | null {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
  if (!normalized) return null

  if (["1", "true", "yes", "on"].includes(normalized)) return true
  if (["0", "false", "no", "off"].includes(normalized)) return false

  return null
}

function isSubmitDryRunEnabled(): boolean {
  const explicit = parseBooleanEnvFlag(process.env.SUBMIT_FIND_DRY_RUN)
  if (explicit !== null) return explicit

  // Safe-by-default for local development.
  return process.env.NODE_ENV === "development"
}

type RateBucket = number[]
const rateLimitMap: Map<string, RateBucket> =
  (globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit ??
  new Map()
;(globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit =
  rateLimitMap

// Tracks last submission time of each SKU per client: "ip:sku" -> timestamp
const skuThrottleMap: Map<string, number> =
  (globalThis as unknown as { __pennySkuThrottle?: Map<string, number> }).__pennySkuThrottle ??
  new Map()
;(globalThis as unknown as { __pennySkuThrottle?: Map<string, number> }).__pennySkuThrottle =
  skuThrottleMap

// Tracks last submission timestamp per client for rapid-fire detection
const lastSubmitMap: Map<string, number> =
  (globalThis as unknown as { __pennyLastSubmit?: Map<string, number> }).__pennyLastSubmit ??
  new Map()
;(globalThis as unknown as { __pennyLastSubmit?: Map<string, number> }).__pennyLastSubmit =
  lastSubmitMap

const submissionItemSchema = z
  .object({
    itemName: z.string().trim().min(1).max(75),
    sku: z.string(),
    storeCity: z.string().optional(),
    storeState: z.string().min(2).max(2),
    dateFound: z.string(),
    quantity: z.string().optional(),
    notes: z.string().optional(),
    website: z.string().optional(), // honeypot
  })
  .strip() // Strip any extra fields (photoUrl/upload attempts are ignored).

const submissionBatchSchema = z
  .object({
    items: z.array(submissionItemSchema).min(1).max(BATCH_SUBMIT_MAX_ITEMS),
  })
  .strip()

type SubmissionItemInput = z.infer<typeof submissionItemSchema>

/**
 * Validates that the submitted date is within the last 30 days.
 * This allows users flexibility to report recent finds while preventing
 * very old backdated submissions. "Last Seen" uses submission timestamp
 * (not this date) to ensure freshness signals reflect actual activity.
 */
function validateDateWithin30Days(dateStr: string): { isValid: boolean; error?: string } {
  const submittedDate = new Date(dateStr)
  const today = new Date()

  // Check if the date is valid
  if (Number.isNaN(submittedDate.getTime())) {
    return { isValid: false, error: "Invalid date format" }
  }

  // Get dates as UTC day boundaries (ignore time)
  const submittedDateUTC = Date.UTC(
    submittedDate.getUTCFullYear(),
    submittedDate.getUTCMonth(),
    submittedDate.getUTCDate()
  )

  const todayUTC = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

  // Reject future dates
  if (submittedDateUTC > todayUTC) {
    return {
      isValid: false,
      error: "Date cannot be in the future.",
    }
  }

  // Calculate 30 days ago (in UTC day boundaries)
  const thirtyDaysAgoMs = todayUTC - 30 * 24 * 60 * 60 * 1000

  // Reject dates older than 30 days
  if (submittedDateUTC < thirtyDaysAgoMs) {
    return {
      isValid: false,
      error: "Date must be within the last 30 days.",
    }
  }

  return { isValid: true }
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (request as any).ip || "unknown"
}

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for")
  const realIp = request.headers.get("x-real-ip")
  const userAgent = request.headers.get("user-agent")?.slice(0, 128).trim() || "unknown-ua"

  const ip =
    forwarded?.split(",")[0].trim() || (realIp ? realIp.trim() : "") || getClientIp(request)

  // If IP is unavailable, avoid collapsing all users into a single "unknown" bucket.
  if (!ip || ip === "unknown") return `ua:${userAgent}`

  return ip
}

function getRecentSubmissions(key: string): number[] {
  const now = Date.now()
  const bucket = rateLimitMap.get(key) ?? []
  const recent = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  // Always prune the bucket so it doesn't grow forever.
  rateLimitMap.set(key, recent)

  return recent
}

function getRateLimitRemaining(key: string): number {
  return Math.max(0, RATE_LIMIT_MAX - getRecentSubmissions(key).length)
}

function isRateLimited(key: string): boolean {
  const remaining = getRateLimitRemaining(key)

  return remaining <= 0
}

function recordSuccessfulSubmission(key: string) {
  const now = Date.now()
  const recent = getRecentSubmissions(key)
  recent.push(now)
  rateLimitMap.set(key, recent)
}

function isDuplicateSkuThrottled(clientKey: string, sku: string): boolean {
  const compositeKey = `${clientKey}:${sku}`
  const lastTime = skuThrottleMap.get(compositeKey)
  if (lastTime && Date.now() - lastTime < DUPLICATE_SKU_WINDOW_MS) return true
  return false
}

function recordSkuSubmission(clientKey: string, sku: string) {
  skuThrottleMap.set(`${clientKey}:${sku}`, Date.now())

  // Prune entries older than the window to prevent unbounded growth
  const cutoff = Date.now() - DUPLICATE_SKU_WINDOW_MS
  for (const [key, ts] of skuThrottleMap) {
    if (ts < cutoff) skuThrottleMap.delete(key)
  }
}

function isRapidFire(clientKey: string): boolean {
  const lastTime = lastSubmitMap.get(clientKey)
  if (lastTime && Date.now() - lastTime < RAPID_FIRE_COOLDOWN_MS) return true
  return false
}

function recordSubmitTime(clientKey: string) {
  lastSubmitMap.set(clientKey, Date.now())

  // Prune stale entries
  const cutoff = Date.now() - RAPID_FIRE_COOLDOWN_MS * 2
  for (const [key, ts] of lastSubmitMap) {
    if (ts < cutoff) lastSubmitMap.delete(key)
  }
}

function hashClientIdentifier(ip: string): string {
  return createHash("sha256").update(ip).digest("hex")
}

type SupabaseClientLike = ReturnType<typeof getSupabaseClient>

function getSupabaseServerClient(): SupabaseClientLike {
  const override = (globalThis as { __supabaseClientOverride?: SupabaseClientLike })
    .__supabaseClientOverride
  if (override) return override
  return getSupabaseClient()
}

type SupabaseServiceRoleClientLike = ReturnType<typeof getSupabaseServiceRoleClient>

function getSupabaseServiceRoleServerClient(): SupabaseServiceRoleClientLike {
  const override = (
    globalThis as { __supabaseServiceRoleClientOverride?: SupabaseServiceRoleClientLike }
  ).__supabaseServiceRoleClientOverride
  if (override) return override
  return getSupabaseServiceRoleClient()
}

type EnrichmentData = {
  item_name?: string | null
  brand?: string | null
  model_number?: string | null
  upc?: string | null
  image_url?: string | null
  home_depot_url?: string | null
  internet_sku?: number | null
  retail_price?: number | null
  enrichment_provenance?: Record<string, unknown> | null
}

type PennyListRowForRealtimeSerpApi = {
  id: string
  home_depot_sku_6_or_10_digits: string
  item_name: string | null
  brand: string | null
  model_number: string | null
  upc: string | null
  image_url: string | null
  home_depot_url: string | null
  internet_sku: number | null
  retail_price: number | null
  enrichment_attempts: number | null
  enrichment_provenance: Record<string, unknown> | null
}

type SelfEnrichmentCandidate = EnrichmentData & {
  timestamp?: string | null
}

function hasTrustedItemNameSource(provenance: Record<string, unknown> | null | undefined): boolean {
  const itemNameEntry = (provenance?.item_name ?? null) as {
    source?: unknown
  } | null
  const source = typeof itemNameEntry?.source === "string" ? itemNameEntry.source : ""
  return (
    source === "staging" ||
    source === "serpapi" ||
    source === "manual" ||
    source === "self_enriched"
  )
}

function getTrustedItemNameProvenance(
  provenance: Record<string, unknown> | null | undefined
): Record<string, unknown> | null {
  const itemNameEntry = (provenance?.item_name ?? null) as Record<string, unknown> | null
  if (!itemNameEntry || typeof itemNameEntry !== "object") return null
  const source = typeof itemNameEntry.source === "string" ? itemNameEntry.source : ""
  if (
    source !== "staging" &&
    source !== "serpapi" &&
    source !== "manual" &&
    source !== "self_enriched"
  ) {
    return null
  }
  return itemNameEntry
}

function getSelfEnrichedCanonicalItemName(
  enrichment: EnrichmentData | null | undefined
): string | null {
  if (!enrichment?.item_name || typeof enrichment.item_name !== "string") return null
  const candidateName = enrichment.item_name.trim()
  if (!candidateName) return null

  if (hasTrustedItemNameSource(enrichment.enrichment_provenance)) {
    return candidateName
  }

  const hasSupportingCanonicalSignals =
    hasNonEmptyText(enrichment.brand) ||
    hasNonEmptyText(enrichment.model_number) ||
    hasNonEmptyText(enrichment.upc) ||
    hasNonEmptyText(enrichment.image_url) ||
    hasNonEmptyText(enrichment.home_depot_url) ||
    (typeof enrichment.internet_sku === "number" && enrichment.internet_sku > 0)

  if (!hasSupportingCanonicalSignals) return null
  if (isLowQualityItemName(candidateName, enrichment.brand)) return null

  return candidateName
}

function parseTimestampMs(value: string | null | undefined): number {
  if (!value) return 0
  const ms = new Date(value).getTime()
  return Number.isFinite(ms) ? ms : 0
}

function getSelfEnrichmentScore(row: SelfEnrichmentCandidate): number {
  let score = 0
  if (getSelfEnrichedCanonicalItemName(row)) score += 5
  if (hasNonEmptyText(row.brand)) score += 3
  if (hasNonEmptyText(row.image_url)) score += 3
  if (hasNonEmptyText(row.home_depot_url)) score += 2
  if (hasNonEmptyText(row.model_number)) score += 2
  if (hasNonEmptyText(row.upc)) score += 1
  if (typeof row.internet_sku === "number" && row.internet_sku > 0) score += 1
  if (typeof row.retail_price === "number" && row.retail_price > 0) score += 1
  return score
}

function pickBestSelfEnrichment(rows: SelfEnrichmentCandidate[]): EnrichmentData | null {
  if (!Array.isArray(rows) || rows.length === 0) return null

  const sorted = [...rows].sort((a, b) => {
    const scoreDiff = getSelfEnrichmentScore(b) - getSelfEnrichmentScore(a)
    if (scoreDiff !== 0) return scoreDiff
    return parseTimestampMs(b.timestamp) - parseTimestampMs(a.timestamp)
  })

  return sorted[0]
}

/**
 * Lookup self-enrichment data from existing Penny List rows with the same SKU.
 * This provides "self-enrichment" where previous submissions of the same SKU
 * can provide data for new submissions.
 *
 * Note: Item Cache enrichment is applied AFTER insert via RPC.
 *
 * @returns Enrichment data from existing Penny List rows, or null
 */
async function lookupSelfEnrichment(
  supabase: SupabaseClientLike,
  sku: string
): Promise<EnrichmentData | null> {
  // Safety: if test overrides provide a minimal client without select/eq chaining, skip enrichment
  if (!supabase || typeof supabase.from !== "function") {
    return null
  }
  try {
    const pennyListTable = supabase.from("Penny List") as unknown
    if (
      typeof (pennyListTable as { select?: ((columns: string) => unknown) | undefined }).select !==
      "function"
    ) {
      return null
    }

    const selectBuilder = (pennyListTable as { select: (columns: string) => unknown }).select(
      "item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price, enrichment_provenance, timestamp"
    )

    if (
      typeof (selectBuilder as { eq?: ((column: string, value: string) => unknown) | undefined })
        .eq !== "function"
    ) {
      return null
    }

    const bySku = (selectBuilder as { eq: (column: string, value: string) => unknown }).eq(
      "home_depot_sku_6_or_10_digits",
      sku
    )

    // Primary path in production: fetch a small candidate set and pick most complete/recent row.
    if (
      typeof (
        bySku as {
          order?: ((column: string, options: { ascending: boolean }) => unknown) | undefined
        }
      ).order === "function"
    ) {
      const ordered = (
        bySku as { order: (column: string, options: { ascending: boolean }) => unknown }
      ).order("timestamp", { ascending: false })

      if (
        typeof (ordered as { limit?: ((count: number) => Promise<unknown>) | undefined }).limit ===
        "function"
      ) {
        const result = (await (
          ordered as { limit: (count: number) => Promise<{ data: unknown; error: unknown }> }
        ).limit(20)) as {
          data: unknown
          error: unknown
        }

        if (!result.error && Array.isArray(result.data) && result.data.length > 0) {
          return pickBestSelfEnrichment(result.data as SelfEnrichmentCandidate[])
        }
      }
    }

    // Fallback for minimal test mocks.
    if (
      typeof (bySku as { limit?: ((count: number) => unknown) | undefined }).limit === "function"
    ) {
      const limited = (bySku as { limit: (count: number) => unknown }).limit(1)
      if (
        typeof (limited as { maybeSingle?: (() => Promise<unknown>) | undefined }).maybeSingle ===
        "function"
      ) {
        const result = (await (
          limited as { maybeSingle: () => Promise<{ data: unknown; error: unknown }> }
        ).maybeSingle()) as {
          data: unknown
          error: unknown
        }

        if (!result.error && result.data) {
          return result.data as EnrichmentData
        }
      }
    }
  } catch (error) {
    // Skip enrichment if client is minimally mocked (tests) or query builder is incomplete
    console.warn("Error during self-enrichment lookup, skipping:", error)
  }

  return null
}

function hasNonEmptyText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}

function hasValidRetailPrice(value: unknown): boolean {
  const num = typeof value === "number" ? value : Number(value)
  return Number.isFinite(num) && num > 0
}

function hasCanonicalGap(
  row: Pick<
    PennyListRowForRealtimeSerpApi,
    "item_name" | "brand" | "image_url" | "home_depot_url" | "retail_price"
  >
): boolean {
  if (!hasNonEmptyText(row.item_name)) return true
  if (isLowQualityItemName(row.item_name, row.brand)) return true
  if (!hasNonEmptyText(row.brand)) return true
  if (!hasNonEmptyText(row.image_url)) return true
  if (!hasNonEmptyText(row.home_depot_url)) return true
  if (!hasValidRetailPrice(row.retail_price)) return true
  return false
}

function isConfirmedAbsentByStaging(
  provenance: Record<string, unknown> | null,
  field: "upc" | "internet_sku"
): boolean {
  const entry = (provenance?.[field] ?? null) as unknown as {
    source?: unknown
    confirmed_absent?: unknown
  } | null

  return entry?.source === "staging" && entry?.confirmed_absent === true
}

function getRealtimeSerpApiDailyCap(): number {
  const raw = String(process.env.SERPAPI_REALTIME_DAILY_CAP || "").trim()
  const parsed = raw ? Number.parseInt(raw, 10) : NaN
  if (Number.isFinite(parsed) && parsed >= 1) return parsed
  return 5
}

async function shouldRunRealtimeSerpApiForSubmission(
  serviceClient: SupabaseServiceRoleClientLike,
  sku: string,
  submitterHash: string | null,
  requestMode: "single" | "batch"
): Promise<boolean> {
  // Batch submissions are intentionally SerpApi-silent to avoid credit spikes.
  if (requestMode === "batch") return false

  // If no key is configured, nothing to do.
  if (!process.env.SERPAPI_KEY) return false

  // Independence gate: require at least two unique submitter hashes for this SKU.
  // If hash is unavailable, fail closed to protect credits.
  if (!submitterHash) return false

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const table = (serviceClient as any)?.from?.("Penny List")
    if (!table || typeof table.select !== "function") return false

    // Some tests provide intentionally minimal query builders; fail closed quietly.
    const selected = table.select("submitter_hash")
    if (!selected || typeof selected.eq !== "function") return false
    const bySku = selected.eq("home_depot_sku_6_or_10_digits", sku)
    if (!bySku || typeof bySku.not !== "function") return false
    const nonNull = bySku.not("submitter_hash", "is", null)
    if (!nonNull || typeof nonNull.limit !== "function") return false
    const query = nonNull.limit(100)

    const { data, error } = (await query) as {
      data: Array<{ submitter_hash?: string | null }> | null
      error: { message?: string } | null
    }

    if (error || !Array.isArray(data)) return false

    const uniqueHashes = new Set(
      data
        .map((row) => (typeof row.submitter_hash === "string" ? row.submitter_hash : null))
        .filter((value): value is string => Boolean(value))
    )

    // Include current submitter hash in case the immediate read is slightly stale.
    uniqueHashes.add(submitterHash)

    return uniqueHashes.size >= 2
  } catch (error) {
    console.warn("Realtime SerpApi independence check failed; skipping realtime enrichment:", error)
    return false
  }
}

async function maybeRealtimeSerpApiEnrich(
  serviceClient: SupabaseServiceRoleClientLike,
  pennyId: string
): Promise<void> {
  try {
    const serpApiKey = process.env.SERPAPI_KEY
    if (!serpApiKey) return

    // Unit tests may provide a minimal Supabase mock that doesn't implement query builders.
    // Realtime SerpApi is non-critical; skip safely if the client is mocked/incomplete.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pennyListTable = (serviceClient as any)?.from?.("Penny List")
    if (!pennyListTable || typeof pennyListTable.select !== "function") return

    const { data: row, error: rowError } = await pennyListTable
      .select(
        "id, home_depot_sku_6_or_10_digits, item_name, brand, model_number, upc, image_url, home_depot_url, internet_sku, retail_price, enrichment_attempts, enrichment_provenance"
      )
      .eq("id", pennyId)
      .single()

    if (rowError || !row) {
      console.warn(
        "Realtime SerpApi skipped: failed to fetch newly inserted row:",
        rowError?.message
      )
      return
    }

    const typedRow = row as unknown as PennyListRowForRealtimeSerpApi
    if (!hasCanonicalGap(typedRow)) return

    const cap = getRealtimeSerpApiDailyCap()
    const { data: slotData, error: slotError } = await serviceClient.rpc(
      "claim_serpapi_realtime_slot",
      {
        p_max_per_day: cap,
      }
    )

    if (slotError) {
      console.warn("Realtime SerpApi skipped: failed to claim daily slot:", slotError.message)
      return
    }

    const slot = slotData as unknown as { allowed?: boolean; count?: number } | null
    if (!slot?.allowed) {
      console.log(`Realtime SerpApi skipped: daily cap reached (${cap}/day).`)
      return
    }

    const deliveryZip = getSerpApiDeliveryZip()
    const needUpc =
      !hasNonEmptyText(typedRow.upc) &&
      !isConfirmedAbsentByStaging(typedRow.enrichment_provenance, "upc") &&
      !isConfirmedAbsentByStaging(typedRow.enrichment_provenance, "internet_sku")

    const { result, creditsUsed } = await enrichHomeDepotSkuWithSerpApi({
      apiKey: serpApiKey,
      sku: typedRow.home_depot_sku_6_or_10_digits,
      itemNameForMatch: typedRow.item_name,
      needUpc,
      deliveryZip,
    })

    if (!result) {
      const currentAttempts = typedRow.enrichment_attempts || 0
      await serviceClient
        .from("Penny List")
        .update({ enrichment_attempts: currentAttempts + 1 })
        .eq("id", typedRow.id)
      return
    }

    const nowIso = new Date().toISOString()
    const baseProv = (typedRow.enrichment_provenance ?? {}) as Record<string, unknown>
    const nextProv: Record<string, unknown> = {
      ...baseProv,
      _schema: 1,
      _serpapi: {
        at: nowIso,
        delivery_zip: deliveryZip,
        credits_attempted: creditsUsed,
        search_term: result.searchTerm,
      },
    }

    const provEntry = { source: "serpapi", at: nowIso, delivery_zip: deliveryZip }
    const patch: Record<string, unknown> = {}

    if (
      !hasTrustedItemNameSource(typedRow.enrichment_provenance) &&
      hasNonEmptyText(result.item_name)
    ) {
      patch.item_name = result.item_name?.trim()
      nextProv.item_name = provEntry
    }
    if (!hasNonEmptyText(typedRow.brand) && hasNonEmptyText(result.brand)) {
      patch.brand = result.brand
      nextProv.brand = provEntry
    }
    if (!hasNonEmptyText(typedRow.model_number) && hasNonEmptyText(result.model_number)) {
      patch.model_number = result.model_number
      nextProv.model_number = provEntry
    }
    if (!hasNonEmptyText(typedRow.image_url) && hasNonEmptyText(result.image_url)) {
      patch.image_url = result.image_url
      nextProv.image_url = provEntry
    }
    if (!hasNonEmptyText(typedRow.home_depot_url) && hasNonEmptyText(result.home_depot_url)) {
      patch.home_depot_url = result.home_depot_url
      nextProv.home_depot_url = provEntry
    }
    if (!hasValidRetailPrice(typedRow.retail_price) && hasValidRetailPrice(result.retail_price)) {
      patch.retail_price = result.retail_price
      nextProv.retail_price = provEntry
    }

    if (
      !typedRow.internet_sku &&
      result.internet_sku &&
      !isConfirmedAbsentByStaging(typedRow.enrichment_provenance, "internet_sku")
    ) {
      patch.internet_sku = result.internet_sku
      nextProv.internet_sku = { ...provEntry, confirmed_absent: false }
    }

    if (!hasNonEmptyText(typedRow.upc) && hasNonEmptyText(result.upc)) {
      patch.upc = result.upc
      nextProv.upc = { ...provEntry, confirmed_absent: false }
    }

    if (Object.keys(patch).length === 0) return

    patch.enrichment_provenance = nextProv

    const { error: updateError } = await serviceClient
      .from("Penny List")
      .update(patch)
      .eq("id", typedRow.id)
    if (updateError) {
      console.warn("Realtime SerpApi: failed to update Penny List row:", updateError.message)
    }
  } catch (error) {
    if (error instanceof SerpApiCreditsExhaustedError) {
      console.warn("Realtime SerpApi skipped: credits exhausted:", error.message)
      return
    }
    console.warn("Realtime SerpApi unexpected error:", error)
  }
}

/**
 * Apply Item Cache enrichment via non-consuming RPC.
 * This function is called AFTER insert to merge Item Cache fields and provenance.
 * Unlike consume mode, Item Cache rows remain reusable after apply.
 *
 * @returns Result object with enrichment status
 */
async function applyItemCacheEnrichment(
  serviceClient: SupabaseServiceRoleClientLike,
  pennyId: string,
  sku: string,
  internetSku: number | null
): Promise<{ enriched: boolean; matchType?: string; fieldsFilled?: string[] }> {
  try {
    const { data, error } = await serviceClient.rpc("apply_item_cache_enrichment_for_penny_item", {
      p_penny_id: pennyId,
      p_sku: sku,
      p_internet_number: internetSku,
    })

    if (error) {
      console.warn("Item Cache enrichment RPC error:", error.message)
      return { enriched: false }
    }

    const result = data as {
      enriched: boolean
      match_type?: string
      fields_filled?: string[]
      staging_row_deleted?: boolean
    } | null

    if (result?.enriched) {
      // Log enrichment result per spec requirements.
      console.log("Enrichment applied:", {
        submission_id: pennyId,
        match_type: result.match_type,
        fields_filled_count: result.fields_filled?.length ?? 0,
        item_cache_row_deleted: result.staging_row_deleted,
      })
      return {
        enriched: true,
        matchType: result.match_type,
        fieldsFilled: result.fields_filled,
      }
    }

    return { enriched: false }
  } catch (error) {
    // Log warning but don't fail the request - Item Cache enrichment is non-critical.
    console.warn("Item Cache enrichment error:", error)
    return { enriched: false }
  }
}

type SubmissionStats = { totalReports: number; stateCount: number; isFirstReport: boolean }

type SubmissionProcessingResult =
  | { ok: true; normalizedSku: string; stats?: SubmissionStats }
  | { ok: false; status: number; message: string; normalizedSku?: string }

async function processSubmissionItem(params: {
  body: SubmissionItemInput
  request: NextRequest
  rateKey: string
  requestMode: "single" | "batch"
  supabase: SupabaseClientLike | null
  serviceClient: SupabaseServiceRoleClientLike | null
  dryRunEnabled: boolean
  includeStats: boolean
  seenSkusInRequest: Set<string>
}): Promise<SubmissionProcessingResult> {
  const {
    body,
    request,
    rateKey,
    requestMode,
    supabase,
    serviceClient,
    dryRunEnabled,
    includeStats,
    seenSkusInRequest,
  } = params

  if (body.website && body.website.trim().length > 0) {
    return { ok: false, status: 400, message: "Spam detected." }
  }

  const skuCheck = validateSku(body.sku)
  if (skuCheck.error) {
    return { ok: false, status: 400, message: skuCheck.error }
  }

  const normalizedSku = skuCheck.normalized

  if (seenSkusInRequest.has(normalizedSku)) {
    return {
      ok: false,
      status: 400,
      normalizedSku,
      message: "Duplicate SKU in this basket. Keep one entry per SKU and set quantity instead.",
    }
  }
  seenSkusInRequest.add(normalizedSku)

  if (isDuplicateSkuThrottled(rateKey, normalizedSku)) {
    return {
      ok: false,
      status: 429,
      normalizedSku,
      message:
        "You already reported this item. If you found it at a different store, try again in a few minutes.",
    }
  }

  // Validate date is within the last 30 days
  const dateValidation = validateDateWithin30Days(body.dateFound)
  if (!dateValidation.isValid) {
    return {
      ok: false,
      status: 400,
      normalizedSku,
      message: dateValidation.error || "Invalid date.",
    }
  }

  // Block obvious test/spam SKUs
  const spamPatterns = [
    /^1{10}$/, // 1111111111
    /^(12345678|1234567890|123456789|12345|123456)$/, // Sequential
    /^10{9,}$/, // 1000000000, 1000000001, etc.
    /^(\d)\1{5,}$/, // 6+ repeating digits
  ]

  if (spamPatterns.some((pattern) => pattern.test(normalizedSku.toString()))) {
    return {
      ok: false,
      status: 400,
      normalizedSku,
      message:
        "This SKU appears to be invalid. Please double-check and enter a real Home Depot SKU.",
    }
  }

  // Validate quantity (optional, but if provided must be 1-99)
  let qty: number | undefined
  if (body.quantity && body.quantity.trim().length > 0) {
    qty = Number.parseInt(body.quantity, 10)
    if (Number.isNaN(qty) || qty < 1 || qty > 99) {
      return {
        ok: false,
        status: 400,
        normalizedSku,
        message: "Quantity must be a number between 1 and 99.",
      }
    }
  }

  // Validate state is 2 characters
  if (body.storeState.length !== 2) {
    return { ok: false, status: 400, normalizedSku, message: "State must be a 2‑letter code." }
  }

  // Format location as "City, State" for Google Sheets
  const city = body.storeCity?.trim() || ""
  const state = body.storeState.toUpperCase()
  const location = city ? `${city}, ${state}` : state

  // Step 1 (canonical): lookup self-enrichment from Main List by SKU.
  const enrichment =
    dryRunEnabled || !supabase ? null : await lookupSelfEnrichment(supabase, normalizedSku)

  // Build payload with enrichment data merged in (only include enrichment fields when present).
  // User-submitted itemName is never canonical authority.
  const enrichmentItemName = getSelfEnrichedCanonicalItemName(enrichment)
  const timestampIso = new Date().toISOString()

  const clientIp = getClientIp(request)
  const submitterHash = clientIp && clientIp !== "unknown" ? hashClientIdentifier(clientIp) : null

  const payload: Record<string, unknown> = {
    // User-provided canonical data (always from user input)
    home_depot_sku_6_or_10_digits: normalizedSku,
    store_city_state: location,
    purchase_date: body.dateFound || null,
    exact_quantity_found: qty ?? null,
    notes_optional: body.notes?.trim() || null,
    timestamp: timestampIso,
    submitter_hash: submitterHash,

    // Canonical item_name only comes from self-enrichment / trusted enrichment paths.
    item_name: enrichmentItemName || null,
  }

  if (enrichment) {
    if (enrichment.brand?.trim()) payload.brand = enrichment.brand.trim()
    if (enrichment.model_number?.trim()) payload.model_number = enrichment.model_number.trim()
    if (enrichment.upc?.trim()) payload.upc = enrichment.upc.trim()
    if (typeof enrichment.retail_price === "number") payload.retail_price = enrichment.retail_price
    if (enrichment.image_url?.trim()) payload.image_url = enrichment.image_url.trim()
    if (enrichment.home_depot_url?.trim()) payload.home_depot_url = enrichment.home_depot_url.trim()
    if (typeof enrichment.internet_sku === "number") payload.internet_sku = enrichment.internet_sku

    // Carry forward "confirmed absent" provenance for opportunistic fields, even when value is null.
    // This prevents wasting SerpApi credits attempting to fill fields staging already confirmed do not exist.
    const prov = enrichment.enrichment_provenance ?? null
    if (prov && typeof prov === "object") {
      const upcProv = (prov as Record<string, unknown>).upc as
        | { source?: unknown; confirmed_absent?: unknown }
        | undefined
      const internetProv = (prov as Record<string, unknown>).internet_sku as
        | { source?: unknown; confirmed_absent?: unknown }
        | undefined
      const itemNameProv = getTrustedItemNameProvenance(prov)

      const carried: Record<string, unknown> = {}
      if (upcProv?.source === "staging" && upcProv?.confirmed_absent === true) {
        carried.upc = upcProv
      }
      if (internetProv?.source === "staging" && internetProv?.confirmed_absent === true) {
        carried.internet_sku = internetProv
      }
      if (enrichmentItemName) {
        carried.item_name = itemNameProv ?? {
          source: "self_enriched",
          at: timestampIso,
        }
      }

      if (Object.keys(carried).length > 0) {
        payload.enrichment_provenance = { _schema: 1, ...carried }
      }
    }
  }

  if (dryRunEnabled) {
    recordSuccessfulSubmission(rateKey)
    recordSkuSubmission(rateKey, normalizedSku)
    return { ok: true, normalizedSku }
  }

  if (!serviceClient) {
    return {
      ok: false,
      status: 500,
      normalizedSku,
      message: "Server configuration error. Please contact support.",
    }
  }

  // Insert row first, then apply Item Cache enrichment by RPC.
  const { data: insertedRow, error } = await serviceClient
    .from("Penny List")
    .insert(payload)
    .select("id")
    .single()

  if (error || !insertedRow?.id) {
    // Log detailed error info (code, message, hint) for debugging without exposing to client
    console.error("Supabase insert error:", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
      hint: error?.hint,
      sku: normalizedSku,
    })
    return {
      ok: false,
      status: 500,
      normalizedSku,
      message: "Failed to submit find. Please try again.",
    }
  }

  recordSuccessfulSubmission(rateKey)
  recordSkuSubmission(rateKey, normalizedSku)

  // Step 2 (canonical): apply Item Cache enrichment via non-consuming RPC.
  const itemCacheResult = await applyItemCacheEnrichment(
    serviceClient,
    insertedRow.id,
    normalizedSku,
    typeof payload.internet_sku === "number" ? payload.internet_sku : null
  )

  if (!itemCacheResult.enriched) {
    console.log(
      "Item Cache apply found no match; checking Web Scraper fallback for remaining gaps."
    )
  }

  // Step 3 (canonical): trigger realtime SerpApi only for single-item submits that show
  // independent repeat signal (at least two unique submitter hashes for the SKU).
  const shouldRunRealtimeSerpApi = await shouldRunRealtimeSerpApiForSubmission(
    serviceClient,
    normalizedSku,
    submitterHash,
    requestMode
  )
  if (shouldRunRealtimeSerpApi) {
    // Fire-and-forget: never block user response on SerpApi.
    void maybeRealtimeSerpApiEnrich(serviceClient, insertedRow.id)
  }

  if (!includeStats) {
    return { ok: true, normalizedSku }
  }

  // Gratification stats — how many times this SKU has been reported and across how many states.
  // Enhancement only: if this query fails, we still return a successful response without stats.
  let stats: SubmissionStats | null = null
  try {
    const { data: skuRows } = await serviceClient
      .from("Penny List")
      .select("store_city_state")
      .eq("home_depot_sku_6_or_10_digits", normalizedSku)

    if (skuRows && skuRows.length > 0) {
      const totalReports = skuRows.length
      const states = new Set(
        skuRows
          .map((r: { store_city_state: string | null }) =>
            r.store_city_state?.split(", ").pop()?.trim()
          )
          .filter(Boolean)
      )
      stats = {
        totalReports,
        stateCount: states.size,
        isFirstReport: totalReports === 1,
      }
    }
  } catch {
    // Stats are enhancement — silent fallback
  }

  return { ok: true, normalizedSku, ...(stats ? { stats } : {}) }
}

export async function POST(request: NextRequest) {
  try {
    const rateKey = getRateLimitKey(request)
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "Too many submissions from this device. Please try again later." },
        { status: 429 }
      )
    }

    if (isRapidFire(rateKey)) {
      return NextResponse.json(
        { error: "Please wait a few seconds between submissions." },
        { status: 429 }
      )
    }

    // Parse JSON with explicit error handling
    let requestBody: unknown
    try {
      requestBody = await request.json()
    } catch (jsonError) {
      console.error("Invalid JSON in request body:", jsonError)
      return NextResponse.json(
        { error: "Invalid request format. Please refresh and try again." },
        { status: 400 }
      )
    }

    let requestMode: "single" | "batch" = "single"
    let items: SubmissionItemInput[] = []
    const dryRunEnabled = isSubmitDryRunEnabled()
    const parsedBatch = submissionBatchSchema.safeParse(requestBody)
    if (parsedBatch.success) {
      requestMode = "batch"
      items = parsedBatch.data.items
    } else {
      const parsedSingle = submissionItemSchema.safeParse(requestBody)
      if (!parsedSingle.success) {
        return NextResponse.json(
          { error: "Missing or invalid required fields. Please check the form and try again." },
          { status: 400 }
        )
      }
      items = [parsedSingle.data]
    }

    // Guard: Ensure service role key is configured (prevent permission errors)
    // Place this AFTER request validation so invalid requests still return 400s in CI/tests.
    if (!dryRunEnabled && !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables")
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      )
    }

    const supabase = dryRunEnabled ? null : getSupabaseServerClient()

    // Inserts are intentionally done with the service role client so we can:
    // - Keep the database locked down from direct anon inserts (RLS)
    // - Still allow low-friction submissions via this API route
    const serviceClient = dryRunEnabled ? null : getSupabaseServiceRoleServerClient()

    const seenSkusInRequest = new Set<string>()
    const successes: Array<{ index: number; sku: string; stats?: SubmissionStats }> = []
    const failures: Array<{ index: number; sku?: string; message: string; status: number }> = []

    for (const [index, body] of items.entries()) {
      if (isRateLimited(rateKey)) {
        failures.push({
          index,
          message: "Too many submissions from this device. Please try again later.",
          status: 429,
        })
        continue
      }

      const result = await processSubmissionItem({
        body,
        request,
        rateKey,
        requestMode,
        supabase,
        serviceClient,
        dryRunEnabled,
        includeStats: requestMode === "single",
        seenSkusInRequest,
      })

      if (result.ok) {
        successes.push({
          index,
          sku: result.normalizedSku,
          ...(result.stats ? { stats: result.stats } : {}),
        })
      } else {
        failures.push({
          index,
          ...(result.normalizedSku ? { sku: result.normalizedSku } : {}),
          message: result.message,
          status: result.status,
        })
      }
    }

    if (successes.length > 0) {
      recordSubmitTime(rateKey)
    }

    if (requestMode === "single") {
      if (successes.length === 0) {
        const failure = failures[0]
        return NextResponse.json(
          {
            error: failure?.message || "Failed to submit find. Please try again.",
            dryRun: dryRunEnabled,
          },
          { status: failure?.status || 500 }
        )
      }

      const stats = successes[0]?.stats
      return NextResponse.json({
        success: true,
        dryRun: dryRunEnabled,
        message: dryRunEnabled
          ? "Dry run only: validated your submission. Nothing was written to the live Penny List."
          : "Thanks — your find is now on the Penny List.",
        ...(stats && { stats }),
      })
    }

    return NextResponse.json({
      success: successes.length > 0,
      dryRun: dryRunEnabled,
      mode: "batch",
      attempted: items.length,
      successCount: successes.length,
      failedCount: failures.length,
      succeeded: successes.map((entry) => ({
        index: entry.index,
        sku: entry.sku,
      })),
      failed: failures.map((entry) => ({
        index: entry.index,
        ...(entry.sku ? { sku: entry.sku } : {}),
        message: entry.message,
      })),
      message: dryRunEnabled
        ? successes.length > 0
          ? `Dry run only: validated ${successes.length} of ${items.length} item(s). No live upload was performed.`
          : failures[0]?.message || "No items were validated."
        : successes.length > 0
          ? `Submitted ${successes.length} of ${items.length} item(s).`
          : failures[0]?.message || "No items were submitted.",
    })
  } catch (error) {
    // Log unexpected errors with stack trace for debugging
    console.error("Unexpected error in submit-find endpoint:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json({ error: "Failed to submit find. Please try again." }, { status: 500 })
  }
}
