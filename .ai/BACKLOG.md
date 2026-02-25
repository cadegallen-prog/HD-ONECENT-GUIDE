# Backlog (Top Priority Items)

**Last updated:** Feb 22, 2026 (memory trend reporting slice shipped for autonomy hardening)
**Rule:** Keep ≤10 items. Archive completed/deferred items.

**Auto-archive:** Full backlog history preserved in `archive/backlog-history/`

Each AI session should:

1. Read `.ai/STATE.md`
2. Take the top **P0** item (unless Cade gives a different GOAL)
3. Implement + verify (proof required)
4. Update `.ai/SESSION_LOG.md`, `.ai/STATE.md`, and this file

**Planning (canonical):** See `.ai/plans/INDEX.md` for all concurrent plans and their statuses.

---

## P0 - Do Next (Analytics-Driven Growth)

### 0. Persistent Memory + Founder Autonomy Hardening (Critical Enablement)

- **Problem:** Context windows are fragile and non-persistent, creating high risk of drift, repeated work, and avoidable founder burden.
- **Progress (2026-02-16):**
  - Founder priority lock documented: prioritize visible website utility/growth work first; keep autonomy/tooling upgrades as a secondary lane unless they directly unblock delivery.
  - Operating-target checklist captured for future autonomy cycles:
    - reduce founder required input,
    - push end-to-end execution onto agents,
    - keep only tooling/docs/guardrails with measurable user-value impact,
    - prefer proven prebuilt systems when they reduce maintenance,
    - enforce hard fail-closed gates for drift and missing proof.
- **Progress (2026-02-22):**
  - Shipped memory failure-mode drill commands for checkpoint fail-closed validation:
    - `ai:memory:drill`
    - `ai:memory:drill:missing`
    - `ai:memory:drill:heading`
  - Drill output now includes explicit remediation guidance for missing required artifacts and heading drift.
- **Progress (2026-02-22):**
  - Shipped weekly memory-integrity trend reporting with strict fail-closed SLO checks:
    - `ai:memory:trend`
    - `ai:memory:trend:30`
  - Added checkpoint run-history ledger and weekly artifact generation:
    - `reports/memory-integrity/checkpoint-history.jsonl`
    - `reports/memory-integrity-weekly/<YYYY-MM-DD>/summary.md`
    - `reports/memory-integrity-weekly/<YYYY-MM-DD>/metrics.json`
- **Progress (2026-02-15):**
  - Memory integrity automation shipped (`ai:memory:check`, `ai:memory:pack`, `ai:checkpoint`).
  - Founder autonomy SOP and canonical plan/topic docs shipped.
  - Multi-domain operating contracts shipped in the canonical SOP (DevOps, Security, Marketing, SEO, Affiliates, Advertising, Monetization, PRD, Planning, Debugging, MVP, Future Projects).
  - Multi-domain conformance checks now enforced in `scripts/ai-memory.ts` as critical checkpoint gates (missing SOP artifacts now fail checkpoint/verify).
  - `ai:verify` now includes memory integrity as a first-class gate.
- **Done means:**
  - Every multi-session handoff includes a generated context pack artifact.
  - `ai:checkpoint` passes with **0 critical failures** before handoff.
  - Weekly trend artifact exists with checkpoint pass-rate + integrity-score history.
  - Recovery time from fresh context to actionable state is ≤ 5 minutes.
  - Founder required actions remain limited to approvals/strategic decisions.
- **Plan artifacts:** `.ai/impl/founder-autonomy-memory-hardening.md`, `.ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md`, `.ai/topics/FOUNDER_AUTONOMY_CURRENT.md`

### 1. Monetization Incident Resolution Command Center (Parallel Hardening, 14-day lock)

- **Problem:** Monetization blockers are now multi-incident and cross-network, not a single AdSense issue:
  - AdSense moved from `Low Value Content` to `We found some policy violations` on Feb 12, 2026.
  - Monumetric tier qualification criteria remain inconsistent (`session pageviews` vs `active users` vs published `monthly pageviews`).
  - Ad Manager domain decline via Ezoic path likely overlaps with policy/compliance signals.
- **Progress (2026-02-13):**
  - Plain-English communication requirements are now canonical across agent entry/collaboration docs.
  - Policy-sensitive wording rewrites are implemented in source (`/in-store-strategy`, `/inside-scoop`, `/faq`).
  - Matrix posture moved from content-blocked `NO-GO` to `CONDITIONAL-GO` pending deployment + refreshed evidence snapshot.
- **Done means:**
  - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` remains the single source of truth and is updated every monetization session.
  - `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md` is maintained and used as the hard re-review gate.
  - All open incidents (`INC-ADSENSE-001`, `INC-MONUMETRIC-001`, `INC-ADMANAGER-001`, `INC-JOURNEY-001`) have current `status`, `next_action`, `deadline`, and evidence links.
  - AdSense re-review gate is enforced (no unresolved `Critical`/`High` policy matrix items).
  - Monumetric escalation timeline is followed (`Feb 17` follow-up, `Feb 19` supervisor escalation if unresolved).
  - Primary path decision is revisited after the 14-day parallel-hardening window using incident outcomes, not assumptions.
- **Plan artifact:** `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`

### 2. Governance Realignment Follow-Through (Charter-first Enforcement)

- **Problem:** Charter/canon refactor is in place and `ai:verify` default mode is now codified; one follow-up remains open: run one intentional drift contradiction test in CI to prove fail behavior.
- **Done means:**
  - `ai:verify` default-mode decision stays documented and drift-safe (`3002` default, `3001` dev opt-in)
  - Drift test PR/probe shows `check:docs-governance` fails as designed on contradiction
  - Drift-test evidence logged in `STATE.md` and `SESSION_LOG.md`
- **Plan:** `.ai/impl/vision-charter-first-governance-realignment.md`

### 3. Sitewide Monetization Readiness - Route Policy + UX-Safe Revenue Architecture

- **Problem:** Monetization strategy is currently fragmented (guide-focused execution, but sitewide revenue depends heavily on utility routes and first-layer IA quality signals).
- **Progress (2026-02-13):** Runtime foundation is complete and aligned to founder-approved Option B:
  - analytics key hygiene + attribution normalization (`lib/analytics.ts`)
  - hard-exclusion + provider-managed placement policy modules (`lib/ads/route-eligibility.ts`, `lib/ads/launch-config.ts`)
  - unit coverage for sanitizer + provider-managed route policy behavior
  - `/penny-list` mobile utility migration to top auto-hide bar (`components/penny-list-mobile-utility-bar.tsx`, `components/penny-list-client.tsx`)
  - mobile sticky anchor reserve scaffold + prompt stack pause gating (`components/ads/mobile-sticky-anchor.tsx`, `shouldPausePennyListPromptStack(...)`)
  - route-level slot metadata application under provider-managed mode (`lib/ads/slot-plan.ts`, `components/ads/route-ad-slots.tsx`) wired to `/`, `/penny-list`, guide surfaces, `/sku/[sku]`, and `/pennies/[state]`
  - measurement + rollback operations (`lib/ads/guardrail-report.ts`, `scripts/monumetric-guardrail-report.ts`, `.ai/topics/ANALYTICS_CONTRACT.md` contract updates)
- **Next:** Keep onboarding dispute as blocker, then run operational reporting windows (B/C) and complete partner tag/ID wiring using Monumetric guidance.
- **Done means:**
  - Hard route exclusions are enforced in-app while placement remains provider-managed on non-excluded routes
  - Thin URL lifecycle policy is implemented (keep active valid URLs; temporary noindex for thin active pages until enriched)
  - Homepage/navigation prioritize strong pages in first-layer structure
  - Monumetric handoff packet is prepared and confirmed (exclusions + frequency guardrails + provider-managed placement assumptions)
- **Plan:** `.ai/impl/monumetric-launch-spec.md` (supersedes `.ai/plans/sitewide-monetization-readiness.md` for launch decisions)

### 4. Agent Autonomy Hardening - Phase 1 (Port 3001 Reliability Contract)

- **Problem:** Local dev-server ownership and verification mode selection are easy to misapply, creating restart-loop confusion and blocking agent momentum.
- **Progress (2026-02-11):** `scripts/ai-proof.ts` now supports deterministic `dev`/`test` modes, `PLAYWRIGHT_BASE_URL`, and fail-fast no-thrash server checks. Remaining work is to unify the same contract fully across `ai-doctor` + all docs/skills references.
- **Done means:**
  - `scripts/ai-doctor.ts`, `scripts/ai-verify.ts`, and `scripts/ai-proof.ts` all use the same explicit server-state contract (`healthy 3001`, `3001 free`, `3001 unhealthy`)
  - `ai:verify` has deterministic non-destructive fallback behavior when 3001 is unavailable/unhealthy
  - Policy/docs are aligned in one pass (`AGENTS.md`, `.ai/CRITICAL_RULES.md`, `.ai/VERIFICATION_REQUIRED.md`, `docs/skills/local-dev-faststart.md`)
  - Verification evidence includes one bundle for dev mode and one for test mode
- **Plan:** `.ai/plans/agent-autonomy-hardening.md`

### 5. Bloat Control - Ongoing Archive-First Hygiene

- **Problem:** Deprecated/legacy/single-use docs and scripts keep accumulating, increasing AI context noise and decision drift.
- **Done means:**
  - Add a repeatable prune-audit check that reports unreferenced docs/scripts and duplicate guidance hotspots.
  - Run archive-first prune in small, reversible batches with per-snapshot `INDEX.md` manifests.
  - Keep startup guardrails enforcing archive ignore by default.
  - Document a restore protocol that requires explicit founder request.
- **Current snapshots:**
  - `archive/docs-pruned/2026-02-03/`
  - `archive/docs-pruned/2026-02-03-pass2/`
  - `archive/docs-pruned/2026-02-03-pass3/`
  - `archive/docs-pruned/2026-02-03-pass4/`
  - `archive/docs-pruned/2026-02-04-pass1/`
  - `archive/media-pruned/2026-02-04-pass1/`
  - `archive/media-pruned/2026-02-04-pass2/`
  - `archive/scripts-pruned/2026-02-03/`
  - `archive/scripts-pruned/2026-02-03-pass2/`
  - `archive/scripts-pruned/2026-02-03-pass3/`
  - `archive/scripts-pruned/2026-02-04-pass1/`

### 6. Data Pipeline Reliability - Pre-scrape + Cron Auth (P0-0)

- **Problem:** GitHub-hosted runners are blocked upstream (**403 + Cloudflare “Just a moment...”**), so scheduled scraping cannot be the primary freshness path right now. Separately, Vercel cron endpoints will return 401 if `CRON_SECRET` is missing/mismatched.
- **Done means:**
  - `npm run warm:staging` (local/home IP) reliably updates `enrichment_staging` with non-zero items
  - `npm run staging:status -- --max-age-hours 72` is ✅ green after a local warm run
  - Scheduled `Enrichment Staging Warmer` runs are ✅ green as **probe-only**, but open/update a GitHub issue when blocked (`cloudflare_block=true`)
  - Vercel cron logs show 200s (not 401s) for `/api/cron/seed-penny-list`, `/api/cron/trickle-finds`, `/api/cron/send-weekly-digest`
- **Approach options (later):** self-hosted runner (home IP / VPS) vs paid residential proxy vs new data source (avoid upstream dependency where possible)

### 7. SEO Improvement - Schema Markup + Internal Linking (P0-3)

- **Problem:** Zero non-branded organic clicks. Position 11.6 for "home depot penny list". 100% dependent on Facebook.
- **Progress (2026-02-16):**
  - Added `FAQPage` schema on `/guide`.
  - Added `HowTo` schema on `/guide`.
  - Added Playwright regression assertions for `/guide` JSON-LD types and minimum FAQ/step depth.
  - Fixed stale smoke assertion on `/support` -> `/transparency` heading expectation so smoke remains reliable.
- **Done means:**
  - FAQ schema added to `/guide`
  - HowTo schema added to `/guide`
  - Both schemas validate in Google Rich Results Test
  - Internal links strengthened (guide ↔ penny-list ↔ homepage)
  - H1s verified to match target keywords
  - Meta descriptions updated
- **Verify:** All 4 gates + schema validation
- **Evidence:** Search Console shows 80 clicks, all branded ("penny central"). Zero clicks for "home depot penny list" despite 6 impressions.
- **Timeline:** 2-3 weeks for Google to respond after deployment

### 8. Resilience + Diversification Contingency Program (Founder Override)

- **Problem:** Website value and potential income are still concentrated in penny-item permanence + channel concentration risk. Founder explicitly requested a durable contingency path that can grow with or without Facebook dominance and with reduced dependence on Home Depot penny-policy continuity.
- **Done means:**
  - A phased diversification plan is maintained and executable without re-discovery.
  - At least one recurring-value content/product layer is live that remains useful even during low penny-item windows.
  - Tracking exists for non-Facebook traffic share and adjacent-intent engagement.
  - Core loop guardrails (`/penny-list` usage + `/report-find` quality/throughput) remain stable while adjacent growth expands.
- **Plan artifacts:**
  - `.ai/impl/pennycentral-resilience-diversification-plan.md`
  - `.ai/topics/RESILIENCE_GROWTH_CURRENT.md`

### 9. Collaboration Continuity Loop (Analytics/Search/MCP Included)

- **Problem:** Future agents can drift in communication quality and operational visibility unless continuity expectations are translated into repeatable execution behavior.
- **Progress (2026-02-22):**
  - Added shared-memory single-writer lock protocol for concurrent agents:
    - script: `scripts/ai-shared-writer-lock.ts`
    - commands: `ai:writer-lock:status|claim|heartbeat|release`
    - lock scope: `.ai/HANDOFF.md`, `.ai/STATE.md`, `.ai/SESSION_LOG.md`, `.ai/BACKLOG.md`
    - canon docs updated: `AGENTS.md`, `README.md`, `.ai/HANDOFF_PROTOCOL.md`, `.ai/VERIFICATION_REQUIRED.md`, `.ai/CRITICAL_RULES.md`
    - reusable skill added: `docs/skills/single-writer-lock.md`
  - Implemented report-flow event export coverage in `scripts/archive-google-analytics.ts`:
    - `ga4/daily_events.csv|json` (`date,eventName,eventCount`)
    - `ga4/daily_report_paths.csv|json` (`date,pagePathPlusQueryString,sessions`) filtered to report-route paths
  - Verified archive run with new slices:
    - `.local/analytics-history/runs/2026-02-22T00-15-22-963Z/summary.md`
  - Produced refreshed weekly analytics snapshot using new slices:
    - `reports/analytics-weekly/2026-02-22/summary.md`
    - source run: `.local/analytics-history/runs/2026-02-22T00-29-57-156Z/summary.md`
  - Snapshot readout (last 7d vs prior 7d):
    - GSC non-branded clicks: `83` vs `34` (`+144.12%`)
    - `/report-find` sessions: `286` vs `234` (`+22.22%`)
    - `find_submit`: `122` vs `109` (`+11.93%`)
    - reports/report-route-session: `0.3861` vs `0.4360` (`-11.45%`)
  - Updated analytics operating docs for participation-lift reads:
    - `.ai/topics/ANALYTICS_CONTRACT.md`
    - `.ai/ANALYTICS_WEEKLY_REVIEW.md`
  - Remaining queued actions from this lane:
    - apply single-writer lock workflow whenever more than one agent/session is active,
    - deploy participation-lift release and establish explicit post-deploy baseline window,
    - run CTR remediation pass on high-impression/low-CTR pages (`/guide`, `/what-are-pennies`, `/faq`, `/report-find`),
    - rerun weekly snapshot after 48h+ post-deploy and require 4-week confirmation before success claims.
- **Progress (2026-02-20):**
  - Generated first weekly analytics snapshot artifact from local archive:
    - `reports/analytics-weekly/2026-02-20/summary.md`
  - Fail-closed outcome from snapshot:
    - non-branded search trend is directionally positive,
    - core-loop guardrail formulas remain `BLOCKED/INCONCLUSIVE` until event-level exports are included.
  - Queued next actions from the snapshot:
    - add GA4 event export coverage for `report_find_click` and `find_submit`,
    - run CTR remediation pass on high-impression/low-CTR pages (`/guide`, `/what-are-pennies`, `/faq`, `/report-find`),
    - rerun weekly snapshot and require 4-week confirmation before success claims.
- **Done means:**
  - Sessions that touch growth/SEO/IA include explicit evidence inputs (GA4/Search Console when relevant) and fail-closed status language when data is missing.
  - Sessions that touch tooling/capability include MCP parity/fallback disclosure against `.ai/MCP_BASELINE.md`.
  - Every meaningful session yields at least one explicit next task in backlog/state/session log so founder input stays minimal.
  - Analytics-focused sessions may produce `reports/analytics-weekly/<YYYY-MM-DD>/summary.md` using `.ai/ANALYTICS_WEEKLY_REVIEW.md` when that lane is relevant.
  - MCP capability parity is checked against `.ai/MCP_BASELINE.md`; any missing capability is logged with fallback and one explicit founder action only when absolutely required.
  - Growth/SEO claims stay fail-closed: if GA4 or Search Console coverage is missing, status is `BLOCKED` or `INCONCLUSIVE` and no success claim is made.
- **Canonical references:**
  - `.ai/topics/ANALYTICS_CONTRACT.md`
  - `.ai/ANALYTICS_WEEKLY_REVIEW.md`
  - `.ai/MCP_BASELINE.md`
  - `.ai/MCP_SETUP.md`
  - `.ai/TOOLING_MANIFEST.md`
- **First default task for future agents:** on the next growth/SEO-oriented session, produce one `reports/analytics-weekly/<YYYY-MM-DD>/summary.md` snapshot and queue the top 1-3 high-impact actions in this backlog; otherwise apply this continuity loop to the active top-priority lane.

---

## ✅ Recently Completed

- **2026-02-22:** Report Find Participation Lift v1 decomposed program completed (policy + measurement + basket + taxonomy + archive):
  - policy anti-mega-plan rules codified in `AGENTS.md`, `README.md`, `.ai/plans/_TEMPLATE.md`,
  - `find_submit` semantics corrected on report-entry CTAs and `?src=` attribution standardized across report-entry links,
  - report basket UX shipped in `components/report-find/ReportFindFormClient.tsx` with session persistence, dedupe merge, prefill auto-add, sequential submit-all, mixed-result handling, and copy-for-facebook action,
  - analytics taxonomy expanded + report-payload privacy redaction strengthened in `lib/analytics.ts`,
  - GA4 archive script extended with `daily_events` and `daily_report_paths` slices in `scripts/archive-google-analytics.ts`,
  - verification: `verify:fast`, `e2e:smoke`, `lint:colors`, targeted Playwright suite, archive run (`.local/analytics-history/runs/2026-02-22T00-15-22-963Z/summary.md`), and proof bundle (`reports/proof/2026-02-22T00-16-09/`).
- **2026-02-04:** Bloat reduction (pass 6): archived SEO export CSVs + legacy Playwright baselines/screenshots to new cold-storage snapshots and hardened `ai:verify` to build with `.next-playwright` when 3001 is in use. Proof: `reports/verification/2026-02-04T13-31-17/summary.md`.
- **2026-02-04:** Bloat reduction (pass 5): added `npm run prune:audit`, archived large non-production media to `archive/media-pruned/2026-02-04-pass1/`, removed tracked generated reports/logs (`reports/playwright/console-report-*.json`, axe/contrast outputs) and expanded `.gitignore` so these artifacts don’t come back.
- **2026-02-03:** Archive-first bloat pass 4 completed: moved `.ai/enablement-prompts/*` into `archive/docs-pruned/2026-02-03-pass4/`, moved low-reference helper `scripts/normalize-image-urls.ts` into `archive/scripts-pruned/2026-02-03-pass3/`, added per-snapshot manifests, and updated `.ai/AI_ENABLEMENT_BLUEPRINT.md` + `.gitignore` (`/reports/playwright/console-report-*.json`) to reduce future noise.
- **2026-02-03:** Archive-first bloat pass 3 completed: moved additional legacy docs (`.ai/HAIKU-IMPLEMENTATION-GUIDE.md`, `.ai/PENNY_CARD_DESIGN_VISION.md`, `docs/HOW-CADE-ADDS-STOCK-PHOTOS.md`) and additional one-off scripts (`scripts/page-improvement-wizard.ps1`, legacy enrichment merge helpers) with restore manifests under `archive/docs-pruned/2026-02-03-pass3/` and `archive/scripts-pruned/2026-02-03-pass2/`.
- **2026-02-03:** Archive-first bloat pass 2 completed: moved 7 additional docs to `archive/docs-pruned/2026-02-03-pass2/` and 28 unreferenced/single-use scripts to `archive/scripts-pruned/2026-02-03/`, with restore manifests added.
- **2026-02-03:** Docs bloat archive-first pass completed. Pruned docs moved to `archive/docs-pruned/2026-02-03/` (no hard deletions), with default-ignore policy now codified in `AGENTS.md` and `.ai/START_HERE.md`. Restore remains explicit via `git mv archive/docs-pruned/...`.
- **2026-01-17:** P0-4c (Weekly Email Cron) - Implemented weekly email digest sent every Sunday 8 AM UTC to all active subscribers. Queries new penny items from last 7 days, renders responsive React email template, sends via Resend API with proper unsubscribe links. All 4 gates passing.
- **2026-01-16:** P0-4b (Email Signup Form) - Implemented email signup form on `/penny-list` with `email_subscribers` table, subscribe/unsubscribe endpoints, dismissible UI, localStorage persistence, and GA4 tracking. All 4 gates passing.
- **2026-01-16:** P0-4a (PWA Install Prompt) - Implemented "Add to Home Screen" prompt on `/penny-list` with app icons (192px, 512px), PWA manifest, dismissible UI, localStorage persistence, and GA4 tracking. All 4 gates passing.
- **2026-01-16:** P0-1 (bounce page redirects) - Redirected `/home-depot-penny-items`, `/how-to-find-penny-items`, and `/home-depot-penny-list` to appropriate pages. Bounce rates improved from 100% to 21-29%.
- **2026-01-10:** Data pipeline scripts completed:
  - `scripts/export-pennycentral-json.ts` - PennyCentral export artifact
  - `scripts/validate-scrape-json.ts` - Scrape JSON validation/normalization
  - `scripts/scrape-to-enrichment-csv.ts` - Scrape to enrichment CSV conversion
  - `scripts/enrichment-diff.ts` - Diff report (scrape vs export)
- **2026-01-06:** Implemented `scripts/print-penny-list-count.ts` and added `npm run penny:count`.

---

## Analytics Context (Jan 12-16, 2026)

**Source:** Fresh GA4 + Search Console data (see plan file for full details)

| Metric           | Value | Insight                         |
| ---------------- | ----- | ------------------------------- |
| Daily users      | 680   | Up 3.5x from 196/day (Jan 9-11) |
| Conversion rate  | 26%   | 906 HD clicks / 3,451 users     |
| Facebook traffic | 28%   | #1 referral channel             |
| Organic clicks   | 80    | All branded ("penny central")   |
| SEO position     | 11.6  | Page 2 for target keywords      |

**Key insight:** Traffic growing, core product works, but retention and SEO are critical gaps.

---

**For full backlog:** See `archive/backlog-history/BACKLOG_full_2025-12.md`
