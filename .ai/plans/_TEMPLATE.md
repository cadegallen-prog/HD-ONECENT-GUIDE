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

## 4) Execution Topology (Required for Large Work)

- Parent plan objective:
- Child slice list (ordered):
  - `S1`:
  - `S2`:
  - `S3`:
- Slice dependency graph:
  - `S2` depends on:
  - `S3` depends on:
- Default slice-size rule: one user outcome per slice unless founder-approved exception is recorded.
- Stop/Go checkpoint rule: do not start next slice until current slice acceptance + verification lane pass.

## 5) Slice Specs (Implementation-Ready)

### Slice S1 - <Name>

- **Goal (single outcome):**
- **Exact files to modify:**
- **Copy/naming changes:**
- **Mobile/a11y requirements:**
- **Risks / edge cases:**
- **Acceptance criteria:**
- **Rollback path:**
- **Verification lane:**

### Slice S2 - <Name>

- **Goal (single outcome):**
- **Exact files to modify:**
- **Copy/naming changes:**
- **Mobile/a11y requirements:**
- **Risks / edge cases:**
- **Acceptance criteria:**
- **Rollback path:**
- **Verification lane:**

## 6) Open Questions (Plan is incomplete until resolved)

-

## 7) Rollback Plan

- How to revert safely if this change causes issues:

## Appendix: Drift Checks (run before implementation)

- Naming collisions search results:
- Route matching safety notes:
- Infra reuse confirmation:
