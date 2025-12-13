import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Cashback and Support | Penny Central",
  description:
    "Learn how BeFrugal cashback works, from signup to payout. A complete guide to stacking savings on your normal online orders.",
}

export default function CashbackPage() {
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Cashback and Support: How BeFrugal Works"
        subtitle="The full breakdown of how BeFrugal cashback tracks, pays out, and supports Penny Central at no extra cost to you."
        primaryAction={{
          label: "Activate BeFrugal cashback",
          href: "/go/befrugal",
          external: true,
          target: "_blank",
          rel: "noopener noreferrer",
        }}
        secondaryActions={[{ label: "Back to About", href: "/about#support" }]}
        align="left"
      />

      <Section>
        <Prose>
          <p>This site is about saving money and squeezing value out of the system.</p>

          <p>
            BeFrugal is a cashback site and app that fits that mindset. It gives you money back on
            the normal online orders you were already going to make.
          </p>

          <p>
            I use it. I like it. If you sign up with my link and earn at least $10 in cashback
            within 365 days, BeFrugal gives me a one time referral bonus. It does not cost you
            anything extra.
          </p>

          <p>
            This page explains exactly how it works, what the limits are, and what you should expect
            so nothing feels sketchy or surprising.
          </p>
        </Prose>
      </Section>

      <Section title="What BeFrugal Is (and what it is not)">
        <Prose>
          <p>BeFrugal is a free cashback and coupon service.</p>

          <p>How it works in plain English:</p>

          <ul>
            <li>
              You click through BeFrugal (site, app, or extension) to a store like Home Depot,
              Lowe&apos;s, Sam&apos;s Club, Amazon, and many others
            </li>
            <li>The store pays BeFrugal a commission for sending you</li>
            <li>BeFrugal shares part of that commission with you as cashback</li>
          </ul>

          <p>
            That model is standard. Rakuten, TopCashback, and other major cashback sites work the
            same way.
          </p>

          <p>
            <strong>Important for this site:</strong>
          </p>

          <ul>
            <li>BeFrugal does not show penny items</li>
            <li>You cannot buy penny items online</li>
            <li>Penny items remain in store only, separate from anything you do with BeFrugal</li>
          </ul>

          <p>
            BeFrugal is just the &quot;catch all&quot; savings layer for everything else you buy
            online.
          </p>
        </Prose>
      </Section>

      <Section title="How It Works From Signup To Payout">
        <Prose>
          <ol>
            <li>
              <p>
                <strong>1. Create a free account</strong>
              </p>
              <p>
                Use this link so the referral bonus is tracked correctly:{" "}
                <a href="/go/befrugal" target="_blank" rel="noopener noreferrer">
                  befrugal.com (referral link)
                </a>
              </p>
              <p>No card needed, no fees.</p>
            </li>

            <li>
              <p>
                <strong>2. Optional but recommended: install the browser extension</strong>
              </p>
              <p>
                The extension pops up when you are on a supported store and lets you click
                &quot;Activate cashback&quot; so you do not forget. You can also start from
                BeFrugal.com each time if you prefer not to use the extension.
              </p>
            </li>

            <li>
              <p>
                <strong>3. Start your shopping trip from BeFrugal</strong>
              </p>
              <p>While logged in, either:</p>
              <ul>
                <li>Click a store on BeFrugal and then &quot;Shop Now&quot;</li>
                <li>
                  Or let the extension prompt you to activate when you land on a supported store
                </li>
              </ul>
            </li>

            <li>
              <p>
                <strong>4. Check that cashback is active</strong>
              </p>
              <p>
                Look for a confirmation bar or popup from BeFrugal saying cashback is activated for
                that store.
              </p>
            </li>

            <li>
              <p>
                <strong>5. Complete your order in that same tab</strong>
              </p>
              <p>Shop like normal. Avoid:</p>
              <ul>
                <li>Other coupon or cashback extensions fighting over tracking</li>
                <li>Gift card payments if the store terms say those do not earn cashback</li>
                <li>
                  Changing the order later through customer service in ways that break tracking
                </li>
              </ul>
            </li>

            <li>
              <p>
                <strong>6. Wait for tracking</strong>
              </p>
              <p>
                Most orders show as &quot;Pending&quot; or &quot;Tracked&quot; within a few days,
                sometimes up to a week.
              </p>
            </li>

            <li>
              <p>
                <strong>7. Wait for it to become payable</strong>
              </p>
              <p>
                This is the part most people do not understand. Stores only pay cashback after the
                return period has passed. In practice:
              </p>
              <ul>
                <li>
                  Expect roughly 60 to 90 days from purchase until the money is actually available
                  to withdraw
                </li>
                <li>Some stores are faster, some slower</li>
              </ul>
            </li>

            <li>
              <p>
                <strong>8. Cash out</strong>
              </p>
              <p>
                Once cashback is marked as payable, you can request a payout and choose how you want
                to be paid.
              </p>
            </li>
          </ol>
        </Prose>
      </Section>

      <Section title="Payout Options And Gift Card Boosts">
        <Prose>
          <p>BeFrugal offers several payout methods, including:</p>

          <ul>
            <li>PayPal</li>
            <li>Direct deposit (US)</li>
            <li>Venmo (US)</li>
            <li>Zelle (US)</li>
            <li>Check (US)</li>
            <li>Various eGift cards</li>
          </ul>

          <p>Some details worth knowing:</p>

          <ul>
            <li>
              PayPal and direct deposit can be used even for small balances, as long as your
              cashback is verified and payable
            </li>
            <li>Some other methods have higher minimums</li>
            <li>
              Certain eGift cards come with a boost, meaning you can turn a given cashback balance
              into a slightly higher value gift card if you already shop at that store
            </li>
            <li>Visa and Amex prepaid cards do not charge fees but expire after about 6 months</li>
            <li>Most retailer eGift cards do not expire and have no fees</li>
          </ul>

          <p>
            This is how you can quietly multiply your savings if you are already going to spend
            money at those places.
          </p>
        </Prose>
      </Section>

      <Section title="Home Depot, Lowe's, And Similar Stores">
        <Prose>
          <p>
            For this community, the interesting part is how cashback behaves at Home Depot,
            Lowe&apos;s, Sam&apos;s Club, and similar stores.
          </p>

          <p>A few things to understand:</p>

          <ul>
            <li>Cashback rates change over time and often vary by category</li>
            <li>
              Home improvement stores may pay different rates for tools, decor, seasonal items,
              services, or installation
            </li>
            <li>Some items or categories may not be eligible</li>
          </ul>

          <p>Before a bigger order, the workflow is:</p>

          <ol>
            <li>
              Open BeFrugal and search &quot;Home Depot&quot; (or Lowe&apos;s, or Sam&apos;s Club)
            </li>
            <li>Check the current cashback rate and any category notes</li>
            <li>Click &quot;Shop Now&quot; or activate via the extension</li>
            <li>Place your order as usual</li>
          </ol>

          <p>
            You do not need to obsess over single digit differences, but checking the rate takes a
            few seconds and sometimes the difference is meaningful on larger orders.
          </p>
        </Prose>
      </Section>

      <Section title="What It Does For You Versus What It Does For Me">
        <Prose>
          <p>
            <strong>For you:</strong>
          </p>

          <ul>
            <li>You get cashback on normal online orders you were going to make anyway</li>
            <li>
              Sometimes you can stack that with coupons, deals of the day, and gift card boosts
            </li>
            <li>Over a year of normal shopping, that can quietly add up</li>
          </ul>

          <p>
            <strong>For me:</strong>
          </p>

          <ul>
            <li>
              If you sign up through my link and earn at least $10 in cashback within 365 days,
              BeFrugal pays me a one time referral bonus
            </li>
            <li>I do not get a percentage of your cashback forever</li>
            <li>You do not pay higher prices or fees because of my link</li>
          </ul>

          <p>
            I am recommending it because it fits the &quot;squeeze value out of your normal
            spend&quot; mindset of this whole project. The referral bonus is how I offset some of
            the time and costs of running the site.
          </p>
        </Prose>
      </Section>

      <Section title="How To Avoid Problems And Missed Cashback">
        <Prose>
          <p>To keep things smooth and avoid &quot;where is my cashback&quot; frustration:</p>

          <ul>
            <li>
              Turn off other cashback or coupon extensions when using BeFrugal for a given purchase
            </li>
            <li>Do not rely on random coupon codes from other sites unless BeFrugal lists them</li>
            <li>Avoid paying with gift cards if the store terms say those do not earn cashback</li>
            <li>
              After a purchase, check your BeFrugal account within a week to make sure it shows as
              pending
            </li>
            <li>
              If it does not show up after 7 days, use their &quot;missing cashback&quot; form
              within the allowed time window
            </li>
          </ul>

          <p>
            Cashback services are not perfect and some orders will slip through. The point is to win
            over the long run, not stress over every single dollar.
          </p>
        </Prose>
      </Section>

      <Section title="Penny Items Versus Cashback">
        <Prose>
          <p>Penny items and cashback do not overlap.</p>

          <ul>
            <li>Penny items are in store only markdowns that do not show online</li>
            <li>You cannot use BeFrugal to find penny items</li>
            <li>You cannot buy penny items online and earn cashback on them</li>
          </ul>

          <p>
            BeFrugal is purely for the rest of your shopping. It is for when you buy normal tools,
            materials, household items, memberships, electronics, and so on.
          </p>

          <p>Think of it as:</p>

          <ul>
            <li>Penny hunting is &quot;extreme clearance treasure hunting in person&quot;</li>
            <li>
              BeFrugal is &quot;a small rebate on the more boring normal orders you already make
              online&quot;
            </li>
          </ul>
        </Prose>
      </Section>

      <Section title="Simple Example (Without Penny Items)">
        <Prose>
          <p>Example:</p>

          <ul>
            <li>Cordless combo kit and some supplies: total $200 online at Home Depot</li>
            <li>BeFrugal rate for that day and category: 5 percent</li>
            <li>You activate cashback properly and check out</li>
            <li>You see about $10 pending in your BeFrugal account within a few days</li>
            <li>Around 60 to 90 days later, that $10 becomes payable</li>
            <li>You withdraw to PayPal, or take a boosted gift card if that makes sense</li>
          </ul>

          <p>That is boring, predictable, and it stacks quietly over time.</p>
        </Prose>
      </Section>

      <Section spacing="md">
        <SupportAndCashbackCard />
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link href="/about">← Back to About</Link>
          </Button>
        </div>
      </Section>
    </PageShell>
  )
}
