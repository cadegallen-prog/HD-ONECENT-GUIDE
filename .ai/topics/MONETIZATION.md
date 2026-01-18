# MONETIZATION

## CURRENT STATUS

- ✅ Ezoic bridge active (Jan 17, temporary)
- ✅ Mediavine Grow installed (Jan 12, first-party data collection in progress)
- ✅ Privacy Policy + ads.txt deployed (Jan 14)
- 🔄 **Awaiting:** Mediavine approval (needs 30 days of Grow analytics)
- ❌ **Monumetric:** Onboarding paused pending Mediavine decision
- **Timeline:** Mediavine decision expected ~Feb 11 (30 days from Jan 12)

---

## LOCKED DECISIONS

- **Strategy:** Ezoic as temporary bridge while Mediavine collects analytics
- **Coexistence:** Both networks active simultaneously (intentional; no conflict)
- **Script order:** Privacy scripts first (Gatekeeper CMP), then Ezoic, then Mediavine, then GA4
- **Ad placement:** Ezoic handles ad serving via their platform
- **Consent management:** Gatekeeper CMP handles user consent for both networks
- **Exit plan:** Delete Ezoic blocks from `app/layout.tsx` and CSP when Mediavine approved
- **CSP:** Broad wildcard (`https://*.gatekeeperconsent.com`, `https://*.ezoic.com`) to avoid future updates

---

## OPEN QUESTIONS

1. **If Mediavine rejects: Plan B?**
   - Option A: Keep Ezoic indefinitely
   - Option B: Switch to Monumetric full-time
   - Option C: Mix: Ezoic 50% + Monumetric 50% (parallel serve)

2. **Ad placement density?**
   - Option A: Conservative (1 ad above fold, 1 below)
   - Option B: Moderate (current Ezoic default)
   - Option C: Aggressive (3+ ads per page)

3. **Impact on user experience?**
   - Option A: Monitor weekly CTR on Penny List (if drops, reduce density)
   - Option B: Run A/B test with ad-free version
   - Option C: Assume no impact, proceed

---

## NEXT ACTIONS

1. **Wait 25+ more days for Mediavine approval**
   - No action needed until ~Feb 11
   - Monitor Mediavine dashboard for analytics collection

2. **Set calendar reminder: Feb 11**
   - Check Mediavine approval status
   - If approved: Schedule removal of Ezoic (30 min task)
   - If rejected: Trigger decision on Plan B (Option A/B/C above)

3. **Track ad revenue (weekly)**
   - Ezoic dashboard: impressions, CTR, RPM
   - Compare against Facebook referral growth to ensure monetization > friction

4. **Monitor user feedback**
   - Watch for complaints about ad load/slowness
   - If >5% users complain, reduce density

5. **Prepare Ezoic removal (Step 0)**
   - Files to modify: `app/layout.tsx`, `next.config.js`
   - Time estimate: 30 minutes
   - Verification: Build + E2E + Grow still works

---

## POINTERS

- **Ezoic integration details:** `.ai/SESSION_LOG.md` entry "2026-01-17 - Ezoic Ads Integration"
- **CSP config:** `next.config.js` (lines with `script-src`, `connect-src`)
- **Layout scripts:** `app/layout.tsx` (search "Ezoic" for script blocks)
- **Privacy policy:** `app/privacy-policy/page.tsx` + `public/ads.txt`
- **Grow integration:** `app/layout.tsx` (Mediavine Grow script)
- **Implementation plan:** None yet (awaiting Mediavine decision)

---

## Archive References

- None yet (this topic is active)
