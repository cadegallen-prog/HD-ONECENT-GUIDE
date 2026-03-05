# Roo Code Research Modes — Decision Tree & Quick Reference

## What Is This?

A system that uses your free GLM 4.6 API (via Roo Code) to research and analyze things that could make your project better. It never touches code — it just writes markdown files with findings. You then hand those findings to Claude/Codex when you're ready to implement.

**New in v2:** The Orchestrator now uses a **shared session file** as running memory. Sub-agents read the file, do one focused task, write results back, and exit. This means deeper analysis, better quality, and no more shallow summaries.

## Decision Tree

```
What do you want to do?
│
├── "Analyze a YouTube video"
│   ├── Just one video? → YouTube Researcher (direct)
│   └── Multiple videos? → Research Orchestrator
│
├── "Check if my code is up to date"
│   ├── One library (e.g., Next.js)? → Docs Researcher (direct)
│   └── Multiple libraries or whole stack? → Research Orchestrator
│
├── "Find what's wrong / could be better"
│   ├── One area (e.g., components)? → Codebase Auditor (direct)
│   └── Multiple areas or "everything"? → Research Orchestrator
│
├── "Watch this video THEN check my code against it"
│   └── Research Orchestrator (it handles the sequencing)
│
└── "I don't know, just help me improve things"
    └── Research Orchestrator → tell it what area you care about
        (it will figure out whether to audit, research docs, or both)
```

## The Four Modes

| Mode                      | When to Use                                 | What You Say                                     |
| ------------------------- | ------------------------------------------- | ------------------------------------------------ |
| **Research Orchestrator** | Multiple tasks, mixed types, or "do it all" | "Analyze these 3 videos and audit my components" |
| **YouTube Researcher**    | Single video analysis                       | "Analyze this video: [url]"                      |
| **Docs Researcher**       | Single library/framework check              | "Are we using Next.js best practices?"           |
| **Codebase Auditor**      | Single area review                          | "Review the guide pages for improvements"        |

**Rule of thumb:** If your request has the word "and" in it, use the Orchestrator.

## What's Different Now (Pipeline Mode)

When you use the **Research Orchestrator**, it runs a multi-phase pipeline:

```
Phase 1a: Extract topics from the video (what's it about?)
Phase 1b: Analyze each topic one at a time (deep, focused analysis)
Phase 2:  Audit relevant code areas + research relevant technologies
Phase 3:  Write a synthesis with top findings and next steps
```

**Why this is better:**

- Each sub-agent gets ONE topic, not an entire video — deeper analysis
- Quality gates catch shallow or missing analysis and retry once
- Everything is written to a shared session file — nothing gets lost in chat
- The session file is readable plain English you can review at any point

## How to Use (Step by Step)

1. Open Roo Code in VSCode
2. Click the mode dropdown (under the chatbox)
3. Select the mode you want (see decision tree above)
4. Type your request in plain English
5. If using Orchestrator: it creates a session file and runs the pipeline automatically
6. Output appears in `.roo/research/` as markdown files
7. Read the findings (they're in plain English)
8. When ready to implement: tell Claude/Codex "Read .roo/research/[file] and implement the P0 recommendations"

## Where Output Goes

```
.roo/research/
├── sessions/         ← Pipeline session files (shared memory for multi-phase research)
├── youtube/          ← Standalone video analysis files
├── docs/             ← Standalone library/framework research files
├── audits/           ← Standalone codebase audit files
└── memory.jsonl      ← Persistent memory (auto-managed)
```

**Session files** are the main output when using the Orchestrator. They contain all phases, all topics, and the final synthesis in one file.

## Permissions & Auto-Approve

These modes literally cannot touch your code — the fileRegex restrictions block it. They can only read code and write markdown to their output directories.

**Recommended:** Enable "Auto-approve write" in the Roo Code extension sidebar settings. This is safe because fileRegex still blocks writes outside `.roo/research/`. Without this, you'll have to click "approve" for every file save during a pipeline run.

## MCPs Installed

| MCP                 | What It Does                                  | Auto-Approved? |
| ------------------- | --------------------------------------------- | -------------- |
| Sequential Thinking | Forces step-by-step analysis (prevents drift) | Yes            |
| Memory              | Remembers past research across sessions       | Yes            |
| Context7            | Pulls current library/framework docs          | Yes            |
| YouTube             | Extracts video subtitles/transcripts          | Yes            |

## What "Improve" Means (It's Everything)

These modes don't just summarize content. They map everything back to YOUR project:

- **Code patterns** — "This data fetching approach would simplify lib/supabase/"
- **UX/UI** — "Mobile tap targets on guide pages are too small"
- **Architecture** — "These 3 components duplicate the same pattern, consolidate them"
- **Performance** — "This page client-renders things that could be server components"
- **Accessibility** — "Missing alt text on homepage hero image"
- **SEO** — "This metadata pattern would improve guide page rankings"
- **Testing** — "No E2E coverage for the store finder flow"
- **Documentation** — "SURFACE_BRIEFS says X but the code does Y"
- **Security** — "API route missing input validation"

## The Pipeline (How This Feeds Into Real Work)

```
GLM 4.6 (free)                    You                     Claude/Codex (paid)
──────────────                    ───                     ──────────────────
Researches & analyzes  →  You read findings  →  "Implement the P0 items
Writes markdown files      (plain English)       from this research file"
                           Decides what's                    │
                           worth doing                       ▼
                                                   Code changes happen
                                                   with full context
```

## Skills Reference

The pipeline uses **Skills** — rigid, numbered workflows that each sub-agent follows exactly. This prevents drift and ensures consistent quality.

| Skill                 | Mode               | What It Does                                                   |
| --------------------- | ------------------ | -------------------------------------------------------------- |
| `research-pipeline`   | Orchestrator       | Full pipeline: create session → delegate → verify → synthesize |
| `extract-topics`      | YouTube Researcher | Extract topic list from a video transcript                     |
| `analyze-topic`       | YouTube Researcher | Deep-analyze ONE topic and map to codebase                     |
| `audit-area`          | Codebase Auditor   | Audit ONE area and write findings                              |
| `research-technology` | Docs Researcher    | Research ONE technology and compare to our code                |

Skills live in `.roo/skills-<mode-slug>/<skill-name>/SKILL.md`.
