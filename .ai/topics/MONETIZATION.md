# MONETIZATION

## CURRENT STATUS (Updated Feb 2, 2026)

### Active Infrastructure

- ✅ **Google Ad Manager account** - Verified (PIN mailed + identity verified + site ownership confirmed)
- ✅ **Google AdSense account** - Created Jan 19, 2026 (pub-5302589080375312)
- ✅ **ads.txt deployed** - Multi-network: Monumetric (385 entries) + AdSense (2 entries)
- ✅ **Privacy Policy** - Complete with ad disclosures
- ✅ **Journey by Mediavine (Grow)** - Installed Jan 12 (first-party analytics)

### Pending

- 🔄 **Monumetric MCM invite** - ACCEPTED, awaiting advertiser approval (2-6 weeks)
- ❌ **AdSense site approval** - REJECTED Feb 2, 2026 ("Low Value Content")
- 🔄 **Sitemap fix deployed** - Pillar-only (12 URLs), awaiting Google re-crawl

### Removed

- ❌ **Ezoic** - Infrastructure removed Feb 1, 2026 (poor UX: gray placeholder boxes)

---

## THE MONETIZATION PATH

### What Cade Has Done (Timeline)

| Date         | Action                                        | Status           |
| ------------ | --------------------------------------------- | ---------------- |
| Dec 4, 2025  | Site launched                                 | ✅               |
| Jan 12, 2026 | Installed Mediavine Journey (Grow)            | ✅               |
| Jan 14, 2026 | Privacy policy + ads.txt deployed             | ✅               |
| Jan 17, 2026 | Ezoic integration (temporary)                 | ❌ Removed Feb 1 |
| Jan 19, 2026 | Created AdSense account, applied for approval | ✅               |
| Jan 19, 2026 | Received Ezoic MCM invite                     | ✅ (not pursued) |
| Jan 19, 2026 | Received Monumetric MCM invite                | ✅ Accepted      |
| Jan 24, 2026 | GAM PIN verification completed                | ✅               |
| Jan 26, 2026 | Emailed Monumetric about Next.js setup        | ✅               |
| Feb 1, 2026  | Removed all Ezoic infrastructure              | ✅               |
| Feb 2, 2026  | AdSense rejected ("Low Value Content")        | ❌               |
| Feb 2, 2026  | Sitemap fix deployed (pillar-only indexing)   | ✅               |
| Feb 2, 2026  | GSC sitemap resubmitted (12 pages)            | ✅               |

### Current Traffic (Last 30 Days)

- **Users:** ~17-20k
- **Sessions:** ~24-25k
- **Pageviews:** ~70k (approaching 80k threshold)
- **Avg Session:** 70 seconds
- **Bounce Rate:** ~40%
- **Traffic Source:** 100% USA, primarily social/direct
- **Site Age:** 58 days (Dec 4, 2025 launch)

---

## THE DEPENDENCY QUESTION

### Does AdSense Approval Block Monumetric MCM?

**Short answer: Probably not, but it's complicated.**

Based on research:

1. **MCM (Multiple Customer Management) basics:**
   - AdSense is NOT required for basic MCM approval
   - However, you cannot be in "bad standing" with Google
   - MCM and AdSense are two separate review processes
   - Source: [Ezoic MCM FAQ](https://support.ezoic.com/kb/article/google-ad-manager-mcm-faqs)

2. **Monumetric's process:**
   - Monumetric does their own advertiser approval (2-6 weeks)
   - They work with multiple demand partners, not just Google/AdSense
   - The MCM invite means they already did initial site evaluation
   - "Advertiser approval" is about finding suitable advertisers for your content
   - Source: [Blogging Explorer - Monumetric Requirements](https://bloggingexplorer.com/monumetric-requirements/)

3. **For Google AdX access (premium inventory):**
   - AdSense approval IS typically required
   - Some partners require payment history ($500/mo for 3 months)
   - Source: [Monetiscope - AdX MA Guide](https://monetiscope.com/google-adx-ma-approval-requirements/)

4. **Key insight:**
   - AdSense "Low Value Content" is often a catch-all rejection for newer sites
   - Many publishers report approval on 2nd or 3rd attempt with zero changes
   - Source: [Google AdSense Community](https://support.google.com/adsense/community-guide/241032356)

### What This Means for You

- **Monumetric MCM invite already accepted** = They've already evaluated you positively
- **"Advertiser approval" phase** = Finding advertisers, NOT re-evaluating your content
- **AdSense rejection** = May affect access to Google AdX inventory, but NOT necessarily Monumetric's other demand sources
- **Best move:** Email Monumetric support, tell them AdSense rejected you, ask if it affects your MCM onboarding

---

## MONUMETRIC SPECIFICS

### Your Tier: Propel (10k-80k pageviews)

- **Setup fee:** $99 (already paid)
- **Platform requirement:** WordPress/Blogger officially, but exceptions exist for custom sites
- **You've already communicated:** Next.js site, Monumetric is aware

### The 80k Threshold

- You're at ~70k pageviews, approaching 80k
- At 80k+ (Ascend tier): No setup fee, any platform supported
- **If you hit 80k before ads go live:** You'd qualify for Ascend, but since you already paid $99, this is moot

### What Monumetric Is Waiting On (Per Your Emails)

1. ~~GAM PIN verification~~ ✅ DONE
2. ~~Identity verification~~ ✅ DONE
3. ~~Site ownership verification~~ ✅ DONE
4. **Advertiser approval** - In progress (2-6 weeks from acceptance)

---

## SITEMAP FIX (AdSense "Low Value Content")

### Root Cause

- Sitemap had 900+ URLs (800+ SKU pages + 50 state pages + 12 pillar pages)
- Google Search Console: 787 pages "Discovered - currently not indexed"
- 7:1 ratio of "ignored" to "indexed" = "low value" signal to AdSense

### Fix Deployed (Feb 2, 2026)

- Sitemap pruned to 12 pillar pages only
- SKU pages: `robots: { index: false, follow: true }`
- State pages: `robots: { index: false, follow: true }`
- User experience unchanged (all pages still work)

### Next Steps

1. Wait 48-72 hours for Google to re-crawl
2. Monitor GSC for "Excluded by noindex" (this is good)
3. Reapply to AdSense ~Feb 5-7

### Files Changed

- `app/sitemap.ts` - Pruned to 12 static URLs
- `app/sku/[sku]/page.tsx` - Added noindex
- `app/pennies/[state]/page.tsx` - Added noindex

---

## DECISION: EZOIC REMOVED

**Date:** Feb 1, 2026

**Reason:** Poor UX - gray placeholder boxes, awkward desktop splits, confusing card #10 break

**What Was Removed:**

- `components/ezoic-placeholder.tsx` - Deleted
- `lib/ads.ts` - Deleted
- All Ezoic imports and script tags
- Ezoic CSP entries from `next.config.js`

**What Was Kept:**

- `public/ads.txt` with all entries (Monumetric, AdSense, Ezoic legacy)
- Google AdSense account (still active, awaiting re-approval)
- Mediavine Journey/Grow.me (engagement widget)

---

## OPEN QUESTIONS

1. **Does AdSense rejection block Monumetric advertiser approval?**
   - Research says: Probably not for non-AdX inventory
   - Action: Email Monumetric support to confirm

2. **When to reapply to AdSense?**
   - After Google re-crawls sitemap (48-72 hours)
   - Target: Feb 5-7, 2026

3. **If Monumetric succeeds, do we still need AdSense approval?**
   - Maybe not for basic ad serving
   - Yes for Google AdX premium inventory access

4. **Are SKU pages too thin for AdSense/AdX approval?**
   - Analysis: SKU pages have ~85 words unique content vs. 150-200 needed
   - Boilerplate ratio: 59% (borderline acceptable, <60% threshold)
   - Current fix: noindex tags should prevent quality scan issues
   - Unknown: Do AdSense/AdX scans honor noindex tags?
   - Fallback plan: Add enriched product data + AI-generated context if needed

- Full analysis (archived): `archive/docs-pruned/2026-02-03-pass2/.ai/SKU_CONTENT_ANALYSIS.md`

---

## REDIRECT PAGES (Cleanup Task)

The following pages are dead code - they redirect to homepage anchors but serve no purpose:

- `/what-are-pennies` → `/#introduction`
- `/facts-vs-myths` → `/#fact-vs-fiction`
- `/in-store-strategy` → (redirect target TBD)
- `/digital-pre-hunt` → (redirect target TBD)
- `/internal-systems` → (redirect target TBD)

**Status:** Not in sitemap, not linked from navbar. Safe to delete.
**Decision:** TBD (Gemini 3 Pro suggested deleting, Claude agrees)

---

## POINTERS

- **AdSense status/fix:** `.ai/ADSENSE_NEXT_STEPS.md`
- **SKU content analysis (archived):** `archive/docs-pruned/2026-02-03-pass2/.ai/SKU_CONTENT_ANALYSIS.md`
- **Full monetization plan:** `.ai/plans/ad-monetization-strategy.md`
- **Privacy policy:** `app/privacy-policy/page.tsx`
- **Ads.txt file:** `public/ads.txt`
- **Grow integration:** `app/layout.tsx` (search "Grow")
- **Sitemap:** `app/sitemap.ts`
- **Learning #11 (sitemap bloat):** `.ai/LEARNINGS.md`

---

## ARCHIVE REFERENCES

- Ezoic integration details: `.ai/SESSION_LOG.md` entry "2026-01-17"
- Ezoic removal decision: `.ai/plans/ad-monetization-strategy.md` (bottom)
