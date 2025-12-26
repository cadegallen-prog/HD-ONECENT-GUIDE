# Session Start — Mandatory Read Order & Reliability Contract

**⚠️ Read this first. Every session.**

You are Codex (VS Code extension/CLI), Claude Code (VS Code extension), or Copilot Chat (VS Code). This file defines what you must do before any work, and what "done" means so the founder doesn't have to repeat themselves 50-60 times per day.

---

## Phase 0: Confirm You've Read This

Before claiming you understand the project, paste this confirmation (copy/paste it verbatim):

```
I have read .ai/SESSION_START.md. I understand:
1. The mandatory read order (below)
2. The four non-negotiables (below)
3. When proof is required
4. The three cross-agent alignment rules
5. How to claim "done" (template at bottom)
```

**If you skip this, the founder will ask you to restart. It's not punishment; it's the rule.**

---

## Mandatory Read Order (In This Order)

**Every session must start with these files, in order. No exceptions, no cherry-picking.**

1. `.ai/STATE.md` — current project snapshot (what's built, what's broken)
2. `.ai/BACKLOG.md` — prioritized list of what's next
3. `.ai/CONTRACT.md` — what you're allowed to do (scope, autonomy, decisions)
4. `.ai/DECISION_RIGHTS.md` — who decides what (yours vs. founder's call)
5. `.ai/CONSTRAINTS.md` — hard limits (no new deps, no env vars without justification, port 3001 rule, etc.)
6. `.ai/FOUNDATION_CONTRACT.md` — technical non-negotiables (color rule, Playwright rule, etc.)
7. `.ai/GUARDRAILS.md` — safety checks (no PII, no proprietary data, repo-native only)
8. **Latest entries in `.ai/SESSION_LOG.md`** (scroll to the end; see what was tried recently)
9. `.ai/CONTEXT.md` — product context (who the users are, what they care about)

**Total time:** ~5–8 minutes to skim. **Payoff:** no repetition, no regressions, no surprise reversals.

---

## Canonical Instructions (One Per Extension)

After the read order above, check **your tool's entrypoint**:

- **Codex (VS Code extension):** read `.ai/AGENTS.md`
- **Claude Code (VS Code extension):** read `CLAUDE.md`
- **Copilot Chat (VS Code):** read `.github/copilot-instructions.md`

These are short (30–60 sec each) and tie back to the read order, design system, and non-negotiables.

---

## If the Goal Is "AI Workflow/Enablement/Tooling"

After the mandatory read order + your extension's instructions, **also** read `.ai/AI_ENABLEMENT_BLUEPRINT.md`. It defines how to propose and implement improvements that reduce the founder's repetition and waiting time.

---

## The Four Non-Negotiables (Keep These in Every Decision)

These are not suggestions. They are rules that are tested by gates.

### 1. Verification Required
See `.ai/VERIFICATION_REQUIRED.md`. **Before claiming "done":**
- Paste raw test outputs: `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`
- If UI changed: Playwright screenshots (before/after, light/dark, console clean)
- If colors/styles changed: also `npm run lint:colors` (no raw Tailwind palette)
- If docs changed: `README.md`, `.ai/STATE.md`, `.ai/BACKLOG.md`, `.ai/SESSION_LOG.md`, `CHANGELOG.md` updated

**No proof = not done.** Period.

### 2. Port 3001 Rule
Never kill it. Use it if running. If not, start the dev server. Check before every run:
```bash
netstat -ano | findstr :3001
```

### 3. Color Rule
- ❌ **FORBIDDEN:** raw Tailwind colors like `blue-500`, `bg-gray-600`, `text-red-400`
- ✅ **REQUIRED:** CSS variables like `var(--cta-primary)`, `var(--text-primary)`
- Test with `npm run lint:colors` (0 errors required)

### 4. Main-Only Workflow
- You work on `main`. There are no feature branches.
- Commit early, push often, deploy with every push (via Vercel).
- Document in `SESSION_LOG.md` as you go.

---

## Cross-Agent Alignment (These Three Rules Prevent Drift)

### Rule 1: Same Read Order
Codex, Claude Code, and Copilot all follow the same mandatory read order (Section 2, above). If they diverge, the founder will ask for re-sync first.

### Rule 2: Repo-Native Only
All tools, scripts, and improvements must be in the repo (as `npm scripts`, `.vscode/tasks.json`, Playwright specs, or docs). Do not add proprietary extension features or vendor lock-in. If all three agents can't use it the same way, it's not allowed.

### Rule 3: Proof Is Reproducible
If a workflow depends on screenshots, logs, or artifacts, the repo defines:
- Where they live (e.g., `reports/verification/`)
- How to generate them (script name, exact command)
- How to reference them in `SESSION_LOG.md`

---

## How to Claim "Done"

Use this template **every time**. No shortcuts. Copy/paste it and fill it in:

```markdown
## Verification

**Tests:**
- lint: ✅ 0 errors
- build: ✅ success
- test:unit: ✅ [N]/[N] passing
- test:e2e: ✅ [N]/[N] passing
- lint:colors: ✅ 0 raw Tailwind colors (if applicable)

**Playwright (if UI changed):**
- Before: [screenshot link or embedded]
- After: [screenshot link or embedded]
- Light mode: ✅
- Dark mode: ✅
- Console: ✅ no errors

**Docs Updated:**
- `.ai/STATE.md`: ✅ [what changed]
- `.ai/BACKLOG.md`: ✅ [what changed or removed]
- `.ai/SESSION_LOG.md`: ✅ [date, what was done, proof refs]
- `README.md`: ✅ [what changed] or ❌ not applicable

**Commit:**
- Hash: [git commit hash]
- Message: [clear, one-line description]

**GitHub Actions (if applicable):**
- ✅ Passed: [link to run]

**Problem Solved:**
- Before: [describe what was broken]
- After: [describe what now works]
```

**Post this in full. Do not abbreviate or skip sections.**

---

## If You Get Stuck

1. **"I don't know what to do next"** → read `BACKLOG.md` (prioritized list)
2. **"I don't have permission to X"** → read `DECISION_RIGHTS.md` (who decides)
3. **"I'm not sure if I can do Y"** → read `CONSTRAINTS.md` (hard limits)
4. **"The founder just changed direction"** → read latest `SESSION_LOG.md` and ask: "Is the backlog stale?" (update it)
5. **"Tests are hanging/timing out"** → read `LEARNINGS.md` (known issues) and `.ai/TESTING_CHECKLIST.md` (debugging flow)

---

## Proof Examples

### Example: "Add a button to the homepage"

**Before:**
```
[screenshot of homepage without button]
```

**After:**
```
[screenshot with new button]
```

**Test outputs:**
```
$ npm run lint
✓ 0 errors

$ npm run build
✓ 902 pages, next@16.0.10

$ npm run test:unit
✓ 21/21 tests passing

$ npm run test:e2e
✓ 64/64 tests passing
```

**Docs:**
```
- BACKLOG.md: moved "Add button to homepage" to ✅ Done
- SESSION_LOG.md: "2025-12-25: Added CTA button to /page.tsx (commit abc123)"
```

---

## Why This Exists

You're not a developer, and you shouldn't have to debug AI agents. These rules are here so:
- Agents don't drift or forget what they're supposed to do
- You don't have to repeat yourself 50+ times per day
- Proof is built-in, not optional
- Work moves forward without regression

**Read this once per session. It takes 2 minutes. It saves hours.**

---

## Quick Links

- **Full rules:** `.ai/CONSTRAINTS.md` + `.ai/FOUNDATION_CONTRACT.md`
- **Test reference:** `.ai/TESTING_CHECKLIST.md`
- **If enablement work:** `.ai/AI_ENABLEMENT_BLUEPRINT.md`
- **If you're planning ahead:** `.ai/BACKLOG.md` + `PROJECT_ROADMAP.md`
- **If something broke:** `.ai/LEARNINGS.md` (known issues + fixes)
