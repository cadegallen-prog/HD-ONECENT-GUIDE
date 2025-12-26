import { execSync } from "node:child_process"

const BLOCKED_NAME_PATTERNS = [/purchase[\s_-]*history/i, /penny[\s_-]*export/i, /receipt/i]

const BLOCKED_CONTENT_PATTERNS = [
  /\bPurchaser\b/i,
  /\bStore\s*#\b/i,
  /\bStore\s*Number\b/i,
  /\bTransaction\s*ID\b/i,
  /\bInvoice\s*Number\b/i,
]

function git(args) {
  return execSync(`git ${args}`, { encoding: "utf8" }).trim()
}

function main() {
  // Scan staged files only. This is the last line of defense before a commit.
  // Use --diff-filter=d to exclude deleted files (they can't contain new PII)
  const staged = git("diff --cached --name-only --diff-filter=d")
  const files = staged ? staged.split(/\r?\n/).filter(Boolean) : []

  if (files.length === 0) {
    process.exit(0)
  }

  const blockedByName = files.filter((f) => BLOCKED_NAME_PATTERNS.some((re) => re.test(f)))
  if (blockedByName.length > 0) {
    console.error("\n⛔ Refusing commit: staged file name matches a blocked privacy pattern:\n")
    for (const f of blockedByName) console.error(`- ${f}`)
    console.error("\nRemove/rename these files and try again.\n")
    process.exit(1)
  }

  // Only scan text-like files for blocked headers.
  const textLike = files.filter((f) => /\.(csv|ts|tsx|js|mjs|json|md|txt|py)$/i.test(f))

  for (const filePath of textLike) {
    let content = ""
    try {
      // Read staged content (not working tree)
      content = execSync(`git show :"${filePath}"`, { encoding: "utf8" })
    } catch {
      continue
    }

    for (const re of BLOCKED_CONTENT_PATTERNS) {
      if (re.test(content)) {
        console.error(
          `\n⛔ Refusing commit: staged file ${filePath} contains blocked sensitive header/content (${re}).\n`
        )
        console.error(
          "This usually means a purchase-history export or derived data was accidentally staged.\n"
        )
        process.exit(1)
      }
    }
  }
}

main()
