# GitHub Copilot Chat Instructions

You are helping with Penny Central (pennycentral.com), a Next.js PWA for finding Home Depot penny items (clearance deals).

---

## Read First (in order)

Follow the canonical read order (source of truth is `.ai/START_HERE.md`):

1. `.ai/START_HERE.md`
2. `.ai/CRITICAL_RULES.md`
3. `.ai/STATE.md`
4. `.ai/HANDOFF.md` (portable context pack, use when switching tools or starting a fresh chat)
5. `.ai/BACKLOG.md`
6. `.ai/CONTRACT.md`
7. `.ai/DECISION_RIGHTS.md`

**If working within a specific topic:** read `.ai/topics/INDEX.md` then the relevant `.ai/topics/<TOPIC>.md`

**If implementing from an approved plan:** read `.ai/impl/<FEATURE>.md` before touching code

---

## Quick-load Primer (Copy/Paste Prompts)

Use these as your first message in Copilot Chat to load the right context fast.

### Primer A (General Orientation)

Read these files first and summarize only operational truth:
- `.ai/STATE.md`
- `.ai/HANDOFF.md`
- `.ai/BACKLOG.md`

Then tell me the next 3 actions and which files you would touch.

### Primer B (Topic-based Work)

Read:
- `.ai/STATE.md`
- `.ai/HANDOFF.md`
- `.ai/topics/INDEX.md`
- `.ai/topics/<TOPIC>.md`

Then propose the smallest safe implementation step. List exact files and changes.

### Primer C (Implementation Plan Based)

Read:
- `.ai/CRITICAL_RULES.md`
- `.ai/DECISION_RIGHTS.md`
- `.ai/CONTRACT.md`
- `.ai/impl/<FEATURE>.md`

Then implement only Step 1 from the plan. Output as a diff or file-by-file edits.

### Important: Commands as Headings (Copilot)

Do not rely on literal slash commands. Treat them as headings like:
- ARCHITECT MODE
- IMPLEMENT MODE
- VERIFY MODE

---

## Your Capabilities (Copilot Chat)

**Important:** Copilot Chat has no MCP server support and limited agent abilities.

### What You CAN Do

- ✅ Answer questions about the codebase
- ✅ Explain code patterns
- ✅ Suggest quick fixes
- ✅ Complete code inline
- ✅ Review code snippets
- ✅ Summarize docs

### What You CANNOT Do

- ❌ Run tests or verification (`npm run` commands)
- ❌ Take screenshots (Playwright)
- ❌ Query databases (Supabase MCP)
- ❌ Manage GitHub PRs/issues (GitHub MCP)
- ❌ File editing on a large scale
- ❌ Full feature development (multi-file changes)

---

## Then ask: GOAL / WHY / DONE for this session.

Use `.ai/USAGE.md` for the task template (5-min format):

```
GOAL: [specific ask]
WHY: [who it helps / what it fixes]
EVIDENCE: [error message / screenshot / link / metric]
NOT DOING: [2-3 explicit exclusions]
CONSTRAINTS: [tokens-only colors, don't touch globals.css, etc.]
EXAMPLES: Like this: [one sentence] / Not like this: [one sentence]
DONE MEANS:
- [success criterion]
- [success criterion]
- All tests pass
```

---

## Quick-load Primer (Copy/Paste Prompts)

[See "Quick-load Primer" section above - pasted in place for full context]

---

## Autonomy After "Go"

Once you understand the goal:
1. Read relevant docs (above)
2. Answer the question or complete the small task
3. If code changes are needed: explain them step-by-step (don't auto-complete entire features)
4. Explain what Cade should test next
5. Report back with findings

---

## Implementation Plans Live in `.ai/impl/`

- When a task is non-trivial, architecture output must be written to: `.ai/impl/<FEATURE>.md`
- Copilot should not invent architecture in-chat if `.ai/impl/<FEATURE>.md` does not exist.
  - Instead: propose a small Step 0, or escalate to Claude Code or Codex to produce the implementation plan.

### Escalate to Claude Code or Codex when:

- More than 3 files are involved
- A refactor is implied
- The change affects core UX patterns or anything gated by `.ai/DECISION_RIGHTS.md`
- The work needs Playwright proof or E2E confidence and Copilot cannot reliably run it in this session

---

## Key Files by Purpose

| Goal | File to Read |
|------|---|
| Understand project & business | `.ai/GROWTH_STRATEGY.md` + `.ai/BACKLOG.md` |
| See current state & blockers | `.ai/STATE.md` + `.ai/BACKLOG.md` |
| See recent work | `.ai/SESSION_LOG.md` |
| Understand design system | `.ai/CONSTRAINTS.md` + `.ai/CONSTRAINTS_TECHNICAL.md` |
| See design decisions | `.ai/topics/UI_DESIGN.md` or `.ai/PENNY-LIST-REDESIGN.md` |
| Understand collaboration rules | `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md` |
| Check past mistakes | `.ai/LEARNINGS.md` |

---

## When to Ask for Human Help

- "I don't have the file access to do this" → Escalate to Claude Code
- "This needs E2E test verification" → Escalate to Claude Code
- "This is ambiguous" → Ask Cade for clarification (use `.ai/USAGE.md` template)
- "This is a big refactor" → Stop and escalate to Claude Code
- "I'm uncertain about the architecture" → Propose options A/B/C to Cade, don't implement

---

## Example Copilot Session

**User:** "How do we structure the penny list enrichment?"

**Copilot:**

1. **Read:** `.ai/CONSTRAINTS_TECHNICAL.md` + relevant code
2. **Explain:** "The enrichment pipeline works like this: [explain structure]"
3. **Show:** Code snippet example
4. **Offer:** "Would you like me to explain how auto-enrich works, or do you need to add something new?"

**If user asks for new feature:**

1. **Stop:** Ask "Is this a big change or a small fix?" (use `.ai/DECISION_RIGHTS.md`)
2. **If small:** Explain the approach + suggest files
3. **If big:** "This needs full planning. Escalate to Claude Code to run `/architect`."

---

## Never

- ❌ Claim you can run tests or take screenshots (you can't)
- ❌ Promise to "remember" something between sessions (you can't)
- ❌ Start implementing a multi-file feature without `.ai/impl/` plan
- ❌ Ignore `.ai/CRITICAL_RULES.md` constraints
- ❌ Touch `components/store-map.tsx` (fragile area)
- ❌ Modify `globals.css` without approval

---

## Always

- ✅ Read the docs in order before answering
- ✅ Be honest about Copilot limitations
- ✅ Propose A/B/C when uncertain
- ✅ Escalate to Claude Code for complex work
- ✅ Link to relevant docs in your answers

---

**Remember:** Copilot is best for quick questions and small fixes. For substantial development, use Claude Code or Codex.
