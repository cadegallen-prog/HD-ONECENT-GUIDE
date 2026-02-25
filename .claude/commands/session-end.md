---
name: session-end
description: End a coding session with verification and documentation
---

# /session-end

## Intent

Safely end a session, compress context, and optionally prepare for tool switching.

---

## Phase 1: Verification (Required, Lane-Based)

### 1. Choose Verification Lane

Use `.ai/VERIFICATION_REQUIRED.md` as canonical policy:

- **Runtime/code-path changes:** run `npm run verify:fast` always; run `npm run e2e:smoke` for route/form/API/navigation/UI-flow changes; run `npm run e2e:full` only when FULL trigger policy applies.
- **Docs-only/no runtime impact:** run `npm run ai:memory:check` + `npm run ai:checkpoint`; mark FAST/SMOKE/FULL as N/A with reason.

### 2. Run Required Commands

If any required lane fails, fix before ending.

### 3. Update SESSION_LOG.md

Update current entry with:

- **Outcome:** ✅ Success or ❌ Partial (reason)
- **Changes Made:** (bullet list)
- **Verification:** (summary)
- **Proof Links:** (reports/verification/ or reports/proof/)
- **For Next AI:** (handoff notes)

### 4. Check for Learnings

If anything unexpected happened, add to `.ai/LEARNINGS.md`.

---

## Phase 2: Context Compression (Checkpoint)

Run `/checkpoint` to:

- Compress `.ai/STATE.md` to "current sprint only"
- Move old content to archives
- Update pointers
- Keep context portable

---

## Phase 3: Optional Tool Switching (Handoff)

Ask Cade:

**"Switching tools in next session? (Claude → Codex → Copilot)"**

- **If YES:** Run `/handoff` to generate portable context pack + New Session Primer
- **If NO:** Done (return to Cade)

---

## Full Session Checklist

- [ ] Select verification lane per `.ai/VERIFICATION_REQUIRED.md`
- [ ] Runtime lane: run `npm run verify:fast` (+ `npm run e2e:smoke` when applicable, + `npm run e2e:full` only on trigger)
- [ ] Docs-only lane: run `npm run ai:memory:check` + `npm run ai:checkpoint`; mark FAST/SMOKE/FULL as N/A with reason
- [ ] Update `.ai/SESSION_LOG.md` with outcome + proof links
- [ ] Add learnings to `.ai/LEARNINGS.md` if applicable
- [ ] Run `/checkpoint` to compress STATE
- [ ] Ask: "Switching tools? (y/n)"
  - If yes: Run `/handoff` and print New Session Primer
  - If no: Done

---

## Shortcuts

**Quick Session (no major changes):**

1. Run `npm run ai:memory:check`
2. Run `/checkpoint`
3. Done

**Tool Switch (leaving for Codex/Copilot):**

1. Run required lane commands per `.ai/VERIFICATION_REQUIRED.md`
2. Run `/checkpoint`
3. Run `/handoff`
4. Copy/paste New Session Primer to next session

---

**Never skip verification.** Cade cannot check your work - you must verify yourself.
