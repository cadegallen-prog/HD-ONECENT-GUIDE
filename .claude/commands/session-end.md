---
name: session-end
description: End a coding session with verification and documentation
---

End the session by completing these steps:

## 1. Run Verification

Execute: `npm run ai:verify`

If any gate fails:
- Do NOT mark session complete
- Report the failures
- Fix them before ending

## 2. Update SESSION_LOG.md

Update the current session entry with:
- **Status:** Complete (or Partial - [reason])
- **What was done:** (bullet list)
- **Files modified:** (list)
- **Verification results:** (paste summary)
- **Notes for next session:** (if any)

## 3. Update STATE.md

If significant changes were made, update `.ai/STATE.md` to reflect the new current state.

## 4. Update BACKLOG.md

- Mark completed tasks as done
- Add any new tasks discovered during the session

## 5. Check for Learnings

If anything unexpected happened (bugs, gotchas, edge cases), add to `.ai/LEARNINGS.md`.

## 6. Confirm Completion

Tell the user: "Session complete. All docs updated. Verification passed."
