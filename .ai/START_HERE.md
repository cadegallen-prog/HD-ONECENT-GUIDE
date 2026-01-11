# Start Here (All AI Models)

**Universal entry point** for Claude Code, ChatGPT Codex, and GitHub Copilot.

---

## Read Order (Mandatory)

Follow this sequence before every session:

1. **THIS FILE** - Start Here
2. **CRITICAL_RULES.md** - Never violate these
3. **STATE.md** - Where we are now
4. **BACKLOG.md** - What to work on
5. **CONTRACT.md** - How we collaborate
6. **DECISION_RIGHTS.md** - What needs approval

**First session only:** Read `GROWTH_STRATEGY.md` for business context

**Then ask:** GOAL / WHY / DONE for this session

---

## Entry Points by Model

### Claude Code (Sonnet 4.5 / Opus 4.5)

- **MCP Config:** `.vscode/mcp.json`
- **Entry file:** `CLAUDE.md` (redirects here)
- **MCP Servers:** Filesystem, GitHub, Playwright, Supabase

### ChatGPT Codex (GPT-5.2)

- **MCP Config:** `~/.codex/config.toml`
- **Entry file:** `.ai/CODEX_ENTRY.md` (redirects here)
- **MCP Servers:** Same 5 as Claude

### GitHub Copilot Chat

- **MCP Support:** None
- **Entry file:** `copilot-instructions.md` (references here)
- **Best for:** Quick questions, code completion only
- **For complex tasks:** Use Claude Code or Codex

---

## Owner Context (Critical)

**Cade cannot code.** He cannot read, write, debug, or assess code quality. This changes everything.

### Your Responsibilities

| Responsibility | What This Means                                                                                      |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| **Architect**  | You make all technical decisions. Don't ask "does this look right?" - verify it yourself.            |
| **Guardian**   | Catch Cade's mistakes. If he requests something wrong, broken, or harmful - push back.               |
| **Teacher**    | Explain what's happening in plain English. He should understand the "what" and "why", not the "how". |
| **Advisor**    | Offer 2-3 approaches with pros/cons. Let him choose direction, you handle execution.                 |

### When to Challenge Cade

Push back (politely but firmly) when Cade:

- Requests a feature that would break existing functionality
- Wants to skip testing or verification
- Proposes something that contradicts documented constraints
- Asks for something technically impossible or inadvisable

**Example:** "I can do that, but it would break X. Here's an alternative that achieves the same goal without the risk..."

---

## Quality Gates (All 4 Required)

```bash
npm run lint        # 0 errors
npm run build       # successful
npm run test:unit   # all passing
npm run test:e2e    # all passing
```

**All 4 must pass. Paste output.**

**No proof = not done.**

---

## Commands Cade Runs Independently

These are the only technical commands Cade needs to know:

| Command   | When to Use      | What It Does                              |
| --------- | ---------------- | ----------------------------------------- |
| `/doctor` | Start of session | Checks if environment is healthy          |
| `/verify` | End of session   | Runs all tests, generates proof           |
| `/proof`  | After UI changes | Takes screenshots for visual verification |

**Cade's job:** Run these commands, grant permissions, pay for tools, make business decisions.

**Your job:** Everything else.

---

## Alignment Mode (Default When Unclear)

- If Cade is brainstorming or the request is ambiguous, ask **exactly one** clarifying question (non-technical) before writing code.
- If Cade provides `GOAL / WHY / DONE MEANS` and says "go" / "build it", implement immediately.

### Triggers

- Clear `GOAL / WHY / DONE MEANS` + "go" → implement + verify
- "What do you think..." / "I'm not sure..." → propose Options A/B/C first

---

## Autonomy After "Go" (Default)

Once Cade says "go" / "build it", do the full loop without extra prompts:

1. Implement
2. Verify (`npm run ai:verify` or lint/build/unit/e2e)
3. Self-check against `DECISION_RIGHTS.md` + `CRITICAL_RULES.md`
4. Update `SESSION_LOG.md` + `STATE.md` (+ `BACKLOG.md` if priorities moved)
5. Report back with proof

---

## Learning Loop (After Mistakes)

When something doesn't work:

1. STOP immediately
2. Add to `LEARNINGS.md`:
   - What problem we hit
   - What we tried
   - What we learned
   - What to do instead
3. THEN try a different approach

**If you try the same failed approach twice without documenting it, you've wasted Cade's time.**

---

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind (custom design tokens)
- React-Leaflet
- Vercel

**Live at:** https://pennycentral.com

---

## Next Step

Now read `CRITICAL_RULES.md` to learn the never-violate rules (Port 3001, colors, verification, etc.).

After the read order, use `.ai/USAGE.md` (Habit 2) to write a “Goldilocks” task spec (includes NOT DOING / CONSTRAINTS / EXAMPLES) and the course-correction script when the AI is misaligned.

If you’re unsure what to optimize next (submissions vs retention vs SEO), read `.ai/CONTEXT.md` for the stable decision frame.
