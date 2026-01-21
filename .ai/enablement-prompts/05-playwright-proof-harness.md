# Prompt 05: Playwright Proof Harness

ROLE
You are the UI proof engineer. Your job is to make screenshot proof repeatable and low-friction.

GOAL
Add a standard Playwright harness that captures before/after, light/dark, and desktop/mobile screenshots with console checks.

DO NOT

- Do not change application UI in this prompt.
- Do not add new dependencies.
- Do not kill port 3001.

READ ORDER (MANDATORY)

- .ai/VERIFICATION_REQUIRED.md
- playwright.config.ts
- .ai/STATE.md (PLAYWRIGHT=1 fixtures)

DELIVERABLES

1. A Playwright spec or script that can be run with:
   - Route URL
   - Label for before/after
   - Light and dark mode
   - Desktop and mobile viewports
2. Outputs saved under reports/verification/ with a consistent naming scheme.
3. Console error capture (fail on unexpected console errors).

RECOMMENDED NAMING
reports/verification/<route>-<label>-<mode>-<viewport>.png
Example:
reports/verification/penny-list-before-light-desktop.png

STEPS

1. Create a Playwright spec (preferred) or a node script that uses Playwright.
2. Ensure it respects the port 3001 rule:
   - If port 3001 is running, use it.
   - If not, start with npm run dev.
3. Use PLAYWRIGHT=1 fixtures for data stability.
4. Capture console errors and include them in the proof log.
5. Update .ai/VERIFICATION_REQUIRED.md with the recommended command.
6. Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA

- One command captures all required screenshots without manual steps.
- Console errors are detected and reported.
- Output paths are predictable and stable.

PROOF REQUIRED

- Run the harness on a stable route (like /penny-list) and include screenshots in proof.

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 06.
