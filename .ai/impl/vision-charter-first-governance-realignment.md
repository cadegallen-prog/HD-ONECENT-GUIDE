# Vision Charter-First Governance Realignment

Last updated: 2026-02-11
Owner: Founder-approved handoff execution
Status: Extended execution active (Phases 0-8 completed; targeted execution started for Phases 10 + 12; remaining extension phases pending)

## Progress Snapshot (2026-02-11)

- Phase 0: ✅ Completed
- Phase 1: ✅ Completed
- Phase 2: ✅ Completed
- Phase 3: ✅ Completed
- Phase 4: ✅ Completed
- Phase 5: ✅ Completed (canonical owner refactor + secondary-doc alignment pass)
- Phase 6: ✅ Completed (code-level trust/utility audit + remediation plan docs)
- Phase 7: ✅ Completed (drift checker + npm + CI wiring)
- Phase 8: ✅ Completed (README governance quick entry + `.ai` memory updates)
- Phase 10: 🟨 Partially executed (deterministic `ai:proof` runtime contract shipped with explicit `dev`/`test` modes and fail-fast checks)
- Phase 12 (P0 slice): 🟨 Partially executed (`/`, `/report-find`, `/sku/[sku]` trust/utility remediation items shipped)
- Phase 9 + 11 + 13 + 14 + 15 + 16 + 17: 📝 Planned; execution pending
- Decision closed: `ai:verify` defaults to isolated test mode (3002); dev mode (3001) is explicit opt-in via `-- dev` (or `--mode=dev`).

## Summary

Establish one strict shared operating model so the founder and any future agent have identical vision, rules, decision logic, and collaboration behavior before implementation work.

## Locked Decisions

1. Canonical source of truth: Vision Charter.
2. Session behavior: mandatory Alignment Gate.
3. Pushback style: strong pushback by default.
4. Program order: Charter -> Map -> Refactor.
5. Rule style: checklist-strict.
6. Enforcement: Human + CI guardrails.
7. Authority model: Charter is highest authority.
8. Charter change control: founder approval required.
9. Alignment Gate format: fixed strict template.
10. Scope: full governance sweep + deep trust/utility UI audit.
11. Archive policy: hybrid.
12. Add 3001 deterministic runtime contract (no thrash).
13. Add Playwright-first UI collaboration loop.

## Current-State Facts

1. Inventory baseline: 334 files (excluding archive/build/vendor), 50 route files, 57 components, 31 scripts, 68 `.ai` docs, 26 `docs` markdown files.
2. Baseline quality: `npm run verify:fast` passes.
3. Design governance baseline: `npm run lint:colors` passes, `npm run check-contrast` passes.
4. Drift signal: governance docs mix lane verification with legacy "all 4 gates always" guidance.
5. Working tree status at last check: clean.

---

## Implementation Phases

### Phase 0 - Reset Unapproved Edits

1. Revert all unapproved working-tree edits.
2. Delete untracked prototype charter files.
3. Confirm clean baseline with `git status --short`.
4. Produce reset receipt listing restored files.

### Phase 1 - Create Highest-Authority Vision Charter

Create `VISION_CHARTER.md` with:

1. Mission and product vision.
2. Why that vision is correct now.
3. Non-negotiables.
4. Anti-goals.
5. Decision hierarchy (retention, submissions, trust, SEO, monetization order).
6. Mandatory pushback policy.
7. Session Alignment Gate contract.
8. Rule conflict resolution: Charter wins.
9. Change-control: founder approval required.
10. Explicit rejection criteria (what agents must refuse without approval).

### Phase 2 - Mandatory Alignment Gate

Add fixed session-start block to canon docs:

- GOAL
- WHY
- DONE MEANS
- NOT DOING
- CONSTRAINTS
- ASSUMPTIONS
- CHALLENGES

Rules:

1. No mutation before this block is complete.
2. If gate is incomplete, fail closed (no edits).

### Phase 3 - Full Governance Surface Map + Conflict Matrix

Create:

- `governance-surface-map-2026-02.md`
- `governance-conflict-matrix-2026-02.md`

Include all rule-bearing docs in `.ai/`, root governance docs, and governance-adjacent `docs/skills` docs.

For each conflict record:

- source file
- conflicting file
- risk impact
- recommended canonical owner
- keep/modify/remove
- rationale

### Phase 4 - Red-Team Rule Harm Audit

Create `rule-harm-register-2026-02.md` and evaluate high-impact rules for:

1. architecture truth alignment
2. delivery speed impact
3. product outcome impact
4. misuse risk by future agents

Classify each KEEP / MODIFY / REMOVE and require evidence note for every KEEP.

### Phase 5 - Canon Refactor (Strict Canon + Redirects)

Rewrite canonical docs to align with Charter and convert duplicate/conflicting secondary docs into redirects/references.

Single-owner rule domains:

- Vision/authority: `VISION_CHARTER.md`
- Read order: `README.md` + `START_HERE.md`
- Agent behavior: `AGENTS.md`
- Critical non-negotiables: `CRITICAL_RULES.md`
- Technical boundaries: `CONSTRAINTS.md`
- Verification contract: `VERIFICATION_REQUIRED.md`
- Collaboration/approvals: `CONTRACT.md` + `DECISION_RIGHTS.md`
- Closeout/handoff: `HANDOFF_PROTOCOL.md`

### Phase 6 - Deep Trust/Utility UI + Design-System Audit

Create `ui-trust-utility-audit-2026-02.md`.

Audit routes:

- `/`
- `/penny-list`
- `/report-find`
- `/sku/[sku]`
- `/guide`
- `/store-finder`
- `/about`
- `/support`

Audit dimensions:

- first-impression trust
- clarity of value proposition
- scan speed/hierarchy
- in-store usability friction
- CTA discipline
- mobile ergonomics
- design token consistency

Output plan:

- `ui-trust-utility-remediation.md` with P0/P1/P2 tied to business outcomes.

### Phase 7 - Drift Prevention (Human + CI)

1. Add `check-doc-governance-drift.mjs`.
2. Add `npm run check:docs-governance`.
3. Enforce in CI for governance-touching changes.
4. Fail on:

- conflicting verification models
- conflicting read orders
- stale architecture statements in operational docs
- duplicate policy definitions outside canonical owners

### Phase 8 - Memory + Handoff Closure

1. Update `STATE.md`, `SESSION_LOG.md`, `BACKLOG.md`.
2. Add governance quick-entry section in `README.md`.
3. Publish next-agent handoff block with risks + immediate next step.

---

## Program Extension (Missing Scope Captured)

These phases continue the same program and encode the founder's broader intent so planning does not collapse into governance-only work.

### Phase 9 - Founder Spirit + Working Relationship Contract

1. Codify a co-founder operating model where founder and agent function as one decision system.
2. Require strong pushback by default for low-leverage, contradictory, or drift-inducing work.
3. Require outcome-linked recommendations (retention, submissions, trust, SEO, monetization), not procedural output.
4. Require same-session memory persistence for high-impact decisions made in chat.

### Phase 10 - Deterministic Runtime + Playwright Collaboration Contract

1. Enforce a deterministic runtime contract: founder preview on 3001 remains persistent and non-thrashing.
2. Keep verification default isolated (`ai:verify` test mode on 3002) unless founder explicitly requests dev-mode verification.
3. Enforce fail-fast behavior for unhealthy 3001 with explicit next steps; ban repeated retry/port-epiphany loops.
4. Enforce Playwright-first UI iteration: open browser first, target elements precisely, show before/after, ask accept/tweak/revert/alt each round.

### Phase 11 - Core Loop Friction Elimination (Report a Find -> Penny List)

1. Design a SKU-first submission flow with auto-enrichment as the default path.
2. Reduce required user input to absolute minimum while maintaining data quality safeguards.
3. Add safe unresolved-SKU handling (queue/manual enrichment) instead of hard failure.
4. Improve "already listed" reporting flow to maximize one-tap confirmations and repeat contribution.

### Phase 12 - Trust + Legitimacy Conversion Layer

1. Improve first-impression trust for non-community visitors landing cold from search.
2. Add clear legitimacy signals across key routes (`/`, `/penny-list`, `/report-find`, `/sku/[sku]`).
3. Add explicit freshness/verification cues where users make decisions.
4. Ensure trust copy is direct, consistent, and utility-first.

### Phase 13 - SEO Discovery Expansion (Non-Brand Growth)

1. Shift from brand-only discoverability to intent-matched non-brand entry pages.
2. Map high-intent query clusters to pages and internal links that feed the core loop.
3. Prioritize search snippets and metadata for higher CTR and clarity.
4. Tie SEO work to retention/contribution outcomes, not impressions alone.

### Phase 14 - Retention Engine (Email + Feedback Loop)

1. Formalize email rhythm for return visits (digest/reminder/contribution CTA cadence).
2. Embed contribution prompts inside retention channels, not just visit prompts.
3. Stand up structured feedback intake for bugs, feature requests, confusion points, and FAQ candidates.
4. Feed validated feedback into prioritized P0/P1/P2 backlog updates.

### Phase 15 - Monetization Sequencing + Contingency Paths

1. Define near-term monetization sequence that does not compromise trust/utility.
2. Track ad and affiliate pipelines as parallel tracks with explicit contingency paths.
3. Evaluate promotions/giveaways as measured growth experiments with long-term retention criteria.
4. Require policy/legal/trust checks before introducing monetization changes on utility routes.

### Phase 16 - Competitive Positioning + Expansion Gate

1. Treat "nationwide clearance aggregation" as a gated expansion track, not a default immediate pivot.
2. Require evidence that expansion beats core-loop ROI before execution.
3. If expansion is approved, define whether it is integrated into PennyCentral or split as a separate product surface.
4. Preserve founder's current moat: faster in-store utility, trust, and contribution throughput.

### Phase 17 - Metrics + Experiment Governance

1. Define baseline metrics before major changes (repeat visits, submission conversion, contributor repeat rate, trust engagement, non-brand CTR).
2. Require every major change to carry hypothesis, success metric, and stop/continue criteria.
3. Enforce evidence-based sequencing: high-leverage experiments first, polish later.
4. Ensure reporting closes the loop into `.ai/STATE.md`, `.ai/SESSION_LOG.md`, and `.ai/BACKLOG.md`.

## Open Decisions (Program Extension)

1. Report-form policy: keep store/city optional versus requiring location fields for stronger local utility.
2. Admin seeding policy: cadence and quality thresholds for seeded items to prevent list inertia.
3. Retention cadence: weekly versus twice-weekly email rhythm for the next 4-8 weeks.
4. Expansion gate criteria: objective threshold for when aggregation work outranks core-loop improvements.

---

## Critical Addendum A - localhost (line 3001) Contract

1. 3001 is founder persistent preview server.
2. Agent must never kill/restart healthy 3001.
3. Verification should avoid touching 3001 unless explicitly requested.
4. Fail-fast on unhealthy 3001 with explicit next steps, no loops.
5. Eliminate repeated "port discovery epiphany" behavior.

## Critical Addendum B - Playwright-First UI Workflow

1. For UI tasks, open Playwright first.
2. Use element-level interaction for precise targeting.
3. Show before/after immediately after each UI change.
4. Ask accept/tweak/revert per iteration.
5. Continue until explicit founder approval of UI result.

---

## Test Cases

1. Governance consistency: canonical docs agree on lane model.
2. Authority test: Charter resolves rule conflicts.
3. Session test: Alignment Gate appears before mutation.
4. Drift test: intentional contradiction fails `check:docs-governance`.
5. Design governance test: `lint:colors` and `check-contrast` remain green.
6. Regression: `verify:fast` after script/CI changes.

## Acceptance Criteria

1. One authoritative vision/behavior contract exists and is enforced.
2. No unresolved governance conflicts in canon docs.
3. Secondary docs stop redefining canonical policy.
4. Harmful/outdated rules are removed or rewritten.
5. Trust/utility UI audit completed with prioritized remediation.
6. Drift prevention works in both human workflow and CI.

## Decision Resolution

- Final policy: `ai:verify` defaults to test-mode isolation (3002), and dev mode (3001) is explicit opt-in (`-- dev` or `--mode=dev`).
