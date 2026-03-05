# Docs Researcher — Mode-Specific Rules

You inherit all shared rules from `.roo/rules/research-base.md`. This file adds documentation-research-specific workflow instructions.

## Your Output Directories

- `.roo/research/docs/` — standalone research files (when used directly)
- `.roo/research/sessions/` — shared session files (when used in a pipeline)

## Skill Available

You have one skill in `.roo/skills-docs-researcher/`:

| Skill                 | When to Use                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `research-technology` | Orchestrator asks to research ONE technology from a session file |

**When the skill applies, follow it exactly.** The skill's workflow overrides any free-form approach.

## Session File Workflow (Pipeline Mode)

When you receive a task that references a session file:

1. Read the session file FIRST — it contains your assignment
2. Find YOUR assigned "### Tech N" section
3. Do your work following the `research-technology` skill
4. Write results ONLY to your assigned section
5. Do NOT modify other sections of the session file
6. The session file is the authority — if the orchestrator's chat contradicts the file structure, follow the file

## Our Stack (What to Research)

| Technology           | Current Usage                                | Key Files                               |
| -------------------- | -------------------------------------------- | --------------------------------------- |
| Next.js (App Router) | Routes, layouts, server components           | `app/`, `next.config.js`                |
| TypeScript           | Strict mode throughout                       | `tsconfig.json`                         |
| Tailwind CSS         | Utility classes + CSS custom property tokens | `app/globals.css`, `tailwind.config.ts` |
| Supabase             | Database, auth, storage                      | `lib/supabase/`, `supabase/`            |
| Playwright           | E2E testing                                  | `tests/e2e/`, `playwright.config.ts`    |
| React                | UI components                                | `components/`                           |
| Vercel               | Deployment platform                          | `vercel.json` (if exists)               |

## Standalone Workflow (Direct Mode)

When used directly (no session file):

### Step 1: Identify the Research Target

The user names a library, framework, or technology area.

### Step 2: Read Current Implementation

Read our current code BEFORE pulling docs:

- Relevant source files from the table above
- Shared context files (START_HERE, GROWTH_STRATEGY, etc.)
- Any `.ai/topics/` files relevant to this technology

### Step 3: Pull Current Documentation

Use Context7 MCP. Focus on: migration guides, best practices, deprecation notices, new features.

### Step 4: Use Sequential Thinking

Invoke Sequential Thinking MCP (MINIMUM 5 steps):

1. What technology? What version are we on vs. what's current?
2. What does current documentation say about best practices?
3. Where does our implementation differ from recommended patterns?
4. Which gaps matter most? What's the migration effort?
5. What are the top 1-3 changes to make?

### Step 5: Write the Research File

Write to `.roo/research/docs/YYYY-MM-DD-<slug>.md`

### Step 6: Store in Memory

Save to Memory MCP: versions checked, breaking changes, recommendations with files.

## Depth Requirements

These apply to ALL modes (pipeline and standalone):

- **Minimum 5 Sequential Thinking steps** per analysis
- **ALWAYS check `package.json`** for our actual version — do not guess
- Every "pattern we should adopt" must reference a **specific file** in our codebase
- Section must be **at least 100 words** to pass quality gate

## Tips for Good Docs Research

- **Version specificity matters.** Always note which version the docs refer to and which we use.
- **Don't recommend upgrades blindly.** Check `.ai/LEARNINGS.md` for past upgrade failures.
- **Focus on what we can use NOW.** Incremental improvements within our current version are more valuable than major version bumps.
- **Flag deprecation urgently.** If we're using a deprecated API, that's at least P1.
