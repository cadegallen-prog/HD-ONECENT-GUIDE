# Session Templates

**Purpose:** Copy-paste prompts for working with AI assistants. These are backup templates if auto-load doesn't work, or for reinforcing the workflow.

---

## Template 1: Session Start (Backup - usually auto-loaded)

**When to use:** If AI doesn't automatically read `.ai/` directory (rare, since Claude Code, Copilot, and Codex all auto-load via instruction files).

**Copy-paste this:**

```
Before we start, read all files in the .ai/ directory:
- CONTRACT.md (collaboration rules)
- DECISION_RIGHTS.md (what you can decide vs. must ask)
- CONSTRAINTS.md (fragile areas - don't touch)
- SESSION_LOG.md (recent work history)
- LEARNINGS.md (past mistakes to avoid)

Then summarize what you learned about how to work with me.

After that, ask me for GOAL / WHY / DONE for this session.
```

---

## Template 2: Task Definition (Use for Every Task)

**When to use:** Every time you want AI to do something.

**Copy-paste this and fill in the blanks:**

```
GOAL: [What you want - be specific]

WHY: [Who it helps or what problem it solves]

DONE MEANS:
- [Specific success criterion 1]
- [Specific success criterion 2]
- [Specific success criterion 3]
- Builds without errors (npm run build passes)
- Linting passes (npm run lint clean)
- I've tested it [on mobile / in browser / etc.]
```

**Example:**

```
GOAL: Add a "sort by date" button to the penny list

WHY: Newest finds are most actionable for users; they care more about today's clears than last week's

DONE MEANS:
- Sort button appears on /penny-list page
- Clicking it sorts newest first, clicking again sorts oldest first
- Works on mobile and desktop
- npm run build passes
- npm run lint passes
- I've tested it in my browser
```

---

## Template 3: Session End - "Confess Unfinished Work"

**When to use:** At the end of EVERY session, before you stop working.

**Copy-paste this:**

```
Before we end this session, do the following:

1. LIST COMPLETED ITEMS
   List everything you fully completed in this session.

2. LIST UNFINISHED ITEMS
   List everything you started but did not complete.
   For each unfinished item, clearly label it as **UNFINISHED**.

3. WRITE FUTURE PROMPTS
   For every unfinished item, write a complete copy-paste prompt
   that I can give to another AI (or you in a future session) to finish it.

   Format each as:

   **UNFINISHED: [Item name]**

   To complete this, copy-paste:
   ```
   [Complete prompt with all context needed to finish]
   ```

4. UPDATE SESSION_LOG.md
   Add an entry to .ai/SESSION_LOG.md with:
   - Date: [today]
   - AI: [Claude Code / Copilot / Codex]
   - Goal: [what we tried to do]
   - Outcome: [✅ Success / ⏸️ Blocked / ❌ Failed]
   - Summary: [brief description]
   - Completed items: [list]
   - Unfinished items: [list with future prompts]
   - Learnings: [anything new or surprising]
   - For Next AI: [important context or warnings]

5. UPDATE LEARNINGS.md (if applicable)
   If we discovered something new, surprising, or made a mistake,
   add it to .ai/LEARNINGS.md using the template in that file.

6. UPDATE STATE + BACKLOG
   - Refresh `.ai/STATE.md` (current snapshot)
   - Mark done / add next tasks in `.ai/BACKLOG.md`
```

---

## How to Use These Templates

### Normal Workflow (Auto-load working)

1. **Start session:** AI auto-reads `.ai/` directory (via CLAUDE.md or copilot-instructions.md)
2. **Define task:** Use Template 2 (GOAL/WHY/DONE)
3. **End session:** Use Template 3 (Confess unfinished work)

### Backup Workflow (Auto-load not working)

1. **Start session:** Use Template 1 (manual load)
2. **Define task:** Use Template 2 (GOAL/WHY/DONE)
3. **End session:** Use Template 3 (Confess unfinished work)

---

## Why These Templates Work

### Template 1: Session Start
- Forces AI to load ALL context (no partial loading)
- Ensures AI understands decision boundaries
- Prevents repeating past mistakes
- Works across Claude Code, Copilot, Codex

### Template 2: Task Definition
- Eliminates vague requests ("make it better")
- Provides context (WHY) so AI can make good design decisions
- Defines success criteria so there's no confusion about "done"
- Builds testing into the definition

### Template 3: Session End
- Creates accountability (AI must confess what's incomplete)
- Generates ready-made prompts for future sessions (no context loss)
- Updates SESSION_LOG for continuity
- Captures learnings so mistakes aren't repeated

---

## Quick Reference Card

**Start of session:**
- (Usually automatic via CLAUDE.md / copilot-instructions.md)
- If needed: Template 1

**For each task:**
- Template 2: GOAL / WHY / DONE

**End of session:**
- Template 3: Confess unfinished work + update logs

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial session templates created
