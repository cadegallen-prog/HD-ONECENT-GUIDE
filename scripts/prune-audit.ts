import fs from "node:fs"
import path from "node:path"
import { execFileSync } from "node:child_process"

type DirStats = {
  files: number
  bytes: number
}

function gitLsFiles(): string[] {
  const out = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  return out
    .split("\u0000")
    .map((s) => s.trim())
    .filter(Boolean)
}

function safeStatBytes(repoRoot: string, relPath: string): number {
  try {
    const full = path.join(repoRoot, relPath)
    return fs.statSync(full).size
  } catch {
    return 0
  }
}

function addStats(map: Map<string, DirStats>, key: string, bytes: number) {
  const cur = map.get(key) ?? { files: 0, bytes: 0 }
  cur.files += 1
  cur.bytes += bytes
  map.set(key, cur)
}

function fmtBytes(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"]
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i += 1
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

function printTopDirs(title: string, stats: Map<string, DirStats>, topN: number) {
  const rows = [...stats.entries()]
    .map(([k, v]) => ({ key: k, ...v }))
    .sort((a, b) => b.bytes - a.bytes || b.files - a.files || a.key.localeCompare(b.key))
    .slice(0, topN)

  console.log(`\n${title}`)
  console.log("files\tbytes\tpath")
  for (const r of rows) {
    console.log(`${r.files}\t${fmtBytes(r.bytes)}\t${r.key}`)
  }
}

function printLargestFiles(repoRoot: string, files: string[], topN: number) {
  const rows = files
    .map((f) => ({ file: f, bytes: safeStatBytes(repoRoot, f) }))
    .sort((a, b) => b.bytes - a.bytes || a.file.localeCompare(b.file))
    .slice(0, topN)

  console.log("\nLargest tracked files")
  console.log("bytes\tpath")
  for (const r of rows) {
    console.log(`${fmtBytes(r.bytes)}\t${r.file}`)
  }
}

function sumPrefix(repoRoot: string, files: string[], prefix: string) {
  const matched = files.filter(
    (f) => f === prefix || f.startsWith(prefix.endsWith("/") ? prefix : `${prefix}/`)
  )
  const bytes = matched.reduce((acc, f) => acc + safeStatBytes(repoRoot, f), 0)
  return { files: matched.length, bytes }
}

function main() {
  const repoRoot = process.cwd()
  const files = gitLsFiles()

  const activeFiles = files.filter((f) => !f.startsWith("archive/"))
  const activeMd = activeFiles.filter((f) => f.endsWith(".md"))
  const activeScripts = activeFiles.filter((f) => f.startsWith("scripts/"))

  console.log("PennyCentral Prune Audit")
  console.log("========================")
  console.log(`tracked_files: ${files.length}`)
  console.log(`active_md (non-archive): ${activeMd.length}`)
  console.log(`active_scripts (non-archive): ${activeScripts.length}`)

  // Top-level directory rollups (rough "surface area" view)
  const topLevel = new Map<string, DirStats>()
  for (const f of activeFiles) {
    const bytes = safeStatBytes(repoRoot, f)
    const first = f.split("/")[0] ?? f
    addStats(topLevel, first, bytes)
  }
  printTopDirs("Top-level directories (non-archive)", topLevel, 20)

  // Heuristic hotspots (tracked-but-non-production assets we commonly want to quarantine)
  const hotspots = [
    "PICTURES_PENNY_CENTRAL",
    ".ai/analytics",
    "reports/manual-testing",
    "reports/palette-screenshots",
    "reports/verification",
  ]

  console.log("\nHotspots (tracked files) — candidates for archive-first quarantine")
  console.log("files\tbytes\tpath")
  for (const h of hotspots) {
    const s = sumPrefix(repoRoot, files, h)
    console.log(`${s.files}\t${fmtBytes(s.bytes)}\t${h}`)
  }

  // Large individual files are often accidental bloat.
  printLargestFiles(repoRoot, activeFiles, 25)

  // Archive hygiene checks (manifests make restores deterministic).
  const requiredArchiveFiles = [
    "archive/docs-pruned/README.md",
    "archive/scripts-pruned/README.md",
    "archive/media-pruned/README.md",
  ]
  const missingArchiveFiles = requiredArchiveFiles.filter((p) => !files.includes(p))

  console.log("\nArchive hygiene")
  if (missingArchiveFiles.length === 0) {
    console.log("✅ archive policy READMEs present")
  } else {
    console.log("❌ missing archive policy files:")
    for (const p of missingArchiveFiles) console.log(`- ${p}`)
  }

  console.log("\nNext action (suggested)")
  console.log(
    "- Move hotspot folders into archive snapshots with `git mv` (preserve restore path parity)."
  )
  console.log("- Add/update snapshot INDEX.md manifests for every prune pass.")
}

main()
