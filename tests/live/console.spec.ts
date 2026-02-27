import { test } from "@playwright/test"
import { promises as fs } from "node:fs"
import path from "node:path"

const PAGES = ["/", "/penny-list", "/store-finder", "/guide", "/about", "/support"]
const MONETIZATION_PAGES = new Set(["/", "/guide", "/penny-list"])

test.describe("live site console audit", () => {
  test("captures console, pageerrors and failed requests across key pages and writes a report", async ({
    page,
  }, testInfo) => {
    test.setTimeout(180000)

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
        cspViolations: 0,
        criticalCspViolations: 0,
      },
    }

    // CSP violations blocking these domains are always CRITICAL.
    // These affect core functionality (analytics, database, error tracking).
    const CORE_CRITICAL_CSP_DOMAINS = [
      /google-analytics\.com/i,
      /analytics\.google\.com/i,
      /googletagmanager\.com/i,
      /supabase\.co/i,
      /sentry\.io/i,
      /vercel-scripts\.com/i,
    ]

    // CSP violations for these ad-chain hosts are CRITICAL on monetization pages.
    // This turns previously "informational" monetization blockers into CI blockers.
    const MONETIZATION_CRITICAL_CSP_DOMAINS = [
      /securepubads\.g\.doubleclick\.net/i,
      /pagead2\.googlesyndication\.com/i,
      /tpc\.googlesyndication\.com/i,
      /cm\.g\.doubleclick\.net/i,
      /\.safeframe\.googlesyndication\.com$/i,
      /cdn\.confiant-integrations\.net/i,
      /cdn\.prod\.uidapi\.com/i,
      /id\.a-mx\.com/i,
      /match\.adsrvr\.org/i,
      /prebid\.cootlogix\.com/i,
      /sync\.cootlogix\.com/i,
      /(?:^|\.)a-mo\.net$/i,
      /rtb\.openx\.net/i,
      /(?:^|\.)openx\.net$/i,
      /fastlane\.rubiconproject\.com/i,
      /(?:^|\.)rubiconproject\.com$/i,
      /(?:^|\.)eu-1-id5-sync\.com$/i,
      /static\.criteo\.net/i,
      /gum\.criteo\.com/i,
      /resources\.infolinks\.com/i,
    ]

    // Detect CSP violation messages
    const isCSPViolation = (text: string) =>
      /Content Security Policy|violates the following.*directive/i.test(text)

    // Extract the resource actually blocked by CSP. Some messages include the entire
    // allowlist directive afterward, so scanning every URL in the string can mislabel
    // an allowed host as the blocked target.
    const extractBlockedDomain = (text: string): string | null => {
      const directTarget = text.match(
        /(?:Connecting to|Loading the script|Loading the image|Framing|Refused to connect to|Refused to frame|Refused to load)\s+'([^']+)'/i
      )?.[1]

      if (directTarget) {
        if (/^(data|blob|about):/i.test(directTarget)) return null
        try {
          const host = new URL(directTarget).hostname
          if (host) return host
        } catch {}
      }

      const relevantSegment = text.split(
        /violates the following Content Security Policy directive|because it violates/i
      )[0]
      const urlMatches = Array.from(relevantSegment.matchAll(/https?:\/\/[^\s'")]+/gi))
      for (const match of urlMatches) {
        try {
          const host = new URL(match[0]).hostname
          if (host) return host
        } catch {}
      }
      return null
    }

    // Check if CSP violation blocks a critical service.
    const isCriticalCSPViolation = (blockedDomain: string | null, pagePath: string): boolean => {
      if (!blockedDomain) return false
      if (CORE_CRITICAL_CSP_DOMAINS.some((regex) => regex.test(blockedDomain))) return true
      if (
        MONETIZATION_PAGES.has(pagePath) &&
        MONETIZATION_CRITICAL_CSP_DOMAINS.some((regex) => regex.test(blockedDomain))
      ) {
        return true
      }
      return false
    }

    // Regexes for noisy/known third-party libraries we don't want to treat as site errors
    const THIRD_PARTY_REGEX =
      /(ezoic|id5-sync|g\.ezoic\.net|cdn\.id5-sync\.com|ezintegration|googlesyndication|doubleclick|google-analytics|gtag|sentry|optimizely|akamai|cloudflare|cdnjs|gstatic|googletagmanager)/i
    const IGNORE_MESSAGE_REGEX = [
      /ResizeObserver loop limit exceeded/i,
      /^Script error\.$/i,
      /favicon/i,
      /Error getting location: GeolocationPositionError/i,
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

      // Give deferred scripts a chance to run/respond.
      // Live pages can keep ad/analytics connections open indefinitely,
      // especially on mobile user agents, so this is best-effort only.
      try {
        await page.waitForLoadState("networkidle", { timeout: 10000 })
      } catch {
        // Continue with the fixed settle delay below.
      }
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

        // Detect CSP violations
        const cspViolation = isCSPViolation(text)
        const blockedDomain = cspViolation ? extractBlockedDomain(text) : null
        const criticalCsp = cspViolation && isCriticalCSPViolation(blockedDomain, pagePath)

        // Is this an actionable error for the site team?
        let actionable = false
        if (severity === "error") {
          // CRITICAL: CSP violations blocking analytics/database are site config issues
          if (criticalCsp) {
            actionable = true
          } else if (!isThirdParty) {
            actionable = true
          } else {
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
          pagePath,
          text,
          origin: urlOrigin,
          originHost,
          ignored: isIgnored,
          thirdParty: isThirdParty,
          severity,
          actionable,
          cspViolation,
          criticalCsp,
          blockedDomain,
        }

        pageReport.messages.push(processed)

        if (isIgnored) continue
        report.summary.totalMessages++
        if (processed.severity === "error") report.summary.errors++
        if (processed.severity === "warning") report.summary.warnings++
        if (processed.severity === "info") report.summary.infos++
        if (m.type === "requestfailed") report.summary.requestFailures++
        if (processed.thirdParty) report.summary.thirdParty++
        if (processed.cspViolation) report.summary.cspViolations++
        if (processed.criticalCsp) report.summary.criticalCspViolations++
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
    const allMessages = report.pages.flatMap((p: any) => p.messages)
    const criticalCspErrors = allMessages.filter((m: any) => !m.ignored && m.criticalCsp)
    const siteErrors = allMessages.filter(
      (m: any) => !m.ignored && m.severity === "error" && !m.thirdParty && !m.criticalCsp
    )
    const thirdPartyErrors = allMessages.filter(
      (m: any) => !m.ignored && m.severity === "error" && m.thirdParty && !m.cspViolation
    )
    const otherCspErrors = allMessages.filter(
      (m: any) => !m.ignored && m.cspViolation && !m.criticalCsp
    )

    console.log("Console audit saved to:", reportPath)

    // CRITICAL CSP violations get top billing - these break analytics/DB/monetization chains.
    if (criticalCspErrors.length > 0) {
      console.log(`\n🚨 CRITICAL: Found ${criticalCspErrors.length} blocking CSP violation(s)!`)
      console.log(
        "   These are SITE CONFIG issues in next.config.js CSP (not ignorable third-party noise)."
      )
      console.log("   Blocked domain(s) and page(s):")
      const seenDomainPage = new Set<string>()
      for (const e of criticalCspErrors) {
        if (e.blockedDomain) {
          const key = `${e.blockedDomain}@@${e.pagePath || "unknown"}`
          if (seenDomainPage.has(key)) continue
          seenDomainPage.add(key)
          console.log(`   - ${e.blockedDomain} (page: ${e.pagePath || "unknown"})`)
        }
      }
      console.log(
        "\n   Fix: Add the blocked host(s) to the correct CSP directive in next.config.js"
      )
    }

    if (siteErrors.length > 0) {
      console.log(`\n⚠️ Found ${siteErrors.length} site-origin error(s) that likely need fixing:`)
      for (const e of siteErrors.slice(0, 10)) {
        console.log("-", e.text.slice(0, 100), "(page: ", e.origin || "<inline>", ")")
      }
    }

    if (otherCspErrors.length > 0) {
      console.log(
        `\nℹ️ ${otherCspErrors.length} non-critical CSP violation(s) (third-party ad/tracking scripts).`
      )
    }

    if (thirdPartyErrors.length > 0) {
      console.log(`\nℹ️ ${thirdPartyErrors.length} third-party error(s) (ads/analytics noise).`)
    }

    if (
      criticalCspErrors.length === 0 &&
      siteErrors.length === 0 &&
      otherCspErrors.length === 0 &&
      thirdPartyErrors.length === 0
    ) {
      console.log("\n✅ No actionable console errors found on the checked pages.")
    }

    console.log(`\nFull report: ${reportPath}`)

    if (criticalCspErrors.length > 0) {
      const criticalDomains = Array.from(
        new Set(criticalCspErrors.map((m: any) => m.blockedDomain).filter(Boolean))
      ).join(", ")
      throw new Error(
        `Critical CSP violations detected (${criticalCspErrors.length}). Blocked domain(s): ${criticalDomains}`
      )
    }
  })
})
