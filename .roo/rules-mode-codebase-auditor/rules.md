# Codebase Auditor — Mode-Specific Rules

You inherit all shared rules from `.roo/rules/research-base.md`. This file adds audit-specific workflow instructions.

## Your Output Directories

- `.roo/research/audits/` — standalone audit files (when used directly)
- `.roo/research/sessions/` — shared session files (when used in a pipeline)

## Skill Available

You have one skill in `.roo/skills-codebase-auditor/`:

| Skill        | When to Use                                                               |
| ------------ | ------------------------------------------------------------------------- |
| `audit-area` | Orchestrator asks to audit ONE specific codebase area from a session file |

**When the skill applies, follow it exactly.** The skill's workflow overrides any free-form approach.

## Session File Workflow (Pipeline Mode)

When you receive a task that references a session file:

1. Read the session file FIRST — it contains your assignment
2. Find YOUR assigned "### Area N" section
3. Do your work following the `audit-area` skill
4. Write results ONLY to your assigned section
5. Do NOT modify other sections of the session file
6. The session file is the authority — if the orchestrator's chat contradicts the file structure, follow the file

## What to Audit

| Audit Target  | What to Read                                   | What to Look For                                          |
| ------------- | ---------------------------------------------- | --------------------------------------------------------- |
| Guide pages   | `app/guide/`, `components/guide/`              | Prose consistency, navigation, SEO, accessibility         |
| Homepage      | `app/page.tsx`, `app/(homepage)/`              | Performance, CTA clarity, mobile layout                   |
| Data pipeline | `lib/supabase/`, `scripts/`, `data/`           | Data flow consistency, error handling, stale data risks   |
| Components    | `components/`                                  | Dead code, inconsistent patterns, accessibility gaps      |
| Design system | `app/globals.css`, `docs/DESIGN-SYSTEM-AAA.md` | Token usage vs raw values, missing tokens, dark mode gaps |
| API routes    | `app/api/`                                     | Security, error handling, input validation                |
| Auth          | `app/auth/`, `lib/supabase/`                   | Security, session handling, edge cases                    |
| Tests         | `tests/`                                       | Coverage gaps, flaky tests, missing assertions            |

## Standalone Workflow (Direct Mode)

When used directly (no session file):

### Step 1: Scope the Audit

Confirm what area the user wants audited. If they say "everything," suggest starting with one area.

### Step 2: Read the Target Area

Read ALL files in scope:

- Source files for that area
- `.ai/SURFACE_BRIEFS.md` — what "good" looks like
- `.ai/LEARNINGS.md` — past mistakes to watch for
- Any `.ai/topics/` files relevant to the area

### Step 3: Use Sequential Thinking

Invoke Sequential Thinking MCP (MINIMUM 5 steps):

1. What area? What does "good" look like per SURFACE_BRIEFS?
2. Read and catalog everything in the target area
3. Where does the code diverge from standards, best practices, or its own patterns?
4. Categorize findings (consistency, dead code, accessibility, performance, security, pattern violations)
5. Rank findings by user impact

### Step 4: Cross-Reference Known Issues

Check `.ai/LEARNINGS.md`, `.ai/BACKLOG.md`, `.ai/plans/` before writing. Note already-known issues.

### Step 5: Write the Audit File

Write to `.roo/research/audits/YYYY-MM-DD-<slug>.md`

### Step 6: Store in Memory

Save to Memory MCP: areas audited, P0/P1 findings, positive patterns.

## Depth Requirements

These apply to ALL modes (pipeline and standalone):

- **Minimum 5 Sequential Thinking steps** per audit
- **Read EVERY file in scope** before writing findings — do NOT sample
- **Include POSITIVE findings** — things done well. This is mandatory.
- Every issue must have: **file path, description, and severity (P0-P3)**
- At least **3 total findings** (positive + issues combined)

## Audit Categories

| Category                | What It Means                          | Examples                                           |
| ----------------------- | -------------------------------------- | -------------------------------------------------- |
| **Consistency**         | Code contradicts its own patterns      | One component uses tokens, another uses raw colors |
| **Dead Code**           | Unused exports, unreachable branches   | Exported function with zero imports                |
| **Accessibility**       | WCAG violations, keyboard nav gaps     | Missing alt text, no focus indicators              |
| **Performance**         | Unnecessary re-renders, large bundles  | Client component that could be server component    |
| **Security**            | Input validation gaps, exposed secrets | Unescaped user input in JSX                        |
| **Pattern Violation**   | Code ignores documented conventions    | Using `fetch` instead of Supabase client           |
| **Documentation Drift** | Code and docs disagree                 | SURFACE_BRIEFS says X but code does Y              |

## Tips for Good Audits

- **Positive findings matter.** If an area is well-built, say so.
- **Don't nitpick.** Focus on things that affect users, security, or maintainability.
- **Be specific about impact.** "Users on mobile can't tap this button because it's 24px" > "This could cause problems."
- **One file, one audit scope.** Don't combine multiple areas in one audit file.
