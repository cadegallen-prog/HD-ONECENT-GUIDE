# Roo Code Research Modes — Decision Tree & Quick Reference

## What Is This?

A system that uses your free GLM 4.6 API (via Roo Code) to research and analyze things that could make your project better. It never touches code — it just writes markdown files with findings. You then hand those findings to Claude/Codex when you're ready to implement.

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

## How to Use (Step by Step)

1. Open Roo Code in VSCode
2. Click the mode dropdown (under the chatbox)
3. Select the mode you want (see decision tree above)
4. Type your request in plain English
5. If using Orchestrator: it will show you its plan → approve it → it runs
6. Output appears in `.roo/research/` as markdown files
7. Read the findings (they're in plain English)
8. When ready to implement: tell Claude/Codex "Read .roo/research/[file] and implement the P0 recommendations"

## Where Output Goes

```
.roo/research/
├── youtube/          ← Video analysis files
├── docs/             ← Library/framework research files
├── audits/           ← Codebase audit files
└── memory.jsonl      ← Persistent memory (auto-managed)
```

## Permissions (Auto-Approve Everything)

When Roo Code asks to approve an action from these modes, click "Always allow."
These modes literally cannot touch your code — the fileRegex restrictions block it.
They can only read code and write markdown to their output directories.

## MCPs Installed

| MCP                 | What It Does                                  | Auto-Approved? |
| ------------------- | --------------------------------------------- | -------------- |
| Sequential Thinking | Forces step-by-step analysis (prevents drift) | Yes            |
| Memory              | Remembers past research across sessions       | Yes            |
| Context7            | Pulls current library/framework docs          | Yes            |
| YouTube             | Extracts video subtitles/transcripts          | Yes            |

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
