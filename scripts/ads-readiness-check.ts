/**
 * Ads-Readiness Validation Script
 *
 * Checks that ads.txt, robots.txt, and sitemap.xml are correctly served
 * from the local dev/build server. Can also validate against production.
 *
 * Usage:
 *   npx tsx scripts/ads-readiness-check.ts [--production]
 *
 * In CI, run against a local build:
 *   npm run build && npx tsx scripts/ads-readiness-check.ts
 *
 * Exits with code 1 if any check fails.
 */

const PRODUCTION_HOST = "https://www.pennycentral.com"
const LOCAL_HOST = "http://localhost:3001"

const isProduction = process.argv.includes("--production")
const baseUrl = isProduction ? PRODUCTION_HOST : LOCAL_HOST

interface CheckResult {
  name: string
  passed: boolean
  detail: string
}

const results: CheckResult[] = []

function pass(name: string, detail: string) {
  results.push({ name, passed: true, detail })
}

function fail(name: string, detail: string) {
  results.push({ name, passed: false, detail })
}

// ---------- ads.txt checks ----------

async function checkAdsTxt() {
  const label = "ads.txt"
  try {
    const res = await fetch(`${baseUrl}/ads.txt`, { redirect: "follow" })

    if (!res.ok) {
      fail(label, `HTTP ${res.status} — ads.txt not reachable`)
      return
    }

    const body = await res.text()

    if (!body.trim()) {
      fail(label, "ads.txt is empty")
      return
    }

    // Must contain at least one DIRECT or RESELLER line
    const hasEntry = /^[a-z0-9.-]+,\s*\S+,\s*(DIRECT|RESELLER)/im.test(body)
    if (!hasEntry) {
      fail(label, "ads.txt has no valid DIRECT/RESELLER entries")
      return
    }

    const lineCount = body.split("\n").filter((l) => l.trim() && !l.startsWith("#")).length
    pass(label, `OK — ${lineCount} non-comment lines`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    fail(label, `Fetch failed: ${msg}`)
  }
}

// ---------- robots.txt checks ----------

async function checkRobotsTxt() {
  const label = "robots.txt"
  try {
    const res = await fetch(`${baseUrl}/robots.txt`, { redirect: "follow" })

    if (!res.ok) {
      fail(label, `HTTP ${res.status} — robots.txt not reachable`)
      return
    }

    const body = await res.text()

    if (!body.trim()) {
      fail(label, "robots.txt is empty")
      return
    }

    // Must contain Sitemap directive
    if (!/^Sitemap:\s*https?:\/\//im.test(body)) {
      fail(label, "robots.txt does not reference a sitemap")
      return
    }

    // Must reference canonical host
    if (!body.includes("www.pennycentral.com")) {
      fail(label, "robots.txt sitemap does not reference canonical host (www.pennycentral.com)")
      return
    }

    // Must have User-agent directive
    if (!/^User-agent:/im.test(body)) {
      fail(label, "robots.txt has no User-agent directive")
      return
    }

    pass(label, "OK — has User-agent, Sitemap referencing canonical host")
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    fail(label, `Fetch failed: ${msg}`)
  }
}

// ---------- sitemap.xml checks ----------

const REQUIRED_ROUTES = [
  "/",
  "/penny-list",
  "/guide",
  "/store-finder",
  "/report-find",
  "/faq",
  "/about",
  "/contact",
  "/transparency",
  "/privacy-policy",
  "/terms-of-service",
]

async function checkSitemapXml() {
  const label = "sitemap.xml"
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`, { redirect: "follow" })

    if (!res.ok) {
      fail(label, `HTTP ${res.status} — sitemap.xml not reachable`)
      return
    }

    const body = await res.text()

    if (!body.trim()) {
      fail(label, "sitemap.xml is empty")
      return
    }

    // Must be XML
    if (!body.includes("<urlset") && !body.includes("<sitemapindex")) {
      fail(label, "sitemap.xml does not appear to be valid XML sitemap")
      return
    }

    // Must reference canonical host
    if (!body.includes("www.pennycentral.com")) {
      fail(label, "sitemap.xml does not reference canonical host")
      return
    }

    // Check required routes
    const missingRoutes: string[] = []
    for (const route of REQUIRED_ROUTES) {
      const expectedUrl =
        route === "/" ? "https://www.pennycentral.com" : `https://www.pennycentral.com${route}`
      // Check for the URL with or without trailing slash
      if (!body.includes(expectedUrl)) {
        missingRoutes.push(route)
      }
    }

    if (missingRoutes.length > 0) {
      fail(label, `Missing required routes: ${missingRoutes.join(", ")}`)
      return
    }

    // Count total URLs
    const urlCount = (body.match(/<url>/g) || []).length
    pass(label, `OK — ${urlCount} URLs, all required routes present`)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    fail(label, `Fetch failed: ${msg}`)
  }
}

// ---------- Static file checks (no server needed) ----------

import { readFileSync, existsSync } from "node:fs"
import { join } from "node:path"

function checkStaticAdsTxt() {
  const label = "ads.txt (static file)"
  const filePath = join(process.cwd(), "public", "ads.txt")

  if (!existsSync(filePath)) {
    fail(label, "public/ads.txt does not exist")
    return
  }

  const content = readFileSync(filePath, "utf8")

  if (!content.trim()) {
    fail(label, "public/ads.txt is empty")
    return
  }

  const hasEntry = /^[a-z0-9.-]+,\s*\S+,\s*(DIRECT|RESELLER)/im.test(content)
  if (!hasEntry) {
    fail(label, "public/ads.txt has no valid DIRECT/RESELLER entries")
    return
  }

  const lineCount = content.split("\n").filter((l) => l.trim() && !l.startsWith("#")).length
  pass(label, `OK — ${lineCount} non-comment lines in public/ads.txt`)
}

function checkVercelConfig() {
  const label = "vercel.json ads.txt config"
  const filePath = join(process.cwd(), "vercel.json")

  if (!existsSync(filePath)) {
    fail(label, "vercel.json does not exist")
    return
  }

  const config = JSON.parse(readFileSync(filePath, "utf8"))

  // Check for ads.txt headers (no-cache)
  const hasAdsTxtHeader = config.headers?.some((h: { source: string }) => h.source === "/ads.txt")
  if (!hasAdsTxtHeader) {
    fail(label, "vercel.json missing Cache-Control header for /ads.txt")
    return
  }

  pass(label, "OK — vercel.json has /ads.txt headers configured")
}

function checkRobotsSource() {
  const label = "robots.ts source"
  const filePath = join(process.cwd(), "app", "robots.ts")

  if (!existsSync(filePath)) {
    fail(label, "app/robots.ts does not exist")
    return
  }

  const content = readFileSync(filePath, "utf8")

  if (!content.includes("sitemap")) {
    fail(label, "app/robots.ts does not reference sitemap")
    return
  }

  if (!content.includes("www.pennycentral.com")) {
    fail(label, "app/robots.ts does not use canonical host")
    return
  }

  pass(label, "OK — app/robots.ts references sitemap with canonical host")
}

function checkSitemapSource() {
  const label = "sitemap.ts source"
  const filePath = join(process.cwd(), "app", "sitemap.ts")

  if (!existsSync(filePath)) {
    fail(label, "app/sitemap.ts does not exist")
    return
  }

  const content = readFileSync(filePath, "utf8")

  if (!content.includes("www.pennycentral.com")) {
    fail(label, "app/sitemap.ts does not use canonical host")
    return
  }

  // Check that key routes are present in source
  const missingInSource: string[] = []
  for (const route of ["/penny-list", "/guide", "/report-find", "/faq"]) {
    if (!content.includes(route)) {
      missingInSource.push(route)
    }
  }

  if (missingInSource.length > 0) {
    fail(label, `app/sitemap.ts missing routes: ${missingInSource.join(", ")}`)
    return
  }

  pass(label, "OK — app/sitemap.ts uses canonical host and includes key routes")
}

// ---------- Main ----------

async function main() {
  console.log(`\n🔍 Ads-Readiness Check (${isProduction ? "production" : "local"})\n`)

  // Always run static file checks (no server needed)
  checkStaticAdsTxt()
  checkVercelConfig()
  checkRobotsSource()
  checkSitemapSource()

  // Run network checks only if --production flag or if local server is reachable
  let serverAvailable = false
  if (isProduction) {
    serverAvailable = true
  } else {
    try {
      const probe = await fetch(`${LOCAL_HOST}/`, { signal: AbortSignal.timeout(3000) })
      serverAvailable = probe.ok || probe.status === 308 || probe.status === 307
    } catch {
      console.log(
        "  ⚠  Local server not running on port 3001 — skipping network checks.\n" +
          "     Run 'npm run dev' first, or use --production to check live site.\n"
      )
    }
  }

  if (serverAvailable) {
    await checkAdsTxt()
    await checkRobotsTxt()
    await checkSitemapXml()
  }

  // Report
  console.log("─".repeat(60))
  const passed = results.filter((r) => r.passed)
  const failed = results.filter((r) => !r.passed)

  for (const r of results) {
    const icon = r.passed ? "✅" : "❌"
    console.log(`  ${icon}  ${r.name}: ${r.detail}`)
  }

  console.log("─".repeat(60))
  console.log(`  ${passed.length} passed, ${failed.length} failed\n`)

  if (failed.length > 0) {
    process.exit(1)
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err)
  process.exit(1)
})
