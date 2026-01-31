# CONSOLE_AUDIT

## What This Is

A Playwright test (`tests/live/console.spec.ts`) that audits the live production site for console errors, page errors, and failed network requests. It runs against the real site in a clean browser (no extensions/adblockers) to distinguish genuine bugs from browser extension noise.

## When to Run

| Situation                   | Run? | Why                                               |
| --------------------------- | ---- | ------------------------------------------------- |
| After a deploy              | Yes  | Catch regressions, CSP issues, broken scripts     |
| Weekly check-in             | Yes  | Monitor third-party script health                 |
| Debugging production issues | Yes  | Get clean baseline without adblocker interference |
| During local development    | No   | Use browser DevTools instead                      |

## How to Run

```bash
# Target production (default)
PLAYWRIGHT_BASE_URL='https://pennycentral.com' npx playwright test tests/live/console.spec.ts --project=chromium-desktop-light --workers=1

# Or use npm script (runs all e2e including this)
npm run test:e2e -- tests/live/console.spec.ts
```

**Flags explained:**

- `PLAYWRIGHT_BASE_URL` - Targets live site instead of localhost
- `--project=chromium-desktop-light` - Specific browser config
- `--workers=1` - Sequential execution (avoids race conditions)

## Output

Reports are saved to `reports/playwright/console-report-<timestamp>.json`

**Sample summary output:**

```
Console audit saved to: reports/playwright/console-report-2026-01-29T09-56-04-716Z.json

✅ No actionable console errors found on the checked pages.
```

**Or if issues found:**

```
🚨 CRITICAL: Found 2 CSP violation(s) blocking essential services!
   Blocked domains:
   - analytics.google.com
   Fix: Add these domains to connect-src in next.config.js

⚠️ Found 1 site-origin error(s) that likely need fixing:
- User denied Geolocation (page: /store-finder)
```

## Understanding the Report

The test classifies each message:

| Field          | Meaning                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `severity`     | `error`, `warning`, or `info`                                                  |
| `thirdParty`   | `true` if from external scripts (Ezoic, Mediavine, etc.)                       |
| `actionable`   | `true` if it's something we should fix                                         |
| `cspViolation` | `true` if Content Security Policy blocked something                            |
| `criticalCsp`  | `true` if CSP blocked our own essential services (analytics, Supabase, Sentry) |

**Priority triage:**

1. **Critical CSP violations** - Fix immediately (blocking our own infrastructure)
2. **Site-origin errors** - Fix when time allows (our code is broken)
3. **Third-party errors** - Usually ignore (their problem, not ours)

## Pages Tested

The test covers key user flows:

- `/` - Homepage
- `/store-finder` - Geolocation feature
- `/guide` - Content page
- `/trip-tracker` - Interactive feature
- `/resources` - Resource links
- `/about` - Static page
- `/cashback` - Affiliate content

## CSP Critical Domains

The test flags CSP violations against these domains as **CRITICAL** (our infrastructure):

- `google-analytics.com` / `analytics.google.com`
- `googletagmanager.com`
- `supabase.co`
- `sentry.io`
- `vercel-scripts.com`

If these are blocked, it's a site config issue in `next.config.js`, not third-party noise.

---

## Quick Reference

**Run it:** `PLAYWRIGHT_BASE_URL='https://pennycentral.com' npx playwright test tests/live/console.spec.ts --project=chromium-desktop-light --workers=1`

**Find reports:** `reports/playwright/console-report-*.json`

**Fix CSP issues:** Edit `connect-src` in `next.config.js`
