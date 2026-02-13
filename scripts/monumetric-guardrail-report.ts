#!/usr/bin/env tsx

import fs from "node:fs"
import path from "node:path"

import {
  evaluateMonumetricGuardrails,
  type MonumetricBaselineMetrics,
  type MonumetricDayMetrics,
} from "../lib/ads/guardrail-report"

interface GuardrailInputFile {
  label?: string
  window?: string
  endOfWindowB?: boolean
  baselineOverrides?: Partial<MonumetricBaselineMetrics>
  days: MonumetricDayMetrics[]
  guideBuckets?: {
    canonicalGuideViews?: number
    legacyGuideViews?: number
    canonicalGuideRevenue?: number
    legacyGuideRevenue?: number
  }
  notes?: string[]
}

interface CliOptions {
  inputPath?: string
  baselinePath?: string
  outDir: string
  windowLabel?: string
  endOfWindowB: boolean
  templatePath?: string
  showHelp: boolean
}

function getTimestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    outDir: path.join("reports", "monumetric-guardrails"),
    endOfWindowB: false,
    showHelp: false,
  }
  const positional: string[] = []

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]

    if (arg === "--input" && next) {
      options.inputPath = next
      i += 1
      continue
    }

    if (arg === "--baseline" && next) {
      options.baselinePath = next
      i += 1
      continue
    }

    if (arg === "--out-dir" && next) {
      options.outDir = next
      i += 1
      continue
    }

    if (arg === "--window" && next) {
      options.windowLabel = next
      i += 1
      continue
    }

    if (arg === "--template" && next) {
      options.templatePath = next
      i += 1
      continue
    }

    if (arg === "--end-of-window-b") {
      options.endOfWindowB = true
      continue
    }

    if (arg === "--help" || arg === "-h") {
      options.showHelp = true
      continue
    }

    if (!arg.startsWith("-")) {
      positional.push(arg)
    }
  }

  // Positional fallback keeps npm-run usage robust in shells that swallow prefixed flags.
  if (!options.templatePath && positional[0] === "template" && positional[1]) {
    options.templatePath = positional[1]
  }
  if (!options.inputPath && positional[0] && positional[0] !== "template") {
    options.inputPath = positional[0]
  }

  return options
}

function printHelp(): void {
  console.log("Monumetric Guardrail Report")
  console.log("")
  console.log("Usage:")
  console.log(
    "  npm run monumetric:guardrails -- --input <metrics.json> [--baseline <baseline.json>] [--window <label>] [--end-of-window-b] [--out-dir <dir>]"
  )
  console.log("  npm run monumetric:guardrails -- <metrics.json>")
  console.log("")
  console.log("Template:")
  console.log("  npm run monumetric:guardrails -- --template <path>")
  console.log("  npm run monumetric:guardrails -- template <path>")
}

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf8")
  return JSON.parse(raw) as T
}

function toGuardrailInput(value: unknown): GuardrailInputFile {
  if (Array.isArray(value)) {
    return { days: value as MonumetricDayMetrics[] }
  }
  if (typeof value !== "object" || value === null) {
    throw new Error("Input JSON must be an object with a days[] property or a days[] array.")
  }
  const parsed = value as Partial<GuardrailInputFile>
  if (!Array.isArray(parsed.days)) {
    throw new Error("Input JSON must include days[] as an array.")
  }
  return parsed as GuardrailInputFile
}

function writeTemplate(templatePath: string): void {
  const template: GuardrailInputFile = {
    label: "window-b-test",
    window: "window-b-test",
    endOfWindowB: false,
    baselineOverrides: {
      mobileRevenuePerSession: 0.15,
    },
    days: [
      {
        date: "2026-02-12",
        reportFindViews: 100,
        pennyListViews: 1000,
        findSubmit: 12,
        reportFindClick: 7,
        pennyListAvgEngagementSeconds: 103,
        pennyListBounceRate: 0.29,
        pennyListMobileSessions: 850,
        pennyListMobileRevenue: 140,
      },
      {
        date: "2026-02-13",
        reportFindViews: 110,
        pennyListViews: 1030,
        findSubmit: 13,
        reportFindClick: 8,
        pennyListAvgEngagementSeconds: 101,
        pennyListBounceRate: 0.3,
        pennyListMobileSessions: 860,
        pennyListMobileRevenue: 141,
      },
    ],
    guideBuckets: {
      canonicalGuideViews: 1300,
      legacyGuideViews: 260,
    },
    notes: [
      "Keep canonical and legacy guide buckets separate for VOLT pilot decisions.",
      "Set endOfWindowB=true only for the 7-day post-launch window-B closeout run.",
    ],
  }

  fs.mkdirSync(path.dirname(templatePath), { recursive: true })
  fs.writeFileSync(templatePath, `${JSON.stringify(template, null, 2)}\n`)
  console.log(`Template written: ${templatePath}`)
}

function printHeader(title: string): void {
  console.log("\n" + "═".repeat(43))
  console.log(`   ${title}`)
  console.log("═".repeat(43))
}

function formatPct(value: number | null): string {
  if (value === null) return "n/a"
  return `${(value * 100).toFixed(2)}%`
}

function formatCurrency(value: number | null): string {
  if (value === null) return "n/a"
  return `$${value.toFixed(4)}`
}

function main(): void {
  const options = parseArgs(process.argv.slice(2))

  if (options.showHelp) {
    printHelp()
    return
  }

  if (options.templatePath) {
    writeTemplate(options.templatePath)
    return
  }

  if (!options.inputPath) {
    printHelp()
    throw new Error("--input is required unless --template is used.")
  }

  const input = toGuardrailInput(readJsonFile<unknown>(options.inputPath))
  const baselineFromFile = options.baselinePath
    ? readJsonFile<Partial<MonumetricBaselineMetrics>>(options.baselinePath)
    : {}
  const baselineOverrides = {
    ...baselineFromFile,
    ...(input.baselineOverrides ?? {}),
  }

  const report = evaluateMonumetricGuardrails({
    days: input.days,
    baseline: baselineOverrides,
    windowLabel: options.windowLabel ?? input.window ?? input.label ?? "window-b-test",
    endOfWindowB: options.endOfWindowB || input.endOfWindowB === true,
  })

  const timestamp = getTimestamp()
  const outputDir = path.join(options.outDir, timestamp)
  fs.mkdirSync(outputDir, { recursive: true })

  const result = {
    timestamp,
    inputPath: options.inputPath,
    baselinePath: options.baselinePath ?? null,
    report,
    guideBuckets: input.guideBuckets ?? null,
    notes: input.notes ?? [],
  }

  const resultJsonPath = path.join(outputDir, "result.json")
  fs.writeFileSync(resultJsonPath, `${JSON.stringify(result, null, 2)}\n`)

  const actionLabel =
    report.action === "hold"
      ? "✅ HOLD"
      : report.action === "hard_rollback"
        ? "🛑 HARD ROLLBACK"
        : report.action === "soft_rollback"
          ? "⚠️ SOFT ROLLBACK (TUNE)"
          : "⚠️ NO-LIFT ROLLBACK"

  const summaryMarkdown = [
    `# Monumetric Guardrail Report - ${new Date().toISOString()}`,
    "",
    `- Window: \`${report.windowLabel}\``,
    `- End of Window B: ${report.endOfWindowB ? "yes" : "no"}`,
    `- Action: ${actionLabel}`,
    "",
    "## Baseline",
    `- find_submit / report-find views: ${formatPct(report.baseline.findSubmitRate)}`,
    `- report_find_click / penny-list views: ${formatPct(report.baseline.reportFindClickRate)}`,
    `- /penny-list avg engagement per active user: ${report.baseline.pennyListAvgEngagementSeconds.toFixed(2)}s`,
    `- /penny-list bounce rate: ${formatPct(report.baseline.pennyListBounceRate ?? null)}`,
    `- mobile revenue per session: ${formatCurrency(report.baseline.mobileRevenuePerSession ?? null)}`,
    "",
    "## Window Summary",
    `- evaluated days: ${report.summary.evaluatedDays}`,
    `- avg find_submit rate: ${formatPct(report.summary.averageFindSubmitRate)}`,
    `- avg report_find_click rate: ${formatPct(report.summary.averageReportFindClickRate)}`,
    `- avg engagement seconds: ${
      report.summary.averageEngagementSeconds === null
        ? "n/a"
        : report.summary.averageEngagementSeconds.toFixed(2)
    }`,
    `- avg bounce rate: ${formatPct(report.summary.averageBounceRate)}`,
    `- avg mobile revenue/session: ${formatCurrency(report.summary.averageMobileRevenuePerSession)}`,
    `- avg mobile session RPM: ${
      report.summary.averageMobileSessionRpm === null
        ? "n/a"
        : `$${report.summary.averageMobileSessionRpm.toFixed(2)}`
    }`,
    `- primary lift: ${formatPct(report.summary.primaryLiftPct)}`,
    "",
    "## Trigger Results",
    ...(report.hardReasons.length === 0
      ? ["- Hard rollback: none"]
      : report.hardReasons.map((reason) => `- Hard rollback: ${reason.message}`)),
    ...(report.softReasons.length === 0
      ? ["- Soft rollback: none"]
      : report.softReasons.map((reason) => `- Soft rollback: ${reason.message}`)),
    ...(report.noLiftReasons.length === 0
      ? ["- No-lift rollback: none"]
      : report.noLiftReasons.map((reason) => `- No-lift rollback: ${reason.message}`)),
    "",
    "## Warnings",
    ...(report.warnings.length === 0
      ? ["- None"]
      : report.warnings.map((warning) => `- ${warning}`)),
    "",
    "## Guide Buckets (separate reporting)",
    input.guideBuckets
      ? `- canonical views: ${input.guideBuckets.canonicalGuideViews ?? "n/a"}, legacy views: ${input.guideBuckets.legacyGuideViews ?? "n/a"}`
      : "- Not provided",
    "",
    "## Daily Metrics",
    ...report.days.map(
      (day) =>
        `- ${day.date}: find_submit_rate=${formatPct(day.findSubmitRate)}, report_find_click_rate=${formatPct(day.reportFindClickRate)}, engagement=${day.pennyListAvgEngagementSeconds.toFixed(
          2
        )}s, bounce=${formatPct(day.pennyListBounceRate ?? null)}, flow_breakage=${day.userFacingFlowBreakage === true ? "yes" : "no"}`
    ),
    "",
    `JSON: \`${resultJsonPath.replace(/\\/g, "/")}\``,
  ].join("\n")

  const summaryPath = path.join(outputDir, "summary.md")
  fs.writeFileSync(summaryPath, `${summaryMarkdown}\n`)

  printHeader("Monumetric Guardrail Report")
  console.log(`Input: ${options.inputPath}`)
  console.log(`Output: ${outputDir}`)
  console.log(`Action: ${actionLabel}`)
  console.log(`Summary: ${summaryPath}`)
  console.log(`JSON: ${resultJsonPath}`)

  if (report.action !== "hold") {
    process.exit(1)
  }
}

try {
  main()
} catch (error) {
  console.error(
    "monumetric guardrail report failed:",
    error instanceof Error ? error.message : String(error)
  )
  process.exit(1)
}
