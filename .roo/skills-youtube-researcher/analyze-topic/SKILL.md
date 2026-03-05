# Skill: analyze-topic

**Description:** Analyzes ONE specific topic from a YouTube video transcript and maps it to the PennyCentral codebase. Use when the orchestrator assigns a specific topic number from a session file. Reads the transcript, finds relevant codebase files, and fills in that topic's section in the session file.

## Workflow

Follow these steps in order. Do not skip steps.

### 1. Read session file

- Read the session file path and topic number from task instructions
- Open the session file and find your assigned "### Topic N" section

### 2. Download transcript

- Use `download_youtube_url` MCP tool to get the video transcript
- If it fails, set your topic Status to `FAILED` with the error and stop

### 3. Read mandatory context

Read ALL of these before writing anything:

- `CLAUDE.md` (stack, architecture)
- `.ai/SURFACE_BRIEFS.md` (what each surface does)
- `.ai/GROWTH_STRATEGY.md` (business goals)

### 4. Search the codebase

Based on your topic, use `read_file`, `list_files`, `search_files` to find relevant code. You MUST read at least 2 codebase files before writing any recommendations.

### 5. Use Sequential Thinking

Invoke the Sequential Thinking MCP with MINIMUM 5 steps:

1. What does the video say about this specific topic? (Include approximate timestamps if available)
2. Which files in our codebase relate to this topic? (List them with paths)
3. Read those files. What do we currently do?
4. Compare: what does the video recommend vs what we do?
5. What is the specific, actionable recommendation?
6. (Optional) Edge cases, risks, dependencies

### 6. Fill in your topic section

Write to your assigned topic section ONLY:

- **What it is:** Plain English, 2-3 sentences, define technical terms
- **Relevant codebase files:** At least 2 file paths with why each is relevant
- **Current state in our code:** Must reference actual code you read (not generic statements)
- **Recommendation:** Specific action with a file path
- **Priority / Effort / Risk:** Fill in all three
- Set Status to `COMPLETE`

### 7. Save and store

- Save the session file
- Store key finding in Memory MCP

## Guardrails

- ONLY fill in YOUR assigned topic section. Do not touch other sections.
- You MUST read at least 2 codebase files before writing recommendations. If you haven't read the file, you can't recommend changes to it.
- "Recommendation" must contain a specific file path AND a specific action verb (implement, replace, add, remove, refactor, extract).
  - BAD: "Consider implementing caching"
  - GOOD: "In lib/fetch-penny-data.ts, replace revalidate=300 with unstable_cache using tag 'penny-list' for targeted invalidation"
- If the topic doesn't apply to our project, set recommendation to "NOT APPLICABLE" with a reason, and set Priority to "N/A"
- Do NOT copy code from the transcript verbatim — extract the pattern
- Do NOT recommend features that conflict with `.ai/CONSTRAINTS.md`
