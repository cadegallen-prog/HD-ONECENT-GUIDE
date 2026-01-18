---
name: session-end
description: End a coding session with verification and documentation
---

# /session-end

## Intent

Safely end a session, compress context, and optionally prepare for tool switching.

---

## Phase 1: Verification (Always)

### 1. Run Verification

Execute: `npm run ai:verify`

**All 4 gates MUST pass.** If any fail, fix before ending.

### 2. Update SESSION_LOG.md

Update current entry with:
- **Outcome:** ✅ Success or ❌ Partial (reason)
- **Changes Made:** (bullet list)
- **Verification:** (summary)
- **Proof Links:** (reports/verification/ or reports/proof/)
- **For Next AI:** (handoff notes)

### 3. Check for Learnings

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

- **If YES:** Run `/handoff` to generate portable context pack + New Chat Primer
- **If NO:** Done (return to Cade)

---

## Full Session Checklist

- [ ] Run `npm run ai:verify` (all 4 gates pass)
- [ ] Update `.ai/SESSION_LOG.md` with outcome + proof links
- [ ] Add learnings to `.ai/LEARNINGS.md` if applicable
- [ ] Run `/checkpoint` to compress STATE
- [ ] Ask: "Switching tools? (y/n)"
  - If yes: Run `/handoff` and print New Chat Primer
  - If no: Done

---

## Shortcuts

**Quick Session (no major changes):**
1. Run `npm run ai:verify`
2. Run `/checkpoint`
3. Done

**Tool Switch (leaving for Codex/Copilot):**
1. Run `npm run ai:verify`
2. Run `/checkpoint`
3. Run `/handoff`
4. Copy/paste New Chat Primer to next session

---

**Never skip verification.** Cade cannot check your work - you must verify yourself.
