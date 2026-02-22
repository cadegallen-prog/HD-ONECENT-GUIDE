#!/usr/bin/env tsx

import { execFileSync } from "child_process"
import fs from "fs"
import path from "path"

type CliOptions = {
  startDate: string
  endDate: string
  outDir: string
  includeGa4: boolean
  includeGsc: boolean
  gscSiteUrl?: string
  ga4PropertyId?: string
}

type AuthResult = {
  accessToken: string
  mode: "oauth_refresh_token" | "adc_gcloud"
}

type RunResult = {
  report: string
  rowCount: number
  jsonPath: string
  csvPath: string
  dateMin?: string
  dateMax?: string
  totals?: Record<string, number>
}

type RunSummary = {
  timestamp: string
  startDate: string
  endDate: string
  authMode: AuthResult["mode"]
  gsc: RunResult[]
  ga4: RunResult[]
  errors: string[]
}

const DEFAULT_START_DATE = "2024-01-01"
const DEFAULT_OUT_DIR = path.join(".local", "analytics-history")
const GCLOUD_FALLBACK_PATH = path.join(
  process.env.LOCALAPPDATA ?? "",
  "Google",
  "Cloud SDK",
  "google-cloud-sdk",
  "bin",
  "gcloud.cmd"
)

function nowUtcDate(): string {
  return new Date().toISOString().slice(0, 10)
}

function nowStamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    startDate: DEFAULT_START_DATE,
    endDate: nowUtcDate(),
    outDir: DEFAULT_OUT_DIR,
    includeGa4: true,
    includeGsc: true,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]
    if (arg === "--") {
      continue
    }
    if (arg.startsWith("--start-date=")) {
      options.startDate = arg.split("=", 2)[1]
      continue
    }
    if (arg.startsWith("--end-date=")) {
      options.endDate = arg.split("=", 2)[1]
      continue
    }
    if (arg.startsWith("--out-dir=")) {
      options.outDir = arg.split("=", 2)[1]
      continue
    }
    if (arg.startsWith("--gsc-site-url=")) {
      options.gscSiteUrl = arg.split("=", 2)[1]
      continue
    }
    if (arg.startsWith("--ga4-property-id=")) {
      options.ga4PropertyId = arg.split("=", 2)[1]
      continue
    }
    if (arg === "--start-date" && next) {
      options.startDate = next
      i += 1
      continue
    }
    if (arg === "--end-date" && next) {
      options.endDate = next
      i += 1
      continue
    }
    if (arg === "--out-dir" && next) {
      options.outDir = next
      i += 1
      continue
    }
    if (arg === "--gsc-site-url" && next) {
      options.gscSiteUrl = next
      i += 1
      continue
    }
    if (arg === "--ga4-property-id" && next) {
      options.ga4PropertyId = next
      i += 1
      continue
    }
    if (arg === "--skip-ga4") {
      options.includeGa4 = false
      continue
    }
    if (arg === "--skip-gsc") {
      options.includeGsc = false
      continue
    }
    if (arg === "--help") {
      printHelp()
      process.exit(0)
    }
    throw new Error(`Unknown argument: ${arg}`)
  }

  validateDateInput(options.startDate, "--start-date")
  validateDateInput(options.endDate, "--end-date")
  if (options.startDate > options.endDate) {
    throw new Error("--start-date must be <= --end-date")
  }
  if (!options.includeGa4 && !options.includeGsc) {
    throw new Error("Both sources are disabled. Remove --skip-ga4 or --skip-gsc.")
  }
  return options
}

function printHelp() {
  console.log("Google analytics archive exporter")
  console.log("")
  console.log("Usage:")
  console.log("  npm run analytics:archive -- -- --start-date=2025-01-01 --end-date=2026-02-20")
  console.log("  tsx scripts/archive-google-analytics.ts --start-date=2025-01-01")
  console.log("")
  console.log("Options:")
  console.log(`  --start-date YYYY-MM-DD   (default ${DEFAULT_START_DATE})`)
  console.log("  --end-date YYYY-MM-DD     (default today UTC)")
  console.log(`  --out-dir PATH            (default ${DEFAULT_OUT_DIR})`)
  console.log("  --gsc-site-url URL        (optional override)")
  console.log("  --ga4-property-id ID      (optional override)")
  console.log("  --skip-ga4                (export only GSC)")
  console.log("  --skip-gsc                (export only GA4)")
}

function validateDateInput(value: string, flag: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${flag} must be YYYY-MM-DD`)
  }
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`${flag} is not a valid date`)
  }
}

function parseEnvFile(filePath: string): Record<string, string> {
  if (!fs.existsSync(filePath)) return {}
  const content = fs.readFileSync(filePath, "utf8")
  const result: Record<string, string> = {}

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue
    const eq = trimmed.indexOf("=")
    if (eq <= 0) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    result[key] = value
  }
  return result
}

function getEnv(
  key: string,
  envLocal: Record<string, string>,
  envFallback: Record<string, string>
): string | undefined {
  return process.env[key] ?? envLocal[key] ?? envFallback[key]
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchJsonWithRetry(
  url: string,
  init: RequestInit,
  context: string,
  retries = 3
): Promise<any> {
  let attempt = 0
  let lastError = ""

  while (attempt <= retries) {
    const response = await fetch(url, init)
    const text = await response.text()

    if (response.ok) {
      if (!text) return {}
      return JSON.parse(text)
    }

    const isRetryable = response.status === 429 || response.status >= 500
    const scopeHint = text.includes("ACCESS_TOKEN_SCOPE_INSUFFICIENT")
      ? " | Hint: rerun `gcloud auth application-default login --scopes=https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/webmasters.readonly`."
      : ""
    lastError = `${context} failed (${response.status}): ${truncate(text)}${scopeHint}`
    if (!isRetryable || attempt === retries) {
      throw new Error(lastError)
    }
    const waitMs = 750 * (attempt + 1)
    await sleep(waitMs)
    attempt += 1
  }

  throw new Error(lastError || `${context} failed`)
}

function truncate(input: string, maxLength = 700): string {
  return input.length <= maxLength ? input : `${input.slice(0, maxLength)}...`
}

function getAccessTokenViaGcloud(): string {
  const candidates = ["gcloud", GCLOUD_FALLBACK_PATH]
  for (const cmd of candidates) {
    try {
      const isBatchScript = /\.(cmd|bat)$/i.test(cmd)
      const output = isBatchScript
        ? execFileSync(
            "cmd.exe",
            ["/c", cmd, "auth", "application-default", "print-access-token"],
            { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }
          )
        : execFileSync(cmd, ["auth", "application-default", "print-access-token"], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"],
          })
      const token = output.trim()
      if (token) return token
    } catch {
      // try next candidate
    }
  }
  throw new Error(
    "Unable to retrieve ADC token via gcloud. Run `gcloud auth application-default login`."
  )
}

async function getAccessToken(
  envLocal: Record<string, string>,
  envFallback: Record<string, string>
): Promise<AuthResult> {
  const clientId = getEnv("GOOGLE_OAUTH_CLIENT_ID", envLocal, envFallback)
  const clientSecret = getEnv("GOOGLE_OAUTH_CLIENT_SECRET", envLocal, envFallback)
  const refreshToken = getEnv("GOOGLE_OAUTH_REFRESH_TOKEN", envLocal, envFallback)

  if (clientId && clientSecret && refreshToken) {
    const tokenResponse = await fetchJsonWithRetry(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }).toString(),
      },
      "OAuth refresh token exchange"
    )

    const accessToken = tokenResponse?.access_token
    if (!accessToken || typeof accessToken !== "string") {
      throw new Error("OAuth response did not include access_token.")
    }
    return { accessToken, mode: "oauth_refresh_token" }
  }

  const adcToken = getAccessTokenViaGcloud()
  return { accessToken: adcToken, mode: "adc_gcloud" }
}

function ensureDir(dirPath: string) {
  fs.mkdirSync(dirPath, { recursive: true })
}

function writeJson(filePath: string, payload: unknown) {
  ensureDir(path.dirname(filePath))
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), "utf8")
}

function escapeCsv(value: unknown): string {
  if (value === null || value === undefined) return ""
  const text = String(value)
  if (text.includes(",") || text.includes('"') || text.includes("\n") || text.includes("\r")) {
    return `"${text.replace(/"/g, '""')}"`
  }
  return text
}

function writeCsv(filePath: string, columns: string[], rows: Array<Record<string, unknown>>) {
  ensureDir(path.dirname(filePath))
  const lines: string[] = []
  lines.push(columns.join(","))
  for (const row of rows) {
    lines.push(columns.map((column) => escapeCsv(row[column])).join(","))
  }
  fs.writeFileSync(filePath, lines.join("\n"), "utf8")
}

function collectDateBounds(rows: Array<Record<string, unknown>>): {
  dateMin?: string
  dateMax?: string
} {
  const dates = rows
    .map((row) => row.date)
    .filter((value): value is string => typeof value === "string" && value.length > 0)
    .sort()
  return {
    dateMin: dates[0],
    dateMax: dates[dates.length - 1],
  }
}

function collectTotals(
  rows: Array<Record<string, unknown>>,
  metricKeys: string[]
): Record<string, number> {
  const totals: Record<string, number> = {}
  for (const key of metricKeys) totals[key] = 0
  for (const row of rows) {
    for (const key of metricKeys) {
      const numeric = Number(row[key] ?? 0)
      if (Number.isFinite(numeric)) {
        totals[key] += numeric
      }
    }
  }
  return totals
}

function filterAdditiveGa4Metrics(metrics: string[]): string[] {
  const additive = new Set(["sessions", "screenPageViews", "engagedSessions", "eventCount"])
  return metrics.filter((metric) => additive.has(metric))
}

async function runGscReport(config: {
  accessToken: string
  reportName: string
  siteUrl: string
  startDate: string
  endDate: string
  dimensions: string[]
  runDir: string
}): Promise<RunResult> {
  const endpoint = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
    config.siteUrl
  )}/searchAnalytics/query`
  const rowLimit = 25000
  let startRow = 0
  const allRows: any[] = []
  let page = 0

  while (true) {
    const payload = {
      startDate: config.startDate,
      endDate: config.endDate,
      dimensions: config.dimensions,
      rowLimit,
      startRow,
      searchType: "web",
      dataState: "all",
    }

    const response = await fetchJsonWithRetry(
      endpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      `GSC report ${config.reportName} page ${page}`
    )

    const batch = Array.isArray(response?.rows) ? response.rows : []
    allRows.push(...batch)

    if (batch.length < rowLimit) {
      break
    }
    startRow += batch.length
    page += 1

    if (startRow > 2_000_000) {
      throw new Error(`GSC report ${config.reportName} exceeded safety cap (2,000,000 rows).`)
    }
  }

  const normalizedRows = allRows.map((row) => {
    const record: Record<string, unknown> = {}
    for (let i = 0; i < config.dimensions.length; i += 1) {
      record[config.dimensions[i]] = row.keys?.[i] ?? ""
    }
    record.clicks = Number(row.clicks ?? 0)
    record.impressions = Number(row.impressions ?? 0)
    record.ctr = Number(row.ctr ?? 0)
    record.position = Number(row.position ?? 0)
    return record
  })

  const jsonPath = path.join("gsc", `${config.reportName}.json`)
  const csvPath = path.join("gsc", `${config.reportName}.csv`)
  writeJson(path.join(config.runDir, jsonPath), {
    source: "gsc",
    report: config.reportName,
    siteUrl: config.siteUrl,
    startDate: config.startDate,
    endDate: config.endDate,
    rowCount: normalizedRows.length,
    dimensions: config.dimensions,
    rows: normalizedRows,
  })
  writeCsv(
    path.join(config.runDir, csvPath),
    [...config.dimensions, "clicks", "impressions", "ctr", "position"],
    normalizedRows
  )

  return {
    report: `gsc/${config.reportName}`,
    rowCount: normalizedRows.length,
    jsonPath,
    csvPath,
    ...collectDateBounds(normalizedRows),
    totals: collectTotals(normalizedRows, ["clicks", "impressions"]),
  }
}

function normalizeGa4Date(value: string): string {
  if (/^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`
  }
  return value
}

async function runGa4Report(config: {
  accessToken: string
  reportName: string
  propertyId: string
  startDate: string
  endDate: string
  dimensions: string[]
  metrics: string[]
  dimensionFilter?: Record<string, unknown>
  runDir: string
}): Promise<RunResult> {
  const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${config.propertyId}:runReport`
  const pageSize = 100000
  let offset = 0
  const collectedRows: Array<Record<string, unknown>> = []
  let firstPageHeaders: { dimensions: string[]; metrics: string[] } | null = null

  while (true) {
    const payload = {
      dateRanges: [{ startDate: config.startDate, endDate: config.endDate }],
      dimensions: config.dimensions.map((name) => ({ name })),
      metrics: config.metrics.map((name) => ({ name })),
      limit: String(pageSize),
      offset: String(offset),
      keepEmptyRows: false,
      ...(config.dimensionFilter ? { dimensionFilter: config.dimensionFilter } : {}),
    }

    const response = await fetchJsonWithRetry(
      endpoint,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${config.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      },
      `GA4 report ${config.reportName} offset ${offset}`
    )

    const dimensionHeaders: string[] = Array.isArray(response?.dimensionHeaders)
      ? response.dimensionHeaders.map((header: any) => String(header.name))
      : config.dimensions
    const metricHeaders: string[] = Array.isArray(response?.metricHeaders)
      ? response.metricHeaders.map((header: any) => String(header.name))
      : config.metrics

    if (!firstPageHeaders) {
      firstPageHeaders = { dimensions: dimensionHeaders, metrics: metricHeaders }
    }

    const rows = Array.isArray(response?.rows) ? response.rows : []
    for (const row of rows) {
      const record: Record<string, unknown> = {}
      for (let i = 0; i < dimensionHeaders.length; i += 1) {
        let value = String(row.dimensionValues?.[i]?.value ?? "")
        if (dimensionHeaders[i] === "date") {
          value = normalizeGa4Date(value)
        }
        record[dimensionHeaders[i]] = value
      }
      for (let i = 0; i < metricHeaders.length; i += 1) {
        const raw = String(row.metricValues?.[i]?.value ?? "0")
        const numeric = Number(raw)
        record[metricHeaders[i]] = Number.isFinite(numeric) ? numeric : raw
      }
      collectedRows.push(record)
    }

    if (rows.length < pageSize) break
    offset += rows.length
    if (offset > 5_000_000) {
      throw new Error(`GA4 report ${config.reportName} exceeded safety cap (5,000,000 rows).`)
    }
  }

  const headerDims = firstPageHeaders?.dimensions ?? config.dimensions
  const headerMetrics = firstPageHeaders?.metrics ?? config.metrics
  const jsonPath = path.join("ga4", `${config.reportName}.json`)
  const csvPath = path.join("ga4", `${config.reportName}.csv`)

  writeJson(path.join(config.runDir, jsonPath), {
    source: "ga4",
    report: config.reportName,
    propertyId: config.propertyId,
    startDate: config.startDate,
    endDate: config.endDate,
    rowCount: collectedRows.length,
    dimensions: headerDims,
    metrics: headerMetrics,
    rows: collectedRows,
  })
  writeCsv(path.join(config.runDir, csvPath), [...headerDims, ...headerMetrics], collectedRows)

  return {
    report: `ga4/${config.reportName}`,
    rowCount: collectedRows.length,
    jsonPath,
    csvPath,
    ...collectDateBounds(collectedRows),
    totals: collectTotals(collectedRows, filterAdditiveGa4Metrics(headerMetrics)),
  }
}

function appendJsonLine(filePath: string, payload: unknown) {
  ensureDir(path.dirname(filePath))
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`, "utf8")
}

function writeSummaryMarkdown(runDir: string, summary: RunSummary) {
  const lines = [
    `# Analytics Archive Run - ${summary.timestamp}`,
    "",
    `- Date range: \`${summary.startDate}\` to \`${summary.endDate}\``,
    `- Auth mode: \`${summary.authMode}\``,
    "",
    "## GSC",
    ...(summary.gsc.length
      ? summary.gsc.map((entry) => {
          const dateRange =
            entry.dateMin && entry.dateMax ? ` | dates ${entry.dateMin}..${entry.dateMax}` : ""
          const totals =
            entry.totals && Object.keys(entry.totals).length > 0
              ? ` | totals ${Object.entries(entry.totals)
                  .map(([key, value]) => `${key}=${Math.round(value)}`)
                  .join(", ")}`
              : ""
          return `- ${entry.report}: ${entry.rowCount} rows${dateRange}${totals} (\`${entry.csvPath}\`, \`${entry.jsonPath}\`)`
        })
      : ["- Skipped"]),
    "",
    "## GA4",
    ...(summary.ga4.length
      ? summary.ga4.map((entry) => {
          const dateRange =
            entry.dateMin && entry.dateMax ? ` | dates ${entry.dateMin}..${entry.dateMax}` : ""
          const totals =
            entry.totals && Object.keys(entry.totals).length > 0
              ? ` | totals ${Object.entries(entry.totals)
                  .map(([key, value]) => `${key}=${Math.round(value)}`)
                  .join(", ")}`
              : ""
          return `- ${entry.report}: ${entry.rowCount} rows${dateRange}${totals} (\`${entry.csvPath}\`, \`${entry.jsonPath}\`)`
        })
      : ["- Skipped"]),
    "",
    "## Errors",
    ...(summary.errors.length ? summary.errors.map((error) => `- ${error}`) : ["- None"]),
  ]

  fs.writeFileSync(path.join(runDir, "summary.md"), lines.join("\n"), "utf8")
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  const envLocal = parseEnvFile(".env.local")
  const envFallback = parseEnvFile(".env")
  const gscSiteUrl =
    options.gscSiteUrl ?? getEnv("GSC_SITE_URL", envLocal, envFallback) ?? undefined
  const ga4PropertyId =
    options.ga4PropertyId ?? getEnv("GA4_PROPERTY_ID", envLocal, envFallback) ?? undefined

  if (options.includeGsc && !gscSiteUrl) {
    throw new Error("GSC site URL missing. Set GSC_SITE_URL or pass --gsc-site-url.")
  }
  if (options.includeGa4 && !ga4PropertyId) {
    throw new Error("GA4 property ID missing. Set GA4_PROPERTY_ID or pass --ga4-property-id.")
  }

  const auth = await getAccessToken(envLocal, envFallback)
  const timestamp = nowStamp()
  const runDir = path.join(options.outDir, "runs", timestamp)
  ensureDir(runDir)

  const gscResults: RunResult[] = []
  const ga4Results: RunResult[] = []
  const errors: string[] = []

  if (options.includeGsc && gscSiteUrl) {
    const gscReports = [
      { name: "daily_totals", dimensions: ["date"] },
      { name: "daily_queries", dimensions: ["date", "query"] },
      { name: "daily_pages", dimensions: ["date", "page"] },
      { name: "daily_countries", dimensions: ["date", "country"] },
      { name: "daily_devices", dimensions: ["date", "device"] },
    ]

    for (const report of gscReports) {
      try {
        const result = await runGscReport({
          accessToken: auth.accessToken,
          reportName: report.name,
          siteUrl: gscSiteUrl,
          startDate: options.startDate,
          endDate: options.endDate,
          dimensions: report.dimensions,
          runDir,
        })
        gscResults.push(result)
        console.log(`GSC ${report.name}: ${result.rowCount} rows`)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        errors.push(`GSC ${report.name}: ${message}`)
        console.error(`GSC ${report.name} failed: ${message}`)
      }
    }
  }

  if (options.includeGa4 && ga4PropertyId) {
    const ga4Reports: Array<{
      name: string
      dimensions: string[]
      metrics: string[]
      dimensionFilter?: Record<string, unknown>
    }> = [
      {
        name: "daily_channel",
        dimensions: ["date", "sessionDefaultChannelGroup"],
        metrics: [
          "sessions",
          "totalUsers",
          "screenPageViews",
          "engagedSessions",
          "averageSessionDuration",
          "engagementRate",
          "bounceRate",
        ],
      },
      {
        name: "daily_pages",
        dimensions: ["date", "pagePath"],
        metrics: [
          "sessions",
          "totalUsers",
          "screenPageViews",
          "engagedSessions",
          "averageSessionDuration",
        ],
      },
      {
        name: "daily_events",
        dimensions: ["date", "eventName"],
        metrics: ["eventCount"],
      },
      {
        name: "daily_report_paths",
        dimensions: ["date", "pagePathPlusQueryString"],
        metrics: ["sessions"],
        dimensionFilter: {
          filter: {
            fieldName: "pagePathPlusQueryString",
            stringFilter: {
              matchType: "CONTAINS",
              value: "/report-find",
            },
          },
        },
      },
    ]

    for (const report of ga4Reports) {
      try {
        const result = await runGa4Report({
          accessToken: auth.accessToken,
          reportName: report.name,
          propertyId: ga4PropertyId,
          startDate: options.startDate,
          endDate: options.endDate,
          dimensions: report.dimensions,
          metrics: report.metrics,
          ...(report.dimensionFilter ? { dimensionFilter: report.dimensionFilter } : {}),
          runDir,
        })
        ga4Results.push(result)
        console.log(`GA4 ${report.name}: ${result.rowCount} rows`)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        errors.push(`GA4 ${report.name}: ${message}`)
        console.error(`GA4 ${report.name} failed: ${message}`)
      }
    }
  }

  const summary: RunSummary = {
    timestamp,
    startDate: options.startDate,
    endDate: options.endDate,
    authMode: auth.mode,
    gsc: gscResults,
    ga4: ga4Results,
    errors,
  }

  writeJson(path.join(runDir, "run-summary.json"), summary)
  writeSummaryMarkdown(runDir, summary)
  appendJsonLine(path.join(options.outDir, "run-index.jsonl"), summary)

  console.log("")
  console.log(`Run folder: ${runDir}`)
  console.log(`Summary: ${path.join(runDir, "summary.md")}`)
  console.log(`Index: ${path.join(options.outDir, "run-index.jsonl")}`)

  if (errors.length > 0) {
    process.exitCode = 1
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error))
  process.exit(1)
})
