# AI Collaboration System

**Created:** December 7, 2025
**Purpose:** Cross-AI collaboration protocol for PennyCentral.com
**Works with:** Claude Code, ChatGPT Codex, GitHub Copilot

---

## What This Is

A structured system that lets Cade (non-coder) effectively manage PennyCentral.com by orchestrating AI assistants across multiple tools and sessions.

**Problem it solves:**
- Context loss between AI sessions
- Inconsistent quality across different AI tools
- Unclear decision boundaries (what AI should decide vs. ask about)
- Repeated mistakes (no persistent memory)
- Difficulty handing off between Claude, ChatGPT, and Copilot

**How it works:**
- All documentation in tool-agnostic markdown
- Clear contracts and decision rights
- Session logs for continuity
- Learnings database to avoid repeating mistakes

---

## File Structure

```
.ai/
├── README.md              ← You are here (index/overview)
├── USAGE.md               ← ⭐ START HERE (ultra-simple daily guide)
├── QUICKSTART.md          ← Detailed explanation and scenarios
├── SESSION_TEMPLATES.md   ← Copy-paste prompts for sessions
├── CONTRACT.md            ← Collaboration agreement
├── DECISION_RIGHTS.md     ← What AI can decide vs. needs approval
├── CONSTRAINTS.md         ← Technical red lines (don't touch)
├── SESSION_LOG.md         ← Running history of AI work
├── LEARNINGS.md           ← Accumulated knowledge
├── PENNY_LIST_PLAN.md     ← Active feature plan (penny list improvements)
├── MCP_SERVERS.md         ← ⭐ Complete MCP tool reference
├── AI-TOOLS-SETUP.md      ← Tool configuration & auto-loading
├── TESTING_CHECKLIST.md   ← Comprehensive QA procedures
└── STOPPING_RULES.md      ← When AI should stop working
```

---

## Quick Reference

### For Cade (Human)

**New to this system?**
→ Read `USAGE.md` first (ultra-simple daily guide)

**Starting an AI session?**
→ Just start working! (Auto-loads via CLAUDE.md / copilot-instructions.md)
→ If auto-load fails: Use SESSION_TEMPLATES.md

**Want to add a feature?**
→ Use format: GOAL / WHY / DONE MEANS (see USAGE.md)

**Ending a session?**
→ Use "Session End" template from SESSION_TEMPLATES.md

**Not sure if AI can decide something?**
→ Check `DECISION_RIGHTS.md`

**Want to see recent work?**
→ Read `SESSION_LOG.md`

---

### For AI Assistants

**Starting a session?**
→ Read all files in this directory (especially CONTRACT, DECISION_RIGHTS, CONSTRAINTS)
→ Review `MCP_SERVERS.md` for available tools and best practices

**Before modifying code?**
→ Check `CONSTRAINTS.md` for fragile areas
→ Check `TESTING_CHECKLIST.md` for what to test

**Before using MCP tools heavily?**
→ Read `MCP_SERVERS.md` anti-patterns section
→ Check `AI-TOOLS-SETUP.md` for configuration details

**Completed a task?**
→ Update `SESSION_LOG.md` with summary
→ Run testing checklist (`.ai/TESTING_CHECKLIST.md`)

**Discovered something new?**
→ Add to `LEARNINGS.md`

**Unsure if you need approval?**
→ Check `DECISION_RIGHTS.md` (when in doubt, ask)

---

## The Files Explained

### ⭐ USAGE.md
**For:** Cade
**Purpose:** Ultra-simple daily workflow guide
**Read when:** Every day, until the three habits become automatic
**Key sections:** The three-habit system, complete daily workflow, troubleshooting

---

### 📋 QUICKSTART.md
**For:** Cade
**Purpose:** Deeper explanation with scenarios and examples
**Read when:** First time, or when you want to understand the "why" behind the system
**Key sections:** How to start AI sessions, common scenarios, tips for stellar results

---

### 📝 SESSION_TEMPLATES.md
**For:** Cade
**Purpose:** Copy-paste prompts for starting, working, and ending sessions
**Read when:** When you need the exact prompt to paste
**Key sections:** Session start (backup), GOAL/WHY/DONE template, Session end "confess unfinished work"

---

### 🤝 CONTRACT.md
**For:** Both human and AI
**Purpose:** Define the collaboration agreement
**Read when:** Starting a new AI session or tool
**Key sections:** What Cade provides, what AI provides, communication protocol, quality standards

---

### ⚖️ DECISION_RIGHTS.md
**For:** Both human and AI
**Purpose:** Clear boundaries for autonomous decisions vs. approval needed
**Read when:** AI is unsure if it should proceed or ask; Cade wonders why AI is asking
**Key sections:** Green (AI decides), Yellow (propose first), Red (never without permission)

---

### 🎯 CONTEXT.md
**For:** AI (but Cade can update)
**Purpose:** Understand WHY this project exists and WHO it serves
**Read when:** Starting work, making UX decisions, prioritizing features
**Key sections:** The community, the problem this solves, the vision, current state

---

### 🚫 CONSTRAINTS.md
**For:** AI
**Purpose:** Technical red lines that must NOT be crossed
**Read when:** Before modifying code, especially fragile areas
**Key sections:** Never touch (globals.css, React-Leaflet, "use client"), fragile areas, quality gates

---

### 📝 SESSION_LOG.md
**For:** Both human and AI
**Purpose:** Running history of what AI assistants have done
**Read when:** Starting a new session, handing off between tools
**Key sections:** Recent entries, template for new entries
**Update:** After completing each significant task

---

### 💡 LEARNINGS.md
**For:** Both human and AI
**Purpose:** Lessons learned the hard way (don't repeat mistakes)
**Read when:** Working on a feature, encountering an issue
**Key sections:** React-Leaflet hydration, Google Sheets as backend, build vs dev mode
**Update:** When discovering something new or surprising

---

### 🔧 MCP_SERVERS.md
**For:** AI (ChatGPT CodeX primarily)
**Purpose:** Complete reference for all 6 Model Context Protocol servers
**Read when:** Before using MCP tools extensively, when optimizing token usage
**Key sections:** Server capabilities, best practices, anti-patterns, troubleshooting, token cost hierarchy
**Update:** When adding/removing MCP servers, discovering new patterns

---

### ⚙️ AI-TOOLS-SETUP.md
**For:** Both human and AI
**Purpose:** Configuration details for all AI tools and auto-loading mechanism
**Read when:** Setting up new AI tool, verifying auto-loading works, troubleshooting context issues
**Key sections:** MCP configuration, auto-load verification checklist, update procedures
**Update:** When changing config.toml, adding new instruction files, updating MCP setup

---

### ✅ TESTING_CHECKLIST.md
**For:** AI
**Purpose:** Comprehensive testing procedures for all code changes
**Read when:** Before declaring work complete, after modifying shared files, before merging to main
**Key sections:** Pre-deployment checklist, responsive testing, accessibility, performance, feature-specific scenarios
**Update:** When discovering new bug patterns, adding new features requiring tests

---

## How It Works (The Big Picture)

### Traditional AI Coding (Fragile)
```
Human: "Add a filter"
AI: *implements something*
Human: "Not quite right"
AI: *tries again*
[Repeat 5 times]
[Next session, AI has no memory of what happened]
```

### With This System (Robust)
```
Human: "Read .ai/ directory first"
AI: *reads CONTRACT, DECISION_RIGHTS, CONTEXT, CONSTRAINTS, SESSION_LOG, LEARNINGS*
AI: "I understand the project. What's the goal?"
Human: "Add a filter to penny list. Filter by rarity tier."
AI: "I'll add a dropdown filter. Simple approach, no new dependencies."
AI: *checks DECISION_RIGHTS → this needs proposal first*
AI: "Here's my approach: [explains in plain English]. Approve?"
Human: "Sounds good, go ahead"
AI: *implements, tests, updates SESSION_LOG*
AI: "Done. Test it at /penny-list"
[Next session, new AI tool, has full context from SESSION_LOG]
```

**Key difference:** Continuity, clear boundaries, persistent memory.

---

## Benefits

### For Cade
- ✅ Manage technical project without knowing code
- ✅ Consistent quality across AI tools
- ✅ No context loss between sessions
- ✅ Learn by doing (AI explains trade-offs)
- ✅ Confidence to ship features

### For AI Assistants
- ✅ Clear decision boundaries
- ✅ Project context (WHY things matter)
- ✅ Learn from past mistakes (LEARNINGS)
- ✅ Smooth handoffs between sessions

### For the Project
- ✅ Stability (CONSTRAINTS prevent breaking things)
- ✅ Quality (CONTRACT enforces testing)
- ✅ Maintainability (everything documented)
- ✅ Scalability (system grows with project)

---

## How Auto-Load Works

This `.ai/` directory is **automatically loaded** by all three AI tools:

### Claude Code
- Reads `CLAUDE.md` on startup
- CLAUDE.md says: "Read all files in .ai/ directory first"
- ✅ Automatic

### GitHub Copilot
- Reads `.github/copilot-instructions.md` on startup
- That file says: "Read all files in .ai/ directory first"
- ✅ Automatic

### ChatGPT Codex
- Reads `.github/copilot-instructions.md` via `~/.codex/config.toml`
- That file says: "Read all files in .ai/ directory first"
- ✅ Automatic

**You don't need to remember anything. Just start working.**

If auto-load fails (rare), use SESSION_TEMPLATES.md backup prompts.

---

## Getting Started

### If You're Cade:
1. Read `USAGE.md` (dead simple daily guide)
2. Or read `QUICKSTART.md` (deeper explanation)
3. Try a small task using the GOAL/WHY/DONE format
4. Use the "Session End" template when you're done
5. Review `SESSION_LOG.md` to see what's been accomplished

### If You're an AI Assistant:
1. You've already auto-loaded this directory (via CLAUDE.md or copilot-instructions.md)
2. Ask Cade: "What's the GOAL / WHY / DONE for this session?"
3. Follow CONTRACT and DECISION_RIGHTS protocols
4. Update SESSION_LOG when done (use template with Unfinished Items + Future Prompts)

---

## Version History

- **v1.0 (Dec 7, 2025):** Initial system created with 8 core documents

---

## This Is Just the Beginning

This system will evolve as Cade and AI assistants use it. That's intentional.

The goal isn't perfection—it's **collaboration that gets better over time.**

Welcome to the future of human-AI development.