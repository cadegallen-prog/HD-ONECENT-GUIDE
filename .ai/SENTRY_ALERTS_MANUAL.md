# Sentry Alert Configuration (Manual Steps)

## Goal

Stop the email flood, keep quota focused on real production bugs, and enable conservative Autofix without letting Sentry open unsupervised pull requests.

**Dashboard entry points:**

- Alerts: https://sentry.io/organizations/pennycentral/alerts/
- Project settings: https://sentry.io/settings/pennycentral/projects/

## What code now handles automatically

The repo-side Sentry runtime is already hardened before you touch the dashboard:

- Client events only send from the real production hostname
- Server and edge events only send when `VERCEL_ENV === production`
- Client/server/edge events are tagged with `runtime=client|server|edge`
- Preview and development environments are tagged separately from production
- Known low-signal noise is dropped before send:
  - geolocation failures
  - transient fetch/XHR failures
  - CSP/script-load failures
  - CORS/cross-origin noise
  - browser-extension errors
  - `ResizeObserver loop limit exceeded`
  - `ECONNREFUSED` / `ETIMEDOUT` / `pool exhausted`
- Client events are limited to first-party PennyCentral / Next-internal URLs

## Required dashboard changes

### 1. Turn off the flood rules

Disable any existing alert rule that emails on every issue, every event, or every environment.

### 2. Create two issue alerts

Create:

1. `Production - New unhandled issue`
2. `Production - Regressed unhandled issue`

Use these conditions on both:

- Environment: `production`
- Issue state: unresolved / active
- Error handled state: unhandled only
- Level: `error` or `fatal`
- Action: immediate email notification

### 3. Create one metric alert

Create:

- `Production - Error rate spike`

Recommended threshold:

- Error rate greater than `3%`
- Time window `10 minutes`
- Environment `production`
- Immediate email notification

### 4. Move everything else to digest mode

Organization Settings -> Email:

- Keep immediate email only for the three rules above
- Move the rest to daily digest

### 5. Enable inbound filters carefully

Enable now:

- Browser extension filter

Only enable broader inbound filters if they match real issue sources you can see in the issue list.

### 6. Connect GitHub

Connect the GitHub integration to:

- `cadegallen-prog/HD-ONECENT-GUIDE`

Then verify:

- Repo access is granted
- Code mapping is active for the repo
- Sentry issues show the real short ID you will reference in commits / PR bodies

### 7. Enable conservative Autofix

Autofix settings:

- `Auto-fix issues`: `Highly Actionable and Above`
- `Stopping Point`: `Solution`

Do **not** enable automatic PR creation in phase 1.

Reason:

- It breaks the required micro-commit workflow
- It cannot guarantee docs land in the same commit as the code change
- It may create branches/PRs outside the required `feature/* -> develop -> main` path

## Proof bundle to capture

Save a redacted proof bundle under:

- `reports/sentry/2026-03-04/settings-summary.md`

Include redacted screenshots of:

- alert rules
- inbound filters
- GitHub integration status
- Autofix settings

## Validation after dashboard changes

Confirm all of these before calling the dashboard slice done:

- No alert remains that emails on every event or every issue
- Production-only issue alerts are active
- The metric alert is active
- Browser-extension filtering is enabled
- GitHub integration is linked to the correct repo
- Autofix is enabled and stops at `Solution`
