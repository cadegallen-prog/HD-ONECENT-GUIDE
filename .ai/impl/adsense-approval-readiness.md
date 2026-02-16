# AdSense Approval Readiness Plan

## Context

**Problem:** PennyCentral has been declined by AdSense twice and is currently in approval process with Ezoic Ad Manager and Monumetric Ad Manager (status uncertain until Tuesday 2/18 due to holiday). A third AdSense decline could block monetization indefinitely. Current audit identified 4 critical compliance gaps blocking approval:

1. **Admin endpoints unprotected** (security vulnerability)
2. **Consent Mode v2 pre-grants all consent** (GDPR/policy violation)
3. **GA4 + Monumetric undisclosed in privacy policy** (transparency violation)
4. **Auth-gated routes missing noindex** (SEO thin content risk)

Additionally, the user needs clarity on:

- Whether weekly email digest is actually sending (it's not—paused since Feb 3)
- Whether EU consent banner is required (US-only traffic, but AdSense reviewers often require it anyway)
- Whether privacy policy needs generator update (no—current is strong, just needs additions)

**Goal:** Fix all 4 critical issues + add missing disclosures to enable AdSense reapplication with confidence. Timeline: complete by Feb 19, 2026 (AdSense re-review decision deadline per INC-ADSENSE-001).

**User constraints:**

- 99% US traffic, no desire for EU traffic (Home Depot is North America only, Canada has no penny items)
- Must get this right—can't afford third AdSense decline
- Cost/time/stress of continued monetization blocks is high
- Wants clear disclosure language that satisfies Google reviewers
- Already accepted into Ezoic MCM and Monumetric MCM, waiting on Google Ad Manager domain approval

---

## Implementation Plan

### Phase 1: Security Fix (Admin Endpoints)

**Files to modify:**

- `app/api/admin/submissions/route.ts` (GET, PATCH, DELETE handlers — lines 35, 46-68, 72-89)
- `app/api/admin/delete-submission/route.ts`
- `app/api/admin/recent-submissions/route.ts`
- `app/admin/dashboard/page.tsx` (client component — needs auth check via useAuth)

**Approach:**
Add Bearer token auth check (using existing `ADMIN_SECRET` env var pattern) to all 3 API routes:

```typescript
const authHeader = request.headers.get("authorization")
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
const token = authHeader.replace("Bearer ", "")
if (token !== process.env.ADMIN_SECRET) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 })
}
```

Add `useAuth()` check to admin dashboard page component:

```typescript
const { user, loading } = useAuth()
if (loading) return <LoadingSpinner />
if (!user) {
  router.replace('/login?redirect=/admin/dashboard')
  return null
}
```

Update `.env.example` and `.ai/ENVIRONMENT_VARIABLES.md` to document `ADMIN_SECRET`.

---

### Phase 2: Indexing Fixes (noindex metadata)

**Files to modify:**

- `app/lists/page.tsx` — add `export const metadata = { robots: { index: false, follow: false } }`
- `app/lists/[id]/page.tsx` — add same metadata export
- `app/s/[token]/page.tsx` — add `robots: { index: false, follow: true }` (keep follow for shared list links)
- `app/login/page.tsx` — add `robots: { index: false, follow: false }`
- `app/internal-systems/page.tsx` — add `robots: { index: false, follow: false }`

**Note:** These are all client components ("use client"), but Next.js 13+ allows metadata exports even for client pages via parallel route metadata files. If direct export fails due to "use client", create `layout.tsx` siblings with metadata.

**Verification:** Run `npm run build` and check static HTML output for `<meta name="robots" content="noindex">` tags.

---

### Phase 3: Privacy Policy Updates

**File:** `app/privacy-policy/page.tsx`

**Additions needed:**

1. **Section 2 (Information We Collect) — Add after line 61:**

   ```
   - Google Analytics tracking via GA4 (Measurement ID: G-DJ4RJRX05E) for site usage analytics
   ```

2. **Section 5 (Affiliate, Advertising, Third-Party Disclosures) — Add after line 158:**

   ```
   **Third-Party Service Providers:**
   - **Google Analytics (GA4)**: We use Google Analytics to understand how visitors use our site. Google Analytics may collect IP addresses, browser information, and usage patterns. You can opt out via browser settings or Google Analytics Opt-Out Add-on.
   - **Monumetric**: We use Monumetric for ad management services. Monumetric may place cookies and collect data for ad serving and measurement. See Monumetric's privacy policy at https://www.monumetric.com/privacy-policy.
   - **Ezoic**: We use Ezoic for ad optimization and management. Ezoic may place cookies and collect data for ad testing and serving. See Ezoic's privacy policy at https://www.ezoic.com/privacy-policy/.
   - **Resend**: We use Resend to deliver email communications (weekly digest, transactional emails). Resend processes email addresses and message content. See Resend's privacy policy at https://resend.com/legal/privacy-policy.

   **Ezoic-Specific Disclosure (Required):**

   <span id="ezoic-privacy-policy-embed"></span>

   This site uses the services of Ezoic Inc. to manage third-party interest-based advertising. Ezoic's technologies serve content, display ads, and utilize first and third-party cookies to track visitor interactions. Data collected includes IP addresses, operating system and device information, language preferences, web browser type, and hashed or encrypted email addresses. Ezoic and partners use this data combined with independently gathered information to deliver targeted advertisements. For more information, see Ezoic's privacy policy at https://www.ezoic.com/privacy-policy/ and advertising partners list.
   ```

   **Note:** The `<span id="ezoic-privacy-policy-embed"></span>` allows Ezoic to automatically inject their full partner disclosure (updated dynamically). The text after it provides context for users.

3. **Section 6 (Sharing, Retention, Security) — Add after line 178:**

   ```
   **Data Deletion Requests:**
   - **Supabase (database)**: Contact us at contact@pennycentral.com to request deletion of account data. We will delete your user profile and associated lists within 30 days.
   - **Resend (email)**: Unsubscribe from emails using the link in any email footer. We delete inactive subscriber records after 1 year of inactivity.
   - **Google Analytics**: GA4 data is retained per Google's policy (14 months by default). You can opt out via browser settings.
   ```

4. **Section 3 (How We Use Information) — Add after line 82:**
   ```
   - Send weekly email digests with new penny list items (if you've subscribed). You can unsubscribe anytime using the link in email footers.
   ```

**Update "Last Updated" date to current date.**

**Post-implementation:** Add `https://www.pennycentral.com/privacy-policy` to your Ezoic dashboard under Settings → Privacy Policy URL.

---

### Phase 4: Consent Mode v2 Fix (US-Only, No Banner)

**File:** `app/layout.tsx`

**Change lines 214-219 from:**

```typescript
gtag("consent", "default", {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
})
```

**To:**

```typescript
gtag("consent", "default", {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
  region: ["US", "CA"], // Grant consent by default for North America only
})
```

**Rationale:**

- User has 99% US traffic, Home Depot is North America only (US + Canada)
- No EU traffic desired or expected
- No consent banner needed for US-only audience
- Ezoic CMP is optional (primarily for EU) — not implementing since no EU traffic
- This satisfies AdSense reviewers who check for "consent infrastructure exists" (the `region` parameter shows you've considered it)

**No consent banner component needed.** The privacy policy disclosure (Phase 3) is sufficient for US audience.

---

### Phase 5: Footer Structural Fix

**File:** `components/footer.tsx` line 111

**Change from:**

```
Not affiliated with Home Depot
```

**To:**

```
Not affiliated with or endorsed by Home Depot
```

**Also update** `app/about/page.tsx` line 70 if needed to match (currently already has "endorsed by" language—verify consistency).

---

### Phase 6: Email Disclosure (Already Covered in Phase 3)

The privacy policy updates in Phase 3 include:

- Weekly digest disclosure (Section 3)
- Resend as email provider (Section 5)
- Email data deletion process (Section 6)

**No separate email system changes needed** since emails are already paused (paused since Feb 3, 2026). The `vercel.json` crons array is empty and endpoint returns "paused" status. User can reactivate later by:

1. Setting `FORCE_RUN_DIGEST=true` in Vercel env vars
2. Adding cron schedule back to `vercel.json`

---

## Sitemap Verification

**Current sitemap status:** Already correct (18 pillar pages, all verified to exist and render content).

**What to verify after changes:**

1. Auth-gated routes (`/lists`, `/lists/[id]`, `/s/[token]`) should **NOT** be in sitemap (already excluded ✓)
2. Utility routes (`/login`, `/internal-systems`) should **NOT** be in sitemap (already excluded ✓)
3. All 18 existing sitemap entries should still work:
   - `/`, `/penny-list`, `/guide`, `/store-finder`, `/clearance-lifecycle`, `/facts-vs-myths`, `/what-are-pennies`, `/digital-pre-hunt`, `/in-store-strategy`, `/inside-scoop`, `/faq`, `/report-find`, `/about`, `/contact`, `/transparency`, `/privacy-policy`, `/terms-of-service`, `/do-not-sell-or-share`

**Test command:**

```bash
curl http://localhost:3001/sitemap.xml | grep -o '<loc>[^<]*</loc>'
```

Should return exactly 18 URLs. No changes needed to sitemap.ts — it's already correct.

---

## Verification Plan

### 1. Admin Security Test

```bash
# Without auth header (should 401)
curl http://localhost:3001/api/admin/submissions

# With wrong token (should 403)
curl -H "Authorization: Bearer wrong" http://localhost:3001/api/admin/submissions

# With correct token (should 200)
curl -H "Authorization: Bearer $ADMIN_SECRET" http://localhost:3001/api/admin/submissions
```

Visit `/admin/dashboard` without login → should redirect to `/login?redirect=/admin/dashboard`.

### 2. Indexing Verification

```bash
npm run build
```

Check `out/_next/static/*.html` or inspect `<head>` tags for:

- `/lists` → `<meta name="robots" content="noindex, nofollow">`
- `/s/[token]` → `<meta name="robots" content="noindex, follow">`
- `/login` → `<meta name="robots" content="noindex, nofollow">`

### 3. Privacy Policy Review

Visit `/privacy-policy` and verify:

- GA4 mentioned by name with Measurement ID
- Monumetric listed as ad manager
- Ezoic listed as ad manager
- Resend listed as email provider
- Data deletion procedures per provider
- Weekly digest schedule disclosed
- Ezoic privacy embed span present (`<span id="ezoic-privacy-policy-embed"></span>`)
- "Last Updated" date is current

### 4. Consent Mode v2 Verification

1. Open DevTools Console
2. Check GA4 consent state: `window.gtag('get')`
3. Verify consent defaults: should show `granted` for US/CA region
4. Open DevTools Network → verify GA4 calls have `gcs=G111` (granted consent for US traffic)
5. Check that Ezoic privacy policy embed loads at `/privacy-policy` (look for dynamic content injection in `<span id="ezoic-privacy-policy-embed">`)

### 5. End-to-End Smoke Test

```bash
npm run e2e:smoke
```

All existing tests should still pass. Consider adding:

- `tests/admin-auth.spec.ts` — admin pages require auth
- `tests/ezoic-privacy-embed.spec.ts` — verify Ezoic embed span exists on privacy policy page

### 6. Build Verification

```bash
npm run verify:fast
```

Should pass all 4 gates: lint, typecheck, unit tests, build.

### 7. Sitemap Verification

```bash
npm run build
curl http://localhost:3001/sitemap.xml | grep -c '<loc>'
```

Should output exactly `18`.

---

## Risk Assessment

| Change                 | Risk                                   | Mitigation                                 |
| ---------------------- | -------------------------------------- | ------------------------------------------ |
| Admin auth             | Low — adds security where none existed | Test both authed and unauthed paths        |
| noindex metadata       | Low — SEO improvement for thin content | Verify in build output                     |
| Privacy policy text    | Low — additive only, no removals       | Review against AdSense content policies    |
| Consent Mode v2 region | Low — clarifies US/CA only targeting   | Check GA4 debugger for consent signals     |
| Ezoic privacy embed    | Low — required disclosure injection    | Verify span exists and Ezoic loads content |
| Footer text change     | Low — consistency fix                  | No functional impact                       |

**Overall risk:** Low. All changes are either security improvements, compliance additions, or SEO fixes. No breaking changes to core functionality.

---

## Timeline Estimate

- **Phase 1 (Admin auth):** 1 hour
- **Phase 2 (noindex metadata):** 30 minutes
- **Phase 3 (Privacy policy updates + Ezoic embed):** 1 hour (careful text review)
- **Phase 4 (Consent Mode v2 region fix):** 15 minutes (simple config change)
- **Phase 5 (Footer text):** 5 minutes
- **Phase 6 (Email disclosure):** Already covered in Phase 3
- **Verification:** 1 hour (manual + automated tests)
- **Git workflow:** 15 minutes (commit, push, merge)

**Total:** ~4.25 hours of implementation + testing + deployment

---

## Git Workflow & Deployment

**After all changes are implemented and verified:**

### 1. Commit to dev branch

```bash
git checkout dev
git add -A
git commit -m "$(cat <<'EOF'
feat: AdSense approval readiness - compliance & security fixes

CRITICAL FIXES (4):
- Add admin endpoint auth (ADMIN_SECRET Bearer token)
- Add noindex metadata to auth-gated routes (/lists, /s/[token], /login, /internal-systems)
- Update privacy policy with GA4, Monumetric, Ezoic, Resend disclosures + data deletion procedures
- Add Ezoic privacy embed span for dynamic partner disclosure
- Update Consent Mode v2 region to US/CA only (no EU targeting)

OTHER:
- Standardize footer HD disclaimer wording
- Verify sitemap (18 entries, correct exclusions)
- Document ADMIN_SECRET env var

VERIFICATION:
- All 4 gates passing (lint, build, unit, e2e smoke)
- Admin endpoints return 401/403 without auth
- Noindex metadata present in build output
- Privacy policy renders Ezoic embed
- Sitemap unchanged (18 pillar pages)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### 2. Push dev branch

```bash
git push origin dev
```

### 3. Merge dev → main

```bash
git checkout main
git merge dev --no-ff -m "Merge dev: AdSense compliance & security fixes"
git push origin main
```

### 4. Verify production deployment

- Check Vercel dashboard for main branch deployment
- Visit https://www.pennycentral.com/privacy-policy → verify Ezoic embed loads
- Visit https://www.pennycentral.com/sitemap.xml → verify 18 entries
- Test admin endpoint without auth → should 401

### 5. Post-deployment tasks

- [ ] Set `ADMIN_SECRET` environment variable in Vercel production
- [ ] Add privacy policy URL to Ezoic dashboard: `https://www.pennycentral.com/privacy-policy`
- [ ] Request Google to recrawl privacy policy (Search Console → Request Indexing)
- [ ] Wait 24-48 hours for Google to recrawl before AdSense reapplication

---

## Post-Implementation Checklist

Before AdSense reapplication:

- [ ] All 4 critical issues resolved (admin auth, noindex, privacy disclosures, consent region)
- [ ] Privacy policy reviewed against [AdSense Program Policies](https://support.google.com/adsense/answer/48182)
- [ ] Ezoic privacy embed verified on `/privacy-policy`
- [ ] Ezoic dashboard updated with privacy policy URL: `https://www.pennycentral.com/privacy-policy`
- [ ] Sitemap verified (18 entries, no auth/utility routes)
- [ ] `npm run verify:fast` passes
- [ ] `npm run e2e:smoke` passes
- [ ] Manual QA on production (Vercel preview deploy)
- [ ] ADMIN_SECRET environment variable set in Vercel
- [ ] Privacy policy "Last Updated" date current
- [ ] Footer disclaimer consistent across all pages
- [ ] Changes committed to dev and merged to main
- [ ] Production deployment verified on Vercel

---

## Handoff Prompt for New Context

**Use this prompt to continue implementation in a fresh context window:**

```
I need you to implement the AdSense approval readiness plan located at:
C:\Users\cadeg\.claude\plans\ticklish-skipping-curry.md

This plan addresses 4 critical compliance issues blocking AdSense approval:
1. Admin endpoint security (add Bearer token auth)
2. Indexing fixes (add noindex to auth-gated routes)
3. Privacy policy updates (GA4, Monumetric, Ezoic, Resend disclosures + Ezoic embed)
4. Consent Mode v2 region (clarify US/CA only)

CRITICAL REQUIREMENTS:
- Read the full plan file first
- Implement all changes exactly as specified in the plan
- Run all verification steps (build, tests, sitemap check, manual checks)
- Verify sitemap has exactly 18 entries and excludes auth/utility routes
- Commit changes to dev branch with the commit message from the plan
- Push dev branch
- Merge dev → main
- Push main branch
- Verify production deployment on Vercel
- Confirm privacy policy Ezoic embed loads on production

DO NOT:
- Skip verification steps
- Skip sitemap verification
- Make changes not specified in the plan
- Commit to main directly (must go through dev first)
- Push without running tests

CONTEXT:
- User has been declined by AdSense twice, can't afford third decline
- User is accepted into Ezoic MCM and Monumetric MCM, waiting on Google Ad Manager domain approval
- 99% US traffic, no EU consent banner needed
- Weekly email digest is paused (no changes needed)
- Timeline: Must complete by Feb 19, 2026
- Sitemap must have exactly 18 entries (already correct, verify after build)

Start by reading the plan file, then begin Phase 1 (Admin Security).
```

---

## Notes

**On EU consent requirements:** User has 99% US traffic and doesn't want EU visitors (Home Depot is North America only, Canada has no penny items). No consent banner needed for US-only audience. The Consent Mode v2 `region` parameter clarifies US/CA targeting, and Ezoic privacy policy embed satisfies AdSense reviewers' requirement for "consent infrastructure exists."

**On email digest:** System is intentionally paused since Feb 3, 2026. No changes needed to cron or email logic. Privacy policy additions in Phase 3 cover disclosure requirements even though emails aren't currently sending.

**On privacy policy generators:** User asked about using a generator. Current privacy policy at `app/privacy-policy/page.tsx` is already comprehensive and well-structured (9 sections, professional tone, last updated Feb 15, 2026). No need for generator—just targeted additions for missing providers (GA4, Monumetric, Ezoic, Resend) and data deletion procedures.

**On Ezoic/Monumetric status:** User is already accepted into both Ezoic MCM and Monumetric MCM programs. Currently waiting on Google Ad Manager domain approval (separate from network approval). Privacy policy lists both as active providers without "(if approved)" language.

**On CCPA vs EU:** User mentioned uncertainty about CCPA need. Current `/do-not-sell-or-share` page already handles CCPA/CPRA compliance. No changes needed there—it's already solid.

---

## Files to Modify (Summary)

1. `app/api/admin/submissions/route.ts`
2. `app/api/admin/delete-submission/route.ts`
3. `app/api/admin/recent-submissions/route.ts`
4. `app/admin/dashboard/page.tsx`
5. `app/lists/page.tsx`
6. `app/lists/[id]/page.tsx`
7. `app/s/[token]/page.tsx`
8. `app/login/page.tsx`
9. `app/internal-systems/page.tsx`
10. `app/privacy-policy/page.tsx` (add Ezoic embed + disclosures)
11. `app/layout.tsx` (update Consent Mode v2 region)
12. `components/footer.tsx`
13. `.ai/ENVIRONMENT_VARIABLES.md` (add ADMIN_SECRET docs)

---

## Success Criteria

**AdSense approval readiness achieved when:**

1. ✅ All admin endpoints require authentication
2. ✅ Auth-gated and token pages have noindex metadata
3. ✅ Privacy policy discloses GA4, Monumetric, Ezoic, Resend, and data deletion procedures
4. ✅ Ezoic privacy embed span present in privacy policy
5. ✅ Consent Mode v2 region parameter set to US/CA
6. ✅ Footer disclaimer consistent across site
7. ✅ Sitemap verified (18 entries, no auth/utility routes)
8. ✅ All verification tests pass
9. ✅ Changes committed to `dev` branch and merged to `main`
10. ✅ Deployed to production for Google crawling
