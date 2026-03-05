# Skill: extract-topics

**Description:** Extracts and lists distinct technical topics from a YouTube video transcript for the research pipeline. Use when the orchestrator asks to extract or identify topics from a YouTube video and write them to a session file. Does NOT analyze topics — only identifies and lists them.

## Workflow

Follow these steps in order. Do not skip steps.

### 1. Read session file

- Read the session file path from the task instructions
- Open the session file and locate the "Topic Extraction" section

### 2. Download transcript

- Use the `download_youtube_url` MCP tool with the video URL from task instructions
- If the tool fails (no subtitles, invalid URL), set Topic Extraction Status to `FAILED`, write the error message, and stop

### 3. Read mandatory context

Read these files to understand what topics are relevant to THIS project:

- `CLAUDE.md` (stack overview)
- `.ai/SURFACE_BRIEFS.md` (what each page/surface does)

### 4. Use Sequential Thinking

Invoke the Sequential Thinking MCP with MINIMUM 5 steps:

1. What broad technical areas does this video cover?
2. Which of those areas are relevant to THIS project (PennyCentral)?
3. Break relevant areas into 3-8 distinct topics
4. For each topic, write a 1-sentence description
5. Sanity check — are these truly distinct? Merge overlapping ones

### 5. Write topics to session file

- Set Topic Extraction Status to `COMPLETE`
- Write topics as a numbered list under "Topics Found"
- For each topic, create a new "### Topic N: [Name]" section block using the template structure already in the session file
- Set each new topic section's Status to `NOT_STARTED`

### 6. Save and store

- Save the session file
- Store the topic list in Memory MCP for cross-session recall

## Guardrails

- Do NOT analyze topics in depth — just identify and list them
- Do NOT fill in any topic analysis fields (What it is, Relevant codebase files, etc.) — that is the `analyze-topic` skill's job
- Maximum 8 topics. If you find more, merge the least relevant ones
- Minimum 3 topics. If you find fewer, note this in the Topic Extraction section — the video may not warrant a full pipeline
- ONLY modify the Topic Extraction section and create new Topic N section headers. Do NOT touch other sections of the session file
