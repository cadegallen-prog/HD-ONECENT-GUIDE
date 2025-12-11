# Stabilization Plan (Phases 0–5)

Purpose: hardened, low-maintenance plan aligned with stabilization and monetization. Each phase lists deliverables, AC, and gating. Owners/dates should be set when scheduled.

Phase 0 — Guardrails & Roles (gate for all other phases)

- Deliverables: `.ai/GUARDRAILS.md`; role playbooks `.ai/PLANNER_PLAYBOOK.md`, `.ai/DEVELOPER_PLAYBOOK.md`, `.ai/AUDITOR_PLAYBOOK.md`, `.ai/SUMMARIZER_PLAYBOOK.md`; TESTING_CHECKLIST linked.
- AC: guardrails referenced in TESTING_CHECKLIST; roles define allowed actions, approval triggers, handoffs; branch discipline (`dev` only until merged to `main`).

Phase 1 — Analytics & Quality Automation (gate for measurement)

- Deliverables: `.ai/ANALYTICS_MAP.md`; trackEvent wrapper with dev console logging; event instrumentation on Penny List/Store Finder/CTAs; CI workflow running build, lint, check-contrast, check-axe, Playwright smoke (mobile+desktop, light/dark) on `/`, `/penny-list`, `/store-finder`, `/about`; artifacts under `reports/`.
- AC: events fire with props `{page, device, theme, ...}` and no PII; derived `return_visit` emits once per qualifying week; CI fails on red/diff; local run instructions in TESTING_CHECKLIST (`npm run start -- --hostname 0.0.0.0 --port 3000`, then contrast/axe/e2e); Playwright baselines stored and updates require Auditor sign-off recorded in SESSION_LOG.

Phase 2 — Product & Monetization (Weeks 1–2)

- What’s new block: top 10 items with timestamp and “Updated X hours ago”; shows stale fallback copy; emits subevent `penny_list_view` detail or `what_new_view`.
- Confidence labels: verified/unverified counts rendered with schema; handles missing data gracefully.
- Feedback widget: Yes/No + optional comment, dismissible, anti-double-submit, offline/error handling; events `feedback_vote` and `feedback_comment`.
- CTAs: one Coffee + one Affiliate on Penny List and Resources with copy “Keeps the list fresh; costs you nothing.” Strict affiliate rules (plain `<a>`, target/rel, no prefetch).
- Mobile polish: SKU copy and Directions prominent; touch targets ≥44px; AAA contrast retained. Manual tap test noted in TESTING_CHECKLIST.
- AC: features visible mobile/desktop; events fire; no layout break; guardrails upheld.

Phase 3 — Content & Traffic (Weeks 3–4)

- Publish 2–3 guides (“How to spot penny tags”, “Best times to check stores”, “Fast start in 60 seconds.”) with CTA at end pointing to Coffee/Affiliate or Penny List.
- Link guides from `/resources` and `/penny-list`; ensure mobile readability (16px+, 1.6 line-height, underlined links).
- Weekly Facebook group post template stored in `.ai/SESSION_LOG.md` or `docs/` with schedule/owner; links to “What’s new” section.
- AC: guides live and linked; CTAs present; analytics captures return visits/CTA clicks; no design-system violations.

Phase 4 — Optimization (Weeks 5–6)

- CTA placement experiment (sequential): top vs mid vs footer on Penny List with clear start/end dates and success metric = CTR. Use analytics events to log variant (`cta_variant: top|mid|footer`).
- Filters/UX tuning driven by analytics: ensure newest/rarity-common/region filters understood; log top filter usage weekly.
- AC: experiment plan documented (duration, sample thresholds); winner selected and set; UX tweaks do not break mobile; events intact.

Phase 5 — Performance & Reliability (Ongoing)

- Bundle/build size log recorded weekly (`reports/size-log.md` or SESSION_LOG); +15% triggers investigation note in SESSION_LOG/CHANGELOG.
- Maintain dark/light parity and AAA/3:1: contrast checks stay green; manual spot-check if diffs appear.
- Playwright visual smoke remains required; artifacts retained in `reports/playwright/{run}/`; baseline updates need Auditor sign-off.
- AC: CI green; any alert documented with follow-up.

Execution Order (practical)

1. Phase 0 docs/links (done).
2. Phase 1 analytics + CI wiring.
3. Phase 2 monetization/product enhancements.
4. Phase 3 content cadence.
5. Phase 4 experiment.
6. Phase 5 monitoring ongoing.

Reminder: work stays on `dev` until merged to `main` and pushed; only then does it deploy to production.
