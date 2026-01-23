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
  console.log("  npm run warm:staging -- --max-uniques 6000 --batch-size 50")
  console.log("  npm run warm:staging -- --api-url https://pro.scouterdev.io/api/penny-items")
  console.log("")
  console.log("Required env vars (in .env.local or your shell):")
  console.log("  PENNY_RAW_COOKIE, PENNY_GUILD_ID, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY")
}

function pickPythonCommand() {
  if (process.platform === "win32") return { cmd: "py", args: ["-3"] }
  return { cmd: "python3", args: [] }
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
  process.env.PENNY_ZIP_CODES = args.zipCodes || process.env.PENNY_ZIP_CODES || defaultZipCodes
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
    console.error("- Run `vercel env pull .env.local` (Supabase vars), then add PENNY_RAW_COOKIE + PENNY_GUILD_ID to .env.local")
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
