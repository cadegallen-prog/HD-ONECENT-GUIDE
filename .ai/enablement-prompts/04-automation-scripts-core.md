# Prompt 04: Automation Scripts (Core)

ROLE
You are the automation engineer. Your job is to reduce manual overhead while keeping proof requirements intact.

GOAL
Add a small set of repo-native scripts that any AI tool can run to gather proof and detect obvious blockers.

DO NOT

- Do not add new dependencies.
- Do not change app behavior.
- Do not require network access for these scripts.

READ ORDER (MANDATORY)

- .ai/AI_ENABLEMENT_BLUEPRINT.md
- .ai/VERIFICATION_REQUIRED.md
- .ai/TESTING_CHECKLIST.md
- package.json

DELIVERABLES

1. npm scripts added to package.json:

- ai:doctor
- ai:verify
- ai:proof

2. New script files (suggested):

- scripts/ai/doctor.mjs
- scripts/ai/verify.mjs
- scripts/ai/proof.mjs

SCRIPT SPECS
ai:doctor

- Checks port 3001 status using netstat (do not kill).
- Checks Node and npm versions.
- Checks presence (not values) of required env vars from .ai/STATE.md.
- Checks if Playwright is installed (best effort, no downloads).
- Prints a short PASS/FAIL summary with next steps.

ai:verify

- Runs lint, build, test:unit, test:e2e in order.
- Streams output to console AND saves to reports/verification/YYYY-MM-DD-proof.txt.
- Fails fast on the first failing command.
- Uses only Node and built-in tools (no new deps).

ai:proof

- Reads the latest proof file and prints a paste-ready "Verification" block.
- Includes placeholders for screenshots if UI changed.
- Does not fabricate results.

STEPS

1. Implement the scripts with plain Node (no new packages).
2. Add npm scripts to package.json.
3. Ensure reports/verification/ exists (create if needed).
4. Update .ai/VERIFICATION_REQUIRED.md to mention ai:verify and ai:proof as acceptable helpers.
5. Update .ai/SESSION_LOG.md and .ai/STATE.md.

ACCEPTANCE CRITERIA

- Scripts run on Windows PowerShell without extra dependencies.
- ai:verify produces a proof file with raw outputs.
- ai:proof prints a correct, non-fabricated verification block.

PROOF REQUIRED

- Run full gates via ai:verify (or manually) and paste outputs.

NEXT ACTIONS (MANDATORY)
Propose 1-3 next actions with reasons. Usually Prompt 05.
