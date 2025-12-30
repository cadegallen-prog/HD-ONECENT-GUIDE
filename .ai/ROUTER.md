# Agent Router (who to call, quick)

**Purpose:** Pick the right agent fast. Pair with `.ai/AGENT_POOL.md` for full details.

## Common intents → Agent & command

- **Plan a feature/change** → Architect
  - Say: "Act as the architect agent. I want to [describe feature/change]."
- **Build approved plan** → Implementer
  - Say: "Act as the implementer agent. Build the approved plan." (pass the plan)
- **Fix a bug** → Debugger (root cause) → Implementer (fix)
  - Say: "Act as the debugger agent. Investigate [symptom/error]."
- **Write/run tests & verify** → Tester
  - Say: "Act as the tester agent. Write tests (if needed) and run ai:verify."
- **Review before merge** → Reviewer
  - Say: "Act as the reviewer agent. Check the changes against constraints."
- **Update docs/state/logs** → Documenter
  - Say: "Act as the documenter agent. Update SESSION_LOG/STATE for this work."
- **Explore options/brainstorm** → Brainstormer
  - Say: "Act as the brainstormer agent. Explore options for [idea]."

## Fast workflows

- **New feature:** Architect → Implementer → Tester → Reviewer
- **Bug:** Debugger → Implementer → Tester → (Reviewer optional)
- **Docs-only:** Documenter (no code) → (Tester optional if scripts changed)
- **Parallel (UI + tests + docs):** Architect plan → Implementer (code) + Tester (tests) + Documenter (state/log) in parallel → Reviewer

## File ownership (avoid collisions)

- Implementer: `app/`, `components/`, `lib/`
- Tester: `tests/`
- Documenter: `.ai/`

## Reminders (baseline rules)

- Proof required: run `npm run ai:verify` (lint, build, test:unit, test:e2e) and provide outputs; Playwright screenshots for UI.
- No raw Tailwind colors; reuse port 3001; avoid `app/globals.css` and `components/store-map.tsx` without approval.
- Supabase MCP is required baseline; env vars must be set (already in your environment).
