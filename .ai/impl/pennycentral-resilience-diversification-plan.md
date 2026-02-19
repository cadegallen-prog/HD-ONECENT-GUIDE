# PennyCentral Resilience + Diversification Plan

**Status:** PHASE 1 IN PROGRESS (`R1` + `R2` + `R3` completed; `R4` next)  
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

| ID  | Task                                                                    | Approval Needed                   | First file(s)                                                                          | Expected impact                                       |
| --- | ----------------------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| R1  | ✅ Completed - Worth-It Filter scaffold on guide hub                    | Yes (UI copy touches)             | `components/guide/sections/ResponsibleHunting.tsx`, `app/guide/page.tsx`               | Reduces beginner overwhelm; improves decision quality |
| R2  | ✅ Completed - diversification metrics contract hardened                | No (docs/analytics contract only) | `.ai/topics/ANALYTICS_CONTRACT.md`, `.ai/topics/RESILIENCE_GROWTH_CURRENT.md`          | Enables measurable progress                           |
| R3  | ✅ Completed - Option B balanced discoverability links                  | Yes (IA/copy changes)             | `app/page.tsx`, `app/guide/page.tsx`, `components/navbar.tsx`, `components/footer.tsx` | Improves discoverability and survivability            |
| R4  | Build weekly "Decision Quality" digest section spec                     | No (planning/doc)                 | `app/api/cron/send-weekly-digest/route.ts`, `emails/*`, `.ai/impl/*`                   | Recurrent value beyond penny-only spikes              |
| R5  | Prepare first non-penny-adjacent article briefs from founder heuristics | No (docs)                         | `docs/` or `.ai/topics/` planning artifacts                                            | Seeds organic diversification backlog                 |

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

---

## 7) Drift Checks (2026-02-19)

Source: `python C:\Users\cadeg\.codex\skills\pc-plan-drift-check\scripts\drift_check.py --out .ai/_tmp/drift-check.md`

- Naming collisions (`My List`/`My Lists`): none found.
- Risky active-route `includes(...)` logic: none found.
- Touch-target sub-44px hints: none found.
- Documentation icon-language drift still exists in legacy planning artifacts (bookmark vs heart wording in older docs). Non-blocking for this plan but should be cleaned during adjacent docs passes.
- R3 prep refresh (`.ai/_tmp/drift-check.md` regenerated on 2026-02-19): no new runtime blockers; same legacy-doc icon-language drift remains non-blocking.

---

## 8) Out of Scope (Current Phase 1 Continuation)

- Any R3 Option C IA expansion beyond the approved Option B scope.
- Any dependency additions.
- Database migrations.
- Monetization config changes in production.
