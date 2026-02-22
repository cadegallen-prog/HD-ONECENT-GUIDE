#!/usr/bin/env tsx

import fs from "node:fs"
import path from "node:path"
import crypto from "node:crypto"
import { execSync } from "node:child_process"

type Severity = "critical" | "warning" | "info"

interface CheckItem {
  id: string
  severity: Severity
  passed: boolean
  message: string
}

interface CheckSummary {
  checks: CheckItem[]
  criticalFailures: number
  warnings: number
  infos: number
  passed: number
  total: number
  integrityScore: number
}

const ROOT = process.cwd()

const REQUIRED_FILES = [
  ".ai/START_HERE.md",
  ".ai/STATE.md",
  ".ai/BACKLOG.md",
  ".ai/SESSION_LOG.md",
  ".ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md",
  ".ai/impl/founder-autonomy-memory-hardening.md",
  ".ai/topics/FOUNDER_AUTONOMY_CURRENT.md",
  ".ai/HANDOFF_PROTOCOL.md",
  ".ai/VERIFICATION_REQUIRED.md",
  ".ai/DECISION_RIGHTS.md",
  ".ai/CONTRACT.md",
  "VISION_CHARTER.md",
  "README.md",
]

const REQUIRED_HEADINGS: Array<{ filePath: string; needle: string }> = [
  { filePath: ".ai/STATE.md", needle: "# Project State" },
  { filePath: ".ai/BACKLOG.md", needle: "# Backlog" },
  { filePath: ".ai/SESSION_LOG.md", needle: "# Session Log" },
  {
    filePath: ".ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md",
    needle: "# Founder Autonomy Operating System (Canonical SOP)",
  },
  {
    filePath: ".ai/impl/founder-autonomy-memory-hardening.md",
    needle: "# Founder Autonomy + Memory Hardening Plan (Canonical)",
  },
  { filePath: ".ai/topics/FOUNDER_AUTONOMY_CURRENT.md", needle: "# FOUNDER_AUTONOMY_CURRENT" },
  { filePath: ".ai/HANDOFF_PROTOCOL.md", needle: "# Task Completion + Handoff Protocol" },
  { filePath: ".ai/START_HERE.md", needle: "## Read Order (Mandatory)" },
]

const FRESHNESS_RULES: Array<{ filePath: string; maxAgeDays: number; severity: Severity }> = [
  { filePath: ".ai/STATE.md", maxAgeDays: 14, severity: "warning" },
  { filePath: ".ai/BACKLOG.md", maxAgeDays: 14, severity: "warning" },
  { filePath: ".ai/SESSION_LOG.md", maxAgeDays: 7, severity: "warning" },
]

const MULTI_DOMAIN_SOP_PATH = ".ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md"

const REQUIRED_MULTI_DOMAIN_HEADINGS = [
  "## Multi-domain operating system (canonical)",
  "## Domain execution loop (every implementation cycle)",
  "## Required command contract (agent-facing)",
]

const REQUIRED_OPERATING_DOMAINS = [
  "DevOps",
  "Security",
  "Marketing",
  "SEO",
  "Affiliates",
  "Advertising",
  "Monetization",
  "PRD",
  "Planning",
  "Debugging",
  "MVP",
  "Future Projects",
]

const REQUIRED_DOMAIN_ARTIFACT_NEEDLES: Array<{ domain: string; needle: string }> = [
  { domain: "DevOps", needle: "reports/verification/<ts>/summary.md" },
  { domain: "Security", needle: ".ai/SESSION_LOG.md" },
  { domain: "Marketing", needle: "A/B/C" },
  { domain: "SEO", needle: "route/meta/schema evidence" },
  { domain: "Affiliates", needle: "disclosure checks" },
  { domain: "Advertising", needle: "policy matrix/eligibility evidence" },
  { domain: "Monetization", needle: "MONETIZATION_INCIDENT_REGISTER.md" },
  { domain: "PRD", needle: "GOAL/WHY/DONE/NOT DOING/constraints" },
  { domain: "Planning", needle: ".ai/impl/<slug>.md" },
  { domain: "Debugging", needle: "root-cause/fix evidence" },
  { domain: "MVP", needle: "launch checklist" },
  { domain: "Future Projects", needle: ".ai/BACKLOG.md" },
]

type MemoryCommand = "check" | "pack" | "checkpoint" | "drill" | "trend"
type DrillScenario = "missing-file" | "corrupt-heading"
type CheckpointRunStatus = "pass" | "fail"
type CheckpointHistorySource = "checkpoint-live" | "context-pack-backfill"

interface CheckpointHistoryRecord {
  id: string
  timestamp: string
  status: CheckpointRunStatus
  integrityScore: number
  criticalFailures: number | null
  warnings: number | null
  passedChecks: number | null
  totalChecks: number | null
  source: CheckpointHistorySource
  contextPackPath?: string
}

interface TrendDaySummary {
  date: string
  runs: number
  pass: number
  fail: number
  passRate: number
  avgIntegrityScore: number
  latestIntegrityScore: number
}

interface TrendArtifact {
  generatedAt: string
  days: number
  windowStart: string
  windowEnd: string
  runCount: number
  passCount: number
  failCount: number
  checkpointPassRate: number
  avgIntegrityScore: number
  minIntegrityScore: number
  maxIntegrityScore: number
  latestIntegrityScore: number
  latestDeltaFromPrevious: number | null
  liveRunCount: number
  backfillRunCount: number
  passRateTarget: number
  integrityTarget: number
  passRateSloMet: boolean
  integritySloMet: boolean
  daily: TrendDaySummary[]
  failures: Array<{
    timestamp: string
    integrityScore: number
    criticalFailures: number | null
  }>
}

interface TrendReportResult {
  summaryPath: string
  metricsPath: string
  artifact: TrendArtifact
  sloBreached: boolean
}

const DEFAULT_DRILL_TARGET = ".ai/STATE.md"
const DEFAULT_DRILL_SCENARIO: DrillScenario = "missing-file"
const DEFAULT_TREND_DAYS = 7
const MIN_TREND_DAYS = 1
const MAX_TREND_DAYS = 365
const ONE_DAY_MS = 1000 * 60 * 60 * 24
const CHECKPOINT_PASS_RATE_TARGET = 95
const INTEGRITY_SCORE_TARGET = 95
const CHECKPOINT_HISTORY_PATH = path.join("reports", "memory-integrity", "checkpoint-history.jsonl")
const MEMORY_TREND_REPORT_ROOT = path.join("reports", "memory-integrity-weekly")

const parseArgs = (argv: string[]) => {
  const command = (argv[0] || "check").toLowerCase()
  const strict = !argv.includes("--no-strict")
  const scenarioArg = argv.find((arg) => arg.startsWith("--scenario="))
  const targetArg = argv.find((arg) => arg.startsWith("--target="))
  const daysArg = argv.find((arg) => arg.startsWith("--days="))

  const parsedScenario = (scenarioArg?.split("=")[1] || DEFAULT_DRILL_SCENARIO).toLowerCase()
  const scenario: DrillScenario =
    parsedScenario === "corrupt-heading" ? "corrupt-heading" : "missing-file"

  const target = targetArg?.slice("--target=".length) || DEFAULT_DRILL_TARGET
  const parsedDaysRaw = Number(daysArg?.slice("--days=".length) || DEFAULT_TREND_DAYS)
  const parsedDays = Number.isFinite(parsedDaysRaw) ? Math.floor(parsedDaysRaw) : DEFAULT_TREND_DAYS
  const days = Math.max(MIN_TREND_DAYS, Math.min(MAX_TREND_DAYS, parsedDays))

  return {
    command: ["check", "pack", "checkpoint", "drill", "trend"].includes(command)
      ? (command as MemoryCommand)
      : "check",
    strict,
    scenario,
    target,
    days,
  }
}

const absolutePath = (relativePath: string) => path.join(ROOT, relativePath)

const fileExists = (relativePath: string) => fs.existsSync(absolutePath(relativePath))

const readText = (relativePath: string) => fs.readFileSync(absolutePath(relativePath), "utf8")

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const sha256 = (content: string) => crypto.createHash("sha256").update(content).digest("hex")

const countSessionEntries = (content: string) =>
  (content.match(/^##\s+\d{4}-\d{2}-\d{2}/gm) || []).length

const countBacklogP0Items = (content: string) => {
  const p0SectionStart = content.search(/^##\s+P0\b/im)
  if (p0SectionStart < 0) return 0

  const afterP0 = content.slice(p0SectionStart)
  const nextTopSection = afterP0.search(/^##\s+/m)
  const p0Section = nextTopSection > 0 ? afterP0.slice(0, nextTopSection) : afterP0
  return (p0Section.match(/^###\s+/gm) || []).length
}

const extractStateLastUpdated = (content: string) => {
  const match = content.match(/\*\*Last updated:\*\*\s*(.+)/i)
  return match ? match[1].trim() : "Unknown"
}

const extractTopBacklogItem = (content: string) => {
  const p0SectionStart = content.search(/^##\s+P0\b/im)
  if (p0SectionStart < 0) return "No P0 section found"

  const afterP0 = content.slice(p0SectionStart)
  const match = afterP0.match(/^###\s+(.+)$/m)
  return match ? match[1].trim() : "No P0 item found"
}

const extractRecentSessions = (content: string, limit = 3) => {
  return [...content.matchAll(/^##\s+(.+)$/gm)].map((m) => m[1].trim()).slice(0, limit)
}

const extractIncidentIds = (content: string) => {
  const ids = content.match(/INC-[A-Z]+-\d+/g) || []
  return [...new Set(ids)].slice(0, 8)
}

const asPosixPath = (value: string) => value.replace(/\\/g, "/")

const toIsoDate = (value: string) => {
  const parsed = new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
}

const toNumberOrNull = (value: unknown) => {
  if (value === null || value === undefined || value === "") return null
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

const parseContextPackDirectoryTimestamp = (directoryName: string) => {
  const normalized = directoryName.replace(/T(\d{2})-(\d{2})-(\d{2})$/, "T$1:$2:$3")
  return toIsoDate(`${normalized}Z`)
}

const readCheckpointHistory = (): CheckpointHistoryRecord[] => {
  if (!fileExists(CHECKPOINT_HISTORY_PATH)) return []

  const lines = readText(CHECKPOINT_HISTORY_PATH)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const parsed: CheckpointHistoryRecord[] = []

  for (const [index, line] of lines.entries()) {
    try {
      const raw = JSON.parse(line) as Partial<CheckpointHistoryRecord>
      const timestamp = typeof raw.timestamp === "string" ? toIsoDate(raw.timestamp) : null
      if (!timestamp) continue

      const status: CheckpointRunStatus = raw.status === "fail" ? "fail" : "pass"
      const integrityScore = toNumberOrNull(raw.integrityScore)
      if (integrityScore === null) continue

      const source: CheckpointHistorySource =
        raw.source === "context-pack-backfill" ? "context-pack-backfill" : "checkpoint-live"

      parsed.push({
        id:
          typeof raw.id === "string" && raw.id.length > 0 ? raw.id : `legacy-${index}-${timestamp}`,
        timestamp,
        status,
        integrityScore,
        criticalFailures: toNumberOrNull(raw.criticalFailures),
        warnings: toNumberOrNull(raw.warnings),
        passedChecks: toNumberOrNull(raw.passedChecks),
        totalChecks: toNumberOrNull(raw.totalChecks),
        source,
        contextPackPath:
          typeof raw.contextPackPath === "string" && raw.contextPackPath.length > 0
            ? asPosixPath(raw.contextPackPath)
            : undefined,
      })
    } catch {
      // Ignore malformed lines to keep history loading fail-soft.
    }
  }

  return parsed.sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

const appendCheckpointHistoryRecord = (record: CheckpointHistoryRecord) => {
  fs.mkdirSync(path.dirname(absolutePath(CHECKPOINT_HISTORY_PATH)), { recursive: true })
  fs.appendFileSync(absolutePath(CHECKPOINT_HISTORY_PATH), `${JSON.stringify(record)}\n`)
}

const backfillCheckpointHistoryFromContextPacks = (
  existing: CheckpointHistoryRecord[]
): CheckpointHistoryRecord[] => {
  const contextPackRoot = absolutePath(path.join("reports", "context-packs"))
  if (!fs.existsSync(contextPackRoot)) return []

  const existingIds = new Set(existing.map((entry) => entry.id))
  const existingContextPaths = new Set(
    existing
      .map((entry) => entry.contextPackPath)
      .filter((value): value is string => Boolean(value))
  )

  const directories = fs
    .readdirSync(contextPackRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()

  const additions: CheckpointHistoryRecord[] = []

  for (const directoryName of directories) {
    const timestamp = parseContextPackDirectoryTimestamp(directoryName)
    if (!timestamp) continue

    const contextPackPath = asPosixPath(
      path.join("reports", "context-packs", directoryName, "context-pack.md")
    )
    if (existingContextPaths.has(contextPackPath)) continue

    const absoluteContextPackPath = absolutePath(contextPackPath)
    if (!fs.existsSync(absoluteContextPackPath)) continue

    const markdown = fs.readFileSync(absoluteContextPackPath, "utf8")
    const scoreMatch = markdown.match(/Memory integrity score:\s*([\d.]+)%/i)
    const criticalMatch = markdown.match(/Critical failures:\s*(\d+)/i)
    const warningMatch = markdown.match(/Warnings:\s*(\d+)/i)

    if (!scoreMatch) continue

    const integrityScore = Number(scoreMatch[1])
    if (!Number.isFinite(integrityScore)) continue

    const criticalFailures = criticalMatch ? Number(criticalMatch[1]) : null
    const warnings = warningMatch ? Number(warningMatch[1]) : null
    const status: CheckpointRunStatus =
      criticalFailures !== null && criticalFailures > 0 ? "fail" : "pass"

    const id = `context-pack-backfill:${directoryName}`
    if (existingIds.has(id)) continue

    additions.push({
      id,
      timestamp,
      status,
      integrityScore: Number(integrityScore.toFixed(1)),
      criticalFailures,
      warnings,
      passedChecks: null,
      totalChecks: null,
      source: "context-pack-backfill",
      contextPackPath,
    })
  }

  return additions
}

const loadCheckpointHistory = (): CheckpointHistoryRecord[] => {
  const existing = readCheckpointHistory()
  const backfilled = backfillCheckpointHistoryFromContextPacks(existing)

  if (backfilled.length > 0) {
    for (const entry of backfilled) {
      appendCheckpointHistoryRecord(entry)
    }
  }

  return [...existing, ...backfilled].sort((a, b) => a.timestamp.localeCompare(b.timestamp))
}

const recordCheckpointRun = (
  summary: CheckSummary,
  status: CheckpointRunStatus,
  options?: {
    timestamp?: string
    contextPackPath?: string
  }
) => {
  const timestamp =
    toIsoDate(options?.timestamp || new Date().toISOString()) || new Date().toISOString()
  const contextPackPath = options?.contextPackPath
    ? asPosixPath(options.contextPackPath)
    : undefined

  const entry: CheckpointHistoryRecord = {
    id: `checkpoint-live:${Date.now()}:${process.pid}:${Math.random().toString(36).slice(2, 8)}`,
    timestamp,
    status,
    integrityScore: summary.integrityScore,
    criticalFailures: summary.criticalFailures,
    warnings: summary.warnings,
    passedChecks: summary.passed,
    totalChecks: summary.total,
    source: "checkpoint-live",
    contextPackPath,
  }

  appendCheckpointHistoryRecord(entry)
}

const generateMemoryTrendReport = (days: number): TrendReportResult => {
  const history = loadCheckpointHistory()
  if (history.length === 0) {
    throw new Error(
      "No checkpoint history available. Run `npm run ai:checkpoint` to generate baseline records."
    )
  }

  const now = new Date()
  const windowEnd = now.toISOString()
  const windowStartDate = new Date(now.getTime() - days * ONE_DAY_MS)
  const windowStart = windowStartDate.toISOString()

  const inWindow = history.filter((entry) => {
    const ts = new Date(entry.timestamp).getTime()
    return ts >= windowStartDate.getTime() && ts <= now.getTime()
  })

  if (inWindow.length === 0) {
    throw new Error(
      `No checkpoint history entries found in the last ${days} day(s). Run \`npm run ai:checkpoint\` and retry.`
    )
  }

  const ordered = [...inWindow].sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  const passCount = ordered.filter((entry) => entry.status === "pass").length
  const failCount = ordered.length - passCount
  const checkpointPassRate = Number(((passCount / ordered.length) * 100).toFixed(1))

  const scores = ordered.map((entry) => entry.integrityScore)
  const avgIntegrityScore = Number(
    (scores.reduce((sum, value) => sum + value, 0) / scores.length).toFixed(1)
  )
  const minIntegrityScore = Number(Math.min(...scores).toFixed(1))
  const maxIntegrityScore = Number(Math.max(...scores).toFixed(1))
  const latestIntegrityScore = Number(scores[scores.length - 1].toFixed(1))
  const previousIntegrityScore = scores.length > 1 ? scores[scores.length - 2] : null
  const latestDeltaFromPrevious =
    previousIntegrityScore === null
      ? null
      : Number((latestIntegrityScore - previousIntegrityScore).toFixed(1))

  const liveRunCount = ordered.filter((entry) => entry.source === "checkpoint-live").length
  const backfillRunCount = ordered.filter(
    (entry) => entry.source === "context-pack-backfill"
  ).length

  const dailyMap = new Map<
    string,
    {
      date: string
      runs: number
      pass: number
      fail: number
      scores: number[]
      lastTimestamp: string
      latestIntegrityScore: number
    }
  >()

  for (const entry of ordered) {
    const date = entry.timestamp.slice(0, 10)
    const existing = dailyMap.get(date)
    if (!existing) {
      dailyMap.set(date, {
        date,
        runs: 1,
        pass: entry.status === "pass" ? 1 : 0,
        fail: entry.status === "fail" ? 1 : 0,
        scores: [entry.integrityScore],
        lastTimestamp: entry.timestamp,
        latestIntegrityScore: entry.integrityScore,
      })
      continue
    }

    existing.runs += 1
    if (entry.status === "pass") existing.pass += 1
    if (entry.status === "fail") existing.fail += 1
    existing.scores.push(entry.integrityScore)
    if (entry.timestamp >= existing.lastTimestamp) {
      existing.lastTimestamp = entry.timestamp
      existing.latestIntegrityScore = entry.integrityScore
    }
  }

  const daily: TrendDaySummary[] = [...dailyMap.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((day) => ({
      date: day.date,
      runs: day.runs,
      pass: day.pass,
      fail: day.fail,
      passRate: Number(((day.pass / day.runs) * 100).toFixed(1)),
      avgIntegrityScore: Number(
        (day.scores.reduce((sum, value) => sum + value, 0) / day.scores.length).toFixed(1)
      ),
      latestIntegrityScore: Number(day.latestIntegrityScore.toFixed(1)),
    }))

  const failures = ordered
    .filter((entry) => entry.status === "fail")
    .map((entry) => ({
      timestamp: entry.timestamp,
      integrityScore: entry.integrityScore,
      criticalFailures: entry.criticalFailures,
    }))

  const passRateSloMet = checkpointPassRate >= CHECKPOINT_PASS_RATE_TARGET
  const integritySloMet = avgIntegrityScore >= INTEGRITY_SCORE_TARGET

  const artifact: TrendArtifact = {
    generatedAt: now.toISOString(),
    days,
    windowStart,
    windowEnd,
    runCount: ordered.length,
    passCount,
    failCount,
    checkpointPassRate,
    avgIntegrityScore,
    minIntegrityScore,
    maxIntegrityScore,
    latestIntegrityScore,
    latestDeltaFromPrevious,
    liveRunCount,
    backfillRunCount,
    passRateTarget: CHECKPOINT_PASS_RATE_TARGET,
    integrityTarget: INTEGRITY_SCORE_TARGET,
    passRateSloMet,
    integritySloMet,
    daily,
    failures,
  }

  const reportDate = now.toISOString().slice(0, 10)
  const outDir = path.join(ROOT, MEMORY_TREND_REPORT_ROOT, reportDate)
  fs.mkdirSync(outDir, { recursive: true })

  const summaryPath = path.join(MEMORY_TREND_REPORT_ROOT, reportDate, "summary.md")
  const metricsPath = path.join(MEMORY_TREND_REPORT_ROOT, reportDate, "metrics.json")

  const summaryMarkdown = [
    `# Memory Integrity Weekly Trend - ${reportDate}`,
    "",
    "## Window",
    `- Generated at: ${artifact.generatedAt}`,
    `- Range: ${artifact.windowStart} to ${artifact.windowEnd} (last ${artifact.days} day(s))`,
    `- History coverage: ${artifact.liveRunCount} live checkpoint run(s), ${artifact.backfillRunCount} context-pack backfill run(s)`,
    "",
    "## Summary",
    `- Checkpoint runs: ${artifact.runCount}`,
    `- Passes: ${artifact.passCount}`,
    `- Fails: ${artifact.failCount}`,
    `- Checkpoint pass rate: ${artifact.checkpointPassRate}% (target >= ${artifact.passRateTarget}%)`,
    `- Integrity score avg: ${artifact.avgIntegrityScore}% (target >= ${artifact.integrityTarget}%)`,
    `- Integrity score min/max: ${artifact.minIntegrityScore}% / ${artifact.maxIntegrityScore}%`,
    `- Latest integrity score: ${artifact.latestIntegrityScore}%`,
    `- Latest delta vs previous run: ${artifact.latestDeltaFromPrevious === null ? "N/A" : `${artifact.latestDeltaFromPrevious}%`}`,
    `- SLO status: pass-rate=${artifact.passRateSloMet ? "PASS" : "FAIL"}, integrity=${artifact.integritySloMet ? "PASS" : "FAIL"}`,
    "",
    "## Daily Breakdown",
    "| Date | Runs | Pass | Fail | Pass rate | Avg integrity | Latest integrity |",
    "|------|------|------|------|-----------|---------------|------------------|",
    ...artifact.daily.map(
      (row) =>
        `| ${row.date} | ${row.runs} | ${row.pass} | ${row.fail} | ${row.passRate}% | ${row.avgIntegrityScore}% | ${row.latestIntegrityScore}% |`
    ),
    "",
    "## Failed Runs",
    ...(artifact.failures.length === 0
      ? ["- None in this window."]
      : artifact.failures.map(
          (failure) =>
            `- ${failure.timestamp}: integrity ${failure.integrityScore}% (critical failures: ${failure.criticalFailures ?? "unknown"})`
        )),
    "",
    "## Notes",
    "- Backfilled entries are inferred from existing context packs and may not include failed checkpoint attempts that never produced a pack artifact.",
    "- Use `npm run ai:memory:trend -- --days=30` for a wider window when weekly volume is low.",
    "",
  ].join("\n")

  fs.writeFileSync(path.join(outDir, "summary.md"), summaryMarkdown)
  fs.writeFileSync(path.join(outDir, "metrics.json"), `${JSON.stringify(artifact, null, 2)}\n`)

  return {
    summaryPath: asPosixPath(summaryPath),
    metricsPath: asPosixPath(metricsPath),
    artifact,
    sloBreached: !passRateSloMet || !integritySloMet,
  }
}

const getGitInfo = () => {
  const safeExec = (cmd: string) => {
    try {
      return execSync(cmd, { encoding: "utf8" }).trim()
    } catch {
      return "unknown"
    }
  }

  return {
    branch: safeExec("git branch --show-current"),
    head: safeExec("git rev-parse HEAD"),
    originMain: safeExec("git rev-parse origin/main"),
  }
}

const buildChecks = (): CheckSummary => {
  const checks: CheckItem[] = []

  for (const relativePath of REQUIRED_FILES) {
    checks.push({
      id: `exists:${relativePath}`,
      severity: "critical",
      passed: fileExists(relativePath),
      message: fileExists(relativePath)
        ? `${relativePath} exists`
        : `${relativePath} is missing (required for persistent memory)`,
    })
  }

  for (const req of REQUIRED_HEADINGS) {
    const exists = fileExists(req.filePath)
    if (!exists) {
      checks.push({
        id: `heading:${req.filePath}`,
        severity: "critical",
        passed: false,
        message: `${req.filePath} missing; cannot validate heading \"${req.needle}\"`,
      })
      continue
    }

    const content = readText(req.filePath)
    const passed = content.includes(req.needle)
    checks.push({
      id: `heading:${req.filePath}:${req.needle}`,
      severity: "critical",
      passed,
      message: passed
        ? `${req.filePath} contains required heading \"${req.needle}\"`
        : `${req.filePath} missing required heading \"${req.needle}\"`,
    })
  }

  for (const rule of FRESHNESS_RULES) {
    const exists = fileExists(rule.filePath)
    if (!exists) continue

    const stat = fs.statSync(absolutePath(rule.filePath))
    const ageDays = Math.floor((Date.now() - stat.mtimeMs) / (1000 * 60 * 60 * 24))
    const passed = ageDays <= rule.maxAgeDays

    checks.push({
      id: `freshness:${rule.filePath}`,
      severity: rule.severity,
      passed,
      message: passed
        ? `${rule.filePath} freshness OK (${ageDays}d <= ${rule.maxAgeDays}d)`
        : `${rule.filePath} stale (${ageDays}d > ${rule.maxAgeDays}d)`,
    })
  }

  if (fileExists(MULTI_DOMAIN_SOP_PATH)) {
    const sopText = readText(MULTI_DOMAIN_SOP_PATH)

    for (const heading of REQUIRED_MULTI_DOMAIN_HEADINGS) {
      const passed = sopText.includes(heading)
      checks.push({
        id: `autonomy:heading:${heading}`,
        severity: "critical",
        passed,
        message: passed
          ? `${MULTI_DOMAIN_SOP_PATH} contains required section "${heading}"`
          : `${MULTI_DOMAIN_SOP_PATH} missing required section "${heading}"`,
      })
    }

    const requiredColumns = [
      "Domain",
      "Primary owner",
      "Cadence",
      "Cade involvement",
      "Required artifacts",
      "Done criteria",
    ]
    const hasAllColumns = requiredColumns.every((column) => sopText.includes(column))
    checks.push({
      id: "autonomy:matrix-columns",
      severity: "critical",
      passed: hasAllColumns,
      message: hasAllColumns
        ? `${MULTI_DOMAIN_SOP_PATH} includes all required matrix columns`
        : `${MULTI_DOMAIN_SOP_PATH} is missing one or more required matrix columns`,
    })

    for (const domain of REQUIRED_OPERATING_DOMAINS) {
      const rowPattern = new RegExp(`\\|\\s*${escapeRegExp(domain)}\\s*\\|`, "i")
      const passed = rowPattern.test(sopText)
      checks.push({
        id: `autonomy:domain:${domain.toLowerCase().replace(/\s+/g, "-")}`,
        severity: "critical",
        passed,
        message: passed
          ? `${MULTI_DOMAIN_SOP_PATH} includes required domain row "${domain}"`
          : `${MULTI_DOMAIN_SOP_PATH} missing required domain row "${domain}"`,
      })
    }

    for (const requirement of REQUIRED_DOMAIN_ARTIFACT_NEEDLES) {
      const passed = sopText.includes(requirement.needle)
      checks.push({
        id: `autonomy:artifact:${requirement.domain.toLowerCase().replace(/\s+/g, "-")}`,
        severity: "critical",
        passed,
        message: passed
          ? `${MULTI_DOMAIN_SOP_PATH} contains required artifact marker for ${requirement.domain}`
          : `${MULTI_DOMAIN_SOP_PATH} missing required artifact marker "${requirement.needle}" for ${requirement.domain}`,
      })
    }
  }

  if (fileExists(".ai/SESSION_LOG.md")) {
    const entries = countSessionEntries(readText(".ai/SESSION_LOG.md"))
    checks.push({
      id: "session-log-entry-count",
      severity: "critical",
      passed: entries > 0 && entries <= 5,
      message:
        entries <= 5
          ? `.ai/SESSION_LOG.md entry count OK (${entries})`
          : `.ai/SESSION_LOG.md has ${entries} entries; keep <= 5 for reliable context loading`,
    })
  }

  if (fileExists(".ai/BACKLOG.md")) {
    const text = readText(".ai/BACKLOG.md")
    const itemCount = countBacklogP0Items(text)
    const hasDoneMeans = /Done means:/i.test(text)

    checks.push({
      id: "backlog-p0-item-count",
      severity: "warning",
      passed: itemCount <= 10,
      message:
        itemCount <= 10
          ? `.ai/BACKLOG.md P0 list size OK (${itemCount} <= 10)`
          : `.ai/BACKLOG.md P0 list has ${itemCount} items; keep <= 10 for focus`,
    })

    checks.push({
      id: "backlog-done-means",
      severity: "critical",
      passed: hasDoneMeans,
      message: hasDoneMeans
        ? `.ai/BACKLOG.md contains measurable \"Done means\" criteria`
        : `.ai/BACKLOG.md missing \"Done means\" criteria`,
    })
  }

  const criticalFailures = checks.filter((c) => c.severity === "critical" && !c.passed).length
  const warnings = checks.filter((c) => c.severity === "warning" && !c.passed).length
  const infos = checks.filter((c) => c.severity === "info" && !c.passed).length
  const passed = checks.filter((c) => c.passed).length
  const total = checks.length
  const integrityScore = total === 0 ? 100 : Number(((passed / total) * 100).toFixed(1))

  return {
    checks,
    criticalFailures,
    warnings,
    infos,
    passed,
    total,
    integrityScore,
  }
}

const printCheckSummary = (summary: CheckSummary) => {
  console.log("\n═══════════════════════════════════════")
  console.log("   AI Memory Integrity Check")
  console.log("═══════════════════════════════════════\n")

  for (const check of summary.checks) {
    const icon = check.passed ? "✅" : check.severity === "critical" ? "❌" : "⚠️"
    const severity = check.severity.toUpperCase().padEnd(8)
    console.log(`${icon} [${severity}] ${check.message}`)
  }

  console.log("\n────────── Summary ──────────")
  console.log(`Integrity score : ${summary.integrityScore}%`)
  console.log(`Passed checks   : ${summary.passed}/${summary.total}`)
  console.log(`Critical fails  : ${summary.criticalFailures}`)
  console.log(`Warnings        : ${summary.warnings}`)
}

const printRemediationGuidance = (summary: CheckSummary) => {
  const criticalFailures = summary.checks.filter(
    (check) => check.severity === "critical" && !check.passed
  )
  if (criticalFailures.length === 0) return

  console.log("\n🔧 Remediation guidance")

  for (const check of criticalFailures) {
    if (check.id.startsWith("exists:")) {
      const filePath = check.id.slice("exists:".length)
      console.log(
        `- Restore missing file \`${filePath}\` from git (for example: \`git checkout -- ${filePath}\`) or from the latest context-pack artifact.`
      )
      continue
    }

    if (check.id.startsWith("heading:")) {
      const parts = check.id.split(":")
      const filePath = parts[1] || "target file"
      console.log(
        `- Restore required heading content in \`${filePath}\` from canonical docs/templates, then rerun \`npm run ai:checkpoint\`.`
      )
      continue
    }

    if (check.id === "session-log-entry-count") {
      console.log("- Trim `.ai/SESSION_LOG.md` to 5 entries, then rerun `npm run ai:checkpoint`.")
      continue
    }

    if (check.id === "backlog-done-means") {
      console.log(
        "- Add measurable `Done means` criteria in `.ai/BACKLOG.md`, then rerun checkpoint."
      )
      continue
    }
  }

  console.log("- Re-run: `npm run ai:checkpoint`")
}

const runDrill = (scenario: DrillScenario, target: string) => {
  const targetPath = absolutePath(target)
  if (!fileExists(target)) {
    console.error(`\n❌ Drill target does not exist: ${target}`)
    process.exit(1)
  }

  const backupPath = `${targetPath}.drill-bak-${Date.now()}-${process.pid}`
  let expectedFailureId = ""
  let actionDescription = ""
  let headingNeedle = ""

  if (scenario === "missing-file") {
    if (!REQUIRED_FILES.includes(target)) {
      console.error(
        `\n❌ Target must be one of REQUIRED_FILES for missing-file drill.\n   Received: ${target}`
      )
      process.exit(1)
    }

    expectedFailureId = `exists:${target}`
    actionDescription = `Temporarily removing required file: ${target}`
    fs.renameSync(targetPath, backupPath)
  } else {
    const headingRequirement = REQUIRED_HEADINGS.find((item) => item.filePath === target)
    if (!headingRequirement) {
      console.error(
        `\n❌ Target must have a REQUIRED_HEADINGS entry for corrupt-heading drill.\n   Received: ${target}`
      )
      process.exit(1)
    }

    headingNeedle = headingRequirement.needle
    expectedFailureId = `heading:${target}:${headingNeedle}`
    actionDescription = `Temporarily corrupting required heading in: ${target}`

    const original = readText(target)
    const exactHeadingLine = new RegExp(`^${escapeRegExp(headingNeedle)}\\s*$`, "m")
    const corrupted = exactHeadingLine.test(original)
      ? original.replace(exactHeadingLine, "# DRILL_CORRUPTED_REQUIRED_HEADING")
      : original.replace(headingNeedle, "DRILL_CORRUPTED_REQUIRED_HEADING")
    fs.copyFileSync(targetPath, backupPath)
    fs.writeFileSync(targetPath, corrupted)
  }

  try {
    let drillError: Error | null = null

    console.log(`\n🧪 Memory drill (${scenario})`)
    console.log(`- ${actionDescription}`)

    const summary = buildChecks()
    printCheckSummary(summary)
    printRemediationGuidance(summary)

    const expectedFailure = summary.checks.find((check) => check.id === expectedFailureId)
    const passed =
      !!expectedFailure &&
      !expectedFailure.passed &&
      expectedFailure.severity === "critical" &&
      summary.criticalFailures > 0

    if (!passed) {
      drillError = new Error(
        `Drill failed: expected critical failure "${expectedFailureId}" was not detected.`
      )
    } else {
      console.log(
        `\n✅ Drill succeeded: expected critical failure "${expectedFailureId}" was detected.`
      )
      console.log("✅ Files will now be restored automatically.")
    }
    return drillError
  } finally {
    if (fs.existsSync(backupPath)) {
      if (scenario === "missing-file") {
        if (fs.existsSync(targetPath)) {
          fs.rmSync(targetPath)
        }
        fs.renameSync(backupPath, targetPath)
      } else {
        fs.copyFileSync(backupPath, targetPath)
        fs.rmSync(backupPath)
      }
    }
  }
}

const generateContextPack = (summary: CheckSummary) => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  const outDir = path.join(ROOT, "reports", "context-packs", timestamp)
  fs.mkdirSync(outDir, { recursive: true })

  const git = getGitInfo()

  const stateText = fileExists(".ai/STATE.md") ? readText(".ai/STATE.md") : ""
  const backlogText = fileExists(".ai/BACKLOG.md") ? readText(".ai/BACKLOG.md") : ""
  const sessionLogText = fileExists(".ai/SESSION_LOG.md") ? readText(".ai/SESSION_LOG.md") : ""
  const incidentText = fileExists(".ai/topics/MONETIZATION_INCIDENT_REGISTER.md")
    ? readText(".ai/topics/MONETIZATION_INCIDENT_REGISTER.md")
    : ""

  const stateLastUpdated = extractStateLastUpdated(stateText)
  const topP0 = extractTopBacklogItem(backlogText)
  const recentSessions = extractRecentSessions(sessionLogText, 3)
  const incidents = extractIncidentIds(incidentText)

  const canonicalHashes = REQUIRED_FILES.filter((relativePath) => fileExists(relativePath)).map(
    (relativePath) => {
      const content = readText(relativePath)
      return {
        filePath: relativePath,
        hash: sha256(content),
      }
    }
  )

  const autonomyChecks = summary.checks.filter((check) => check.id.startsWith("autonomy:"))
  const autonomyPassed = autonomyChecks.filter((check) => check.passed).length

  const markdown = [
    `# Context Pack - ${timestamp}`,
    "",
    "## Snapshot",
    `- Generated at: ${new Date().toISOString()}`,
    `- Branch: ${git.branch}`,
    `- HEAD: ${git.head}`,
    `- origin/main: ${git.originMain}`,
    `- Memory integrity score: ${summary.integrityScore}%`,
    `- Critical failures: ${summary.criticalFailures}`,
    `- Warnings: ${summary.warnings}`,
    `- Multi-domain conformance: ${autonomyPassed}/${autonomyChecks.length} checks passing`,
    "",
    "## Current Operating Focus",
    `- State last updated: ${stateLastUpdated}`,
    `- Top P0 backlog item: ${topP0}`,
    "",
    "## Recent Session Heads",
    ...(recentSessions.length > 0 ? recentSessions.map((s) => `- ${s}`) : ["- None recorded"]),
    "",
    "## Open Incident IDs (if any)",
    ...(incidents.length > 0 ? incidents.map((id) => `- ${id}`) : ["- None detected"]),
    "",
    "## Canonical File Hashes (SHA256)",
    "| File | SHA256 |",
    "|------|--------|",
    ...canonicalHashes.map((item) => `| ${item.filePath} | ${item.hash} |`),
    "",
    "## Resume Prompt (for future AI agents)",
    "Use this exact startup sequence before edits:",
    "1) Read VISION_CHARTER.md",
    "2) Read .ai/START_HERE.md and complete Alignment Gate",
    "3) Read .ai/STATE.md, .ai/BACKLOG.md, .ai/CONTRACT.md, .ai/DECISION_RIGHTS.md",
    "4) Validate memory integrity with npm run ai:memory:check",
    "5) Continue from top P0 item unless Cade overrides goal",
    "",
  ].join("\n")

  const resumePrompt = [
    `Context Pack: reports/context-packs/${timestamp}/context-pack.md`,
    `Branch: ${git.branch}`,
    `HEAD: ${git.head}`,
    `Top P0 Item: ${topP0}`,
    "Action: run npm run ai:memory:check, then proceed with the active P0 objective.",
  ].join("\n")

  fs.writeFileSync(path.join(outDir, "context-pack.md"), markdown)
  fs.writeFileSync(path.join(outDir, "resume-prompt.txt"), resumePrompt)

  return {
    outDir,
    contextPackPath: path.join("reports", "context-packs", timestamp, "context-pack.md"),
    resumePromptPath: path.join("reports", "context-packs", timestamp, "resume-prompt.txt"),
  }
}

const main = () => {
  const { command, strict, scenario, target, days } = parseArgs(process.argv.slice(2))

  if (command === "check") {
    const summary = buildChecks()
    printCheckSummary(summary)

    if (strict && summary.criticalFailures > 0) {
      process.exit(1)
    }

    process.exit(0)
  }

  if (command === "pack") {
    const summary = buildChecks()
    printCheckSummary(summary)
    const pack = generateContextPack(summary)

    console.log("\n✅ Context pack generated")
    console.log(`- ${pack.contextPackPath}`)
    console.log(`- ${pack.resumePromptPath}`)

    process.exit(0)
  }

  if (command === "checkpoint") {
    const summary = buildChecks()
    printCheckSummary(summary)

    const runTimestamp = new Date().toISOString()
    if (summary.criticalFailures > 0) {
      printRemediationGuidance(summary)
      recordCheckpointRun(summary, "fail", { timestamp: runTimestamp })
      console.error("\n❌ Checkpoint aborted: critical memory failures detected.")
      process.exit(1)
    }

    const pack = generateContextPack(summary)
    recordCheckpointRun(summary, "pass", {
      timestamp: runTimestamp,
      contextPackPath: pack.contextPackPath,
    })
    console.log("\n✅ Checkpoint complete")
    console.log(`- ${pack.contextPackPath}`)
    console.log(`- ${pack.resumePromptPath}`)
    process.exit(0)
  }

  if (command === "drill") {
    const drillError = runDrill(scenario, target)
    if (drillError) {
      console.error(`\n❌ ${drillError.message}`)
      process.exit(1)
    }
    process.exit(0)
  }

  if (command === "trend") {
    try {
      const report = generateMemoryTrendReport(days)
      console.log("\n✅ Memory integrity trend report generated")
      console.log(`- ${report.summaryPath}`)
      console.log(`- ${report.metricsPath}`)
      console.log(
        `- Checkpoint pass rate: ${report.artifact.checkpointPassRate}% (${report.artifact.passCount}/${report.artifact.runCount})`
      )
      console.log(`- Avg integrity score: ${report.artifact.avgIntegrityScore}%`)

      if (report.sloBreached) {
        console.log(
          `\n⚠️ Trend SLO breached (targets: pass-rate >= ${CHECKPOINT_PASS_RATE_TARGET}%, integrity >= ${INTEGRITY_SCORE_TARGET}%).`
        )
        if (strict) {
          console.error("❌ Failing closed because trend SLO targets were not met.")
          process.exit(1)
        }
      }
      process.exit(0)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(`\n❌ Trend report failed: ${message}`)
      process.exit(1)
    }
  }
}

main()
