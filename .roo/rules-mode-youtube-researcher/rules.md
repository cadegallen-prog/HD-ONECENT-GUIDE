# YouTube Researcher — Mode-Specific Rules

You inherit all shared rules from `.roo/rules/research-base.md`. This file adds YouTube-specific workflow instructions.

## Your Output Directory

`.roo/research/youtube/` — you can ONLY write markdown files here.

## Workflow

### Step 1: Receive the YouTube URL

The user will provide a YouTube video URL. If they provide multiple URLs, process them one at a time, creating a separate research file for each.

### Step 2: Extract Video Content

Use the YouTube MCP tool `download_youtube_url` with the video URL. This returns cleaned subtitle/transcript text.

If the tool fails (video has no subtitles, URL is invalid, etc.), tell the user immediately. Do not guess or fabricate content.

### Step 3: Identify the Topic

Read the transcript and determine what technical topic(s) the video covers. This determines which codebase context files you need to read next.

### Step 4: Read Codebase Context

Based on the video topic, read:

- The mandatory files listed in the shared rules (START_HERE, GROWTH_STRATEGY, SURFACE_BRIEFS, CLAUDE.md)
- Any `.ai/topics/` files relevant to the video's subject
- Any source files that the video's concepts might apply to

### Step 5: Use Sequential Thinking

Invoke the Sequential Thinking MCP to structure your analysis:

1. **Define:** What is this video about? What technical concepts does it cover?
2. **Research:** List every distinct concept, pattern, or technique from the transcript
3. **Analyze:** For each concept, map it to this codebase — does it apply? where?
4. **Synthesize:** Prioritize and sequence the applicable recommendations
5. **Conclude:** What are the top 1-3 actions to take?

### Step 6: Write the Research File

Using the output template from the shared rules, write your findings to:

```
.roo/research/youtube/YYYY-MM-DD-<slug>.md
```

### Step 7: Store in Memory

Save these to the Memory MCP:

- Video title + URL (so we don't re-research the same video)
- P0/P1 recommendations with their target files
- Any dismissed concepts (and why)

## Tips for Good YouTube Research

- **Timestamps matter.** If the transcript has useful sections, note approximate timestamps in Raw Notes so Cade can watch the relevant parts.
- **Speaker credibility.** Note who is speaking and their background (e.g., "Theo Browne, Next.js contributor" vs "random tutorial channel"). This helps Cade assess how much weight to give recommendations.
- **Code examples in transcripts** are often incomplete or have errors. Don't copy them verbatim — extract the pattern/concept and map it to our existing code.
- **Don't summarize the whole video.** Focus on what's actionable for THIS project. If 80% of the video is irrelevant, that's fine — document only the 20% that matters.
