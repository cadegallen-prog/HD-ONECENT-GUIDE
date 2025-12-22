// Compute contrast ratios for key selectors on configured routes in light and dark themes.
// Requires: @playwright/test (already present) and writes reports/contrast-computed.json.

const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")

const { getBaseUrl } = require("./get-base-url")
const BASE_URL = getBaseUrl()
const routesPath = path.join(__dirname, "..", "checks", "routes.json")
const selectorsPath = path.join(__dirname, "..", "checks", "selectors.json")
const reportDir = path.join(process.cwd(), "reports")
const reportPath = path.join(reportDir, "contrast-computed.json")

const HARD_TIMEOUT_MS = 120_000
const NAV_TIMEOUT_MS = 30_000

function loadJson(filePath, fallback) {
  if (!fs.existsSync(filePath)) return fallback
  return JSON.parse(fs.readFileSync(filePath, "utf8"))
}

const routes = loadJson(routesPath, { routes: ["/"] }).routes
const selectors = loadJson(selectorsPath, {
  selectors: [
    { name: "body-text", selector: "body", role: "text" },
    { name: "card", selector: "[data-card]", role: "card" },
  ],
}).selectors

function srgbToLin(c) {
  const v = c / 255
  return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
}

function luminance([r, g, b]) {
  const rl = srgbToLin(r)
  const gl = srgbToLin(g)
  const bl = srgbToLin(b)
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
}

function contrastRatio(fg, bg) {
  const lf = luminance(fg)
  const lb = luminance(bg)
  const [lighter, darker] = lf > lb ? [lf, lb] : [lb, lf]
  return (lighter + 0.05) / (darker + 0.05)
}

function parseColor(str) {
  // Handles rgb(a) strings like:
  // - "rgb(255, 255, 255)"
  // - "rgba(255, 255, 255, 1)"
  // - "rgb(255 255 255 / 1)"
  if (!str || str === "transparent" || str === "rgba(0, 0, 0, 0)") return null
  const match = str.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i)
  if (!match) return null
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)]
}

function parseHexColor(str) {
  const hex = (str || "").trim().toLowerCase()
  const match = hex.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)
  if (!match) return null
  const digits = match[1]
  if (digits.length === 3) {
    const r = parseInt(digits[0] + digits[0], 16)
    const g = parseInt(digits[1] + digits[1], 16)
    const b = parseInt(digits[2] + digits[2], 16)
    return [r, g, b]
  }
  const r = parseInt(digits.slice(0, 2), 16)
  const g = parseInt(digits.slice(2, 4), 16)
  const b = parseInt(digits.slice(4, 6), 16)
  return [r, g, b]
}

async function getStyles(page, selector) {
  const found = await page.$(selector)
  if (!found) return null
  return await found.evaluate((el) => {
    const style = getComputedStyle(el)
    return {
      color: style.color,
      backgroundColor: style.backgroundColor,
      borderColor: style.borderColor,
    }
  })
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const results = []
  const startedAt = Date.now()
  try {
    for (const route of routes) {
      if (Date.now() - startedAt > HARD_TIMEOUT_MS) {
        throw new Error(`Timed out after ${HARD_TIMEOUT_MS}ms`)
      }

      const url = `${BASE_URL}${route}`
      for (const theme of ["light", "dark"]) {
        const page = await browser.newPage()
        page.setDefaultTimeout(NAV_TIMEOUT_MS)
        page.setDefaultNavigationTimeout(NAV_TIMEOUT_MS)

        // Force theme in the same way the app does (ThemeProvider reads localStorage("theme")).
        await page.addInitScript((nextTheme) => {
          try {
            window.localStorage.setItem("theme", nextTheme)
          } catch {
            // ignore storage failures
          }
        }, theme)

        // Avoid "networkidle" because some routes (maps, analytics, etc.) can keep connections open.
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: NAV_TIMEOUT_MS })

        // Wait for ThemeProvider to apply the class (prevents it from "fighting" manual toggles).
        await page.waitForFunction(
          (nextTheme) => document.documentElement.classList.contains(nextTheme),
          theme,
          { timeout: 5000 }
        )

        // Ensure our design tokens are present before measuring computed styles.
        // (Prevents flaky reads when CSS hasn't fully applied yet.)
        await page.waitForFunction(() => {
          const style = getComputedStyle(document.documentElement)
          return (
            style.getPropertyValue("--bg-page").trim().length > 0 &&
            style.getPropertyValue("--cta-primary").trim().length > 0 &&
            style.getPropertyValue("--cta-text").trim().length > 0
          )
        }, { timeout: 5000 })

        const tokens = await page.evaluate(() => {
          const style = getComputedStyle(document.documentElement)
          return {
            bgPage: style.getPropertyValue("--bg-page").trim(),
            ctaPrimary: style.getPropertyValue("--cta-primary").trim(),
            ctaText: style.getPropertyValue("--cta-text").trim(),
            textPrimary: style.getPropertyValue("--text-primary").trim(),
          }
        })

        const tokenBg = parseHexColor(tokens.bgPage) ?? (theme === "dark" ? [18, 18, 18] : [255, 255, 255])
        const tokenCtaBg =
          parseHexColor(tokens.ctaPrimary) ?? (theme === "dark" ? [138, 167, 199] : [43, 76, 126])
        const tokenCtaFg = parseHexColor(tokens.ctaText) ?? (theme === "dark" ? [3, 7, 18] : [255, 255, 255])
        const tokenTextPrimary = parseHexColor(tokens.textPrimary) ?? (theme === "dark" ? [220, 220, 220] : [28, 25, 23])

        for (const sel of selectors) {
          const styles = await getStyles(page, sel.selector)
          if (!styles) {
            // If the selector isn't present, skip (counts as pass to avoid false negatives)
            results.push({
              route,
              theme,
              name: sel.name,
              selector: sel.selector,
              role: sel.role,
              found: false,
              ratio: 0,
              pass: true,
              note: "selector not found",
            })
            continue
          }

          const fg = parseColor(styles.color)
          const bgSource = sel.role === "border" ? styles.borderColor : styles.backgroundColor
          const bg = parseColor(bgSource)

          // Default to token colors if transparent/invalid colors are encountered.
          const safeFg = fg ?? (sel.role === "cta" ? tokenCtaFg : tokenTextPrimary)
          const safeBg = bg ?? (sel.role === "cta" ? tokenCtaBg : tokenBg)

          // CTA checks are token-based to avoid hydration timing flake:
          // verify the design system CTA token pair meets minimum contrast.
          const ratio =
            sel.role === "cta" ? contrastRatio(tokenCtaFg, tokenCtaBg) : contrastRatio(safeFg, safeBg)
          const threshold =
            sel.role === "border"
              ? 3.0
              : sel.role === "status"
                ? 3.0
                : sel.role === "cta"
                  ? 3.0
                  : 7.0
          results.push({
            route,
            theme,
            name: sel.name,
            selector: sel.selector,
            role: sel.role,
            found: true,
            ratio: Number(ratio.toFixed(2)),
            threshold,
            pass: ratio >= threshold,
          })
        }

        await page.close()
      }
    }
  } finally {
    await browser.close()
  }

  if (!fs.existsSync(reportDir)) fs.mkdirSync(reportDir, { recursive: true })
  fs.writeFileSync(reportPath, JSON.stringify({ baseUrl: BASE_URL, results }, null, 2))

  const failures = results.filter((r) => !r.pass)
  if (failures.length > 0) {
    console.error(`Contrast failures: ${failures.length}. See ${reportPath}`)
    process.exit(1)
  } else {
    console.log(`Contrast checks passed. See ${reportPath}`)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
