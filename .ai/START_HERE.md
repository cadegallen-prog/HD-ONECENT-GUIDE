# Start Here (All AI Models)

**Universal entry point** for Claude Code, ChatGPT Codex, and GitHub Copilot.

---

## Read Order (Mandatory)

Follow this sequence before every session:

1. **VISION_CHARTER.md** - Highest authority (vision + decision hierarchy + conflict resolution)
2. **THIS FILE** - Start Here
3. **CRITICAL_RULES.md** - Never violate these
4. **STATE.md** - Where we are now
5. **BACKLOG.md** - What to work on
6. **CONTRACT.md** - How we collaborate
7. **DECISION_RIGHTS.md** - What needs approval
8. **HANDOFF_PROTOCOL.md** - How tasks are closed and handed to the next agent

**Default ignore list:** Do not load files under `archive/docs-pruned/**`, `archive/scripts-pruned/**`, or `archive/media-pruned/**` unless Cade explicitly asks to restore/review archived items.

**First session only:** Read `GROWTH_STRATEGY.md` for business context

## Alignment Gate (Fail-Closed, Required Before Mutation)

No file mutation is allowed until this exact block is complete:

- GOAL
- WHY
- DONE MEANS
- NOT DOING
- CONSTRAINTS
- ASSUMPTIONS
- CHALLENGES

If any field is missing or contradictory, stop and resolve it first. No edits before gate completion.

## Monetization Incident Rule (Required When Open)

- If any monetization incident is open, read `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` immediately after `STATE.md` and `BACKLOG.md`.
- Session-start update must explicitly acknowledge each open incident ID and its current `next_action`.
- No monetization execution begins until incident status and deadlines are confirmed from the register.

## Planning Canon (When the session is planning-only)

- Open `.ai/plans/INDEX.md` to see the canonical list of plans and their current status.
- Create/update plans under `.ai/plans/` using `.ai/plans/_TEMPLATE.md`.

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

## Founder Communication Rule (Mandatory)

- Use plain English by default.
- Define technical terms the first time they appear.
- Do not mix founder instructions with next-agent instructions.
- In final responses, include:
  1. `Founder Summary` (what changed, why it matters, what Cade should do next)
  2. `Agent Handoff` (for future AI agents only)
- If using process field labels like "First command/file to open," explain that it is for the next AI session, not for Cade unless explicitly stated.

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

## Verification Lanes (Required)

```bash
npm run verify:fast  # lint + typecheck + unit + build (always)
npm run e2e:smoke    # required for route/form/API/navigation/UI flow changes
npm run e2e:full     # run when FULL trigger policy applies
```

FULL trigger policy:

- PR targets `main`
- merge queue (`merge_group`)
- label `run-full-e2e`
- risky paths changed
- nightly schedule
- manual `workflow_dispatch`

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
- If the founder request is clear, implement immediately.
- If no explicit request is provided but `.ai/BACKLOG.md` has a clear top P0 item and there is no founder override, execute that top P0 item by default.
- Do not ask Cade to provide process tokens such as `GOAL / WHY / DONE MEANS` or to type `"go"`; those are internal agent alignment fields, not founder requirements.

### Triggers

- Clear founder request or unblocked top P0 backlog item → implement + verify
- "What do you think..." / "I'm not sure..." → propose Options A/B/C first
- Ask a clarifying question only when there is a real blocker (missing decision, missing access, or contradictory constraints).

---

## Autonomy By Default

Once the objective is clear (or top P0 is selected by default), do the full loop without extra prompts:

1. Implement
2. Verify (`npm run verify:fast`, then `npm run e2e:smoke` when applicable, and `npm run e2e:full` only when trigger policy applies)
3. Self-check against `DECISION_RIGHTS.md` + `CRITICAL_RULES.md`
4. Update `SESSION_LOG.md` + `STATE.md` (+ `BACKLOG.md` if priorities moved)
5. Create a structured next-agent handoff block per `HANDOFF_PROTOCOL.md`
6. Report back with proof

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

## Context Management

**For context portability across sessions/tools:**

- **`.ai/HANDOFF.md`** - Compressed context pack (5 min read, copy/paste primers)
- **`.ai/HANDOFF_PROTOCOL.md`** - Mandatory task closeout + next-agent handoff contract
- **`.ai/topics/INDEX.md`** - Topic capsule index (choose your domain)
- **`.ai/impl/`** - Implementation plans (approved architectures live here)
- **`copilot-instructions.md`** - Copilot Chat entry point (limited capabilities)
- **`npm run ai:memory:pack`** - Generates a timestamped machine-auditable context pack under `reports/context-packs/`
- **`npm run ai:checkpoint`** - Runs memory integrity checks + generates context pack in one step

These enable fast context-loading when switching tools (Claude → Codex → Copilot) or starting fresh.

---

## Next Step

Now read `CRITICAL_RULES.md` to learn the never-violate rules (Port 3001, colors, verification, etc.).

After the read order, use `.ai/USAGE.md` (Habit 2) to write a "Goldilocks" task spec (includes NOT DOING / CONSTRAINTS / EXAMPLES) and the course-correction script when the AI is misaligned.

If you're unsure what to optimize next (submissions vs retention vs SEO), read `.ai/CONTEXT.md` for the stable decision frame.

**For multi-session work:** Use `/checkpoint`, `/capsule`, and `/handoff` commands (Claude Code only) to keep context compressed and portable.
