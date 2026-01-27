# Plans Index (Canonical)

**Purpose:** One place to find every planned (or in-progress) change. This is the canonical registry used by Codex, Claude Code, and Copilot Chat.

## Status vocabulary (use consistently)

- **Idea**: rough notes; not implementable yet
- **Planning**: being refined; not approved to implement
- **Approved (Not Implemented)**: ready to build; waiting for "go"
- **In Progress**: currently being implemented
- **Shipped**: implemented + verified + deployed
- **Deferred**: intentionally paused; keep the plan for later

## How to add a new plan (standard)

1. Create `.ai/plans/<slug>.md` from `.ai/plans/_TEMPLATE.md`
2. Add it to this index with a status + last-updated date
3. If the plan references a deeper audit, link to a topic doc in `.ai/topics/`

---

## Active / Noteworthy Plans

| Plan                                    | Status                     | Priority          | Last updated | Notes                                        |
| --------------------------------------- | -------------------------- | ----------------- | ------------ | -------------------------------------------- |
| `.ai/plans/my-list-elevation.md`        | Approved (Not Implemented) | P1 (Retention)    | 2026-01-21   | 3-phase roadmap; strict infra reuse          |
| `.ai/plans/ad-monetization-strategy.md` | Planning                   | P1 (Monetization) | 2026-01-26   | Monumetric vs Ezoic; awaiting email response |
