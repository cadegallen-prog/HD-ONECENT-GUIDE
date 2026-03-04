# Research Mode — Shared Rules

These rules apply to ALL research modes (YouTube Researcher, Docs Researcher, Codebase Auditor).

## Hard Constraints

1. **NEVER** create, edit, or delete any file outside your designated output directory.
2. **NEVER** modify code, tests, configs, or `.ai/` documentation files.
3. **NEVER** run build, lint, test, or deployment commands.
4. **NEVER** install packages or modify `package.json`.
5. **NEVER** push to git, create branches, or make commits.
6. Every insight MUST be mapped to a specific file, pattern, or surface in this codebase. Generic advice with no codebase mapping is useless — skip it.

## About This Project

PennyCentral is a Next.js App Router site for Home Depot penny item hunters. Key facts:

- **Stack:** Next.js App Router, TypeScript strict, Tailwind CSS (CSS variable tokens only), Supabase, deployed on Vercel
- **Owner:** Cade cannot code. Write in plain English. Define technical terms on first use.
- **Key directories:** `app/` (routes), `components/` (React), `lib/` (utilities), `data/` (JSON fixtures), `.ai/` (AI agent docs)
- **Design system:** CSS custom property tokens in `app/globals.css` — never raw Tailwind colors

## Codebase Context — Read Before Writing

Before writing ANY research file, read these files to understand the project:

### Always Read (every research task)

- `.ai/START_HERE.md` — Universal entry point, tiered read order
- `.ai/GROWTH_STRATEGY.md` — Business goals, monetization strategy, owner context
- `.ai/SURFACE_BRIEFS.md` — What each page/surface does and what "good" looks like
- `CLAUDE.md` — Stack, architecture, key commands, fragile files

### Read When Relevant

- `.ai/BACKLOG.md` — Current priorities (to assess relevance of findings)
- `.ai/LEARNINGS.md` — Past mistakes and anti-patterns (avoid recommending things we've already tried and rejected)
- `.ai/topics/` — Domain-specific context files (read the one matching your research topic)
- `.ai/plans/` — Existing implementation plans (avoid duplicating planned work)
- `app/globals.css` — Design system tokens
- `docs/DESIGN-SYSTEM-AAA.md` — Design system documentation

## Required MCP Usage

### Sequential Thinking (MANDATORY)

Use the Sequential Thinking MCP tool for EVERY research task. Structure your analysis through these stages:

1. **Problem Definition** — What are we researching and why?
2. **Research** — Extract and organize the raw information
3. **Analysis** — Map each concept to this specific codebase
4. **Synthesis** — Prioritize and sequence recommendations
5. **Conclusion** — Summarize actionable next steps

Do NOT skip stages or rush to conclusions.

### Memory (MANDATORY)

After completing every research file, store key findings in the Memory MCP:

- Project conventions discovered or confirmed
- Recommendations that scored P0 or P1
- Concepts that were dismissed (and why) — prevents re-research
- Connections between different research sessions

Before starting a new research task, query the Memory MCP to check for relevant prior findings.

## File Naming Convention

```
YYYY-MM-DD-<slug>.md
```

- `YYYY-MM-DD` is today's date
- `<slug>` is a lowercase-hyphenated summary of the topic
- Examples: `2026-03-04-nextjs-app-router-caching.md`, `2026-03-04-supabase-rls-patterns.md`
- Same-day same-topic: append `-part2`, `-part3`

## Output Template

Every research file MUST follow this structure:

```markdown
# Research: [Title]

## Source Metadata

| Field    | Value                                    |
| -------- | ---------------------------------------- |
| Type     | [YouTube / Docs / Audit]                 |
| Title    | [Source title or audit scope]            |
| Source   | [URL, library name, or "Internal Audit"] |
| Date     | [Source publish date or "N/A"]           |
| Analyzed | [YYYY-MM-DD — today's date]              |

## Executive Summary

[2-3 sentences: What is this about? Why does it matter to PennyCentral?
What is the single most actionable takeaway?]

## Key Concepts

### 1. [Concept Name]

**What it is:** [Plain English, 2-3 sentences. Define any technical terms.]

**Relevance to PennyCentral:** [How this maps to our codebase specifically.]

**Current state:** [Do we already do this? Partially? Not at all? Where?]

**Relevant files:**

- `path/to/file.ts` — [why this file is relevant]
- `path/to/other.ts` — [why this file is relevant]

**Recommendation:** [Specific action to take. Be precise enough that an
Implementer agent could act on this without asking follow-up questions.]

| Priority          | Effort         | Risk                |
| ----------------- | -------------- | ------------------- |
| P0 / P1 / P2 / P3 | S / M / L / XL | Low / Medium / High |

---

[Repeat ### block for each concept]

## Concepts Not Applicable

[List any concepts from the source that do NOT apply to this project,
with a one-line reason why. This prevents future agents from
re-evaluating the same ideas.]

- [Concept X] — [reason it doesn't apply]

## Implementation Sequence

[If multiple recommendations exist, what order should they be tackled in?
Note dependencies between items.]

1. First do [X] because [Y] depends on it
2. Then [Y] because...

## Connections to Existing Plans

[Reference any `.ai/plans/` or `.ai/BACKLOG.md` items that overlap
with these recommendations. Flag conflicts with existing decisions.]

- Overlaps with `.ai/plans/[plan-name].md` — [how]
- Conflicts with `.ai/BACKLOG.md` item [X] — [what the conflict is]
- No overlaps found (if none)

## Raw Notes

[Optional: additional observations, quotes, timestamps, or details that
might be useful later but don't warrant a full concept block.]
```

## Quality Self-Check (Verify Before Saving)

Before saving your research file, confirm ALL of these:

- [ ] Every concept has at least one specific file path reference
- [ ] Priority / effort / risk is assigned to every recommendation
- [ ] No generic advice — everything is mapped to THIS project
- [ ] Plain English used throughout (Cade can understand it)
- [ ] File name follows `YYYY-MM-DD-slug.md` convention
- [ ] "Concepts Not Applicable" section is filled in (not skipped)
- [ ] "Connections to Existing Plans" section is filled in
- [ ] Sequential Thinking MCP was used to structure analysis
- [ ] Key findings stored in Memory MCP
