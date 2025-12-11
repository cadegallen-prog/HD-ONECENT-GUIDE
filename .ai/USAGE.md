# Daily Usage Guide

**Ultra-simple guide for working with AI on PennyCentral.com**

---

## The Three-Habit System

### Habit 1: Start Your Session

### Habit 2: Define Each Task

### Habit 3: End Your Session

That's it. Three copy-paste actions.

---

## Habit 1: Start Your Session

### With Claude Code

✅ **Auto-loads** - Just start working

- Claude Code reads `CLAUDE.md` automatically
- CLAUDE.md tells it to read `.ai/` directory
- No prompt needed

### With GitHub Copilot

✅ **Auto-loads** - Just start working

- Copilot reads `.github/copilot-instructions.md` automatically
- That file tells it to read `.ai/` directory
- No prompt needed

### With ChatGPT Codex

✅ **Auto-loads** - Just start working

- Codex reads `.github/copilot-instructions.md` via your config
- That file tells it to read `.ai/` directory
- No prompt needed

### If Auto-Load Fails (Rare)

Use this backup prompt from `SESSION_TEMPLATES.md`:

```
Before we start, read all files in the .ai/ directory:
- CONTRACT.md, DECISION_RIGHTS.md, CONSTRAINTS.md,
  SESSION_LOG.md, LEARNINGS.md

Then ask me for GOAL / WHY / DONE for this session.
```

---

## Habit 2: Define Each Task (Use Every Time)

Copy-paste this and fill in the blanks:

```
GOAL: [What you want - be specific]

WHY: [Who it helps or what problem it solves]

DONE MEANS:
- [Success criterion 1]
- [Success criterion 2]
- Builds without errors (npm run build passes)
- Linting passes (npm run lint clean)
- I've tested it
```

### Example

```
GOAL: Add a filter dropdown to the penny list so users can view only "Rare" items

WHY: Users are overwhelmed by long lists and want to focus on high-value finds

DONE MEANS:
- Filter dropdown appears above the penny list
- Selecting "Rare" shows only rare items
- Selecting "All" shows everything
- Works on mobile and desktop
- npm run build passes
- npm run lint passes
- I've tested it on /penny-list page
```

---

## Habit 3: End Your Session (Critical!)

At the end of every session, copy-paste this:

```
Before we end this session:

1. List everything you fully COMPLETED
2. List everything UNFINISHED (started but not done)
3. For each unfinished item, write a complete copy-paste prompt
   I can give to another AI to finish it
4. Update .ai/SESSION_LOG.md with this session's work
5. If we learned something new, add it to .ai/LEARNINGS.md
```

### Why This Matters

This forces AI to:

- **Confess** what's incomplete (no hiding blockers)
- **Write future prompts** for you (no context loss)
- **Document** the session (persistent memory)
- **Capture learnings** (don't repeat mistakes)

**Without this habit, you lose context between sessions.**

---

## Complete Daily Workflow

```
┌─────────────────────────────────────────┐
│ HABIT 1: START SESSION                  │
│ (Usually automatic)                     │
└─────────────────────────────────────────┘
           ↓
┌─────────────────────────────────────────┐
│ HABIT 2: DEFINE TASK                    │
│ GOAL / WHY / DONE                       │
└─────────────────────────────────────────┘
           ↓
    AI works on task
           ↓
   AI explains approach
           ↓
    You approve or adjust
           ↓
    AI implements
           ↓
    AI tests (build + lint)
           ↓
    You test in browser
           ↓
┌─────────────────────────────────────────┐
│ HABIT 3: END SESSION                    │
│ Confess unfinished + update logs        │
└─────────────────────────────────────────┘
```

---

## What Auto-Loads (Behind the Scenes)

When you start Claude Code, Copilot, or Codex, they automatically read:

1. **Instruction files:**
   - `CLAUDE.md` (Claude Code)
   - `.github/copilot-instructions.md` (Copilot + Codex)

2. **Those files tell AI to read `.ai/` directory:**
   - `.ai/CONTRACT.md` - How we work together
   - `.ai/DECISION_RIGHTS.md` - What AI can decide
   - `.ai/CONSTRAINTS.md` - What AI can't touch
   - `.ai/SESSION_LOG.md` - Recent work history
   - `.ai/LEARNINGS.md` - Past mistakes to avoid
   - `.ai/MCP_SERVERS.md` - Available MCP tools (ChatGPT Codex)
   - `.ai/TESTING_CHECKLIST.md` - QA procedures
   - `.ai/STOPPING_RULES.md` - When to stop working

3. **AI then asks you for GOAL / WHY / DONE**

**You don't have to manage this. It just happens.**

### For ChatGPT Codex: MCP Tools

ChatGPT Codex additionally loads 6 MCP (Model Context Protocol) servers that give it superpowers:

- **filesystem** - Read/write project files efficiently
- **github** - Create PRs, request reviews, manage issues
- **git** - Check branches, view diffs, understand history
- **chrome-devtools** - Test in real browser, check performance
- **pylance** - Validate and run Python code
- **sequential-thinking** - Extended reasoning for complex problems

**You don't configure this. It's already set up.**

**AI uses these automatically when appropriate.**

For details, AI can read `.ai/MCP_SERVERS.md` and `.ai/AI-TOOLS-SETUP.md`.

---

## Troubleshooting

### "AI doesn't seem to know about .ai/ directory"

- Use the backup prompt from Habit 1 (SESSION_TEMPLATES.md)
- Check that AI actually read CLAUDE.md or copilot-instructions.md

### "AI is doing things without asking"

- Check `.ai/DECISION_RIGHTS.md` - might be in the "AI Can Decide" zone
- If it shouldn't be, tell AI: "Per DECISION_RIGHTS.md, you should ask first"

### "AI made changes to globals.css or other fragile areas"

- Check `.ai/CONSTRAINTS.md` - those are in the "NEVER" list
- Tell AI: "You violated CONSTRAINTS.md. Revert this and propose instead."

### "I forgot what happened last session"

- Read `.ai/SESSION_LOG.md` - recent entries show what was done
- Look for "Unfinished Items" and "Future Prompts" sections

---

## How Long Does This Take?

**Habit 1 (Start):** 0 seconds (automatic) or 5 seconds (paste backup prompt)
**Habit 2 (Define Task):** 30-60 seconds per task
**Habit 3 (End Session):** 60-120 seconds

**Total overhead: ~2 minutes per session**

**Value gained: Eliminates 15+ minute "wait, what were we doing?" cycles**

---

## Advanced: Switching Between AI Tools

If you start in Claude Code and want to continue in Copilot:

1. End your Claude Code session with Habit 3 (updates SESSION_LOG.md)
2. Open Copilot (it auto-reads copilot-instructions.md → .ai/ directory → SESSION_LOG.md)
3. Say: "Read the most recent SESSION_LOG entry. I want to continue from there."
4. Use Habit 2 to define your next task

**No context loss. Seamless handoff.**

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial usage guide
