# SEO

## CURRENT STATUS

- ✅ Basic site structure + sitemap complete
- ✅ Homepage + Guide + Penny List indexed (3 target pages)
- ✅ Daily users: 680 (up 3.5x from Jan 9)
- 🔄 **P0-3 in progress:** Schema markup (FAQ, HowTo) + internal linking
- ❌ Zero non-branded organic clicks (all 80 clicks are "penny central" branded)
- Position 11.6 for "home depot penny list" (Page 2 target keyword)
- **Blocker:** SEO search visibility depends entirely on Facebook referral (28% of traffic)

---

## LOCKED DECISIONS

- Target keywords: "home depot penny list", "penny items home depot", "how to find penny items"
- Schema types: FAQ on `/guide`, HowTo on `/guide`
- Internal link pattern: `/guide` ↔ `/penny-list` ↔ homepage, all bidirectional
- Sitemap: includes state-based pages + intent landing pages + core 3
- H1 on `/guide`: "Find Home Depot Penny Items in 5 Minutes"
- Metadata: All pages have descriptive `og:title` + `og:description`

---

## OPEN QUESTIONS

1. **Mediavine ad placement impact on rankings?**
   - Option A: Wait 30 days for analytics before optimizing
   - Option B: Monitor weekly and adjust if CTR drops
   - Option C: Suppress ads on key pages, keep on secondary

2. **Link to Home Depot product pages?**
   - Option A: No (avoid competitor siphoning)
   - Option B: Yes, but no-follow (SEO pass-through, user help)
   - Option C: Yes, follow (full SEO pass-through)

3. **Blog/content strategy timeline?**
   - Option A: Start after schema is live (2-3 weeks)
   - Option B: Start immediately with pillar content
   - Option C: Skip blog, focus only on on-page optimization

---

## NEXT ACTIONS

1. **Add FAQ schema to `/guide`**
   - Use existing Q&A structure from Section II-III
   - Mark up with `<script type="application/ld+json">` + FAQ schema
   - Validate in Google Rich Results Test
   - Target: [Link to PR when ready]

2. **Add HowTo schema to `/guide`**
   - Steps: "How to Find Penny Items in 5 Minutes"
   - Mark up with HowTo schema (step order, images, durations)
   - Validate in Google Rich Results Test
   - Target: Same PR as FAQ

3. **Wire internal links (bidirectional)**
   - `/guide` → `/penny-list` (2-3 contextual links)
   - `/penny-list` → `/guide` (banner or footer link)
   - Homepage → both (hero + secondary nav)
   - Run Lighthouse to verify no broken links

4. **Verify H1 + meta descriptions**
   - `/guide`: H1 = "Find Home Depot Penny Items in 5 Minutes" (current)
   - `/penny-list`: H1 = "Today's Penny Finds" (current, may need update)
   - `/`: H1 = "Penny Central" (current)
   - All 3 have unique, keyword-rich `og:description`

5. **Submit updated sitemap to Google Search Console**
   - After all schema + links are live
   - Monitor new impressions in GSC (2-4 week lag)
   - Expected impact: +2-3% CTR at position 11.6 after rich snippets

---

## POINTERS

- **Deep doc:** `.ai/SEO_FOUNDATION_PLAN.md` (full plan + analytics breakdown)
- **Constraints:** `.ai/CONSTRAINTS.md` (color tokens, don't break existing UX)
- **Search Console data:** `.ai/BACKLOG.md` (current metrics: 80 clicks, position 11.6)
- **Implementation plan:** `.ai/impl/seo-schema-markup.md` (when architected)
- **Related:** MONETIZATION topic (ad placement timing)

---

## Archive References

- None yet (this topic is active)
