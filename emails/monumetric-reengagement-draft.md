# Email to Samantha — Monumetric Re-Engagement

**To:** Samantha Melaney  
**Subject:** Getting Monumetric Back Up — Updated Plan + Call Request

---

Hey Samantha,

Hope things are going well on your end. Wanted to give you an update on where we're at with the Monumetric integration and talk about getting things running again.

So after we went live on Feb 25th, we ran into some pretty serious problems that forced us to turn everything off on our end. Our engagement tanked almost immediately — average session time dropped from about 1:50 down to 22 seconds, which is basically unusable. Here's what was happening:

- There was a sticky header ad that was sitting right on top of our mobile menu button. 84% of our traffic is mobile, so that essentially locked people out of navigating the site at all.
- A full-screen vignette ad started firing when users tried to navigate between pages. It completely blocked all interaction — people couldn't tap anything, couldn't close it, couldn't do anything.
- Ads were showing up on our submission page (/report-find), which is where users submit penny finds. That's our core conversion flow and it needs to stay clean.

We had to pull the plug to stop the bleeding. Monumetric has been disabled on our site since Feb 27th.

That said — we absolutely want to get this back up and running. We just need to make sure these issues don't happen again.

---

## What I need from your team (these are hard requirements, not suggestions)

I want to be upfront: these aren't preferences or guidelines. These are non-negotiable rules that must be followed for us to keep Monumetric enabled. If any of these are violated after re-enablement, we'll have to shut things down again.

**Formats that must NOT run on our site, period:**

- No sticky header ads — the last one literally broke our navigation
- No interstitials or vignettes — the Google vignette made our site completely unusable
- No autoplay video — we might explore VOLT down the road for our guide content, but not right now
- No pop-ups, overlays, expandable ads, or anything that covers content or shifts the page layout

**Other hard rules:**

- Ad refresh rate has to be 60 seconds minimum. Nothing faster.
- Maximum 5 ad units per page on mobile, maximum 5 on desktop.
- These pages need to be completely ad-free (both mobile and desktop):
  - /report-find (our main conversion page)
  - /store-finder (interactive tool)
  - /support and /contact
  - /privacy-policy, /terms-of-service, /do-not-sell-or-share
  - /login and anything under /auth/
  - /admin/ and /api/
  - /lists/ (personal saved lists)
  - /unsubscribed

---

## What I'd love your team's help with

Within those rules, I genuinely want your team to optimize however you think will earn the most. You guys know the demand side way better than I do, and I don't want to micromanage placements when that's your expertise.

Some thoughts on direction, though — happy to discuss on a call:

**Mobile:**

- A dismissible sticky footer (320x50) at the bottom seems like a natural fit since there's nothing else down there
- In-content section break ads between content blocks work well for us — we just don't want ads breaking up the middle of our penny list while people are scanning through items
- Anything that feels like it belongs on the page rather than being bolted on

**Desktop:**

- A leaderboard below the header makes sense
- Same section break approach as mobile
- Open to sidebar/right-rail stuff if you think the revenue justifies us adjusting our layout for it

**Both:**

- Native/in-feed formats would be great where possible
- We'll handle styling the ad containers on our side to match the rest of the page

Beyond that — ad sizes, demand partners, bidding strategy, seasonal adjustments — that's your wheelhouse. Do what works.

---

## How we'll turn things back on

We've got an environment flag that controls whether the Monumetric script loads. Once you let me know the configuration above is in place, here's what we'll do:

1. Turn it on in staging first
2. Run our automated tests to make sure the banned formats aren't present and excluded pages are clean
3. If that checks out, push to production
4. Monitor engagement for the first week
5. If everything's stable, we keep rolling

If we see the same problems come back — blocked nav, vignettes, ads on excluded pages — we'll have to shut it down again and figure it out from there. I'm optimistic we can get this right though.

---

## Can we jump on a call?

There's a bunch of stuff I'd rather talk through than type out — like what options we might not be taking advantage of on the Ascend tier, whether VOLT makes sense for our guide pages eventually, how to think about sidebar ads, and just generally how to get the most out of this partnership.

Would you have 20-30 minutes this week or next? I'm pretty flexible.

---

Looking forward to getting things moving again. Let me know if you have questions about any of this.

Thanks,
Cade
