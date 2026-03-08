# Monumetric tags, slot counts, and mobile-safe ad layouts for PennyCentral

## The core mental model you’ve been missing

What you’re running into is a pretty normal “ad-tech wiring” confusion: there’s usually an **engine** (the global script) and there are **parking spots** (the on-page placeholders where ads are allowed to render).

On Monumetric’s side, they describe implementation as installing “tags” and note that most publishers have Monumetric install and test those tags for them.citeturn33view0turn33view1 In real-world implementations, those “tags” are often a combination of:

- A **global script** (commonly placed in the `<head>`) that initializes their ad system.
- **Placement tags** (placeholders) distributed through the page where ad units are allowed to appear.

That second piece is the part you didn’t realize you might need: if your setup expects placeholders and they’re missing, **you can end up with “only some ads sometimes”** (often the special “in-screen/sticky” types), while in-content and layout-integrated units never reliably show.

Monumetric also explicitly frames placements as something you decide together during onboarding, based on what you want on desktop and mobile, and they set up the site accordingly. They also say publishers have final control over the setup in general, while they advise based on what performs well.citeturn33view0turn37view1

## How Ascend and “Demand Fusion” actually relate to the controls you see

Two things can be true at the same time:

- The **Ascend Program** is a managed, “we do the ad ops for you” service, where they highlight professional implementation/support, a shared ad-ops team, and access to ad types and technology.citeturn37view0turn37view1
- Monumetric markets **DemandFusion** as a “managed header bidding platform” with a “powerful interface” for publishers who want “complete control,” and they list a huge set of tweakable knobs like device strategy, refresh controls, smart zones, and unfilled-zone handling.citeturn31view0turn37view2

On the **Ascend Program page**, Monumetric explicitly says Ascend sites “receive our industry-leading ad-serving technology, Demand Fusion.”citeturn37view1 That supports the idea that Demand Fusion is “in the stack” for Ascend.

But the **DemandFusion product page** is also very clearly pitched as a product with a “powerful interface” and “complete control,” aimed at “independent publishers” who want to manage monetization strategy deeply.citeturn31view0turn37view2

So if your Monumetric console only shows a small set of toggles like “collapsing” vs “non-collapsing + shadow,” that aligns with a plausible split:

- **DemandFusion as underlying technology** (running the auctions, refresh logic, etc.), included as part of Ascend.citeturn37view1
- **A much more limited self-serve surface area** in the Ascend console for you, with many of the deeper knobs staying behind the “managed service” layer unless they grant more tooling to your account. This interpretation is consistent with your lived experience and with how their pages differentiate “program” marketing from “platform interface” marketing.citeturn37view1turn37view2

That “non-collapsing + shadow” language you’re seeing is also echoed on the DemandFusion page, where they describe unfilled-zone behavior choices like collapsing the DIV or keeping a “shadowbox” to prevent CLS.citeturn37view2turn23search0 This is an important clue: even if you can’t edit refresh caps, you might still be seeing some subset of DemandFusion-style configuration.

## Head script vs body placeholders, explained in plain English

Based on the snippet you have (the one with `//monu.delivery/...` and then a set of `<div id="mmt-..."></div>` blocks), your setup is in the classic pattern:

- The **head script** loads the Monumetric runtime (“engine”).
- Each **body placeholder block** is a specific allowed placement (“parking spot”) where Monumetric is allowed to render an ad.

Why a head script alone often can’t solve “where ads go”  
A head script can absolutely inject elements into the DOM if it’s configured to do so, but if Monumetric wants ads to appear _inside your layout_ (header area, sidebar rail, between content sections), they often need stable anchors. This is exactly why “tags” typically come in multiple pieces, and why Monumetric emphasizes installing “the tags,” not just “a tag.”citeturn33view0turn33view1

Why your in-content units might “hardly function”  
If the current site has the head script installed but **the specific in-content placeholders aren’t actually present on the routes where you expect them**, you can see:

- occasional ads that use special injection (sticky/in-screen),
- inconsistent fill,
- and missing in-content placements.

That would match your symptoms without requiring anything “mystical” to be wrong.

## Your “50 times on one page” question: what usually happens

You’re asking the right question: “If I paste this slot code N times, do I get N ads?”

There are three different scenarios, and they behave very differently.

### Repeating the exact same placeholder (`id="mmt-…"` / same UUID) many times

This is where the “50 times” idea usually breaks down.

HTML `id` values are supposed to be unique within a document.citeturn39view0 If you repeat the same Monumetric placeholder code 50 times, you are effectively producing 50 elements with the same `id`, which makes the DOM ambiguous and can lead to non-deterministic behavior.

In practice, many ad tag implementations locate the container using something like `getElementById`, which returns a single element, not 50. That means:

- you might only ever get a creative in the _first_ one,
- or you might see flicker as scripts fight over a single interpreted location,
- or you might get “some weird combination of empty slots and occasional renders.”

Even when ad systems attempt to handle “repeatable” placements, they often do it through **a different mechanism** than duplicating identical `id` values. The word “repeatable” in your Monumetric comment label is not, by itself, proof that the same exact block should be duplicated across the same page.

### Adding many different placeholders (each with a different unique `id`) on one page

If you had 50 unique placeholders, then from a pure “page markup” perspective, you’ve created 50 legal “parking spots.”

At that point, whether you see 50 ads is usually governed by a combination of:

- whether those placements are actually configured/recognized on Monumetric’s side (their “custom ad-setup”),citeturn33view0turn37view1
- whether there is enough demand to fill them (fill rate and market conditions),
- and whatever ad-density or policy guardrails are active in the stack.

Monumetric’s own language suggests every publisher’s setup is custom and has tradeoffs (pros/cons), and that onboarding builds a custom ad setup around your goals.citeturn33view0turn37view1 That strongly implies the backend configuration matters a lot, even if the frontend presents “slots.”

### “If Monumetric configured 3 in-content ads per page, and I paste 4 placeholders, do I get 3 or 4?”

There isn’t a single guaranteed answer publicly documented as “Monumetric always does X” (because they treat the system as managed/custom), but the typical behaviors in managed header bidding setups are:

- **Only configured placements fill reliably.** Extra placeholders can remain empty (and whether they collapse or remain as shadowboxes depends on your unfilled/CLS config).citeturn33view0turn37view2
- Unfilled behavior like “collapse DIV” vs “shadowbox” is explicitly called out as a configurable dimension in their DemandFusion description.citeturn37view2turn23search0

So, the safer way to think about it is:

- A placeholder is “permission to show an ad here.”
- It is not necessarily “a guarantee that an ad will show here,” and certainly not “a guarantee that it will show 50 times.”

## What you can reasonably tell your agentic coder it can and can’t control

This part matters, because your coder-agent is currently hallucinating “direct control” over creative selection and ad behavior.

Monumetric explicitly says:

- They install/test the tags for most publishers (or you can install them).citeturn33view0turn33view1
- You can block categories/advertisers/URLs, with defaults for “sensitive categories.”citeturn33view0turn33view1
- You have final control over your site’s ad setup, while they give suggestions and configure it based on your goals.citeturn33view0turn33view1
- The only program with an explicit minimum is Propel (minimum 6); otherwise Monumetric says they have no set requirements and each publisher’s threshold is different.citeturn33view0turn33view1

Separately, their DemandFusion product pitch describes controls like device strategy (including disabling zones per device) and elaborate refresh controls as platform features.citeturn37view2turn31view0 But whether those are exposed _to you_ in-console as an Ascend publisher appears account-dependent in practice, and your experience suggests your console surface area is narrower.

So a good, non-overpromising framing for your agentic coder is:

- Things that are “site-code controllable” are mostly about: **whether the Monumetric runtime is present**, **whether the placeholders exist**, **where placeholders sit in layout**, **CSS sizing/reserved space**, and **whether something in your stack breaks their scripts**.
- Things that are “typically Monumetric-controlled” are closer to: **auction behavior**, **what creative shows**, **fill rate**, and any deep refresh logic beyond what your console actually exposes.

### One more critical constraint: Next.js navigation and “ads not refreshing”

If you’re using a root layout style architecture, shared UI (and global scripts) can stay mounted across route transitions, and layouts can preserve state and not rerender on navigation.citeturn22search2 That is fantastic for UX, but it’s also a classic source of “ad stack doesn’t re-init on page changes” problems, because the third-party system may expect a full page load.

Next.js’s own docs also emphasize that scripts added globally load once, even as users navigate.citeturn22search12 That can be good, but if the ad system expects a “new page” signal for in-content units, you can get exactly what you described: stale, blank, or non-refreshing units.

This isn’t “you did it wrong.” It’s a known friction point between SPA-like routing and ad systems that were originally designed around full reloads.

## Mobile-first best practice guidance for iOS and Android ad sizing and CSS

Given your traffic is 85–90% mobile, the “best practices” that usually move the needle are less about “finding the perfect ad network secret knob,” and more about:

- preventing layout shift,
- ensuring the container is large enough for the ad sizes you’ve enabled,
- allowing safe-area padding for sticky units,
- and avoiding optimizers that reorder scripts.

### Reserve space to reduce flicker and CLS

Google’s web.dev guidance on CLS explicitly calls out ads as late-loading content and recommends reserving space, using `min-height` or `aspect-ratio`, and using media queries to handle different ad sizes across form factors.citeturn23search0

This matters directly for your symptoms (flicker, jumpiness, “tacky” experience).

In practice, publishers often choose one of these approaches per ad “slot type”:

- A **stable, fixed-height container** when the slot is intended to be a fixed banner size.
- An **aspect-ratio strategy** when multiple responsive sizes might land, while still protecting layout.citeturn23search0

### Don’t make the container smaller than the ad

Even though this Google doc is about mobile ad SDK banners, the underlying layout logic translates: if the container can’t fit the ad size, the ad may not render (and you get “missing ads” that look like mysterious fill problems).citeturn23search1

If your mobile placements are intended for common sizes like 320×50, 320×100, and 300×250, those are standard reference points that show up in Google’s banner size tables.citeturn23search1

### Use safe-area padding for sticky footer units on iOS

If you ever run a sticky footer unit (or anything fixed to the bottom), iOS devices with home indicator/notches can cover content unless you account for safe areas.

MDN documents the `env(safe-area-inset-bottom)` variable as a way to avoid having bottom-fixed UI obscured.citeturn23search2turn23search15

### If you’re on Cloudflare, understand why `data-cfasync="false"` shows up

Your Monumetric script tags include `data-cfasync="false"`. Cloudflare documents that this attribute tells Rocket Loader to ignore a script.citeturn21search1

That doesn’t automatically mean Cloudflare is the problem, but it’s a strong hint: certain performance layers can reorder execution, and ad scripts are extremely sensitive to load order.

### How to “scale” across the messy universe of phone sizes

A pragmatic mobile-first approach is usually:

- Keep the ad container **responsive in width** (`width: 100%`), but constrain how wide it can get when you want a centered “banner-like” appearance.
- Reserve height based on what you intend, and switch height rules at breakpoints.

web.dev explicitly notes you may need media queries to account for differences in ad/placeholder sizes across form factors.citeturn23search0

## Notepad block you can hand to your agentic coder

```text
Context: Monumetric ad delivery and why ads are weird

Monumetric’s own FAQ says:
- They typically install and test “the tags” for publishers, but some install themselves.
- Propel has a minimum of 6 ads; otherwise there’s no “set requirement,” and setup is customized.
- Publisher can block categories/advertisers/URLs and has final say on their site.
(Use: https://www.monumetric.com/frequently-asked-questions/)

Ascend specifics:
- Ascend lets you choose ad types on desktop and mobile during onboarding and says the site receives “Demand Fusion” ad-serving technology.
(Use: https://www.monumetric.com/ascend-program/)

DemandFusion product page describes lots of knobs (device strategy, refresh, smart zones, unfilled-zone behavior), but it’s marketed as a “publisher-first interface” product and may not all be exposed in the Ascend console UI.
(Use: https://www.monumetric.com/demandfusion/)

Key concept:
- Head script = initializes the system.
- Body placeholders = explicit “allowed placements” where ads are allowed to render (unless Monumetric is set up for auto-insertion).

Monumetric head script to verify exists exactly once per page:
<script type="text/javascript"
        src="//monu.delivery/site/1/d/65ab12-7f57-43c6-a5b7-76b6b4c6548c.js"
        data-cfasync="false"></script>

Body placeholder slot IDs Cade received (verify whether any are actually present in the rendered DOM):
- Video Ad:                fd66fcce-8429-428b-b22d-8bac5706a731
- Sticky Sidebar:          5f725bea-07f8-4fed-b9dd-bb609c80609e
- Middle Sidebar Flex:     c243b456-5b7f-4065-8c5e-dac26a8978c4
- Top Sidebar Flex:        b3dc56d1-75b2-4f5b-be74-9a19a17434c1
- Pillar Left:             785d6c5a-f971-4fa0-887e-fe0db38eadfd
- Footer In-screen:        45ff9f95-5cad-4e88-bac8-d55780b1049f
- In-content Repeatable:   39b97adf-dc3e-4795-b4a4-39f0da3c68dd
- Header In-screen:        8c9623fb-51f8-48ac-b124-550e1f0b3888

Important constraint:
- HTML IDs are supposed to be unique. Duplicating the same <div id="mmt-..."> multiple times on one page is likely to be unreliable.
(MDN: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/id)

What to verify before changing anything:
- Is monu.delivery script present on the page? Is it present more than once?
- Are any mmt-* placeholder DIVs present in the rendered DOM? Which ones?
- Are there console errors or CSP violations blocking inline scripts or third-party script loads? (CSP script-src blocks inline unless allowed.)
(MDN script-src: https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/script-src)

Non-prescriptive hypothesis for “why only 1 mobile ad sometimes”:
- Possibly only the in-screen/sticky style is being inserted and in-content placeholders are missing.
- Or the container sizing/CSS makes common mobile sizes not fit, so units fail to render.
- Or SPA navigation means the ad stack doesn’t re-init cleanly on route changes.

Mobile best practices references:
- Reserve space for ads to reduce CLS/flicker (min-height / aspect-ratio + media queries): https://web.dev/articles/optimize-cls
- iOS safe area for sticky footer: https://developer.mozilla.org/en-US/docs/Web/CSS/env
- Common mobile sizes (320x50, 320x100, 300x250): https://developers.google.com/admob/android/next-gen/banner/fixed-size
- data-cfasync="false" is used to bypass Cloudflare Rocket Loader for a specific script: https://developers.cloudflare.com/speed/optimization/content/rocket-loader/ignore-javascripts/
```

## What I would treat as the “most likely truth” until your agent verifies otherwise

- Your Ascend plan is not “unlimited ads just because you paste 50 placeholders.” It’s a **custom setup** with tradeoffs, and Monumetric themselves describe onboarding as building a custom ad setup based on your goals.citeturn33view0turn37view1
- Pasting the same placeholder block repeatedly is unlikely to produce repeated ads because HTML `id` must be unique.citeturn39view0
- The presence of only “collapse vs non-collapse + shadow” options in your console is consistent with the idea that you have **some** configuration surface exposed, but not necessarily the full “publisher-first interface” described on their DemandFusion product page.citeturn37view1turn37view2
- For mobile UX, the biggest avoidable “flicker/tacky” contributor is often layout instability from late-loading or resizing ad frames, and web.dev’s recommendation to reserve space for ads is directly relevant.citeturn23search0
