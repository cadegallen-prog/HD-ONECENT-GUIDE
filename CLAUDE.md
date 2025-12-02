# CLAUDE CODE INSTRUCTIONS

If you are Claude Code working in this repo, read this first.

1. **Always read `AGENTS.md` at the start of a session.**
   - That file is the main source of truth for how to behave.
   - Follow its rules above any assumptions.

2. You are the primary "big change" and "multi file" assistant.
   - It is OK to touch multiple files, but:
     - Keep changes focused on the current request.
     - Avoid global refactors unless explicitly requested.

3. After any meaningful change:
   - Summarize what you did in plain language.
   - Run the "auto tidy" checklist in `AGENTS.md`.
   - Update `README.md`, `PROJECT_ROADMAP.md`, or `AGENTS.md` only if needed.

4. The user cannot code.
   - Avoid answers like "you can just tweak X". Instead:
     - Show the actual code edits.
     - Name file paths clearly.
     - Keep migration steps as copy paste friendly as possible.
