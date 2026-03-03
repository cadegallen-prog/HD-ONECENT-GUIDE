# Site Recovery Program (Canonical)

**Status:** In Progress (`S1` shipped; `S2` next)  
**Owner:** Cade (approvals), AI agents (execution)  
**Created:** 2026-03-02  
**Last updated:** 2026-03-03  
**Current-state audit:** `.ai/topics/SITE_RECOVERY_CURRENT.md`

## 0) Objective

Create a durable, repo-native recovery program for Penny Central so product improvements compound across sessions instead of resetting every time a new agent or context window starts.

## 1) Why This Exists

The problem is not "one weak page." The problem is missing continuity:

- intent has been living in chat instead of in repo memory,
- the site hierarchy has drifted between education and utility,
- large problems have not been decomposed into additive slices,
- future agents have not had one authoritative program to follow.

This plan fixes that by making the recovery program explicit, ordered, and survivable across fresh sessions.

## 2) Authority Note

- **Authoritative parent plan:** `.ai/impl/site-recovery-program.md`
- **Authoritative current-state audit:** `.ai/topics/SITE_RECOVERY_CURRENT.md`
- **Registry location (temporary governance bridge):** `.ai/plans/INDEX.md`

Current governance drift:

- newer orchestration/docs point final plans to `.ai/impl/`,
- older registry/template docs still center `.ai/plans/`.

For this recovery program, `.ai/impl/` is the source of truth. `.ai/plans/INDEX.md` remains the cross-agent registry until governance cleanup explicitly unifies the system.

## 3) Locked Program Decisions

- Homepage strategy is **proof then paths**, not pure education-first and not raw utility-first.
- Traffic posture is **hybrid organic + Facebook group**, not group-only and not SEO-only.
- Visual direction is **proof-driven field guide**, not generic blog and not app-dashboard minimalism.
- `/guide` becomes the canonical long-form guide.
- Existing chapter routes remain live as supporting references, not the primary guide spine.
- `/penny-list` remains the strongest operational surface and must stay central.
- `/store-finder` is a supporting utility, not a core front-door feature.
- IDE context stays **targeted only**:
  - parent plan,
  - current-state audit,
  - one active child plan,
  - 2-5 directly relevant source files.
- No implementation slice may silently override these decisions. If a future agent disagrees, the parent plan must be updated before code changes start.

## 4) Non-Negotiables

- Reuse existing infrastructure by default.
- No new dependencies unless a child plan explicitly justifies them.
- No raw Tailwind palette colors.
- Follow the `dev` branch workflow.
- Reuse an already healthy server on port `3001`; never kill it unless Cade explicitly asks.
- Shared-memory edits require writer-lock ownership.
- No multi-slice implementation batch. Finish one slice, verify it, update memory, stop.

## 5) S0 Completion Note

`S0` is the planning spine and is completed by this session.

Artifacts created by `S0`:

- `.ai/topics/SITE_RECOVERY_CURRENT.md`
- `.ai/impl/site-recovery-program.md`
- `.ai/impl/site-recovery-s1-hydration-stability.md`
- `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`
- `.ai/impl/site-recovery-s3-guide-core-rebuild.md`
- `.ai/impl/site-recovery-s4-penny-list-mobile-focus.md`
- `.ai/impl/site-recovery-s5-report-find-compression.md`
- `.ai/impl/site-recovery-s6-typography-template-consistency.md`
- `.ai/impl/site-recovery-s7-store-finder-supporting-role.md`
- `.ai/impl/site-recovery-s8-trust-pages-hardening.md`

This means the next implementation task is **not** another planning step. `S1` has been completed, so the next slice is `S2`.

## 6) Ordered Recovery Topology

| Slice | Status                     | Depends on | Purpose                                                            |
| ----- | -------------------------- | ---------- | ------------------------------------------------------------------ |
| `S0`  | Shipped (docs-only)        | none       | Create the durable planning spine                                  |
| `S1`  | Shipped                    | `S0`       | Remove hydration mismatch + deterministic Penny List text mismatch |
| `S2`  | Approved (Not Implemented) | `S1`       | Rebuild homepage into a proof-first front door                     |
| `S3`  | Approved (Not Implemented) | `S2`       | Rebuild guide into one canonical long-form experience              |
| `S4`  | Approved (Not Implemented) | `S2`       | Simplify Penny List mobile hierarchy while protecting utility      |
| `S5`  | Approved (Not Implemented) | `S2`       | Compress Report Find pre-form friction                             |
| `S6`  | Approved (Not Implemented) | `S2`, `S3` | Normalize typography/template hierarchy                            |
| `S7`  | Approved (Not Implemented) | `S2`, `S4` | Reposition Store Finder as a supporting utility                    |
| `S8`  | Approved (Not Implemented) | `S2`, `S3` | Harden trust pages                                                 |

## 7) Child Plan Registry

- `S1` -> `.ai/impl/site-recovery-s1-hydration-stability.md`
- `S2` -> `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`
- `S3` -> `.ai/impl/site-recovery-s3-guide-core-rebuild.md`
- `S4` -> `.ai/impl/site-recovery-s4-penny-list-mobile-focus.md`
- `S5` -> `.ai/impl/site-recovery-s5-report-find-compression.md`
- `S6` -> `.ai/impl/site-recovery-s6-typography-template-consistency.md`
- `S7` -> `.ai/impl/site-recovery-s7-store-finder-supporting-role.md`
- `S8` -> `.ai/impl/site-recovery-s8-trust-pages-hardening.md`

## 8) Implementation Entry Criteria

Before any child slice starts:

1. Open this parent plan.
2. Open `.ai/topics/SITE_RECOVERY_CURRENT.md`.
3. Open exactly one child plan.
4. Keep IDE context limited to the active slice plus 2-5 relevant files.
5. If the proposed implementation would touch more than 5 repo-tracked source files, split the slice before editing code.
6. If the proposed implementation changes a program-level decision, update this parent plan first.

## 9) Stop/Go Rule

After every implementation slice:

1. run the required verification lane,
2. collect proof artifacts,
3. update `.ai/SESSION_LOG.md` and `.ai/STATE.md`,
4. update `.ai/BACKLOG.md` only if priorities moved,
5. publish a next-agent handoff,
6. stop.

Do not continue directly into the next slice in the same uninterrupted batch.

## 10) Program-Level Acceptance Criteria

- A fresh agent can identify the next task without reading chat.
- The homepage proves value before explanation.
- The guide has one canonical beginner path.
- The Penny List and Report Find routes clearly form the core loop.
- Store Finder no longer competes for top-level importance unless later evidence justifies it.
- Cross-route typography and hierarchy feel like one system.
- No audited route emits the current hydration mismatch.

## 11) Verification Contract

- `S0` (this session): docs-only
  - `npm run ai:memory:check`
  - `npm run ai:checkpoint`
- `S1` through `S8`:
  - `npm run verify:fast`
  - `npm run e2e:smoke` for route/form/UI changes
  - Playwright screenshots for UI changes
  - console capture where hydration/runtime cleanliness is part of acceptance

## 12) Risks and Drift Controls

### Risks

- A later agent may treat the homepage as a copy problem instead of a proof/hierarchy problem.
- A later agent may try to "improve the guide" without first collapsing the architecture around one canonical guide.
- Typography cleanup could turn into ad hoc patching instead of shared-system cleanup.
- Store Finder could absorb disproportionate effort because it is technically complex, even though it is not currently a core conversion surface.

### Drift controls

- Child plans lock the product role for each route before implementation.
- No slice may silently expand scope to new routes or new dependencies.
- The parent plan is authoritative if any child plan and chat history conflict.
- The next-agent handoff must point back to this file and one specific child plan only.

## 13) Out of Scope

- New feature ideation unrelated to site recovery.
- Large navigation or routing overhauls outside the listed slices.
- New database tables or API contracts.
- Store-map infrastructure rewrites unless a later child plan makes them unavoidable.
- Any implementation beyond the active slice.

## 14) Immediate Next Task

**Single next task:** `S2 - Homepage Proof Front Door`

**Why it is next:** The site recovery program can now move into visual/front-door work because the audited hydration mismatch has been removed and the Penny List text regression is covered.

**First files to open:**

- `.ai/impl/site-recovery-s2-homepage-proof-front-door.md`
- `.ai/topics/SITE_RECOVERY_CURRENT.md`
- `app/page.tsx`
