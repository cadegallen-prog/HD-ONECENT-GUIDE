---
description: "Debug workflow: research → diagnose → fix → verify"
agent: orchestrator
---

Debug pipeline — find and fix root causes, not surface patches.

## Pipeline

1. **RESEARCH** — `@researcher` explores the problem area.
2. **DIAGNOSE** — Identify the root cause, not just the visible symptom.
3. **PLAN FIX** — Describe the minimal change needed to fix the root cause.
4. **IMPLEMENT** — `@coder` applies the minimal fix using the exact file scope you provide.
5. **VERIFY** — `@tester` runs `npm run verify:fast` and only runs `npm run e2e:smoke` when you explicitly declare `SMOKE: REQUIRED`.
6. If verification fails, return to step 2 with the new failure information.

## Rules

- Fix root causes, not symptoms.
- Minimal changes only — do not refactor adjacent code.
- If the bug is in a fragile file, stop and explain before fixing.
- Pass exact file scope to every sub-agent.
- Do not let tester infer smoke applicability from repo state.
