#!/usr/bin/env tsx

/**
 * Guide Guardrails Check
 *
 * Machine-verifiable recurring checks for guide quality.
 * Run via: npm run ai:guide:guardrails
 *
 * Checks:
 * 1. No <details> elements in FAQ (Phase 2 target)
 * 2. No inline Tailwind classes on guide chapter H2 elements
 * 3. Word-count report for guide routes (visible body text estimate)
 * 4. Monetization contract present
 * 5. Voice rule violations (banned hedging phrases)
 */

import fs from "fs"
import path from "path"

const GUIDE_CHAPTERS = [
  "app/what-are-pennies/page.tsx",
  "app/clearance-lifecycle/page.tsx",
  "app/digital-pre-hunt/page.tsx",
  "app/in-store-strategy/page.tsx",
  "app/inside-scoop/page.tsx",
  "app/facts-vs-myths/page.tsx",
  "app/faq/page.tsx",
]

const MONETIZATION_CONTRACT_PATH = ".ai/topics/GUIDE_MONETIZATION_CONTRACT.md"
const LOCKED_COPY_PATH = ".ai/topics/GUIDE_LOCKED_COPY.md"

interface CheckResult {
  name: string
  pass: boolean
  details: string[]
}

function checkNoDetailsInFaq(): CheckResult {
  const faqPath = "app/faq/page.tsx"
  const content = fs.readFileSync(faqPath, "utf8")
  const detailsCount = (content.match(/<details/g) || []).length
  const summaryCount = (content.match(/<summary/g) || []).length

  return {
    name: "FAQ: No <details> elements",
    pass: detailsCount === 0,
    details:
      detailsCount === 0
        ? ["0 <details> elements found"]
        : [`${detailsCount} <details> and ${summaryCount} <summary> elements found — remove them`],
  }
}

function checkNoInlineH2Styles(): CheckResult {
  const details: string[] = []
  let allClean = true

  for (const filePath of GUIDE_CHAPTERS) {
    const content = fs.readFileSync(filePath, "utf8")
    const lines = content.split("\n")

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      if (line.includes("<h2") && line.includes("className=")) {
        allClean = false
        details.push(`${filePath}:${i + 1} — H2 has inline className`)
      }
    }
  }

  if (allClean) {
    details.push("All guide chapter H2 elements are clean (no inline Tailwind)")
  }

  return {
    name: "H2 normalization: No inline Tailwind on guide H2s",
    pass: allClean,
    details,
  }
}

function estimateVisibleWords(filePath: string): number {
  const content = fs.readFileSync(filePath, "utf8")

  // Extract string literals from JSX — rough heuristic
  // Match text in JSX: between > and <, or string values in arrays/objects
  let textContent = ""

  // Get text between JSX tags
  const jsxTextMatches = content.match(/>([^<>{]+)</g) || []
  for (const match of jsxTextMatches) {
    textContent += " " + match.slice(1) // remove leading >
  }

  // Get string values from data arrays (quoted strings)
  const quotedMatches = content.match(/"([^"]{10,})"/g) || []
  for (const match of quotedMatches) {
    // Skip imports, class names, URLs, and code
    const inner = match.slice(1, -1)
    if (
      inner.startsWith("@/") ||
      inner.startsWith("http") ||
      inner.includes("className") ||
      inner.includes("text-") ||
      inner.includes("font-") ||
      inner.includes("border-") ||
      inner.includes("bg-[") ||
      inner.includes("var(--") ||
      inner.includes("mb-") ||
      inner.includes("mt-") ||
      inner.includes("px-") ||
      inner.includes("py-") ||
      inner.includes("gap-") ||
      inner.includes("grid") ||
      inner.includes("flex") ||
      inner.includes("space-y-") ||
      inner.startsWith("/") ||
      inner.includes("Metadata") ||
      inner.includes("page.tsx")
    ) {
      continue
    }
    textContent += " " + inner
  }

  // Count words (split on whitespace, filter empties)
  const words = textContent
    .split(/\s+/)
    .filter((w) => w.length > 0 && !w.match(/^[<>={}()\[\]'"`,;.]+$/))
  return words.length
}

function checkWordCounts(): CheckResult {
  const details: string[] = []
  let allAboveTarget = true
  const TARGET = 800

  for (const filePath of GUIDE_CHAPTERS) {
    const wordCount = estimateVisibleWords(filePath)
    const status = wordCount >= TARGET ? "OK" : "BELOW TARGET"
    if (wordCount < TARGET) allAboveTarget = false
    const shortName = filePath.replace("app/", "").replace("/page.tsx", "")
    details.push(`${shortName}: ~${wordCount} words [${status}]`)
  }

  return {
    name: `Word count: Guide chapters (target: ${TARGET}+)`,
    pass: allAboveTarget,
    details,
  }
}

function checkMonetizationContract(): CheckResult {
  const exists = fs.existsSync(MONETIZATION_CONTRACT_PATH)
  return {
    name: "Monetization contract present",
    pass: exists,
    details: exists
      ? [`Found: ${MONETIZATION_CONTRACT_PATH}`]
      : [`MISSING: ${MONETIZATION_CONTRACT_PATH}`],
  }
}

function checkLockedCopy(): CheckResult {
  const exists = fs.existsSync(LOCKED_COPY_PATH)
  return {
    name: "Locked copy document present",
    pass: exists,
    details: exists ? [`Found: ${LOCKED_COPY_PATH}`] : [`MISSING: ${LOCKED_COPY_PATH}`],
  }
}

function checkVoiceRules(): CheckResult {
  const bannedPatterns = [
    { pattern: /many hunters/gi, label: "many hunters" },
    { pattern: /hunters report/gi, label: "hunters report" },
    { pattern: /some reports/gi, label: "some reports" },
  ]

  const communityReportedPattern = /community-reported/gi

  const details: string[] = []
  let allClean = true

  for (const filePath of GUIDE_CHAPTERS) {
    const content = fs.readFileSync(filePath, "utf8")
    const shortName = filePath.replace("app/", "").replace("/page.tsx", "")

    // Check banned phrases (should be 0)
    for (const { pattern, label } of bannedPatterns) {
      const matches = content.match(pattern) || []
      if (matches.length > 0) {
        allClean = false
        details.push(`${shortName}: "${label}" found ${matches.length}x (should be 0)`)
      }
    }

    // Check community-reported (max 1 per chapter)
    const crMatches = content.match(communityReportedPattern) || []
    if (crMatches.length > 1) {
      allClean = false
      details.push(
        `${shortName}: "community-reported" found ${crMatches.length}x (max 1 per chapter)`
      )
    }
  }

  if (allClean) {
    details.push("All voice rules pass across all guide chapters")
  }

  return {
    name: "Voice rules: Banned phrases check",
    pass: allClean,
    details,
  }
}

function main() {
  console.log("═══════════════════════════════════════")
  console.log("   Guide Guardrails Check")
  console.log("═══════════════════════════════════════\n")

  const checks: CheckResult[] = [
    checkNoDetailsInFaq(),
    checkNoInlineH2Styles(),
    checkWordCounts(),
    checkMonetizationContract(),
    checkLockedCopy(),
    checkVoiceRules(),
  ]

  // Output results
  for (const check of checks) {
    const icon = check.pass ? "✅" : "❌"
    console.log(`${icon} ${check.name}`)
    for (const detail of check.details) {
      console.log(`   ${detail}`)
    }
    console.log()
  }

  // Write report to reports/ directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  const reportsDir = path.join("reports", "guide-guardrails")
  fs.mkdirSync(reportsDir, { recursive: true })

  let markdown = `# Guide Guardrails Report — ${timestamp}\n\n`
  for (const check of checks) {
    const icon = check.pass ? "PASS" : "FAIL"
    markdown += `## ${icon}: ${check.name}\n\n`
    for (const detail of check.details) {
      markdown += `- ${detail}\n`
    }
    markdown += "\n"
  }

  const reportPath = path.join(reportsDir, `${timestamp}.md`)
  fs.writeFileSync(reportPath, markdown)
  console.log(`Report saved to: ${reportPath}`)

  const allPassed = checks.every((c) => c.pass)
  console.log(
    allPassed
      ? "\n✅ All guide guardrails pass"
      : "\n❌ Some guide guardrails failed — review above"
  )
  process.exit(allPassed ? 0 : 1)
}

main()
