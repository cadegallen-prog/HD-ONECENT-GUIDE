# <Feature Name> Plan (Living)

**Created:** YYYY-MM-DD  
**Last updated:** YYYY-MM-DD  
**Status:** Idea | Planning | Approved (Not Implemented) | In Progress | Shipped | Deferred  
**Owner:** Cade (founder)

## 0) GOAL / WHY / DONE MEANS

**GOAL:**  
**WHY:**  
**DONE MEANS:**

-

## 1) Hard Constraints (Non-Negotiable)

- Reuse existing infrastructure by default (no new tables/routes unless explicitly approved)
- No new dependencies unless explicitly approved
- Design tokens only (no raw Tailwind palette colors)
- Verification required when implementing (lint/build/unit/e2e + Playwright for UI)

## 2) Current State (What exists today)

Keep this short. If a deeper audit is needed, link it here:

- Audit doc (optional): `.ai/topics/<FEATURE>_CURRENT.md`
- Existing surfaces:
- Existing data flow:
- Current pain points:

## 3) Decisions (Prevent Drift)

Record decisions that must not be re-decided later:

- Naming/copy:
- Icons:
- Mobile/a11y standards:
- Active-route matching rules:
- Infra reuse:

## 4) Phase Plan (Implementation Specs)

### Phase 1 - Quick wins (lowest risk)

- **Goal:**
- **Exact files to modify:**
- **Exact UI/copy changes:**
- **Mobile/a11y requirements:**
- **Risks / edge cases:**
- **Metrics:**

### Phase 2 - Onboarding / friction removal

- **Goal:**
- **Exact files to modify:**
- **Auth / intent persistence / idempotency:**
- **Risks / edge cases:**
- **Metrics:**

### Phase 3 - Data correctness + performance safety

- **Goal:**
- **Exact files to modify:**
- **Deterministic ops:**
- **Default entities (check-and-create/upsert):**
- **Performance plan (batching/caching):**
- **Risks / edge cases:**
- **Metrics:**

## 5) Open Questions (Plan is incomplete until resolved)

-

## 6) Rollback Plan

- How to revert safely if this change causes issues:

## Appendix: Drift Checks (run before implementation)

- Naming collisions search results:
- Route matching safety notes:
- Infra reuse confirmation:
