# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-02-10 - Copilot - Ads.txt Ezoic Verification Block

**Goal:** Temporarily append Ezoic reseller entries for verification while waiting on premium ad network approval.

**Status:** ✅ Completed.

### Changes

- Appended the Ezoic reseller list to `public/ads.txt`, wrapped in `# --- START EZOIC ---` / `# --- END EZOIC ---`.
- Added skill doc `docs/skills/ads-txt-update.md` and indexed it in `docs/skills/README.md`.

### Verification

- `npm run verify:fast` ✅
- Build note: Supabase anon fetch timeouts logged during static generation (non-blocking; build succeeded).

---

## 2026-02-09 - Copilot - /resources Redirect + Footer Consolidation

**Goal:** Remove the obsolete /resources surface, consolidate footer legal/support links, and tighten crawl/index hygiene.

**Status:** ✅ Completed.

### Changes

- Added permanent redirects for `/resources` and `/resources/` → `/guide` in `next.config.js`.
- Condensed footer links into **Company / Support / Legal** groups and renamed the CCPA link to “California Privacy (CCPA)” (still anchors to `/privacy-policy#ccpa`).
- Updated `ROUTE-TREE.txt` to reflect the current route surface (no `/resources`).
- Removed the empty `app/resources` directory locally (no tracked files).

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Redirect checks (localhost): `/resources` → 308 `/guide`, `/resources/` → 308 `/guide`.
- Playwright proof:
  - `reports/proof/2026-02-09-resources-footer/before-prod-desktop-light.png`
  - `reports/proof/2026-02-09-resources-footer/before-prod-desktop-dark.png`
  - `reports/proof/2026-02-09-resources-footer/after-local-desktop-light.png`
  - `reports/proof/2026-02-09-resources-footer/after-local-desktop-dark.png`
  - `reports/proof/2026-02-09-resources-footer/before-prod-fullpage.png`
  - `reports/proof/2026-02-09-resources-footer/after-local-fullpage.png`
- Console notes: local dev shows a hydration warning during Fast Refresh; production console noise includes UID2 CSP block + Sentry 429 + THD preload warnings (pre-existing).

---

## 2026-02-09 - Codex - PR #133 Verification Pass + Sonar Hotspot Remediation

**Goal:** Complete both requested tracks: fresh repo-side verification proof for PR #133 and start/remediate the remaining SonarCloud failure.

**Status:** ✅ Completed.

### Changes

- Re-verified PR `#133` status and checks on latest SHA `8cabceb13d140d54c9d399fd08212b4e3f436cac`.
- Confirmed Sonar failure root cause from check metadata:
  - `Quality Gate failed` due `1 Security Hotspot`
  - hotspot key `AZxEKXYrJwEIlETBDrFL`
  - file `.github/workflows/full-qa.yml`, line 39
  - message: "Use full commit SHA hash for this dependency."
- Remediated hotspot by pinning `dorny/paths-filter` to a full commit SHA:
  - `.github/workflows/full-qa.yml` now uses `dorny/paths-filter@de90cc6fb38fc0963ad72b210f1f284cd68cea36` (`v3.0.2`).
- Preserved all other workflow behavior from prior Full QA fix.

### Verification

- Local:
  - `npm run verify:fast` ✅ (`reports/forensics/review3-verify-fast-rerun-2026-02-09T16-44-09.log`)
  - `npm run e2e:smoke` ✅ (`reports/forensics/review3-e2e-smoke-rerun-2026-02-09T16-43-17.log`)
  - post-fix `npm run verify:fast` ✅ (`reports/forensics/review3-postfix-verify-fast-2026-02-09T16-46-17.log`)
  - workflow formatting ✅ (`npx prettier --check .github/workflows/full-qa.yml`)
- CI status baseline on PR `#133` (pre-remediation commit):
  - FAST ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21840293667`
  - SMOKE ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21840293798`
  - FULL ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21840293680`
  - Sonar ❌ `https://sonarcloud.io` (fixed in code; pending re-analysis on next push)
- Sonar evidence:
  - check run id: `63022550845`
  - API evidence captured via:
    - `gh api repos/cadegallen-prog/HD-ONECENT-GUIDE/commits/8cabceb13d140d54c9d399fd08212b4e3f436cac/check-runs`
    - `https://sonarcloud.io/api/hotspots/search?projectKey=cadegallen-prog_HD-ONECENT-GUIDE&pullRequest=133&status=TO_REVIEW`
