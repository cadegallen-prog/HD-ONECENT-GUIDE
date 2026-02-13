# Verification Required (No Proof = Not Done)

This file exists to prevent the single most common failure mode: shipping changes without reproducible proof.

Authority note: if any secondary doc conflicts with this verification policy, this file is canonical.

If you (the agent) did not run a gate / capture a screenshot / verify a behavior, say so explicitly.

---

## What Counts As “Done”

To claim “done” on a meaningful change, provide:

1. **FAST lane output** (always):
   - `npm run verify:fast` (lint + typecheck + unit + build)
2. **SMOKE lane output** (required for route/form/API/navigation/UI-flow changes):
   - `npm run e2e:smoke`
3. **FULL lane output** (required when FULL trigger conditions apply):
   - `npm run e2e:full`
   - FULL trigger conditions: PR to `main`, merge queue, label `run-full-e2e`, risky paths changed, nightly schedule, or manual dispatch.
4. **UI proof** (only when UI/UX/copy/layout/visuals changed):
   - Playwright screenshots (light + dark) and a console error report
5. **Before/after proof** (only when fixing a bug):
   - “Before” reproduction evidence (error text, screenshot, or steps)
   - “After” evidence showing it’s resolved
6. **Memory updates** (for meaningful work):
   - `.ai/SESSION_LOG.md` (always)
   - `.ai/STATE.md` (when it changes current reality)
   - `.ai/BACKLOG.md` (only if priorities moved)
7. **Handoff block** (for meaningful work):
   - Include a structured next-agent handoff per `.ai/HANDOFF_PROTOCOL.md`
   - Must include: completion status, changed files, verification paths, open risks, and immediate next step

If the change is truly docs-only and no code paths changed, you can say “Docs-only change; gates not run” — but do not claim the system is green.

---

## Preferred Command Set (Recommended)

Run:

```bash
npm run verify:fast
```

And, when applicable:

```bash
npm run e2e:smoke
```

Run full e2e only when trigger policy requires it:

```bash
npm run e2e:full
```

Legacy full-bundle command (still available):

```bash
npm run ai:verify
```

`ai:verify` runs lint/build/unit/e2e and saves artifacts to:

- `reports/verification/<timestamp>/lint.txt`
- `reports/verification/<timestamp>/build.txt`
- `reports/verification/<timestamp>/unit.txt`
- `reports/verification/<timestamp>/e2e.txt`
- `reports/verification/<timestamp>/summary.md`

### Dev/Test Modes (Port Ownership)

- **Default mode (no args):** `npm run ai:verify` runs isolated **test mode** on Playwright-owned port **3002**.
- **Dev mode (explicit opt-in; requires healthy dev server on 3001):** `npm run ai:verify -- dev`
- **Test mode (explicit):** `npm run ai:verify -- test`
- **Legacy alias:** `npm run ai:verify -- auto` maps to test mode for backward compatibility.

When reporting back, link the generated `summary.md` plus call out any failures.

---

## UI Proof (When UI Changed)

If the dev server is running on port 3001, capture screenshots via:

```bash
npm run ai:proof -- /penny-list /report-find
```

Artifacts are saved to:

- `reports/proof/<timestamp>/*.png`
- `reports/proof/<timestamp>/console-errors.txt`

Use the screenshots as the “before/after” proof when applicable.

---

## Paste-Ready Template (Use In Final Reply / SESSION_LOG)

```markdown
## Verification

**Tests (required):**

- `npm run verify:fast`: ✅/❌ (link output or paste)
- `npm run e2e:smoke`: ✅/❌ or N/A (state why)
- `npm run e2e:full`: ✅/❌ or N/A (state trigger status)

**Bundle (preferred):**

- `reports/verification/<timestamp>/summary.md`

**Playwright (UI changes only):**

- `reports/proof/<timestamp>/...-light.png`
- `reports/proof/<timestamp>/...-dark.png`
- `reports/proof/<timestamp>/console-errors.txt`

**Problem fixed (bug fixes only):**

- Before: [what was wrong + evidence]
- After: [what changed + evidence]

## Next-Agent Handoff

### Objective + Why

- Goal:
- Why it matters:

### Completion Status

- Completed:
- Not completed:
- Out of scope:

### Files Changed

- `path/to/file` — why it changed

### Risks / Watchouts

- Remaining risks:
- Regressions to watch:

### Immediate Next Step

- Single next task:
- First command/file to open:
```
