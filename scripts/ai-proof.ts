#!/usr/bin/env tsx

import { chromium } from "playwright"
import fs from "fs"
import path from "path"
import net from "net"

type ProofMode = "dev" | "test"

function parseArgs(argv: string[]): { mode: ProofMode; routes: string[]; autoAliasUsed: boolean } {
  let rawMode: string | undefined
  const routes: string[] = []

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]

    if (arg === "--mode") {
      rawMode = argv[i + 1]
      i++
      continue
    }

    if (arg.startsWith("--mode=")) {
      rawMode = arg.split("=")[1]
      continue
    }

    if (arg.startsWith("-")) continue

    if ((arg === "dev" || arg === "test" || arg === "auto") && !rawMode) {
      rawMode = arg
      continue
    }

    routes.push(arg)
  }

  const normalized = (rawMode || "dev").trim().toLowerCase()

  if (normalized === "test") return { mode: "test", routes, autoAliasUsed: false }
  if (normalized === "auto") return { mode: "dev", routes, autoAliasUsed: true }
  return { mode: "dev", routes, autoAliasUsed: false }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function isPortInUse(port: number): Promise<boolean> {
  return await new Promise<boolean>((resolve) => {
    const server = net.createServer()
    server.once("error", () => {
      server.close()
      resolve(true)
    })
    server.once("listening", () => {
      server.close()
      resolve(false)
    })
    server.listen(port)
  })
}

async function isHttpOkWithRetries(
  url: string,
  options: { attempts: number; timeoutMs: number; delayMs: number }
): Promise<{ ok: boolean; status?: number; error?: string }> {
  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), options.timeoutMs)
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(timeout)

      if (response.ok) return { ok: true, status: response.status }
      return { ok: false, status: response.status }
    } catch (err: any) {
      const message = err?.name === "AbortError" ? "timeout" : String(err?.message || err)
      if (attempt === options.attempts) return { ok: false, error: message }
      await sleep(options.delayMs)
    }
  }

  return { ok: false, error: "unknown" }
}

async function resolveBaseUrl(
  mode: ProofMode
): Promise<{ ok: boolean; message: string; baseUrl?: string }> {
  if (process.env.PLAYWRIGHT_BASE_URL) {
    const baseUrl = process.env.PLAYWRIGHT_BASE_URL
    const status = await isHttpOkWithRetries(`${baseUrl}/`, {
      attempts: 3,
      timeoutMs: 5000,
      delayMs: 1000,
    })

    if (!status.ok) {
      return {
        ok: false,
        message: `PLAYWRIGHT_BASE_URL is set but not responding (${baseUrl}).`,
      }
    }

    return {
      ok: true,
      message: `Using PLAYWRIGHT_BASE_URL=${baseUrl}`,
      baseUrl,
    }
  }

  if (mode === "test") {
    const portInUse = await isPortInUse(3002)
    if (!portInUse) {
      return {
        ok: false,
        message:
          "Mode=test requires a healthy server on port 3002. Start one first, or set PLAYWRIGHT_BASE_URL. This command will not start/stop servers for you.",
      }
    }

    const status = await isHttpOkWithRetries("http://127.0.0.1:3002/", {
      attempts: 2,
      timeoutMs: 3000,
      delayMs: 800,
    })
    if (!status.ok) {
      return {
        ok: false,
        message:
          "Mode=test found port 3002 in use but HTTP is unhealthy. Fix that server and retry, or use --mode=dev.",
      }
    }

    return {
      ok: true,
      message: "Using isolated server on port 3002 (mode=test)",
      baseUrl: "http://127.0.0.1:3002",
    }
  }

  const portInUse = await isPortInUse(3001)
  if (!portInUse) {
    return {
      ok: false,
      message:
        'Mode=dev requires your persistent preview server on port 3001. Start it with "npm run dev", or run with --mode=test.',
    }
  }

  const status = await isHttpOkWithRetries("http://localhost:3001/", {
    attempts: 3,
    timeoutMs: 5000,
    delayMs: 1500,
  })
  if (!status.ok) {
    return {
      ok: false,
      message:
        "Port 3001 is occupied but HTTP is unhealthy. Fix/restart only if you own that process; this command will not kill or restart it.",
    }
  }

  return {
    ok: true,
    message: "Using persistent preview server on port 3001 (mode=dev)",
    baseUrl: "http://localhost:3001",
  }
}

async function gotoWithRetries(page: any, url: string, attempts = 3) {
  let lastError: unknown = undefined

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45_000 })

      try {
        await page.waitForLoadState("networkidle", { timeout: 5_000 })
      } catch {
        // ignore
      }

      await page.waitForTimeout(350)
      return
    } catch (err) {
      lastError = err
      await page.waitForTimeout(500 * attempt)
    }
  }

  throw lastError
}

async function captureUiState(page: any, outDir: string, slug: string, mode: "light" | "dark") {
  const perPageSelect = page.locator("#penny-list-items-per-page")

  try {
    if ((await perPageSelect.count()) > 0) {
      await perPageSelect.scrollIntoViewIfNeeded()
      await page.waitForTimeout(200)
    } else {
      await page.evaluate(() => window.scrollTo(0, 700))
      await page.waitForTimeout(200)
    }
  } catch {
    // Best-effort only.
  }

  await page.screenshot({
    path: path.join(outDir, `${slug}-ui-${mode}.png`),
    fullPage: false,
  })
}

function toTargetUrl(route: string, baseUrl: string): string {
  if (route.startsWith("http://") || route.startsWith("https://")) {
    return route
  }

  const normalizedRoute = route.startsWith("/") ? route : `/${route}`
  return `${baseUrl}${normalizedRoute}`
}

function toSlug(route: string): string {
  const withoutOrigin = route.replace(/^https?:\/\/[^/]+/i, "")
  const normalizedRoute = withoutOrigin.startsWith("/") ? withoutOrigin : `/${withoutOrigin}`
  return normalizedRoute.replace(/\//g, "-").slice(1) || "home"
}

async function main() {
  const parsed = parseArgs(process.argv.slice(2))
  const routes = parsed.routes

  if (routes.length === 0) {
    console.error("❌ Error: No routes specified")
    console.error("Usage: npm run ai:proof -- /penny-list /store-finder")
    console.error("       npm run ai:proof -- --mode=dev /report-find")
    console.error("       npm run ai:proof -- --mode=test /penny-list")
    process.exit(1)
  }

  console.log("═══════════════════════════════════════")
  console.log("   AI Proof Screenshot Capture")
  console.log("═══════════════════════════════════════\n")

  if (parsed.autoAliasUsed) {
    console.log("ℹ️  Mode=auto is deprecated; defaulting to mode=dev.\n")
  }

  const resolved = await resolveBaseUrl(parsed.mode)
  if (!resolved.ok || !resolved.baseUrl) {
    console.error(`❌ Error: ${resolved.message}\n`)
    process.exit(1)
  }

  const baseUrl = resolved.baseUrl
  console.log(`✅ ${resolved.message}\n`)

  // Create timestamp and output directory
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19)
  const outDir = path.join("reports", "proof", timestamp)

  fs.mkdirSync(outDir, { recursive: true })

  console.log(`📁 Output directory: ${outDir}\n`)
  console.log(`📸 Capturing screenshots for ${routes.length} route(s)...\n`)

  // Launch browser
  const browser = await chromium.launch()
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const page = await context.newPage()

  // Track console errors
  const consoleErrors: string[] = []
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      consoleErrors.push(`[${msg.location().url}] ${msg.text()}`)
    }
  })

  // Capture screenshots for each route
  for (const route of routes) {
    const slug = toSlug(route)
    const targetUrl = toTargetUrl(route, baseUrl)

    console.log(`  Processing ${route} (${targetUrl})...`)

    try {
      // Light mode
      await page.emulateMedia({ colorScheme: "light" })
      await gotoWithRetries(page, targetUrl)
      await page.screenshot({
        path: path.join(outDir, `${slug}-light.png`),
        fullPage: false,
      })
      console.log(`    ✅ ${slug}-light.png`)
      await captureUiState(page, outDir, slug, "light")
      console.log(`    ✅ ${slug}-ui-light.png`)

      // Dark mode - click the theme toggle button
      const themeToggle = page
        .locator('button[aria-label*="theme" i], button:has(svg path[d*="M21 12.79A9"])')
        .first()
      if ((await themeToggle.count()) > 0) {
        await themeToggle.click()
        await page.waitForTimeout(500) // Wait for transition
      }
      await page.screenshot({
        path: path.join(outDir, `${slug}-dark.png`),
        fullPage: false,
      })
      console.log(`    ✅ ${slug}-dark.png`)
      await captureUiState(page, outDir, slug, "dark")
      console.log(`    ✅ ${slug}-ui-dark.png`)
    } catch (err: any) {
      console.error(`    ❌ Error capturing ${route}: ${err.message}`)
    }
  }

  // Save console errors
  const errorsPath = path.join(outDir, "console-errors.txt")
  if (consoleErrors.length > 0) {
    fs.writeFileSync(errorsPath, consoleErrors.join("\n"))
    console.log(`\n⚠️  ${consoleErrors.length} console error(s) recorded`)
  } else {
    fs.writeFileSync(errorsPath, "No console errors detected")
    console.log(`\n✅ No console errors detected`)
  }

  await browser.close()

  console.log("\n═══════════════════════════════════════")
  console.log("   Screenshot Capture Complete")
  console.log("═══════════════════════════════════════\n")
  console.log(`📁 Outputs saved to: ${outDir}\n`)
}

main().catch((err) => {
  console.error("Error running screenshot capture:", err)
  process.exit(1)
})
