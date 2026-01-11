# Verification Required (No Proof = Not Done)

This file exists to prevent the single most common failure mode: shipping changes without reproducible proof.

If you (the agent) did not run a gate / capture a screenshot / verify a behavior, say so explicitly.

---

## What Counts As “Done”

To claim “done” on a meaningful change, provide:

1. **All 4 quality gates** (raw output or saved artifacts):
   - `npm run lint`
   - `npm run build`
   - `npm run test:unit`
   - `npm run test:e2e`
2. **UI proof** (only when UI/UX/copy/layout/visuals changed):
   - Playwright screenshots (light + dark) and a console error report
3. **Before/after proof** (only when fixing a bug):
   - “Before” reproduction evidence (error text, screenshot, or steps)
   - “After” evidence showing it’s resolved
4. **Memory updates** (for meaningful work):
   - `.ai/SESSION_LOG.md` (always)
   - `.ai/STATE.md` (when it changes current reality)
   - `.ai/BACKLOG.md` (only if priorities moved)

If the change is truly docs-only and no code paths changed, you can say “Docs-only change; gates not run” — but do not claim the system is green.

---

## Preferred: One-Command Proof Bundle (Recommended)

Run:

```bash
npm run ai:verify
```

This runs all 4 gates and saves artifacts to:
- `reports/verification/<timestamp>/lint.txt`
- `reports/verification/<timestamp>/build.txt`
- `reports/verification/<timestamp>/unit.txt`
- `reports/verification/<timestamp>/e2e.txt`
- `reports/verification/<timestamp>/summary.md`

### Dev/Test Modes (Port Ownership)

- **Dev mode (requires healthy dev server on 3001):** `npm run ai:verify -- dev`
- **Test mode (ignore 3001; Playwright-owned server on 3002):** `npm run ai:verify -- test`

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
- `npm run lint`: ✅/❌ (link output or paste)
- `npm run build`: ✅/❌ (link output or paste)
- `npm run test:unit`: ✅/❌ (link output or paste)
- `npm run test:e2e`: ✅/❌ (link output or paste)

**Bundle (preferred):**
- `reports/verification/<timestamp>/summary.md`

**Playwright (UI changes only):**
- `reports/proof/<timestamp>/...-light.png`
- `reports/proof/<timestamp>/...-dark.png`
- `reports/proof/<timestamp>/console-errors.txt`

**Problem fixed (bug fixes only):**
- Before: [what was wrong + evidence]
- After: [what changed + evidence]
```
