# Final Email - Ready to Copy/Paste

Subject: PennyCentral - Getting Monumetric Back Online + Call Request

---

Hey Samantha,

Hope things are going well. I wanted to give you an update and talk about getting Monumetric running again on PennyCentral.

After we went live on Feb 25th, we had to shut everything down. The site became unusable almost immediately. Here's what happened:

- A sticky header ad was sitting directly on top of our mobile navigation button. 84% of our traffic is mobile, so this locked people out of the entire site.
- A full-screen vignette/interstitial ad fired during page navigation. It blocked all user interaction completely. Visitors couldn't tap, click, or do anything until it dismissed itself.
- Ads were appearing on our submission page (/report-find), which is our core conversion flow where users contribute content to the site.

The result was brutal. Average session engagement dropped from about 1 minute 50 seconds down to 22 seconds. We had to disable the Monumetric script to stop the damage. It's been off since Feb 27th.

I want to get this back up and running. But I need to make sure these problems don't repeat. Here's what I need.

HARD REQUIREMENTS (non-negotiable)

These are not suggestions or preferences. These are rules that have to be followed for us to keep Monumetric enabled. If any of these get violated after we re-enable, we will shut things down again immediately.

Banned formats:

- No sticky header ads. The previous one broke our mobile navigation entirely.
- No interstitials, vignettes, or full-screen overlays of any kind. The Google vignette made our site completely unusable.
- No autoplay video ads. We may consider VOLT for our guide content in the future, but not right now.
- No pop-ups, expanding ads, pushdown formats, or anything that covers content or shifts the page layout.

Other hard rules:

- Minimum 60 second ad refresh rate. The 10-15 second refresh that was running before made the page feel jittery and chaotic.
- Cap each ad slot to 2-3 refreshes per user session. No unlimited refreshing.
- Maximum 5 ad units per page on both mobile and desktop.
- All ad containers must reserve their height before the ad loads so the page doesn't jump around when ads appear.

Pages that must be completely ad-free (no formats whatsoever, mobile and desktop):

- /report-find (our primary submission/conversion page)
- /store-finder (interactive map tool)
- /support and /contact
- /privacy-policy, /terms-of-service, /do-not-sell-or-share
- /login and anything under /auth/
- /admin/ and /api/
- /lists/ (users' personal saved lists)
- /unsubscribed

YOUR TEAM'S EXPERTISE

Within those rules, I genuinely want your team to optimize however you think will earn the most. You know the demand side far better than I do, and I'm not trying to micromanage placements.

Some direction on what I think would work well (happy to adjust based on your input):

Mobile (84% of our traffic):

- A dismissible sticky footer ad (320x50) at the bottom makes sense. There's nothing competing for that space on our end.
- In-content ads at natural transition points between content sections. We just don't want ads inserted in the middle of our penny list while people are scanning through items.
- Formats that feel like they belong on the page rather than being bolted on.

Desktop:

- A leaderboard (728x90) below the site header is standard and expected.
- Same in-content approach as mobile at section breaks.
- Open to sidebar/right-rail ads if your team thinks the revenue justifies it. Our layout is full-width right now, but we can talk about adding a sidebar column for desktop.

Both:

- Native/in-feed ad formats where possible.
- Each ad slot should have a small "Advertisement" label for transparency.

Beyond that, ad sizes, demand partners, bidding strategy, seasonal adjustments, that's all your wheelhouse. Do what works best.

One more thing: I want to discuss blocking low-quality ad categories. On the initial launch we were getting health clickbait, "one weird trick" type advertisers, and similar bottom-barrel creatives. Our audience is engaged Home Depot shoppers, not clickbait consumers. I'd like to talk through which categories we can block.

HOW WE'LL TURN THINGS BACK ON

We have a feature flag on our end that controls whether the Monumetric script loads. Once you confirm the configuration above is in place:

1. We turn it on in our staging environment first
2. We run automated testing to verify the banned formats aren't present and excluded pages are clean
3. If testing passes, we push to production
4. We monitor engagement for the first 7 days
5. If everything is stable, we keep rolling and you optimize from there

If we see the same problems come back (blocked navigation, vignettes, ads on excluded pages), we'll have to shut it down again and figure it out from there.

LET'S SET UP A CALL

There's a lot I'd rather talk through than type out. Things like what Ascend-tier options we might not be taking advantage of, whether VOLT makes sense for our guide pages down the road, how to think about ramping up over time, and how to maximize revenue without crossing the line where ads hurt the user experience.

Would you have 20-30 minutes this week or next? I'm flexible on timing.

Looking forward to getting this moving again. I'm confident we can find a setup that works well for both sides.

Thanks,
Cade
PennyCentral.com
