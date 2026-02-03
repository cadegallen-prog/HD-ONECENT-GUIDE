# Action: Configure Sentry alert rules to reduce spam

**Status:** TODO (manual)

**Summary**
Sentry is sending hourly emails because the alert rules are too broad (e.g., "any error → notify immediately"). We already implemented code-side filtering (production-only, 10% sample, SKIMLINKS_DISABLED guard during verification), but the alert rules in Sentry still need tuning.

**What to do (manual steps)**

1. Open Sentry: https://sentry.io/organizations/pennycentral/alerts/
2. Under "Alerts" -> "Rules", locate existing project rules that notify by email/SMS/Slack.
3. For noisy rules, restrict to:
   - Event level: `error` (not `warning` or `info`)
   - Apply rate thresholds (e.g., `>= 5%` of requests or `>= 10` events in 10 minutes)
   - Add filters to exclude known benign errors:
     - `message` contains `Skimlinks` or `Skimresources` or `CSP` script load failures
     - Browser `user_agent` whitelist for known bots (optional)
4. Change notification frequency to a digest (daily) or use an escalation policy (notify on repeat occurrences only).
5. Save, test by triggering a known non-critical event, and ensure it does not create an immediate notification.

**References**

- `.ai/SENTRY_ALERTS_MANUAL.md` (step-by-step guide in repo)
- Verification: `reports/verification/2026-01-15T11-11-41/summary.md`

**Assignee**

- @cadegallen-prog (please confirm and perform)

**Notes**

- This is a manual configuration change in Sentry UI. No code changes are required.
- Once complete, mark this file as `DONE` or delete it; alternatively create a GitHub Issue referencing this file.

**Created by:** GitHub Copilot (Raptor mini (Preview)) on 2026-01-16
