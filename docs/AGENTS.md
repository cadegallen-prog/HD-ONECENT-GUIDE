# Agents Guide (Codex + Claude)
Start every session by opening and following `/AGENT_RULES.md` (keep it pinned). This doc is a supplement.
Short runbook for AI collaborators working on the HD Penny Items Guide.

## Context Snapshot
- Goal: Calm reference site for Home Depot penny items (no marketing); target audience 30-50, info-first tone.
- Stack: Next.js 15 (App Router), TypeScript, Tailwind; Inter headings, Georgia body, primary #EA5B0C used sparingly.
- Live data: JSON in `data/` (cadences, FAQs, recent finds). Legacy static backup: branch `main-old-static`. PDF lives at `public/Home-Depot-Penny-Guide.pdf`.
- Maintainer context: Non-coder; expects AI to propose plans, implement end-to-end, explain simply, and avoid surprises (API spend, destructive actions).

## Startup Checklist (every session)
1. Read `README.md`, `docs/DECISIONS.md`, and `docs/COOKBOOK.md`.
2. Check `git status` (do not revert user changes).
3. Note any known lint debt; fix touched files.
4. Plan > execute > summarize; keep changes small and testable.

## Session Modes (lightweight)
- Strategic: Offer 2–3 option sketches with tradeoffs; align to calm reference tone and maintainability.
- Planning: Break work into 3–5 verifiable steps; call out risks and tests.
- Execution: Implement the asked task, keep scope tight, run relevant checks, and report findings.
- Review: Periodic health check—what’s solid, what’s brittle, what to clean next.

## Operating Rules
- Documentation hygiene: canonical docs are `README.md`, `docs/AGENTS.md`, `docs/DECISIONS.md`, `docs/COOKBOOK.md`. Fold or delete other doc drafts to avoid clutter.
- Cleanup: remove one-off test scripts/assets after use; if a script is helpful, move it into `docs/COOKBOOK.md` with a short recipe.
- Decisions: log material tradeoffs in `docs/DECISIONS.md` (date, decision, why, impact).
- Tone: informational, no hype/testimonials/urgency. Favor tables, anchors, muted imagery.
- Testing: run `npm run lint` (fix touched files; known escapes in some legacy pages) and any relevant targeted checks.

## Branch & Content Notes
- `main` is active; `main-old-static` holds the archived static site for copy reference.
- Image/SVG placeholders are noted inline in `app/page.tsx`; replace with real assets when available.

## When in Doubt
- Ask clarifying questions.
- Prefer reversible changes and clear diffs.
- Document what you didn’t finish and what to verify next.*** End Patch
