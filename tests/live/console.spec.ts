import { test } from "@playwright/test"
import { promises as fs } from "node:fs"
import path from "node:path"

const PAGES = ["/", "/store-finder", "/guide", "/trip-tracker", "/resources", "/about", "/cashback"]

test.describe("live site console audit", () => {
  test("captures console, pageerrors and failed requests across key pages and writes a report", async ({
    page,
  }, testInfo) => {
    const base = process.env.PLAYWRIGHT_BASE_URL || "https://pennycentral.com"
    const ts = new Date().toISOString().replace(/[:.]/g, "-")
    const report: any = {
      base,
      testedAt: new Date().toISOString(),
      pages: [],
      summary: {
        totalMessages: 0,
        errors: 0,
        warnings: 0,
        infos: 0,
        requestFailures: 0,
        thirdParty: 0,
      },
    }

    // Regexes for noisy/known third-party libraries we don't want to treat as site errors
    const THIRD_PARTY_REGEX =
      /(ezoic|id5-sync|g\.ezoic\.net|cdn\.id5-sync\.com|ezintegration|googlesyndication|doubleclick|google-analytics|gtag|sentry|optimizely|akamai|cloudflare|cdnjs|gstatic|googletagmanager)/i
    const IGNORE_MESSAGE_REGEX = [
      /ResizeObserver loop limit exceeded/i,
      /^Script error\.$/i,
      /favicon/i,
    ]

    const baseHostname = (() => {
      try {
        return new URL(base).hostname
      } catch {
        return ""
      }
    })()
    const rootDomain = baseHostname.split(".").slice(-2).join(".")

    for (const pagePath of PAGES) {
      const url = new URL(pagePath, base).toString()
      const pageReport: any = { path: pagePath, url, messages: [] }
      const messages: any[] = []

      const onConsole = (msg: any) => {
        try {
          const loc = msg.location ? msg.location() : undefined
          messages.push({
            type: msg.type(),
            text: msg.text(),
            location: loc || undefined,
            timestamp: new Date().toISOString(),
          })
        } catch (e) {
          messages.push({ type: "console", text: String(msg), timestamp: new Date().toISOString() })
        }
      }

      page.on("console", onConsole)

      page.on("pageerror", (err) => {
        messages.push({
          type: "pageerror",
          text: err?.message || String(err),
          stack: err?.stack,
          timestamp: new Date().toISOString(),
        })
      })

      page.on("requestfailed", (req) => {
        messages.push({
          type: "requestfailed",
          url: req.url(),
          method: req.method(),
          failureText: req.failure()?.errorText || null,
          timestamp: new Date().toISOString(),
        })
      })

      await page.goto(url, { waitUntil: "load", timeout: 120000 })

      // give deferred scripts a chance to run/respond
      await page.waitForLoadState("networkidle")
      // small scroll to trigger lazy load
      await page.evaluate(() => {
        try {
          window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" })
        } catch {}
      })
      await page.waitForTimeout(2000)

      // stop listening for further events on this page
      page.off("console", onConsole)

      // classify messages
      for (const m of messages) {
        const text = String(m.text || "")
        const urlOrigin = m.location?.url || m.url || undefined
        const isIgnored = IGNORE_MESSAGE_REGEX.some((r) => r.test(text))

        // Prefer parsing the hostname (avoids query-string false-positives like GA collect with dl=...)
        let originHost: string | undefined = undefined
        if (urlOrigin) {
          try {
            originHost = new URL(String(urlOrigin)).hostname
          } catch {}
        }

        let isThirdParty = false
        if (originHost) {
          // If message text references known third-party vendors (CSP messages include vendor hosts),
          // treat it as third-party even if the recorded location is a site script.
          isThirdParty =
            THIRD_PARTY_REGEX.test(originHost) ||
            THIRD_PARTY_REGEX.test(text) ||
            !originHost.endsWith(rootDomain)
        } else {
          isThirdParty =
            THIRD_PARTY_REGEX.test(text) ||
            (urlOrigin ? !String(urlOrigin).includes(rootDomain) : true)
        }

        // Extra safety: if text mentions known vendors (e.g. Ezoic) mark as third-party even if originHost matched site.
        if (!isThirdParty && THIRD_PARTY_REGEX.test(text)) {
          isThirdParty = true
        }

        // Also detect explicit URLs inside messages (CSP errors list full hostnames) and treat non-site hosts as third-party.
        if (!isThirdParty) {
          const urlMatch = String(text).match(/https?:\/\/[^\s'")]+/i)
          if (urlMatch) {
            try {
              const refHost = new URL(urlMatch[0]).hostname
              if (!refHost.endsWith(rootDomain)) isThirdParty = true
            } catch {}
          }
        }

        let severity: "info" | "warning" | "error" = "info"
        if (m.type === "warning") severity = "warning"
        if (m.type === "error" || m.type === "pageerror" || m.type === "requestfailed")
          severity = "error"

        // Treat aborted internal requests (prefetch/navigation) as non-actionable info to reduce noise
        if (
          m.type === "requestfailed" &&
          String(m.failureText || "")
            .toUpperCase()
            .includes("ERR_ABORTED") &&
          originHost &&
          originHost.endsWith(rootDomain)
        ) {
          severity = "info"
        }

        // Is this an actionable error for the site team?
        let actionable = false
        if (severity === "error") {
          if (!isThirdParty) actionable = true
          else {
            // Some third-party failures (e.g., infinite recursion in consent scripts) do affect user experience
            const likelyBrokenThirdParty =
              /Maximum call stack size exceeded|_ezaq is not defined|bad response|Monetization not allowed for site/i
            if (m.type === "pageerror" || likelyBrokenThirdParty.test(text || m.stack || "")) {
              actionable = true
            }
          }
        }

        const processed = {
          ...m,
          text,
          origin: urlOrigin,
          originHost,
          ignored: isIgnored,
          thirdParty: isThirdParty,
          severity,
          actionable,
        }

        pageReport.messages.push(processed)

        if (isIgnored) continue
        report.summary.totalMessages++
        if (processed.severity === "error") report.summary.errors++
        if (processed.severity === "warning") report.summary.warnings++
        if (processed.severity === "info") report.summary.infos++
        if (m.type === "requestfailed") report.summary.requestFailures++
        if (processed.thirdParty) report.summary.thirdParty++
      }

      report.pages.push(pageReport)
    }

    const reportsDir = path.join(process.cwd(), "reports", "playwright")
    await fs.mkdir(reportsDir, { recursive: true })
    const reportPath = path.join(reportsDir, `console-report-${ts}.json`)
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), "utf8")

    // Attach the report to the test for easy retrieval in Playwright HTML report
    await testInfo.attach("console-report.json", {
      path: reportPath,
      contentType: "application/json",
    })

    // Build human-friendly verdict
    const siteErrors = report.pages
      .flatMap((p: any) => p.messages)
      .filter((m: any) => !m.ignored && m.severity === "error" && !m.thirdParty)
    const thirdPartyErrors = report.pages
      .flatMap((p: any) => p.messages)
      .filter((m: any) => !m.ignored && m.severity === "error" && m.thirdParty)

    console.log("Console audit saved to:", reportPath)
    if (siteErrors.length > 0) {
      console.log(`\n⚠️ Found ${siteErrors.length} site-origin error(s) that likely need fixing:`)
      for (const e of siteErrors.slice(0, 10)) {
        console.log("-", e.text, "(page: ", e.origin || "<inline>", ")")
      }
      console.log(`\nFull report: ${reportPath}`)
    } else if (thirdPartyErrors.length > 0) {
      console.log(
        `\nℹ️ No site-origin errors, but ${thirdPartyErrors.length} third-party error(s) were observed (ads/analytics).`
      )
      console.log("Tip: If these are noisy, add them to the third-party filter in the test.")
      console.log(`\nFull report: ${reportPath}`)
    } else {
      console.log("\n✅ No actionable console errors found on the checked pages.")
      console.log(`\nFull report: ${reportPath}`)
    }
  })
})
