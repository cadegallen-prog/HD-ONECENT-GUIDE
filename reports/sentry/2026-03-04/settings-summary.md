# Sentry Dashboard Hardening Summary

Date: 2026-03-04
Organization: `pennycentral`
Project: `javascript-nextjs`
Branch: `feature/sentry-spam-fix-and-autofix`

## Scope completed

- Narrowed issue alerting to production-only unhandled errors.
- Added a production crash-rate metric alert at the closest supported threshold.
- Enabled the localhost inbound filter to reduce development noise.
- Verified GitHub repository connectivity and production release commit association.
- Hardened Seer Autofix so it stops at `solution` instead of code generation or PR creation.

## Alert rules

Removed noisy legacy rule:

- Deleted issue alert rule `16552275` (`Send a notification for high priority issues`).

Active production issue rules:

- `16751148` `Production - New unhandled issue`
  - environment: `production`
  - trigger: first seen issue
  - filters: `level >= error`, `error.unhandled == true`
  - action: email Issue Owners, fallback All Members
- `16751153` `Production - Regressed unhandled issue`
  - environment: `production`
  - trigger: regression event
  - filters: `level >= error`, `error.unhandled == true`
  - action: email Issue Owners, fallback All Members

Active production metric rule:

- `409707` `Production - Crash-free session rate below 97% (30m)`
  - environment: `production`
  - threshold: below `97%`
  - time window: `30m`
  - action: email `#pennycentral`

Platform note:

- Sentry rejected the requested `10m` crash-rate window at the API level.
- Allowed crash-rate windows for this alert type are `30min`, `1h`, `2h`, `4h`, `12h`, and `24h`.
- The applied `97%` crash-free session threshold is the same as a `3%` crash-rate threshold.

## Inbound filters

Saved filters:

- `browser-extensions`: enabled
- `filtered-transaction`: enabled
- `legacy-browsers`: enabled for Chrome, Safari, Firefox, Android, Edge, Internet Explorer, Opera, Opera Mini
- `localhost`: enabled
- `web-crawlers`: enabled

UI-only visible filters also enabled at capture time:

- `Hydration Errors`
- `ChunkLoadError`

## GitHub integration and release association

Connected repository:

- repo: `cadegallen-prog/HD-ONECENT-GUIDE`
- provider: `GitHub`
- integration id: `373382`
- external id: `1075078870`

Code mapping status:

- `code_mappings`: `0`

Release association findings:

- Recent preview releases on 2026-03-04 are attached to repository `origin` with provider `unknown`.
- Latest confirmed production release on 2026-03-03:
  - version: `7d9627ac1649e8ec2f7a2b1203e17c7c4f602e32`
  - environment: `vercel-production`
  - repository: `cadegallen-prog/HD-ONECENT-GUIDE`
  - provider: `integrations:github`

Interpretation:

- Production release commit association is healthy for GitHub-backed releases.
- Preview release association still falls back to `origin` / `unknown`, so preview-only auto-resolution should not be trusted yet.

## Seer Autofix

Organization defaults:

- `defaultAutofixAutomationTuning`: `medium`
- `defaultSeerScannerAutomation`: `true`
- `enableSeerEnhancedAlerts`: `true`
- `enableSeerCoding`: `true`
- UI default `Allow Root Cause Analysis to create PRs by Default`: off

Project `javascript-nextjs`:

- connected repo count: `1`
- connected repo: `cadegallen-prog/HD-ONECENT-GUIDE`
- `automated_run_stopping_point`: `solution`
- `automation_handoff`: `null`

Important note:

- The project Seer checkbox UI was inconsistent with the saved backend state during capture.
- The authoritative saved state is the API-backed preference:
  - `GET /api/0/projects/pennycentral/javascript-nextjs/seer/preferences/`
  - `automated_run_stopping_point = solution`
- This is the phase-1 guardrail that prevents automatic code-generation/PR progression.

## Notification settings note

- The project alert digest page exposes a maximum slider value of `3600` seconds (`1h`).
- The requested "daily digest for everything else" behavior was not available from the current project alert settings surface.
- The main email-flood reduction came from deleting the legacy high-priority rule and replacing it with three narrow production rules.

## Proof artifacts

Tracked in this bundle:

- `reports/sentry/2026-03-04/settings-summary.md`

Captured screenshots:

- `reports/sentry/2026-03-04/alert-rules.png`
- `reports/sentry/2026-03-04/inbound-filters.png`
- `reports/sentry/2026-03-04/seer-overview.png`
- `reports/sentry/2026-03-04/seer-connected-repo.png`
