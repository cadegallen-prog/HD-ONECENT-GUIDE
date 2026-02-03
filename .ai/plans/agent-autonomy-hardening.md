# Agent Autonomy Hardening Plan (Living)

**Created:** 2026-02-03  
**Last updated:** 2026-02-03  
**Status:** Planning  
**Owner:** Cade (founder)

## 0) GOAL / WHY / DONE MEANS

**GOAL:** Eliminate local dev-server thrash (port 3001 confusion) and codify the access/observability setup required for autonomous, safe execution.  
**WHY:** Port lifecycle ambiguity and missing operational access create avoidable blockers, slow verification, and force repeated context rebuilding across sessions.  
**DONE MEANS:**

- Port ownership contract is explicit and consistent across scripts + docs (human owns 3001 by default; agents do not kill it).
- `ai:doctor` / `ai:verify` / `ai:proof` produce deterministic behavior for both cases: 3001 running and 3001 absent/unhealthy.
- Required non-code access (Vercel logs, GitHub Actions read, Sentry, GA4/Search Console, ad dashboards) is documented with exact minimum scopes and fallback behavior.
- Backlog reflects the new enablement priority so this does not get lost behind feature work.
- Memory artifacts are updated at each phase (`.ai/SESSION_LOG.md`, `.ai/STATE.md`, and `.ai/BACKLOG.md` as needed).

## 1) Hard Constraints (Non-Negotiable)

- Reuse existing infrastructure by default (no new tables/routes unless explicitly approved)
- No new dependencies unless explicitly approved
- Design tokens only (no raw Tailwind palette colors)
- Verification required when implementing (lint/build/unit/e2e + Playwright for UI)
- Never kill port 3001 unless explicitly instructed or proven unhealthy and owned by the agent process
- Preserve honesty protocol: if blocked, state blocker and options; do not pretend progress

## 2) Current State (What exists today)

- Audit doc: `.ai/topics/AGENT_AUTONOMY_CURRENT.md`
- Existing surfaces:
  - `scripts/ai-doctor.ts` health checks (port/env/playwright/node)
  - `scripts/ai-verify.ts` with `auto|dev|test` modes and quality-gate bundling
  - `playwright.config.ts` default isolated server on port 3002 unless `PLAYWRIGHT_BASE_URL` is set
  - Port 3001 policy duplicated across `AGENTS.md`, `.ai/CRITICAL_RULES.md`, `.ai/CONSTRAINTS.md`, and skills docs
- Existing data flow:
  - Human preview path: `npm run dev` on 3001
  - Verification path: `npm run ai:verify` + Playwright test server (3002) by default
- Current pain points:
  - Confusion between "reuse 3001" and "unblock verification quickly" workflows
  - No single access matrix for non-code systems needed for SEO/UX/monetization/debug decisions
  - Plan memory can drift without a canonical per-initiative document

## 3) Decisions (Prevent Drift)

Record decisions that must not be re-decided later:

- Naming/copy: initiative label is **Agent Autonomy Hardening**; use this exact name across docs
- Verification default:
  - `ai:verify -- test` is the safest deterministic baseline when local server state is unknown
  - `ai:verify -- dev` is explicit opt-in when we intentionally validate against the human-run 3001 server
- Port ownership model:
  - 3001 is assumed human-owned when occupied
  - agents may start 3001 only when free and explicitly needed
  - agents do not kill 3001 except with explicit instruction or owned unhealthy process
- Failure handling:
  - unhealthy 3001 is reported clearly with immediate fallback path (test mode)
  - no hidden restarts and no retry loops
- Infra reuse:
  - keep existing scripts and docs; tighten behavior/contracts rather than introducing new tooling stacks

## 4) Phase Plan (Implementation Specs)

### Phase 1 - Quick wins (lowest risk)

- **Goal:** Make local verification deterministic and remove restart-loop behavior around port 3001
- **Exact files to modify:**
  - `scripts/ai-doctor.ts`
  - `scripts/ai-verify.ts`
  - `scripts/ai-proof.ts`
  - `docs/skills/local-dev-faststart.md`
  - `.ai/CRITICAL_RULES.md`
  - `.ai/VERIFICATION_REQUIRED.md`
- **Exact behavior changes:**
  - Standardize three-state server messaging: `healthy 3001`, `3001 free`, `3001 occupied but unhealthy`
  - In `auto` mode, prefer a non-destructive fallback to test-mode verification when 3001 is unhealthy/unavailable
  - Keep explicit dev-only path for debugging against user-visible localhost state
- **Mobile/a11y requirements:** N/A (non-UI tooling/docs change)
- **Risks / edge cases:**
  - masking real dev-server issues if fallback messaging is unclear
  - inconsistent behavior between scripts if one path is updated and another is not
- **Metrics:**
  - zero kill/restart logic in automation scripts
  - one successful verification bundle for dev path and one for test path
  - reduced "blocked by 3001" incidents in session log notes

### Phase 2 - Onboarding / friction removal

- **Goal:** Persist a canonical access matrix so agents can execute without repeatedly rediscovering permissions/tool gaps
- **Exact files to modify:**
  - `.ai/TOOLING_MANIFEST.md`
  - `.ai/MCP_SETUP.md`
  - `docs/skills/codex-mcp-setup.md`
  - `.ai/AI_ENABLEMENT_BLUEPRINT.md`
- **Access matrix requirements:**
  - For each external surface, define required scope + optional scope + fallback:
    - GitHub (repo read/write + actions read)
    - Vercel (deployment/log read)
    - Sentry (issue/read triage)
    - GA4 + Search Console (read analytics/SEO)
    - Ad platform dashboards (read performance)
  - Document what can remain least-privilege without blocking execution
- **Risks / edge cases:**
  - over-requesting permissions
  - stale scope docs after provider-side permission changes
- **Metrics:**
  - 100% of recurring blockers have a mapped required access entry
  - "missing access" blockers become explicit and actionable within one message

### Phase 3 - Data correctness + performance safety

- **Goal:** Convert autonomy setup into a recurring execution loop for UX, accessibility, SEO, and monetization improvements
- **Exact files to modify:**
  - `.ai/BACKLOG.md`
  - `.ai/STATE.md`
  - `.ai/plans/ad-monetization-strategy.md`
  - relevant feature plans under `.ai/plans/`
- **Deterministic ops:**
  - each sprint selects one conversion/retention/SEO target, one UX/a11y quality target, and one monetization quality target
  - each target includes baseline metric, expected lift, and rollback trigger
- **Default entities (check-and-create/upsert):**
  - reuse existing dashboards/reports and proof paths in `reports/verification/` and `reports/proof/`
- **Performance plan (batching/caching):**
  - keep proof generation in existing scripts; avoid adding new CI stages unless backlog data justifies it
- **Risks / edge cases:**
  - scope creep into unrelated features
  - ad optimization changes degrading UX/accessibility if not guarded by proof
- **Metrics:**
  - consistent proof bundles attached to each shipped phase
  - no undocumented scope expansion in session logs

## 5) Open Questions (Plan is incomplete until resolved)

- None blocking Phase 1.
- Optional later decision: whether to support a dedicated agent dev port beyond 3001/3002 for parallel experiments.

## 6) Rollback Plan

- Revert script/doc commits for this initiative as a single unit.
- Restore previous `ai:verify` behavior if fallback logic causes false confidence.
- Keep strict `--dev` mode available so local-server debugging can continue without interruption.
- If any phase creates confusion, pause implementation and update this plan + session log before retrying.

## Appendix: Drift Checks (run before implementation)

- Naming collisions search results:
  - `rg -n "3001|never kill port|reuse" .ai AGENTS.md README.md docs/skills -S`
  - port policy appears in multiple files; phase 1 must update all relevant sources together
- Route matching safety notes:
  - N/A for this initiative (tooling/process, not route behavior)
- Infra reuse confirmation:
  - all planned changes target existing scripts/docs; no new runtime dependency required
