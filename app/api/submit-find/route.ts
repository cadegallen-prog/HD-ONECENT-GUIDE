import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { validateSku } from "@/lib/sku"
import { getSupabaseClient, getSupabaseServiceRoleClient } from "@/lib/supabase/client"
import { enrichHomeDepotSkuWithSerpApi } from "@/lib/enrichment/serpapi-home-depot-enrich"
import { getSerpApiDeliveryZip, SerpApiCreditsExhaustedError } from "@/lib/serpapi/home-depot"

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000 // 1 hour
const RATE_LIMIT_MAX = 30 // Allows batch submissions (e.g., stack of receipts)

type RateBucket = number[]
const rateLimitMap: Map<string, RateBucket> =
  (globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit ??
  new Map()
;(globalThis as unknown as { __pennyRateLimit?: Map<string, RateBucket> }).__pennyRateLimit =
  rateLimitMap

const submissionSchema = z
  .object({
    itemName: z.string().min(1).max(75),
    sku: z.string(),
    storeCity: z.string().optional(),
    storeState: z.string().min(2).max(2),
    dateFound: z.string(),
    quantity: z.string().optional(),
    notes: z.string().optional(),
    website: z.string().optional(), // honeypot
  })
  .strip() // Strip any extra fields (photoUrl/upload attempts are ignored).

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

function isRateLimited(key: string): boolean {
  const now = Date.now()
  const bucket = rateLimitMap.get(key) ?? []
  const recent = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)

  // Always prune the bucket so it doesn't grow forever.
  rateLimitMap.set(key, recent)

  return recent.length >= RATE_LIMIT_MAX
}

function recordSuccessfulSubmission(key: string) {
  const now = Date.now()
  const bucket = rateLimitMap.get(key) ?? []
  const recent = bucket.filter((ts) => now - ts < RATE_LIMIT_WINDOW_MS)
  recent.push(now)
  rateLimitMap.set(key, recent)
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

function parseTimestampMs(value: string | null | undefined): number {
  if (!value) return 0
  const ms = new Date(value).getTime()
  return Number.isFinite(ms) ? ms : 0
}

function getSelfEnrichmentScore(row: SelfEnrichmentCandidate): number {
  let score = 0
  if (hasNonEmptyText(row.item_name)) score += 5
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

    if (!hasNonEmptyText(typedRow.item_name) && hasNonEmptyText(result.item_name)) {
      patch.item_name = result.item_name
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

export async function POST(request: NextRequest) {
  try {
    const rateKey = getRateLimitKey(request)
    if (isRateLimited(rateKey)) {
      return NextResponse.json(
        { error: "Too many submissions from this device. Please try again later." },
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

    const parsed = submissionSchema.safeParse(requestBody)
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Missing or invalid required fields. Please check the form and try again." },
        { status: 400 }
      )
    }

    const body = parsed.data

    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ error: "Spam detected." }, { status: 400 })
    }

    const skuCheck = validateSku(body.sku)
    if (skuCheck.error) {
      return NextResponse.json({ error: skuCheck.error }, { status: 400 })
    }

    const normalizedSku = skuCheck.normalized

    // Validate date is within the last 30 days
    const dateValidation = validateDateWithin30Days(body.dateFound)
    if (!dateValidation.isValid) {
      return NextResponse.json({ error: dateValidation.error }, { status: 400 })
    }

    // Block obvious test/spam SKUs
    const spamPatterns = [
      /^1{10}$/, // 1111111111
      /^(12345678|1234567890|123456789|12345|123456)$/, // Sequential
      /^10{9,}$/, // 1000000000, 1000000001, etc.
      /^(\d)\1{5,}$/, // 6+ repeating digits
    ]

    if (spamPatterns.some((pattern) => pattern.test(normalizedSku.toString()))) {
      return NextResponse.json(
        {
          error:
            "This SKU appears to be invalid. Please double-check and enter a real Home Depot SKU.",
        },
        { status: 400 }
      )
    }

    // Validate quantity (optional, but if provided must be 1-99)
    let qty: number | undefined
    if (body.quantity && body.quantity.trim().length > 0) {
      qty = Number.parseInt(body.quantity, 10)
      if (Number.isNaN(qty) || qty < 1 || qty > 99) {
        return NextResponse.json(
          { error: "Quantity must be a number between 1 and 99." },
          { status: 400 }
        )
      }
    }

    // Validate state is 2 characters
    if (body.storeState.length !== 2) {
      return NextResponse.json({ error: "State must be a 2‑letter code." }, { status: 400 })
    }

    // Format location as "City, State" for Google Sheets
    const city = body.storeCity?.trim() || ""
    const state = body.storeState.toUpperCase()
    const location = city ? `${city}, ${state}` : state

    const supabase = getSupabaseServerClient()

    // Step 1 (canonical): lookup self-enrichment from Main List by SKU.
    const enrichment = await lookupSelfEnrichment(supabase, normalizedSku)

    // Build payload with enrichment data merged in (only include enrichment fields when present)
    const payload: Record<string, unknown> = {
      // User-provided canonical data (always from user input)
      home_depot_sku_6_or_10_digits: normalizedSku,
      store_city_state: location,
      purchase_date: body.dateFound || null,
      exact_quantity_found: qty ?? null,
      notes_optional: body.notes?.trim() || null,
      timestamp: new Date().toISOString(),

      // Enrichment name override (preferred) or user-provided item name
      item_name: enrichment?.item_name?.trim() || body.itemName.trim(),
    }

    if (enrichment) {
      if (enrichment.brand?.trim()) payload.brand = enrichment.brand.trim()
      if (enrichment.model_number?.trim()) payload.model_number = enrichment.model_number.trim()
      if (enrichment.upc?.trim()) payload.upc = enrichment.upc.trim()
      if (typeof enrichment.retail_price === "number")
        payload.retail_price = enrichment.retail_price
      if (enrichment.image_url?.trim()) payload.image_url = enrichment.image_url.trim()
      if (enrichment.home_depot_url?.trim())
        payload.home_depot_url = enrichment.home_depot_url.trim()
      if (typeof enrichment.internet_sku === "number")
        payload.internet_sku = enrichment.internet_sku

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

        const carried: Record<string, unknown> = {}
        if (upcProv?.source === "staging" && upcProv?.confirmed_absent === true) {
          carried.upc = upcProv
        }
        if (internetProv?.source === "staging" && internetProv?.confirmed_absent === true) {
          carried.internet_sku = internetProv
        }

        if (Object.keys(carried).length > 0) {
          payload.enrichment_provenance = { _schema: 1, ...carried }
        }
      }
    }

    // Guard: Ensure service role key is configured (prevent permission errors)
    // Place this AFTER request validation so invalid requests still return 400s in CI/tests.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing from environment variables")
      return NextResponse.json(
        { error: "Server configuration error. Please contact support." },
        { status: 500 }
      )
    }

    // Inserts are intentionally done with the service role client so we can:
    // - Keep the database locked down from direct anon inserts (RLS)
    // - Still allow low-friction submissions via this API route
    const serviceClient = getSupabaseServiceRoleServerClient()

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
      return NextResponse.json(
        { error: "Failed to submit find. Please try again." },
        { status: 500 }
      )
    }

    recordSuccessfulSubmission(rateKey)

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

    // Step 3 (canonical): Web Scraper runs only if gaps remain after Main List + Item Cache.
    // maybeRealtimeSerpApiEnrich re-reads the row and exits immediately when no canonical gaps remain.
    // Fire-and-forget: never block user response on SerpApi.
    void maybeRealtimeSerpApiEnrich(serviceClient, insertedRow.id)

    return NextResponse.json({
      success: true,
      message: "Thanks — your find is now on the Penny List.",
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
