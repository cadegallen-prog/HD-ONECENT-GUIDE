import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Penny Hunting Facts vs Myths - The Truth Explained | Penny Central",
  description:
    "Separating penny hunting facts from internet myths. Learn the reality of 'secret sales', employee policies, and markdown signals.",
}

const comparisons = [
  {
    fact: "Penny items ring up as $0.01 because they are marked for removal from inventory.",
    myth: "Penny items are 'secret sales' that Home Depot wants customers to find.",
  },
  {
    fact: "Individual store managers have the final say on whether to honor a penny sale.",
    myth: "Stores are legally required to sell you any item at the price it rings up.",
  },
  {
    fact: "Most penny hunters scan items manually or use the Home Depot app.",
    myth: "There is a secret 'penny master key' or special code to find everything.",
  },
  {
    fact: "Employees are usually instructed to pull penny items and destroy them (ZMA).",
    myth: "Employees buy all the penny items before customers can get to them.",
  },
  {
    fact: "Legacy markdowns often followed Cadence A/B patterns, but 2026 Store Pulse can compress or skip stages based on real-time inventory pressure.",
    myth: "There is still a reliable 3-week schedule you can plan around.",
  },
  {
    fact: "The $0.02 price point can act like a short buffer window that signals the item is scheduled to be pulled by MET.",
    myth: "$0.02 means you have plenty of time before it becomes a penny.",
  },
  {
    fact: "In many stores, the best penny candidates are in (or near) their Home Bay — and items with 'No Home' status are often being cleared aggressively.",
    myth: "Clearance endcaps are the most reliable place to find pennies in 2026.",
  },
  {
    fact: "Penny scans can trigger internal auditing (often called Zero-Comm reports), which is why many cashiers pause or call a manager.",
    myth: "If it scans for $0.01, the cashier must complete the sale no questions asked.",
  },
  {
    fact: "Operational timing matters: MET workdays and bay resets can wipe out penny-eligible items quickly.",
    myth: "Timing doesn't matter — penny items sit around for weeks.",
  },
]

export default function FactsVsMythsPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Facts vs. Myths"
        subtitle="Separating community misinformation from verified store policies and patterns."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            Internet groups are full of rumors about how penny shopping works. To be a successful
            and responsible hunter, you need to understand the dry, mechanical reality of retail
            inventory systems.
          </p>

          <h2 className="text-2xl font-bold mb-12">Common Misconceptions</h2>

          <div className="space-y-12">
            {comparisons.map((item, index) => (
              <div key={index} className="grid md:grid-cols-2 gap-6 items-start">
                <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--status-error)]">
                  <h3 className="text-[var(--status-error)] font-bold uppercase tracking-tight text-sm mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" y1="9" x2="9" y2="15" />
                      <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    The Myth
                  </h3>
                  <p className="text-[var(--text-primary)] font-medium leading-relaxed">
                    "{item.myth}"
                  </p>
                </div>
                <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)]">
                  <h3 className="text-[var(--cta-primary)] font-bold uppercase tracking-tight text-sm mb-2 flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    The Fact
                  </h3>
                  <p className="text-[var(--text-primary)] leading-relaxed">{item.fact}</p>
                </div>
              </div>
            ))}
          </div>
        </Prose>

        <div className="mt-16 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Master the Hunt</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
            Want to see exactly how the markdown patterns work? Our Guide to the Clearance Lifecycle
            breaks down the numbers so you can stop guessing.
          </p>
          <Link
            href="/clearance-lifecycle"
            className="inline-flex items-center gap-2 font-bold text-[var(--cta-primary)] hover:underline"
          >
            Read: Understanding the Clearance Lifecycle
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Section>
    </PageShell>
  )
}
