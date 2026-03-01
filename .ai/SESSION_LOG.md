# Session Log (Recent 5 Sessions)

**Auto-trim:** Keep up to 5 recent sessions here. Git history preserves everything.

---

## 2026-03-01 - Codex - FAQ Core-Loop CTR Remediation

**Goal:** Strengthen `/faq` so it answers search intent faster and sends readers directly into the Penny List and Report a Find flow.

**Status:** ✅ Completed

### Changes

- `app/faq/page.tsx`
  - retitled the page and metadata around the explicit "Home Depot penny items FAQ" search intent.
  - added breadcrumb support back to `/guide`.
  - inserted a top CTA block that routes readers to `/what-are-pennies`, `/penny-list`, and `/report-find?src=faq-next-step`.
  - inserted a bottom CTA block that routes readers to `/guide`, `/penny-list`, and `/report-find?src=faq-footer`.
- `tests/smoke-critical.spec.ts`
  - added smoke coverage to verify the new FAQ headline, next-step section, and tracked CTA targets.
  - tightened the `Report a Find` assertion to target the tracked FAQ CTA instead of the global header nav link.

### Summary

- `/faq` now behaves more like a routing hub instead of a dead-end reference page.
- Metadata and on-page copy now match the query intent more directly.
- Internal links now push readers into the product loop instead of leaving them stranded after the FAQ answers.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `tsx scripts/ai-proof.ts --mode=test /faq` ✅
  - artifacts: `reports/proof/2026-03-01T10-11-31/`

### Branch Hygiene

- Branch: `dev`
- Scope: FAQ route + smoke assertion

---

## 2026-03-01 - Codex - Guide Hub Search-Intent Refocus

**Goal:** Recover the parked `/guide` refocus work from the local backup branch and ship it as its own clean slice.

**Status:** ✅ Completed

### Changes

- `app/guide/page.tsx`
  - rewrote the hub so the page itself acts as Part 1 instead of leading with lower-priority side material.
  - changed the metadata and JSON-LD to match the search-intent framing around how penny items work.
  - moved the ethical-use disclosure higher and replaced the old intro block with a direct primer on penny items.
- `components/guide/TableOfContents.tsx`
  - removed the duplicate `What Are Penny Items? (Start Here)` card from the chapter grid.
  - renumbered the visible chapter badges so the grid now begins at `Part 2`.
- `tests/smoke-critical.spec.ts`
  - updated the smoke assertion to verify the new Part 1 primer and Guide Chapters flow.

### Summary

- `/guide` now answers the first real user question immediately: what penny items are and why they hit `$0.01`.
- The chapter grid now behaves like the continuation of the guide instead of duplicating the introduction.
- This guide work was recovered from the parked backup branch and shipped separately from the Copilot workflow cleanup.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- `tsx scripts/ai-proof.ts --mode=test /guide` ✅
  - artifacts: `reports/proof/2026-03-01T09-54-14/`

### Branch Hygiene

- Branch: `dev`
- Scope: guide hub route + table of contents + smoke assertion

---

## 2026-03-01 - Codex - Copilot Native Workflow Hardening

**Goal:** Standardize Copilot usage around native VS Code agents and prompt files, and explicitly reject repo-local orchestration.

**Status:** ✅ Completed

### Changes

- `.github/copilot-instructions.md`
  - rewrote the Copilot entrypoint around native IDE agents and prompts only.
  - added explicit writer-lock guidance for shared-memory edits.
- `.github/agents/coder.md`, `.github/agents/documenter.md`, `.github/agents/orchestrator.md`, `.github/agents/planner.md`, `.github/agents/researcher.md`, `.github/agents/reviewer.md`, `.github/agents/tester.md`
  - documented the native sub-agent roles and tightened scope, verification, and writer-lock requirements.
- `.github/prompts/debug.prompt.md`, `.github/prompts/explore.prompt.md`, `.github/prompts/implement.prompt.md`, `.github/prompts/review.prompt.md`, `.github/prompts/session-end.prompt.md`, `.github/prompts/verify.prompt.md`
  - aligned the prompt workflow to the same scoped-review and writer-lock rules.
- `.ai/impl/copilot-agentic-orchestration.md`
  - marked repo-local Copilot orchestration as superseded and documented the native path as canonical.

### Summary

- PennyCentral Copilot now has one documented workflow: native custom agents and prompt files inside VS Code.
- Repo-local Copilot orchestration is now explicitly unsupported in repo canon.

### Verification

- `npm run ai:memory:check` ✅
- `npm run ai:checkpoint` ✅
- Runtime verification lanes: N/A (docs-only workflow change; no route/form/API/UI/runtime code-path changes)

### Branch Hygiene

- Branch: `dev`
- Commit base: `27e3cc3`
- Push: not pushed

---

## 2026-02-27 - Codex - Monumetric Emergency Production Rollback Reactivated

**Goal:** Shut Monumetric back off in production after founder-reported header obstruction and nonstop refresh behavior.

**Status:** ✅ Completed

### Changes

- Vercel production operations
  - removed the production `NEXT_PUBLIC_MONUMETRIC_ENABLED=true` setting and re-added it as `false`.
  - redeployed the current production deployment instead of shipping local app code.
- Live verification
  - confirmed `www.pennycentral.com` no longer serves the Monumetric runtime script or `monu.delivery` preconnect.
- `.ai/STATE.md`
  - updated current reality to show the rollback is active again.
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - moved `INC-MONUMETRIC-001` back from live validation to active rollback.
- `.ai/SESSION_LOG.md`
  - added this closeout entry and trimmed the log back to 5 sessions.

### Summary

- Founder-reported live behavior still crossed the kill-switch line.
- Monumetric is off again in production.
- This rollback was operational only; no new site code was deployed.

### Verification

- `npx --yes vercel@latest env ls production --scope allens-projects-6bce9cc6` ✅
- `npx --yes vercel@latest redeploy https://hd-onecent-guide-jize3ocv7-allens-projects-6bce9cc6.vercel.app --target production --scope allens-projects-6bce9cc6` ✅
- `curl -s https://www.pennycentral.com | rg "monu.delivery/site|https://monu.delivery"` ✅
  - result: no Monumetric runtime script or `monu.delivery` preconnect present in live HTML
- Runtime verification lanes: N/A (operational env rollback only; no local runtime code-path change)

### Branch Hygiene

- Branch: `dev`
- Scope: memory/docs update only; production rollback was executed operationally in Vercel

---

## 2026-02-27 - Codex - Baseline Export + Monumetric Production Reactivation

**Goal:** Lock the clean pre-ad baseline, reactivate Monumetric in production, and verify the live site truthfully.

**Status:** ✅ Completed

### Changes

- `analytics/baselines/Baseline_Stable_PreAds.json`
  - saved the stable GA4 baseline using `2026-02-18` through `2026-02-24`.
  - included engagement, bounce, pages/session, session totals, and device split fields for later guardrail comparisons.
- Vercel production operations
  - set `NEXT_PUBLIC_MONUMETRIC_ENABLED=true` in production.
  - redeployed the current production deployment and confirmed `www.pennycentral.com` is serving Monumetric again.
- `tests/live/console.spec.ts`
  - fixed CSP blocked-target extraction so the live console audit no longer mislabels `data:` CSP failures as `www.google-analytics.com`.
- `.ai/STATE.md`
  - updated current reality to reflect that Monumetric is live again in production and the 7-day validation window is active.
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - advanced `INC-MONUMETRIC-001` from reactivation-pending to live validation.
- `.ai/SESSION_LOG.md`
  - added this closeout entry.

### Summary

- Stable pre-ad reference window locked: `2026-02-18` to `2026-02-24`.
- Monumetric is live again on production as of `2026-02-27`.
- Immediate post-reactivation live audit passed on desktop and mobile.
- Remaining console findings are non-critical third-party ad/tracking noise, not a PennyCentral production blocker.

### Verification

- `curl -s https://www.pennycentral.com | rg "monu.delivery/site"` ✅
- `npm run verify:fast` ✅
- `$env:PLAYWRIGHT_BASE_URL='https://www.pennycentral.com'; npx playwright test tests/live/console.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
  - artifacts:
    - `reports/playwright/console-report-2026-02-27T22-58-09-641Z.json`
    - `reports/playwright/console-report-2026-02-27T22-58-54-314Z.json`
- Runtime smoke lane: N/A (no app route/UI code changed in this closeout lane; live production verification was run directly against the deployed site)

### Branch Hygiene

- Branch: `dev`
- Scope: baseline artifact + verification-tool hardening + memory updates

---
