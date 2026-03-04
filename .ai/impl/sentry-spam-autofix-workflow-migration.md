# Sentry Spam Reduction + Conservative Autofix Rollout + Branch Workflow Migration

**Status:** In Progress  
**Owner lane:** Codex  
**Created:** 2026-03-04  
**Canonical path:** `.ai/impl/sentry-spam-autofix-workflow-migration.md`

## Summary

This program is split into small, stoppable slices so it does not become another mixed-scope batch.

Goals:

1. Replace the repo's current `dev/main` execution model with `main/develop/feature/*` in a staged, safe way.
2. Harden Sentry in code and in the Sentry dashboard so production issues are separated from noise, email flood is stopped, and only real unhandled production errors page the founder.
3. Enable conservative Autofix and GitHub linking, then use Autofix only as an assistant for the top real issues, with each real code fix landing on its own short-lived feature branch and PR.

## Alignment Gate

- **GOAL:** Standardize the repo workflow around `main/develop/feature/*`, create an isolated Sentry lane, stop the Sentry noise flood, enable conservative Autofix, and make GitHub issue linking/resolution workable.
- **WHY:** The current workflow and Sentry setup are creating founder burden, noisy alerts, and agent collision risk. The Student plan quota makes bad signal quality expensive immediately.
- **DONE MEANS:** `develop` exists and is the integration branch, the Sentry setup branch/worktree exists from a clean base, Sentry only alerts on real production problems, Autofix is enabled conservatively, GitHub is linked, and top actionable issues are ready to be fixed one-by-one on separate feature branches.
- **NOT DOING:** No direct work on `main` or `develop`; no aggressive automatic Sentry PR creation in phase 1; no large mixed-scope branch; no build-config rewrite unless release verification proves it is necessary.
- **CONSTRAINTS:** Use `origin/dev` as the clean source; do not include the two unpublished local `dev` commits; no new npm dependencies; do not touch port `3001`; keep documentation in the same micro-commit as the logic it explains; browser/manual access is the preferred Sentry path.
- **ASSUMPTIONS:** Staged migration, not hard destructive cutover; GitHub default branch should become `develop`; Sentry issue references must use the actual short ID shown in Sentry; conservative Autofix means `Highly Actionable and Above` with stopping point `Solution`.
- **CHALLENGES:** Repo canon still says `dev/main`; local `dev` is ahead of `origin/dev` by two unrelated unpublished commits; no local `SENTRY_*` token is available in the shell; Sentry dashboard changes are external-state work and must be recorded with proof.

## Current Facts Locked In

- Worktree was clean when execution started on 2026-03-04.
- Local `dev` is ahead of `origin/dev` by:
  - `1f3059d fix(homepage): harden proof media fallback`
  - `2c09d77 docs(ai): codify manual enrich vs cade fast-track workflows`
- `develop` did not exist at plan start.
- Sentry is already installed in:
  - `instrumentation-client.ts`
  - `sentry.server.config.ts`
  - `sentry.edge.config.ts`
  - `app/global-error.tsx`
- Current Sentry code already filters some noise, but it still uses duplicated hardcoded DSNs and weak environment tagging.
- Vercel already has `SENTRY_DSN`, `SENTRY_ORG`, `SENTRY_PROJECT`, and `SENTRY_AUTH_TOKEN` provisioned.
- GitHub Actions currently push-run on `main`, not `develop`.

## Internal Interface Additions

- Add shared helper module: `lib/monitoring/sentry-runtime.ts`
- Export:
  - `RUNTIME_SENTRY_DSN`
  - `getClientSentryEnvironment()`
  - `getServerSentryEnvironment()`
  - `getSentryRuntimeTag()`
  - `normalizeSentryEventMessage(event)`
  - `shouldDropSentryEvent(event)`
  - `FIRST_PARTY_URL_ALLOWLIST`
  - `INITIAL_NOISE_PATTERNS`
- Add targeted unit test file: `tests/sentry-runtime.test.ts`

## Slice 0 - Persist the Canonical Plan

- Create this file and register it in `.ai/plans/INDEX.md`
- Verification:
  - `npm run ai:memory:check`
  - `npm run ai:checkpoint`
- Rollback:
  - Remove this plan file and index entry only if the program is abandoned before Slice 1

## Slice 1 - Branch Workflow Migration Bootstrap

### Decisions

- Create `develop` from clean `origin/dev`
- Leave local `dev` untouched and unpushed
- Set GitHub default branch to `develop`
- Protect `develop` the same way `main` is protected
- Create the Sentry worktree from `origin/develop`, not local `dev`

### Git Commands

```powershell
git fetch origin
git branch develop origin/dev
git push -u origin develop
git worktree add ..\HD-ONECENT-GUIDE-sentry -b feature/sentry-spam-fix-and-autofix origin/develop
git worktree list
```

### Repo Files to Update

- `README.md`
- `AGENTS.md`
- `.ai/CRITICAL_RULES.md`
- `docs/skills/ship-safely.md`
- Canonical docs that directly instruct `git checkout dev` / `origin/dev`
- `.github/workflows/quality.yml`
- `.github/workflows/smoke-e2e.yml`

### Verification

- `npm run check:docs-governance`
- `npm run verify:fast`
- `npm run e2e:smoke` only if route or UI flow behavior changes unexpectedly

## Slice 2 - Repo-Side Sentry Hardening

### Decisions

- No new dependency
- Do not modify `next.config.js` in phase 1
- Keep `tracesSampleRate` at `0.1`
- Add `sampleRate`:
  - client: `0.25`
  - server: `1.0`
  - edge: `1.0`
- Add runtime tags:
  - `runtime=client`
  - `runtime=server`
  - `runtime=edge`
- Fix environment tagging:
  - server/edge use `process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? "development"`
  - client maps production hostnames to `production`
- Deduplicate runtime config into `lib/monitoring/sentry-runtime.ts`
- Keep DSN shared and public in phase 1
- Do not add Replay, log ingestion, or Session Replay in this slice

### Initial Filters

- geolocation failures
- transient network fetch/XHR failures
- CSP script-load failures
- CORS errors
- browser-extension signatures
- `ResizeObserver loop limit exceeded`
- server-side `ECONNREFUSED` / `ETIMEDOUT`

### Client URL Restrictions

- `https://www.pennycentral.com`
- `https://pennycentral.com`
- `webpack-internal://`
- `/_next/`

### Files to Change

- `instrumentation-client.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`
- `app/global-error.tsx` only if needed
- `.ai/ENVIRONMENT_VARIABLES.md`
- `.ai/SENTRY_ALERTS_MANUAL.md`
- `tests/sentry-runtime.test.ts`

### Planned Micro-Commits

1. `refactor(sentry): centralize runtime tags and normalize error filtering`
2. `docs(sentry): align runbook and env docs with runtime filtering`

### Verification

- Targeted unit tests for `normalizeSentryEventMessage` and `shouldDropSentryEvent`
- `npm run verify:fast`
- `npm run e2e:smoke` only if route or UI flow behavior changes

## Slice 3 - Sentry Dashboard Hardening

Browser/manual path only unless a valid Sentry API token becomes available.

### Required Changes

- Disable any current `every issue` or `every event` flood rule
- Add alert rules for:
  - new production issue
  - regressed production issue
  - production error rate spike
- Move non-critical notifications to digest mode
- Enable browser-extension inbound filtering
- Connect GitHub integration to `cadegallen-prog/HD-ONECENT-GUIDE`
- Enable Autofix:
  - `Auto-fix issues` = `Highly Actionable and Above`
  - `Stopping Point` = `Solution`

### Guardrail

Do **not** enable automatic PR creation in phase 1.

### Proof Artifacts

- `reports/sentry/2026-03-04/settings-summary.md`
- Redacted screenshots for:
  - alert rules
  - inbound filters
  - GitHub integration status
  - Autofix settings

## Slice 4 - Production Stabilization Window

Wait for one of:

- 24 hours after Slice 2 lands and production deploys, or
- 100+ new production events

Then classify top production issues as:

- noise
- config/integration problem
- real product bug

Artifact:

- `reports/sentry/2026-03-04/triage-top-issues.md`

## Slice 5 - Child Issue Fix Branches

- One real issue per branch: `feature/sentry-<shortid>-<slug>`
- Max 3 concurrent issue-fix branches
- Use Autofix suggestions as input, not auto-merged output
- Commit format:
  - `fix(sentry): <root cause> on <surface> (<actual-sentry-short-id>)`
- PR body must start with:
  - `Fixes <actual Sentry short ID>`

## Slice 6 - Promotion and Closeout

Merge order:

1. workflow/bootstrap branch -> `develop`
2. Sentry setup branch -> `develop`
3. child issue-fix branches -> `develop`, one at a time
4. `develop` -> `main` only after proof is complete

Final verification:

- `npm run ai:memory:check`
- `npm run verify:fast`
- `npm run e2e:smoke` where applicable
- dashboard verification for alerts, GitHub integration, and conservative Autofix
- release verification for commit association and Sentry short-ID resolution workflow
