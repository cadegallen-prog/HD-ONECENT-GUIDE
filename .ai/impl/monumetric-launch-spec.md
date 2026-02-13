# Monumetric Launch Spec (Decision-Complete, Planning Only)

**Status:** IMPLEMENTED (Option B runtime policy active; partner tag wiring pending)  
**Created:** 2026-02-11  
**Last updated:** 2026-02-13  
**Owner:** Cade (founder)

---

## 0a) Founder Decision Override (2026-02-12)

- **Decision:** Adopt **Option B**: provider-managed ad placement by default, with only hard safety exclusions enforced in-app.
- **Why:** Avoid conflicts with Monumetric optimization logic and prevent under-delivery caused by app-side route/inventory over-constraints.
- **Operational implication:** Route-level matrix-driven inventory forcing (`allow/restrict + fixed unit map`) is deprecated as a runtime control strategy.
- **Still enforced in code:** Hard exclusions remain for trust/safety/system surfaces (`/report-find`, legal/support/auth/internal/API/redirect endpoints).
- **Layout implication:** Sticky reserve/prompt pause behavior remains available as optional tooling, but is **disabled by default** unless explicitly re-enabled after partner guidance.

This override supersedes strict route-inventory forcing assumptions in the sections below while preserving trust-loop protection.

---

## 0) Alignment Gate (Completed)

- **GOAL:** Finalize a decision-complete Monumetric launch spec before coding.
- **WHY:** Monetization decisions were fragmented; this locks route policy, UX behavior, and rollback rules before implementation.
- **DONE MEANS:** Route matrix, `/penny-list` mobile utility replacement spec, measurement/rollback framework, Monumetric handoff message, and file-level implementation plan are all finalized.
- **NOT DOING:** No runtime code implementation, no dependency changes, no ad-tag insertion in this task.
- **CONSTRAINTS:** Protect trust loop, keep `/report-find` low-friction, preserve mobile-first UX, no raw Tailwind palette colors, no new major infra by default.
- **ASSUMPTIONS:** Analytics window is Jan 14, 2026 through Feb 10, 2026; founder-locked decisions below are final for launch.
- **CHALLENGES:** Guide analytics co-mingling (legacy `/guide/*` + chapterized routes), and GA4 acquisition pollution risk from custom event param key `source`.

---

## 1) Locked Inputs (Source of Truth)

### Analytics baselines (Jan 14 to Feb 10, 2026)

- Sitewide views by device: **mobile 84.3%**, desktop 15.0%, tablet 0.8%
- `/penny-list` views by device: **mobile 81.9%**, desktop 17.1%, tablet 1.0%
- `/report-find` views by device: **mobile 60.8%**, desktop 39.0%, tablet 0.2%
- Guide cluster views by device: **mobile 86.2%**, desktop 13.1%, tablet 0.7%
- `/penny-list`: **27,963 views**, **6,031 active users**, **~104.7s avg engagement per active user**
- `/report-find`: **2,451 views**, **2,058 active users**, **~8.3s avg engagement per active user**
- Events:
  - `pwa_prompt_shown`: 3,098
  - `pwa_install_started`: 96
  - `pwa_install_accepted`: 84
  - `find_submit`: 294
  - `report_find_click`: 180
  - `home_depot_click`: 5,150

### Founder-locked launch decisions

- Prioritize **mobile bottom sticky ad** placement.
- `/penny-list` mobile utility becomes **top auto-hide** (show on up-scroll / near top).
- Mobile sticky anchor starts at **320x50**.
- During sticky test on `/penny-list` mobile, pause:
  - `PWAInstallPrompt`
  - `EmailSignupForm`
  - `PennyListPageBookmarkBanner`
- Enable **interstitial now** at **1 per user per hour**.
- **VOLT video** launch as a **guide-only pilot**.

---

## 2) Final Route Eligibility Matrix (Allow / Restrict / Exclude)

| Route / Template                                                         | Eligibility  | Launch inventory                            | Notes                                                     |
| ------------------------------------------------------------------------ | ------------ | ------------------------------------------- | --------------------------------------------------------- |
| `/`                                                                      | **Allow**    | Interstitial                                | No sticky anchor here at launch.                          |
| `/penny-list`                                                            | **Restrict** | Mobile bottom sticky (320x50), interstitial | Sticky test route; pause prompt stack during test window. |
| `/report-find`                                                           | **Exclude**  | None                                        | Keep low-friction submission flow ad-safe.                |
| `/what-are-pennies`                                                      | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/clearance-lifecycle`                                                   | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/digital-pre-hunt`                                                      | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/in-store-strategy`                                                     | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/inside-scoop`                                                          | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/facts-vs-myths`                                                        | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/faq`                                                                   | **Allow**    | In-article, interstitial, VOLT pilot        | Guide chapter route.                                      |
| `/guide`                                                                 | **Restrict** | Interstitial only                           | No VOLT on hub at launch.                                 |
| `/guide/*` legacy chapterized paths                                      | **Restrict** | Mirror canonical guide chapter policy       | Report separately due co-mingled analytics.               |
| `/sku/[sku]`                                                             | **Restrict** | Interstitial only                           | Only for index-eligible/enriched records; no sticky/VOLT. |
| `/pennies/[state]`                                                       | **Restrict** | Interstitial only                           | Utility route; no sticky/VOLT.                            |
| `/store-finder`                                                          | **Exclude**  | None                                        | Utility-first map flow.                                   |
| `/lists`, `/lists/[id]`, `/s/[token]`, `/login`, `/auth/callback`        | **Exclude**  | None                                        | Auth/saved-list surfaces.                                 |
| `/about`                                                                 | **Restrict** | Interstitial only                           | Trust page; conservative density.                         |
| `/support`                                                               | **Exclude**  | None                                        | Transparency page; keep ad-free.                          |
| `/contact`                                                               | **Exclude**  | None                                        | Utility/support route.                                    |
| `/privacy-policy`, `/terms-of-service`, `/unsubscribed`                  | **Exclude**  | None                                        | Legal/compliance/system pages.                            |
| `/go/rakuten`, `/go/befrugal`                                            | **Exclude**  | None                                        | Affiliate redirect endpoints.                             |
| `/admin/*`, `/internal-systems`, `/api/*`, `/robots.txt`, `/sitemap.xml` | **Exclude**  | None                                        | Internal/technical endpoints.                             |

---

## 3) `/penny-list` Mobile Utility Replacement Spec (Top Auto-Hide)

## Objective

Replace the current fixed bottom action bar on mobile with a top utility bar so the bottom zone is reserved for sticky ad testing while preserving fast filter/sort/report actions.

## UX behavior contract

- Mobile only (`< sm`), no desktop behavior changes.
- Utility bar renders directly under the global navbar.
- Initial state: visible.
- Auto-hide on downward scroll when all are true:
  - Current scrollY > 120
  - Downward delta >= 16px since last stable position
  - No filter/sort sheet open
- Re-show on upward scroll when either is true:
  - Upward delta >= 12px
  - scrollY <= 72
- While filter/sort sheet is open, force bar visible.
- Touch targets remain >=44x44.
- Existing actions remain unchanged: Filters, Sort, My List, Report.

## Layout contract

- Remove bottom fixed action bar container from mobile.
- Remove mobile-only bottom list padding currently used to avoid bar overlap (`pb-[calc(80px+env(safe-area-inset-bottom))]`).
- Add top offset spacing below navbar equal to utility bar height so list content never jumps.
- Reserve bottom safe area for sticky ad slot container.

## Prompt pause contract (test-only)

- While sticky test flag is on for `/penny-list` mobile:
  - Do not render `PennyListPageBookmarkBanner`
  - Do not render `EmailSignupForm`
  - Do not render `PWAInstallPrompt`
- Resume original prompt stack after sticky test ends.

## Accessibility + safety

- Preserve keyboard/focus order and visible focus rings.
- Ensure filter/sort sheets keep current ARIA dialog semantics.
- Respect `prefers-reduced-motion` for bar hide/show transitions.

---

## 4) Measurement + Rollback Framework (Balanced Guardrail)

## 4.1 Baseline snapshot (pre-launch window)

- `/penny-list` mobile share: 81.9%
- `/report-find` mobile share: 60.8%
- `/penny-list` avg engagement per active: 104.7s
- `/report-find` avg engagement per active: 8.3s
- `find_submit / report-find views` baseline: 294 / 2451 = **12.0%**
- `report_find_click / penny-list views` baseline: 180 / 27963 = **0.64%**

## 4.2 Required instrumentation hygiene before experiment readouts

- Stop emitting raw GA4 event param key `source` for UI attribution.
- Replace with `ui_source` (or `placement`) for custom events.
- Add defensive sanitizer in analytics wrapper to remap blocked acquisition-like keys:
  - `source -> pc_source`
  - `medium -> pc_medium`
  - `campaign -> pc_campaign`
- Keep this migration in place before reading monetization experiment outcomes.

## 4.3 Launch experiment windows

- **Window A (baseline):** existing Jan 14-Feb 10 metrics.
- **Window B (test):** 7 full days after sticky launch.
- **Window C (stabilization):** additional 7 days after any rollback/re-tune.

## 4.4 Decision metrics

- **Primary lift metric:** mobile `/penny-list` session RPM / revenue per session.
- **Core-loop guardrails:**
  - `find_submit / report-find views`
  - `report_find_click / penny-list views`
  - `/penny-list` avg engagement per active user
  - `/penny-list` bounce rate

## 4.5 Rollback triggers

- **Hard rollback (same-day):**
  - `find_submit / report-find views` drops >=20% vs baseline for 2 consecutive days
  - `/penny-list` avg engagement per active drops below 90s for 2 consecutive days
  - User-facing breakage in filter/sort/report flows on mobile
- **Soft rollback (tune, do not fully disable):**
  - `report_find_click / penny-list views` drops 10-20% vs baseline
  - `/penny-list` bounce rate rises by >=5 absolute points
- **No-lift rollback (end of Window B):**
  - If monetization lift is negligible and any guardrail worsens, disable sticky and restore original prompt stack.

## 4.6 Guide analytics caveat handling

- Report guide performance in two buckets:
  - Canonical chapter routes (`/what-are-pennies`, etc.)
  - Legacy `/guide/*` chapterized routes
- Do not merge these buckets when making VOLT pilot keep/kill decisions.

---

## 5) Monumetric-Ready Handoff Message (Copy/Paste)

Subject: PennyCentral launch configuration request (mobile sticky + interstitial + guide VOLT)

Hello Monumetric team,

We are ready to launch with a conservative, UX-safe setup and need line-item placement confirmation.

Site context (Jan 14-Feb 10, 2026):

- Sitewide traffic is mobile-first (84.3% mobile).
- `/penny-list` is 81.9% mobile and is our primary utility route.
- `/report-find` is a protected low-friction submission route.

Requested launch setup:

1. Mobile bottom sticky anchor on `/penny-list` only, starting at 320x50.
2. Interstitial enabled at 1 impression per user per hour.
3. VOLT video pilot only on guide chapter routes:
   - `/what-are-pennies`
   - `/clearance-lifecycle`
   - `/digital-pre-hunt`
   - `/in-store-strategy`
   - `/inside-scoop`
   - `/facts-vs-myths`
   - `/faq`
4. Exclusions (no ads):
   - `/report-find`
   - `/privacy-policy`, `/terms-of-service`, `/contact`, `/support`
   - `/store-finder`
   - auth/list routes (`/login`, `/lists`, `/lists/[id]`, `/s/[token]`, `/auth/callback`)
   - technical/internal routes (`/api/*`, `/admin/*`, `/robots.txt`, `/sitemap.xml`)

UX guardrails on our side:

- We are moving `/penny-list` mobile utility actions to a top auto-hide bar.
- During sticky test, we will pause on-page prompt stack (`PWAInstallPrompt`, `EmailSignupForm`, `PennyListPageBookmarkBanner`) to isolate impact cleanly.
- We are running strict rollback thresholds tied to submission and retention guardrails.

Please confirm:

- Required ad unit names/IDs and placement mapping for the above routes.
- Any script/config prerequisites specific to interstitial cap and VOLT guide-only targeting.
- Recommended minimum test duration before optimization changes.

Thanks,
Cade / PennyCentral

---

## 6) Implementation-Ready File-Level Plan (No Code Yet)

## Phase 1: Analytics hygiene + eligibility config

- `lib/analytics.ts`
  - Add reserved-key sanitizer and normalize attribution parameter names.
- `components/penny-list-action-row.tsx`
- `components/penny-list-card.tsx`
- `components/navbar.tsx`
- `components/share-button.tsx`
- `components/copy-sku-button.tsx`
- `app/page.tsx`
- `app/sku/[sku]/page.tsx`
  - Replace `source` event params with `ui_source` (or `placement`).
- `lib/ads/route-eligibility.ts` (new)
  - Canonical allow/restrict/exclude matrix and launch inventory flags.
- `lib/ads/launch-config.ts` (new)
  - Sticky/interstitial/VOLT feature flags and frequency settings.

## Phase 2: `/penny-list` mobile utility migration + sticky slot

- `components/penny-list-client.tsx`
  - Remove bottom mobile action bar.
  - Add top auto-hide utility bar behavior.
  - Gate prompt stack during sticky test.
  - Keep filter/sort sheets fully functional.
- `components/penny-list-mobile-utility-bar.tsx` (new)
  - Isolated top utility bar UI + behavior.
- `components/ads/mobile-sticky-anchor.tsx` (new)
  - Sticky container with safe-area handling and controlled collapse behavior.
- `components/pwa-install-prompt.tsx`
- `components/email-signup-form.tsx`
- `components/penny-list-page-bookmark-banner.tsx`
  - Accept optional `enabled` prop, or gate centrally in parent.

## Phase 3: Route-level ad application

- `app/page.tsx`
- `app/penny-list/page.tsx`
- `app/guide/page.tsx`
- `app/what-are-pennies/page.tsx`
- `app/clearance-lifecycle/page.tsx`
- `app/digital-pre-hunt/page.tsx`
- `app/in-store-strategy/page.tsx`
- `app/inside-scoop/page.tsx`
- `app/facts-vs-myths/page.tsx`
- `app/faq/page.tsx`
- `app/sku/[sku]/page.tsx`
- `app/pennies/[state]/page.tsx`
  - Apply matrix-driven slots only where eligible.

## Phase 4: Measurement + rollback operations

- `scripts/monumetric-guardrail-report.ts` (new)
  - Automated guardrail check report against baseline thresholds.
- `.ai/topics/ANALYTICS_CONTRACT.md`
  - Add acquisition-pollution safety rules and event param naming standard.
- `.ai/topics/SITE_MONETIZATION_CURRENT.md`
  - Link runtime rollout status to this plan.

## Verification contract for implementation phase (later)

- `npm run verify:fast` always
- `npm run e2e:smoke` (route/form/API/UI changes)
- Playwright screenshots required for `/penny-list` mobile utility change
- Update `.ai/SESSION_LOG.md` + `.ai/STATE.md` + handoff block after implementation

---

## 7) Drift Check Snapshot (2026-02-11)

- Naming collisions (`My List` vs `My Lists`): none blocking in active UI code.
- Risky active-route matching (`includes(...)`): none detected in scan.
- Touch-target regressions (<44px hints): none detected in scan.
- Historical icon-language references in legacy docs exist; not a launch blocker for this monetization spec.

---

## 8) Out of Scope for This Plan

- Actual Monumetric script insertion and ad slot rendering code.
- Non-monetization feature work.
- New database tables/routes/dependencies.
