---
name: session-end
description: End a coding session with verification and documentation
---

## 1. Run Verification

Execute: `npm run ai:verify`

**All 4 gates MUST pass.** If any fail, fix before ending.

## 2. Update SESSION_LOG.md

Update current entry with:
- **Outcome:** ✅ Success or ❌ Partial (reason)
- **Changes Made:** (bullet list)
- **Verification:** (summary)
- **For Next AI:** (handoff notes)

## 3. Check Session Log Size

If > 5 entries, trim to 3 most recent (Rule #5).

## 4. Update STATE.md

If significant changes, update current state snapshot.

## 5. Update BACKLOG.md

- Mark completed tasks done
- Add new tasks discovered

## 6. Check for Learnings

If anything unexpected happened, add to `.ai/LEARNINGS.md`.

## 7. Confirm Completion

"Session complete. Verification passed. Docs updated."

---

**Never skip verification.** Cade cannot check your work - you must verify yourself.
