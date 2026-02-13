# AI Collaboration Stub (canonical lives in root README.md)

Canonical entrypoint for humans and AI is [README.md](../README.md). This stub exists only to point you there.

---

## If auto-load brings you here

1. Open the root [README.md](../README.md) and read the **AI Canon & Read Order** section first. That is the enforced starting point.
2. Follow the read order listed there (charter-first): **VISION_CHARTER.md → START_HERE.md → CRITICAL_RULES.md → STATE.md → BACKLOG.md → CONTRACT.md → DECISION_RIGHTS.md**
3. First session only: also read [GROWTH_STRATEGY.md](GROWTH_STRATEGY.md) for business context
4. For AI workflow/tooling/verification enablement work: also read [AI_ENABLEMENT_BLUEPRINT.md](AI_ENABLEMENT_BLUEPRINT.md)
5. Use [USAGE.md](USAGE.md) only for copy/paste prompts. All other guidance is anchored from the root README.

---

## Minimal reminders

- Default: no new dependencies; no orphan one-off files. If you add, prune an obsolete item and log it.
- Run verification lanes on meaningful changes: `npm run verify:fast` (always), then `npm run e2e:smoke` / `npm run e2e:full` when applicable. Record results in `SESSION_LOG`.
- Canonical verification policy lives in `.ai/VERIFICATION_REQUIRED.md`.
- Work on main; nothing ships until main is pushed.

Keep this directory lean: add docs only when you also retire or merge redundant ones and log the change.
