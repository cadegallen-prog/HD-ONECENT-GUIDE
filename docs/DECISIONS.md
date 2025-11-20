# Decisions Log
Concise record of choices that shape the project. Add entries with date, decision, why, and impact.

- **2025-11-19 — Next.js 15 (App Router) rebuild**  
  Replaced the broken static site for maintainability, component reuse, and future dynamic features. Impact: Node-based toolchain required; legacy content archived in `main-old-static`.

- **2025-11-19 — TypeScript everywhere**  
  Better safety and refactors for non-expert maintainers. Impact: stricter builds; clearer contracts for AI edits.

- **2025-11-19 — Tailwind + paired typography palette**  
  Utility-first styling with Inter headings, Georgia body, JetBrains Mono for codes; primary #EA5B0C used sparingly. Impact: fast theming; stay consistent with single-column reference feel.

- **2025-11-19 — Content posture: calm reference**  
  No testimonials, urgency, or sales tone. Use tables, anchors, and factual copy patterned on Wirecutter/Wikipedia/MDN. Impact: guardrails for all new UI/content.

- **2025-11-20 — Documentation & cleanup discipline**  
  Canonical docs limited to `README.md`, `docs/AGENTS.md`, `docs/DECISIONS.md`, `docs/COOKBOOK.md`. Remove stale docs and one-off test scripts after use; move repeatable tasks into the cookbook. Impact: prevents doc sprawl and keeps repo tidy.*** End Patch" ***!
