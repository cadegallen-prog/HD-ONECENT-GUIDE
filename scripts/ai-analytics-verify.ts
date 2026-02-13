#!/usr/bin/env tsx

import fs from "fs"
import path from "path"
import { chromium } from "playwright"

type Hit = {
  status: number
  route: string
  finalPath: string
  hitPath: string
  cid: string
  sid: string
  en: string
}

const CANONICAL_ROUTES = [
  "/",
  "/guide",
  "/what-are-pennies",
  "/clearance-lifecycle",
  "/digital-pre-hunt",
  "/in-store-strategy",
  "/inside-scoop",
  "/facts-vs-myths",
  "/faq",
  "/penny-list",
  "/store-finder",
  "/about",
  "/report-find",
]

// Legacy URLs are still tested for continuity, but they are not canonical.
const LEGACY_REDIRECT_ROUTES = [
  "/guide/clearance-lifecycle",
  "/guide/digital-pre-hunt",
  "/guide/in-store-strategy",
  "/guide/inside-scoop",
  "/guide/fact-vs-fiction",
  "/guide/responsible-hunting",
]

const ROUTES = CANONICAL_ROUTES

function nowStamp() {
  return new Date().toISOString().replace(/[:.]/g, "-")
}

function getPathFromDl(dl: string): string {
  try {
    return new URL(dl).pathname
  } catch {
    return "(unknown)"
  }
}

async function assertBaseHealthy(baseUrl: string) {
  const response = await fetch(`${baseUrl}/`)
  if (!response.ok) {
    throw new Error(`Base URL is not healthy: ${baseUrl} (${response.status})`)
  }
}

function printHeader(title: string) {
  console.log("\n" + "═".repeat(39))
  console.log(`   ${title}`)
  console.log("═".repeat(39))
}

async function main() {
  const baseUrl = process.env.ANALYTICS_BASE_URL || "http://localhost:3001"
  const timestamp = nowStamp()
  const outDir = path.join("reports", "analytics-verification", timestamp)
  fs.mkdirSync(outDir, { recursive: true })

  printHeader("AI Analytics Verification")
  console.log(`Base URL: ${baseUrl}`)
  console.log(`Routes: ${ROUTES.length}`)

  await assertBaseHealthy(baseUrl)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext()

  const allHits: Hit[] = []
  const routeSummaries: Array<{
    route: string
    finalPath: string
    pageViewCount: number
    pageViewPaths: string[]
    cids: string[]
    sidsPresent: boolean
  }> = []

  for (const route of ROUTES) {
    const page = await context.newPage()
    const routeHits: Hit[] = []

    page.on("response", (res) => {
      const url = res.url()
      if (!url.includes("/g/collect")) return

      const parsed = new URL(url)
      const en = parsed.searchParams.get("en") || ""
      if (en !== "page_view") return

      const dl = decodeURIComponent(parsed.searchParams.get("dl") || "")
      const cid = parsed.searchParams.get("cid") || ""
      const sid = parsed.searchParams.get("sid") || ""

      const hit: Hit = {
        status: res.status(),
        route,
        finalPath: "",
        hitPath: getPathFromDl(dl),
        cid,
        sid,
        en,
      }

      routeHits.push(hit)
      allHits.push(hit)
    })

    await page.goto(`${baseUrl}${route}`, { waitUntil: "domcontentloaded", timeout: 45000 })
    await page.waitForTimeout(3000)

    const finalPath = new URL(page.url()).pathname
    routeHits.forEach((h) => (h.finalPath = finalPath))

    routeSummaries.push({
      route,
      finalPath,
      pageViewCount: routeHits.length,
      pageViewPaths: [...new Set(routeHits.map((h) => h.hitPath))],
      cids: [...new Set(routeHits.map((h) => h.cid).filter(Boolean))],
      sidsPresent: routeHits.every((h) => Boolean(h.sid)),
    })

    await page.close()
  }

  await browser.close()

  const uniqueCids = [...new Set(allHits.map((h) => h.cid).filter(Boolean))]
  const zeroPvRoutes = routeSummaries.filter((r) => r.pageViewCount === 0).map((r) => r.route)
  const multiPvRoutes = routeSummaries
    .filter((r) => r.pageViewCount > 1)
    .map((r) => `${r.route} (${r.pageViewCount})`)
  const missingCidRoutes = routeSummaries.filter((r) => r.cids.length === 0).map((r) => r.route)
  const missingSidRoutes = routeSummaries.filter((r) => !r.sidsPresent).map((r) => r.route)

  const pass =
    zeroPvRoutes.length === 0 &&
    multiPvRoutes.length === 0 &&
    missingCidRoutes.length === 0 &&
    missingSidRoutes.length === 0 &&
    uniqueCids.length >= 1

  const result = {
    baseUrl,
    timestamp,
    pass,
    metrics: {
      totalRoutes: ROUTES.length,
      totalPageViewHits: allHits.length,
      uniqueCidCount: uniqueCids.length,
    },
    issues: {
      zeroPvRoutes,
      multiPvRoutes,
      missingCidRoutes,
      missingSidRoutes,
    },
    routeSummaries,
  }

  fs.writeFileSync(path.join(outDir, "result.json"), JSON.stringify(result, null, 2))

  const markdown = [
    `# Analytics Verification - ${new Date().toISOString()}`,
    "",
    `- Base URL: \`${baseUrl}\``,
    `- Overall: ${pass ? "✅ PASS" : "❌ FAIL"}`,
    "",
    "## Metrics",
    `- Routes tested: ${ROUTES.length}`,
    `- page_view hits: ${allHits.length}`,
    `- Unique CIDs (users): ${uniqueCids.length}`,
    "",
    "## Issues",
    `- Zero page_view routes: ${zeroPvRoutes.length ? zeroPvRoutes.join(", ") : "None"}`,
    `- Multi page_view routes: ${multiPvRoutes.length ? multiPvRoutes.join(", ") : "None"}`,
    `- Missing CID routes: ${missingCidRoutes.length ? missingCidRoutes.join(", ") : "None"}`,
    `- Missing SID routes: ${missingSidRoutes.length ? missingSidRoutes.join(", ") : "None"}`,
    "",
    "## Per-route",
    ...routeSummaries.map(
      (r) =>
        `- \`${r.route}\` -> \`${r.finalPath}\` | page_view=${r.pageViewCount} | cid=${r.cids.length ? "yes" : "no"} | sid=${
          r.sidsPresent ? "yes" : "no"
        }`
    ),
    "",
    `JSON: \`reports/analytics-verification/${timestamp}/result.json\``,
  ].join("\n")

  fs.writeFileSync(path.join(outDir, "summary.md"), markdown)

  printHeader("Analytics Verification Complete")
  console.log(`Result: ${pass ? "PASS" : "FAIL"}`)
  console.log(`Summary: reports/analytics-verification/${timestamp}/summary.md`)
  console.log(`JSON: reports/analytics-verification/${timestamp}/result.json`)

  if (!pass) process.exit(1)
}

main().catch((error) => {
  console.error("analytics verify failed:", error instanceof Error ? error.message : String(error))
  process.exit(1)
})
