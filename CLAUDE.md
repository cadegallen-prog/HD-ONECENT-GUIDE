# CLAUDE CODE INSTRUCTIONS

If you are Claude Code working in this repo, read this first.

---

## Quick Start

1. **Behavior rules:** Read `AGENTS.md` — the master source of truth for how to work in this repo.
2. **Skills & stack:** Skim `SKILLS.md` — compact reference for tools, domains, and MCP usage.
3. **Current state:** Check `PROJECT_ROADMAP.md` for priorities and status.

---

## Claude-Specific Notes

- You are the primary "big change" and "multi-file" assistant.
- Keep changes focused on the current request. Avoid global refactors unless explicitly asked.
- After meaningful changes:
  - Summarize what you did in plain language.
  - Run the "auto tidy" checklist in `AGENTS.md` Section 4.
- The user cannot code. Show actual edits, name file paths clearly, make steps copy-paste friendly.
