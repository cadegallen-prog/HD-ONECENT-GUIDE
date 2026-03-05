# Research Session: [Title]

## Session Metadata

| Field         | Value                                                    |
| ------------- | -------------------------------------------------------- |
| Status        | NOT_STARTED                                              |
| Current Phase | 0 of 3                                                   |
| Source        | [YouTube URL / "Stack audit" / etc.]                     |
| Started       | YYYY-MM-DD                                               |
| Pipeline      | extract → analyze × N → audit × N → docs × N → synthesis |

## Orchestrator Notes

[Orchestrator writes planning decisions here — what areas to audit, what tech to research.
Sub-agents: READ this section but do NOT modify it.]

---

## Phase 1: Source Analysis

### Topic Extraction

**Status:** NOT_STARTED
**Assigned to:** youtube-researcher (extract-topics skill)

**Topics Found:**

<!-- Sub-agent fills this in as a numbered list -->

---

### Topic 1: [Name]

**Status:** NOT_STARTED
**Assigned to:** youtube-researcher (analyze-topic skill)

**What it is:**

<!-- 2-3 sentences, plain English, define technical terms -->

**Relevant codebase files:**

<!-- At least 2 file paths with why each is relevant -->

**Current state in our code:**

<!-- What we currently do — must reference actual code read -->

**Recommendation:**

<!-- Specific, actionable — not "consider X" but "in file.ts, do [specific thing]" -->

**Priority:** _ | **Effort:** _ | **Risk:** \_

**Quality Gate:** NOT_CHECKED

---

<!-- Copy the Topic N block above for each additional topic -->

---

## Phase 2: Codebase Audit

### Audit Scope

**Status:** NOT_STARTED
**Areas to audit:** [orchestrator fills this from Phase 1 findings]

### Area 1: [Name]

**Status:** NOT_STARTED
**Assigned to:** codebase-auditor (audit-area skill)
**Files to read:** [specific files — orchestrator pre-fills from Phase 1]

**Findings:**

<!-- Auditor fills this in -->

**Positive patterns found:**

<!-- Things that are done WELL — prevents future agents from "fixing" -->

**Issues found:**

<!-- Each with file path, description, and severity -->

**Quality Gate:** NOT_CHECKED

---

## Phase 3: Documentation Research

### Technologies to Research

**Status:** NOT_STARTED
**Technologies:** [orchestrator fills this from Phase 1 findings]

### Tech 1: [Name]

**Status:** NOT_STARTED
**Assigned to:** docs-researcher (research-technology skill)
**Our version:** [from package.json]
**Current version:** [agent looks this up]

**Key changes since our version:**

<!-- What's new, deprecated, or breaking -->

**Patterns we should adopt:**

<!-- Specific to our codebase — with file paths -->

**Quality Gate:** NOT_CHECKED

---

## Synthesis

**Status:** NOT_STARTED

### Top Findings (P0-P1 only)

<!-- Orchestrator fills this after all phases complete -->

### Implementation Order

<!-- Dependency-aware sequence -->

### Plain English Summary for Cade

<!-- No jargon, no code references — just what matters and why -->
