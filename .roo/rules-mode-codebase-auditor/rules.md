# Codebase Auditor — Mode-Specific Rules

You inherit all shared rules from `.roo/rules/research-base.md`. This file adds audit-specific workflow instructions.

## Your Output Directory

`.roo/research/audits/` — you can ONLY write markdown files here.

## What to Audit

The user will ask you to audit a specific area. Common audit targets:

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

## Workflow

### Step 1: Scope the Audit

Confirm with the user what area they want audited. If they say "everything," push back — suggest starting with one area. A focused audit is far more useful than a shallow scan of everything.

### Step 2: Read the Target Area

Read all files in the audit scope:

- The source files for that area
- `.ai/SURFACE_BRIEFS.md` — what "good" looks like for that surface
- `.ai/LEARNINGS.md` — past mistakes to watch for
- Any `.ai/topics/` files relevant to the area

### Step 3: Use Sequential Thinking

Invoke the Sequential Thinking MCP to structure your audit:

1. **Define:** What area are we auditing? What does "good" look like per SURFACE_BRIEFS?
2. **Research:** Read and catalog everything in the target area
3. **Analyze:** Where does the code diverge from documented standards, best practices, or its own patterns?
4. **Synthesize:** Categorize findings (consistency, dead code, accessibility, performance, security, pattern violations)
5. **Conclude:** Rank findings by impact. What matters most to users?

### Step 4: Cross-Reference Known Issues

Check these before writing your audit:

- `.ai/LEARNINGS.md` — Are any of your findings repeat issues?
- `.ai/BACKLOG.md` — Are any already tracked?
- `.ai/plans/` — Are any already planned for implementation?

If a finding is already known/tracked, note it but don't count it as a new discovery.

### Step 5: Write the Audit File

Using the output template from the shared rules, write your findings to:

```
.roo/research/audits/YYYY-MM-DD-<slug>.md
```

### Step 6: Store in Memory

Save these to the Memory MCP:

- Areas audited (so we track coverage over time)
- P0/P1 findings with file paths
- Patterns that are consistent (positive findings — not everything is a problem)

## Audit Categories

Use these categories to organize findings:

| Category                | What It Means                                        | Examples                                           |
| ----------------------- | ---------------------------------------------------- | -------------------------------------------------- |
| **Consistency**         | Code contradicts its own patterns                    | One component uses tokens, another uses raw colors |
| **Dead Code**           | Unused exports, unreachable branches, orphaned files | Exported function with zero imports                |
| **Accessibility**       | WCAG violations, keyboard nav gaps                   | Missing alt text, no focus indicators              |
| **Performance**         | Unnecessary re-renders, large bundles, slow queries  | Client component that could be server component    |
| **Security**            | Input validation gaps, exposed secrets, XSS risks    | Unescaped user input in JSX                        |
| **Pattern Violation**   | Code ignores documented conventions                  | Using `fetch` instead of Supabase client           |
| **Documentation Drift** | Code and docs disagree                               | `.ai/SURFACE_BRIEFS.md` says X but code does Y     |

## Tips for Good Audits

- **Positive findings matter.** If an area is well-built and consistent, say so. This gives Cade confidence and prevents unnecessary rework.
- **Don't nitpick.** Missing semicolons and minor style issues are not audit findings. Focus on things that affect users, security, or maintainability.
- **Be specific about impact.** "This could cause problems" is useless. "Users on mobile can't tap this button because it's 24px — minimum tap target is 44px" is actionable.
- **One file, one audit scope.** Don't combine "guide pages" and "data pipeline" in one file. If the user asks for both, write two separate audit files.
