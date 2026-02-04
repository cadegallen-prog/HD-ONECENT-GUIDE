import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"

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
    impact: "Compressed to 2-3 weeks in high-volume depts",
  },
  {
    component: "E-Velocity (E)",
    definition: "Turn rate / movement speed metric",
    impact: "Triggers aggressive liquidation when low",
  },
]

const legacyComparison = [
  {
    feature: "Primary System",
    legacy: "IMS",
    current: "Store Pulse & BOLT",
  },
  {
    feature: "Markdown Speed",
    legacy: "3/6 week intervals",
    current: "Speed-to-Penny, often skipping stages",
  },
  {
    feature: "Final Buffer",
    legacy: "None ($.03 → $.01)",
    current: "$.02 Buffer: 48-hour MET signal",
  },
  {
    feature: "Clearance Location",
    legacy: "Dedicated clearance bays",
    current: "Home Bay Only (endcaps phased out)",
  },
  {
    feature: "Removal Team",
    legacy: "General associates",
    current: "MET Team (specialized)",
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
            In 2025, Home Depot deployed Store Pulse—a real-time algorithmic liquidation system that
            replaced the legacy IMS framework. This fundamentally changed how clearance items move
            through the markdown cycle, compressing timelines and introducing new signals that penny
            hunters must understand.
          </p>

          <h2 className="text-2xl font-bold mb-6">The System Shift</h2>
          <p className="mb-8">
            Store Pulse uses algorithmic liquidation driven by real-time sales velocity and
            inventory levels. Unlike the rigid IMS cadence, Store Pulse can skip markdown stages
            entirely, accelerating items from $.06 directly to penny status in high-volume
            departments. This shift introduced the ICE metrics framework—the internal dashboard that
            dictates clearance flow.
          </p>

          <h2 className="text-2xl font-bold mb-6">ICE Metrics Framework</h2>
          <p className="mb-6">
            ICE (Inactive, Clearance, E-Velocity) is the internal metric system that tracks items
            through the liquidation pipeline. Understanding these components helps predict which
            items will penny-out and when.
          </p>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Component
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Definition
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    2026 Impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {iceMetrics.map((metric, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                      {metric.component}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3">
                      {metric.definition}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3">
                      {metric.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-6">The $.02 Buffer: Critical Warning</h2>

          <div className="p-6 mb-10 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--status-warning)]">
            <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)]">
              <span className="text-[var(--status-warning)]">48-Hour</span> Buffer Window
            </h3>
            <p className="mb-4 text-[var(--text-secondary)]">
              The $.02 price point is not a traditional markdown—it's a 48-hour buffer that signals
              the MET (Merchandising Execution Team) to pull the item. This "ghost stage" indicates
              the item is 90% off and scheduled for removal.
            </p>
            <p className="font-semibold text-[var(--text-primary)]">
              If you see $.02, you have a narrow window before it disappears entirely or drops to
              $.01 and becomes ZMA (salvage).
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Speed-to-Penny Timeline</h2>
          <p className="mb-6">
            The 2026 system has dramatically compressed clearance cycles. The traditional 3-week or
            6-week cadence is being replaced by aggressive "Speed-to-Penny" liquidation in
            high-velocity departments.
          </p>

          <div className="overflow-x-auto mb-12">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Feature
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Legacy (Pre-2025)
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    2026 Reality
                  </th>
                </tr>
              </thead>
              <tbody>
                {legacyComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                      {row.feature}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3">
                      {row.legacy}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3">
                      {row.current}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <details className="mb-10 p-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
            <summary className="font-bold cursor-pointer text-lg mb-4">
              Historical Context: Cadence A/B (Legacy)
            </summary>
            <div className="text-[var(--text-secondary)] space-y-4">
              <p>
                Before Store Pulse, stores followed more rigid markdown patterns. These were never
                guarantees, but they were consistent enough that hunters could plan around them.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-[var(--border-default)]">
                  <thead>
                    <tr className="bg-[var(--bg-elevated)]">
                      <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                        Stage
                      </th>
                      <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                        Cadence A (historical)
                      </th>
                      <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                        Cadence B (historical)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                        Full retail
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .00 (not on clearance) ~4 weeks
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .00 (not on clearance) ~1–2 weeks
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                        1st markdown
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .06 ~6 weeks
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .04 ~4 weeks
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                        2nd markdown
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .03 ~3 weeks
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .02 ~2 weeks
                      </td>
                    </tr>
                    <tr className="hover:bg-[var(--bg-elevated)] transition-colors">
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                        Final
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .01 (penny)
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3">
                        .01 (penny)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[var(--text-muted)]">
                These are historical patterns used for context. In 2026, Store Pulse can compress,
                pause, or skip stages based on real-time inventory pressure.
              </p>
            </div>
          </details>

          <h2 className="text-2xl font-bold mb-6">What This Means For Hunters</h2>
          <div className="space-y-4 mb-10">
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2">Watch for $.02</h3>
              <p className="text-[var(--text-secondary)]">
                This is your primary signal. If you see $.02, the item is on a 48-hour countdown to
                removal.
              </p>
            </div>
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2">Focus on Home Bays</h3>
              <p className="text-[var(--text-secondary)]">
                Clearance endcaps are being phased out. Items marked "No Home" in the system are
                prime penny candidates.
              </p>
            </div>
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2">Compressed Timelines</h3>
              <p className="text-[var(--text-secondary)]">
                Don't rely on the old 3-week cadence. High-velocity items can skip directly from
                $.06 to $.01.
              </p>
            </div>
            <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
              <h3 className="font-bold mb-2">MET Team Schedules</h3>
              <p className="text-[var(--text-secondary)]">
                Learn when MET teams work (typically Wed/Thu). This is when penny items are pulled
                and moved to ZMA bins.
              </p>
            </div>
          </div>
        </Prose>
      </Section>
    </PageShell>
  )
}
