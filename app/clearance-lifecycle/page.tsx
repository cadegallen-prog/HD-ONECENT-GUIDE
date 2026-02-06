import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { TruthMatrix } from "@/components/guide/TruthMatrix"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Home Depot Clearance Lifecycle (2026 Guide) | Penny Central",
  description:
    "How penny items typically move through clearance: common price endings, cadence patterns, and how to read tag dates.",
  alternates: {
    canonical: "/clearance-lifecycle",
  },
}

const truthMatrixRows = [
  {
    claim: "There is a fixed three-week markdown schedule",
    verdict: "false" as const,
    reality:
      "Timing varies by store and department. Use ranges and tag dates instead of a fixed calendar.",
  },
  {
    claim: "Clearance endcaps are the only place to look",
    verdict: "false" as const,
    reality:
      "Clearance can appear in home bays, seasonal areas, and overheads. Endcaps still exist, but they are not the only signal.",
  },
  {
    claim: "Any price ending in .97 means penny soon",
    verdict: "false" as const,
    reality:
      "A .97 ending is usually a regular sale price. Clearance endings (.00, .06/.04, .03/.02, .01) are more meaningful.",
  },
  {
    claim: "The yellow tag always matches the real price",
    verdict: "complicated" as const,
    reality:
      "Tags can be stale or missing. The in-store UPC scan price is what matters, so verify at self-checkout or the register.",
  },
  {
    claim: "Every store follows the same cadence",
    verdict: "false" as const,
    reality: "Cadence patterns exist, but stores vary in timing, staffing, and enforcement.",
  },
]

const cadenceRows = [
  {
    stage: "Initial markdown",
    cadenceA: ".00 (about 10-25% off, about 4 weeks)",
    cadenceB: ".00 (about 10-25% off, 1-2 weeks)",
    notes: "Enters clearance. Watch the tag date.",
  },
  {
    stage: "Second markdown",
    cadenceA: ".06 (about 50% off, about 6 weeks)",
    cadenceB: ".04 (about 50% off, about 4 weeks)",
    notes: "Often the longest stage. Timing varies by category.",
  },
  {
    stage: "Final visible markdown",
    cadenceA: ".03 (about 75% off, about 3 weeks)",
    cadenceB: ".02 (about 75% off, about 2 weeks)",
    notes: "Often the last tag before penny. Not guaranteed.",
  },
  {
    stage: "System update",
    cadenceA: ".01 (penny)",
    cadenceB: ".01 (penny)",
    notes: "Internal removal stage. Some stores honor it, some do not.",
  },
]

const priceEndingRows = [
  {
    ending: ".00",
    meaning: "First markdown. Item has entered clearance.",
    signal: "Low to medium",
  },
  {
    ending: ".06 / .04",
    meaning: "Mid-clearance. Common second markdown endings.",
    signal: "Medium",
  },
  {
    ending: ".03 / .02",
    meaning: "Late-clearance. Often the final visible markdown stage.",
    signal: "High (but not a promise)",
  },
  {
    ending: ".01",
    meaning: "Penny. Internal removal stage; not meant for sale.",
    signal: "Highest",
  },
  {
    ending: ".97 / .98",
    meaning: "Regular sale price in many categories.",
    signal: "Low",
  },
]

const timelineSteps = [
  {
    title: "Stage 1: .00 (enters clearance)",
    detail:
      "The first markdown. In many reports this stage lasts about 1-4 weeks. Use the tag date as your reference point. Older tag dates often indicate a near-term drop.",
  },
  {
    title: "Stage 2: .06 or .04",
    detail:
      "Mid-clearance. In many reports this stage lasts about 2-6 weeks. Seasonal items often move faster, while core items may stay longer.",
  },
  {
    title: "Stage 3: .03 or .02",
    detail:
      "Late-clearance. In many reports this stage lasts about 1-3 weeks. A strong signal, but not a guarantee. Always verify with a scan.",
  },
  {
    title: "Stage 4: .01 (penny)",
    detail: "Internal removal. Some stores still sell it, some pull it immediately.",
  },
]

const seasonalNotes = [
  "Seasonal items often move faster right after the season ends.",
  "Core items can sit longer at .00 or .06 before moving again.",
  "Department resets can trigger faster drops or sudden pulls.",
]

const dotZeroTips = [
  "Take note of the tag date and the bay location.",
  "Check nearby overhead storage for matching items.",
  "Watch for a follow-up drop rather than chasing it the same day.",
]

export default function ClearanceLifecyclePage() {
  return (
    <PageShell width="default" padding="sm" gap="md">
      <div className="w-full max-w-[68ch] mx-auto">
        <PageHeader
          title="Clearance Lifecycle & Cadence"
          subtitle="How penny items typically move through clearance, and how to read the signals responsibly."
        />
      </div>

      <EditorialBlock className="w-full max-w-[68ch] mx-auto" />

      <Section className="w-full max-w-[68ch] mx-auto">
        <Prose variant="guide">
          <p className="mb-8 text-lg leading-relaxed">
            Penny items are the final stage of clearance, not a public promotion. Home Depot does
            not publish a formal penny playbook, so this chapter is based on consistent community
            reports and in-store observations. Use it as a guide, not a guarantee.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">The reality check</h2>
          <p className="mb-6">
            Old guides often describe a fixed schedule. In practice, timing varies by store,
            department, and inventory pressure. You can still make smart predictions, but only if
            you treat cadences as ranges and verify with a scan.
          </p>

          <TruthMatrix rows={truthMatrixRows} />

          <h2 className="text-2xl font-bold mt-8 mb-6 text-[var(--text-primary)]">
            Common clearance cadences (reported)
          </h2>
          <p className="mb-6">
            Two patterns show up repeatedly in community reports. They are helpful for planning, but
            they are not official and not guaranteed. Some categories skip stages or move faster.
          </p>
          <p className="mb-6 text-sm text-[var(--text-secondary)]">
            Community-reported full-cycle approximation: Cadence A is often around 13 weeks total
            and Cadence B around 7 weeks total. Treat both as planning ranges, not guarantees.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Stage
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Cadence A (approx)
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Cadence B (approx)
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {cadenceRows.map((row) => (
                  <tr key={row.stage} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                      {row.stage}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {row.cadenceA}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {row.cadenceB}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            Quick reference: price ending cheat sheet
          </h2>
          <p className="mb-6">
            Price endings are more useful than the discount percentage. The ending can hint at where
            the item sits in the clearance lifecycle, but the only sure answer is a scan.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Ending
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    What it usually means
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold text-[var(--text-primary)]">
                    Penny signal
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceEndingRows.map((row) => (
                  <tr key={row.ending} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="border border-[var(--border-default)] px-4 py-3 font-semibold text-[var(--text-primary)]">
                      {row.ending}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {row.meaning}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {row.signal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-8">
            Community note: Some hunters report a brief .02 buffer just before penny, while others
            never see it. Treat it as a possible signal, not a rule.
          </p>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            The cadence timeline (practical view)
          </h2>
          <p className="mb-6">
            This is the most practical way to think about timing. Use tag dates and store-specific
            observations instead of a fixed calendar.
          </p>
          <div className="space-y-6 mb-8">
            {timelineSteps.map((step) => (
              <div key={step.title} className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
                <h3 className="font-bold mb-2 text-[var(--text-primary)]">{step.title}</h3>
                <p className="text-[var(--text-secondary)]">{step.detail}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            Seasonal vs. core inventory
          </h2>
          <p className="mb-6">
            Not every category moves at the same speed. Seasonal categories tend to drop quickly
            after a holiday or reset, while core categories can sit longer at early markdowns.
          </p>
          <ul className="mb-8">
            {seasonalNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            What to do when you see .00
          </h2>
          <ul className="mb-8">
            {dotZeroTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            How to use tag dates without guessing
          </h2>
          <div className="p-6 mb-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">Tag date example</h3>
            <p className="text-[var(--text-secondary)]">
              Example: A clearance label showing $12.06 with a tag date of 11/04 is a mid-clearance
              stage. If that date is several weeks old, many hunters report the next drop is closer,
              but timing still varies by store and category.
            </p>
          </div>
          <ul className="mb-8">
            <li>Older clearance tag dates usually mean a drop is closer, but not guaranteed.</li>
            <li>Combine an old tag date with low stock for a stronger signal.</li>
            <li>If a tag is missing, rely on the scan price, not the shelf.</li>
            <li>Use the digital pre-hunt chapter to filter candidates before you drive.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-6 text-[var(--text-primary)]">
            Community-reported reset timing signals
          </h2>
          <p className="mb-6">
            Community-reported pattern: late-stage items are often pulled around MET bay reset work.
            Some reports describe a short .02 buffer window (about 24-48 hours) before a pull, while
            other stores skip that step.
          </p>
          <ul className="mb-8">
            <li>
              Stronger signal stack: "No Home" status + late-stage ending (.03/.02) + older tag
              date.
            </li>
            <li>If only one signal is present, odds are lower. Verify in-store with a UPC scan.</li>
            <li>
              Reset timing varies by store, department, and staffing, so treat this as directional
              guidance.
            </li>
          </ul>
        </Prose>

        <ChapterNavigation
          prev={{
            slug: "what-are-pennies",
            title: "What Are Penny Items?",
          }}
          next={{
            slug: "digital-pre-hunt",
            title: "Labels, Overhead, & Pre-Hunt",
          }}
        />
      </Section>
    </PageShell>
  )
}
