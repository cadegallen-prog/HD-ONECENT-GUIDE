# Analytics Contract

## Purpose

Lock GA4 tracking behavior so future edits do not silently undercount or double-count.

## Single Source of Truth

- Pageviews are emitted by GA4 `gtag('config', 'G-DJ4RJRX05E')` in `app/layout.tsx`.
- `components/analytics-tracker.tsx` is a no-op placeholder and must not emit `page_view`.
- Do not run dual pageview sources (auto + manual) at the same time.

## Required Signals

- Every tracked route must emit exactly one `page_view` hit.
- `cid` (client id) must be present on pageview hits.
- `sid` (session id) must be present on pageview hits.
- Redirect routes must track the final canonical path.

## Resilience + Diversification KPI Contract (Founder Priority, R2 Hardened)

Use this KPI set for weekly contingency tracking. Metric names below are locked and must not be renamed without founder approval.

### KPI Definitions (Locked)

- `non_fb_session_share`
  - Formula: `non_facebook_sessions / total_sessions`
  - Source: GA4 session source/medium report.
  - Facebook bucket include list (minimum): `facebook`, `m.facebook.com`, `l.facebook.com`, `lm.facebook.com`.
  - Read window: weekly snapshot + rolling 4-week average.
  - Improvement signal: valid only when rolling 4-week average rises by `>= 3` percentage points vs prior 4-week window.

- `non_branded_organic_clicks`
  - Formula: Search Console organic clicks with branded queries excluded.
  - Source: Google Search Console query report.
  - Branded exclude list (minimum): `pennycentral`, `penny central`, `pennycentral.com`.
  - Read window: weekly snapshot + rolling 4-week total.
  - Improvement signal: valid only when rolling 4-week total is up and the current week has `>= 20` non-branded clicks.

- `adjacent_intent_session_share`
  - Formula: `adjacent_intent_landing_sessions / total_sessions`
  - Source: GA4 landing page report.
  - Adjacent-intent route set (current): `/guide`, `/in-store-strategy`, `/inside-scoop`, `/faq`.
  - Rule: add any new adjacent-intent route to this contract before counting it.
  - Read window: weekly snapshot + rolling 4-week average.
  - Improvement signal: valid only when rolling 4-week average rises by `>= 2` percentage points and both core-loop guardrails remain within tolerance.

- `core_loop_guardrail_submit_rate`
  - Formula: `find_submit / report_find_page_views`
  - Source: GA4 custom event + `/report-find` page views.
  - Guardrail baseline: trailing 28-day average captured before each adjacent expansion step.
  - Warning threshold: drop `> 10%` vs baseline for one week.
  - Blocker threshold: drop `> 15%` vs baseline for two consecutive weeks.

- `core_loop_guardrail_report_find_click_rate`
  - Formula: `report_find_click / penny_list_page_views`
  - Source: GA4 custom event + `/penny-list` page views.
  - Guardrail baseline: trailing 28-day average captured before each adjacent expansion step.
  - Warning threshold: drop `> 10%` vs baseline for one week.
  - Blocker threshold: drop `> 15%` vs baseline for two consecutive weeks.

### Interpretation Rules (Fail-Closed)

- Do not claim diversification success if non-Facebook or adjacent-intent growth rises while either core-loop guardrail hits blocker threshold.
- One-week spikes are directional only; execution decisions require rolling 4-week confirmation.
- If data coverage is incomplete for a week, mark that week `INCONCLUSIVE` and avoid trend claims.
- When blocker threshold triggers, pause adjacent expansion tasks and run a regression check on `/penny-list` and `/report-find` flow instrumentation before continuing.

Operational rule:

- Diversification is valid only when growth and trust-loop metrics coexist.
- Growth without guardrail stability is treated as regression risk, not success.

## Event Param Naming Standard (Monetization-Safe)

- UI attribution params must use `ui_source` (preferred) or `placement`.
- Do not emit raw GA acquisition-like keys on custom events:
  - `source`
  - `medium`
  - `campaign`
- Analytics sanitizer (`lib/analytics.ts`) is the safety net:
  - `source -> pc_source`
  - `medium -> pc_medium`
  - `campaign -> pc_campaign`
  - legacy `src` and `source` normalize into `ui_source` when needed.
- Dashboard/report definitions for experiment analysis must read `ui_source` (not `source`).

## Required Verification

- Run `npm run ai:analytics:verify` before claiming analytics work is complete.
- Output is written to `reports/analytics-verification/<timestamp>/`.
- A change is not done unless the command returns PASS and artifacts exist.
- For Monumetric launch decision windows, run:
  - `npm run monumetric:guardrails -- --input <window-metrics.json>`
  - Store artifacts under `reports/monumetric-guardrails/<timestamp>/`.

## Guardrails

- Any change in `app/layout.tsx`, `components/analytics-tracker.tsx`, `next.config.js`, or GTM snippet requires analytics verification.
- Any change to event attribution keys or analytics payload names requires `tests/analytics.test.ts` to stay green.
- If GA4 suddenly diverges from Vercel analytics, run:
  1. `npm run ai:analytics:verify`
  2. `npm run ai:verify`
  3. Compare artifacts before/after commit.

## Notes

- Dev can show transient network noise; prioritize production-like checks when possible.
- CSP policy changes for Google/traffic-quality domains must be validated with analytics verification artifacts.
