# Project State (Living Snapshot)

**Last updated:** Feb 16, 2026 (reset recovery + guide/header clarity restore)

This file is the **single living snapshot** of where the project is right now.

Every AI session must update this after meaningful work.

**Auto-archive:** Entries older than 30 days move to `archive/state-history/`

---

## Current Sprint (Last 7 Days)

- **2026-02-16 (Reset recovery + guide/header clarity restore):** Recovered local `main` from accidental hard reset drift and restored founder-requested guide/navigation clarity improvements.
  - **Git recovery shipped:**
    - Detected local reset rollback via reflog (`reset: moving to HEAD~1`).
    - Restored local `main` to remote tip with `git pull --ff-only origin main`.
    - Continued implementation from recovered canonical state with no destructive git operations.
  - **Guide/copy clarity shipped:**
    - `/inside-scoop`: replaced ambiguous "supporting signal/report" phrasing with explicit probability + community-post language and clarified ending-in-.02 wording.
    - `/guide`: removed duplicate "Where should you start?" chapter cards; changed top secondary CTA from `Report a Find` to `Browse Penny List`; reframed Report a Find as post-confirmation action.
  - **Header interaction + IA shipped:**
    - `components/navbar.tsx`: reduced crowded nav (removed `About` + `Contact`), made desktop Guide submenu click-toggle, added dismiss-on-select/outside/escape/route-change, and reordered submenu to `Step 0` through `Step 6`.
    - `tests/basic.spec.ts` updated to reflect Guide button/submenu interaction expectations.
  - **Verification:**
    - `npm run ai:memory:check` ✅
    - `npm run verify:fast` ✅
    - `npm run e2e:smoke` ✅
    - `npx playwright test tests/basic.spec.ts --project=chromium-desktop-light --project=chromium-mobile-light --workers=1` ✅
    - `npm run lint:colors` ✅
    - UI proof bundle: `reports/proof/2026-02-16T23-03-18/` (includes dropdown open/dismiss captures).

- **2026-02-16 (Internal-systems route retirement + crawler-quality hardening):** Removed a thin utility page from the public site surface and consolidated traffic to the guide hub.
  - **Route lifecycle updates shipped:**
    - Deleted `app/internal-systems/page.tsx`.
    - Added permanent redirects in `next.config.js`:
      - `/internal-systems` -> `/guide`
      - `/internal-systems/:path*` -> `/guide`
  - **Reference scrub shipped (active runtime/test surfaces):**
    - Removed `/internal-systems` policy references from `lib/ads/route-eligibility.ts`.
    - Removed stale sitemap-note mention from `app/sitemap.ts`.
    - Updated route/sitemap assertions in:
      - `tests/adsense-readiness.spec.ts`
      - `tests/sitemap-canonical.test.ts`
    - Removed stale route listing from `ROUTE-TREE.txt`.
  - **Verification:**
    - `npm run ai:memory:check` ✅
    - `npm run verify:fast` ✅
    - `npm run e2e:smoke` ✅
    - `npm run e2e:full` ✅ (192 passed)
    - Sitemap coverage remains pillar-only at 18 URLs (asserted in readiness/spec tests).

- **2026-02-16 (Transparency + internal-systems crawler hardening, live):** Closed trust-route naming drift and fixed a crawler-facing redirect flaw before founder AdSense/Search Console resubmission.
  - **Route behavior fixes shipped:**
    - Converted `/support` to a permanent redirect (`308`) to canonical `/transparency`.
    - Replaced `/internal-systems` hash redirect with a real route response and explicit `noindex, nofollow`.
  - **Naming consistency shipped:**
    - Standardized public UI labels to `Transparency` (footer, homepage CTA, guide utility links).
  - **Sitemap/test hardening shipped:**
    - Confirmed sitemap remains pillar-only at 18 URLs and excludes legacy/utility routes (`/support`, `/internal-systems`).
    - Expanded Playwright and unit assertions to lock these exclusions and robots directives.
    - Fixed mobile nav full-suite drift in `tests/basic.spec.ts` (Guide button/submenu assertion path).
  - **Verification + deploy evidence:**
    - Local: `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run e2e:full` ✅ (192 passed).
    - CI (merge commit `e9b7552`): FAST ✅, SMOKE ✅, FULL ✅.
    - Production checks confirmed: `/support` 308->`/transparency`, `/internal-systems` 200 + noindex, sitemap count = 18.

- **2026-02-16 (AdSense approval readiness remediation pass):** Implemented the critical compliance/security bundle for monetization incident response and verified it locally with route-level evidence.
  - **Security hardening shipped:**
    - Added shared admin bearer-token guard (`ADMIN_SECRET`) and enforced it on all admin moderation APIs:
      - `/api/admin/submissions`
      - `/api/admin/delete-submission`
      - `/api/admin/recent-submissions`
    - Updated `/admin/dashboard` to require authenticated user session plus explicit admin token entry before moderation API calls.
  - **Indexing/compliance controls shipped:**
    - Added route-level noindex metadata for auth-gated/tokenized surfaces:
      - `/lists` + `/lists/[id]` (`noindex, nofollow`)
      - `/login` (`noindex, nofollow`)
      - `/s/[token]` (`noindex, follow`)
      - `/internal-systems` (`noindex, nofollow`)
    - Updated privacy policy with explicit GA4, Monumetric, Ezoic, and Resend disclosures, data-deletion procedures, weekly digest usage disclosure, and Ezoic embed anchor (`#ezoic-privacy-policy-embed`).
    - Updated GA4 Consent Mode v2 default to include region scoping (`US`, `CA`).
    - Standardized footer disclaimer language to "Not affiliated with or endorsed by Home Depot."
  - **Operational/docs updates shipped:**
    - Canonicalized the external `.claude` plan into `.ai/impl/adsense-approval-readiness.md`.
    - Added `ADMIN_SECRET` documentation to `.ai/ENVIRONMENT_VARIABLES.md`.
    - Added `.env.example` template including `ADMIN_SECRET`.
    - Added targeted regression coverage in `tests/adsense-readiness.spec.ts` (admin auth statuses, robots directives, sitemap count, privacy disclosures) plus Playwright screenshot artifacts.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, targeted Playwright readiness suite ✅ (8/8; light/dark), sitemap count check ✅ (18 URLs via readiness spec).

- **2026-02-16 (Founder-prompt ambiguity hardening - permanent fix):** Converted founder-facing execution flow from optional/jargon-heavy prompts to default-execute behavior with enforceable drift guards.
  - **Canonical behavior fixes shipped:**
    - `AGENTS.md` + `.ai/START_HERE.md` now require default execution when request is clear or when top P0 is unblocked, without asking founder to provide process tokens.
    - Added explicit prohibition on asking Cade for `GOAL / WHY / DONE MEANS` + `"go"` phrasing as a prerequisite.
    - `.ai/HANDOFF_PROTOCOL.md` now requires next-step handoffs to be executable directives (not open-ended choice questions) unless blocked.
    - `.ai/CONTRACT.md` now requires plain-English blocker questions only and default top-P0 continuation when no blocker exists.
  - **Enforcement hardening shipped:**
    - `scripts/check-doc-governance-drift.mjs` now includes founder-prompt clarity checks and fails on deprecated prompt patterns.
  - **Verification:** `npm run check:docs-governance` ✅, `npm run ai:memory:check` ✅, `npm run ai:checkpoint` ✅ (artifact in session log).

- **2026-02-16 (Governance rule-validity hardening pass):** Removed low-value contradictions and aligned rule contracts to reduce blind compliance and drift.
  - **High-impact governance fixes shipped:**
    - Resolved branch-policy conflict by aligning agent workflow docs to `dev` -> `main` promotion.
    - Reworked session-log retention policy from an over-aggressive 3-entry trim to a 5-entry rolling window (trim when entries exceed 7).
    - Canonicalized duplicated non-negotiable rules by making `.ai/CRITICAL_RULES.md` the detailed source and converting `.ai/CONSTRAINTS.md` to reference mode for those items.
    - Made GitHub Actions evidence requirement conditional on CI execution.
    - Aligned docs-only verification wording across governance docs with `.ai/VERIFICATION_REQUIRED.md`.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run check:docs-governance` ✅ (checkpoint artifact in session log).

- **2026-02-16 (Permission-first narrow expansion governance lock):** Added explicit approval gates for agent-requested scope expansions that aim to reduce founder workload.
  - **Rule codified in canonical governance docs:**
    - Agents must ask explicit permission and wait for a clear yes before any narrow enablement expansion request is implemented.
    - Covered request categories: permissions/access, UI/UX workflow, tools, MCP, and skills.
    - Requests must stay narrow, explain workload-reduction value, and include risk/rollback/proof notes.
  - **Verification:** docs-memory update (see session log); no runtime code paths changed.

- **2026-02-16 (Founder operating-target lock for execution focus):** Recorded durable priority guidance so fresh agents keep shipping website improvements first while autonomy-system hardening remains a tracked secondary lane.
  - **Priority decision codified:**
    - Current operating mode: user-facing website utility/growth work first.
    - Autonomy/tooling hardening remains active but should not displace product-facing progress unless it directly unblocks delivery.
  - **Future autonomy checklist codified:**
    - reduce founder input,
    - push end-to-end execution onto agents,
    - keep only measurable-value tooling/docs/guardrails,
    - prefer proven prebuilt systems to reduce maintenance,
    - enforce fail-closed proof/drift gates.
  - **Verification:** docs-memory update (see session log); no runtime code paths changed.

- **2026-02-16 (Guide structured-data SEO expansion + smoke stabilization):** Shipped direct discoverability improvements on `/guide` and locked them with regression coverage.
  - **Schema coverage shipped (`/guide`):**
    - Added `FAQPage` JSON-LD with operational Q&A for penny-finding behavior.
    - Added `HowTo` JSON-LD with step-based workflow tied to core utility routes (`/penny-list`, `/store-finder`, `/in-store-strategy`, `/report-find`).
    - Kept existing `CollectionPage` + `BreadcrumbList` schema in place for continuity.
  - **Regression coverage shipped:**
    - Added Playwright assertions in `tests/seo-jsonld.spec.ts` requiring `/guide` to contain `CollectionPage`, `BreadcrumbList`, `FAQPage`, and `HowTo` JSON-LD blocks, with minimum FAQ/step counts.
    - Updated stale smoke assertion in `tests/smoke-critical.spec.ts` to match current transparency H1 copy after `/support` -> `/transparency` redirect.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npx playwright test tests/seo-jsonld.spec.ts --project=chromium-desktop-light --workers=1` ✅, `npm run ai:checkpoint` ✅.

- **2026-02-15 (Multi-domain conformance enforcement):** Added fail-closed memory checks that enforce the founder operating-system artifact contract during checkpoint and verify flows.
  - **Enforcement shipped (`scripts/ai-memory.ts`):**
    - Added required artifact existence checks for autonomy canon files:
      - `.ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md`
      - `.ai/impl/founder-autonomy-memory-hardening.md`
      - `.ai/topics/FOUNDER_AUTONOMY_CURRENT.md`
    - Added critical conformance checks for the SOP:
      - required multi-domain sections,
      - required domain matrix columns,
      - all 12 domain rows,
      - domain-specific artifact markers.
    - Added context-pack snapshot line for multi-domain conformance pass totals.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run ai:checkpoint` ✅.

- **2026-02-15 (Multi-domain AI operating system implementation):** Operationalized the founder autonomy system into explicit domain-by-domain execution contracts.
  - **Canonical SOP expansion shipped (`.ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md`):**
    - Added hard execution contracts for `DevOps`, `Security`, `Marketing`, `SEO`, `Affiliates`, `Advertising`, `Monetization`, `PRD`, `Planning`, `Debugging`, `MVP`, and `Future Projects`.
    - Added required cadence + artifact + done-criteria matrix so cross-domain work is auditable and handoff-safe.
    - Added a deterministic per-cycle loop requiring domain identification, verification, memory updates, and checkpoint handoff.
  - **Plan/topic continuity shipped:**
    - Updated `.ai/impl/founder-autonomy-memory-hardening.md` to mark Phase 2 complete and set Phase 3 enforcement as active.
    - Updated `.ai/topics/FOUNDER_AUTONOMY_CURRENT.md` to reflect the multi-domain contract baseline and next hardening tasks.
    - Updated `.ai/BACKLOG.md` to reflect progress on the top P0 autonomy item.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run ai:checkpoint` ✅.

- **2026-02-15 (Privacy-policy provider-neutral rewrite):** Replaced vendor-specific privacy language with a stronger, network-agnostic policy tailored to current site behavior and consent obligations.
  - **Policy reframing shipped (`/privacy-policy`):**
    - Removed Ezoic-specific disclosure block and embed anchor.
    - Added use-case-specific collection/disclosure language for Report a Find, Contact, and email signup data.
    - Added ad-network-neutral personalization/opt-out wording with Google Ads Settings and AboutAds controls.
    - Added regional consent controls section for EEA/UK/Switzerland.
  - **Test alignment shipped:** `tests/privacy-policy.spec.ts` now enforces absence of Ezoic text and presence of neutral compliance disclosures.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npx playwright test tests/privacy-policy.spec.ts --project=chromium-desktop-light --workers=1` ✅.

- **2026-02-15 (Privacy-policy disclosure hardening for ad review readiness):** Added explicit Ezoic disclosure language and required embed anchor to reduce policy-ambiguity risk during ad-network/domain reviews.
  - **Privacy policy updates shipped (`/privacy-policy`):**
    - Added an Ezoic-specific disclosures section with required source links:
      - `http://g.ezoic.net/privacy/pennycentral.com`
      - Ezoic privacy policy and advertising partners pages
      - industry opt-out links (`youradchoices.com`, `optout.aboutads.info`)
    - Added required manual embed anchor: `#ezoic-privacy-policy-embed`.
    - Preserved Rakuten qualifying-signup referral disclosure language.
  - **Test alignment shipped:** `tests/privacy-policy.spec.ts` now validates Ezoic disclosure presence and embed anchor existence.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npx playwright test tests/privacy-policy.spec.ts --project=chromium-desktop-light --workers=1` ✅.

- **2026-02-15 (Persistent-memory hardening + founder-autonomy operating system):** Implemented machine-checkable memory integrity and deterministic context-pack generation to survive context-window resets.
  - **Automation shipped:**
    - Added `scripts/ai-memory.ts` with:
      - `npm run ai:memory:check` (critical/warning memory contract checks)
      - `npm run ai:memory:pack` (timestamped context artifact generation)
      - `npm run ai:checkpoint` (blocking handoff guard: no critical failures)
    - Integrated memory checks into `scripts/ai-verify.ts` as a first-class gate.
  - **Canonical docs shipped:**
    - Added `.ai/FOUNDER_AUTONOMY_OPERATING_SYSTEM.md`
    - Added `.ai/impl/founder-autonomy-memory-hardening.md`
    - Added `.ai/topics/FOUNDER_AUTONOMY_CURRENT.md`
    - Updated `.ai/START_HERE.md`, `.ai/VERIFICATION_REQUIRED.md`, `.ai/USAGE.md`, and `.ai/HANDOFF_PROTOCOL.md` to include checkpoint workflow.
  - **Verification:** `npm run ai:memory:check` ✅, `npm run ai:memory:pack` ✅, `npm run ai:checkpoint` ✅, `npm run verify:fast` ✅, `npm run check:docs-governance` ✅.

- **2026-02-14 (FAQ presentation + Guide progression UX refinement):** Simplified FAQ readability and fixed Guide submenu interaction clarity.
  - **FAQ cleanup shipped (`/faq`):**
    - Removed heavy boxed FAQ cards and switched to a cleaner linear section flow.
    - Added explicit step-based ordering and “what this section covers” summaries.
    - Added a top read-order map with step anchors for faster scanning.
  - **Navbar interaction clarity shipped:**
    - Guide chapter links now include explicit `Step 1`-`Step 6` progression labels and clearer coverage descriptions.
    - Mobile Guide submenu now has a real collapse/expand toggle and collapses after section selection.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run ai:proof -- dev /faq /guide` ✅ (`reports/proof/2026-02-14T11-36-37/`).

- **2026-02-14 (PR conflict resolution + merge completion for trust UX):** Cleared unresolved merge conflicts and finalized trust/legal UX changes with full-lane verification.
  - **Conflict resolution completed:**
    - Resolved `.ai/STATE.md`, `app/faq/page.tsx`, `components/footer.tsx`, and `components/navbar.tsx`.
    - Restored staged-but-missing trust files (`/do-not-sell-or-share`, legal backlink component, and trust/sitemap docs skills assets).
  - **Behavior alignment completed:**
    - Preserved current header IA (Guide dropdown + FAQ/Contact).
    - Kept trust UX updates (email-only privacy request flow + calmer transparency).
    - Added legal footer access to `/do-not-sell-or-share`.
  - **Regression/test alignment completed:**
    - Restored explicit Rakuten referral + qualifying-signup language in legal/transparency pages.
    - Added privacy rights deep-link anchor (`#ccpa`).
    - Updated legal/trust Playwright specs to match current approved copy.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run e2e:full` ✅ (172 passed).

- **2026-02-14 (Founder-feedback refinement pass):** Reduced compliance/monetization copy friction and simplified privacy rights UX.
  - `/do-not-sell-or-share` now uses an email-only request path (no inline form).
  - `/transparency` rewritten to factual disclosure style without promotional/referral push blocks.
  - Added `docs/skills/solo-dev-ads-approval-triage.md` for repeatable, lower-stress domain-approval troubleshooting.
  - Verification: lint ✅, typecheck ✅, targeted route/sitemap tests ✅, verify/smoke blockers documented.

- **2026-02-14 (Legal/IA implementation pass from founder feedback):** Replaced docs-only output with direct app-route implementation and navigation updates.
  - Rewrote live trust/legal page content for `/privacy-policy`, `/terms-of-service`, `/about`, `/faq`, and `/contact` with cleaner structure, clearer disclaimers, and future-dated update stamps.
  - Added first-party `/do-not-sell-or-share` route with CCPA/CPRA request form and supplemental industry links.
  - Added reusable `← Back to Penny List` pattern on trust/legal pages via `components/legal-back-link.tsx`.
  - Updated header/footer IA and sitemap coverage for trust pages; added ad-exclusion policy coverage for `/do-not-sell-or-share` route.
  - Verification: `npm run lint` ✅, `npm run typecheck` ✅, targeted tests (`ads-route-eligibility` + `sitemap-canonical`) ✅, `npm run e2e:smoke` ⚠️ failed due missing local Playwright browser binary in this environment, Playwright screenshots captured via MCP browser tool.

- **2026-02-14 (Sitemap + legal trust package authored):** Produced a complete implementation-ready blueprint that turns unstructured competitor notes into a structured PennyCentral package.
  - Added `docs/sitemap-legal-masterpiece.md` with clean URL architecture, non-redundant header/footer IA, retention guidance, no-ads-on-legal recommendation, sitemap code blueprint, and full draft copy for Privacy, Terms, About, FAQ, and Contact plus a first-party `/do-not-sell-or-share` mechanism.
  - Added reusable skill `docs/skills/legal-sitemap-trust-pages.md` and registered it in `docs/skills/README.md` for faster repeat execution in future sessions.
  - Verification: docs/memory updates only (no runtime code path changed).

- **2026-02-14 (Disclosure truth hardening - legal/transparency correction):** Removed false partner-program claims and aligned legal disclosures to the actual Rakuten referral model.
  - **False-claim cleanup completed:**
    - Removed inaccurate "As an Amazon Associate..." style wording from:
      - `app/privacy-policy/page.tsx`
      - `app/terms-of-service/page.tsx`
      - `app/transparency/page.tsx`
    - Kept explicit material-connection disclosure for Rakuten referral compensation.
    - Removed contradictory "not affiliated with Rakuten" phrasing risk.
  - **Regression guard added:**
    - `tests/disclosure-claims-accuracy.test.ts` now fails on reintroduced Amazon Associate claims or Rakuten-denial wording and requires Rakuten referral disclosure presence.
  - **Canonical memory update:**
    - Added learning `0c` in `.ai/LEARNINGS.md` to prevent future false partner-program disclosures.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run check:docs-governance` ✅, `npm run ai:proof -- dev /privacy-policy /terms-of-service /transparency` ⚠️ screenshots captured; console noise includes pre-existing dev hydration mismatch from global layout scripts.

- **2026-02-13 (Canonical transparency hardening - approval risk reduction):** Closed route-consistency gaps that could weaken policy-review trust signals and added regression protection for legacy trust-route behavior.
  - **Canonical sitemap trust route fixed:**
    - `app/sitemap.ts` now emits `/transparency` (not legacy `/support`) in the indexed trust/legal set.
  - **Critical smoke coverage expanded:**
    - `tests/smoke-critical.spec.ts` now verifies `/support` resolves to `/transparency` and renders the expected transparency heading.
  - **Ad-exclusion policy assertions strengthened:**
    - `tests/ads-route-eligibility.test.ts` now explicitly locks `/support` and `/transparency` as ad-excluded routes.
  - **Top-level IA docs synced:**
    - `README.md` now references `Transparency & Funding` on `/transparency` to match live route intent.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅ (4/4), `npm run check:docs-governance` ✅.

- **2026-02-13 (AdSense compliance refactor - support/legal trust hardening):** Executed a compliance-first monetization/legal pass to remove solicitation risk signals and strengthen reviewer-facing trust markers.
  - **Solicitation purge completed:**
    - Removed PayPal/donation solicitation logic and hardcoded `paypal.me/cadegallen` fallback from `/support`.
    - Replaced the support-page solicitation block with a formal funding/editorial disclosure section (`monetization-transparency`) and kept affiliate disclosure professional.
    - Removed donation-only leftover language from active app sources (`app/inside-scoop/page.tsx`, `lib/analytics.ts` legacy event).
  - **Legal content updates completed:**
    - Privacy + Terms now include a `Cookies and Data Collection` section with explicit 2026 Privacy Sandbox/Topics API + Global Privacy Control (GPC) handling text.
    - Temporary Amazon disclosure text was added in this pass and later removed on Feb 14, 2026 after factual correction.
    - Confirmed CCPA remains inside Privacy Policy as a sub-section (`/privacy-policy#ccpa`), while footer CCPA link was removed.
  - **Footer/navigation refactor completed:**
    - `components/footer.tsx` Legal area is now a single row: `Privacy Policy | Terms of Service | Contact`.
  - **Metadata/schema hardening completed:**
    - Injected requested `WebPage` JSON-LD block into `/about` and `/support` with publisher email `contact@pennycentral.com`.
  - **About-page stale-count guard completed:**
    - Replaced exact member-count phrasing with `tens of thousands of members` language on `/about`.
  - **Outbound retailer rel hardening completed:**
    - Applied `rel="nofollow sponsored noopener noreferrer"` to all audited retailer outbound links (`/go/rakuten`, Home Depot item links, Home Depot store-page links).
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run ai:proof -- test /about /support /privacy-policy /terms-of-service` ✅ (`reports/proof/2026-02-13T20-27-13/`), targeted source/build scans for solicitation tokens + `donation` ✅ (no matches in app sources and targeted build route outputs), legal email scan ✅ (`contact@pennycentral.com` only on-site address).

- **2026-02-13 (Product truth hardening - docs + governance + constants):** Removed active Trip Tracker drift, standardized member count to a single source of truth, and hardened governance checks so stale claims fail before merge.
  - **Canonical count contract updated:** `lib/constants.ts` now defines:
    - `COMMUNITY_MEMBER_COUNT = 64000`
    - `COMMUNITY_MEMBER_COUNT_LAST_VERIFIED = "2026-02-13"`
    - derived display/badge exports from the canonical raw value
  - **Deprecated feature drift removed (active surfaces):**
    - `README.md`
    - `SKILLS.md`
    - `.ai/DECISION_RIGHTS.md`
    - `.ai/CONTEXT.md`
    - `.ai/GROWTH_STRATEGY.md`
    - `scripts/run-audit.ps1` (`/trip-tracker` replaced with `/report-find`)
  - **Stale member-count claims corrected (active surfaces):**
    - `README.md` now uses `64,000+` with explicit freshness date (`as of February 13, 2026`)
    - `.ai/CONTEXT.md` + `.ai/GROWTH_STRATEGY.md` aligned to current count policy
    - `.ai/topics/PROJECT_IDENTITY.md` updated to 64,000+ milestone
  - **Drift prevention shipped:** `scripts/check-doc-governance-drift.mjs` now fails on:
    - active Trip Tracker tokens in canonical docs/tooling
    - stale count tokens (`50K+`, `50,000+`, `62K+`, `62,000+`) in canonical docs/tooling
    - README/count freshness mismatch relative to `lib/constants.ts`
  - **AI navigation hardening follow-up (same day):**
    - `README.md`, `SKILLS.md`, and `AGENTS.md` now point to live/canonical paths only for startup docs and memory files.
    - Added explicit location map/read-order guidance so agents can find canon, skills, constraints, verification, and historical archives without repo-wide searching.
    - Removed/updated stale references in active navigation docs (including missing root-level roadmap/changelog/google-form doc pointers and outdated cashback route/file pointers).
  - **Affiliate/cashback drift cleanup follow-up (same day):**
    - Removed stale BeFrugal-specific active copy where it no longer reflects current product reality (`.ai/CONTEXT.md`, `.ai/GROWTH_STRATEGY.md`).
    - Updated active QA/audit route targets from `/cashback` to `/support` (`.ai/TESTING_CHECKLIST.md`, `scripts/run-audit.ps1`, `tests/live/console.spec.ts`).
    - Drift guard now blocks stale cashback/affiliate tokens in active docs/tooling (`scripts/check-doc-governance-drift.mjs`).
  - **Verification:** `npm run check:docs-governance` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, active-drift greps ✅, screenshot+console proof ✅ (`reports/proof/2026-02-13T13-25-45-product-truth-hardening/`, `console-check.json`).

- **2026-02-13 (Founder communication canon + policy-language remediation pass):** Implemented the requested plain-English communication canon and rewrote policy-sensitive guide wording that was flagged as monetization blockers.
  - **Canonical communication updates:** Added mandatory plain-English and term-definition requirements to:
    - `AGENTS.md`
    - `.ai/CONTRACT.md`
    - `.ai/START_HERE.md`
    - `.ai/HANDOFF_PROTOCOL.md`
  - **Meaning lock for Monumetric phrase:** Documented that "approved by our ad providers" is a partner-network eligibility signal, not universal AdSense account approval:
    - `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`
    - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
  - **Content-policy rewrites (route pages):**
    - `app/in-store-strategy/page.tsx` (removed attention-avoidance/evasion phrasing, shifted to compliance-first wording)
    - `app/inside-scoop/page.tsx` (removed register-log-avoidance phrasing, replaced with neutral policy-handling wording)
    - `app/faq/page.tsx` (replaced "quiet self-checkout" tactic phrasing with normal checkout + final store-decision wording)
  - **Incident/matrix/evidence sync:** Updated to reflect remediation is implemented in code and pending deployment/evidence refresh:
    - `.ai/evidence/adsense/2026-02-13-policy-route-audit.md`
    - `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md`
    - `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`
    - `.ai/topics/SITE_MONETIZATION_CURRENT.md`
    - `.ai/evidence/adsense/README.md`
  - **Gate posture update:** AdSense gate moved from prior `NO-GO` (content blockers) to `CONDITIONAL-GO` after deployment + refreshed evidence snapshots.
  - **Verification:** `npm run check:docs-governance` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npx playwright test tests/__tmp_policy_copy_proof.spec.ts --project=chromium-desktop-light --workers=1` ✅ (3/3, screenshots attached in Playwright HTML report data bundle).

- **2026-02-13 (Monetization incident command center implementation - docs/governance):** Implemented the cross-network incident-memory system so AdSense/Monumetric/Ad Manager/Journey blockers cannot be dropped between sessions.
  - **New canonical tracker:** Added `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` with required schema (`incident_id`, `opened_date`, `last_update`, `status`, `evidence_path`, `known_facts`, `unknowns`, `next_action`, `deadline`, `close_criteria`) and four active incidents:
    - `INC-ADSENSE-001`
    - `INC-MONUMETRIC-001`
    - `INC-ADMANAGER-001`
    - `INC-JOURNEY-001`
  - **Evidence lock updated:** Canonicalized key dates/facts:
    - Feb 2, 2026 first AdSense low-value denial (from Monumetric email-chain evidence)
    - ~Feb 3, 2026 AdSense re-application
    - Feb 12, 2026 AdSense status changed to "We found some policy violations"
    - Feb 10/11, 2026 Monumetric metric inconsistency (`session pageviews` -> `active users`)
  - **Workflow enforcement added:** Updated `.ai/START_HERE.md` and `.ai/HANDOFF_PROTOCOL.md` to require reading/updating the incident register at session open/close for monetization work.
  - **Cross-links synced:** Updated `.ai/BACKLOG.md`, `.ai/SESSION_LOG.md`, `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`, `.ai/topics/SITE_MONETIZATION_CURRENT.md`, and `.ai/topics/INDEX.md`.
  - **Policy gate artifact added:** `.ai/topics/MONETIZATION_POLICY_VIOLATION_MATRIX.md` with fixed risk dimensions and a locked page-level audit set.
  - **Peer-review corrections applied:** Updated `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` to remove stale homepage-canonical blocker language and replaced it with a live route snapshot (`status=200`, self-canonical, `noindex=false`) backed by `.ai/evidence/adsense/2026-02-13-route-snapshot.json`.
  - **Incident model tightened:** `INC-ADSENSE-001` now tracks `holdover_hypothesis`, `review_request_submitted_at`, and `earliest_re_eval_date`; re-review gate includes a 7-14 day post-review time-lag rule unless explicit new policy subtype evidence appears.
  - **Evidence hygiene added:** Created `.ai/evidence/adsense/README.md`, added a persistent transcription artifact for the Feb 12 policy-violations screenshot (`.ai/evidence/adsense/2026-02-12-needs-attention-policy-violations.md`), and added Monumetric OCR extract evidence (`.ai/evidence/adsense/2026-02-13-monumetric-email-ocr-extract.md`).
  - **Policy gate completed:** Added route-level audit evidence `.ai/evidence/adsense/2026-02-13-policy-route-audit.md` and representative SKU metadata snapshot `.ai/evidence/adsense/2026-02-13-sku-route-snapshot.json`.
  - **Gate decision (historical):** This earlier pass set `NO-GO` based on content-policy blockers. Later same-day remediation pass rewrote those blockers and moved state to `CONDITIONAL-GO` pending deployment evidence refresh.
  - **Timeline lock refined:** AdSense dates are now explicit in canon:
    - denied 2026-02-02
    - re-applied 2026-02-03
    - denied again (policy violations) 2026-02-12
  - **Ad Manager status clarified:** `INC-ADMANAGER-001` moved to `OPEN-STATUS-SPLIT` with founder-reported Ezoic re-submission on 2026-02-09 and Monumetric provider-approval signal on 2026-02-11; decline artifact remains pending.
  - **Verification:** `npm run check:docs-governance` ✅, `npm run verify:fast` ✅ (docs-only session; no app/runtime code changes).

- **2026-02-13 (Monumetric Option B runtime pivot - provider-managed placement):** Implemented the founder-approved override to let Monumetric control placement by default while preserving only hard in-app exclusions.
  - **Policy change shipped:** deprecated strict app-side allow/restrict route inventory forcing in favor of provider-managed placement on all non-excluded routes.
  - **Hard exclusions preserved:** `/report-find`, legal/support/auth/list/internal/API/redirect/system routes remain ad-disabled in code.
  - **Runtime modules updated:** `lib/ads/route-eligibility.ts`, `lib/ads/launch-config.ts`, `lib/ads/slot-plan.ts`, `components/ads/route-ad-slots.tsx`.
  - **Safety posture:** sticky reserve remains available but is disabled by default (`MONUMETRIC_LAUNCH_CONFIG.sticky.enabled=false`) unless explicitly re-enabled after partner guidance.
  - **Coverage updated:** `tests/ads-route-eligibility.test.ts`, `tests/ads-slot-plan.test.ts`, `tests/ads-launch-config.test.ts`.
  - **Canonical docs synced:** `.ai/impl/monumetric-launch-spec.md` (status + override), `.ai/topics/SITE_MONETIZATION_CURRENT.md`.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npx playwright test tests/visual-smoke.spec.ts --project=chromium-mobile-light --project=chromium-mobile-dark --grep "renders /penny-list"` ✅ (2/2); `npm run ai:proof -- test /penny-list /guide /report-find` failed intentionally-fast due missing healthy port `3002` server.
  - **Watchout:** repository remains pre-existing dirty tree; unrelated modifications were left untouched.

- **2026-02-12 (Monumetric tier dispute - awaiting response):** Sent comprehensive pushback email challenging tier placement and traffic legitimacy accusation.
  - **Blocker:** Monumetric onboarding paused pending tier resolution. Site technically ready for ad implementation (Phases 1-4 complete), but cannot proceed until tier dispute is resolved.
  - **Context:** Samantha (Publisher Success Associate) placed site in Propel tier (10K-80K pageviews, $99 fee) despite site having 85K pageviews which qualifies for Ascend tier (80K-500K, no fee) per published criteria on Monumetric's join page, application form, and all third-party sources.
  - **Metric inconsistency:** Samantha initially said they use "session pageviews" (Feb 4), then changed to "active users" (Feb 11). Neither metric is documented in published criteria — all sources say "monthly pageviews."
  - **Traffic accusation:** Samantha questioned if traffic is purchased due to 97.6% US visitors. This is baseless — site serves Home Depot penny deal community (US retailer), traffic is from 63.7K-member Facebook group where Cade is admin.
  - **Legal argument (Section 12.9):** Samantha cited "3 months consistency" requirement, but T&C Section 12.9 shows "two consecutive months" rule applies only to "Propel sites" qualifying for "graduation" — not to new applicants. Cade hasn't paid, gone live, or served ads yet; he's still an applicant whose current traffic (85K) falls in Ascend range.
  - **Email sent:** Comprehensive pushback with Facebook group proof (link + screenshot showing 63.7K members, admin status, website in featured section), traffic source breakdown (57% Direct, 22% Organic Social, 13% Search), engagement metrics (18-28% bounce, 1-2+ min engagement, disproves bots), Section 12.9 legal citation, and request for written Ascend criteria.
  - **Next action:** Wait 3-5 business days (until Feb 17-19) for response. Escalate past Samantha if no response or if response is unsatisfactory with no compromise.
  - **Decision framework:** Accept Propel only if (1) $99 fee waived OR (2) written commitment to Ascend upgrade after 2 months at 80K+ pageviews. Otherwise escalate or walk.
  - **Backup plan:** Can reactivate Ezoic (MCM already set up, $0 fee, no traffic requirement) or wait 1-3 months to hit Mediavine (50K sessions) or Raptive (100K pageviews) thresholds.
  - **Full documentation:** Complete timeline, arguments, and response scenarios in `.ai/topics/SITE_MONETIZATION_CURRENT.md` and `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md`.
  - **Verification:** Docs-only update; no code changes.

- **2026-02-11 (Monumetric Phase 4 implementation - measurement + rollback operations):** Executed the fourth runtime phase from `.ai/impl/monumetric-launch-spec.md`.
  - **Guardrail engine shipped:** Added `lib/ads/guardrail-report.ts` with baseline-aware hard/soft/no-lift rollback evaluation and reason-coded outcomes.
  - **Operations command shipped:** Added `scripts/monumetric-guardrail-report.ts` + npm script `monumetric:guardrails` to generate timestamped artifacts in `reports/monumetric-guardrails/`.
  - **Workflow reliability hardening:** Added positional CLI fallback for npm/powershell environments where prefixed flags are swallowed.
  - **Coverage:** Added `tests/ads-guardrail-report.test.ts` for hard rollback, soft rollback, no-lift rollback, and hold-state scenarios.
  - **Contract updates:** Updated `.ai/topics/ANALYTICS_CONTRACT.md` with event param naming standard and required Phase 4 guardrail run command.
  - **Verification:** `npm run monumetric:guardrails -- template .ai/_tmp/monumetric-guardrail-template.json` ✅, `npm run monumetric:guardrails -- .ai/_tmp/monumetric-guardrail-template.json` ✅, `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run lint:colors` ✅, `npm run check:docs-governance` ✅, scope guard artifact ✅ (`.ai/_tmp/scope-guard-monumetric-phase4.md`).
  - **Watchout:** scope guard continues to report `package.json` modified in worktree (pre-existing dirty tree; this phase also intentionally adds one npm script entry).

- **2026-02-11 (Monumetric Phase 3 implementation - route-level slot application):** Executed the third runtime phase from `.ai/impl/monumetric-launch-spec.md`.
  - **Route slot architecture shipped:** Added `lib/ads/slot-plan.ts` (matrix-to-inventory resolver) and `components/ads/route-ad-slots.tsx` (route-scoped slot marker renderer + route plan payload script).
  - **Eligible templates wired:** Applied `RouteAdSlots` to `/`, `/penny-list`, `/guide`, all canonical guide chapters (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`), plus `/sku/[sku]` and `/pennies/[state]`.
  - **Policy behavior:** Excluded routes remain ad-empty by matrix policy; restricted/allow routes now receive only their launch-approved unit set.
  - **Test coverage:** Added `tests/ads-slot-plan.test.ts`.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run lint:colors` ✅, `npm run check:docs-governance` ✅, Playwright proof ✅ (`reports/proof/2026-02-11T23-47-55/`), scope guard artifact ✅ (`.ai/_tmp/scope-guard-monumetric-phase3.md`).
  - **Watchout:** scope guard continues to report `package.json` modified in worktree (pre-existing to this phase).

- **2026-02-11 (Monumetric Phase 2 implementation - `/penny-list` mobile utility + sticky reserve):** Executed the second runtime phase from `.ai/impl/monumetric-launch-spec.md`.
  - **Mobile utility migration shipped:** Added `components/penny-list-mobile-utility-bar.tsx` and replaced the old fixed-bottom mobile action bar in `components/penny-list-client.tsx`.
  - **Behavior contract implemented:** Utility bar now renders below navbar, auto-hides only after `scrollY > 120` with downward delta >=16, re-shows on upward delta >=12 or near top (`scrollY <= 72`), and stays visible while filter/sort sheets are open.
  - **Sticky reserve scaffold added:** Added `components/ads/mobile-sticky-anchor.tsx` and mounted it from `components/penny-list-client.tsx` with safe-area bottom handling and collapse control while sheets are open.
  - **Prompt stack gate shipped:** `PennyListPageBookmarkBanner`, `EmailSignupForm`, and `PWAInstallPrompt` now pause on mobile when sticky test is active via `shouldPausePennyListPromptStack(...)`.
  - **Test coverage:** Added `tests/ads-launch-config.test.ts`.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run lint:colors` ✅, Playwright proof ✅ (`reports/proof/2026-02-11T23-24-33/`), scope guard artifact ✅ (`.ai/_tmp/scope-guard-monumetric-phase2.md`).
  - **Watchout:** scope guard continues to report `package.json` modified in worktree (pre-existing to this phase).

- **2026-02-11 (Monumetric Phase 1 implementation - analytics hygiene + route config):** Executed the first runtime phase from `.ai/impl/monumetric-launch-spec.md`.
  - **Analytics safety shipped:** `lib/analytics.ts` now sanitizes reserved-like keys (`source/medium/campaign` -> `pc_*`) and normalizes legacy attribution keys to `ui_source`.
  - **Callsite migration:** `source` analytics params migrated to `ui_source` across primary monetization-scope surfaces (`/`, `/sku/[sku]`, navbar, penny-list card/action rows, share/copy flows), plus shared-list/list-item consistency pass.
  - **Route policy foundation:** Added `lib/ads/route-eligibility.ts` (canonical allow/restrict/exclude matrix + helpers) and `lib/ads/launch-config.ts` (sticky/interstitial/VOLT launch flags + prompt-pause constants).
  - **Test coverage:** Added `tests/analytics.test.ts` and `tests/ads-route-eligibility.test.ts`.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, scope guard artifact `.ai/_tmp/scope-guard-monumetric-phase1.md` ✅.
  - **Watchout:** scope guard reports `package.json` modified in working tree; treated as pre-existing to this phase.

- **2026-02-11 (Monumetric launch spec finalization - docs):** Finalized a decision-complete launch spec before implementation and locked route policy + guardrails.
  - **Canonical plan:** `.ai/impl/monumetric-launch-spec.md`.
  - **Locked outputs:** final allow/restrict/exclude route matrix, `/penny-list` mobile top auto-hide utility spec, measurement/rollback framework, Monumetric handoff message, and file-level implementation phases.
  - **Analytics lock-in:** device mix + route/event baselines embedded from Jan 14-Feb 10, 2026.
  - **Backlog alignment:** monetization P0 plan pointer now targets `.ai/impl/monumetric-launch-spec.md`.
  - **Verification:** Docs-only planning update; gates not run.

- **2026-02-11 (P0 UI trust fixes + ai:proof runtime contract):** Shipped the first execution pass from the trust/utility remediation plan and hardened screenshot proof runtime behavior.
  - **UI execution (P0):**
    - `/` hero now has one dominant action (`Browse Penny List`) with a demoted inline `Report a Find` secondary path.
    - `/report-find` SKU helper no longer uses placeholder content; it now provides concrete SKU capture guidance and examples.
    - `/sku/[sku]` now surfaces freshness directly in the `Identifiers` block (status + last report date).
  - **Runtime contract execution:** `scripts/ai-proof.ts` now supports deterministic `dev`/`test` modes and `PLAYWRIGHT_BASE_URL`, with explicit fail-fast behavior for unhealthy/missing 3001/3002 servers and no server kill/restart side effects.
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, `npm run lint:colors` ✅, `npm run check-contrast` ✅, proof bundle `reports/proof/2026-02-11T09-06-42/` ✅.

- **2026-02-11 (ai:verify default mode policy codified):** Closed the remaining governance decision by making isolated test mode deterministic for `ai:verify`.
  - **Runtime contract:** `npm run ai:verify` now defaults to Playwright-owned port `3002`; dev-server verification on `3001` requires explicit opt-in (`npm run ai:verify -- dev` or `--mode=dev`).
  - **Compatibility:** Legacy `auto` mode now maps to test mode so old habits don’t reintroduce implicit 3001 behavior.
  - **Governance memory:** Updated canonical policy text in `.ai/VERIFICATION_REQUIRED.md`, closed the open-decision language in `.ai/impl/vision-charter-first-governance-realignment.md`, and refreshed backlog/session memory.
  - **Verification:** `npm run check:docs-governance` ✅, `npm run verify:fast` ✅ (build emitted non-blocking Supabase anon fetch timeouts during static generation).

- **2026-02-11 (Vision Charter-first governance realignment major pass):** Completed charter authority setup, governance conflict cleanup, and drift prevention wiring.
  - **Authority + canon:** Added `VISION_CHARTER.md` and refactored startup/canon docs to charter-first read order + mandatory fail-closed Alignment Gate.
  - **Governance audits:** Added reset receipt, surface map, conflict matrix, harm register, and trust/utility UI audit + remediation plans under `.ai/audits/`.
  - **Drift prevention:** Added `scripts/check-doc-governance-drift.mjs`, npm script `check:docs-governance`, and CI enforcement in `.github/workflows/quality.yml`.
  - **Plan canonicality:** Preserved the full governance handoff in `.ai/impl/vision-charter-first-governance-realignment.md`.
  - **Verification:** `npm run check:docs-governance` ✅, `npm run verify:fast` ✅.

- **2026-02-10 (Ads.txt Ezoic verification block):** Appended the Ezoic reseller list to `public/ads.txt` with start/end comment markers for easy removal; added a new skill doc (`docs/skills/ads-txt-update.md`).
  - **Verification:** `npm run verify:fast` ✅ (build logged Supabase anon fetch timeouts during static generation; non-blocking).

- **2026-02-09 (Resources redirect + footer consolidation):** Removed the obsolete `/resources` surface, consolidated footer legal/support links, and confirmed crawl hygiene.
  - **Redirects:** Added permanent redirects for `/resources` and `/resources/` → `/guide` in `next.config.js`.
  - **Footer cleanup:** Grouped links into Company / Support / Legal and renamed the CCPA link to “California Privacy (CCPA)” (still anchored at `/privacy-policy#ccpa`).
  - **Route tree refresh:** Updated `ROUTE-TREE.txt` to match the current route surface (no `/resources`).
  - **Verification:** `npm run verify:fast` ✅, `npm run e2e:smoke` ✅, redirect check (localhost) ✅, Playwright proof at `reports/proof/2026-02-09-resources-footer/`.

- **2026-02-09 (PR #133 verification pass + Sonar remediation):** Completed a fresh local verification pass and fixed the remaining SonarCloud quality-gate blocker on PR #133.
  - **Verification refresh:** Local `verify:fast` rerun ✅ (`reports/forensics/review3-verify-fast-rerun-2026-02-09T16-44-09.log`), local `e2e:smoke` rerun ✅ (`reports/forensics/review3-e2e-smoke-rerun-2026-02-09T16-43-17.log`), and post-fix `verify:fast` ✅ (`reports/forensics/review3-postfix-verify-fast-2026-02-09T16-46-17.log`).
  - **Sonar root cause proven:** PR check `SonarCloud Code Analysis` failed due one open security hotspot (`AZxEKXYrJwEIlETBDrFL`) in `.github/workflows/full-qa.yml:39` ("Use full commit SHA hash for this dependency.").
  - **Fix shipped:** Pinned `dorny/paths-filter` to immutable SHA `de90cc6fb38fc0963ad72b210f1f284cd68cea36` (`v3.0.2`) in `.github/workflows/full-qa.yml`.
  - **Status caveat:** SonarCloud will remain red on the current check run until a new PR analysis executes on the updated commit.

- **2026-02-09 (Full QA failure forensic fix):** Re-verified tiered verification rollout and resolved deterministic CI failures blocking `Full QA Suite`.
  - **Root causes proven:** (1) invalid artifact names in sharded full-e2e uploads (`full-e2e-shard-1/2`) and (2) false-positive border contrast failure caused by `scripts/check-contrast.js` comparing text color vs border color for border checks.
  - **Fixes shipped:** `.github/workflows/full-qa.yml` shard matrix/name update (slash-free artifact names) and `scripts/check-contrast.js` border assertion correction (border color measured against background color).
  - **CI proof:** FAST ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21840056433`, SMOKE ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21840056489`, FULL ✅ `https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/actions/runs/21840056498` (PR `#133`).
  - **Local proof:** `npm run verify:fast` ✅ (`reports/forensics/review2-phase4-verify-fast-after-fix.log`), `npm run e2e:smoke` ✅ (`reports/forensics/review2-phase4-e2e-smoke-after-fix.log`), `npm run e2e:full` ✅ (`reports/forensics/review2-phase4-e2e-full-after-fix.log`), `npm run check-contrast` ✅ (`reports/forensics/review2-phase4-check-contrast-after-fix.log`).

- **2026-02-09 (Tiered CI/CD verification overhaul):** Replaced monolithic verification behavior with FAST/SMOKE/FULL lanes across scripts, tests, CI triggers, and agent instructions.
  - **Scope:** `package.json`, `tests/smoke-critical.spec.ts`, `.github/workflows/{quality.yml,smoke-e2e.yml,full-qa.yml}`, `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `CONTRIBUTING.md`, plus canonical verification docs (`README.md`, `.ai/START_HERE.md`, `.ai/CRITICAL_RULES.md`, `.ai/VERIFICATION_REQUIRED.md`).
  - **Change detail:** Added lane scripts (`verify:fast`, `e2e:smoke`, `e2e:full`, `verify`), created a 3-test smoke suite, added dedicated smoke workflow, converted full QA to conditional + sharded execution with Playwright browser caching, and codified `run-full-e2e` trigger policy.
  - **Verification:** `npm run verify:fast` ✅ (`reports/forensics/phase4-verify-fast-2026-02-09T14-21-49.log`), `npm run e2e:smoke` ✅ (`reports/forensics/phase4-e2e-smoke-2026-02-09T14-23-32.log`), `npm run e2e:full` ✅ (`reports/forensics/phase4-e2e-full-2026-02-09T14-24-37.log`), workflow YAML formatting ✅ (`npx prettier --check .github/workflows/*.yml`).

- **2026-02-09 (Guide editorial block restoration):** Restored the full editorial strip across guide pages and removed smaller replacement timestamp text.
  - **Scope:** `app/guide/page.tsx` + all chapter routes (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`).
  - **Change detail:** Replaced inline "Updated February 2026 · By Cade Allen" metadata rows with shared `EditorialBlock` (founder byline preserved as "Written by Cade Allen").
  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156/156), proof bundle: `reports/proof/2026-02-09T08-49-22/`.

- **2026-02-09 (GA4 hardening + forensic verification):** Resolved analytics undercount/overlap risk with a single-source pageview model and recurring verification.
  - **Root cause confirmed:** Pre-fix baseline (`eb366bc`) missed landing-page pageviews in tested flows.
  - **Fix applied:** `app/layout.tsx` uses GA auto pageview config, `components/analytics-tracker.tsx` is a no-op placeholder, and `next.config.js` frame-src now includes adtraffic/google frame domains used by traffic-quality checks.
  - **Guardrails added:** New command `npm run ai:analytics:verify` (`scripts/ai-analytics-verify.ts`) plus `.ai/topics/ANALYTICS_CONTRACT.md`.
  - **Coverage proof:** guide/canonical + legacy guide redirect matrix verified with exactly one `page_view` per tested route (`reports/ga4-guide-routes-prod-check.json`).

- **2026-02-09 (Interactive MCP Setup):** Added `interactive-mcp` to the project baseline for better human-AI collaboration.
  - **Config update:** Added `interactive` server to `.vscode/mcp.json`.
  - **Docs update:** Updated `.ai/MCP_BASELINE.md`, `.ai/TOOLING_MANIFEST.md`, and `.ai/MCP_SETUP.md` to reflect the new standard.
  - **Verification:** Verified successful tool communication via `mcp_interactive_request_user_input`.

- **2026-02-08 (Guide recovery ship completion - main sync):** Completed chunked commit/push workflow and left branch clean/synced.
  - **Commits pushed to `main`:** `9cbce81` (guide phases 0-3), `db69c96` (sitewide monetization planning), `6277357` (process/canonicality docs), `89e6b8d` (bookmarklet source+build workflow), `725e1c5` (source artifacts + ignore hygiene).
  - **Bookmarklet hardening:** Added canonical source `tools/bookmarklets/pc-extractor.src.js`, deterministic builder `tools/bookmarklets/build-bookmarklet.js`, and regenerated `tools/bookmarklets/bookmarklet.txt` from source.
  - **Repo hygiene:** Added `Guide Remodel/codexdialogue.txt` + `Guide Remodel/Operational Analysis of Home Depot 2026 Clearance Architecture.docx` to tracked sources; updated `.gitignore` for local-only outputs (`/reports/`, `.ai/_tmp/`, Office lock files).
  - **Verification:** `npm run ai:verify` ✅ (`reports/verification/2026-02-08T22-16-05/summary.md`).

- **2026-02-08 (Guide recovery implementation - Phase 3 drift guard):** Executed Phase-3-only scope from `.ai/impl/guide-recovery.md` to prevent future guide regressions.
  - **Step 3.0 complete:** Created `.ai/topics/GUIDE_FORMAT_CONTRACT.md` with the canonical chapter template, voice rules, locked-copy pointer, 2026 intel distribution map, concept introduction order, and forbidden reintroductions list.
  - **Scope guardrails preserved:** No dependency changes, no route model changes, no unrelated refactors.
  - **Verification:** guide guardrails ✅ (`reports/guide-guardrails/2026-02-08T20-46-00.md`) and full 4-gate verify ✅ (`reports/verification/2026-02-08T20-46-17/summary.md`).

- **2026-02-08 (Guide recovery implementation - Phase 2):** Executed remaining Phase-2-only scope from `.ai/impl/guide-recovery.md` and closed the FAQ/hub/visual guardrail gaps without entering Phase 3.
  - **Step 2.0 complete:** `app/faq/page.tsx` now has visible grouped Q&A (Basics, Verification, Checkout & Policy, Etiquette & Community) with zero `<details>` usage, preserved FAQ JSON-LD sourced from `faqs`, and expanded visible answer depth.
  - **Step 2.1 complete:** `app/guide/page.tsx` now includes the "Where should you start?" triage section, tighter section rhythm, and explicit hub monetization gate decision (hub remains navigation-first and ad-ineligible in this phase).
  - **Step 2.1 TOC copy complete:** `components/guide/TableOfContents.tsx` chapter descriptions updated to canonical one-line plan copy.
  - **Step 2.2 complete:** `app/globals.css` now restores `.guide-article h2` border-bottom + padding + `mt-8/mb-4` rhythm, adds `.guide-callout-speculative`, and adds a subtle light-mode callout shadow with dark-mode suppression.
  - **Step 2.2d status:** Chapter 3 already retained the Chapter 2 cadence cross-reference in `app/digital-pre-hunt/page.tsx`; no additional change required this pass.
  - **Verification:** guide guardrails ✅ (`reports/guide-guardrails/2026-02-08T20-32-02.md`), full 4-gate verify ✅ (`reports/verification/2026-02-08T20-32-11/summary.md`), and proof bundle ✅ (`reports/proof/2026-02-08T20-37-44/`).

- **2026-02-08 (Guide recovery implementation - Phase 0 + Phase 1):** Executed approved implementation scope from `.ai/impl/guide-recovery.md` without entering Phase 2/3.
  - **Phase 0 delivered:** `.ai/topics/GUIDE_MONETIZATION_CONTRACT.md`, `.ai/topics/GUIDE_LOCKED_COPY.md`, `.ai/audits/guide-claim-matrix-2026-02-08.md`, `scripts/guide-guardrails.ts`, and npm alias `ai:guide:guardrails`.
  - **Phase 1 delivered:** Chapter updates across `app/what-are-pennies/page.tsx`, `app/clearance-lifecycle/page.tsx`, `app/digital-pre-hunt/page.tsx`, `app/in-store-strategy/page.tsx`, `app/inside-scoop/page.tsx`, `app/facts-vs-myths/page.tsx`, plus Phase-1-scope updates in `app/faq/page.tsx`.
  - **Quality checkpoints:** All guide chapter `<h2>` inline class overrides removed; locked founder strings preserved; banned hedging phrases removed; chapter word-count target now satisfied for Chapters 1-6 in the guardrail report.
  - **Verification:** `npm run ai:verify` ✅ (`reports/verification/2026-02-08T18-20-32/summary.md`), Playwright proof ✅ (`reports/proof/2026-02-08T18-26-05/`), guide guardrails ⚠️ expected Phase-2-only FAQ failures (`reports/guide-guardrails/2026-02-08T18-20-17.md`).

- **2026-02-08 (Sitewide monetization readiness planning - docs):** Added a canonical sitewide monetization architecture plan so non-guide concerns stop living in chat context.
  - **New canonical plan:** `.ai/plans/sitewide-monetization-readiness.md`
  - **New current-state capsule:** `.ai/topics/SITE_MONETIZATION_CURRENT.md`
  - **Policy lock-in:** active-valid inventory retention, temporary noindex for thin active pages, invalid-record-only 410/redirect, homepage/nav first-layer strong-page mandate
  - **Registry updates:** `.ai/plans/INDEX.md`, `.ai/topics/INDEX.md`
  - **Verification:** Docs-only planning update; no runtime/code changes.

- **2026-02-08 (Guide recovery plan refinement - docs):** Refined `.ai/impl/guide-recovery.md` to add automation-first recurring checks and a mobile-first monetization architecture.
  - **Phase 0 added:** `GUIDE_MONETIZATION_CONTRACT.md` + scriptable guardrail checks before content edits.
  - **Monetization rules clarified:** route-level eligibility, legal-page exclusions, `/guide` hub ad gate, mobile frequency caps, and no ad-cluster placement.
  - **Word-count policy clarified:** replaced hard "Google minimum" wording with internal monetization-depth targets (800+ for monetized chapter pages).
  - **Acceptance criteria expanded:** added monetization layout gate, hub eligibility gate, and guardrail automation gate.
  - **Consistency update:** synced `Guide Remodel/GUIDE_RECOVERY_HANDOFF.md` to match the refined plan.
  - **Verification:** Docs-only planning update; no runtime/code changes.

- **2026-02-08 (Plan canonicality guardrail - docs):** Added repo-first planning guardrails so all agents use one canonical plan source in `.ai/impl/`.
  - **AGENTS contract update:** Added a critical rule in `AGENTS.md` requiring final plans in `.ai/impl/<slug>.md` and treating `.claude/plans` as scratch only.
  - **Critical rule update:** Added `Rule #6` in `.ai/CRITICAL_RULES.md` with required canonical path/hash/sync reporting and a PowerShell hash check snippet.
  - **Handoff schema update:** Updated `.ai/HANDOFF_PROTOCOL.md` so planning tasks must include canonical plan evidence in handoff output.
  - **Skill added:** Added `docs/skills/plan-canonicality.md` and indexed it in `docs/skills/README.md`.
  - **Verification:** Docs-only process hardening; no runtime/code changes.

- **2026-02-07 (External-links route removal + sitemap cleanup):** Removed the low-value external-links surface and all active references so it is no longer linked, indexed, or audited as a core page.
  - **Route removal:** deleted the dedicated external-links route file.
  - **Indexing/nav cleanup:** removed the external-links route from `app/sitemap.ts` and `components/command-palette.tsx`.
  - **Verification + audit cleanup:** removed the external-links route from `tests/live/console.spec.ts` and `scripts/run-audit.ps1`.
  - **Copy/docs alignment:** updated `app/page.tsx`, `README.md`, `ROUTE-TREE.txt`, `COMPONENT-TREE.txt`, and `docs/skills/repo-map.md` to match the new route set.
  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156/156), Playwright proof: `reports/proof/2026-02-07T06-41-40/`.

- **2026-02-06 (Guide UX de-clutter + navigation simplification):** Completed a one-shot guide presentation cleanup to reduce dead space, remove conflicting navigation signals, and simplify chapter flow.
  - **Hub rebuilt:** `app/guide/page.tsx` now uses a cleaner chapter-first structure with one disclosure, simpler quick-start guidance, and reduced visual clutter.
  - **Chapter nav simplified:** `components/guide/ChapterNavigation.tsx` now uses clearer labels, responsive single-column mobile fallback, and no empty `next` column when absent.
  - **Redundant CTA panels removed:** removed conflicting end-of-page promo cards from `app/in-store-strategy/page.tsx`, `app/facts-vs-myths/page.tsx`, and `app/faq/page.tsx` so chapter progression is unambiguous.
  - **Spacing + demarcation cleanup:** tightened guide rhythm via `components/page-templates.tsx` and `app/globals.css`, including reduced inter-section spacing and removal of heavy H2 divider lines.
  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T22-09-10/`.

- **2026-02-06 (Trust Signals & Authenticity Overhaul):** Replaced "template/corporate" content on Trust Pages with authentic, founder-led content to satisfy AdSense E-E-A-T.
  - **About Page:** Replaced placeholders with the "Nurse to Webmaster" origin story, community growth details (32k -> 62k), and "Scavenger Hunt" philosophy. Correctly credited Spoe Jarky and Jorian Wulf.
  - **Contact Page:** Shifted from "business inquiries" to "Data Accuracy" focus; added "Correction Promise" (24hr response).
  - **Support Page:** Moved transparency/monetization disclosure to the top (AdSense requirement).
  - **Identity Documented:** Created `.ai/topics/PROJECT_IDENTITY.md` to persist the specific names, dates, and origin story facts so future agents follow the "Nurse/Founder" persona.
  - **Verification:** `npm run build` ✅, Manual content audit against "High Quality" guidelines.

- **2026-02-06 (Completion/Handoff workflow hardening - docs):** Standardized how tasks are closed and handed off so context survives agent/context-window switches.
  - **Canonical process contract:** Added `.ai/HANDOFF_PROTOCOL.md` (required closeout sequence + `Next-Agent Handoff` schema + meta-awareness persistence rules).
  - **Wired into canon:** Updated `README.md`, `.ai/START_HERE.md`, `.ai/VERIFICATION_REQUIRED.md`, `AGENTS.md`, and `.ai/HANDOFF.md` to make handoff explicit and mandatory.
  - **Skill added:** `docs/skills/task-completion-handoff.md` and indexed in `docs/skills/README.md`.
  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-06 (Guide AAA polish + guardrail hardening):** Completed a one-shot UX/readability pass to normalize guide layout alignment and harden automated contrast enforcement.
  - **Guide presentation fixes:**
    - Aligned guide header, editorial strip, prose column, and chapter navigation to one centered 68ch reading column on all chapter routes.
    - Added `className` support to `components/guide/EditorialBlock.tsx` and applied consistent width constraints on all guide chapter pages.
  - **Token tuning for strict thresholds:**
    - Light placeholder: `--text-placeholder` `#55504a` → `#544f49` (now above 7:1 on recessed surfaces).
    - Dark borders: `--border-default` `#455a64` → `#546e7a`; `--border-strong` `#546e7a` → `#607d8b`; `--border-dark` `#607d8b` → `#78909c` (keeps non-text boundaries above 3:1 on page/card surfaces).
  - **Contrast tooling hardening:**
    - Expanded route coverage (`checks/routes.json`) to include guide chapters and core routes.
    - Expanded selector coverage (`checks/selectors.json`) with guide-aware selectors and optional handling to reduce false negatives.
    - Updated `scripts/check-contrast.js` to enforce token-level checks and required-selector behavior, including border checks on both `--bg-page` and `--bg-card`.
  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), `npm run check-contrast` ✅, proof bundle: `reports/proof/2026-02-06T08-30-41/`.

- **2026-02-06 (WCAG AAA Readability Overhaul - Guide Visual System):** Fixed the guide visual system and readability foundation for light/dark modes.
  - **Token changes (globals.css):**
    - Light `--text-secondary`: `#36312e` → `#44403c` (body copy — wider gap from headlines, AAA)
    - Light `--text-muted`: `#44403c` → `#504a45` (metadata — clearly lighter than body, AAA)
    - Light `--text-placeholder`: `#36312e` → `#544f49` (placeholder now AAA on recessed surfaces)
    - Dark `--text-secondary`: `#b0b0b0` → `#bdbdbd` (AAA on card surfaces)
    - Dark `--text-muted`: `#a3a3a3` → `#adadad` (AAA on card surfaces)
    - Added `--bg-subtle` token (light: `#f8f8f7`, dark: `#181818`)
  - **Guide enhancements:**
    - Added `.guide-article` CSS class with enhanced readability (1.75 line-height, 68ch max-width, h2 border separators, styled tables)
    - Added `.guide-callout` / `.guide-callout-warning` / `.guide-callout-success` classes
    - Added `variant="guide"` prop to `Prose` component; applied to all 7 guide chapters
  - **Docs updated:** `docs/DESIGN-SYSTEM-AAA.md` (full rewrite to match actual tokens), `.ai/CRITICAL_RULES.md`, `.ai/CONSTRAINTS.md`, `.ai/CONSTRAINTS_TECHNICAL.md`, `AGENTS.md`
  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06-aaa-readability/` (16 screenshots: 8 pages × light/dark).

- **2026-02-06 (AdSense reapplication status - docs only):** Added founder clarification that AdSense was re-applied about one day after rejection and is currently active/in-review.
  - **Topic updated:** `.ai/topics/ADSENSE_APPROVAL_CURRENT.md`.
  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-06 (Monetization status context - docs only):** Recorded founder-reported AdSense/Ad Manager/Monumetric timeline so future sessions stop re-asking for the same approval history.
  - **Topic updated:** `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` now includes:
    - AdSense low-value denial timing (Feb 2-3, 2026, founder-reported)
    - concurrent Ezoic/Ad Manager evaluation and later denial context
    - Monumetric outreach + reported escalation to Google approvals
    - founder preference to de-prioritize Ezoic and prioritize Monumetric
  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-06 (Guide spacing cleanup - remove deadspace after editorial block):** Reduced vertical gaps across guide chapters by removing extra margins and tightening layout spacing.
  - **Layout changes:** Removed redundant margins around the editorial block and prose blocks; set guide pages to tighter `PageShell` spacing; removed `my-8` from `EditorialBlock`.

  - **Scope:** `/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`, and `components/guide/EditorialBlock.tsx`.

  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T05-18-53/`.

- **2026-02-06 (Guide Finish Touches - TOC, Links, Sources):** Applied final UI compliance fixes for the guide hub + chapters without changing core content.
  - **TOC badge sizing:** Raised Part badge to 12px minimum for readability.

  - **Quick links:** Default underlines applied on /guide quick links to match link rules.

  - **Inside Scoop sources:** Converted Home Depot corporate links into action buttons.

  - **Pre-hunt caveat:** Softened ladder color note with "varies by store" language.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T03-30-08/`.

- **2026-02-06 (Guide Content Alignment - Source-of-Truth Sync):** Applied a diff-based content pass across the guide hub + chapters to align with the pre-split HTML and newinfo notes without adding unverified claims.
  - **Content restored:** timeline durations + tag-date example (clearance lifecycle), penny-prone categories + community-reported verification tips (in-store), No Home + ladder notes (pre-hunt), internal-ops context + community-reported signals (inside scoop), and a real-vs-rumor mini table (facts vs myths).

  - **Tone policy:** Added short inline caveats for community-reported items; removed boilerplate EthicalDisclosure blocks from subpages (primary disclosure remains on `/guide`).

  - **FAQ updates:** Added/normalized pre-split questions with softened policy language.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-06T00-00-51/`.

- **2026-02-05 (Guide Rebuild - AdSense Content Recovery):** Rebuilt the guide from the pre-split HTML baseline, restored accuracy, and expanded word count for AdSense quality.
  - **Scope:** `/guide` hub + seven chapters (`/what-are-pennies`, `/clearance-lifecycle`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/facts-vs-myths`, `/faq`).

  - **Content approach:** Preserved original logic, removed false claims, labeled speculative items, and kept internal terms as community-reported context.

  - **UX:** Updated `components/guide/TableOfContents.tsx`, added expanded checklists/FAQs, and captured before/after UI proof.

  - **Verification:** `npm run lint` ✅, `npm run lint:colors` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), Playwright proof: `reports/proof/2026-02-05T21-59-41/`.

- **2026-02-05 (Analytics Tidy Up - GA4/Monumetric Hygiene):** Tidied up the analytics implementation to improve data accuracy and restore Monumetric/GA4 trust.
  - **SPA Tracking:** Refactored client-side page views to use a native Next.js `AnalyticsTracker` component; removed brittle `history.pushState` patch in `layout.tsx`.

  - **Consent Mode v2:** Added explicit default consent signals for GA4 behavioral modeling (recovering data from blocked/unconsented users).

  - **Redundancy Reduction:** Removed redundant `home_page_view` and `penny_list_view` events; merged metadata (device/theme) into standard `page_view` config.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed).

- **2026-02-05 (Trip Tracker removal + plan archival):** Removed Trip Tracker from the product surface and archived the route per founder request.
  - **Code changes:** Removed `/trip-tracker` from sitemap and navigation surfaces; updated console audit test pages list.

  - **Archive:** `app/trip-tracker` moved to `archive/pages-pruned/2026-02-05-pass1/app/trip-tracker/` with restore manifest.

  - **Plan archive:** `adsense-approval-hardening` plan archived to `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md` per founder request; indexes updated.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed).

- **2026-02-05 (AdSense hardening - canonical fix + Monumetric context):** Implemented canonical metadata repair and updated monetization plan context to include Monumetric review.
  - **Canonical fix:** Removed homepage-wide canonical fallback in `app/layout.tsx`; added explicit `alternates.canonical` across indexable routes (including `/guide`, `/store-finder`, `/clearance-lifecycle`, `/faq`, `/privacy-policy`, and other pillar pages).

  - **Docs updated:** `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md` + `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` now reference Monumetric requirements and review status.

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed).

- **2026-02-05 (AdSense context retention + plan hardening, docs-only):** Added canonical context docs so monetization/indexing strategy survives context-window resets.
  - **New topic capsule:** `.ai/topics/ADSENSE_APPROVAL_CURRENT.md` (evidence-backed current state, risks, handoff checklist).

  - **New plan:** `archive/docs-pruned/2026-02-05-pass1/.ai/plans/adsense-approval-hardening.md` (multi-phase strategy covering canonical repair, sitemap/index hygiene, guide trust recovery, and review cadence).

  - **Indexes updated:** `.ai/plans/INDEX.md`, `.ai/topics/INDEX.md`.

  - **Verification:** Docs-only change; quality gates not run.

- **2026-02-04 (Guide Content & Layout Repair):** Addressed user feedback regarding barren guide pages, missing navigation, and incorrect clearance info.
  - **Scope:** Overhauled `/guide` and `/clearance-lifecycle`; added `ChapterNavigation` and `TruthMatrix`.

  - **Content delivered:** 2026 Rules (MET/ZMA), Truth matrix (Old vs New), Chapter navigation flow.

  - **Files updated:** `app/clearance-lifecycle/page.tsx`, `app/guide/page.tsx`, `components/guide/TruthMatrix.tsx`, `components/guide/ChapterNavigation.tsx`.

  - **Verification:** `npm run ai:verify` ✅ (All gates passed), Design System compliant.

- **2026-02-04 (Guide Refresh - 2026 Research Integration):** Integrated 2026 operational research into the public guide pages and enforced token-only styling for a professional look.
  - **Scope:** Implemented `.ai/plans/2026-research-integration.md`.

  - **Content delivered (high-signal additions):**
    - ICE metrics tables + explanation

    - $.02 “buffer” explanation (what it signals and why it matters)

    - MET team schedule/ownership and why resets matter

    - ZMA disposition data table + implications

    - Legacy vs 2026 behavior comparison (explicitly labeled; no promises)

  - **Files updated:**
    - `app/clearance-lifecycle/page.tsx`

    - `app/inside-scoop/page.tsx`

    - `app/in-store-strategy/page.tsx`

    - `app/facts-vs-myths/page.tsx`

    - `components/guide/TableOfContents.tsx`

  - **Verification:** `npm run lint` ✅, `npm run build` ✅, `npm run test:unit` ✅ (26/26), `npm run test:e2e` ✅ (156 passed), `npm run lint:colors` ✅ (0 errors / 0 warnings).

- **2026-02-04 (Guide Content Credibility Restoration - Critical):** Fixed content accuracy regression in clearance-lifecycle page introduced by commit 1c04eb7 (Feb 3, 2026).
  - **Root Cause:** Guide atomization commit included unapproved content rewrites that introduced false claims ("nearly 100% chance in 3 weeks"), removed detailed Cadence A & B information, reintroduced deprecated Trip Tracker CTA, and degraded mobile UX.

  - **Audit Completed:** Full analysis at `.ai/audits/guide-atomization-content-audit-2026-02-04.md` documenting what was removed vs. replaced with user impact analysis.

  - **Fixes Applied:**
    - ✅ Deleted Trip Tracker CTA block entirely (unapproved + conflicts with MY LIST)

    - ✅ Removed false "nearly 100% chance in 3 weeks" claim

    - ✅ Restored accurate Cadence A (13-week: .00→.06→.03→.01) and Cadence B (7-week: .00→.04→.02→.01) historical data with specific stage durations

    - ✅ Added "How It Used To Work" section explaining historical patterns

    - ✅ Added "What Changed" section explaining penny pricing shift (Home Depot inventory evolution)

    - ✅ Added "Current Reality" section with honest assessment of 2026 uncertainty

    - ✅ Added "Why We Show This History" bridge section to manage expectations

    - ✅ Fixed mobile UX (professional table sizing, responsive padding, removed oversized "childish" font)

  - **Verification:** `npm run qa:fast` (lint ✅, unit ✅, build ✅); commit `09a0670`.

  - **Impact:** Credibility restored through honesty about pattern shifts; users won't be blindsided when old advice doesn't work.

- **2026-02-04 (Bloat reduction - pass 5):** Implemented an evidence-based, repeatable bloat workflow and removed large sources of repo noise.
  - **Audit:** Added `npm run prune:audit` to measure repo surface area and detect bloat hotspots.

  - **Media quarantine:** Created `archive/media-pruned/` and moved large non-production media (and legacy proof images) into `archive/media-pruned/2026-02-04-pass1/` while preserving restore-path parity.

  - **Generated report cleanup:** Removed tracked generated artifacts (Playwright console reports + axe/contrast outputs) and added `.gitignore` coverage so they don’t reappear.

  - **Verification:** `npm run ai:verify -- test` (`reports/verification/2026-02-04T12-13-27/summary.md`).

- **2026-02-04 (Bloat reduction - pass 6):** Archived export artifacts, legacy Playwright snapshot baselines, and tracked screenshots into cold storage; added per-snapshot `INDEX.md` manifests and `.gitignore` patterns to prevent reintroduction. Hardened `ai:verify` so build uses `.next-playwright` when a dev server is running on 3001 (avoids `.next` clobber / flaky Windows Turbopack chunk errors).
  - **Verification:** `npm run ai:verify -- test` (`reports/verification/2026-02-04T13-31-17/summary.md`).

- **2026-02-04 (WCAG AAA Contrast Compliance - 0 Violations):** Achieved complete WCAG AAA accessibility compliance by fixing color contrast issues across all backgrounds.
  - **Root Cause Analysis:** Previous agent only tested colors against white (#ffffff) but ignored off-white backgrounds (#fafaf9, #f0f0ef) where text/borders actually appear.

  - **Fixes Applied:**
    - **Borders:** Changed from #a8a8a8 (2.38:1 - failed) to #757575 (4.61:1 on white, 4.04:1 on #f0f0ef) - now meets 3:1 UI component requirement

    - **Info/Live Indicator:** Changed from #8a6b2c (4.36:1 - failed AAA) to #53401e (8.69:1 on #f0f0ef) - now AAA compliant

    - **Text Hierarchy Restored:** Changed --text-muted from #36312e to #44403c (both AAA, but now visually distinct from --text-secondary)

    - **Placeholder Text:** Changed from #44403c to #36312e (same as secondary for consistency and AAA compliance)

  - **Verification:** axe-core accessibility scan shows **0 violations** (was 36), all 156 E2E tests passing, build successful.

  - **Mathematical Verification:** Created contrast calculation scripts that verified all colors meet 7:1 (text) or 3:1 (borders) on worst-case background (#f0f0ef).

- **2026-02-04 (AdSense/MCM Compliance Hardening):** Completed "Zero-Defect" compliance audit for Ad networks.
  - **Technical SEO:** Deleted conflicting `public/robots.txt`, verified `/sku/[sku]` and `/pennies/[state]` are explicitly `noindex` (solving "Valueless Content").

  - **Ad Integration:** Refactored AdSense script into `components/google-adsense.tsx` using `next/script` (afterInteractive) + hardcoded backup ID found in layout.

  - **Verification:** Created `scripts/verify-compliance.ts` which mathematically confirmed AdSense script presence + Noindex headers on live build.

- **2026-02-04 (Post-Mortem & SEO Remediation):** Fixed detected SEO failure where legacy `/guide/*` paths used 307 redirects. Implemented 301 permanent redirects in `next.config.js` and deleted legacy codebase folders to resolve duplicate content risks. Verified integrity with `scripts/verify-redirects.ts` (all 308) and full `npm run ai:verify` suite (lint/unit/e2e passed).

- **2026-02-03 (Docs/scripts bloat reduction - pass 4):** Archived low-signal AI prompt-pack docs to `archive/docs-pruned/2026-02-03-pass4/` and a low-reference helper script to `archive/scripts-pruned/2026-02-03-pass3/`, preserving restore-path parity. Added new snapshot manifests, updated `.ai/AI_ENABLEMENT_BLUEPRINT.md` to the archived prompt-pack path, and added `.gitignore` coverage for generated Playwright console report artifacts. Verified with `npm run ai:verify -- test` (`reports/verification/2026-02-03T23-28-59/summary.md`).

- **2026-02-03 (Docs/scripts bloat reduction - pass 3):** Archived additional legacy docs and one-off scripts while preserving deterministic restore paths: docs moved to `archive/docs-pruned/2026-02-03-pass3/`, scripts moved to `archive/scripts-pruned/2026-02-03-pass2/`. Added snapshot indexes and updated in-repo references (`.ai/CONTEXT.md`, `.ai/topics/UI_DESIGN.md`, `docs/legacy/README.md`). Verified with `npm run ai:verify -- test` (`reports/verification/2026-02-03T23-09-46/summary.md`).

- **2026-02-03 (AdSense Compliance: SEO Pillars & Content Consolidation):** Restored 6 high-quality root pillar pages (e.g., `/what-are-pennies`, `/clearance-lifecycle`, `/inside-scoop`) and redirected legacy `/guide/xxx` sub-paths to them to resolve Duplicate Content issues. Implemented a feature-rich `/faq` page with Schema.org JSON-LD. Hardened `sitemap.ts` to include 20 high-value pillar URLs only. Pushed all changes after successful `npm run build` and `npm run test:e2e` (82+ tests passing).

- **2026-02-03 (Docs/scripts bloat reduction - pass 2):** Archived an additional low-signal set into cold storage: 7 docs moved to `archive/docs-pruned/2026-02-03-pass2/` and 28 unreferenced/single-use scripts moved to `archive/scripts-pruned/2026-02-03/` (preserving exact restore paths). Added manifest files for both snapshots and updated startup guardrails so agents ignore both `archive/docs-pruned/**` and `archive/scripts-pruned/**` unless explicitly requested. Verified with `npm run ai:verify -- test` (`reports/verification/2026-02-03T22-49-40/summary.md`).

- **2026-02-03 (Enablement: Agent Autonomy Hardening plan scaffold):** Added canonical planning docs for agent reliability and context retention: `.ai/plans/agent-autonomy-hardening.md` + `.ai/topics/AGENT_AUTONOMY_CURRENT.md`; registered in `.ai/plans/INDEX.md` and moved port-3001 reliability/access matrix into a phased, decision-complete plan. Docs-only change; quality gates not run.

- **2026-02-03 (Security & Cron Pause):** Paused weekly digest cron (`/api/cron/send-weekly-digest`) and removed from Vercel schedule to address Supabase usage warnings. Fixed critical vulnerability in `@isaacs/brace-expansion`. Verified with `npm run build`.

- **2026-02-01 (Fix: pre-enrichment retail_price missing + manual Penny List refresh):** Fixed staging warmer + scraper normalization so `enrichment_staging` no longer drops retail prices when upstream returns `store_retail_price` (and `retail_price` is `"N/A"`). Added staging status coverage stats and optional zip breadth sampling (`--zip-pool/--zip-sample/--zip-seed`, `PENNY_ZIP_POOL`). Added `scripts/apply-hd-enrichment-json.ts` to refresh Penny List enrichment fields from a manual HomeDepot.com scrape JSON (Option A). Hardened the HD bookmarklet price extraction to avoid exporting `price: ""` on some PDP variants, and kept it as an inline bookmarklet (Home Depot can block external script injection). Verified with `npm run ai:verify -- test` (bundle: `reports/verification/2026-02-02T19-24-43/summary.md`).

- **2026-01-30 (Visual hierarchy overhaul: penny cards + static pages):** Fixed visual hierarchy across penny cards (metadata spacing, SKU chip styling, state chip containers, dark mode AAA contrast, empty ad slot gap) and static pages (Contact email card, About CTA hierarchy + h2 spacing, Support Rakuten card). Verified with all 4 quality gates + Playwright screenshots (mobile/desktop/dark). Plan files: `.ai/impl/visual-hierarchy-overhaul.md`, `.ai/impl/static-pages-visual-hierarchy.md`.

- **2026-01-30 (Fix: SerpApi spend control):** Scoped SerpApi gap-filler to the last 30 days only (prevents churn on historical backlog), reduced SerpApi workflow cadence to daily, added one-time backlog attempt capping migration, and added minimal `serpapi_logs` run summary table for auditability. Verified with `npm run ai:verify -- test` (bundle: `reports/verification/2026-01-30T06-19-26/summary.md`).

- **2026-01-30 (Fix: retail price accuracy):** Stopped copying `retail_price` from `enrichment_staging` into `Penny List` during submission/cron seeding (prevents wrong retail strike-through values). SerpApi gap filler now pins `delivery_zip` (env: `SERPAPI_DELIVERY_ZIP`, default `30303`) to improve pricing/availability consistency. Verified with `npm run ai:verify -- test` (bundle: `reports/verification/2026-01-30T00-30-06/summary.md`).

- **2026-01-28 (Enablement: safe local env parity):** Added `npm run env:pull` (Vercel → `.env.local`) and `npm run env:safety` (blocks accidental local targeting of prod Supabase by default), plus `npm run start:prodlike` for perf debugging. Updated `ai:doctor` and local warmer docs to reduce “limp local” from missing env vars. Verified with `npm run ai:verify` (lint/build/unit/e2e all passed).

- **2026-01-28 (Pages overhaul: Rakuten redirects):** Added `/go/rakuten` (redirects to Rakuten) and `/go/befrugal` (redirects to `/go/rakuten` for backward compatibility), plus `RAKUTEN_REFERRAL_URL` constant. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk1-2/`).

- **2026-01-28 (Pages overhaul: Privacy Policy rewrite):** Rewrote `/privacy-policy` to remove all Ezoic references, add GA4 disclosure, generalize advertising to “advertising partners” with `/ads.txt` reference, add Rakuten affiliate disclosure, and add a CCPA section anchored at `/privacy-policy#ccpa`. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk3/`).

- **2026-01-28 (Pages overhaul: Terms of Service page):** Added `/terms-of-service` with a new Terms of Service page (effective date: Jan 28, 2026). Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk4/`).

- **2026-01-28 (Pages overhaul: Support page rewrite):** Rewrote `/support` to include a prominent Rakuten section (CTA links to `/go/rakuten` + affiliate disclosure), merge transparency content, remove the page-level `/cashback` link, and keep generalized ads + contact info. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e` (bundled under `reports/verification/2026-01-28-pages-overhaul-chunk5/`).

- **2026-01-28 (Pages overhaul: /cashback redirect):** Deleted `/cashback` page and added a permanent redirect `/cashback` → `/support` in `next.config.js`. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.

- **2026-01-28 (Pages overhaul: Footer links):** Updated the footer to remove the `/cashback` link, add `/terms-of-service`, add `/privacy-policy#ccpa` (“Do Not Sell My Info”), and update the copyright year to 2026. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.

- **2026-01-28 (Pages overhaul: Affiliate docs cleanup):** Updated docs to treat `/go/rakuten` as canonical (keeping `/go/befrugal` as legacy redirect) and removed the BeFrugal CSP `connect-src` entry from `next.config.js`. Verified with `npm run lint`, `npm run build`, `npm run test:unit`, `npm run test:e2e`.

- **2026-01-26 (Deprecate Google Sheets pipeline):** Archived legacy Google Forms/Sheets strategy doc (`docs/legacy/PENNY-LIST-STRATEGY.md`), updated docs to Supabase flow (`README.md`, `PROJECT_ROADMAP.md`, `docs/WEEKLY-UPDATE-CHECKLIST.md`, `docs/AUTH-PIVOT-GUIDANCE.md`), added DEPRECATED headers to sheet-related scripts, and moved sensitive scripts to `backups/legacy-scripts/` to satisfy privacy pre-commit checks. Verified with `npm run qa:fast` (lint/build/test:unit all passed). Commit: `cd78313`.

---

## Traffic & Device Mix (Update Monthly)

**Source:** GA4 → Reports → Tech → Tech details → Device category

**Window:** last 28 days (consistent monthly window)

- **Mobile:** TBD%

- **Desktop:** TBD%

- **Tablet:** TBD%

### Weekly “Top 3” (Decision Output)

From `.ai/ANALYTICS_WEEKLY_REVIEW.md`:

- **Top leak:** TBD

- **Top opportunity:** TBD

- **Top guardrail:** TBD

- **2026-01-26 (SKU pill copy):** Added a reversible, feature-flagged copyable SKU pill on Penny List cards; styles + Playwright test added and verified (lint/build/unit/e2e).

- **2026-01-25 (Email Subscribers: Security & UX Hardening - LIVE):** Fixed 3 issues with email signup form: (1) **UX Bug:** Form was disappearing without success feedback because localStorage write triggered immediate re-render. Moved `safeSetItem(SUBSCRIBED_KEY)` inside the 3-second timeout so success message displays before hiding. (2) **Security:** Switched `/api/subscribe` and `/api/unsubscribe` to use `getSupabaseServiceRoleClient()` instead of anon key. Created migration 021 to drop overly permissive anon INSERT/UPDATE policies and fix trigger function search_path (`SET search_path = public, pg_catalog`). All writes now validated via API before database. (3) **Rate Limiting:** Added per-email rate limiting (3/hour, normalized to strip +aliases and lowercase) alongside existing IP rate limiting (5/hour). Prevents bypass via `test+spam@gmail.com` or domain variants. Commits: 5ce7bed (migration + initial fixes), b2caad9 (reapply after agent revert). **Note:** Migration 021 still needs to run in Supabase (will apply automatically on next Vercel deploy, or run manually in SQL editor).

- **2026-01-25 (Pipeline: local-first staging warmer + GH probe-only):** Updated the `Enrichment Staging Warmer` workflow to run in **probe-only** mode on schedule (no Supabase writes; no hard dependency on secrets) and to open/update an issue when blocked. Added a `PROBE_ONLY` path to `scripts/staging-warmer.py` so scheduled runs stay green while still emitting `FETCH_DIAGNOSTICS` + `cloudflare_block=true/false`. Also improved “freshness” tracking by stamping `created_at` on upserts, and fixed `scripts/print-enrichment-staging-status.ts` to use `created_at` (added `npm run staging:status`). Local warmer remains the primary data freshness path: `npm run warm:staging`.

- **2026-01-25 (SEO: delete thin pages):** Intentionally deleted `app/checkout-strategy/page.tsx` and `app/responsible-hunting/page.tsx` (commit `b7ca7bd`) to remove thin/low-value pages. These pages no longer serve `200` and should no longer be considered part of the sitemap strategy.

- **2026-01-24 (AdSense compliance deployment - LIVE):** Merged PR #108 to production after fixing merge conflicts and CSP blockers that had prevented deployment for weeks. Updated PR branch from main (resolved .ai/\* conflicts by keeping main's timeline), added Google AdSense domains to CSP allowlist in next.config.js (script-src: pagead2.googlesyndication.com, connect-src: pagead2.googlesyndication.com, frame-src: googleads.g.doubleclick.net + tpc.googlesyndication.com), ran full verification suite (lint/build/unit/e2e: all passed), pushed to GitHub (all CI checks passed: Quality Fast, CodeQL, SonarCloud, Vercel), merged to main via squash merge. Production now has: (1) AdSense script in `<head>` on all pages (`<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5302589080375312">`), (2) Privacy policy with Google AdSense disclosures (DART cookie, third-party ads, opt-out links), (3) Contact page at /contact with contact@pennycentral.com, (4) About page expanded with mission statement (>200 words), (5) Sitemap includes /contact, (6) Footer includes "Contact Us" link. Fixed app/robots.ts to explicitly allow Mediapartners-Google (was missing because dynamic robots.ts was overriding public/robots.txt). Google AdSense can now verify the site for approval. Commits: f337e5f (PR #108 merge), 6ccf197 (robots.txt fix).

- **2026-01-24 (AdSense readiness + professional email checklist):** Added a README checklist covering domain/DNS, Cloudflare Email Routing, deliverability basics, and AdSense reviewer expectations. Added a reusable skill doc for future sessions: `docs/skills/adsense-domain-email-setup.md`.

- **2026-01-24 (SEO: stop redirect-only pages + sitemap canonical):** Removed redirects for `/checkout-strategy` and `/responsible-hunting` so those pages serve content and return `200` (not `308`). Added both pages to the live sitemap (`app/sitemap.ts`) and canonicalized `public/sitemap.xml` to `https://www.pennycentral.com/...` for consistency. Also hardened Playwright verification so e2e runs don’t clobber `.next` by using an isolated `NEXT_DIST_DIR=.next-playwright` output dir. Verification bundle: `reports/verification/2026-01-24T23-01-47/summary.md`. Production verified (Jan 24, 2026): both pages return `200` and appear in `/sitemap.xml`.

- **2026-01-23 (Ads.txt canonicalization):** Shipped Vercel config so `/ads.txt` resolves to `https://www.pennycentral.com/ads.txt` and is served with `Cache-Control: no-store, max-age=0` (static file at `public/ads.txt`; no middleware/API). Production verification (Jan 24, 2026): HTTPS apex and HTTP www are ≤1 hop; **HTTP apex is still 2 hops** due to Vercel’s automatic HTTP→HTTPS redirect happening before host canonicalization. Verification bundles: `reports/verification/2026-01-24T17-52-21/summary.md`, `reports/verification/2026-01-24T17-57-47/summary.md`.

- **2026-01-23 (SEO: State pages 500 fix):** Fixed `/pennies/[state]` pages returning 500 in production (blocking crawl/indexing) by updating the route params to match Next 16 (`params: Promise<...>`). Also stabilized Playwright verification by building in test mode with `NEXT_PUBLIC_EZOIC_ENABLED=false` and using `127.0.0.1` for the Playwright base URL to avoid flaky `localhost` IPv6 connection issues. Verification bundle: `reports/verification/2026-01-23T17-39-46/summary.md`.

- **2026-01-23 (Pipeline: Enrichment Staging Warmer diagnostics + Cloudflare blocker):** Fixed the GitHub Actions `Enrichment Staging Warmer` workflow so failures aren’t silent: added per-zip HTTP diagnostics (`FETCH_DIAGNOSTICS`), clearer failure hints, and auto-created/updated a GitHub issue on failure (includes `cloudflare_block: true/false`). Reality check: the upstream `pro.scouterdev.io/api/penny-items` endpoint is returning **403 + Cloudflare “Just a moment...” HTML** from GitHub-hosted runners, so scheduled runs are a low-aggression probe until we change runtime/IP. Added a local manual override that runs the _same_ pipeline from your home IP: `npm run warm:staging`. Also updated Vercel cron endpoints `seed-penny-list` and `trickle-finds` to read from `enrichment_staging` because production Supabase does **not** have `penny_item_enrichment` (PostgREST `PGRST205`). Verification bundle: `reports/verification/2026-01-23T10-51-52/summary.md`. Failure tracking issue: https://github.com/cadegallen-prog/HD-ONECENT-GUIDE/issues/106. Note: Cade updated Vercel apex redirect `pennycentral.com → www.pennycentral.com` from **307** to **301** for SEO/canonicalization.

- **2026-01-22 (Ezoic Ads: Option B Placeholders):** Implemented a trust-first Ezoic ad rollout with **5 total slots**: 3 on homepage (`HOME_TOP`, `HOME_MID`, `HOME_BOTTOM`), 1 on Penny List after item #10 (`LIST_AFTER_N`), and 1 on Guide after Section II (`CONTENT_AFTER_P1`). Added CLS-protected placeholder component + centralized ad config with `NEXT_PUBLIC_EZOIC_ENABLED` kill switch (requires Vercel redeploy for env var changes). Playwright E2E runs now force-disable Ezoic via `NEXT_PUBLIC_EZOIC_ENABLED=false` to prevent hydration mismatches and keep console clean. All 4 gates passing (lint/build/unit/e2e). Verification: `reports/verification/2026-01-22T10-39-19/summary.md`. Ad placement screenshots: `reports/proof/2026-01-22T10-29-18-ezoic-b/`.

- **2026-01-22 (Tooling: Codex MCP Enablement):** Upgraded Codex CLI to a version that supports `codex mcp list/add/login`, normalized MCP config docs to `mcp_servers` (snake_case), and documented setup in `docs/skills/codex-mcp-setup.md`. (Local machine changes are outside repo; see `~/.codex/config.toml`.)

- **2026-01-22 (Penny List Bottom Pagination):** Fixed mobile UX issue where users had to scroll all the way back to the top to navigate to the next page. Added bottom pagination controls after the results (card grid or table) that only show when there are multiple pages. Features: "Showing X to Y of Z items" summary, Previous/Next buttons with arrows, prominent "Page X of Y" indicator, auto-scroll to top on page change, 44px mobile tap targets. Bottom pagination makes it immediately obvious there are more pages and provides one-tap navigation. All 4 gates passing (lint/build/unit/e2e). Verification: `reports/verification/2026-01-22T07-33-39/summary.md`.

- **2026-01-22 (SEO: Global Canonical Tags):** Implemented self-referencing canonical tags across the entire site to fix Google Search Console issue where `/penny-list` was "Crawled - currently not indexed". Created `lib/canonical.ts` with `CANONICAL_BASE` constant and helper functions. Updated root `app/layout.tsx` metadata to include `alternates.canonical` field (Next.js automatically renders as `<link rel="canonical" ... />` in `<head>`). Updated `app/penny-list/page.tsx` and `app/sku/[sku]/page.tsx` metadata to include their own dynamic canonical tags. Result: every page now declares itself as the canonical version (homepage, penny list, SKU pages, etc.), consolidating Google's ranking authority on the new URLs and away from old redirects. All 4 gates passing (lint/build/unit/e2e). Verification: `reports/verification/2026-01-22T06-53-56/summary.md`.

- **2026-01-21 (My List Phase 2):** Implemented Phase 2 of the My List elevation plan: removed the guest redirect wall on `/lists` and added locked preview UI (hero with benefit bullets + 6 sample items from `/api/penny-list`), updated guest save clicks to redirect with intent params (`/login?redirect=/lists?pc_intent=save_to_my_list&pc_sku=${sku}&pc_intent_id=${uuid}`), implemented intent resume logic on `/lists` that auto-saves after login using sessionStorage idempotency guard and cleans URL via `router.replace("/lists")`, and ensured all new copy uses "My List" (singular) branding. Files modified: add-to-list-button.tsx (guest redirect), app/lists/page.tsx (preview UI + intent resume). Ready for testing (guest save flow, idempotency, URL cleaning).

- **2026-01-21 (My List Phase 1):** Implemented Phase 1 of the My List elevation plan: swapped Bookmark icons to Heart (with fill="currentColor" for saved state), updated all UI labels to "My List" (singular), enforced 44px mobile tap targets on secondary action buttons (Home Depot, Barcode, Save) with desktop overrides (sm:min-h-[36px]), added "My List" to navbar and command palette with Heart icon, and implemented prefix-safe active state logic (pathname === "/lists" || pathname.startsWith("/lists/")). Files modified: add-to-list-button.tsx, penny-list-client.tsx, penny-list-card.tsx, navbar.tsx, command-palette.tsx. Ready for UI verification (mobile + desktop).

- **2026-01-21 (Process):** Standardized planning docs so all agentic coders (Codex/Claude/Copilot) follow the same pipeline: canonical registry at `.ai/plans/INDEX.md`, plan template at `.ai/plans/_TEMPLATE.md`, and a planning pointer in `.ai/START_HERE.md` + `.ai/USAGE.md`. The "My List" roadmap is now anchored via `.ai/plans/my-list-elevation.md` and `.ai/topics/MY_LIST_FEATURE_CURRENT.md`.

- **2026-01-18:** SKU detail page now places the "Report this find" CTA directly under the hero image with explicit "tap this to report" guidance; the button deep-links to `/report-find` with SKU/name prefilled (via `buildReportFindUrl`) and tracks via `TrackableLink`. Playwright tests filter known Ezoic/ID5 CSP console noise so e2e only fails on real app errors. Ezoic scripts are now gated to Vercel production only (disabled in CI/Playwright) so Full QA Suite `check-axe` stays green.

- **2026-01-21:** SKU detail page (mobile-first) now prioritizes community intel and contributions: moved “Where it was found” above “Related penny items”, added inline state chips under “Community Reports” for immediate payoff, made “Report this find” the primary CTA, demoted “View on Home Depot” styling to secondary, and restored “New to Penny Hunting?” to a boxed card. Verified via `reports/verification/2026-01-21T22-17-23/summary.md` + Playwright screenshots under `reports/verification/sku-related-items-chromium-mobile-*.png`.

- **2026-01-21:** Fixed a layout regression where the "Report this find" CTA could appear to the right of the hero image on larger viewports; changed the image container to a column layout so the CTA stacks under the image consistently. Also simplified the `Internet #` identifier to `Internet #:` and removed the extra explanatory subtext so the identifier reads inline (e.g., `Internet #: 1234567890`).

- **2026-01-21:** Fixed a Vercel/local build failure on `/lists` caused by importing a non-existent `@/lib/types` and missing `<Suspense>` boundary for `useSearchParams()`. Verified with `npm run ai:verify -- test` (`reports/verification/2026-01-21T12-24-30/summary.md`).

- **2026-01-18:** Replaced the fake `data/penny-list.json` fixture with a one-time Supabase snapshot of real SKUs (sanitized + timestamp-rebased for deterministic Playwright runs) and removed placeholder SKUs from tests/examples; regenerate manually via `npm run fixture:snapshot` (no cron).

- **2026-01-18:** Evaluated "old SKU" impact and decided **not** to add any historical tagging or "active only" UX at this time; documented a narrow, approval-gated plan to harden SKU page performance without user-visible changes (`.ai/impl/sku-page-performance-hardening-plan.md`).

- **Weekly Email Digest (Jan 17):** Implemented P0-4c weekly email cron that sends penny list updates to all active subscribers every Sunday 8 AM UTC. Created `emails/weekly-digest.tsx` (React Email template with product cards, summary stats, responsive design for email clients), `lib/email-sender.ts` (Resend API wrapper with error handling, 100ms rate limiting), and `app/api/cron/send-weekly-digest/route.ts` (cron endpoint that queries active subscribers + penny items from last 7 days, processes/aggregates by SKU, renders template, sends via Resend with unsubscribe links). Added cron schedule to `vercel.json` (Sunday 8 AM UTC: `0 8 * * 0`). Installed `resend`, `@react-email/components`, `react-email` (136 packages, 0 vulnerabilities). All 4 gates passing (lint/build/unit/e2e).

- **Email Signup Form (Jan 16):** Implemented P0-4b email signup form on `/penny-list` to capture users for weekly updates. Created `email_subscribers` table (migration 015) with RLS policies and indexes, `app/api/subscribe/route.ts` (POST endpoint with Zod validation, rate limiting 5/hour per IP, honeypot protection, crypto-secure token generation), `app/api/unsubscribe/route.ts` (GET endpoint with token-based unsubscribe), `components/email-signup-form.tsx` (dismissible form that appears after 25s OR 600px scroll, localStorage persistence, GA4 tracking), and `app/unsubscribed/page.tsx` (confirmation page). Wired into penny-list-client. All 4 gates passing (lint/build/unit/e2e).

- **PWA Install Prompt (Jan 16):** Implemented "Add to Home Screen" prompt on `/penny-list` to improve Day 7 retention (currently ~0%). Created app icons (192px, 512px) from existing SVG using Playwright, updated `site.webmanifest` with proper PWA metadata (name: "Penny Central", start_url: "/penny-list"), added dismissible prompt component with localStorage persistence and GA4 tracking (pwa_prompt_shown, pwa_install_started, pwa_prompt_dismissed), and wired into penny-list-client. Prompt appears after scroll (200px) or 20s delay, respects prefers-reduced-motion, and detects existing installations. All 4 gates passing (lint/build/unit/e2e).

- **Skimlinks env vars cleaned up (Jan 16):** Removed SKIMLINKS_DISABLED env vars from CI workflow since Skimlinks script is fully removed. Verified with all 4 gates passing.

- **Penny List freshness + missing items fixed (Jan 13):** Public updates now target ~5 minutes (`/api/penny-list` CDN caching `s-maxage=300` + `/penny-list` `revalidate=300`), submitter flow can bypass once via `?fresh=1` (no-store) without global polling, and the enrichment overlay no longer hides SKUs that lack `penny_item_enrichment` rows (root cause of “some items missing”). Proof: `reports/verification/2026-01-13T08-16-40/summary.md` and `reports/proof/2026-01-13T08-22-19/console-errors.txt`.

- **Full QA Suite stabilized (Jan 13):** Fixed CI E2E hydration crash when `NEXT_PUBLIC_SUPABASE_*` is missing by making `AuthProvider` skip Supabase initialization when not configured. Ensured `/sku/[sku]` pages exist in Full QA builds by setting `USE_FIXTURE_FALLBACK=1` during the build step (CI has no Supabase creds). Reduced Sentry email noise by suppressing reporting on localhost and Vercel previews.

- **Canonical global analytics setup (Jan 12):** Made `app/layout.tsx` the single source of truth for global scripts. Grow now ships as a real `<script src="https://faves.grow.me/main.js" ...>` in `<head>` (crawler-detectable), GA4 fires on SPA route changes (history hooks), Vercel Analytics + SpeedInsights render only on Vercel production, removed invalid wildcard `preconnect` links, and updated CSP to allow `faves.grow.me` / `*.grow.me` without console errors. Verified with `reports/verification/2026-01-12T22-29-04/summary.md`.

- **Grow connectivity checker hardening (Jan 13):** Updated the Grow install in `app/layout.tsx` to match the Grow portal's canonical single-tag initializer snippet (injects `https://faves.grow.me/main.js` + sets `data-grow-faves-site-id`) to reduce false-negative "Check Grow Connectivity" failures. Local gates green; production re-check pending.

- **Privacy Policy page for Monumetric (Jan 14):** Added `/privacy-policy` (linked in global footer + sitemap) containing Monumetric's required advertising disclosure and a stable link for Monumetric onboarding. Verified locally via `reports/verification/2026-01-14T20-23-25/summary.md`.

- **Monumetric ads.txt (Jan 14):** Added `public/ads.txt` so `https://www.pennycentral.com/ads.txt` serves Monumetric's required `ads.txt` lines for interim ads onboarding. Verified locally via `reports/verification/2026-01-14T20-40-02/summary.md`.

- **Autonomous automation (Jan 15):** Implemented Dependabot weekly updates and scheduled Snyk daily scans. (Supabase backup cron was later disabled per Cade’s preference; use one-time/manual snapshots only.) Enforced Python tooling via `ruff` + `.pre-commit-config.yaml` and updated VS Code Python settings; added `.ai/SENTRY_ALERTS_MANUAL.md` with steps to tune Sentry. Verified via `reports/verification/2026-01-15T11-11-41/summary.md`.

- **Mediavine Journey (Grow) installation (Jan 12):** Integrated Mediavine's Grow script for first-party data and monetization readiness. Added `preconnect` and initializer to `app/layout.tsx`. Verified with production build and zero-warning lint.

- **Report Find submissions restored (Jan 12):** Root cause was Supabase RLS/privileges now blocking direct `anon` INSERTs into `public."Penny List"` while `/api/submit-find` was still using the anon key. Fixed by inserting via the Supabase service role key in `app/api/submit-find/route.ts` (keeps DB locked down from direct anon inserts), and rate limiting now counts only successful submissions (so a transient server error doesn't lock out users). Updated `docs/supabase-rls.md` to match current reality. Verified with `reports/verification/2026-01-12T05-37-14/summary.md`.

- **Supabase egress optimization (Jan 11):** Reduced payload per query by excluding notes from list queries (include only on detail pages). Made `notes_optional` optional in `SupabasePennyRow`, removed unused `source` column from enrichment type, added `includeNotes` flag to `getPennyListFiltered()`, updated list queries to use lightweight fetch. Expected impact: 6.30 GB → ~3.30 GB (stays under 5 GB limit). Also leverages Supabase Cache layer (currently 0.00 GB) via existing Cache-Control headers + ISR page caching (30 min). Tests pending verification.

- **Decision frame documented (Jan 11):** Added a stable "Decision Frame" (steelman/strawman for submissions vs retention vs SEO, plus stability + pipeline) to `.ai/CONTEXT.md` so agents keep perspective on what matters.

- **Agent alignment + proof canon (Jan 11):** Added missing `.ai/VERIFICATION_REQUIRED.md` (paste-ready proof format) and expanded `.ai/USAGE.md` (Goldilocks task spec + course-correction script). Linked from `.ai/START_HERE.md`, `.ai/CODEX_ENTRY.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` so Codex/Claude/Copilot follow the same protocol.

- **Dev/Test mode protocol (Jan 11):** Standardized dev-server ownership to reduce Copilot hang/port loops: `ai:verify` supports `dev`/`test` modes with HTTP readiness retries, Playwright uses a Playwright-owned `next start` server on port 3002 by default (no reuse unless `PLAYWRIGHT_REUSE_EXISTING_SERVER=1`), and port 3001 guidance is now "kill only if proven unhealthy + you own it".

- **Penny Deal Card final converged design (Jan 11):** Updated Penny List cards so brand is attached to the image edge and subordinate, recency is the only top-right element (calendar + muted text), Save is icon-only and moved into secondary actions, state pills are muted (max 4) with a single smaller "X reports total" line, and explicit "$X off" savings lines are removed while $0.01 remains the hero price.

- **Data pipeline P0 bootstrap (Jan 10):** Added `scripts/validate-scrape-json.ts` to normalize and validate raw scrape JSON (SKU validation, field presence stats, cleaned output to `.local/`), and wired npm scripts for `export:pennycentral` (existing export script runner) and `validate:scrape`.

- **Data pipeline P0 continue (Jan 10):** Added `scripts/scrape-to-enrichment-csv.ts` (fill-blanks-only CSV from cleaned scrape + current enrichment) and `scripts/enrichment-diff.ts` (Markdown diff summary). Wired npm scripts: `convert:scrape`, `diff:enrichment`.

- **Penny List card tightening + trust soften (Jan 10):** Reduced card padding, image size to 64px, smaller SKU chip, inline info-style trust row, compressed primary/secondary action heights; submit-find enrichment lookup now skips when mocks are minimal and only attaches enrichment fields when present (no null payload clutter).

- **Penny List CTA tuned to moderate blue (Jan 10):** Kept brass/gold accents for small badges and green for success only, but moved the primary CTA to a moderate blue (light + dark) so it no longer competes with gold/brass; Penny List card hierarchy updated (72x72 image, SKU pill, reduced $0.01 dominance, trust row prominence, savings not green) and green glow removed from list cards.

- **Penny List thumbnail image parity fix (Jan 10):** Fixed an image resolution divergence where list cards could show a generic/placeholder thumbnail while SKU pages showed the correct product image; list cards now use a reliable THD `-64_400` thumbnail variant helper instead of generating `-64_300` URLs.

- **Penny List HD link fix (Jan 10):** Fixed a UI parity bug where the Penny List "Hot Right Now" cards were missing the Home Depot link even though SKU pages had it; Hot cards now render a Home Depot link using the same fallback URL builder as SKU pages, and a Playwright assertion covers it.

- **Guide visual upgrade (Jan 09):** Rewrote `/guide` meta description to match actual search queries ("Find Home Depot penny items in 5 minutes..."); added Section II-B (Visual Label Recognition) with 6 real label photos + full clearance cycle example; added Section II-C (Overhead Hunting) with wide/close overhead photos + Zebra scan risk warning; added Section III-A (How to Verify Penny Status) with step-by-step "Right Way" vs. "Wrong Way" + self-checkout tactics; updated Section IV to note clearance endcaps being phased out; added strong conversion CTA section linking to `/penny-list` and `/report-find`. Expected impact: CTR from 0.39% → 2-3% within 2-3 weeks.

- **Returning users nudge (Jan 08):** Added a small, dismissible “Bookmark this page” banner on `/penny-list` (shows after scroll or ~20s, then stays dismissed) to increase repeat visits; updated `scripts/ai-proof.ts` to be more resilient when capturing Playwright screenshots.

- **Image URL normalization (Jan 08):** Standardized all product image URLs to -64_600.jpg in database (canonical source). Components downconvert at display time: SKU pages use 600px (full-size, ~60-80 KB), related items cards use 400px (~40-60 KB), Penny List thumbnails use 300px (~20-30 KB). Strategy balances quality with bandwidth efficiency. Script `normalize-image-urls.ts` normalizes DB; removed brand duplication from SKU page titles; enlarged SKU page image area; moved related items higher on page.

- **SEO intent landing pages (Jan 08):** Added `/home-depot-penny-items`, `/home-depot-penny-list`, and `/how-to-find-penny-items` and included them in the sitemap to target high-intent keyword phrases and funnel to `/guide` + `/penny-list`.

- **Homepage freshness (Jan 06):** `/` now revalidates every 5 minutes so "Today's Finds" reflects Supabase enrichment fixes without redeploys.

- **Thumbnail reliability (Jan 08):** Standardized thumbnails to the more reliable Home Depot `-64_400` variant (the `-64_300` variant is not consistently available and can cause 404s/blank images).

- **Penny List thumbnail fallback (Jan 06):** If a THD image request fails, Penny List thumbnails fall back to `-64_1000` automatically so cards don't show blank images.

- **Vercel analytics fail-safe (Jan 06):** Vercel Web Analytics now enables automatically on Vercel production unless explicitly disabled (`NEXT_PUBLIC_ANALYTICS_ENABLED=false`), avoiding silent drops when `NEXT_PUBLIC_ANALYTICS_PROVIDER` is unset/mismatched.

- **Barcode modal reliability (Jan 06):** Barcode rendering now validates UPC-A/EAN-13 check digits and falls back to `CODE128` when invalid, preventing blank barcode boxes.

- **Penny List audit counts (Jan 06):** Added `npm run penny:count` (`scripts/print-penny-list-count.ts`) to print report vs. SKU counts and explain "imported history looks recent" (timestamp) vs. true last-seen (purchase_date).

- **Card view parity + shared UI (Jan 05):** Extracted shared `StateBreakdownSheet` and `PennyListActionRow`, centralized Line A/B formatting helpers, and updated card/table to use the shared components with lastSeenAt + state spread.

- **Purchase date parsing resilience (Jan 05):** Added a `parsePurchaseDateValue` helper so both `pickBestDate` and `pickLastSeenDate` treat timestamp-like `purchase_date` strings as valid dates instead of falling back to the submission `timestamp`.

- **Barcode modal stability (Jan 05):** Barcode modal now picks `UPC`, `EAN13`, or `CODE128` based on the UPC length so `JsBarcode` can draw bars for every SKU rather than silently failing on 13-digit values.

- **Penny List "Last seen" precedence (Jan 05):** Added server-side `lastSeenAt` (purchase_date when valid and not future, else report timestamp) and table Line A now uses it (fallback to `dateAdded`).

- **Penny List date/sort consistency (Jan 05):** Aligned SSR/API/client defaults to 30d, standardized window label to `(30d)`, made Newest/Oldest sort follow `lastSeenAt`, and tightened date-window filtering to “last seen” semantics (purchase_date when present, else timestamp).

- **Penny List card redesign spec alignment (Jan 05):** Updated `.ai/PENNY-LIST-REDESIGN.md` to require SKU on card face, Home Depot action button, report counts in Line B with window label, and window consistency across card + state sheet. Guardrails updated to allow dense metadata text and card padding exceptions.

- **Unified green brand (Jan 03):** Light mode CTAs updated from slate blue to forest green (#15803d), matching dark mode's Technical Grid emerald green (#43A047). Both modes now use consistent "savings green" psychology (research: 33% higher trust in savings contexts). All contrast ratios meet WCAG AAA. Documentation synced.

- **Reduced editor hint noise (Jan 03):** Disabled VS Code webhint diagnostics in `.vscode/settings.json` to avoid TSX false-positives; rely on repo verification (`check-axe`/Playwright) for real accessibility regressions.

- **Supabase enrichment import (Jan 03):** Imported `scripts/GHETTO_SCRAPER/penny_scrape_2026-01-03T11-15-29-344Z.json` into `penny_item_enrichment` (processed 100; skipped 7 `$0.00` rows).

- **Bulk enrichment safety (Jan 03):** `scripts/bulk-enrich.ts` now accepts Tampermonkey scrape JSON directly, defaults to fill-blanks-only merge, and hard-skips explicit `$0.00` retail prices.

- **SerpApi fill-blanks enrichment (Jan 03):** `scripts/serpapi-enrich.ts` now enriches when any core fields are missing (not "image-only"), upserts fill-blanks-only by default (`--force` to overwrite), and avoids wiping fields on `not_found`.

- **SerpApi Actions budget (Jan 03):** `.github/workflows/serpapi-enrich.yml` runs every 6 hours with default `--limit 1` (includes `--retry`) to stay within the 250 searches/mo free tier.

- **Docs alignment (Jan 03):** `README.md`, `docs/CROWDSOURCE-SYSTEM.md`, and `docs/SCRAPING_COSTS.md` now reflect the current Supabase-based system (Google Sheets is legacy/deprecated).

- **Playwright e2e reliability (Jan 03):** `playwright.config.ts` runs Playwright against `next start` (avoids `.next/dev/lock` conflicts when `next dev` is already running on port 3001).

- **Scraper controller price-aware skipping (Jan 03):** `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html` now only skips items that already have a valid `retailPrice`, and upgrades existing entries when a new scrape finally yields a price.

- **Scraper controller pause/stop + exports (Jan 03):** Added Pause/Resume + Stop Session controls, kept main JSON export + failures JSON export, and ensured saved entries include a canonical Home Depot URL.

- **Tampermonkey retries restored + failure export (Jan 03):** Userscript now redirects `/s/` searches to PDPs, retries when data is missing, reports bot/region blocks, and the controller gained a single "Export Failures JSON" button.

- **Scraper controller HTML hint cleanup (Jan 03):** Added `lang`/`charset`/`viewport`, labeled form controls, and removed inline button styles in `scripts/GHETTO_SCRAPER/pennycentral_scraper_controller_4to10s_resilient_retry.html` to reduce VS Code Edge Tools noise.

- **OCE protocol + proof workflow (Jan 02):** Embedded an "Objective Collaborative Engineering" protocol into `.ai/CONTRACT.md` + `.ai/DECISION_RIGHTS.md` + `.ai/USAGE.md`, added VS Code tasks for `ai:*`, and fixed `npm run ai:verify` to reuse the running dev server on port 3001 (avoids `.next/dev/lock` conflicts).

- **Penny List card density (Jan 01):** Tightened mobile card layout, kept identifiers always visible, added UPC block, compacted state pills, and simplified actions while preserving Save/Report/Share/HD links.

- **Penny List mobile action bar (Jan 02):** Added a mobile-only bottom action bar on `/penny-list` with filter + sort bottom sheets, safe-area padding, and extra results padding so cards stay visible; desktop filters remain unchanged.

- **Penny List hydration mismatch (Jan 02):** Suppressed a search-input hydration warning on `/penny-list`, eliminating Playwright console errors in dev.

- **Auto-enrich guardrails (Jan 01):** Cron normalizes brand/name, uses canonical HD URL, and skips upserts when `item_name` is missing; added scrape tooling (`scripts/transform-scrape.ts`, `scripts/analyze-scrape-coverage.ts`) and ignore rules for local scrape artifacts.

- **Proxy migration (Dec 31):** `middleware.ts` renamed to `proxy.ts` with `proxy` export (Next 16 deprecation resolved).

- **OTel warning fix (Dec 31):** npm `overrides` pin `import-in-the-middle@2.0.1` and `require-in-the-middle@8.0.1`, silencing Turbopack warnings.

- **State pages (Dec 31):** Added `app/pennies/[state]/page.tsx` + `lib/states.ts`; sitemap includes all state slugs; pages filter 6m penny finds by state.

- **Guide timeline (Dec 31):** Added clearance cadence timeline + tag examples to `components/GuideContent.tsx`.

- **Penny list API (Dec 31):** Date-window filtering at DB level across `timestamp`/`purchase_date` for 1m-24m windows; response shape unchanged.

- **Homepage (Dec 31):** "Today's Finds" module below hero using 48h `getRecentFinds`; mobile horizontal scroll, desktop grid, state badges, relative time, CTA to `/penny-list`.

---

## Recent History (Last 30 Days)

**Dec 30:** RLS Migration - Applied `008_apply_penny_list_rls.sql`, created `penny_list_public` view, enabled RLS on tables. Performance + SEO + RLS PRs merged (#63, #64, #65).

**Dec 28-29:** Penny List polish - identifiers row, grid density, thumbnail styling, card typography hierarchy, SKU page polish. Auth + Personal Lists + Sharing (PR-3): magic-link login, save to list, list detail with toggles, public sharing.

**Dec 27:** PR-1 and PR-2 complete - SKU copy UX with tap-to-copy, Report Find prefill + validation. MCP availability + env wiring. 6-PR roadmap established.

**Dec 26:** Documentation cleanup (deleted 11 deprecated files), agent system created (AGENT_POOL.md, ORCHESTRATION.md), AI automation scripts complete (`ai:doctor`, `ai:verify`, `ai:proof`), screenshot automation, pre-commit hooks (security:scan, lint:colors).

**Dec 25:** Supabase migration complete - `Penny List` table with server-side pagination, enrichment overlay (`penny_item_enrichment`), RLS hardening plan. All 4 quality gates passing.

**Dec 23-24:** OG image redesign - switched to static PNGs for Facebook reliability, left-aligned layout, coin quality improvements, kept under 1 MB Vercel edge function cap.

**Dec 21:** Dynamic OG generation switched to hybrid static + dynamic approach (Playwright screenshots for main pages, dynamic for SKU pages with 24hr caching).

**Dec 19:** Verified Pennies feature removed (privacy) - `/verified-pennies` redirects to `/penny-list`, SKU pages derive from Penny List only.

---

## Key Metrics

- **Live:** https://www.pennycentral.com

- **Supabase:** Project `supabase-red-river` (ref: `djtejotbcnzzjfsogzlc`)

- **Tech:** Next.js 16 + TypeScript, Tailwind (custom tokens), React-Leaflet, Vercel

- **Quality:** All gates green (lint/build/unit/e2e)

---

**For full history:** See `archive/state-history/STATE_2024-12-01_to_2025-01-03.md`
