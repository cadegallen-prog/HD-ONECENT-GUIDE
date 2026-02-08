# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-02-08 - Codex - Guide Recovery Phase 3 Drift Guard

**Goal:** Execute only Phase 3 from `.ai/impl/guide-recovery.md` and lock future guide format behavior.

**Status:** ✅ Completed (Phase 3 only; no unrelated refactors).

### Changes

- Created `.ai/topics/GUIDE_FORMAT_CONTRACT.md` per Phase 3.0 requirements.
  - Added canonical chapter template (`PageShell` + `Prose variant="guide"` + `EditorialBlock` + `ChapterNavigation`).
  - Added voice rules (action-first, "you" language, section-level caveats, max one `community-reported` mention per chapter).
  - Added locked copy reference to `.ai/topics/GUIDE_LOCKED_COPY.md`.
  - Added 2026 intel distribution map by concept and chapter ownership.
  - Added hard concept introduction order to prevent forward-references.
  - Added forbidden reintroductions list (FAQ `<details>`, sources blocks, conflicting chapter-end nav cues, dead-space regressions, per-bullet caveat spam, template-breaking ad-hoc styles, and banned hedging patterns).
  - Added drift check command reference to `npm run ai:guide:guardrails`.
- No dependency changes.
- No route model changes.

### Verification

- Guide guardrails: `npm run ai:guide:guardrails` ✅
  - Artifact: `reports/guide-guardrails/2026-02-08T20-46-00.md`
- Full 4-gate bundle: `npm run ai:verify` ✅
  - Artifact: `reports/verification/2026-02-08T20-46-17/summary.md`
  - Gate outputs:
    - `reports/verification/2026-02-08T20-46-17/lint.txt`
    - `reports/verification/2026-02-08T20-46-17/build.txt`
    - `reports/verification/2026-02-08T20-46-17/unit.txt`
    - `reports/verification/2026-02-08T20-46-17/e2e.txt`

---

## 2026-02-08 - Codex - Guide Recovery Phase 2 Implementation

**Goal:** Execute only Phase 2 from `.ai/impl/guide-recovery.md` and close the remaining FAQ/hub/visual guardrails with proof.

**Status:** ✅ Completed (Phase 2 only; Phase 3 not started).

### Changes

- Implemented Step 2.0 FAQ overhaul in `app/faq/page.tsx`:
  - Removed all `<details>` / `<summary>` usage.
  - Rendered visible grouped Q&A sections: Basics, Verification, Checkout & Policy, Etiquette & Community.
  - Kept JSON-LD FAQ schema sourced from the `faqs` array.
  - Expanded visible answer depth to clear FAQ content threshold in guardrails.
- Implemented Step 2.1 guide hub updates:
  - Added the "Where should you start?" triage section in `app/guide/page.tsx`.
  - Reduced dead space and improved scanning flow.
  - Applied hub monetization gate decision: `/guide` remains navigation-first and ad-ineligible in this phase; chapter routes remain eligibility candidates per contract.
- Implemented Step 2.1 TOC description updates in `components/guide/TableOfContents.tsx` using the canonical one-line chapter copy from the plan.
- Implemented approved Step 2.2 visual tuning in `app/globals.css`:
  - Restored `.guide-article h2` border-bottom, padding-bottom, and `mt-8`/`mb-4` rhythm with token-based color usage.
  - Added `.guide-callout-speculative`.
  - Added subtle light-mode callout shadow and dark-mode shadow suppression.
- Step 2.2d dedup rule check: Chapter 3 already retained the Chapter 2 cadence cross-reference in `app/digital-pre-hunt/page.tsx`; no additional edit required.

### Verification

- Guide guardrails: `npm run ai:guide:guardrails` ✅
  - Artifact: `reports/guide-guardrails/2026-02-08T20-32-02.md`
- Full 4-gate bundle: `npm run ai:verify` ✅
  - Artifact: `reports/verification/2026-02-08T20-32-11/summary.md`
  - Gate outputs:
    - `reports/verification/2026-02-08T20-32-11/lint.txt`
    - `reports/verification/2026-02-08T20-32-11/build.txt`
    - `reports/verification/2026-02-08T20-32-11/unit.txt`
    - `reports/verification/2026-02-08T20-32-11/e2e.txt`
- Playwright proof: `npm run ai:proof -- /guide /what-are-pennies /clearance-lifecycle /digital-pre-hunt /in-store-strategy /inside-scoop /facts-vs-myths /faq` ✅
  - Artifact bundle: `reports/proof/2026-02-08T20-37-44/`
  - Console report: `reports/proof/2026-02-08T20-37-44/console-errors.txt`
  - Non-blocking console noise remains global hydration/CSP ad-script noise from existing layout integrations (not introduced by this phase scope).

---

## 2026-02-08 - Codex - Guide Recovery Phase 0 + Phase 1 Implementation

**Goal:** Implement Phase 0 and Phase 1 from `.ai/impl/guide-recovery.md` with proof-backed verification.

**Status:** ✅ Completed (Phase 0 + Phase 1 only; Phase 2/3 intentionally not executed).

### Changes

- Implemented Phase 0 docs/contracts:
  - Created `.ai/topics/GUIDE_MONETIZATION_CONTRACT.md`.
  - Created `.ai/topics/GUIDE_LOCKED_COPY.md`.
  - Created `.ai/audits/guide-claim-matrix-2026-02-08.md`.
- Implemented Phase 0 automation:
  - Added `scripts/guide-guardrails.ts`.
  - Added npm script `ai:guide:guardrails` in `package.json`.
- Implemented Phase 1 chapter edits + H2 normalization:
  - Updated `app/what-are-pennies/page.tsx`.
  - Updated `app/clearance-lifecycle/page.tsx`.
  - Updated `app/digital-pre-hunt/page.tsx`.
  - Updated `app/in-store-strategy/page.tsx`.
  - Updated `app/inside-scoop/page.tsx`.
  - Updated `app/facts-vs-myths/page.tsx`.
  - Updated `app/faq/page.tsx` (Phase 1 scope only; FAQ visibility migration deferred to Phase 2).

### Verification

- Full 4-gate bundle: `npm run ai:verify` ✅
  - Artifact: `reports/verification/2026-02-08T18-20-32/summary.md`
- UI proof: `npm run ai:proof -- /what-are-pennies /clearance-lifecycle /digital-pre-hunt /in-store-strategy /inside-scoop /facts-vs-myths /faq` ✅
  - Artifact: `reports/proof/2026-02-08T18-26-05/`
- Guardrails: `npm run ai:guide:guardrails` ⚠️ expected fail on Phase-2-only FAQ checks
  - Artifact: `reports/guide-guardrails/2026-02-08T18-20-17.md`
