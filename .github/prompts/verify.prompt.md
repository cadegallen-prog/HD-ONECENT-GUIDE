---
description: "Run verification pipeline and paste proof"
agent: tester
---

Run the PennyCentral verification pipeline and report results with proof.

## Steps

1. Check port 3001 status: `netstat -ano | findstr :3001`
   - If running, leave it alone.
   - If not running and e2e is needed, start only what is required.
2. Run `npm run verify:fast`.
3. Require the orchestrator to declare smoke applicability explicitly:
   - `SMOKE: REQUIRED`
   - `SMOKE: NOT_REQUIRED`
4. If smoke applicability is missing or unclear, stop and report `BLOCKED`.
5. When `SMOKE: REQUIRED`, run `npm run e2e:smoke`.
6. Paste complete output without summarizing.
7. Report pass, fail, or blocked for each gate.

## Expected Output

```text
FAST: ✅ lint | ✅ typecheck | ✅ unit | ✅ build
SMOKE: ✅ | N/A — reason | BLOCKED
```

## Rules

- Never infer smoke applicability from repo state.
- Do not attempt to fix failures.
- Playwright uses port 3002, never 3001.
