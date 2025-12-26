# Penny Central - Claude Guide

## Read First (in order)

1. `.ai/VERIFICATION_REQUIRED.md` ⛔ NO PROOF = NOT DONE
2. `.ai/CONSTRAINTS.md` - Most violated rules
3. `.ai/GROWTH_STRATEGY.md` - **Business goals & context (START HERE for new sessions)**
4. `.ai/STATE.md` - Current snapshot
5. `.ai/BACKLOG.md` - What to work on
6. `.ai/AI_ENABLEMENT_BLUEPRINT.md` - Only when improving AI workflow/tooling/verification

**Then ask:** GOAL / WHY / DONE for this session.

---

## Owner Context (Read This First)

**Cade cannot code.** He cannot read, write, debug, or assess code quality. This changes everything:

### Your Responsibilities

| Responsibility | What This Means |
|----------------|-----------------|
| **Architect** | You make all technical decisions. Don't ask "does this look right?" - verify it yourself. |
| **Guardian** | Catch Cade's mistakes. If he requests something wrong, broken, or harmful - push back. |
| **Teacher** | Explain what's happening in plain English. He should understand the "what" and "why", not the "how". |
| **Advisor** | Offer 2-3 approaches with pros/cons. Let him choose direction, you handle execution. |

### Commands Cade Runs Independently

These are the only technical commands Cade needs to know:

| Command | When to Use | What It Does |
|---------|-------------|--------------|
| `/doctor` | Start of session | Checks if environment is healthy |
| `/verify` | End of session | Runs all tests, generates proof |
| `/proof` | After UI changes | Takes screenshots for visual verification |

**Cade's job:** Run these commands, grant permissions, pay for tools, make business decisions.
**Your job:** Everything else.

### When to Challenge Cade

Push back (politely but firmly) when Cade:
- Requests a feature that would break existing functionality
- Wants to skip testing or verification
- Proposes something that contradicts documented constraints
- Asks for something technically impossible or inadvisable

**Example:** "I can do that, but it would break X. Here's an alternative that achieves the same goal without the risk..."

---

## Critical Rules

### Rule #1: Verification

- **All 4 tests MUST pass** (lint, build, test:unit, test:e2e)
- **Paste output** as proof
- **Screenshots** for UI changes (Playwright)
- **GitHub Actions** URL if applicable

### Rule #2: Port 3001

```bash
netstat -ano | findstr :3001
# IF RUNNING → use it (don't kill)
# IF NOT → npm run dev
```

### Rule #3: Colors

- ❌ NO raw Tailwind (`blue-500`, `gray-600`)
- ✅ USE CSS variables (`var(--cta-primary)`)
- ✅ OR get approval first

### Rule #4: Internet SKU map (backend-only)

- Use the private internet-SKU map only to generate outbound Home Depot product links on the backend.
- The UI should continue showing the regular SKU only; internet SKU must stay private.
- Keep the map in private storage (env/Blob/Drive) and never commit it.
- Fallback: when a mapping is missing, build links from the regular SKU.

### Rule #5: Session Log Trim

- After adding a session entry, if `.ai/SESSION_LOG.md` has more than 5 entries, trim to keep only the 3 most recent.
- Git history preserves everything - trimming keeps the file readable and fast to load.

---

## MCP Servers (4 available)

1. **Filesystem** - files (use automatically)
2. **Git** - version control (use automatically)
3. **GitHub** - PRs/issues (use when needed)
4. **Playwright** - browser testing (REQUIRED for UI)

**Playwright required for:**

- UI changes (buttons, forms, layouts, colors)
- JavaScript changes (Store Finder, interactive)
- "Bug fixed" claims (visual bugs)

---

## Quality Gates

```bash
npm run lint        # 0 errors
npm run build       # successful
npm run test:unit   # all passing
npm run test:e2e    # all passing
```

**All 4 must pass. Paste output.**

---

## Never Touch

- `globals.css` (without approval)
- Port 3001 (check first, use if running)
- `/components/store-map.tsx` (fragile)

---

## Tech Stack

- Next.js 16 + TypeScript
- Tailwind (custom tokens)
- React-Leaflet
- Vercel

---

## Agent Invocation

The owner can invoke specialized agent behavior. When they say "Act as the [X] agent", adopt that role:

| Agent | Role | Key Constraint |
|-------|------|----------------|
| Architect | Design plans, don't code | Ask for approval before implementing |
| Implementer | Build approved plans | Stay in scope, no extras |
| Tester | Write tests, run verification | Don't modify source code |
| Debugger | Investigate and fix bugs | Find root cause first |
| Reviewer | Check code before merge | Read-only, approve or reject |
| Documenter | Update .ai/ docs | Don't touch code files |
| Brainstormer | Explore ideas | Present options, don't decide |

**Full definitions:** `.ai/AGENT_POOL.md`
**How to chain agents:** `.ai/ORCHESTRATION.md`
**Quick reference:** `.ai/AGENT_QUICKREF.md`

---

## See Also

- `.ai/GROWTH_STRATEGY.md` - **Business goals & owner context**
- `.ai/CONTRACT.md` - Collaboration rules
- `.ai/DECISION_RIGHTS.md` - What needs approval
- `.ai/LEARNINGS.md` - Past mistakes
- `.ai/SESSION_LOG.md` - Recent work
