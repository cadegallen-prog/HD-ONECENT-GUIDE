import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { TruthMatrix } from "@/components/guide/TruthMatrix"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Home Depot Store Pulse & ICE Metrics 2026 | Penny Central",
  description:
    "The definitive guide to Home Depot's 2026 clearance system. Learn ICE metrics, the $.02 buffer, and Speed-to-Penny timelines.",
}

const iceMetrics = [
  {
    component: "Inactive (I)",
    definition: "SKUs removed from replenishment pipeline",
    impact: "First warning - no longer receiving stock",
  },
  {
    component: "Clearance (C)",
    definition: "Items in markdown cadence ($.06, $.03)",
    impact: "Impact: Compressed to 2-3 weeks in high-volume depts",
  },
  {
    component: "E-Velocity (E)",
    definition: "Turn rate / movement speed metric",
    impact: "Triggers aggressive liquidation when low",
  },
]

const truthMatrixRows = [
  {
    claim: "Items follow a strict 3-week cadence",
    verdict: "false" as const,
    reality:
      "Store Pulse now accelerates low-velocity items. An item can jump from $.06 to $.01 in days if E-velocity is critical.",
  },
  {
    claim: "$.03 is the last safe price before penny",
    verdict: "complicated" as const,
    reality:
      "Yes, but the new $.02 buffer (48-hr warning) is the real signal. If you see $.03, utilize the scan tool to check stock depth.",
  },
  {
    claim: "Penny items are in clearance bays",
    verdict: "false" as const,
    reality:
      "Clearance endcaps are being phased out. Most penny items are now found in their 'Home Bay' mixed with full-price stock (Zero-Comm).",
  },
  {
    claim: "MET Team removes pennies on Thursdays",
    verdict: "complicated" as const,
    reality:
      "MET schedules vary by district (Mon-Fri). However, large resets often happen mid-week. Knowing your store's specific MET rhythm is key.",
  },
  {
    claim: "Employees hide penny items to buy them",
    verdict: "true" as const,
    reality:
      "Still happens. If an item shows 'On Hand: 10' but the shelf is empty, check top stock or behind adjacent boxes.",
  },
]

export default function ClearanceLifecyclePage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="The 2026 Clearance System"
        subtitle="How Store Pulse and ICE metrics transformed penny hunting."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            In 2025, Home Depot deployed <strong>Store Pulse</strong>—a real-time algorithmic
            liquidation system that replaced the legacy IMS framework. This fundamentally changed
            how clearance items move through the markdown cycle, compressing timelines and
            introducing new signals that penny hunters must understand to succeed in 2026.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            The System Shift: Then vs. Now
          </h2>
          <p className="mb-6">
            If you're using guides from 2024 or earlier, you are hunting with a map of a city that
            has been bulldozed. The rigid schedules are gone, replaced by "Speed-to-Penny"
            algorithms. Here is the honest breakdown of what still works and what will get you
            empty-handed.
          </p>

          <TruthMatrix rows={truthMatrixRows} />

          <h2 className="text-2xl font-bold mt-12 mb-6 text-[var(--text-primary)]">
            Understanding ICE Metrics
          </h2>
          <p className="mb-6">
            <strong>ICE</strong> (Inactive, Clearance, E-Velocity) is the internal dashboard metric
            used by Store Pulse to decide an item's fate. Understanding these components helps you
            predict which items will "penny out" and when.
          </p>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Metric
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    What It Means
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Why It Matters
                  </th>
                </tr>
              </thead>
              <tbody>
                {iceMetrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                      {metric.component}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {metric.definition}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {metric.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            The $.02 Buffer & ZMA
          </h2>

          <div className="p-6 mb-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--status-warning)]">
            <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">
              <span className="text-[var(--status-warning)]">$.02</span> is the "Get It Now" Warning
            </h3>
            <p className="mb-4 text-[var(--text-secondary)]">
              The $.02 price point is <strong>not a sale</strong>. It is a 48-hour operational
              buffer that signals the MET team to remove the item from the shelf.
            </p>
            <p className="font-semibold text-[var(--text-primary)]">
              At this stage, the item is processed as{" "}
              <span className="text-[var(--cta-primary)]">ZMA (Zero Markdown Application)</span>
              —retail speak for "salvage/destroy." Once an item is ZMA'd, it cannot be sold. $.02 is
              your last chance to buy it before the register locks it out.
            </p>
          </div>

          <p className="mb-8">
            <strong>What happens after ZMA?</strong> The item is physically thrown into a compactor,
            palletized for liquidation auctions, or credited back to the vendor. It never returns to
            the shelf. This is why timing is everything.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            Speed-to-Penny Timeline
          </h2>
          <p className="mb-6">
            In the legacy system, you could watch an item sit at $.06 for six weeks. In 2026, Store
            Pulse monitors "E-Velocity" (sales speed). If an item is taking up valuable shelf space
            and not moving, the system will force it down the chain aggressively.
          </p>

          <details className="mb-10 p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
            <summary className="font-bold cursor-pointer text-lg mb-4 text-[var(--text-primary)] hover:text-[var(--cta-primary)] transition-colors">
              Click to view Historical Context (Cadence A/B)
            </summary>
            <div className="text-[var(--text-secondary)] space-y-4 pt-2">
              <p>
                Before Store Pulse, stores followed rigid markdown patterns. We preserve this data
                because some low-volume rural stores still echo this rhythm, but do not rely on it
                as a rule in major metro areas.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[var(--border-default)]">
                  <thead>
                    <tr className="bg-[var(--bg-elevated)]">
                      <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                        Stage
                      </th>
                      <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                        Cadence A (historical)
                      </th>
                      <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                        Cadence B (historical)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                        Full retail
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .00 (not on clearance) ~4 weeks
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .00 (not on clearance) ~1–2 weeks
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                        1st markdown
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .06 ~6 weeks
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .04 ~4 weeks
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                        2nd markdown
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .03 ~3 weeks
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .02 ~2 weeks
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                        Final
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .01 (penny)
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        .01 (penny)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </details>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            Three Rules to Survive in 2026
          </h2>
          <div className="space-y-6 mb-10">
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2 text-[var(--text-primary)]">
                1. Hunt the Home Bay, Not Clearance
              </h3>
              <p className="text-[var(--text-secondary)]">
                Most penny items now sit in their original home location ("Home Bay") mixed with
                full-price items. If you only check yellow clearance stickers, you will miss 80% of
                the finds.
              </p>
            </div>
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2 text-[var(--text-primary)]">
                2. Respect the MET Schedule
              </h3>
              <p className="text-[var(--text-secondary)]">
                MET teams work Monday through Friday. If you find a store that does heavy resets on
                Wednesdays, realize that Thursday morning is the most dangerous time for items to be
                pulled, but also the best time to find what they missed.
              </p>
            </div>
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2 text-[var(--text-primary)]">3. Speed is Survivable</h3>
              <p className="text-[var(--text-secondary)]">
                Since Store Pulse accelerates items, you cannot "wait and see." If you scan an item
                at $.03, do not wait for next week. Verify if it's the only one left. If stock is
                low, the algorithm will likely kill it quickly.
              </p>
            </div>
          </div>
        </Prose>

        <ChapterNavigation
          prev={undefined}
          next={{
            slug: "digital-pre-hunt",
            title: "Pre-Hunt Intelligence",
          }}
        />
      </Section>
    </PageShell>
  )
}
