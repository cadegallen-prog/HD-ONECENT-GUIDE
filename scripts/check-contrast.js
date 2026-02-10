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

const tokenChecks = [
  {
    name: "token-text-primary-on-bg-page",
    fg: "--text-primary",
    bg: "--bg-page",
    threshold: 7.0,
    role: "text",
  },
  {
    name: "token-text-secondary-on-bg-page",
    fg: "--text-secondary",
    bg: "--bg-page",
    threshold: 7.0,
    role: "text",
  },
  {
    name: "token-text-muted-on-bg-page",
    fg: "--text-muted",
    bg: "--bg-page",
    threshold: 7.0,
    role: "text",
  },
  {
    name: "token-text-secondary-on-bg-card",
    fg: "--text-secondary",
    bg: "--bg-card",
    threshold: 7.0,
    role: "text",
  },
  {
    name: "token-text-muted-on-bg-card",
    fg: "--text-muted",
    bg: "--bg-card",
    threshold: 7.0,
    role: "text",
  },
  {
    name: "token-text-placeholder-on-bg-recessed",
    fg: "--text-placeholder",
    bg: "--bg-recessed",
    threshold: 7.0,
    role: "text",
  },
  {
    name: "token-cta-text-on-cta-primary",
    fg: "--cta-text",
    bg: "--cta-primary",
    threshold: 7.0,
    role: "cta",
  },
  {
    name: "token-border-default-on-bg-page",
    fg: "--border-default",
    bg: "--bg-page",
    threshold: 3.0,
    role: "border",
  },
  {
    name: "token-border-default-on-bg-card",
    fg: "--border-default",
    bg: "--bg-card",
    threshold: 3.0,
    role: "border",
  },
  {
    name: "token-border-strong-on-bg-page",
    fg: "--border-strong",
    bg: "--bg-page",
    threshold: 3.0,
    role: "border",
  },
  {
    name: "token-border-strong-on-bg-card",
    fg: "--border-strong",
    bg: "--bg-card",
    threshold: 3.0,
    role: "border",
  },
]

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

function parseCssColor(str) {
  return parseHexColor(str) ?? parseColor(str)
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
  const tokenChecksDone = new Set()
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
        await page.waitForFunction(
          () => {
            const style = getComputedStyle(document.documentElement)
            return (
              style.getPropertyValue("--bg-page").trim().length > 0 &&
              style.getPropertyValue("--cta-primary").trim().length > 0 &&
              style.getPropertyValue("--cta-text").trim().length > 0
            )
          },
          { timeout: 5000 }
        )

        const tokenVars = Array.from(new Set(tokenChecks.flatMap((check) => [check.fg, check.bg])))
        const tokens = await page.evaluate((vars) => {
          const style = getComputedStyle(document.documentElement)
          const values = {}
          for (const varName of vars) {
            values[varName] = style.getPropertyValue(varName).trim()
          }
          return values
        }, tokenVars)

        const tokenBg =
          parseCssColor(tokens["--bg-page"]) ?? (theme === "dark" ? [18, 18, 18] : [255, 255, 255])
        const tokenTextPrimary =
          parseCssColor(tokens["--text-primary"]) ??
          (theme === "dark" ? [224, 224, 224] : [28, 25, 23])
        const tokenBorderDefault =
          parseCssColor(tokens["--border-default"]) ??
          (theme === "dark" ? [84, 110, 122] : [117, 117, 117])

        if (!tokenChecksDone.has(theme)) {
          for (const tokenCheck of tokenChecks) {
            const fg = parseCssColor(tokens[tokenCheck.fg])
            const bg = parseCssColor(tokens[tokenCheck.bg])
            const valid = Boolean(fg && bg)
            const ratio = valid ? contrastRatio(fg, bg) : 0

            results.push({
              route: "__tokens__",
              theme,
              name: tokenCheck.name,
              selector: `${tokenCheck.fg} on ${tokenCheck.bg}`,
              role: tokenCheck.role,
              found: valid,
              ratio: Number(ratio.toFixed(2)),
              threshold: tokenCheck.threshold,
              pass: valid && ratio >= tokenCheck.threshold,
              note: valid ? undefined : "unable to parse token color",
            })
          }
          tokenChecksDone.add(theme)
        }

        for (const sel of selectors) {
          if (Array.isArray(sel.routes) && !sel.routes.includes(route)) {
            continue
          }

          const styles = await getStyles(page, sel.selector)
          if (!styles) {
            const optional = sel.optional === true
            results.push({
              route,
              theme,
              name: sel.name,
              selector: sel.selector,
              role: sel.role,
              found: false,
              ratio: 0,
              threshold: typeof sel.threshold === "number" ? sel.threshold : undefined,
              pass: optional,
              note: optional ? "optional selector not found" : "required selector not found",
            })
            continue
          }

          const fgSource = sel.role === "border" ? styles.borderColor : styles.color
          const bgSource = styles.backgroundColor
          const fg = parseColor(fgSource)
          const bg = parseColor(bgSource)

          // Default to token colors if transparent/invalid colors are encountered.
          const safeFg = fg ?? (sel.role === "border" ? tokenBorderDefault : tokenTextPrimary)
          const safeBg = bg ?? tokenBg

          const ratio = contrastRatio(safeFg, safeBg)
          const threshold =
            typeof sel.threshold === "number" ? sel.threshold : sel.role === "border" ? 3.0 : 7.0
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
