# Ad Monetization Strategy - Penny Central

**Created:** 2026-01-26
**Status:** PLANNING (awaiting Monumetric email response)
**Owner:** Cade

---

## Executive Summary

Cade is transitioning from Ezoic to Monumetric but hit a blocker: **Monumetric's Propel tier (10k-80k pageviews) requires WordPress/Blogger**. The site is built on Next.js. This document captures the full situation, research findings, and decision paths forward.

---

## Current Situation

### Site Stats

- **Platform:** Next.js (custom React framework, NOT WordPress)
- **Pageviews:** ~45-50k/month
- **Traffic Split:** 90% mobile, 10% desktop
- **Hosting:** Vercel

### Active Ad Networks

| Network                      | Status            | Purpose                                  |
| ---------------------------- | ----------------- | ---------------------------------------- |
| **Google AdSense**           | Active            | Direct ad revenue (pub-5302589080375312) |
| **Ezoic**                    | Active (buggy UX) | Ad optimization with 5 placeholder boxes |
| **Mediavine Journey (Grow)** | Active            | Engagement widget + first-party data     |
| **Monumetric**               | ads.txt only      | Future use when 80k+ pageviews reached   |

### The Problem with Ezoic UX

The current Ezoic implementation has **5 placeholder boxes** that render as gray boxes with pulsing "Ad" text:

- 3 on homepage (HOME_TOP, HOME_MID, HOME_BOTTOM)
- 1 on Penny List after item #10 (LIST_AFTER_N)
- 1 on Guide after Section II (CONTENT_AFTER_P1)

**Issues:**

- Gray boxes visible even when ads don't load
- Desktop layout splits awkwardly (not optimized)
- Unknown mobile experience (needs verification)
- Styling: `bg-[var(--bg-muted)] rounded-lg border` - visible placeholder boxes

**Code Location:**

- `components/ezoic-placeholder.tsx` - Component definition
- `lib/ads.ts` - Configuration and kill switch

---

## Monumetric Research Findings

### Official Tier Requirements

| Tier        | Pageviews | Platform Requirement            | Setup Fee |
| ----------- | --------- | ------------------------------- | --------- |
| **Propel**  | 10k-80k   | WordPress or Blogger ONLY       | $99       |
| **Ascend**  | 80k+      | Any platform (including custom) | $0        |
| **Stratos** | 500k+     | Any platform                    | $0        |
| **Apollo**  | 10M+      | Any platform                    | $0        |

**Source:** [Blogging Explorer](https://bloggingexplorer.com/monumetric-requirements/), [Monumetric FAQ](https://www.monumetric.com/frequently-asked-questions/)

### Why WordPress/Blogger Requirement?

Monumetric needs standardized solutions for Propel Program setup - WordPress plugins allow them to implement ads faster and more efficiently. At 80k+ pageviews, the revenue justifies custom implementation work.

### Real-World Exception: Squarespace Case Study

A publisher on **Squarespace** (non-WordPress) applied despite the explicit WordPress requirement:

- **Result:** Monumetric said YES
- **Setup:** They received specific instructions for manual script installation
- **Time:** 10-20 minutes to implement
- **Process:** Add script to backend + advertising tag

**Source:** [Simply Awesome Trips](https://www.simplyawesometrips.com/using-monumetric-with-squarespace/)

### Monumetric's Custom Site Capabilities

Despite the Propel WordPress requirement, Monumetric's marketing states:

- Experience with 10,000+ websites across 20 different CMS platforms
- Including "custom-built solutions"
- Custom-first approach that works with existing setups
- Solutions "fully scalable and can be custom-fit for any implementation"

**Source:** [Monumetric Development](https://www.monumetric.com/development/)

### Installation Options

- **95% of publishers:** Monumetric installs tags (need temporary backend access)
- **5% of publishers:** Self-install (Monumetric provides ad tag code)

**Key Finding:** If approved, you receive ad tags and just place the code where you want ads. This is doable on ANY platform including Next.js.

---

## Cade's Concerns (Master List)

### CONCERN 1: Ezoic UX is "dog shit"

**Issue:** Gray placeholder boxes, awkward desktop splits
**Status:** NEEDS FIXING regardless of Monumetric outcome
**Options:**

- A) Remove Ezoic entirely (no ad revenue from Ezoic)
- B) Fix Ezoic UX (better placeholder styling, smarter placement)
- C) Keep ads.txt, disable placeholders (AdSense only)

### CONCERN 2: Mobile-first (90% of traffic)

**Research Findings:**

- Mobile ads typically earn less than desktop
- Best practices: 1-3 ad impressions per session
- Place ads at natural transition points, NOT mid-content
- Native/rewarded ads perform best
- Frequency cap: ~1 interstitial per hour (Google guideline)

**Implication:** Current 5-slot approach may be too aggressive for mobile

### CONCERN 3: Monumetric won't let me set up manually?

**Research Finding:** This is partially true for Propel tier:

- Propel (under 80k) officially requires WordPress/Blogger
- BUT exceptions exist (Squarespace case study)
- At 80k+ (Ascend), any platform is supported
- Manual setup IS possible if they approve you

**Action:** Ask Monumetric directly if they'll make an exception for Next.js

### CONCERN 4: What if Monumetric says no?

**Options if Monumetric rejects custom site:**

1. **Stick with Ezoic** - Fix UX issues, keep using
2. **AdSense only** - Remove Ezoic, just use AdSense directly
3. **Try Mediavine** - Requires 50k sessions/month (you may qualify)
4. **Wait for 80k pageviews** - Keep Monumetric ads.txt, grow traffic

### CONCERN 5: Keep ads.txt for future Monumetric use

**Research Finding:** Yes, this is correct:

- ads.txt authorizes sellers to represent your inventory
- Having Monumetric in ads.txt doesn't hurt anything
- When you hit 80k, the ads.txt is already ready
- No active ad serving occurs just from ads.txt entries

**Current ads.txt contains:**

```
pmc.com, 1240739, DIRECT, 8dd52f825890bb44 (Monumetric)
INVENTORYPARTNERDOMAIN=monumetric.com
google.com, pub-5302589080375312, DIRECT, f08c47fec0942fa0 (AdSense)
```

### CONCERN 6: Don't crush usership with ads

**Research Best Practices:**

- Start with 1 ad per session, monitor retention 2 weeks
- Increase gradually to 2 per session
- Track retention + revenue together
- If retention falls while revenue climbs = over-monetizing
- Natural transition points only (between content sections)

### CONCERN 7: Context preservation across sessions

**Solution:** This document + update STATE.md + update SESSION_LOG.md

---

## Technical Reality: Can Claude Set Up Monumetric on Next.js?

**YES, absolutely.**

If Monumetric provides:

1. **A script tag** - Add to `app/layout.tsx` in `<head>`
2. **Ad placement divs** - Add wherever specified in components
3. **Configuration** - Usually via their dashboard

**Implementation would look like:**

```tsx
// In app/layout.tsx <head>
<script
  async
  src="https://[monumetric-provided-url].js"
  data-site-id="YOUR_SITE_ID"
/>

// In components where ads should appear
<div id="monumetric-ad-slot-1" />
```

**Or if they auto-inject:** Just add the script, no placeholder divs needed.

---

## Decision Matrix

### Scenario A: Monumetric Approves Custom Site (Best Case)

1. Remove Ezoic infrastructure entirely
2. Add Monumetric script to layout
3. Place ads per their instructions
4. Keep AdSense as backup
5. Monitor for 2 weeks

### Scenario B: Monumetric Requires WordPress (Expected)

1. Keep Monumetric ads.txt for future (80k goal)
2. Fix Ezoic UX OR switch to AdSense-only
3. Focus on growing to 80k pageviews
4. Re-apply to Monumetric when eligible

### Scenario C: Abandon Ezoic Immediately (Frustration Path)

1. Remove all Ezoic placeholders and scripts
2. Keep AdSense only
3. Lose Ezoic revenue but improve UX
4. Wait for Monumetric at 80k

---

## Recommended Email to Monumetric

```
Subject: Custom Site (Next.js) - Propel Program Eligibility?

Hi Monumetric Team,

I was recently approved and paid the $99 setup fee, but I noticed the
Propel program requires WordPress/Blogger. My site (pennycentral.com)
is built on Next.js, a React framework hosted on Vercel.

I saw that you support "custom-built solutions" and have experience
with 20+ CMS platforms. Would you be able to provide manual ad tag
installation instructions for my Next.js site?

I'm comfortable implementing the script tags and ad placement divs
myself - I just need the ad tags and any configuration details.

If manual setup isn't available for Propel, I understand and will
keep my ads.txt in place for when I reach the Ascend threshold (80k).

Site: https://www.pennycentral.com
Current pageviews: ~45-50k/month
Platform: Next.js (React) on Vercel

Thanks,
Cade
```

---

## Immediate Actions (While Awaiting Response)

### Option 1: Fix Ezoic UX (Keep Ezoic Running)

- [ ] Remove placeholder skeleton "Ad" text
- [ ] Hide boxes when no ad loads (use Ezoic's `ezstandalone` callbacks)
- [ ] Test on mobile (90% of traffic)
- [ ] Reduce from 5 slots to 2-3 (less aggressive)
- [ ] Move Penny List ad lower (after item #20 instead of #10)

### Option 2: Disable Ezoic Temporarily (AdSense Only)

- [ ] Set `NEXT_PUBLIC_EZOIC_ENABLED=false` in Vercel
- [ ] Redeploy (env var changes require redeploy)
- [ ] Gray boxes disappear immediately
- [ ] AdSense continues working independently
- [ ] Lose Ezoic optimization but improve UX

### Option 3: Remove Ezoic Entirely (Clean Slate)

- [ ] Delete `components/ezoic-placeholder.tsx`
- [ ] Delete `lib/ads.ts`
- [ ] Remove imports from page.tsx, penny-list-client.tsx, GuideContent.tsx
- [ ] Remove Ezoic scripts from layout.tsx
- [ ] Remove Ezoic CSP domains from next.config.js
- [ ] Update tests and CI
- [ ] Keep Ezoic entries in ads.txt (doesn't hurt)

---

## Monumetric vs Ezoic Comparison

| Factor                  | Monumetric                     | Ezoic                        |
| ----------------------- | ------------------------------ | ---------------------------- |
| **Revenue Share**       | 70% to publisher               | 90% to publisher             |
| **Setup Fee**           | $99 (under 80k)                | $0                           |
| **Min Traffic**         | 10k pageviews                  | 0 (AdSense approval needed)  |
| **Custom Site Support** | 80k+ (Ascend)                  | Yes (any platform)           |
| **UX Control**          | Manual placement               | AI-driven (can be intrusive) |
| **Support**             | Dedicated account manager      | Forum/tickets                |
| **Ad Quality**          | Higher quality, less intrusive | Can be aggressive            |

**Source:** [Millie Pham Comparison](https://bymilliepham.com/monumetric-vs-ezoic)

---

## Open Questions (Structural Ambiguity Register)

1. **BLOCKED:** Will Monumetric approve Next.js for Propel tier? (Awaiting email)
2. **OPEN:** What is current mobile UX for Ezoic boxes? (Needs screenshot/testing)
3. **OPEN:** How much revenue is Ezoic generating vs AdSense? (Need analytics)
4. **OPEN:** What is retention impact of current ad placement? (Need GA4 data)

---

## Sources

- [Monumetric Requirements - Blogging Explorer](https://bloggingexplorer.com/monumetric-requirements/)
- [Monumetric FAQ](https://www.monumetric.com/frequently-asked-questions/)
- [Monumetric Development (Custom Sites)](https://www.monumetric.com/development/)
- [Squarespace + Monumetric Case Study](https://www.simplyawesometrips.com/using-monumetric-with-squarespace/)
- [Monumetric vs Ezoic Comparison](https://bymilliepham.com/monumetric-vs-ezoic)
- [Mobile Monetization Best Practices - Adnimation](https://www.adnimation.com/mobile-optimization-in-2025-turning-every-tap-into-revenue/)
- [Display Ad Best Practices - SmartyAds](https://smartyads.com/blog/display-ads-best-practices)
- [Ads.txt Specification - IAB Tech Lab](https://iabtechlab.com/wp-content/uploads/2019/03/IAB-OpenRTB-Ads.txt-Public-Spec-1.0.2.pdf)

---

## Decision: Ezoic Removed Entirely (2026-02-01)

**Decision:** Delete all Ezoic infrastructure and start fresh for Monumetric.

**Rationale:**

- Ezoic UX was poor (gray placeholder boxes, awkward desktop splits)
- Card #10 break was confusing users
- Clean slate for Monumetric integration when approved

**What was removed:**

- `components/ezoic-placeholder.tsx` - Deleted
- `lib/ads.ts` - Deleted
- All Ezoic imports from `app/page.tsx`, `components/GuideContent.tsx`, `app/layout.tsx`
- Ezoic CSP entries from `next.config.js`
- 3 homepage ad slots (HOME_TOP, HOME_MID, HOME_BOTTOM)
- 1 penny list ad slot (LIST_AFTER_N at card #10)
- 1 guide ad slot (CONTENT_AFTER_P1)
- Ezoic scripts from `<head>`

**What was kept:**

- `public/ads.txt` with Monumetric entries (ready for 80k threshold)
- Google AdSense (continues working independently)
- Mediavine Journey/Grow.me (engagement widget)

---

## Next Steps

1. **Wait for Monumetric email response**
2. ~~Decide: Fix Ezoic UX vs Disable Ezoic vs Remove Ezoic~~ ✅ DONE - Removed entirely
3. **When Monumetric approves:** Add their script tags strategically
4. **Strategic ad placement (Monumetric):**
   - Mobile: After card #20 (not #10), end of list
   - Desktop: Sticky sidebar (doesn't interrupt content)
5. **Monitor retention vs revenue** (start with 1 ad/session, increase gradually)

---

## Change Log

| Date       | Change                           | Decision                     |
| ---------- | -------------------------------- | ---------------------------- |
| 2026-02-01 | Removed all Ezoic infrastructure | Clean slate for Monumetric   |
| 2026-01-26 | Created planning document        | Awaiting Monumetric response |
