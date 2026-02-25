#!/usr/bin/env tsx

/**
 * Analytics Delta Archive
 *
 * Reads the run-index.jsonl to find the last successful run's end date,
 * then pulls only new data from that date to today.
 *
 * Usage:
 *   npm run analytics:delta
 *   tsx scripts/analytics-delta.ts
 *
 * This avoids re-downloading the entire history each time.
 * A 1-day overlap is included to catch late-arriving GSC data.
 */

import { execFileSync } from "child_process"
import fs from "fs"
import path from "path"

const INDEX_PATH = path.join(".local", "analytics-history", "run-index.jsonl")
const OVERLAP_DAYS = 1

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10)
}

function subtractDays(dateStr: string, days: number): string {
  const date = new Date(`${dateStr}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() - days)
  return date.toISOString().slice(0, 10)
}

function findLastSuccessfulEndDate(): string | null {
  if (!fs.existsSync(INDEX_PATH)) return null

  const lines = fs
    .readFileSync(INDEX_PATH, "utf8")
    .split("\n")
    .filter((line) => line.trim().length > 0)

  // Walk backwards to find last run with no errors and actual data
  for (let i = lines.length - 1; i >= 0; i--) {
    try {
      const run = JSON.parse(lines[i])
      const hasData =
        (Array.isArray(run.gsc) && run.gsc.length > 0) ||
        (Array.isArray(run.ga4) && run.ga4.length > 0)
      const hasErrors = Array.isArray(run.errors) && run.errors.length > 0

      if (hasData && !hasErrors && run.endDate) {
        return run.endDate
      }
    } catch {
      // skip malformed lines
    }
  }

  return null
}

function main() {
  const lastEndDate = findLastSuccessfulEndDate()
  const today = todayUtc()

  let startDate: string

  if (lastEndDate) {
    // Overlap by 1 day to catch late-arriving GSC data
    startDate = subtractDays(lastEndDate, OVERLAP_DAYS)
    console.log(`Last successful archive ended: ${lastEndDate}`)
    console.log(`Delta start (with ${OVERLAP_DAYS}-day overlap): ${startDate}`)
  } else {
    // No prior runs — do a full pull
    startDate = "2024-01-01"
    console.log("No prior successful runs found — doing full archive pull.")
  }

  console.log(`End date: ${today}`)
  console.log("")

  const args = [
    "run",
    "analytics:archive",
    "--",
    "--",
    `--start-date=${startDate}`,
    `--end-date=${today}`,
  ]

  try {
    execFileSync("npm", args, {
      cwd: path.resolve("."),
      stdio: "inherit",
      shell: true,
    })
  } catch (error) {
    console.error("Delta archive failed.")
    process.exit(1)
  }
}

main()
