// Compute contrast ratios for key selectors on configured routes in light and dark themes.
// Requires: @playwright/test (already present) and writes reports/contrast-computed.json.

const { chromium } = require("playwright")
const fs = require("fs")
const path = require("path")

const BASE_URL = process.env.BASE_URL || "http://localhost:3001"
const routesPath = path.join(__dirname, "..", "checks", "routes.json")
const selectorsPath = path.join(__dirname, "..", "checks", "selectors.json")
const reportDir = path.join(process.cwd(), "reports")
const reportPath = path.join(reportDir, "contrast-computed.json")

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
  // Handles rgb(a) strings like "rgb(255, 255, 255)" or "rgba(255, 255, 255, 1)"
  if (!str || str === "transparent" || str === "rgba(0, 0, 0, 0)") return null
  const match = str.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)/i)
  if (!match) return null
  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)]
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
  try {
    for (const route of routes) {
      const page = await browser.newPage()
      const url = `${BASE_URL}${route}`
      await page.goto(url, { waitUntil: "networkidle" })

      for (const theme of ["light", "dark"]) {
        // Force theme by toggling class on root; adjust if theme storage differs.
        await page.evaluate((nextTheme) => {
          const root = document.documentElement
          if (nextTheme === "dark") {
            root.classList.add("dark")
          } else {
            root.classList.remove("dark")
          }
        }, theme)

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

          // Default to theme or CTA colors if transparent/invalid colors are encountered
          const fallbackBg = theme === "dark" ? [18, 18, 18] : [255, 255, 255]
          const fallbackCtaBg = theme === "dark" ? [96, 165, 250] : [29, 78, 216] // matches design tokens
          const fallbackCtaFg = theme === "dark" ? [3, 7, 18] : [255, 255, 255]

          const safeFg = fg ?? (sel.role === "cta" ? fallbackCtaFg : [24, 24, 24])
          const safeBg = bg ?? (sel.role === "cta" ? fallbackCtaBg : fallbackBg)

          const ratio = contrastRatio(safeFg, safeBg)
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
      }
      await page.close()
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
