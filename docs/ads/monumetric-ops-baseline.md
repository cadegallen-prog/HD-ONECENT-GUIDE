# Monumetric Operations Baseline

**Last updated:** 2026-03-07
**Owner:** Founder (Cade)
**Purpose:** Canonical implementation baseline so future agents do not re-introduce March 2026 ad regressions.

---

## 1) What changed and why

### Fixed regressions (production)

- `fcc185e` - penny list now uses the real in-content UUID (`39b97adf-dc3e-4795-b4a4-39f0da3c68dd`) instead of a placeholder.
- `ea5d60f` - removed visual box chrome around manual in-content shells.
- `7d45fb9` - improved Monumetric refresh behavior on Penny List route navigation.
- `0c3a74b` - moved Monumetric script loading behind route eligibility (excluded routes no longer run ad runtime).
- `8ee66eb` - removed residual black ad gap and fixed pagination scroll behavior.

### Root causes of prior failures

- Penny List had a fake slot ID (`pc-penny-list-in-content`) so Monumetric could not fill it.
- Monumetric script previously loaded globally, so excluded pages could still receive provider-managed ad artifacts.
- Manual shell styling created avoidable UI noise around in-content placements.

---

## 2) Current architecture (do not drift)

### Provider-managed placements (Monumetric controls)

- Header in-screen
- Footer/leaderboard in-screen
- Sidebar/pillar placements
- Fill behavior and refresh cadence for provider-managed units

These are not controlled by app-level env vars per slot. They are controlled by Monumetric account config and demand.

### App-managed responsibilities

- Global on/off switch: `NEXT_PUBLIC_MONUMETRIC_ENABLED`
- Route eligibility + hard exclusions
- SPA route lifecycle coordination (refresh/requeue behavior)
- Manual in-content slot insertion where needed (Penny List and selected guide surfaces)

### Why in-content differs

- In-content is the one placement family that may need an explicit slot injection in app code when Monumetric auto-insertion selectors do not match page structure.
- Footer/header/sidebar/leaderboard do not require manual containers in app code.

---

## 3) Route policy baseline

### Excluded routes (must stay ad-free)

- `/report-find`
- `/transparency`
- `/privacy-policy`
- `/terms-of-service`
- `/do-not-sell-or-share`
- `/unsubscribed`
- `/auth/callback`
- `/robots.txt`
- `/sitemap.xml`
- `/lists/*`, `/s/*`, `/api/*`, `/admin/*`

### Eligible routes

- All non-excluded routes.

Script gate behavior:

- Eligible route: inject/load Monumetric script.
- Excluded route: stop refresh best-effort and remove ad nodes.

---

## 4) Non-negotiable guardrails

- Do not add manual containers for provider-managed header/footer/sidebar/pillar units.
- Do not duplicate the same slot UUID multiple times on one page with identical DOM IDs.
- Do not attempt to solve provider-managed CLS with app CSS hacks on provider DOM.
- Do not change refresh interval assumptions in app code without Monumetric confirmation.
- Do not remove route exclusions for trust/safety/system routes unless founder approves.

---

## 5) Known current behavior

- Penny List in-content is now functional.
- Ads refresh behavior is materially better than pre-fix state.
- Desktop footer/sidebar may still jump due to provider-managed fill/creative-size variance.
- Mobile/desktop sticky header/footer visibility is not guaranteed by app code and depends on provider config + fill.

---

## 6) Verification runbook (post-deploy)

Run on production in both desktop and mobile viewports:

1. Eligible pages (`/`, `/guide`, `/penny-list`) should show ad iframes.
2. Excluded pages (`/report-find`, policy pages) should show no ad iframes.
3. `pc-monumetric-delivery-script` should be present only on eligible routes.
4. Penny List should keep exactly one intentional in-content slot wrapper and should not render empty chrome.

If step 1 fails on specific placements (header/footer/sidebar), escalate to Monumetric first; that is provider-side enablement/fill, not app-side slot wiring.

---

## 7) Source of truth files

- `lib/ads/launch-config.ts`
- `lib/ads/route-eligibility.ts`
- `components/ads/monumetric-script-gate.tsx`
- `lib/ads/monumetric-runtime.ts`
- `components/ads/monumetric-in-content-slot.tsx`
- `lib/ads/monumetric-slot-shell.tsx`
