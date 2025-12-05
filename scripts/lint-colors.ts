// ============================================================================
// ACCESSIBILITY COLOR LINTER
// ============================================================================
// Run with: npm run lint:colors
//
// Scans all TSX files for hardcoded colors that don't meet WCAG AAA standards
// or that violate the PennyCentral design system.
//
// Exit code 0 = pass, Exit code 1 = violations found
// ============================================================================

import * as fs from "fs"
import * as path from "path"

// Allowed CSS variable patterns (from design system)
const ALLOWED_PATTERNS = [
  /var\(--[\w-]+\)/, // CSS variables
  /bg-\[--[\w-]+\]/, // Tailwind CSS variable syntax
  /text-\[--[\w-]+\]/,
  /border-\[--[\w-]+\]/,
  /ring-\[--[\w-]+\]/,
  /outline-\[--[\w-]+\]/,

  // Tailwind semantic classes (these use CSS variables under the hood)
  /bg-background/,
  /bg-foreground/,
  /bg-card/,
  /bg-primary/,
  /bg-secondary/,
  /bg-muted/,
  /bg-accent/,
  /bg-destructive/,
  /text-foreground/,
  /text-primary/,
  /text-secondary/,
  /text-muted/,
  /text-destructive/,
  /border-border/,
  /border-input/,
  /ring-ring/,

  // Explicit design system colors from tailwind.config.ts
  /bg-cta-primary/,
  /bg-cta-hover/,
  /text-cta-primary/,
  /bg-brand-gunmetal/,
  /text-brand-gunmetal/,
  /bg-brand-copper/,
  /text-brand-copper/,

  // Stone palette (approved neutrals)
  /bg-stone-\d+/,
  /text-stone-\d+/,
  /border-stone-\d+/,

  // White and transparent (always allowed)
  /bg-white/,
  /bg-transparent/,
  /text-white/,
  /border-white/,
]

// Forbidden color patterns - these will always fail
const FORBIDDEN_PATTERNS = [
  // Colors explicitly banned in design system
  { pattern: /bg-orange-\d+/, reason: "Orange is forbidden - use CTA blue" },
  { pattern: /text-orange-\d+/, reason: "Orange is forbidden - use CTA blue" },
  { pattern: /bg-amber-\d+/, reason: "Amber is forbidden - conflicts with warning" },
  { pattern: /text-amber-\d+/, reason: "Amber is forbidden - conflicts with warning" },
  { pattern: /bg-teal-\d+/, reason: "Teal is forbidden - use stone neutrals" },
  { pattern: /text-teal-\d+/, reason: "Teal is forbidden - use stone neutrals" },
  { pattern: /bg-cyan-\d+/, reason: "Cyan is forbidden - use stone neutrals" },
  { pattern: /text-cyan-\d+/, reason: "Cyan is forbidden - use stone neutrals" },
  { pattern: /bg-pink-\d+/, reason: "Pink is forbidden - off-brand" },
  { pattern: /text-pink-\d+/, reason: "Pink is forbidden - off-brand" },
  { pattern: /bg-purple-\d+/, reason: "Purple is forbidden - off-brand" },
  { pattern: /text-purple-\d+/, reason: "Purple is forbidden - off-brand" },
  { pattern: /bg-indigo-\d+/, reason: "Indigo is forbidden - too similar to CTA" },
  { pattern: /text-indigo-\d+/, reason: "Indigo is forbidden - too similar to CTA" },

  // Arbitrary hex colors that aren't in the design system
  {
    pattern: /bg-\[#(?!1C1917|1D4ED8|1E40AF|3B82F6|FFFFFF|F8F8F7|171412|231F1C|FAFAF9)[0-9A-Fa-f]{6}\]/,
    reason: "Arbitrary hex color - use CSS variables from design system",
  },
  {
    pattern: /text-\[#(?!1C1917|FAFAF9|FFFFFF)[0-9A-Fa-f]{6}\]/,
    reason: "Arbitrary hex color - use CSS variables from design system",
  },
]

// Suspicious patterns that warrant review
const SUSPICIOUS_PATTERNS = [
  { pattern: /bg-gray-\d+/, reason: "Use stone palette instead of gray" },
  { pattern: /text-gray-\d+/, reason: "Use stone palette instead of gray" },
  { pattern: /bg-slate-\d+/, reason: "Use stone palette instead of slate" },
  { pattern: /text-slate-\d+/, reason: "Use stone palette instead of slate" },
  { pattern: /bg-blue-\d+/, reason: "Use bg-cta-primary for CTAs, stone for neutrals" },
  { pattern: /text-blue-\d+/, reason: "Use text-[--cta-primary] for links" },
]

interface Violation {
  file: string
  line: number
  column: number
  match: string
  reason: string
  severity: "error" | "warning"
}

function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = []
  const content = fs.readFileSync(filePath, "utf-8")
  const lines = content.split("\n")

  lines.forEach((line, lineIndex) => {
    // Skip comments and imports
    if (line.trim().startsWith("//") || line.trim().startsWith("import")) {
      return
    }

    // Check forbidden patterns (errors)
    for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
      const match = line.match(pattern)
      if (match) {
        violations.push({
          file: filePath,
          line: lineIndex + 1,
          column: match.index || 0,
          match: match[0],
          reason,
          severity: "error",
        })
      }
    }

    // Check suspicious patterns (warnings)
    for (const { pattern, reason } of SUSPICIOUS_PATTERNS) {
      const match = line.match(pattern)
      if (match) {
        // Check if it's actually allowed
        const isAllowed = ALLOWED_PATTERNS.some((p) => p.test(match[0]))
        if (!isAllowed) {
          violations.push({
            file: filePath,
            line: lineIndex + 1,
            column: match.index || 0,
            match: match[0],
            reason,
            severity: "warning",
          })
        }
      }
    }
  })

  return violations
}

function findTsxFiles(dir: string): string[] {
  const files: string[] = []

  const items = fs.readdirSync(dir)
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // Skip node_modules, .next, etc.
      if (!["node_modules", ".next", ".git", "archive"].includes(item)) {
        files.push(...findTsxFiles(fullPath))
      }
    } else if (item.endsWith(".tsx")) {
      files.push(fullPath)
    }
  }

  return files
}

function main() {
  const rootDir = process.cwd()
  const appDir = path.join(rootDir, "app")
  const componentsDir = path.join(rootDir, "components")

  console.log("\n🎨 PennyCentral Color Linter")
  console.log("════════════════════════════════════════\n")

  const files: string[] = []
  if (fs.existsSync(appDir)) files.push(...findTsxFiles(appDir))
  if (fs.existsSync(componentsDir)) files.push(...findTsxFiles(componentsDir))

  console.log(`Scanning ${files.length} files...\n`)

  const allViolations: Violation[] = []
  for (const file of files) {
    const violations = scanFile(file)
    allViolations.push(...violations)
  }

  const errors = allViolations.filter((v) => v.severity === "error")
  const warnings = allViolations.filter((v) => v.severity === "warning")

  if (errors.length > 0) {
    console.log("❌ ERRORS (forbidden colors):\n")
    for (const v of errors) {
      const relativePath = path.relative(rootDir, v.file)
      console.log(`  ${relativePath}:${v.line}:${v.column}`)
      console.log(`    Found: ${v.match}`)
      console.log(`    Reason: ${v.reason}\n`)
    }
  }

  if (warnings.length > 0) {
    console.log("⚠️  WARNINGS (review recommended):\n")
    for (const v of warnings) {
      const relativePath = path.relative(rootDir, v.file)
      console.log(`  ${relativePath}:${v.line}:${v.column}`)
      console.log(`    Found: ${v.match}`)
      console.log(`    Reason: ${v.reason}\n`)
    }
  }

  console.log("════════════════════════════════════════")
  console.log(`Errors: ${errors.length} | Warnings: ${warnings.length}`)

  if (errors.length === 0 && warnings.length === 0) {
    console.log("✅ All colors comply with design system!\n")
    process.exit(0)
  } else if (errors.length > 0) {
    console.log("❌ Fix errors before deploying.\n")
    process.exit(1)
  } else {
    console.log("⚠️  Review warnings when possible.\n")
    process.exit(0)
  }
}

main()
