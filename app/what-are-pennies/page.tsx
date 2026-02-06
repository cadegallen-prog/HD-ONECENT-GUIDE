import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "What Are Penny Items? - Home Depot $0.01 Clearance Explained | Penny Central",
  description:
    "Start here: what penny items are, why they exist, and how to hunt responsibly without drama.",
  keywords: [
    "what are penny items",
    "home depot one cent items",
    "penny clearance explained",
    "0.01 items home depot",
    "penny hunting intro",
  ],
  openGraph: {
    title: "What Are Penny Items? - Home Depot $0.01 Clearance Explained",
    description: "Start here: what penny items are and how the $0.01 clearance system works.",
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/what-are-pennies",
  },
}

const beginnerTips = [
  "Understand the basics before you chase a specific SKU.",
  "Use the app to narrow your list, then verify in-store.",
  "Treat the first few trips as learning, not winning.",
]

const advancedTips = [
  "Track clearance patterns in your local store, not just online posts.",
  "Follow category resets and seasonal transitions; they drive many pennies.",
  "Keep notes on tag dates and price endings so you can predict better over time.",
]

const categories = [
  "Seasonal leftovers",
  "Discontinued product lines",
  "Overstocked accessories",
  "Packaging changes or old versions",
  "Odd sizes or colors that did not sell",
]

export default function WhatArePenniesPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="What Are Penny Items?"
        subtitle="A beginner-friendly foundation for understanding the $0.01 clearance system."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            A penny item is a product that scans for $0.01 because it has reached the final stage of
            clearance. It is not a public promotion. It is an internal removal signal that can
            occasionally be purchased if the item is still on the shelf and the store honors the
            sale.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Why penny items exist</h2>
          <p>
            Large retailers need a way to remove old or slow-moving inventory from their system. The
            penny price is a bookkeeping step that marks the item as clearance complete. Some stores
            pull items immediately. Others miss a few, which creates the opportunity.
          </p>
          <p>
            You will hear employees and shoppers use the term ZMA to describe this removal stage.
            The exact internal label varies by store, but the idea is consistent: the item is no
            longer meant for sale.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">What happens after an item pennied out</h2>
          <p>
            Once an item reaches the penny stage, the store is expected to remove it from the floor.
            That can mean disposal, return to vendor, or other internal disposition. The key point
            for shoppers is that the item is not supposed to be available for long.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">What kinds of items become pennies?</h2>
          <p>Most penny items come from predictable places. Common examples include:</p>
          <ul className="my-6 space-y-3">
            {categories.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            High-ticket items can penny out, but it is less common. The most reliable finds are
            usually smaller items and seasonal accessories.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Can you actually buy penny items?</h2>
          <p>
            Sometimes, yes. But there is no guarantee. Store managers have discretion. Some stores
            honor the price if it scans. Others refuse because the item is marked for removal. The
            safest approach is to stay polite and accept the decision.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">
            How pennies differ from regular clearance
          </h2>
          <p>
            A deep clearance price (like $0.03 or $0.06) is still meant to sell. A penny price is a
            removal signal. That difference explains most of the confusion new hunters have.
          </p>
          <ul className="my-6 space-y-3">
            <li>Clearance deals are promotions. Pennies are internal cleanup.</li>
            <li>Clearance items are meant to be purchased. Pennies are meant to be pulled.</li>
            <li>That is why some stores honor the scan and others refuse it.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">Responsible hunting</h2>
          <p>
            Penny hunting only works long-term if shoppers behave well. Arguments with staff,
            aggressive behavior, or messy aisles lead to crackdowns that hurt everyone.
          </p>
          <ul className="my-6 space-y-3">
            <li>Be polite. Employees are enforcing store policy, not targeting you personally.</li>
            <li>Do not brag at checkout or attract attention to the price.</li>
            <li>Share accurate information in communities and avoid spreading rumors.</li>
            <li>Walk away if a sale is refused. There will be more opportunities.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">For beginners: start here</h2>
          <ul className="my-6 space-y-3">
            {beginnerTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">
            For experienced hunters: refine your game
          </h2>
          <ul className="my-6 space-y-3">
            {advancedTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mt-12 mb-6">Final mindset</h2>
          <p>
            This is part research, part timing, and part luck. The long game matters more than any
            single penny. Stay patient, stay respectful, and keep your standards high for what you
            share with the community.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Ready to start hunting?</h2>
          <p>
            The next step is learning how clearance moves through the system and how to read the
            signals without guessing. Use the chapters below to build a repeatable routine.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
              <h3 className="text-lg font-bold mb-3">Clearance Lifecycle</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Learn the common cadence patterns and how to use tag dates.
              </p>
              <Link
                href="/clearance-lifecycle"
                className="text-[var(--cta-primary)] font-semibold hover:underline"
              >
                Clearance Lifecycle
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
              <h3 className="text-lg font-bold mb-3">Labels & Pre-Hunt</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Use label signals and the app to build a smart target list.
              </p>
              <Link
                href="/digital-pre-hunt"
                className="text-[var(--cta-primary)] font-semibold hover:underline"
              >
                Labels & Pre-Hunt
              </Link>
            </div>
          </div>

          <div className="mt-12 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-4">Find current penny items</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Browse penny items reported by the community, updated throughout the day.
            </p>
            <Link
              href="/penny-list"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--cta-primary)] text-[var(--cta-text)] rounded-lg font-semibold hover:bg-opacity-90"
            >
              View the Penny List
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </Prose>

        <ChapterNavigation
          prev={undefined}
          next={{
            slug: "clearance-lifecycle",
            title: "Clearance Lifecycle & Cadence",
          }}
        />
      </Section>
    </PageShell>
  )
}
