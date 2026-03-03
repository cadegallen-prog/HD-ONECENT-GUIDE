# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-03 - Codex - Report Find Basket Submit Hotfix

**Goal:** Restore the `/report-find` basket flow so multi-item baskets submit again and stop the blank draft `Item Name` field from blocking `Submit all`.

**Status:** ✅ Completed

### Changes

- `lib/constants.ts`
  - added `REPORT_FIND_BASKET_ITEM_LIMIT = 30` as the shared basket-size source of truth.
- `app/api/submit-find/route.ts`
  - aligned the batch submit cap to the shared 30-item basket limit.
  - added a clear oversized-basket error message instead of the generic schema failure text.
- `components/report-find/ReportFindFormClient.tsx`
  - removed the draft `Item Name` field from native submit validation so a filled basket no longer gets blocked by an empty draft row.
  - enforced the same 30-item limit on manual adds and prefilled basket adds.
  - added visible basket-limit copy so the cap is not hidden from users.
- `tests/report-find-batch.spec.ts`
  - kept the mixed-result batch-submit coverage.
  - added a regression test that restores a 16-item basket from session storage and verifies submit still works while the draft item fields are blank.
- `tests/submit-find-route.test.ts`
  - updated the oversized-batch route test to use the shared 30-item limit and assert the new user-facing error message.

### Summary

- Root cause 1: the browser was validating the empty draft `Item Name` input on form submit even when the basket was already populated, so `Submit all` got blocked before the request fired.
- Root cause 2: the API only accepted 10 basket items while the UI allowed more, so a 16-item basket failed with the same generic error for every item.
- The basket submit path now accepts up to 30 items in one request, the draft field no longer blocks batch submit, and oversized baskets now fail with a specific message instead of a misleading required-fields error.

### Verification

- Before fix reproduction:
  - `npx playwright test tests/report-find-batch.spec.ts --project=chromium-desktop-light --workers=1` ❌
  - failure signature: the batch-submit UI test never reached the success summary because `Submit all` was blocked by the empty draft `Item Name` field.
- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `npx tsx --import ./tests/setup.ts --test --test-name-pattern "batch submit rejects more than max allowed items" tests/submit-find-route.test.ts` ✅
- `$env:SUBMIT_FIND_DRY_RUN='false'; npx tsx --import ./tests/setup.ts --test --test-name-pattern "batch submit supports partial success in one request" tests/submit-find-route.test.ts` ✅
- `$env:NEXT_DIST_DIR='.next-playwright'; $env:PLAYWRIGHT='1'; $env:NEXT_PUBLIC_EZOIC_ENABLED='false'; $env:NEXT_PUBLIC_ANALYTICS_ENABLED='false'; npx playwright test tests/report-find-batch.spec.ts --project=chromium-desktop-light --workers=1` ✅
- Playwright proof screenshots captured via temporary local proof spec (removed after capture):
  - artifacts: `reports/proof/2026-03-03T06-00-57-440Z/`
  - console: `reports/proof/2026-03-03T06-00-57-440Z/console-errors.txt`

### Branch Hygiene

- Branch: `dev`
- Scope: report-find basket submit hotfix + regression coverage
- Push: not pushed

---
## 2026-02-26 - Codex - GA4 Daily Events KeyEvents Enhancement + Release Hygiene

**Goal:** Complete requested carryover hygiene and implement the analytics change so conversion/key-event gaps are visible in standard archive runs.

**Status:** ✅ Completed

### Changes

- scripts/archive-google-analytics.ts
  - ga4/daily_events now exports ventCount + keyEvents (GA4 conversion metric) in default archive runs.
  - additive GA4 totals now include keyEvents and conversions when present.
- .ai/topics/ANALYTICS_CONTRACT.md
  - updated archive contract to require keyEvents in daily_events output.
- .ai/ANALYTICS_WEEKLY_REVIEW.md
  - updated weekly review guidance to read key-event/conversion counts from daily_events.
- Local hygiene cleanup:
  - removed stale .ai/tmp-\*.log scratch files.
  - normalized .ai/LEARNINGS.md with a new anti-pattern entry: do not parallelize build-dependent verification gates.

### Verification

- pm run analytics:archive -- -- --start-date=2026-02-24 --end-date=2026-02-25 --skip-gsc ✅
  - artifact: .local/analytics-history/runs/2026-02-26T04-59-02-718Z/ga4/daily_events.csv
  - confirmed header: date,eventName,eventCount,keyEvents
- pm run ai:memory:check ✅
- pm run verify:fast ✅
- pm run e2e:smoke ✅

### Branch Hygiene

- Branch: dev
- Push status: pending in this session (implementation complete, commit/push next)

---## 2026-02-26 - Codex - Full QA CSP Blocker Gate + Production CSP Allowlist Fixes

**Goal:** Make monetization-impacting CSP violations fail in FULL QA (instead of warning-only) and clear the newly surfaced production blocker host.

**Status:** ✅ Completed

### Changes

- `tests/live/console.spec.ts`
  - expanded audited routes to include `/penny-list`.
  - added monetization-critical CSP host matching for `/`, `/guide`, `/penny-list`.
  - improved blocked-host extraction from CSP messages (URL scanning, not connect-only format).
  - converted critical CSP findings into hard test failure (`throw new Error(...)`).
  - ignored geolocation console noise (`Error getting location: GeolocationPositionError`) to reduce false actionable logs.
- `next.config.js`
  - added ad-chain domains:
    - `script-src`: `https://router.infolinks.com`
    - `connect-src`: `https://*.a-mo.net`
    - `frame-src`: `https://*.a-mo.net`, `https://router.infolinks.com`

### Verification

- Local:
  - `npm run ai:memory:check` ✅
  - `$env:SUBMIT_FIND_DRY_RUN='false'; npm run verify:fast` ✅
  - `npm run e2e:smoke` ✅
- Production CSP header:
  - `curl -I https://www.pennycentral.com | rg -i \"content-security-policy|a-mo\\.net|router\\.infolinks\\.com\"` ✅
- Production live console audit (post-deploy):
  - `$env:PLAYWRIGHT_BASE_URL='https://www.pennycentral.com'; npx playwright test tests/live/console.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
  - reports:
    - `reports/playwright/console-report-2026-02-26T03-24-51-904Z.json`
    - `reports/playwright/console-report-2026-02-26T03-25-35-238Z.json`
  - outcome: zero critical CSP blockers; only non-critical third-party CSP noise.
- CI on `main` SHA `679f982b0ebe51bfade5b054317d013314af9d74`:
  - FAST: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22426323091` ✅
  - SMOKE: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22426323090` ✅
  - FULL: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22426323100` ✅

### Branch / Promotion

- Runtime commit on `dev`: `fc2e22c` (`fix(csp): enforce monetization CSP blockers in full QA and allow a-mo sync frames`)
- Promoted to `main` via merge commit:
  - `679f982` (`Merge dev: enforce monetization CSP blockers + expand ad-chain CSP allowlist`)
- Promotion method used to avoid dirty local `.ai` carryover conflicts:
  - temporary worktree on `main`, merge `origin/dev`, push `main`, then remove worktree.
- Local branch at closeout: `dev`
- Local carryover note: `.ai/STATE.md`, `.ai/SESSION_LOG.md`, and `.ai/tmp-*.log` remain dirty/untracked in local workspace from prior/diagnostic activity.

---

## 2026-02-25 - Codex - GA4 + GSC Last-30-Days Retrieval and Performance/Gap Audit

**Goal:** Execute the GA4 + GSC retrieval process for the last 30 days and deliver a founder-readable split between high-performing content, underperforming content, and data-collection discrepancies.

**Status:** ✅ Completed

### Changes

- No source/runtime code was changed.
- Pulled archive snapshot for `2026-01-27` to `2026-02-25`:
  - `npm run analytics:archive -- -- --start-date=2026-01-27 --end-date=2026-02-25`
- Added run-local GA4 landing-page artifacts (for direct GSC cross-reference):
  - `.local/analytics-history/runs/2026-02-25T21-08-20-611Z/ga4/landing_pages_30d.json`
  - `.local/analytics-history/runs/2026-02-25T21-08-20-611Z/ga4/landing_pages_conversions_30d.json`
- Produced a run-local synthesized analysis bundle:
  - `.local/analytics-history/runs/2026-02-25T21-08-20-611Z/analysis-30d.json`
  - `.local/analytics-history/runs/2026-02-25T21-08-20-611Z/analysis-30d.md`

### Key Findings (30-Day Window)

- High performers: `/`, `/penny-list`, `/guide` (97.56% of GSC page-click volume; 86.21% of GA4 landing sessions).
- Underperforming high-impression/low-engagement pages: `/about`, `/report-find`, `/faq`, `/in-store-strategy`, `/clearance-lifecycle`.
- Discrepancy audit:
  - no critical undercount mismatch (no page with `>=10` GSC clicks and zero GA4 landing sessions),
  - 55 GSC-only pages exist but account for only 5 clicks total (mostly legacy redirects/technical endpoints),
  - GA4 conversion coverage gap: landing-page `keyEvents` and `conversions` returned `0`, while `find_submit` event count was `422`.

### Verification

- Retrieval run summary (complete, no source failures):
  - `.local/analytics-history/runs/2026-02-25T21-08-20-611Z/run-summary.json` (`errors: []`)
- Docs/memory update lane:
  - `npm run ai:writer-lock:status` ✅ (`UNLOCKED` before claim)
  - `npm run ai:writer-lock:claim -- codex "GA4+GSC 30-day retrieval + analysis"` ✅

### Branch Hygiene

- Branch: `dev`
- Commit SHA touched: none (docs-only memory update + local analytics artifacts only)
- Push status: not pushed (no implementation commit requested)
- Session-end `git status --short`: clean expected after writer-lock release

---

## 2026-02-25 - Codex - FULL QA Flake Fix (Live Console Network-Idle Timeout)

**Goal:** Stop recurring `FULL: QA` failures on recent commits by fixing the root-cause flake in the live console audit test.

**Status:** ✅ Completed

### Changes

- `tests/live/console.spec.ts`
  - changed `page.waitForLoadState("networkidle")` to a best-effort wait with a `10000ms` timeout and non-fatal fallback.
  - rationale: live ad/analytics traffic on mobile can keep network connections open indefinitely, so hard-failing on network-idle is flaky and non-actionable.

### Verification

- Local:
  - `npm run ai:memory:check` ✅
  - `$env:SUBMIT_FIND_DRY_RUN='false'; npm run verify:fast` ✅
  - `npm run e2e:smoke` ✅
  - `$env:NEXT_PUBLIC_VISUAL_POINTER_ENABLED='true'; npm run e2e:full` ✅
  - targeted repro command (previously failing paths):  
    `$env:NEXT_DIST_DIR='.next-playwright'; $env:PLAYWRIGHT='1'; $env:NEXT_PUBLIC_VISUAL_POINTER_ENABLED='true'; $env:NEXT_PUBLIC_EZOIC_ENABLED='false'; $env:NEXT_PUBLIC_ANALYTICS_ENABLED='false'; $env:USE_FIXTURE_FALLBACK='1'; $env:SUPABASE_SERVICE_ROLE_KEY='test'; npm run build; npx playwright test tests/live/console.spec.ts --workers=1 --project=chromium-mobile-light --project=chromium-mobile-dark --project=chromium-mobile-light-390x844` ✅
- GitHub Actions:
  - manual FULL on `dev` (fixed commit): `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22415282781` ✅
  - post-promotion `main` FULL: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22415512456` ✅
  - post-promotion `main` FAST: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22415512457` ✅
  - post-promotion `main` SMOKE: `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/22415512472` ✅

### Branch / Promotion

- `dev` commit: `5224f48` (`fix(ci): make live console audit network-idle wait best effort`)
- promoted to `main` via merge commit: `554e2b2` (`Merge dev: stabilize full QA live console audit`)
- local branch restored to `dev`
- session-end `git status --short`: clean

---

## 2026-02-25 - Codex - Monumetric CSP Production Unblock + Follow-up Domain Expansion

**Goal:** Fully unblock Monumetric ad-chain CSP violations in production, verify required domains live, and clear production CSP violations on `/` and `/guide`.

**Status:** ✅ Completed

### Changes

- `next.config.js`
  - Added requested domain set:
    - `script-src`: `securepubads.g.doubleclick.net`, `cdn.confiant-integrations.net`, `cdn.prod.uidapi.com`
    - `connect-src`: `id.a-mx.com`, `match.adsrvr.org`, `prebid.cootlogix.com`, `prebid.a-mo.net`, `rtb.openx.net`, `fastlane.rubiconproject.com`, `*.eu-1-id5-sync.com`
    - `frame-src`: `u.openx.net`, `sync.cootlogix.com`, `prebid.a-mo.net`, `eus.rubiconproject.com`
  - Added follow-up production-scan domains/protocols that surfaced only after first unblock:
    - `script-src`: `blob:`, `static.criteo.net`, `resources.infolinks.com`, `pagead2.googlesyndication.com`, `tpc.googlesyndication.com`
    - `connect-src`: `c3.a-mo.net`, `pagead2.googlesyndication.com`
    - `frame-src`: `cm.g.doubleclick.net`, `*.safeframe.googlesyndication.com`, `bloggernetwork-d.openx.net`, `gum.criteo.com`
- No files outside `next.config.js` were modified for code scope.

### Verification

- `npm run ai:memory:check` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Production checks:
  - `curl -I https://www.pennycentral.com` ✅ (CSP header includes requested + follow-up domains)
  - `curl -s https://www.pennycentral.com | rg "monu.delivery/site"` ✅
  - `curl -I https://www.pennycentral.com/ads.txt` ✅ (`308` to Monumetric hosted ads.txt)
- Production Playwright CSP scans (`/` + `/guide`):
  - interim scan artifact: `reports/playwright/csp-scan-production-2026-02-25T20-09-17-999Z.json`
  - rerun artifact: `reports/playwright/csp-scan-production-rerun-2026-02-25T20-14-53-693Z.json`
  - final artifact: `reports/playwright/csp-scan-production-final-2026-02-25T20-19-58-251Z.json` ✅
    - `target13StillBlocked: []`
    - `newBlockedHosts: []`

### Branch / Promotion

- `dev` commits:
  - `89313e0` - initial requested CSP domains
  - `045f0d7` - follow-up domains from first production scan
  - `bafdd59` - final remaining pagead/criteo domain gaps
- `main` merge commits:
  - `afba972` - first dev promotion in this session chain
  - `f810d11` - second dev promotion
  - `c4d7ef5` - final dev promotion (current production)
- Local branch restored to `dev` at session close.

---
