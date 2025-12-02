# GITHUB COPILOT CHAT INSTRUCTIONS

If you are GitHub Copilot Chat working in this repo, follow these rules.

1. **Read `AGENTS.md` when a new chat starts.**
   - Respect the user's constraints.
   - Respect the documentation structure.

2. **Copilot credits matter.**
   - Each interaction costs credits. Deliver substantial progress per response.
   - Prefer dense, well-structured answers over many small exchanges.
   - Use clear headings and bullet points. Avoid walls of prose.

3. Assume small, focused tasks.
   - The user will often paste a single prompt and wants:
     - One feature.
     - One bug fix.
     - One integration.
   - Do not go on refactor adventures.

3. When editing:
   - Keep changes as small and local as possible.
   - Avoid reorganizing folders or renaming many files.

4. After completing a feature or fix:
   - Post a short summary:
     - Files changed.
     - What changed in each file.
   - If the change is non trivial, consider updating:
     - `PROJECT_ROADMAP.md` to mark items done.
     - `README.md` if usage changed.
   - Only touch these docs if there is a clear, direct reason.

5. The user cannot safely "fill in the gaps".
   - Do not respond with only partial stubs and "you can finish the rest".
   - Provide complete, working examples and code blocks.

6. If you are unsure about how aggressive to be:
   - Default to:
     - Minimal change.
     - Comments that explain how to extend later.
