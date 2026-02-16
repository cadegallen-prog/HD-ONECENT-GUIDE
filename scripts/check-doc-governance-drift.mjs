#!/usr/bin/env node

import fs from "node:fs"
import path from "node:path"

const root = process.cwd()

const readText = (relativePath) => {
  const absolutePath = path.join(root, relativePath)
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`)
  }
  return fs.readFileSync(absolutePath, "utf8")
}

const errors = []
const notes = []

const addError = (category, message) => {
  errors.push(`[${category}] ${message}`)
}

const requireIncludes = (relativePath, patterns, category) => {
  const text = readText(relativePath)
  for (const pattern of patterns) {
    if (!text.includes(pattern)) {
      addError(category, `${relativePath} is missing required text: ${pattern}`)
    }
  }
}

const hasAllLegacyFourCommands = (text) =>
  ["npm run lint", "npm run build", "npm run test:unit", "npm run test:e2e"].every((cmd) =>
    text.includes(cmd)
  )

const checkVerificationModelDrift = () => {
  const category = "verification-model"

  requireIncludes(
    ".ai/VERIFICATION_REQUIRED.md",
    ["npm run verify:fast", "npm run e2e:smoke", "npm run e2e:full"],
    category
  )

  const filesToCheck = [
    "README.md",
    "AGENTS.md",
    ".ai/START_HERE.md",
    ".ai/CONTRACT.md",
    ".ai/HANDOFF_PROTOCOL.md",
    "docs/skills/ship-safely.md",
    "docs/skills/task-completion-handoff.md",
  ]

  for (const relativePath of filesToCheck) {
    const text = readText(relativePath)
    const lower = text.toLowerCase()
    if (lower.includes("all four quality gates")) {
      addError(category, `${relativePath} still references "all four quality gates".`)
    }
    if (hasAllLegacyFourCommands(text) && !text.includes("npm run verify:fast")) {
      addError(
        category,
        `${relativePath} defines legacy lint/build/unit/e2e checks without FAST lane reference.`
      )
    }
  }
}

const checkReadOrderDrift = () => {
  const category = "read-order"

  const entryFiles = [
    "README.md",
    ".ai/START_HERE.md",
    "AGENTS.md",
    "CLAUDE.md",
    ".ai/CODEX_ENTRY.md",
    "copilot-instructions.md",
  ]

  for (const relativePath of entryFiles) {
    const text = readText(relativePath)
    if (!text.includes("VISION_CHARTER.md")) {
      addError(category, `${relativePath} does not mention VISION_CHARTER.md in startup guidance.`)
    }

    if (text.includes("START_HERE.md → CRITICAL_RULES.md") && !text.includes("VISION_CHARTER.md")) {
      addError(
        category,
        `${relativePath} includes an outdated read-order sequence that starts at START_HERE.md.`
      )
    }
  }

  requireIncludes("README.md", ["Governance Quick Entry"], category)
  requireIncludes(".ai/START_HERE.md", ["## Alignment Gate (Fail-Closed, Required Before Mutation)"], category)
}

const checkFounderPromptClarity = () => {
  const category = "founder-prompt-clarity"

  requireIncludes(
    "AGENTS.md",
    [
      "Do not ask Cade to provide process tokens",
      "top P0 item and there is no founder override, execute that top P0 item by default.",
    ],
    category
  )

  requireIncludes(
    ".ai/START_HERE.md",
    [
      "Do not ask Cade to provide process tokens",
      "top P0 item and there is no founder override, execute that top P0 item by default.",
    ],
    category
  )

  requireIncludes(
    ".ai/HANDOFF_PROTOCOL.md",
    [
      "Do not end handoffs with open-ended choice questions",
      "Single next task\" must be an executable directive",
    ],
    category
  )

  const bannedPatterns = [
    {
      path: "AGENTS.md",
      text: "If Cade provides `GOAL / WHY / DONE MEANS` and says \"go\" / \"build it\", implement immediately.",
    },
    {
      path: "AGENTS.md",
      text: "Clear `GOAL / WHY / DONE MEANS` + \"go\" → implement + verify",
    },
    {
      path: ".ai/START_HERE.md",
      text: "If Cade provides `GOAL / WHY / DONE MEANS` and says \"go\" / \"build it\", implement immediately.",
    },
    {
      path: ".ai/START_HERE.md",
      text: "Clear `GOAL / WHY / DONE MEANS` + \"go\" → implement + verify",
    },
  ]

  for (const pattern of bannedPatterns) {
    const text = readText(pattern.path)
    if (text.includes(pattern.text)) {
      addError(
        category,
        `${pattern.path} contains deprecated founder-facing prompt pattern: "${pattern.text}"`
      )
    }
  }
}

const checkStaleArchitectureClaims = () => {
  const category = "architecture-truth"
  const stalePhrases = [
    "No database (Google Sheets as backend is intentional)",
    "Google Sheets as backend is intentional",
    "### 6. Penny List CSV Fetching",
  ]

  const filesToCheck = [
    ".ai/CONSTRAINTS.md",
    ".ai/CONTRACT.md",
    "README.md",
  ]

  for (const relativePath of filesToCheck) {
    const text = readText(relativePath)
    for (const phrase of stalePhrases) {
      if (text.includes(phrase)) {
        addError(category, `${relativePath} contains stale architecture phrase: "${phrase}"`)
      }
    }
  }

  const constraintsText = readText(".ai/CONSTRAINTS.md")
  if (!constraintsText.includes("Supabase-first")) {
    addError(category, ".ai/CONSTRAINTS.md should explicitly state Supabase-first runtime truth.")
  }
}

const checkDuplicatePolicyDefinitions = () => {
  const category = "duplicate-policy"

  // Secondary docs should reference canonical owners instead of redefining policy.
  const secondaryDocs = [
    ".ai/README.md",
    "docs/skills/ship-safely.md",
    "docs/skills/task-completion-handoff.md",
  ]

  for (const relativePath of secondaryDocs) {
    const text = readText(relativePath)
    if (!text.includes(".ai/VERIFICATION_REQUIRED.md")) {
      addError(
        category,
        `${relativePath} should reference .ai/VERIFICATION_REQUIRED.md as canonical verification policy.`
      )
    }
    if (hasAllLegacyFourCommands(text)) {
      addError(
        category,
        `${relativePath} still duplicates legacy four-command verification policy.`
      )
    }
  }

  // Redirect files must remain redirects to avoid policy forks.
  requireIncludes(
    ".ai/FOUNDATION_CONTRACT.md",
    ["consolidated", "CONSTRAINTS.md", "CRITICAL_RULES.md"],
    category
  )
  requireIncludes(
    ".ai/GUARDRAILS.md",
    ["consolidated", "CONSTRAINTS_TECHNICAL.md"],
    category
  )
}

const parseMemberCountContract = () => {
  const constantsText = readText("lib/constants.ts")

  const countMatch = constantsText.match(/export const COMMUNITY_MEMBER_COUNT\s*=\s*(\d+)/)
  if (!countMatch) {
    addError(
      "product-truth",
      'lib/constants.ts must export COMMUNITY_MEMBER_COUNT as a numeric literal.'
    )
    return null
  }

  const verifiedMatch = constantsText.match(
    /export const COMMUNITY_MEMBER_COUNT_LAST_VERIFIED\s*=\s*"(\d{4}-\d{2}-\d{2})"/
  )
  if (!verifiedMatch) {
    addError(
      "product-truth",
      'lib/constants.ts must export COMMUNITY_MEMBER_COUNT_LAST_VERIFIED in "YYYY-MM-DD" format.'
    )
    return null
  }

  const count = Number(countMatch[1])
  const verifiedIso = verifiedMatch[1]
  const [yearRaw, monthRaw, dayRaw] = verifiedIso.split("-")
  const year = Number(yearRaw)
  const month = Number(monthRaw)
  const day = Number(dayRaw)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day) || day < 1 || day > 31) {
    addError(
      "product-truth",
      `COMMUNITY_MEMBER_COUNT_LAST_VERIFIED has an invalid date: ${verifiedIso}.`
    )
    return null
  }

  return {
    count,
    display: `${count.toLocaleString("en-US")}+`,
    verifiedIso,
    verifiedHuman: `${monthNames[month - 1]} ${day}, ${year}`,
  }
}

const checkProductTruthDrift = () => {
  const category = "product-truth"
  const activeFiles = [
    "README.md",
    "SKILLS.md",
    "SCRIPTS-AND-GATES.txt",
    "scripts/run-audit.ps1",
    ".ai/DECISION_RIGHTS.md",
    ".ai/CONTEXT.md",
    ".ai/GROWTH_STRATEGY.md",
  ]

  const staleMemberPatterns = [
    /\b50K\+/i,
    /\b50,000\+/i,
    /\b62K\+/i,
    /\b62,000\+/i,
  ]
  const staleAffiliatePatterns = [
    /app\/cashback\//i,
    /SupportAndCashbackCard\.tsx/i,
    /\*\*Cashback \(Affiliate\)\*\*/i,
    /BeFrugal affiliate link for site monetization/i,
  ]

  for (const relativePath of activeFiles) {
    const text = readText(relativePath)
    if (/trip[\s_-]?tracker/i.test(text)) {
      addError(category, `${relativePath} still references deprecated Trip Tracker copy.`)
    }

    for (const pattern of staleMemberPatterns) {
      if (pattern.test(text)) {
        addError(category, `${relativePath} still contains stale member-count token: ${pattern}`)
      }
    }

    for (const pattern of staleAffiliatePatterns) {
      if (pattern.test(text)) {
        addError(category, `${relativePath} still contains stale affiliate/cashback token: ${pattern}`)
      }
    }
  }

  const contract = parseMemberCountContract()
  if (!contract) {
    return
  }

  const readmeText = readText("README.md")
  if (!readmeText.includes(contract.display)) {
    addError(
      category,
      `README.md must include current member-count display (${contract.display}) from lib/constants.ts.`
    )
  }

  const asOfPhrase = `as of ${contract.verifiedHuman}`
  if (!readmeText.includes(asOfPhrase)) {
    addError(
      category,
      `README.md must include a freshness phrase matching COMMUNITY_MEMBER_COUNT_LAST_VERIFIED: "${asOfPhrase}".`
    )
  }
}

const run = () => {
  checkVerificationModelDrift()
  checkReadOrderDrift()
  checkFounderPromptClarity()
  checkStaleArchitectureClaims()
  checkDuplicatePolicyDefinitions()
  checkProductTruthDrift()

  if (errors.length) {
    console.error("Governance drift check failed:")
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  notes.push("No conflicting verification model detected.")
  notes.push("No read-order drift detected in entrypoint docs.")
  notes.push("No founder-prompt clarity drift detected in canonical docs.")
  notes.push("No stale architecture claims detected in canonical operational docs.")
  notes.push("No duplicate secondary-policy definitions detected.")
  notes.push(
    "No deprecated Trip Tracker, stale member-count, or stale affiliate/cashback drift detected in active docs/tooling."
  )

  console.log("Governance drift check passed.")
  for (const note of notes) {
    console.log(`- ${note}`)
  }
}

run()
