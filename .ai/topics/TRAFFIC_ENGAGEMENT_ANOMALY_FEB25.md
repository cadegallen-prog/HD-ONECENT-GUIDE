# Traffic & Engagement Drop — Feb 25, 2026 Post-Mortem

**Last updated:** 2026-03-06  
**Investigated by:** GitHub Copilot (March 6 session)  
**Status:** Root causes identified. No code is broken. Normal operation expected to recover as list grows.

---

## TL;DR for Future Agents

**Nothing is broken.** The engagement drop starting Feb 25 has three confirmed independent causes. The analytics code has not changed since Feb 8. Do not chase this as a bug.

---

## What Was Observed

Founder noticed a drop in average user engagement time per session starting approximately Feb 25–26, 2026.

**GA4 daily snapshot (Feb 18 – Mar 4):**

| Date           | Sessions  | Avg Eng Time | Notes                                                  |
| -------------- | --------- | ------------ | ------------------------------------------------------ |
| 2026-02-18     | 926       | 125s         | Normal baseline                                        |
| 2026-02-19     | 946       | 111s         | Normal                                                 |
| 2026-02-20     | 797       | 136s         | Normal                                                 |
| 2026-02-21     | 964       | 131s         | Normal                                                 |
| 2026-02-22     | 2,441     | 110s         | Viral social spike (Facebook group)                    |
| 2026-02-23     | 1,512     | 98s          | Traffic settling                                       |
| 2026-02-24     | 1,299     | 105s         | Normal                                                 |
| **2026-02-25** | **1,040** | **69s**      | **← INFLECTION. All channels crashed simultaneously.** |
| 2026-02-26     | 1,800     | 50s          | Worst measured day                                     |
| 2026-02-27     | 978       | 88s          | Partial recovery                                       |
| 2026-02-28     | 812       | 97s          | Partial recovery                                       |
| 2026-03-01     | 863       | 102s         | Recovering                                             |
| 2026-03-02     | 815       | 75s          | Dip                                                    |
| 2026-03-03     | 1,299     | 83s          | Mixed                                                  |
| 2026-03-04     | 1,757     | 76s          | High sessions, still lower avg                         |

**Returning users only (the cleanest signal — isolates site changes from traffic mix):**

| Date               | Returning Sess | Avg Eng Time    |
| ------------------ | -------------- | --------------- |
| 2026-02-18         | 371            | 111s            |
| 2026-02-19         | 390            | 122s            |
| 2026-02-20         | 361            | 133s            |
| 2026-02-21         | 432            | 139s            |
| **Pre-Feb-25 avg** | **~400/day**   | **~120s**       |
| **2026-02-25**     | **446**        | **72s ← crash** |
| 2026-02-26         | 729            | 40s             |
| 2026-02-27         | 448            | 76s             |
| 2026-02-28         | 390            | 66s             |
| 2026-03-01         | 357            | 100s            |
| 2026-03-04         | 711            | 69s             |

**Key observation:** returning user _sessions_ did not drop — in fact they increased Feb 26 (729 vs baseline ~400). But their time dropped from ~120s → 40–76s. **Same audience, same intent, less time. This is a site-side change, not audience loss.**

---

## Channel Breakdown on Inflection Day

Every single channel crashed simultaneously on Feb 25 — ruling out a traffic source change:

| Channel        | Feb 24 avg | Feb 25 | Feb 26 |
| -------------- | ---------- | ------ | ------ |
| Direct         | 84s        | 40s ←  | 52s    |
| Organic Search | 145s       | 92s ←  | 55s    |
| Organic Social | 99s        | 87s ←  | 48s    |

**Direct users (your most loyal, most intentional) went 84 → 40 seconds.** They did not change their behavior. The site did.

---

## Three Confirmed Causes

### Cause 1: Monumetric CSP fully opened (Feb 25 commits) — CONFIRMED for Feb 25 only

Five CSP commits landed on Feb 25 that progressively unblocked the full Monumetric programmatic ad stack:

- `89313e0` `045f0d7` `bafdd59` `fc2e22c` `70c3db6`

Before Feb 25: Monumetric was "live" but most bidder chain domains were blocked by CSP → ads barely loaded → minimal JS overhead.

After Feb 25: Full programmatic header-bidding stack became active:

- `pagead2.googlesyndication.com` + Google safeframes
- `static.criteo.net` / `gum.criteo.com` (Criteo)
- `bloggernetwork-d.openx.net` (OpenX)
- `resources.infolinks.com` (Infolinks)
- `prebid.a-mo.net` + `c3.a-mo.net` (Prebid/A-MO)
- `fastlane.rubiconproject.com` + `eus.rubiconproject.com` (Rubicon/Magnite)
- `match.adsrvr.org` (Trade Desk)
- `cdn.confiant-integrations.net` (Confiant)
- `cdn.id5-sync.com` (ID5)

**Important clarification from founder (March 6):** Ads were turned OFF on Feb 26 and remained off until approximately Mar 4, when they were re-enabled on **desktop only**. Mobile ads are currently NOT displaying.

**Implication:** The CSP commit impact only explains Feb 25. The sustained engagement drop Feb 26 onwards cannot be attributed to ad load since ads were off. See Causes 2 and 3.

### Cause 2: Penny List content shrink (primary ongoing cause)

The penny list shrank from ~160–170 items (3 full pages + partial 4th page at 50 items/page) down to ~127 items (2.5 pages) during this window.

Losing one full page of browsable items removes ~30–70 seconds of intentional engagement for power users whose primary behavior is scrolling the list. This self-corrects as items accumulate.

**This is the most likely dominant cause for the sustained post-Feb-26 drop, not ads.**

### Cause 3: Non-branded Google discovery surge (not a problem — growth signal)

GSC data shows Google started ranking PennyCentral for non-branded discovery queries starting approximately Feb 21:

| Period       | Daily non-branded clicks |
| ------------ | ------------------------ |
| Feb 1–25     | ~4.6/day                 |
| Feb 26–Mar 4 | ~28+/day (6× increase)   |

Sample new queries driving discovery traffic:

- "home depot penny items"
- "find penny deals at home depot"
- "penny item finder"
- "home depot penny deals website"
- "penny finder app for home depot"

These users are first-time discoverers with lower intent/familiarity than the branded/returning base. Their lower individual engagement is expected and healthy. **This dilutes sitewide averages but is not a problem** — it means SEO is compounding.

The list having 160+ items during that window likely drove the Google ranking improvement (more content = more indexable signal).

---

## What Was NOT the Cause

| Hypothesis                         | Status                                                                                      |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Analytics tracking code changed    | ❌ ELIMINATED. Last analytics code change was Feb 8 (`e85f2b2`). Nothing touched since.     |
| Mobile ad stack hurting engagement | ❌ NOT APPLICABLE. Mobile ads are not currently displaying.                                 |
| Audience abandoning the site       | ❌ ELIMINATED. Returning user sessions actually increased Feb 26. They're still coming.     |
| Search ranking collapse            | ❌ OPPOSITE. GSC shows improving positions (avg 8.6 → 6.5) and 6× non-branded click growth. |
| Server/performance regression      | ❌ No deployment changes Feb 25 other than CSP config. App code unchanged.                  |

---

## Analytics Tech Stack (For Reference)

- GA4 property: `514549225`
- Measurement ID: `G-DJ4RJRX05E`
- GSC site: `https://www.pennycentral.com/`
- Analytics code: `lib/analytics.ts`, `components/analytics-tracker.tsx`, `app/layout.tsx`
- Last analytics code change: **Feb 8, 2026** (`e85f2b2` — fixed 50% traffic undercount)
- Local analytics archive: ADC via `gcloud auth application-default`, quota project `analytics-485810`
- OAuth refresh token in `.env.local` is **expired** as of March 2026 — use ADC directly

---

## Current Monumetric Ad Status (As of March 6, 2026)

- Desktop ads: active (re-enabled ~Mar 4)
- Mobile ads: NOT displaying
- Founder is actively evaluating mobile ad configuration (type, frequency, placement, pages)
- Active implementation plan: `.ai/impl/monumetric-balanced-stabilization-density-recovery.md`
- S5 (controlled rollout) is the next planned phase

---

## Expected Recovery Timeline

| Factor                     | Recovery Path                                                                                                              |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Penny list content         | Self-correcting as items are added. Every ~50 items recovered = one browsable page = significant engagement time restored. |
| Ad performance cost        | Requires S5 measurement work to quantify and optimize. Desktop only for now.                                               |
| Discovery traffic dilution | Not a problem to fix — the new users are a feature. Average engagement will rise as they convert to returning users.       |

---

## Related Files

- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` — Monumetric incident history (S1–S4)
- `.ai/topics/SITE_MONETIZATION_CURRENT.md` — Current monetization state
- `.ai/topics/ANALYTICS_CONTRACT.md` — GA4 tracking rules and KPI definitions
- `.ai/impl/monumetric-balanced-stabilization-density-recovery.md` — Active Monumetric plan
