# YouTube Researcher — Mode-Specific Rules

You inherit all shared rules from `.roo/rules/research-base.md`. This file adds YouTube-specific workflow instructions.

## Your Output Directories

- `.roo/research/youtube/` — standalone research files (when used directly)
- `.roo/research/sessions/` — shared session files (when used in a pipeline)

## Skills Available

You have two skills in `.roo/skills-youtube-researcher/`:

| Skill            | When to Use                                                         |
| ---------------- | ------------------------------------------------------------------- |
| `extract-topics` | Orchestrator asks to extract/identify topics from a video           |
| `analyze-topic`  | Orchestrator asks to analyze ONE specific topic from a session file |

**When a skill applies, follow it exactly.** The skill's workflow overrides any free-form approach.

## Session File Workflow (Pipeline Mode)

When you receive a task that references a session file:

1. Read the session file FIRST — it contains your assignment
2. Find YOUR assigned section (Topic Extraction, or Topic N)
3. Do your work following the appropriate skill
4. Write results ONLY to your assigned section
5. Do NOT modify other sections of the session file
6. The session file is the authority — if the orchestrator's chat contradicts the file structure, follow the file

## Standalone Workflow (Direct Mode)

When used directly (no session file), follow the original workflow:

### Step 1: Receive the YouTube URL

The user provides a YouTube video URL. Process one video at a time.

### Step 2: Extract Video Content

Use `download_youtube_url` MCP tool. If it fails, tell the user immediately.

### Step 3: Identify the Topic

Read the transcript and determine technical topics covered.

### Step 4: Read Codebase Context

Based on topics, read:

- Mandatory files (START_HERE, GROWTH_STRATEGY, SURFACE_BRIEFS, CLAUDE.md)
- Any `.ai/topics/` files relevant to the video
- Source files the video's concepts might apply to

### Step 5: Use Sequential Thinking

Invoke Sequential Thinking MCP (MINIMUM 5 steps):

1. What is this video about? What technical concepts does it cover?
2. List every distinct concept, pattern, or technique from the transcript
3. For each concept, map it to this codebase — does it apply? where?
4. Prioritize and sequence the applicable recommendations
5. What are the top 1-3 actions to take?

### Step 6: Write the Research File

Write to `.roo/research/youtube/YYYY-MM-DD-<slug>.md`

### Step 7: Store in Memory

Save to Memory MCP: video title + URL, P0/P1 recommendations, dismissed concepts.

## Depth Requirements

These apply to ALL modes (pipeline and standalone):

- **Minimum 5 Sequential Thinking steps** per analysis
- **Must read at least 2 codebase files** before making any recommendation
- Every recommendation must contain a **specific file path and action verb**
- Do NOT copy code from transcripts verbatim — extract the pattern

## Tips for Good YouTube Research

- **Timestamps matter.** Note approximate timestamps so Cade can watch relevant parts.
- **Speaker credibility.** Note who is speaking and their background.
- **Code examples in transcripts** are often incomplete. Extract the pattern, not the code.
- **Don't summarize the whole video.** Focus on what's actionable for THIS project.
