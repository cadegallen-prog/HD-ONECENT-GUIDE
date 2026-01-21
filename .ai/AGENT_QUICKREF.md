# Agent Quick Reference Card

Print this or keep it open. These are the exact phrases to use.

---

## Starting a Session

Say: **"Run /doctor and read the project context from .ai/STATE.md and .ai/BACKLOG.md"**

---

## The Agents (What to Say)

| When You Want To...  | Say This                                                            |
| -------------------- | ------------------------------------------------------------------- |
| Design a new feature | "Act as the **architect** agent. I want to add [describe feature]." |
| Build approved code  | "Act as the **implementer** agent. Build [the plan/feature]."       |
| Write/run tests      | "Act as the **tester** agent. Write tests and run verification."    |
| Fix a bug            | "Act as the **debugger** agent. [Describe the problem/error]."      |
| Check before merging | "Act as the **reviewer** agent. Check the changes."                 |
| Update documentation | "Act as the **documenter** agent. Update the session log."          |
| Explore ideas        | "Act as the **brainstormer** agent. I'm thinking about [idea]."     |

---

## Standard Feature Workflow

1. **"Act as the architect agent. I want to [feature]."**
   - Wait for plan
   - Say "Approved" if it looks good

2. **"Act as the implementer agent. Build it."**
   - Wait for code

3. **"Act as the tester agent. Verify."**
   - Wait for all 4 gates to pass

4. **"Act as the reviewer agent. Check everything."**
   - Wait for approval

5. **Commit the changes** (if approved)

---

## Bug Fix Workflow

1. **"Act as the debugger agent. [Error message or description]."**
   - Wait for root cause

2. **"Act as the implementer agent. Fix it."**
   - Wait for fix

3. **"Act as the tester agent. Verify the fix."**
   - If passes: done
   - If fails: go back to step 1

---

## Ending a Session

Say: **"Act as the documenter agent. Update SESSION_LOG.md. Then run /verify."**

---

## If Something Goes Wrong

| Problem                  | Say This                                                     |
| ------------------------ | ------------------------------------------------------------ |
| Agent is going off-track | "Stop. You're outside scope. Focus only on [specific task]." |
| Agent made a mistake     | "Undo that. Act as the debugger agent and investigate."      |
| Not sure what happened   | "Explain what you just did in plain English."                |
| Need to start over       | "Disregard previous changes. Start fresh as [agent]."        |

---

## The Rules (Agents Follow These)

- **Architect:** Plans only, doesn't code
- **Implementer:** Codes only what's approved
- **Tester:** Tests only, doesn't change source code
- **Debugger:** Investigates first, fixes second
- **Reviewer:** Read-only, approves or rejects
- **Documenter:** Updates .ai/ files only
- **Brainstormer:** Explores options, doesn't decide

---

## Quick Checks

Before committing, verify:

- [ ] All 4 gates pass (`npm run ai:verify`)
- [ ] No raw Tailwind colors (`npm run lint:colors`)
- [ ] No PII exposed (`npm run security:scan`)
- [ ] SESSION_LOG.md updated
