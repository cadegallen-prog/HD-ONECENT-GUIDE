import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Inside Scoop on Penny Items - Employee Insights | Penny Central",
  description:
    "What really happens behind the scenes. Learn about ZMA policies, salvage processes, and the internal life of a penny item.",
}

const insights = [
  {
    title: "The ZMA Bin",
    content:
      "ZMA stands for 'Z-Marking Out of Asset'. When an item hits $0.01, the system generates a task for employees to find and move it to this bin. Once in the bin, the item is destroyed or processed for return to the vendor.",
  },
  {
    title: "Inventory Accuracy",
    content:
      "Store inventory numbers are notoriously bad for clearance. If a system shows 4 items, but you can't find them, they might be in a ZMA cart in the back, sitting in the return-to-vendor staging area, or just lost.",
  },
  {
    title: "Don't Blame the Staff",
    content:
      "Employees are literally evaluated on how quickly they can clear out 'salvage' (penny) items. If they take an item from your cart, they aren't 'stealing' it—they are doing their job.",
  },
]

export default function InsideScoopPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="The Inside Scoop"
        subtitle="Understanding the internal mechanics of retail salvage and inventory management."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            To the customer, a penny item is a lucky find. To the store management, it's a failure
            to clear inventory—a 'salvage' item that should no longer be on the sales floor.
          </p>

          <h2 className="text-2xl font-bold mb-12">Behind the Scenes</h2>

          <div className="space-y-12 mb-16">
            {insights.map((insight, idx) => (
              <div key={idx} className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
                <h3 className="text-xl font-bold mb-3">{insight.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{insight.content}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Why Pennies Exist</h2>
          <p className="mb-6">
            Retailers use 'The Penny' as a hard stop. It's a signal to the computer system that the
            item is worth exactly zero in terms of expected sales revenue. This allows the store to
            'write off' the item for tax or insurance purposes before it is physically disposed of.
          </p>
        </Prose>

        <div className="mt-16 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Master the Lifecycle</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
            Want to see the steps an item takes before it hits the ZMA bin? Check out our breakdown
            of the pricing sequence.
          </p>
          <Link
            href="/clearance-lifecycle"
            className="inline-flex items-center gap-2 font-bold text-[var(--cta-primary)] hover:underline"
          >
            Read: The Clearance Lifecycle
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
