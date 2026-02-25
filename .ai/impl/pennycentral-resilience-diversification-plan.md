# PennyCentral Resilience + Diversification Plan

**Status:** PHASE 1 IN PROGRESS (`R1` + `R2` + `R3` + `R4-spec` + `R5-spec` completed; `R6` next)  
**Created:** 2026-02-19  
**Last updated:** 2026-02-19  
**Owner:** Cade (founder)

---

## 0) Alignment Gate (Completed)

- **GOAL:** Build a contingency and growth plan that reduces dependency on Home Depot penny-item permanence and Facebook-only traffic while protecting founder wellbeing.
- **WHY:** Current value concentration (single retailer policy + single dominant channel) creates fragility for income stability and long-term survivability.
- **DONE MEANS:** A phased, implementation-ready roadmap with exact surfaces, risks, metrics, and autonomous next-task queue.
- **NOT DOING:** No runtime implementation in this session, no new dependencies, no DB schema changes.
- **CONSTRAINTS:** Charter-first priorities, trust-first guidance, no manipulative engagement tactics, founder cognitive-load protection (single next action default).
- **ASSUMPTIONS:** Core loop (`/guide` -> `/penny-list` -> `/report-find`) remains the value engine during diversification.
- **CHALLENGES:** Diversify without alienating current power users or diluting submission quality.

---

## 1) Problem Statement (Founder-Critical)

PennyCentral currently faces three compounding concentration risks:

1. **Policy risk:** Penny-item availability is controlled by external retailer behavior.
2. **Channel risk:** Heavy reliance on social/community funneling.
3. **Cognitive risk:** Founder decision load is high when strategy branches are unclear.

This plan addresses all three with one strategy: preserve the existing core loop while building recurring-value adjacent utility.

---

## 2) Strategic Model (Two Engines)

### Engine A: Core Penny Utility (must stay strong)

- Keep authority in penny mechanics, recency, and report quality.
- Protect the contribution flywheel and power-user trust.

### Engine B: Broader Deal Intelligence (must be additive)

- Extend founder expertise into transferable decision frameworks:
  - what to prioritize,
  - what to skip,
  - when resale effort is not worth it,
  - how to avoid storage/attention/headache traps.

Rule: Engine B cannot degrade Engine A quality.

---

## 3) North-Star Outcomes (90-180 day target)

1. Non-Facebook sessions become a stable growth contributor.
2. At least one recurring content/product line remains useful even if penny-item policies tighten.
3. Founder workload decreases through standardized AI execution and clearer decision queues.
4. Revenue resilience improves through traffic/source diversification and trust-safe monetization.

---

## 4) Phase Plan (Implementation-Ready)

## Phase 1 (Weeks 1-2): Decision-Framework Layer (No New Infrastructure)

### Goal

Turn founder practical judgment into reusable, beginner-safe guidance without major architecture changes.

### Exact surfaces (planned)

- `components/guide/sections/ResponsibleHunting.tsx`
- `app/guide/page.tsx`
- `app/page.tsx`
- `app/sku/[sku]/page.tsx`
- `components/penny-list-card.tsx`

### Planned outputs

1. Add a canonical "Worth-It Filter" framework (use / donate / resell / skip).
2. Add "high-headache, low-value" educational framing for beginner protection.
3. Add one recurring "Decision Quality" callout route link from guide/home surfaces.

### Copy/naming decisions (canonical)

- `Worth-It Filter`
- `Use / Gift / Donate / Resell / Skip`
- `Decision Quality over Accumulation`

### Risks

- Could sound preachy if tone is not practical.
- Could discourage new hunters if framed as judgment instead of guidance.

### Metrics

- Guide engagement depth (scroll/time).
- `report_find_click` and `find_submit` guardrails remain stable.
- Reduced "overwhelm/confusion" language in founder feedback loops.

---

## Phase 2 (Weeks 3-6): Clearance Intelligence Spine (Adjacent Utility)

### Goal

Create evergreen value that is still useful when specific penny opportunities slow.

### Exact surfaces (planned)

- Reuse existing guide chapter architecture:
  - `app/guide/*`
  - `components/guide/sections/*`
  - `components/guide/GuideNav.tsx`
- IA touchpoints:
  - `components/navbar.tsx`
  - `components/footer.tsx`

### Planned outputs

1. "What Actually Moves vs What Stalls" (practical resale reality guidance).
2. "Storage and Attention Cost" framework (cost of holding low-liquidity items).
3. "Beginner Mistake Patterns" guide layer with plain-language examples.

### Risks

- Route/nav clutter if expansion is not sequenced.
- Might drift into generic blogging if evidence-backed examples are not used.

### Metrics

- Non-branded search impressions/clicks for deal/clearance intent terms.
- Return visits to these new sections.
- Conversion from educational pages to core utility pages (`/penny-list`, `/report-find`).

---

## Phase 3 (Weeks 7-10): Channel Independence Loop

### Goal

Reduce funnel fragility by creating repeatable inbound pathways beyond Facebook.

### Exact surfaces (planned)

- Existing digest stack:
  - `app/api/subscribe/route.ts`
  - `app/api/cron/send-weekly-digest/route.ts`
  - corresponding email templates under `emails/`
- Existing analytics contract:
  - `lib/analytics.ts`
  - `.ai/topics/ANALYTICS_CONTRACT.md`

### Planned outputs

1. Weekly "high-signal decisions" digest section (not just raw finds).
2. Short-form content repurposing pipeline (guide snippets -> social channels -> site).
3. Explicit "website -> Facebook group" giveback loop while also supporting standalone growth.

### Risks

- Content production burden could overload founder if not templatized.
- Vanity channel output without conversion tracking.

### Metrics

- Share of traffic from non-Facebook sources.
- Email open/click-through contribution to repeat sessions.
- Direct/organic mix trend over 30-60 day windows.

---

## Phase 4 (Weeks 11-16): Revenue Resilience Hardening

### Goal

Stabilize income potential with trust-safe monetization tied to useful intent, not attention traps.

### Exact surfaces (planned)

- `app/transparency/page.tsx`
- monetization topics/registers under `.ai/topics/`
- ad analytics/guardrail scripts under `scripts/`

### Planned outputs

1. Monetization guardrails aligned to user value and trust.
2. Measurement framework for revenue per returning visitor, not only pageview volume.
3. Clear go/no-go rules for scaling channels or offers.

### Risks

- Short-term RPM moves that hurt trust/retention.
- Conflicts between ad pressure and core loop clarity.

### Metrics

- Revenue trend vs retention trend (must not diverge negatively).
- Returning visitor rate and session quality stability.

---

## 5) Autonomous Execution Protocol (Future Agents)

When Cade is offline or overloaded:

1. Pick the next unchecked task in this plan that does **not** require approval.
2. Keep output in single-step, low-branch format.
3. If a task needs approvals (new major route/dependency/UI workflow shift), pause and ask exactly one plain-English question.
4. After each completed task:
   - run required verification lanes,
   - update `.ai/SESSION_LOG.md` + `.ai/STATE.md`,
   - provide a handoff block for future AI agents.

---

## 6) Execution Queue (Ready Now)

| ID  | Task                                                                           | Approval Needed                   | First file(s)                                                                                         | Expected impact                                        |
| --- | ------------------------------------------------------------------------------ | --------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| R1  | ✅ Completed - Worth-It Filter scaffold on guide hub                           | Yes (UI copy touches)             | `components/guide/sections/ResponsibleHunting.tsx`, `app/guide/page.tsx`                              | Reduces beginner overwhelm; improves decision quality  |
| R2  | ✅ Completed - diversification metrics contract hardened                       | No (docs/analytics contract only) | `.ai/topics/ANALYTICS_CONTRACT.md`, `.ai/topics/RESILIENCE_GROWTH_CURRENT.md`                         | Enables measurable progress                            |
| R3  | ✅ Completed - Option B balanced discoverability links                         | Yes (IA/copy changes)             | `app/page.tsx`, `app/guide/page.tsx`, `components/navbar.tsx`, `components/footer.tsx`                | Improves discoverability and survivability             |
| R4  | ✅ Completed (planning only) - weekly "Decision Quality" digest section spec   | No (planning/doc)                 | `.ai/impl/pennycentral-resilience-diversification-plan.md`, `.ai/topics/RESILIENCE_GROWTH_CURRENT.md` | Implementation-ready recurring value contract          |
| R5  | ✅ Completed (planning only) - first non-penny-adjacent article brief pack     | No (docs)                         | `.ai/impl/pennycentral-resilience-diversification-plan.md`, `.ai/topics/RESILIENCE_GROWTH_CURRENT.md` | Seeds adjacent-intent growth backlog with ready specs  |
| R6  | Select 1 pilot brief and map runtime publish surface (no new route by default) | Yes (runtime copy/IA touch)       | `app/inside-scoop/page.tsx`, `app/guide/page.tsx`, `components/navbar.tsx` (if needed)                | Converts planning output into measurable shipped value |

---

## 6A) R3 Approval Proposal (Prepared 2026-02-19)

R3 is approval-gated because it changes user-facing IA/copy. Provide one explicit founder choice before implementation.

### Option A - Minimal Internal-Link Layer

- Scope:
  - Add one "Decision Quality" internal-link block on `app/page.tsx`.
  - Add one matching internal-link block on `app/guide/page.tsx`.
  - No navbar/footer changes.
- Time/risk:
  - Lowest effort and lowest regression risk.
  - Lower discoverability lift vs options B/C.
- Rollback:
  - Revert `app/page.tsx` and `app/guide/page.tsx`.
- Proof plan:
  - `npm run verify:fast`
  - `npm run e2e:smoke`
  - `npm run lint:colors`
  - `npm run ai:proof -- -- --mode=test / /guide`

### Option B - Balanced Discoverability (Recommended)

- Scope:
  - All Option A changes.
  - Add one Guide-adjacent internal link entry in `components/navbar.tsx`.
  - Add one matching footer discoverability link in `components/footer.tsx`.
- Time/risk:
  - Medium effort, medium regression risk (navigation touches).
  - Best balance of visibility and safety for Phase 1 continuity.
- Rollback:
  - Revert `app/page.tsx`, `app/guide/page.tsx`, `components/navbar.tsx`, `components/footer.tsx`.
- Proof plan:
  - `npm run verify:fast`
  - `npm run e2e:smoke`
  - `npm run lint:colors`
  - `npm run ai:proof -- -- --mode=test / /guide /penny-list`

### Option C - Aggressive IA Push

- Scope:
  - All Option B changes.
  - Add persistent adjacent-intent link clusters in both header and footer with multi-link expansion.
  - Add homepage section-level link group for adjacent-intent pages.
- Time/risk:
  - Highest effort and highest regression risk (navigation clutter risk + mobile nav complexity).
  - Highest potential discoverability lift if executed cleanly.
- Rollback:
  - Revert all IA/copy edits in home/nav/footer surfaces.
- Proof plan:
  - `npm run verify:fast`
  - `npm run e2e:smoke`
  - `npm run lint:colors`
  - `npm run ai:proof -- -- --mode=test / /guide /penny-list /faq`

## 6B) R3 Implementation Status (Completed 2026-02-19)

- Founder approval used: Option `B` (balanced discoverability).
- Runtime surfaces updated:
  - `app/page.tsx`: new Decision Quality shortcut block to `/in-store-strategy`.
  - `app/guide/page.tsx`: new Decision Quality next-step block to `/in-store-strategy`.
  - `components/navbar.tsx`: added one `Decision Quality` nav item.
  - `components/footer.tsx`: added one matching `Decision Quality` link.
- Regression coverage updated:
  - `tests/smoke-critical.spec.ts`
  - `tests/basic.spec.ts`
- Verification artifacts:
  - `npm run ai:memory:check` ✅
  - `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run verify:fast` ✅
  - `$env:NEXT_PRIVATE_BUILD_WORKER='1'; npm run e2e:smoke` ✅
  - `npm run lint:colors` ✅
  - `npm run ai:proof -- -- --mode=test / /guide /penny-list` ✅
    - Proof bundle: `reports/proof/2026-02-19T10-19-37/`

## 6C) R4 Weekly "Decision Quality" Digest Section Spec (Completed 2026-02-19, planning-only)

Scope boundary:

- This is a docs/spec artifact only.
- No runtime edits to `app/api/cron/send-weekly-digest/route.ts` or `emails/*` in this step.

### Purpose + audience

Purpose:

- Add one weekly digest section that teaches subscribers how to make better "go/no-go" decisions (not just consume a raw item list).
- Preserve trust by prioritizing practical decision framing over hype.

Primary audience segments:

1. Returning power users who want confidence-ranked signals quickly.
2. Beginners who need clear "worth it vs skip it" guidance in plain language.
3. Busy/lapsed subscribers who need one fast weekly action path.

### Input data sources + scoring logic (no schema change)

Canonical input sources:

1. Existing weekly digest query output from `app/api/cron/send-weekly-digest/route.ts` (last-7-day item set).
2. Existing Penny List fields already used by digest payloads (SKU, name, report volume, recency/state spread, optional retail/enrichment context when present).
3. Existing trust/guardrail interpretation policy in `.ai/topics/ANALYTICS_CONTRACT.md` (for fail-closed status language).

Draft scoring model (implementation target):

- `confidence_score` (0-4):
  - +2 if report count >= 3, +1 if report count = 2, else 0.
  - +1 if seen in >= 2 states, else 0.
  - +1 if last report timestamp is within 72 hours, else 0.
- `value_signal_score` (0-2):
  - +2 if retail context exists and suggests meaningful discount potential.
  - +1 if partial value context exists.
  - 0 if value context is missing.
- `headache_penalty` (0 to -2):
  - -1 for low-quality/ambiguous naming or missing identifiers.
  - -1 for known low-liquidity/high-friction item patterns (keyword list to be maintained in code, no new dependency).
- `decision_quality_score = confidence_score + value_signal_score + headache_penalty`

Eligibility rules (draft):

- A "high-confidence move" callout requires `decision_quality_score >= 4`.
- If no item meets threshold, section must fail closed to education-only guidance (no winner claim).

### Section structure + copy framework (draft template)

Section heading:

- `Decision Quality This Week`

Block A: `High-Confidence Move` (max 1 item)

- Copy frame: "If you can make one stop this week, prioritize: {item_name} ({sku})."
- Evidence line: "{report_count} reports across {state_count} state(s), last seen {relative_time}."
- Action line: "Check details in Penny List before driving."

Block B: `Worth-It vs Skip Signals` (2 bullets each, concise)

- `Worth-It signals`: concrete examples from top-scoring items.
- `Skip signals`: concrete examples from low-confidence/high-headache patterns.

Block C: `One Next Step`

- Internal-first CTA: `/penny-list`
- Secondary contribution CTA: `/report-find`
- Copy frame: "Verify first, then submit what you actually find."

Mobile-first formatting requirements (email):

- Single-column rendering; no side-by-side cards.
- Keep the section above the fold in common mobile inbox previews.
- Keep each bullet <= 120 characters when possible for scan speed.

### Guardrails + fail-closed rules

1. Never promise resale profit or certainty language.
2. Never output "high-confidence move" when threshold is not met.
3. If source fields are missing/incomplete, degrade to neutral educational copy and mark status as `INCONCLUSIVE`.
4. Respect core-loop guardrails from `.ai/topics/ANALYTICS_CONTRACT.md`; do not interpret diversification as success if `/penny-list` -> `/report-find` guardrails degrade.
5. Do not claim post-R1 guardrail pass/fail before the first valid 7-day window date: **2026-02-26**.
6. Keep analytics/search/MCP framing as collaboration continuity requirements, not a roadmap override.

### Rollback plan

Planning-step rollback (this session):

- Revert this `6C` section and restore `R4` queue row to "not completed."

Future runtime rollback (when implementation begins):

1. Remove/disable Decision Quality section generation in weekly digest composer.
2. Revert digest template back to current baseline sections only.
3. Keep event naming unchanged to avoid analytics schema drift.
4. Re-run verification lanes before redeploy.

### Proof + verification plan

For this planning-only completion:

- `npm run ai:memory:check`
- `npm run ai:checkpoint`
- `npm run verify:fast` N/A (docs-only; no runtime code-path change)
- `npm run e2e:smoke` N/A (docs-only; no route/form/API/navigation/UI-flow change)
- `npm run e2e:full` N/A (docs-only; FULL trigger not applicable)

For future runtime implementation task (separate session):

- `npm run verify:fast` (required)
- `npm run e2e:smoke` (API flow touched)
- Add/adjust tests for digest section selection + fail-closed fallback behavior
- Capture digest render proof artifact (generated email payload snapshot/log path)

## 6D) R5 Non-Penny-Adjacent Article Brief Pack (Completed 2026-02-19, planning-only)

Scope boundary:

- This is a docs/spec artifact only.
- No route/component/content publishing in this step.

### Objective

- Convert founder heuristics into reusable adjacent-intent article briefs that remain useful during low penny-item windows.
- Keep outputs tied to practical shopping outcomes, not generic deal-blog content.

### Audience + intent framing

Primary audiences:

1. Beginner hunters who need practical rules and confidence.
2. Returning hunters who want better filtering and less wasted effort.
3. Time-limited shoppers who need one clear go/no-go framework per visit.

Intent target rules:

- Prioritize adjacent-intent utility queries (clearance timing, skip signals, storage cost, effort vs payoff).
- Avoid broad entertainment-style deal content that does not connect back to the core loop.

### Brief Pack v1 (implementation-ready)

#### Brief 1: Clearance Timing Reality Check (non-penny-specific)

- Working title: `Clearance Timing by Department: What Actually Moves vs What Sits`
- Core problem solved:
  - Users overgeneralize markdown timing and waste trips on weak timing assumptions.
- Audience:
  - Beginners + intermediate hunters.
- Content outcome:
  - Teach department-level timing variability and confidence tiers.
- Draft structure:
  - H1: clearance timing reality check.
  - H2: why timing myths fail (store variance, demand variance).
  - H2: high-confidence timing signals (what to watch).
  - H2: low-confidence timing signals (what to ignore).
  - H2: one-week execution checklist (mobile scannable bullets).
- Proof inputs (future implementation):
  - Aggregated recency/state-spread patterns from `Penny List` trends.
  - Founder field heuristics for variance caveats.
- Internal links:
  - Primary CTA: `/penny-list`
  - Secondary CTA: `/guide`

#### Brief 2: Storage and Effort Cost Framework

- Working title: `When a Cheap Find Is Still a Bad Decision: Storage + Effort Cost`
- Core problem solved:
  - Users treat low purchase price as automatic value and ignore total effort/storage cost.
- Audience:
  - Power users and resell-curious users.
- Content outcome:
  - Replace price-only thinking with practical total-cost decision checks.
- Draft structure:
  - H1: cheap does not always mean worth it.
  - H2: hidden costs (storage space, time, transport, relisting friction).
  - H2: quick scoring rubric (keep / gift / donate / skip).
  - H2: headache triggers that should force a skip decision.
  - H2: one-action close: verify in list, then report only confirmed wins.
- Proof inputs (future implementation):
  - Existing Worth-It framework language from `/guide`.
  - Founder heuristics on low-liquidity/high-friction categories.
- Internal links:
  - Primary CTA: `/in-store-strategy`
  - Secondary CTA: `/report-find`

#### Brief 3: Beginner Skip Signals Playbook

- Working title: `10 Skip Signals Before Checkout (So You Do Not Burn Time)`
- Core problem solved:
  - New users lose momentum by pursuing low-confidence items that are unlikely to be good outcomes.
- Audience:
  - New and overwhelmed users.
- Content outcome:
  - Provide fast skip rules that improve decision quality and reduce frustration.
- Draft structure:
  - H1: fast skip signals.
  - H2: product-quality red flags.
  - H2: confidence red flags (weak evidence, stale recency, no spread).
  - H2: behavior red flags (panic buying, over-accumulation).
  - H2: recovery workflow: what to do instead in the same trip.
- Proof inputs (future implementation):
  - Current R4 decision-quality language conventions.
  - Existing guide sections for ethics/strategy framing.
- Internal links:
  - Primary CTA: `/guide`
  - Secondary CTA: `/penny-list`

### Prioritization model for pilot publish (R6 input)

Rank each brief on 1-5 scales:

1. `utility_impact` (likely to improve in-store decision quality quickly).
2. `core_loop_support` (strength of link-back to `/penny-list` + `/report-find`).
3. `implementation_effort` (lower effort scores higher priority).
4. `search_adjacent_potential` (non-branded adjacent-intent potential).

Pilot selection rule:

- Choose the brief with the highest combined score while keeping core-loop support >= 4.

### Guardrails + fail-closed rules

1. No certainty or income-guarantee claims.
2. No anti-community framing (guidance must support, not shame, users).
3. No dilution of core loop: every brief must include at least one link back to `/penny-list` or `/report-find`.
4. If evidence is weak for a claim, use caution language and explicitly label as heuristic.
5. Keep mobile-first readability explicit (single-column, short paragraphs, scan-friendly bullets).
6. Keep guardrail language aligned with analytics continuity rules; no success claims without metric coverage.

### Rollback plan

Planning-step rollback (this session):

- Revert `6D` and restore `R5` queue row to pending.

Future runtime rollback (R6+ when publishing starts):

1. Remove the pilot brief from publish surface.
2. Keep nav/IA unchanged unless measured value justifies persistence.
3. Revert related copy-only commits if guardrail metrics degrade.

### Proof + verification plan

For this planning-only completion:

- `npm run ai:memory:check`
- `npm run ai:checkpoint`
- `npm run verify:fast` N/A (docs-only; no runtime code-path change)
- `npm run e2e:smoke` N/A (docs-only; no route/form/API/navigation/UI-flow change)
- `npm run e2e:full` N/A (docs-only; FULL trigger not applicable)

For future runtime implementation task (R6+):

- `npm run verify:fast`
- `npm run e2e:smoke` (route/content publish touchpoints)
- Capture one before/after internal-link path proof (source page -> core loop target)
- Record adjacent-intent + core-loop guardrail reads per `.ai/topics/ANALYTICS_CONTRACT.md`

---

## 7) Drift Checks (2026-02-19)

Source: `python C:\Users\cadeg\.codex\skills\pc-plan-drift-check\scripts\drift_check.py --out .ai/_tmp/drift-check.md`

- Naming collisions (`My List`/`My Lists`): none found.
- Risky active-route `includes(...)` logic: none found.
- Touch-target sub-44px hints: none found.
- Documentation icon-language drift still exists in legacy planning artifacts (bookmark vs heart wording in older docs). Non-blocking for this plan but should be cleaned during adjacent docs passes.
- R3 prep refresh (`.ai/_tmp/drift-check.md` regenerated on 2026-02-19): no new runtime blockers; same legacy-doc icon-language drift remains non-blocking.
- R4 planning refresh (`.ai/_tmp/drift-check.md` regenerated on 2026-02-19): no new naming/route/touch-target blockers affecting this plan update; legacy icon-language docs drift remains non-blocking.
- R5 planning refresh (`.ai/_tmp/drift-check.md` regenerated on 2026-02-19): no new naming/route/touch-target blockers affecting this plan update; legacy icon-language docs drift remains non-blocking.

---

## 8) Out of Scope (Current Phase 1 Continuation)

- Any R3 Option C IA expansion beyond the approved Option B scope.
- Any R4 runtime digest implementation in this session (spec only).
- Any R5 runtime article publishing in this session (spec only).
- Any dependency additions.
- Database migrations.
- Monetization config changes in production.
