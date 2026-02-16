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

const parseArgs = (argv: string[]) => {
  const command = (argv[0] || "check").toLowerCase()
  const strict = !argv.includes("--no-strict")

  return {
    command: ["check", "pack", "checkpoint"].includes(command)
      ? (command as "check" | "pack" | "checkpoint")
      : "check",
    strict,
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
  const { command, strict } = parseArgs(process.argv.slice(2))

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

    if (summary.criticalFailures > 0) {
      console.error("\n❌ Checkpoint aborted: critical memory failures detected.")
      process.exit(1)
    }

    const pack = generateContextPack(summary)
    console.log("\n✅ Checkpoint complete")
    console.log(`- ${pack.contextPackPath}`)
    console.log(`- ${pack.resumePromptPath}`)
    process.exit(0)
  }
}

main()
