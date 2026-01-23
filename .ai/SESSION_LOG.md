# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-01-23 - Codex - Pipeline: staging warmer diagnostics + Cloudflare blocker

**Goal:** Get the Tue–Fri pre-scrape pipeline working reliably and make failures impossible to miss.

**Status:** ⚠️ Blocked (Cloudflare 403 from upstream API) — not a silent failure anymore.

### Changes

- `.github/workflows/enrichment-staging-warmer.yml`: Added failure auto-issue creation/update + clearer schedule notes.
- `extracted/scraper_core.py`: Added per-zip diagnostics (HTTP status, HTML detection, timing) and better failure hints.
- `scripts/staging-warmer.py`: Prints `FETCH_DIAGNOSTICS` lines + GitHub Actions `::error` annotation on failure.
- `app/api/cron/seed-penny-list/route.ts`: Switched data source to `enrichment_staging` (prod does not have `penny_item_enrichment`).
- `app/api/cron/trickle-finds/route.ts`: Switched data source to `enrichment_staging` (same reason).

### Findings (Root Cause)

- Upstream `https://pro.scouterdev.io/api/penny-items` returns **HTTP 403 + Cloudflare “Just a moment...” HTML** from GitHub Actions runners.
- This is likely IP / bot protection; refreshing `PENNY_RAW_COOKIE` alone may not fix it.
- `enrichment_staging` exists and currently has **1343** rows (as of Jan 23, 2026).
- `penny_item_enrichment` does **not** exist in production Supabase (PostgREST `PGRST205`).

### Evidence

- Latest failed run: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21283542371
- Auto-created failure issue: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/issues/106

### Verification

- Bundle: `reports/verification/2026-01-23T10-51-52/summary.md`

---

## 2026-01-22 - Codex - Codex CLI + MCP enablement (non-coder workflow)

**Goal:** Make Codex less brittle for a 100% AI-reliant workflow: fix MCP config drift, upgrade Codex CLI to match current docs, and remove the need to hardcode secrets in config files.

**Status:** ✅ Complete

### Changes

- Updated repo MCP docs to match current Codex config schema (`mcp_servers`, snake_case):
  - `.ai/MCP_SETUP.md`
  - `.ai/CODEX_CONFIG_SNIPPET.toml`
  - `docs/skills/codex-mcp-setup.md` (new)
- Updated local machine setup (outside repo):
  - Fixed broken npm global `prefix` (so `npm install -g` works)
  - Upgraded Codex CLI to a version that supports `codex mcp list/add/login`
  - Normalized `~/.codex/config.toml` to use `mcp_servers` + added OpenAI Docs MCP

### Quick verify

- `codex --version`
- `codex mcp list`

---

## 2026-01-22 - Codex - Ezoic ads (Option B rollout: 5 placeholders)

**Goal:** Implement a trust-first Ezoic ad rollout (Option B): 3 homepage slots + 1 Penny List slot (after item #10) + 1 Guide slot (after Section II), with CLS protection and a kill switch.

**Status:** ✅ Complete + verified (all 4 gates: lint/build/unit/e2e)

### Changes

- `lib/ads.ts`: Centralized `EZOIC_ENABLED` toggle, `AD_SLOTS`, and CLS min-heights (`AD_MIN_HEIGHTS`). Disable with `NEXT_PUBLIC_EZOIC_ENABLED=false` (Vercel env var changes require redeploy).
- `app/layout.tsx`: Gate Ezoic scripts via `EZOIC_ENABLED && ENABLE_VERCEL_SCRIPTS` (only Vercel production + when enabled).
- `app/page.tsx`: Added homepage placeholders: `HOME_TOP (100)`, `HOME_MID (101)`, `HOME_BOTTOM (102)`.
- `components/penny-list-client.tsx`: Injected `LIST_AFTER_N (110)` after item #10 in the card grid (no ads above results).
- `components/GuideContent.tsx`: Added `CONTENT_AFTER_P1 (130)` after Section II.
- `playwright.config.ts`: E2E web server sets `NEXT_PUBLIC_EZOIC_ENABLED=false` to keep Playwright console-clean and avoid hydration mismatches.

### Proof

- Verification bundle: `reports/verification/2026-01-22T10-39-19/summary.md`
- Ad placement screenshots: `reports/proof/2026-01-22T10-29-18-ezoic-b/`
