# Session Log (Recent 3 Sessions)

**Auto-trim:** Only the 3 most recent sessions are kept here. Git history preserves everything.

---

## 2026-02-13 - Codex - Canonical Transparency Hardening (Approval-Risk Reduction)

**Goal:** Strengthen legitimate Google-policy readiness by removing trust-route canonical drift and adding regression coverage around legacy `/support` behavior.

**Status:** ✅ Completed.

### Changes

- Updated sitemap canonical trust route:
  - `app/sitemap.ts` now lists `/transparency` instead of legacy `/support`.
- Increased regression coverage for critical route behavior:
  - `tests/smoke-critical.spec.ts` now asserts `/support` resolves to `/transparency` and loads the expected transparency heading.
- Locked ad-policy exclusion behavior in tests:
  - `tests/ads-route-eligibility.test.ts` now explicitly asserts both `/support` and `/transparency` are ad-excluded.
- Synced top-level docs with current IA:
  - `README.md` now references Transparency/Funding on `/transparency` (instead of support/cashback wording).

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅ (4/4 after smoke coverage expansion)
- `npm run check:docs-governance` ✅

---

## 2026-02-13 - Codex - AdSense Compliance Refactor (Support/Legal + Retailer Link Hardening)

**Goal:** Execute a high-confidence compliance pass to remove solicitation-policy risk signals and harden legal/trust surfaces for monetization review.

**Status:** ✅ Completed.

### Changes

- **Support-page solicitation purge + disclosure replacement:**
  - Removed PayPal/donation solicitation logic and `paypal.me/cadegallen` fallback from `app/support/page.tsx`.
  - Added the requested formal funding/editorial disclosure section (`monetization-transparency`) with exact required copy structure.
- **Legal/privacy compliance updates:**
  - Updated `app/privacy-policy/page.tsx`:
    - renamed cookies section to `Cookies and Data Collection`
    - injected 2026 Privacy Sandbox/Topics API + GPC opt-out text
    - added Amazon Associate disclosure
  - Updated `app/terms-of-service/page.tsx` with:
    - Amazon Associate disclosure
    - `Cookies and Data Collection` compliance section (same required text)
- **Footer legal IA refactor:**
  - Updated `components/footer.tsx` Legal area to a single-row link set:
    - `Privacy Policy | Terms of Service | Contact`
  - Removed standalone footer link to `California Privacy (CCPA)` while keeping CCPA content in privacy policy.
- **About + Support schema and copy updates:**
  - Injected requested `WebPage` JSON-LD block into:
    - `app/about/page.tsx`
    - `app/support/page.tsx`
  - Replaced About member-count phrasing with `tens of thousands of members` to avoid stale-count review flags.
- **Retailer outbound link rel hardening:**
  - Applied `rel="nofollow sponsored noopener noreferrer"` on audited retailer outbound links:
    - `/go/rakuten` links
    - Home Depot product links (`penny-list cards/action row`, `/sku/[sku]`, shared lists)
    - Home Depot store-page links (`/store-finder`, `components/store-map.tsx`)
- **Donation-token cleanup:**
  - Removed legacy `donation_click` event from `lib/analytics.ts`.
  - Replaced non-monetization `donation` wording in `app/inside-scoop/page.tsx` to satisfy zero-token scan requirement.
  - Removed deprecated `DONATION_URL` from `lib/constants.ts`.

### Verification

- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Playwright proof bundle ✅
  - `npm run ai:proof -- test /about /support /privacy-policy /terms-of-service`
  - `reports/proof/2026-02-13T20-27-13/`
  - `reports/proof/2026-02-13T20-27-13/console-errors.txt` (`No console errors detected`)
- Compliance scans ✅
  - `rg -ni --hidden --glob '!archive/**' 'donation' app components lib` (no matches)
  - `rg -ni --hidden --glob '!archive/**' 'paypal|support the creator|buy me a coffee|fund the site' app components lib` (no matches)
  - `rg -n --hidden --glob '!archive/**' '[A-Za-z0-9._%+-]+@pennycentral\\.com' app components` (contact-only on site surfaces)
  - `rg -ni --no-messages 'donation' .next/server/app/support .next/server/app/privacy-policy .next/server/app/about .next/server/app/terms-of-service .next/server/app/inside-scoop .next/server/chunks` (no matches)

---

## 2026-02-13 - Codex - Product Truth Hardening (Trip Tracker purge + member-count governance lock)

**Goal:** Remove active Trip Tracker/member-count drift and enforce guardrails so stale claims fail before merge.

**Status:** ✅ Completed.

### Changes

- Updated member-count source of truth in `lib/constants.ts`:
  - `COMMUNITY_MEMBER_COUNT = 64000`
  - `COMMUNITY_MEMBER_COUNT_LAST_VERIFIED = "2026-02-13"`
  - `COMMUNITY_MEMBER_COUNT_DISPLAY` and `MEMBER_COUNT_BADGE_TEXT` now derive from `COMMUNITY_MEMBER_COUNT`
  - `MEMBER_COUNT_RAW` now aliases the canonical raw count
- Removed deprecated Trip Tracker references from active docs/tooling:
  - `README.md`
  - `SKILLS.md`
  - `.ai/DECISION_RIGHTS.md`
  - `.ai/CONTEXT.md`
  - `.ai/GROWTH_STRATEGY.md`
  - `scripts/run-audit.ps1` (`/trip-tracker` -> `/report-find`)
- Updated active member-count copy to current floor + explicit date where policy requires:
  - `README.md`
  - `.ai/CONTEXT.md`
  - `.ai/GROWTH_STRATEGY.md`
  - `.ai/topics/PROJECT_IDENTITY.md`
- Extended governance drift check in `scripts/check-doc-governance-drift.mjs`:
  - Fails on Trip Tracker tokens in active docs/tooling
  - Fails on stale count tokens (`50K+`, `50,000+`, `62K+`, `62,000+`) in active docs/tooling
  - Parses `lib/constants.ts` and requires README to include current display count and matching `as of <date>` freshness phrase
- Scope guard artifact generated:
  - `.ai/_tmp/scope-guard-product-truth-hardening.md`
- Follow-up AI navigation hardening (same day) to reduce agent lookup waste:
  - `README.md`: corrected canonical doc paths (`.ai/CONTRACT.md`, `.ai/GROWTH_STRATEGY.md`, `.ai/SESSION_LOG.md`), removed dead references, added `docs/skills/README.md` as fast entrypoint, and aligned support/cashback route language to `/support`.
  - `SKILLS.md`: added "Agent Fast Path" read order, updated monetization domain paths to live files/routes, and aligned verification commands to `verify:fast`/`e2e:smoke`/`e2e:full`.
  - `AGENTS.md`: clarified skills entrypoint as `docs/skills/README.md`, added explicit location map section, and fixed learning-loop write target to `.ai/LEARNINGS.md`.
  - Targeted path-existence audit for backticked references in these three files now resolves cleanly (no missing file-path refs).
- Follow-up stale affiliate/cashback cleanup (same day) to remove legacy BeFrugal path drift:
  - Updated active wording in `.ai/CONTEXT.md` and `.ai/GROWTH_STRATEGY.md` from BeFrugal-specific claims to current Rakuten/support language.
  - Updated active QA/audit targets to current routes:
    - `.ai/TESTING_CHECKLIST.md` (`/support` + `/go/rakuten`)
    - `scripts/run-audit.ps1` (`/cashback` -> `/support`)
    - `tests/live/console.spec.ts` (`/cashback` -> `/support`)
  - Extended `scripts/check-doc-governance-drift.mjs` to fail on stale affiliate/cashback tokens (`app/cashback/`, `SupportAndCashbackCard.tsx`, `**Cashback (Affiliate)**`, legacy BeFrugal affiliate-line copy) in active docs/tooling.

### Verification

- `npm run check:docs-governance` ✅
- `npm run verify:fast` ✅
- `npm run e2e:smoke` ✅
- Targeted drift greps ✅
  - `rg -n -i "trip-tracker|trip tracker|/trip-tracker|trip_tracker" README.md SKILLS.md SCRIPTS-AND-GATES.txt scripts/run-audit.ps1 .ai/DECISION_RIGHTS.md .ai/CONTEXT.md .ai/GROWTH_STRATEGY.md` (no matches)
  - `rg -n "50,000\\+|50K\\+|62,000\\+|62K\\+" README.md .ai/CONTEXT.md .ai/GROWTH_STRATEGY.md .ai/topics/PROJECT_IDENTITY.md` (no matches)
- UI proof + console check ✅
  - `reports/proof/2026-02-13T13-25-45-product-truth-hardening/`
  - `reports/proof/2026-02-13T13-25-45-product-truth-hardening/console-check.json`
  - Includes light/dark screenshots for `/`, `/about`, `/support`

---
