# Auth / Accounts Pivot Guidance

Audience: Future AI assistants and contributors. Purpose: avoid re-litigating why we are **not** adding user accounts/auth yet, and define when to reconsider.

## Current Approach (Do This Now)

- Intake: Internal `/report-find` page that inserts submissions into the Supabase `Penny List` table (required: SKU, item name, photo proof, location, notes).
- Verification: Moderate directly in Supabase `Penny List` (filter/remove spam) and add enrichment to `penny_item_enrichment` as needed.
- Display: Site shows recent, validated items from the `penny_list_public` read view; includes Tier and a "Hot Right Now" slice for recent Very Common items.
- Moderation load: ~15 minutes/week to scan and enrich, not per-day manual sheet review.

## Bottom Line

Stick with the Supabase `Report a Find` → `Penny List` workflow. Auth remains a future upgrade — do not add accounts until milestones are met.

## Do NOT Add Auth Until All Milestones Are Met

1. **Volume proof:** Sustained submissions ≥ 50 per week for 4+ weeks **and** clear evidence that per-user history or reputation would materially improve trust/speed.
2. **Moderation pain:** Approval backlog routinely exceeds 1 day **or** spam requires more than photo + manual approve to manage.
3. **Feature need:** A concrete, user-facing feature truly requires identity (e.g., show "my submissions", rate-limit by user, or trusted-reporter badges) and cannot be solved with form-level limits + IP/rate limits.
4. **Resourcing:** We have time to build, monitor, and maintain auth, and budget for the chosen provider’s pricing tier.

## Reasons to Delay Auth (Risks/Costs)

- **Security & liability:** Storing credentials/PII adds breach risk, legal exposure, and operational burden (password reset, session security, abuse handling).
- **Maintenance & regressions:** Auth libraries and providers change; adds surface area for bugs (sessions, CORS/CSRF, email deliverability, OAuth quirks).
- **Does not solve trust alone:** An account does not stop junk submissions; photo + human approval is the real filter.
- **Cost creep:** Managed auth often starts free but scales; plus added infra (DB, storage, logging, rate limits).

## If/When Auth Is Justified (Minimal, Safe Scope)

- Choose managed auth (Clerk, Supabase Auth, or Auth0). Avoid rolling passwords; prefer magic links/OTP to minimize liability.
- Start tiny: sign-in, submit a find, view your own submissions. No social login, no profiles, no roles at first.
- Guardrails: server-side validation, rate limiting on submissions, minimal PII storage, clear privacy notice, logging for moderation, restricted photo bucket access.
- Cost control: pick a plan that fits current traffic; set soft caps/alerts.
- Expand only after stability: add roles/mod tools/exports later, not at kickoff.

## Decision Checklist Before Greenlighting Auth

- Are all four milestones met? (volume, moderation pain, feature need, resourcing)
- Do we have a minimal scope defined and a provider chosen?
- Do we have time to test auth flows without breaking core site use?
- Do we have a rollback plan if the provider causes regressions?

## Bottom Line

Until the milestones are met, stick with Form → Sheet → Approve flow. Auth is a future upgrade, not part of the current stabilization phase.
