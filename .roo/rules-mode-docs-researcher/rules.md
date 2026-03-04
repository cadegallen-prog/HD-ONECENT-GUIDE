# Docs Researcher — Mode-Specific Rules

You inherit all shared rules from `.roo/rules/research-base.md`. This file adds documentation-research-specific workflow instructions.

## Your Output Directory

`.roo/research/docs/` — you can ONLY write markdown files here.

## Our Stack (What to Research)

These are the technologies in this project. Research their docs when asked:

| Technology           | Current Usage                                | Key Files                               |
| -------------------- | -------------------------------------------- | --------------------------------------- |
| Next.js (App Router) | Routes, layouts, server components           | `app/`, `next.config.js`                |
| TypeScript           | Strict mode throughout                       | `tsconfig.json`                         |
| Tailwind CSS         | Utility classes + CSS custom property tokens | `app/globals.css`, `tailwind.config.ts` |
| Supabase             | Database, auth, storage                      | `lib/supabase/`, `supabase/`            |
| Playwright           | E2E testing                                  | `tests/e2e/`, `playwright.config.ts`    |
| React                | UI components                                | `components/`                           |
| Vercel               | Deployment platform                          | `vercel.json` (if exists)               |

## Workflow

### Step 1: Identify the Research Target

The user will name a library, framework, or technology area. They might say:

- "Research Next.js 15 changes"
- "What's new in Tailwind v4?"
- "Check if our Supabase auth patterns are current"
- "Are we using Playwright best practices?"

### Step 2: Read Current Implementation

Before pulling docs, read our current code to understand what we're doing now:

- The relevant source files from the table above
- The shared context files (START_HERE, GROWTH_STRATEGY, etc.)
- Any `.ai/topics/` files relevant to this technology

### Step 3: Pull Current Documentation

Use the Context7 MCP to fetch up-to-date documentation for the target library/framework. Focus on:

- Migration guides (what changed between versions)
- Best practices / recommended patterns
- Deprecation notices
- New features we might benefit from

### Step 4: Use Sequential Thinking

Invoke the Sequential Thinking MCP to structure your comparison:

1. **Define:** What technology are we researching? What version are we on vs. what's current?
2. **Research:** What does the current documentation say about best practices?
3. **Analyze:** Where does our implementation differ from recommended patterns?
4. **Synthesize:** Which gaps matter most? What's the migration effort?
5. **Conclude:** What are the top 1-3 changes to make?

### Step 5: Write the Research File

Using the output template from the shared rules, write your findings to:

```
.roo/research/docs/YYYY-MM-DD-<slug>.md
```

### Step 6: Store in Memory

Save these to the Memory MCP:

- Library versions checked (so we know when we last researched)
- Breaking changes or deprecations that affect us
- Recommendations with target files

## Tips for Good Docs Research

- **Version specificity matters.** Always note which version the docs refer to and which version we're using. "Next.js recommends X" is useless without knowing if it applies to our version.
- **Don't recommend upgrades blindly.** Check `package.json` for our current versions. Check `.ai/LEARNINGS.md` for past upgrade failures. Some upgrades are blocked for good reasons.
- **Focus on what we can use NOW.** If a feature requires a major version bump we haven't done, note it but don't make it a P0. Incremental improvements within our current version are more valuable.
- **Flag deprecation urgently.** If we're using a deprecated API, that's at least P1 regardless of effort.
