# Implementation Plan: Ads.txt Multi-Network Management

**Created:** 2026-01-19
**Status:** Architecture Phase - Awaiting Approval
**Feature Slug:** ads-txt-multi-network-management

---

## Problem Statement

### What's Broken

Ezoic is showing "seller entries not detected" error and not serving ads, despite Ezoic scripts being properly integrated in `app/layout.tsx`.

### Root Cause

The `public/ads.txt` file currently contains:

- ✅ Monumetric entries (387 lines) - Working
- ✅ Google AdSense entries (2 entries at end) - Recently added
- ❌ **Ezoic entries (0 entries) - MISSING**

When Google AdSense entries were added (commit `cf55fcd`), Ezoic entries were either:

1. Never added in the first place, OR
2. Accidentally removed/not preserved during the update

### User Impact

- Ezoic cannot serve ads without proper ads.txt authorization
- Revenue stream is blocked despite scripts being ready
- Multiple ad networks need to coexist without conflict

---

## Goal

Enable Ezoic, Google AdSense, and Monumetric ads.txt entries to coexist in a single `public/ads.txt` file without any network breaking when others are added.

### Done Means

1. ✅ `public/ads.txt` contains ALL entries from all three networks:
   - Monumetric (existing ~387 lines)
   - Google AdSense (existing 2 entries)
   - Ezoic (new entries from Ezoic dashboard)

2. ✅ Ezoic dashboard shows "ads.txt properly configured" (no errors)

3. ✅ Google AdSense console shows no ads.txt warnings

4. ✅ File is accessible at `https://pennycentral.com/ads.txt` (Next.js serves from public/)

5. ✅ All 4 quality gates pass (lint/build/unit/e2e)

6. ✅ Documentation updated with ads.txt management process

---

## Current State Analysis

### File Location

- `public/ads.txt` (Next.js static file serving)
- Accessible at: https://www.pennycentral.com/ads.txt
- Current size: 387 lines (all Monumetric + 2 Google)

### Ezoic Integration Status

- ✅ Scripts integrated in `app/layout.tsx` (lines 128-149)
- ✅ CSP configured in `next.config.js`
- ✅ Gated to Vercel production only (`ENABLE_EZOIC_SCRIPTS`)
- ❌ **Ads.txt entries missing**

### Ezoic Ads.txt Manager Check

- Tested: `https://srv.adstxtmanager.com/19390/pennycentral.com` → 404
- Tested: `https://srv.adstxtmanager.com/19390/www.pennycentral.com` → 404
- **Conclusion:** Domain not yet configured in Ezoic's Ads.txt Manager

---

## Constraints

### Technical Constraints (from `.ai/CONSTRAINTS.md`)

- ✅ Next.js serves `public/ads.txt` as static file (no server-side generation)
- ✅ File must be plain text, one entry per line
- ✅ Standard ads.txt format: `domain, publisher_id, DIRECT|RESELLER, certification_id`
- ⚠️ Cannot use redirects (Next.js public folder doesn't support dynamic redirects to external URLs)

### Business Constraints

- **CRITICAL:** Google AdSense entries MUST remain intact and functional
- **CRITICAL:** Monumetric entries MUST remain intact (existing revenue source)
- **NEW:** Ezoic entries must be added without breaking existing networks
- Timeline: Ezoic is temporary bridge until Mediavine approval (~Feb 11, 2026)

### Owner Context (from `CLAUDE.md`)

- Cade cannot edit code/config manually
- Must provide clear, non-technical instructions for any Ezoic dashboard steps
- Must verify solution works before claiming "done"

---

## Implementation Approach

### Option A: Manual Fetch + Merge (Recommended)

**What it does:**

1. Cade accesses Ezoic dashboard → "Ads.txt" section
2. Cade copies Ezoic-specific entries (likely 5-20 lines)
3. I merge them into existing `public/ads.txt` while preserving all current entries
4. Verify at production URL

**Pros:**

- Simple, explicit, no automation complexity
- Full control over what gets added
- No risk of accidental overwrites
- Easy to verify and debug

**Cons:**

- Requires Cade to access Ezoic dashboard (one-time)
- Manual step (but only needed once)

**Rollback Plan:**

- Git revert to previous ads.txt version
- Zero-risk: file is version-controlled

**Files Modified:**

- `public/ads.txt` (append Ezoic entries)

**Verification:**

1. `curl https://www.pennycentral.com/ads.txt` shows all entries
2. Ezoic dashboard: "ads.txt properly configured" ✅
3. Google AdSense console: no warnings ✅
4. All 4 gates pass

---

### Option B: Ezoic Redirect (NOT RECOMMENDED)

**What it does:**

- Redirect `/ads.txt` to `https://srv.adstxtmanager.com/19390/pennycentral.com`
- Ezoic manages file automatically

**Why NOT recommended:**

1. ❌ Loses control over ads.txt (Ezoic decides what's included)
2. ❌ Risk: Ezoic could exclude Monumetric or Google entries
3. ❌ Next.js public folder doesn't support external redirects easily (would need middleware)
4. ❌ More complexity, less transparency

**Verdict:** Avoid this approach.

---

### Option C: Automated Merge Script (OVER-ENGINEERED)

**What it does:**

- Create a Node.js script that fetches from Ezoic manager, merges with local entries
- Run manually or via cron

**Why NOT recommended:**

1. ❌ Adds complexity for a one-time task
2. ❌ Ezoic manager URL returns 404 (domain not configured yet)
3. ❌ Overkill: ads.txt entries rarely change

**Verdict:** Not worth the effort.

---

## Recommended Approach: Option A (Manual Fetch + Merge)

### Phase 1: Cade Retrieves Ezoic Entries

**Steps for Cade (Plain English):**

1. Log into your Ezoic dashboard: https://www.ezoic.com/
2. Navigate to: **"Ad Transparency"** → **"Ads.txt"** (or search for "ads.txt" in dashboard)
3. Look for a section called **"Your Ads.txt Entries"** or **"Ezoic Entries"**
4. Copy ALL lines that Ezoic provides (should look like this format):
   ```
   ezoic.com, XXXXX, DIRECT
   google.com, pub-XXXXXXXXXXXXXX, RESELLER, f08c47fec0942fa0
   appnexus.com, XXXX, RESELLER, f5ab79cb980f11d1
   ```
5. Paste those lines into a message back to me

**Fallback:** If you can't find the entries in the dashboard:

- Contact Ezoic support: https://support.ezoic.com/
- Request: "Please provide my ads.txt entries for pennycentral.com"
- They should respond within 24 hours with the exact lines

---

### Phase 2: I Merge Entries into public/ads.txt

**What I'll do:**

1. Read current `public/ads.txt` (preserve all 387 lines)
2. Append Ezoic entries at the bottom (with comment header for clarity)
3. Ensure no duplicate entries (if any exist)
4. Commit with message: "feat(ads): add Ezoic seller entries for multi-network coexistence"

**Example structure:**

```
# ============================================
# MONUMETRIC ENTRIES (lines 1-385)
# ============================================
[existing Monumetric entries...]

# ============================================
# GOOGLE ADSENSE ENTRIES
# ============================================
google.com, pub-3944954862316283, DIRECT, f08c47fec0942fa0
google.com, pub-5302589080375312, DIRECT, f08c47fec0942fa0

# ============================================
# EZOIC ENTRIES (added 2026-01-19)
# ============================================
[Ezoic entries provided by Cade...]
```

---

### Phase 3: Verify All Networks See Their Entries

**Verification Checklist:**

1. **File Accessible:**

   ```bash
   curl https://www.pennycentral.com/ads.txt | grep -i "ezoic"
   curl https://www.pennycentral.com/ads.txt | grep -i "google.com, pub-5302589080375312"
   curl https://www.pennycentral.com/ads.txt | grep -i "monumetric" # (or first line check)
   ```

2. **Ezoic Dashboard Check:**
   - Dashboard → "Ads.txt" → Should show ✅ "Properly configured"
   - May take 24-48 hours for Ezoic to crawl and verify

3. **Google AdSense Console:**
   - Check for any ads.txt warnings
   - Should show ✅ No issues

4. **Quality Gates:**
   ```bash
   npm run lint      # 0 errors
   npm run build     # successful
   npm run test:unit # all passing
   npm run test:e2e  # all passing
   ```

---

## Open Questions

### Q1: Does Cade have access to the Ezoic dashboard?

- **Answer needed:** Yes/No
- **If No:** Provide Ezoic support contact info for account access

### Q2: What's the Ezoic account/publisher ID?

- **Answer needed:** (will be visible in dashboard)
- **Use case:** Verify correct entries are added

### Q3: How many Ezoic entries to expect?

- **Typical:** 5-20 entries (ezoic.com + partner resellers)
- **Confirmation needed:** Cade will see count in dashboard

### Q4: Should we add comments/section headers to ads.txt?

- **Option A:** Yes - makes future management easier (Recommended)
- **Option B:** No - keep file minimal
- **Preference:** Your call

### Q5: When to verify Ezoic dashboard shows "configured"?

- **Timeline:** Ezoic typically crawls within 24-48 hours
- **Action:** Cade should recheck dashboard on Jan 21-22

---

## Risk Assessment

### Risk 1: Ezoic entries conflict with existing entries

- **Likelihood:** Low
- **Mitigation:** ads.txt format allows multiple networks; standard practice
- **Rollback:** Git revert if any issues

### Risk 2: Google AdSense entries get broken during merge

- **Likelihood:** Very Low (I'll verify line-by-line)
- **Mitigation:** Preserve exact existing lines, add new lines only at end
- **Verification:** Grep for Google publisher IDs before/after

### Risk 3: Ezoic dashboard still shows error after 48 hours

- **Likelihood:** Low (if entries are correct)
- **Mitigation:** Contact Ezoic support with ads.txt URL for manual review
- **Backup:** Ezoic support can verify if entries match their requirements

### Risk 4: File becomes too large (over 100KB?)

- **Likelihood:** Very Low (current 387 lines ≈ 30KB; adding 20 lines = negligible)
- **Mitigation:** ads.txt files can be several MB; no practical limit

---

## Files to Modify

### Modified Files

1. **`public/ads.txt`**
   - Append Ezoic entries
   - Add section comments for clarity
   - Preserve all existing entries

### Documentation Updates

2. **`.ai/topics/MONETIZATION.md`**
   - Update "CURRENT STATUS" to note ads.txt is now complete
   - Add pointer to ads.txt management process

3. **`.ai/SESSION_LOG.md`**
   - Log this session's work (ads.txt multi-network setup)

4. **`.ai/STATE.md`**
   - Update current sprint with ads.txt completion

---

## Verification Plan

### Immediate Verification (After Deploy)

1. ✅ `curl https://www.pennycentral.com/ads.txt` returns 200
2. ✅ File contains Monumetric entries (grep first line)
3. ✅ File contains Google AdSense entries (grep both pub IDs)
4. ✅ File contains Ezoic entries (grep "ezoic")
5. ✅ All 4 quality gates pass

### 24-Hour Verification (Jan 20, 2026)

6. ✅ Ezoic dashboard: Check "Ads.txt" status
7. ✅ Google AdSense console: Verify no new warnings

### 48-Hour Verification (Jan 21, 2026)

8. ✅ Ezoic dashboard: Confirm "properly configured" ✅
9. ✅ Check Ezoic ad impressions (should start appearing)

---

## Success Criteria

### Must Have (Required for "Done")

- ✅ All three networks' entries present in `public/ads.txt`
- ✅ Ezoic dashboard shows no ads.txt errors (after 24-48hr crawl)
- ✅ Google AdSense console shows no ads.txt warnings
- ✅ File accessible at production URL
- ✅ All 4 quality gates pass
- ✅ Git commit with clear message

### Nice to Have (Bonus)

- ✅ Section comments in ads.txt for future maintainability
- ✅ Documentation updated with "how to add a new ad network" process
- ✅ Ezoic ads begin serving within 48 hours

---

## Post-Implementation

### Monitoring (Next 7 Days)

- **Day 1-2:** Watch Ezoic dashboard for "ads.txt configured" confirmation
- **Day 3-7:** Monitor Ezoic ad impressions to confirm serving
- **Ongoing:** Check Google AdSense console for any new warnings

### Future Maintenance

- **When adding new networks:** Follow same process (fetch entries, append to file, verify)
- **When removing Ezoic (Feb 11):** Delete Ezoic section from ads.txt, keep others intact
- **Quarterly:** Audit ads.txt to remove deprecated entries (optional)

---

## Related Documentation

- **Ezoic Integration:** `.ai/topics/MONETIZATION.md`
- **CSP Configuration:** `next.config.js` (lines with ezoic.com)
- **Layout Scripts:** `app/layout.tsx` (lines 128-149)
- **Ezoic Setup Guide:** https://support.ezoic.com/kb/article/everything-you-need-to-know-about-adstxt
- **Ads.txt Spec:** https://iabtechlab.com/ads-txt/

---

## Timeline Estimate

- **Phase 1 (Cade retrieves entries):** 10-15 minutes
- **Phase 2 (I merge entries):** 5 minutes
- **Phase 3 (Verification):** 5 minutes (immediate) + 24-48hr (Ezoic crawl)
- **Total active time:** ~20-25 minutes
- **Total wall time:** 48 hours (for Ezoic to crawl and confirm)

---

## Next Steps

**Waiting on:** Cade to provide Ezoic ads.txt entries from dashboard

**Instructions for Cade:**

1. Log into Ezoic dashboard
2. Find "Ads.txt" section
3. Copy all Ezoic entries
4. Paste them in a message back to me
5. I'll merge them and verify everything works

**Fallback:** If Cade can't access entries, I can guide him to contact Ezoic support for the exact lines.

---

**END OF ARCHITECTURE PLAN**
