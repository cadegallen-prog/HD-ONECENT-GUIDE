---
name: research-technology
description: "Researches one assigned technology against current docs and maps upgrades to PennyCentral files."
---

# Skill: research-technology

**Description:** Researches ONE technology or framework from current documentation and compares it to PennyCentral's implementation. Use when the orchestrator assigns a specific technology from a session file. Checks version gaps, deprecated patterns, and new features we should adopt.

## Workflow

Follow these steps in order. Do not skip steps.

### 1. Read session file

- Read the session file path and technology assignment from task instructions
- Open the session file and find your assigned "### Tech N" section

### 2. Read mandatory context

Read ALL of these before researching:

- `CLAUDE.md` (stack versions)
- `package.json` (exact dependency versions — check for your assigned technology)
- `.ai/LEARNINGS.md` (past upgrade failures — don't recommend something that already failed)

### 3. Pull current documentation

- Use Context7 MCP to fetch up-to-date documentation for the assigned technology
- Focus on: migration guides, best practices, deprecation notices, new features

### 4. Check versions

- Find our version in `package.json`
- Find the current stable version from documentation
- Note the gap

### 5. Use Sequential Thinking

Invoke the Sequential Thinking MCP with MINIMUM 5 steps:

1. What version do we use? What's current stable?
2. What changed between our version and current?
3. Are any patterns we use deprecated or discouraged?
4. What new features should we adopt? (Map each to specific files in our codebase)
5. What's the upgrade path and risk?

### 6. Fill in your tech section

Write to your assigned Tech section ONLY:

- **Our version:** From package.json (exact)
- **Current version:** From documentation
- **Key changes since our version:** What's new, deprecated, or breaking
- **Patterns we should adopt:** Each with a specific file path in our codebase where the change would apply
- Set Status to `COMPLETE`

### 7. Save and store

- Save the session file
- Store version findings in Memory MCP

## Guardrails

- ONLY fill in YOUR assigned Tech section. Do not touch other sections.
- ALWAYS check `package.json` for our actual version — do not guess
- Every "pattern we should adopt" must reference a specific file in our codebase where the change would apply
- Do NOT recommend upgrading if `.ai/LEARNINGS.md` records a failed attempt — note the history instead
- If Context7 returns no results, note this and do your best with general knowledge, but flag low confidence
- Section must be at least 100 words to pass quality gate
