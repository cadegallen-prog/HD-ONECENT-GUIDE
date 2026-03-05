---
name: research-pipeline
description: "Dispatches and quality-gates the full multi-phase research pipeline using a shared session file."
---

# Skill: research-pipeline

**Description:** Orchestrates a full multi-phase research pipeline using a shared session file. Use when the user provides a YouTube video URL, asks for stack research, or requests a codebase audit. Manages topic extraction, per-topic analysis, codebase auditing, documentation research, and synthesis — all through microchunked sub-agent tasks.

## Workflow

Follow these steps in order. Do not skip steps. Do not reorder.

### 1. CREATE session file

- Copy template from `references/session-template.md` (relative to this skill)
- Fill in metadata: source URL, date, pipeline type
- Save to `.roo/research/sessions/YYYY-MM-DD-<slug>.md`
- Tell the user: "Session file created at [path]. Starting Phase 1."

### 2. PHASE 1a: Extract topics

- Spawn `new_task` to `youtube-researcher` mode:
  ```
  Extract topics from this YouTube video. Session file: [path].
  Fill in the Topic Extraction section. Do NOT analyze topics —
  just list them. Use the extract-topics skill.
  Video URL: [url]
  ```
- After completion, read the session file
- VERIFY: Topic Extraction status = COMPLETE, at least 3 topics listed
- If FAIL: spawn fix task per the fix protocol in `references/quality-gates.md`

### 3. PHASE 1b: Analyze each topic

For each topic listed in the session file:

- Spawn `new_task` to `youtube-researcher` mode:
  ```
  Analyze Topic N: [name]. Session file: [path].
  Read the transcript and our codebase files. Fill in the
  Topic N section ONLY. Use the analyze-topic skill.
  Video URL: [url]
  ```
- After completion, read the session file
- Run quality gates from `references/quality-gates.md` (Topic Analysis gate)
- Mark Quality Gate as PASS or FAIL in the session file
- If FAIL: spawn fix task (max 1 retry per topic)

### 4. PHASE 2: Plan follow-ups

- Read all Phase 1 topic analyses from the session file
- In the "Orchestrator Notes" section, write:
  - Codebase areas to audit (derived from file paths in topic recommendations)
  - Technologies to research (derived from topic content)
- Fill in Phase 2 "Audit Scope" and Phase 3 "Technologies to Research" sections
- Tell the user: "Phase 1 complete. [N] topics analyzed. Planning [X] audit tasks and [Y] docs research tasks for Phase 2."

### 5. PHASE 2a: Codebase audits

For each audit area identified in Phase 2 planning:

- Spawn `new_task` to `codebase-auditor` mode:
  ```
  Audit [area]. Session file: [path]. Read the files listed
  in your Area section. Fill in your Area section ONLY.
  Use the audit-area skill.
  ```
- Run quality gate after completion (Audit Area gate)
- Fix if needed (max 1 retry)

### 6. PHASE 2b: Docs research

For each technology identified in Phase 2 planning:

- Spawn `new_task` to `docs-researcher` mode:
  ```
  Research [technology]. Session file: [path]. Check our
  package.json version vs current. Fill in your Tech section
  ONLY. Use the research-technology skill.
  ```
- Run quality gate after completion (Technology Research gate)
- Fix if needed (max 1 retry)

### 7. PHASE 3: Synthesis

- Read the entire session file
- Fill in the Synthesis section:
  - **Top Findings:** P0-P1 items only, across all phases
  - **Implementation Order:** dependency-aware sequence
  - **Plain English Summary for Cade:** no jargon, no code references — just what matters and why
- Set session Status = COMPLETE
- Tell the user the session is done and where to find the results file

## Guardrails

- You are a DISPATCHER. You do NOT research, analyze, or audit anything yourself.
- ALL findings go in the session file, NOT in chat. Keep chat lean.
- Each sub-agent gets ONE focused task. Never combine multiple topics/areas/technologies.
- Read the session file after EVERY sub-agent completion to check results.
- Follow quality gates exactly — they are yes/no checks, not judgment calls.
- Maximum 1 fix retry per section. If the fix also fails, mark as `FAILED — MANUAL REVIEW` and move on.
- If a phase has zero items (e.g., no technologies to research), skip it and note why.
