import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Home Depot MET Team & Bay Reset Calendar 2026 | Penny Central",
  description:
    "Behind the scenes: MET teams, Zero-Comm reports, ZMA disposition, and the 'No Home' signal that predicts penny items.",
}

export default function InsideScoopPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Inside Home Depot Operations"
        subtitle="The internal mechanics that control when and where penny items appear."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            To the customer, a penny item is a lucky find. To store operations, it's a carefully
            orchestrated liquidation process involving specialized teams, internal reports, and
            strict disposal protocols.
          </p>

          <h2 className="text-2xl font-bold mb-6">MET Team Takeover</h2>
          <p className="mb-6">
            As of 2026, the MET (Merchandising Execution Team) has taken full control of clearance
            pulls. These are specialized employees—not general floor associates—who handle all
            penny-out removals and bay resets.
          </p>

          <div className="p-6 mb-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
            <h3 className="text-lg font-bold mb-3">MET Team Schedule</h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>
                <strong>Primary Work Days:</strong> Wednesday and Thursday (overnight or early
                morning)
              </li>
              <li>
                <strong>Key Responsibilities:</strong> Bay resets, clearance pulls, endcap removals,
                ZMA processing
              </li>
              <li>
                <strong>Why It Matters:</strong> Penny items that appear Tuesday evening may be gone
                by Thursday morning
              </li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-6">Bay Reset Calendar</h2>
          <p className="mb-6">
            Bay resets are not random—they follow a corporate calendar that syncs with seasonal
            transitions and clearance cycles. When a bay is scheduled for reset, items marked "No
            Home" are prioritized for penny-out and disposal.
          </p>

          <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2 mb-10">
            <h3 className="text-xl font-bold mb-3">The Reset Window</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Major resets typically occur at the start of each season (spring, summer, fall,
              winter). The 2-week window before a reset is when the highest volume of penny items
              appears, as the store aggressively clears space for incoming inventory.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">The "No Home" Signal</h2>
          <p className="mb-6">
            The most reliable penny predictor is not price—it's the "No Home" status in the internal
            system. When an item is removed from the planogram (the shelf layout diagram), it is
            flagged as having no designated location. This triggers accelerated liquidation.
          </p>

          <div className="p-6 mb-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)]">
            <h3 className="text-lg font-bold mb-3 text-[var(--text-primary)]">
              How to Spot "No Home" Items
            </h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>• Items sitting in the wrong aisle or department</li>
              <li>• Clearance items with no shelf tag or location label</li>
              <li>• Items grouped together on a random endcap with no signage</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-6">Register Dynamics: Zero-Comm Reports</h2>
          <p className="mb-6">
            When a penny item is scanned at the register, the system generates a
            "Zero-Communication" (Zero-Comm) report—an internal audit that flags the transaction for
            management review. This is why many cashiers refuse to ring up penny items or call for a
            manager.
          </p>

          <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2 mb-10">
            <h3 className="text-xl font-bold mb-3">Why Cashiers Say No</h3>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Cashiers are trained to recognize salvage items and are often coached to refuse the
              sale or seek manager approval. A high volume of Zero-Comm reports can trigger
              disciplinary review, creating a disincentive to process penny transactions.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">ZMA Disposition: What Happens Next</h2>
          <p className="mb-6">
            ZMA stands for "Z-Marking Out of Asset"—the process that removes an item from inventory
            and routes it for disposal. Not all penny items are destroyed; disposition varies by
            vendor agreement and product type.
          </p>

          <div className="overflow-x-auto mb-10">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Disposition Type
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Percentage
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                  <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                    Field Destruction
                  </td>
                  <td className="border border-[var(--border-default)] px-4 py-3">40-60%</td>
                  <td className="border border-[var(--border-default)] px-4 py-3">
                    Items sent to compactor (destroyed on-site)
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                  <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                    Return to Vendor (RTV)
                  </td>
                  <td className="border border-[var(--border-default)] px-4 py-3">~40%</td>
                  <td className="border border-[var(--border-default)] px-4 py-3">
                    Buy-Back agreements require vendor reclaim
                  </td>
                </tr>
                <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                  <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                    Donation
                  </td>
                  <td className="border border-[var(--border-default)] px-4 py-3">Small %</td>
                  <td className="border border-[var(--border-default)] px-4 py-3">
                    Habitat for Humanity, local charities (limited programs)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-6">Buy-Back SKU Locks</h2>
          <p className="mb-6">
            Some SKUs are locked by vendor agreements that prohibit sale at any price. These
            Buy-Back agreements mandate that unsold inventory be returned to the vendor for credit
            rather than liquidated. When these items hit $.01, they cannot be sold—even if the
            register rings them up.
          </p>

          <div className="p-6 mb-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--status-error)]">
            <h3 className="text-lg font-bold mb-3 text-[var(--text-primary)]">
              Locked SKU Indicators
            </h3>
            <ul className="space-y-2 text-[var(--text-secondary)]">
              <li>• Major brand-name tools (Milwaukee, DeWalt, Makita)</li>
              <li>
                • High-value electronics with vendor RTV agreements (smart thermostats, security
                systems)
              </li>
              <li>• Items that ring up $.01 but immediately trigger manager override prompts</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-6">Why Pennies Exist</h2>
          <p className="mb-6">
            The penny price is not a sale—it's an accounting mechanism. Setting an item to $.01
            allows the store to write off the inventory loss for tax purposes while maintaining a
            transaction record. This is why the system still allows (some) penny sales: they create
            a paper trail that satisfies corporate auditing requirements.
          </p>
        </Prose>

        <div className="mt-16 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Master the Lifecycle</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
            Want to see how items move through the clearance system before they hit ZMA? Check out
            our guide to the 2026 clearance lifecycle and ICE metrics.
          </p>
          <Link
            href="/clearance-lifecycle"
            className="inline-flex items-center gap-2 font-bold text-[var(--cta-primary)] hover:underline"
          >
            Read: The 2026 Clearance System
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
