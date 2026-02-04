import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "What Are Penny Items? - Home Depot $0.01 Clearance Explained | Penny Central",
  description:
    "Learn what Home Depot penny items are, how they work, and why products get marked down to $0.01. Complete introduction to penny hunting.",
  keywords: [
    "what are penny items",
    "home depot one cent items",
    "penny clearance explained",
    "0.01 items home depot",
    "penny hunting intro",
  ],
  openGraph: {
    title: "What Are Penny Items? - Home Depot $0.01 Clearance Explained",
    description: "Learn what Home Depot penny items are and how the $0.01 clearance system works.",
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function WhatArePenniesPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="What Are Penny Items?"
        subtitle="A complete beginner's guide to Home Depot's $0.01 clearance system."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            If you've spent any time in Home Depot communities online, you've probably heard the
            term "penny item." But what exactly is a penny item, and why would a major retailer sell
            something for just one cent? The answer is more interesting than you might think.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">The $0.01 Mystery</h2>

          <p>
            A <strong>penny item</strong> is any product in Home Depot that rings up for exactly
            $0.01 at the register. It's not a typo. It's not a glitch. It's a deliberate action by
            the retailer to mark items for removal from their inventory system.
          </p>

          <p>
            When you find an item priced at $0.01, you can typically purchase it for that price—but
            store discretion applies. Some managers honor penny sales; others may refuse. It depends
            on the individual store's policies and the manager on duty.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Why Do Penny Items Exist?</h2>

          <p>
            Penny items aren't a "secret sale" or a retailer mistake. They're part of a deliberate
            inventory management system used by large retailers like Home Depot.
          </p>

          <p>
            Here's how it works: When Home Depot wants to clear out old, damaged, or discontinued
            products from shelves, they mark them down through a series of price reductions:
          </p>

          <ul className="my-6 space-y-3">
            <li>
              <strong>First markdown:</strong> Items end in .06 (50-70% off original price)
            </li>
            <li>
              <strong>Second markdown:</strong> Items end in .03 (usually 75%+ off original price)
            </li>
            <li>
              <strong>Final markdown:</strong> Items end in .01 (the penny tier)
            </li>
          </ul>

          <p>
            When an item hits $0.01, the retail system marks it as <strong>"salvage"</strong> or{" "}
            <strong>"ZMA" (Z-Mark Out of Asset)</strong>. At this point, the item is technically
            removed from inventory—it shouldn't exist on the sales floor anymore. Employees are
            supposed to take it to a special bin for destruction or return to the vendor.
          </p>

          <p>
            But between the time the price is set and when employees collect the items, shoppers can
            find them. That's the opportunity.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Can You Actually Buy Penny Items?</h2>

          <p>
            <strong>Yes, you can.</strong> But with an important caveat: it's not guaranteed.
          </p>

          <p>
            Home Depot's policy is that individual{" "}
            <strong>store managers have final discretion</strong> on whether to honor penny sales.
            Some stores embrace it as a community benefit. Others treat it as a system error that
            shouldn't be exploited. If a manager decides an item shouldn't be sold (even at a
            penny), they can refuse the transaction.
          </p>

          <p>
            Additionally, if an employee scans an item and realizes it's a penny before it reaches
            the register, they often remove it from your cart. Store employees are usually evaluated
            on how quickly they clear salvage items, so they have an incentive to pull these
            products before they're purchased.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">What Kinds of Items Become Pennies?</h2>

          <p>Not everything is eligible for penny status. Retailers typically mark down:</p>

          <ul className="my-6 space-y-3">
            <li>Discontinued items (seasonal products no longer in the annual lineup)</li>
            <li>Damaged or open-box merchandise</li>
            <li>Overstocked items</li>
            <li>Outdated products (last season's colors or styles)</li>
            <li>Items with broken packaging</li>
          </ul>

          <p>
            Home Depot rarely marks down high-ticket items like appliances or power tools to a
            penny. Most penny items are smaller: lighting fixtures, home décor, paint, landscaping
            supplies, and seasonal products.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">The 3-Week Clearance Cycle</h2>

          <p>
            Home Depot follows a predictable markdown schedule. Once an item hits the first markdown
            (.06), it typically takes <strong>exactly 3 weeks</strong> to reach the next tier (.03),
            and another <strong>3 weeks</strong> to reach the penny tier.
          </p>

          <p>
            This is important: if you spot a shelf full of .03 items today, you can reasonably
            expect them to be pennies in three weeks. This is the strategy used by serious penny
            hunters—find the .03 items, mark your calendar, and return when they drop.
          </p>

          <h2 className="text-2xl font-bold mt-12 mb-6">Get Started</h2>

          <p>
            Now that you understand what penny items are, you're ready to start hunting. The next
            step is learning where and how to find them.
          </p>

          <div className="grid sm:grid-cols-2 gap-6 mt-12">
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
              <h3 className="text-lg font-bold mb-3">Prepare Before You Go</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Learn how to use Home Depot's digital tools to find penny items from your couch.
              </p>
              <Link
                href="/digital-pre-hunt"
                className="text-[var(--cta-primary)] font-semibold hover:underline"
              >
                Digital Pre-Hunt →
              </Link>
            </div>

            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
              <h3 className="text-lg font-bold mb-3">In-Store Tactics</h3>
              <p className="text-[var(--text-secondary)] mb-4">
                Practical strategies for finding penny items once you're in the store.
              </p>
              <Link
                href="/in-store-strategy"
                className="text-[var(--cta-primary)] font-semibold hover:underline"
              >
                In-Store Strategy →
              </Link>
            </div>
          </div>

          <div className="mt-12 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl text-center">
            <h3 className="text-xl font-bold mb-4">Find Current Penny Items</h3>
            <p className="text-[var(--text-secondary)] mb-6">
              Browse penny items reported by the community, updated throughout the day.
            </p>
            <Link
              href="/penny-list"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--cta-primary)] text-white rounded-lg font-semibold hover:bg-opacity-90"
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
      </Section>
    </PageShell>
  )
}
