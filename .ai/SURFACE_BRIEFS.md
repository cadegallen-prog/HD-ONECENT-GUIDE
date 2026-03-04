# Surface Briefs

**Purpose:** Before modifying any surface on this site, read its brief. If you can't explain how your change makes this surface better at its stated job, stop and reconsider.

**Rule:** Every agent — Claude, Codex, Copilot — must read the relevant brief before touching a surface. Update the baseline metrics and "last verified" date when you have fresh analytics data.

**Detailed audit:** `.ai/topics/SITE_RECOVERY_CURRENT.md` has the full per-route audit with strengths, weaknesses, and mobile-specific issues.

**Last updated:** 2026-03-03

---

## `/penny-list` — The Core Product

**Job:** Give returning visitors a fast, scannable, trustworthy list of current penny finds so they can decide what to hunt before going to the store.

**Who comes here:** Returning visitors (habitual checkers), Facebook group members following a link, Google searchers for specific SKUs or "home depot penny list."

**Success looks like:** High return rate. Users scan the list, click into SKU detail pages or report their own finds. Time on page is moderate (scanning, not reading). Low exit rate — users should flow to `/sku/[sku]`, `/report-find`, or `/store-finder`.

**What would make it worse:** Adding content that competes with the list for attention. Making the page heavier on mobile. Breaking the scan-first, act-second rhythm. Anything that makes a returning visitor take longer to find what they came for.

**Baseline (Jan 27 – Feb 27, 2026):** 55,782 views | 18,686 sessions | 75.5% engagement rate

**Current issues:** Too dense on mobile. Supporting sections compete with the list. Typography drift. See Site Recovery S4 plan.

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## `/` — The Front Door

**Job:** Prove to a first-time visitor in under 5 seconds that this site has real, current, verified penny data — then give them two clear paths: browse the list or learn what penny items are.

**Who comes here:** First-time visitors from Google ("home depot penny items"), Facebook group members checking out the site, returning visitors who bookmarked the homepage instead of the penny list.

**Success looks like:** Low bounce rate. Visitors quickly see proof (recent finds, community stats) and click deeper — either to `/penny-list` (utility) or `/guide` (education). The page should feel trustworthy and current, not generic.

**What would make it worse:** More explanatory text above the fold. Generic hero sections. Anything that makes the page feel like a template blog instead of a live data product. Removing or burying proof of real community activity.

**Baseline (Jan 27 – Feb 27, 2026):** 27,671 views | 12,852 sessions | 77.0% engagement rate

**Current issues:** Founder assessment: "generic, bland, no focal point, no proof imagery." Hero is text-first and passive. Most important proof is below the fold. Page explains before it proves. See Site Recovery S2 plan.

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## `/guide` — The Canonical Education Path

**Job:** Teach a beginner everything they need to know about penny hunting in one cohesive flow — what pennies are, how the system works, how to hunt safely and effectively.

**Who comes here:** New visitors who want to understand before they act. Google searchers for "home depot penny shopping guide." Users directed here from the homepage or FAQ.

**Success looks like:** Users read through the guide and leave with enough understanding to use `/penny-list` and `/report-find` confidently. High engagement rate. Clear click-through to `/penny-list` or `/report-find` at the end.

**What would make it worse:** Fragmenting the educational flow further (the beginner story is already split across `/guide`, `/faq`, and `/what-are-pennies`). Making it feel like an AI-generated chapter list instead of one authored teaching path. Adding content that doesn't serve the "beginner to confident user" journey.

**Baseline (Jan 27 – Feb 27, 2026):** 8,491 views | 5,098 sessions | 81.9% engagement rate

**Current issues:** Feels like a hub for a fragmented system, not a definitive guide. Beginner content is split across 3 routes. Chapter grid competes with the page's own explanatory role. See Site Recovery S3 plan.

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## `/report-find` — The Submission Loop

**Job:** Let a user report a penny find with minimum friction so the data flows into the penny list quickly. The core loop depends on this: more submissions = more trust = more utility = more returning visitors.

**Who comes here:** Users who found a penny item in-store and want to report it. Power users submitting multiple finds. Users directed here from `/penny-list` or `/faq`.

**Success looks like:** Fast time-to-first-action. User fills out the form and submits without needing to read explanatory content. Successful submission leads to gratification feedback (stats, confirmation) that reinforces the behavior.

**What would make it worse:** Adding more explanatory text above the form. Making the form longer or more complex. Breaking the bulk-submit flow. Anything that makes a returning submitter slower than their last visit.

**Baseline (Jan 27 – Feb 27, 2026):** 1,570 views | 1,251 sessions | 70.6% engagement rate

**Current issues:** Still front-loads more explanation than necessary. Educational copy above the form is heavier than a returning user needs. See Site Recovery S5 plan. Note: uncommitted report-find improvements exist on dev (stashed).

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## `/faq` — The Question Router

**Job:** Answer the most common beginner questions, then route the reader into the product loop (penny list, guide, or report-find). This is a search-intent landing page, not a reference archive.

**Who comes here:** Google searchers for "home depot penny items FAQ" or similar question-intent queries.

**Success looks like:** Reader gets their question answered AND clicks through to another page. Low exit rate. The page should feel helpful and then propulsive — not comprehensive to the point of being a dead end.

**What would make it worse:** Making it so thorough that users never need to visit another page. Turning it into a second guide. Removing the next-step CTAs that route users into the product loop. Adding questions that don't relate to actual search queries.

**Baseline (Jan 27 – Feb 27, 2026):** 349 views | 320 sessions | 77.2% engagement rate

**Current issues:** Overlaps with the guide system. Risk of becoming a second guide instead of a question layer. Recently improved with next-step CTAs (shipped in PR #143).

**Last verified:** 2026-03-03 (analytics baseline only, FAQ CTAs recently added)

---

## `/store-finder` — Supporting Utility

**Job:** Help a user who already knows what they want to find locate their nearest Home Depot stores. This is a supporting tool, not a core front-door feature.

**Who comes here:** Users from `/penny-list` or the guide who are ready to go to a store. Some direct traffic.

**Success looks like:** User finds their nearest stores quickly and either goes to the store or returns to `/penny-list` for more info. The page should load fast and get out of the way.

**What would make it worse:** Treating it as a core product feature when it doesn't earn that position. Making the first-load experience worse (geolocation denial is already rough). Adding complexity to a utility that should be simple.

**Baseline (Jan 27 – Feb 27, 2026):** 1,641 views | 1,413 sessions | 88.0% engagement rate

**Current issues:** First-use experience is rough, especially on mobile with geolocation denial. Over-exposed relative to its current value. `components/store-map.tsx` is flagged as fragile — do not modify without explicit approval. See Site Recovery S7 plan.

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## `/what-are-pennies` — Beginner Explainer

**Job:** Explain the basic concept of Home Depot penny items to a true beginner in a clear, approachable way. This is the "what is this?" page.

**Who comes here:** Google searchers for "what are home depot penny items." Users linked from the homepage or guide who need the basics first.

**Success looks like:** User understands the concept and clicks through to `/guide` (to learn more) or `/penny-list` (to see the current list). The page should feel definitive — after reading it, the user shouldn't still be confused.

**What would make it worse:** Making it too long or academic. Mixing time-specific content (e.g., "in 2026") with evergreen explanation so it ages badly. Letting it overlap with `/guide` to the point where neither feels definitive.

**Baseline (Jan 27 – Feb 27, 2026):** 1,250 views | 1,081 sessions | 94.7% engagement rate

**Current issues:** Role is unclear next to `/guide`. Currently the best beginner explainer on the site, but may be absorbed into a rebuilt canonical guide (S3). See Site Recovery S3 plan.

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## `/sku/[sku]` — Product Detail Pages

**Job:** Give a user everything they need to know about one specific penny item — is it real, where has it been found, what does it look like, how much does it normally cost.

**Who comes here:** Google searchers for specific SKUs. Users clicking from `/penny-list` for more detail. Users sharing specific finds in the Facebook group.

**Success looks like:** User gets the information they need and either goes to Home Depot's site (outbound click), reports their own find, or goes back to browse more items. High engagement rate because the user came with specific intent.

**What would make it worse:** Making the pages feel thin or auto-generated. Losing the community-sourced data that makes them trustworthy. Breaking the link back to `/penny-list`.

**Baseline (Jan 27 – Feb 27, 2026):** Top SKU pages get 500-2,500 views each | 85-94% engagement rate (very high — specific intent)

**Current issues:** Generally strong. Individual pages are the site's long-tail SEO surface.

**Last verified:** 2026-03-03 (analytics baseline only, no code changes)

---

## How to Use These Briefs

1. **Before modifying a surface:** Read its brief. Understand its job.
2. **While working:** Ask yourself: "Does this change help or hurt this surface's stated job?" If you're not sure, that's a signal to stop and think.
3. **After shipping:** Update the "last verified" date and note what changed. If you have fresh analytics, update the baseline.
4. **When adding a new surface:** Write a brief before building it. If you can't articulate the job, the surface probably shouldn't exist.
