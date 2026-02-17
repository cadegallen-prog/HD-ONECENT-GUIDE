#!/usr/bin/env tsx
/**
 * Backfill Penny List rows from Item Cache (enrichment_staging).
 *
 * Usage:
 *   npm run backfill:item-cache
 *   npm run backfill:item-cache -- -- --limit 1000
 *   npm run backfill:item-cache -- -- --sku 1009258128
 */

import { mkdir, writeFile } from "node:fs/promises"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { validateSku } from "../lib/sku"

function tryLoadDotenv() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dotenv = require("dotenv")
    dotenv.config({ path: ".env.local" })
  } catch {
    // Optional: env may already be loaded by shell/CI.
  }
}

type Args = {
  sku: string | null
  limit: number
}

function parseArgs(argv: string[]): Args {
  let sku: string | null = null
  let limit = 5000

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === "--sku" && argv[i + 1]) {
      sku = argv[++i].trim()
    } else if (arg === "--limit" && argv[i + 1]) {
      const parsed = Number.parseInt(argv[++i], 10)
      if (Number.isFinite(parsed) && parsed > 0) {
        limit = parsed
      } else {
        throw new Error("Invalid --limit value")
      }
    } else if (arg === "--help" || arg === "-h") {
      console.log("Backfill Penny List from Item Cache")
      console.log("")
      console.log("Usage:")
      console.log("  npm run backfill:item-cache")
      console.log("  npm run backfill:item-cache -- -- --limit 1000")
      console.log("  npm run backfill:item-cache -- -- --sku 1009258128")
      process.exit(0)
    }
  }

  if (sku) {
    const checked = validateSku(sku)
    if (checked.error) {
      throw new Error(`Invalid --sku: ${checked.error}`)
    }
    sku = checked.normalized
  }

  return { sku, limit }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required env var: ${name}`)
  return value
}

async function main() {
  try {
    tryLoadDotenv()
    const args = parseArgs(process.argv.slice(2))

    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
      process.env.SUPABASE_URL ??
      process.env.VITE_SUPABASE_URL
    const serviceRoleKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ??
      process.env.SUPABASE_SECRET_KEY ??
      process.env.SUPABASE_SERVICE_KEY

    if (!supabaseUrl) {
      throw new Error(
        "Missing Supabase URL. Expected NEXT_PUBLIC_SUPABASE_URL (preferred) or SUPABASE_URL."
      )
    }
    if (!serviceRoleKey) {
      throw new Error("Missing service role key. Expected SUPABASE_SERVICE_ROLE_KEY.")
    }

    // Validate required envs for clarity in founder-facing output.
    getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL")
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY")

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    console.log("Item Cache backfill started")
    console.log(`- mode: ${args.sku ? "single-sku" : "bulk"}`)
    if (args.sku) console.log(`- sku: ${args.sku}`)
    if (!args.sku) console.log(`- limit: ${args.limit}`)

    let result: unknown
    if (args.sku) {
      const { data, error } = await supabase.rpc("backfill_penny_list_from_item_cache_for_sku", {
        p_sku: args.sku,
      })
      if (error) throw new Error(`RPC error: ${error.message}`)
      result = data
    } else {
      const { data, error } = await supabase.rpc("backfill_penny_list_from_item_cache", {
        p_limit: args.limit,
      })
      if (error) throw new Error(`RPC error: ${error.message}`)
      result = data
    }

    const timestamp = new Date().toISOString().replace(/[:]/g, "-")
    const reportDir = path.join(process.cwd(), "reports", "backfill")
    await mkdir(reportDir, { recursive: true })
    const reportPath = path.join(reportDir, `${timestamp}.json`)
    await writeFile(
      reportPath,
      JSON.stringify(
        {
          started_at: new Date().toISOString(),
          args,
          result,
        },
        null,
        2
      ),
      "utf8"
    )

    console.log("Item Cache backfill complete")
    console.log(`- report: ${path.relative(process.cwd(), reportPath)}`)
    console.log(`- result: ${JSON.stringify(result)}`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }
}

void main()
