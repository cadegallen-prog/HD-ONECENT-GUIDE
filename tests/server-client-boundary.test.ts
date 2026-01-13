import assert from "node:assert"
import test from "node:test"
import { readFile, readdir } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.join(__dirname, "..")

const CLIENT_DIRS = [path.join(projectRoot, "app"), path.join(projectRoot, "components")]
const CLIENT_FILE_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])

const SERVER_ONLY_IMPORT_PATHS = ["@/lib/fetch-penny-data", "@/lib/supabase/client"] as const
const SERVER_ONLY_FILES = ["lib/fetch-penny-data.ts", "lib/supabase/client.ts"] as const
const SECRET_ENV_MARKERS = ["SUPABASE_SERVICE_ROLE", "SUPABASE_SERVICE_ROLE_KEY"] as const

function escapeForRegExp(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

async function listFilesRecursive(root: string): Promise<string[]> {
  const results: string[] = []

  let entries: Awaited<ReturnType<typeof readdir>>
  try {
    entries = await readdir(root, { withFileTypes: true })
  } catch {
    return results
  }

  for (const entry of entries) {
    const fullPath = path.join(root, entry.name)
    if (entry.isDirectory()) {
      results.push(...(await listFilesRecursive(fullPath)))
      continue
    }

    const ext = path.extname(entry.name)
    if (CLIENT_FILE_EXTENSIONS.has(ext)) results.push(fullPath)
  }

  return results
}

function isUseClientFile(content: string): boolean {
  return content.includes('"use client"') || content.includes("'use client'")
}

function findNonTypeImports(
  content: string,
  importPath: (typeof SERVER_ONLY_IMPORT_PATHS)[number]
) {
  const violations: string[] = []

  const escaped = escapeForRegExp(importPath)
  const sideEffectRegex = new RegExp(`^\\s*import\\s+["']${escaped}["']\\s*;?\\s*$`, "gm")
  if (sideEffectRegex.test(content)) violations.push(`side-effect import: ${importPath}`)

  const fromRegex = new RegExp(`^\\s*import\\s+(.+)\\s+from\\s+["']${escaped}["']\\s*;?\\s*$`, "gm")

  let match: RegExpExecArray | null
  while ((match = fromRegex.exec(content))) {
    const clause = match[1]?.trim() ?? ""

    if (clause.startsWith("type ")) continue

    if (clause.startsWith("{")) {
      const closeIndex = clause.indexOf("}")
      const inside = closeIndex >= 0 ? clause.slice(1, closeIndex) : clause.slice(1)
      const specifiers = inside
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const allTypeOnly = specifiers.length > 0 && specifiers.every((s) => s.startsWith("type "))
      if (allTypeOnly) continue
    }

    violations.push(`non-type import: ${importPath}`)
  }

  return violations
}

test("client components must not import server-only modules", async () => {
  const files = (await Promise.all(CLIENT_DIRS.map(listFilesRecursive))).flat()
  const violations: string[] = []

  for (const filePath of files) {
    const rel = path.relative(projectRoot, filePath).replace(/\\/g, "/")
    const content = await readFile(filePath, "utf8")
    if (!isUseClientFile(content)) continue

    for (const importPath of SERVER_ONLY_IMPORT_PATHS) {
      const found = findNonTypeImports(content, importPath)
      found.forEach((v) => violations.push(`${rel}: ${v}`))
    }
  }

  assert.strictEqual(
    violations.length,
    0,
    `Client components must not import server-only modules:\n${violations.join("\n")}`
  )
})

test("server-only modules have proper guard", async () => {
  const missingGuards: string[] = []

  for (const file of SERVER_ONLY_FILES) {
    const filePath = path.join(projectRoot, file)
    const content = await readFile(filePath, "utf8")

    if (!content.includes('import "server-only"') && !content.includes("import 'server-only'")) {
      missingGuards.push(file)
    }
  }

  assert.strictEqual(
    missingGuards.length,
    0,
    `Server-only modules must import \"server-only\":\n${missingGuards.join("\n")}`
  )
})

test("service role env vars are never referenced in client code", async () => {
  const files = (await Promise.all(CLIENT_DIRS.map(listFilesRecursive))).flat()
  const violations: string[] = []

  for (const filePath of files) {
    const rel = path.relative(projectRoot, filePath).replace(/\\/g, "/")
    const content = await readFile(filePath, "utf8")
    if (!isUseClientFile(content)) continue

    for (const marker of SECRET_ENV_MARKERS) {
      if (content.includes(marker)) violations.push(`${rel}: contains ${marker}`)
    }
  }

  assert.strictEqual(
    violations.length,
    0,
    `Client components must not reference service role env vars:\n${violations.join("\n")}`
  )
})
