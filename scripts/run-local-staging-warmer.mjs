#!/usr/bin/env node
/**
 * Local Staging Warmer runner (manual override).
 *
 * Goal: Run the exact same pipeline as GitHub Actions, but from your home IP.
 * It spawns `python scripts/staging-warmer.py` after loading env from `.env.local` / `.env`.
 *
 * Usage:
 *   npm run warm:staging
 *   npm run warm:staging -- --zip-codes 30301,30303,30305,30308,30309
 *   npm run warm:staging -- --max-uniques 6000 --batch-size 50
 *
 * Required env vars (from `.env.local` or your shell):
 *   - PENNY_RAW_COOKIE
 *   - PENNY_GUILD_ID
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 */

import { spawn } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"

function parseArgs(argv) {
  const args = {
    help: false,
    zipCodes: undefined,
    zipPool: undefined,
    zipSample: undefined,
    zipSeed: undefined,
    maxUniques: undefined,
    batchSize: undefined,
    apiUrl: undefined,
  }

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === "--help" || a === "-h") {
      args.help = true
      continue
    }
    if (a === "--zip-codes") {
      args.zipCodes = argv[i + 1]
      i++
      continue
    }
    if (a === "--zip-pool") {
      args.zipPool = argv[i + 1]
      i++
      continue
    }
    if (a === "--zip-sample") {
      args.zipSample = argv[i + 1]
      i++
      continue
    }
    if (a === "--zip-seed") {
      args.zipSeed = argv[i + 1]
      i++
      continue
    }
    if (a === "--max-uniques") {
      args.maxUniques = argv[i + 1]
      i++
      continue
    }
    if (a === "--batch-size") {
      args.batchSize = argv[i + 1]
      i++
      continue
    }
    if (a === "--api-url") {
      args.apiUrl = argv[i + 1]
      i++
      continue
    }
  }

  return args
}

function parseEnvFile(filePath) {
  const content = readFileSync(filePath, "utf8")
  const lines = content.split(/\r?\n/)
  const parsed = {}

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("#")) continue

    const eqIndex = trimmed.indexOf("=")
    if (eqIndex === -1) continue

    const key = trimmed.slice(0, eqIndex).trim()
    let value = trimmed.slice(eqIndex + 1).trim()

    // Strip surrounding quotes (common in .env files)
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }

    if (key) parsed[key] = value
  }

  return parsed
}

function loadEnvIfPresent(relPath) {
  const fullPath = resolve(process.cwd(), relPath)
  if (!existsSync(fullPath)) return
  const parsed = parseEnvFile(fullPath)
  for (const [k, v] of Object.entries(parsed)) {
    if (process.env[k] === undefined) process.env[k] = v
  }
}

function printHelp() {
  // Intentionally short. This is for the founder.
  console.log("Local Staging Warmer (manual override)")
  console.log("")
  console.log("Usage:")
  console.log("  npm run warm:staging")
  console.log("  npm run warm:staging -- --zip-codes 30301,30303,30305,30308,30309")
  console.log("  npm run warm:staging -- --zip-pool 30301,10001,60601 --zip-sample 5")
  console.log("  npm run warm:staging -- --zip-pool 30301,10001,60601 --zip-sample 5 --zip-seed 20260201")
  console.log("  npm run warm:staging -- --max-uniques 6000 --batch-size 50")
  console.log("  npm run warm:staging -- --api-url https://pro.scouterdev.io/api/penny-items")
  console.log("")
  console.log("Required env vars (in .env.local or your shell):")
  console.log(
    "  PENNY_RAW_COOKIE, PENNY_GUILD_ID, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY"
  )
  console.log("")
  console.log("Optional env vars:")
  console.log("  PENNY_ZIP_POOL (comma-separated zip codes; sampled into PENNY_ZIP_CODES)")
}

function pickPythonCommand() {
  // Try "python" first (works on most systems including Windows with python.org install)
  // Fall back to "py -3" (Windows Python Launcher) or "python3" (macOS/Linux)
  if (process.platform === "win32") return { cmd: "python", args: [] }
  return { cmd: "python3", args: [] }
}

function parseZipCodes(value) {
  if (!value) return []
  return String(value)
    .split(",")
    .map((z) => z.trim())
    .filter(Boolean)
    .filter((z) => /^\d{5}$/.test(z))
}

function mulberry32(seed) {
  let t = seed >>> 0
  return () => {
    t += 0x6d2b79f5
    let x = Math.imul(t ^ (t >>> 15), 1 | t)
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

function sampleUnique(list, n, seed) {
  const pool = [...new Set(list)]
  if (n <= 0) return []
  if (pool.length <= n) return pool

  const rand =
    seed == null
      ? Math.random
      : mulberry32(Number.isFinite(Number(seed)) ? Number(seed) : String(seed).length)

  // Fisher–Yates shuffle then take first n
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, n)
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (args.help) {
    printHelp()
    process.exit(0)
  }

  // Load local env files if present (no dependency on dotenv).
  loadEnvIfPresent(".env.local")
  loadEnvIfPresent(".env")

  // Defaults match the GitHub Actions warmer dispatch defaults.
  const defaultZipCodes = "30301,30303,30305,30308,30309"

  const explicitZipCodes = parseZipCodes(args.zipCodes || process.env.PENNY_ZIP_CODES)
  const zipPool = parseZipCodes(args.zipPool || process.env.PENNY_ZIP_POOL)
  const sampleSizeRaw = args.zipSample || process.env.PENNY_ZIP_SAMPLE || "5"
  const sampleSize = Number(sampleSizeRaw)
  const zipSeed = args.zipSeed || process.env.PENNY_ZIP_SEED

  const selectedZipCodes =
    explicitZipCodes.length > 0
      ? explicitZipCodes
      : zipPool.length > 0
        ? sampleUnique(zipPool, Number.isFinite(sampleSize) ? sampleSize : 5, zipSeed)
        : parseZipCodes(defaultZipCodes)

  process.env.PENNY_ZIP_CODES = selectedZipCodes.join(",")
  process.env.MAX_UNIQUES = args.maxUniques || process.env.MAX_UNIQUES || "6000"
  process.env.BATCH_SIZE = args.batchSize || process.env.BATCH_SIZE || "50"
  if (args.apiUrl) process.env.PENNY_API_URL = args.apiUrl

  const required = [
    "PENNY_RAW_COOKIE",
    "PENNY_GUILD_ID",
    "NEXT_PUBLIC_SUPABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
  ]
  const missing = required.filter((k) => !process.env[k] || String(process.env[k]).trim() === "")
  if (missing.length > 0) {
    console.error("Missing required environment variables:")
    for (const k of missing) console.error(`- ${k}`)
    console.error("")
    console.error("Fix:")
    console.error(
      "- Run `vercel env pull .env.local` (Supabase vars), then add PENNY_RAW_COOKIE + PENNY_GUILD_ID to .env.local"
    )
    process.exit(1)
  }

  console.log("Running local staging warmer with:")
  console.log(`- PENNY_ZIP_CODES=${process.env.PENNY_ZIP_CODES}`)
  console.log(`- MAX_UNIQUES=${process.env.MAX_UNIQUES}`)
  console.log(`- BATCH_SIZE=${process.env.BATCH_SIZE}`)
  console.log("")

  const py = pickPythonCommand()
  const child = spawn(
    py.cmd,
    [...py.args, resolve(process.cwd(), "scripts", "staging-warmer.py")],
    { stdio: "inherit", env: process.env }
  )

  child.on("exit", (code) => process.exit(code ?? 1))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
