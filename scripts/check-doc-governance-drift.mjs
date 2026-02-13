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

const run = () => {
  checkVerificationModelDrift()
  checkReadOrderDrift()
  checkStaleArchitectureClaims()
  checkDuplicatePolicyDefinitions()

  if (errors.length) {
    console.error("Governance drift check failed:")
    for (const error of errors) {
      console.error(`- ${error}`)
    }
    process.exit(1)
  }

  notes.push("No conflicting verification model detected.")
  notes.push("No read-order drift detected in entrypoint docs.")
  notes.push("No stale architecture claims detected in canonical operational docs.")
  notes.push("No duplicate secondary-policy definitions detected.")

  console.log("Governance drift check passed.")
  for (const note of notes) {
    console.log(`- ${note}`)
  }
}

run()
