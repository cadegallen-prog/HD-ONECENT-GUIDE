# Skill: audit-area

**Description:** Audits ONE specific area of the PennyCentral codebase for quality issues, pattern violations, and improvement opportunities. Use when the orchestrator assigns a specific codebase area from a session file. Reads every file in scope and writes findings to the session file.

## Workflow

Follow these steps in order. Do not skip steps.

### 1. Read session file

- Read the session file path and area assignment from task instructions
- Open the session file and find your assigned "### Area N" section
- Note the "Files to read" list pre-filled by the orchestrator

### 2. Read mandatory context

Read ALL of these before auditing:

- `CLAUDE.md` (stack, fragile files)
- `.ai/CONSTRAINTS.md` (what NOT to recommend changing)
- `.ai/LEARNINGS.md` (past mistakes — don't repeat findings already known)
- `.ai/SURFACE_BRIEFS.md` (what "good" looks like for each surface)

### 3. Read EVERY file in scope

- Read every file listed in your "Files to read" section
- If scope is a directory (e.g., "components/guide/"), read every file in that directory
- Do NOT sample. Read them all.

### 4. Use Sequential Thinking

Invoke the Sequential Thinking MCP with MINIMUM 5 steps:

1. What patterns exist in these files?
2. Are patterns consistent across files?
3. What's done well? (List positive findings first)
4. What issues exist? (With specific file + line references)
5. Prioritize issues by user impact

### 5. Fill in your area section

Write to your assigned Area section ONLY:

- **Findings:** Numbered list with file paths
- **Positive patterns found:** Things done well — this prevents future agents from "fixing" what isn't broken
- **Issues found:** Each with file path, description, and severity (P0-P3)
- Set Status to `COMPLETE`

### 6. Save and store

- Save the session file
- Store findings in Memory MCP

## Guardrails

- ONLY fill in YOUR assigned Area section. Do not touch other sections.
- You MUST read every file in scope before writing findings.
- Include POSITIVE findings — things done well. This is mandatory, not optional.
- Cross-reference `.ai/LEARNINGS.md` — if a finding repeats a known anti-pattern, note it but don't re-explain
- Do NOT recommend changes to fragile files listed in CONSTRAINTS.md without explicitly noting the risk
- Every issue must have: file path, description, and severity (P0-P3)
- At least 3 total findings (positive + issues combined)
