import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
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

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Home Depot Clearance Lifecycle (2026 Guide)",
  description:
    "How penny items typically move through clearance: common price endings, cadence patterns, and how to read tag dates.",
  author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
  publisher: {
    "@type": "Organization",
    name: "Penny Central",
    url: "https://www.pennycentral.com",
    logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
  },
  datePublished: "2025-06-01",
  dateModified: "2026-02-09",
  mainEntityOfPage: "https://www.pennycentral.com/clearance-lifecycle",
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
    { "@type": "ListItem", position: 2, name: "Guide", item: "https://www.pennycentral.com/guide" },
    { "@type": "ListItem", position: 3, name: "Clearance Lifecycle & Cadence" },
  ],
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
      "Clearance items now stay in their home bays through the full markdown cycle. Endcaps still exist in some stores, but they are no longer the primary location.",
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
      "The first markdown. This stage typically lasts about 1-4 weeks. Use the tag date as your reference point. Older tag dates often indicate a near-term drop.",
  },
  {
    title: "Stage 2: .06 or .04",
    detail:
      "Mid-clearance. This stage typically lasts about 2-6 weeks. Seasonal items often move faster, while core items may stay longer.",
  },
  {
    title: "Stage 3: .03 or .02",
    detail:
      "Late-clearance. This stage typically lasts about 1-3 weeks. A strong signal, but not a guarantee. Always verify with a scan.",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageShell width="default" padding="sm" gap="md">
        <div className="w-full max-w-[68ch] mx-auto">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-[var(--text-muted)]">
            <a href="/" className="hover:text-[var(--cta-primary)]">
              Home
            </a>
            <span className="mx-1.5">/</span>
            <a href="/guide" className="hover:text-[var(--cta-primary)]">
              Guide
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-[var(--text-secondary)]">Clearance Lifecycle & Cadence</span>
          </nav>
          <PageHeader
            title="Clearance Lifecycle & Cadence"
            subtitle="How penny items typically move through clearance, and how to read the signals responsibly."
          />
          <p className="mt-2 mb-8 text-xs text-[var(--text-muted)]">
            <time dateTime="2026-02-09">Updated February 2026</time> · By Cade Allen
          </p>
        </div>

        <Section className="w-full max-w-[68ch] mx-auto">
          <Prose variant="guide">
            <p className="mb-8 text-lg leading-relaxed">
              Penny items are the final stage of clearance, not a public promotion. Home Depot does
              not publish a formal penny playbook, so this chapter is based on consistent community
              reports and in-store observations. Use it as a guide, not a guarantee.
            </p>

            <h2>The reality check</h2>
            <p className="mb-6">
              Old guides often describe a fixed schedule. In practice, timing varies by store,
              department, and inventory pressure. You can still make smart predictions, but only if
              you treat cadences as ranges and verify with a UPC scan.
            </p>

            <TruthMatrix rows={truthMatrixRows} />

            <h2>Common clearance cadences</h2>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Note: Cadence data is based on consistent community reports and in-store observations.
              Specifics vary by store and region.
            </p>
            <p className="mb-6">
              Two patterns show up repeatedly. They are helpful for planning, but they are not
              official and not guaranteed. Some categories skip stages or move faster. Cadence A
              runs roughly 13 weeks total. Cadence B runs roughly 7 weeks total. Treat both as
              planning ranges, not guarantees.
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

            <h2>What drives the cadence (2026 context)</h2>
            <p className="mb-6">
              Store Pulse (introduced in Chapter 1) tracks three signals for every clearance item,
              often called ICE: Inactive (no longer restocked), Clearance (in the markdown cycle),
              and E-velocity (how fast it is moving). When e-velocity drops below a threshold, the
              system flags the item for faster removal. This is why some items skip stages entirely.
            </p>
            <p className="mb-6">
              In 2026, some items can move from first markdown to penny in as little as 14 days —
              compared to the older 9-14 week cycles. The system now skips stages when e-velocity
              data says the item is not moving. This compressed cadence is sometimes called
              &ldquo;Speed-to-Penny&rdquo; and it means you need to act faster on strong signals.
            </p>

            <h2>Quick reference: price ending cheat sheet</h2>
            <p className="mb-6">
              Price endings are more useful than the discount percentage. The ending can hint at
              where the item sits in the clearance lifecycle, but the only sure answer is a UPC
              scan.
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
                    <tr
                      key={row.ending}
                      className="hover:bg-[var(--bg-elevated)] transition-colors"
                    >
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

            <h2>The $.02 buffer signal</h2>
            <p className="mb-8">
              A $.02 price is a 48-hour signal. It tells the MET team to locate and pull the item.
              The item is still technically sellable, but the clock is ticking. If you see $.02, you
              likely have less than 48 hours before it is pulled. Not every store uses this buffer —
              some skip straight from $.03 to $.01 — but when you see it, treat it as urgent.
            </p>

            <h2>The cadence timeline (practical view)</h2>
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

            <h2>Understanding &ldquo;No Home&rdquo; status</h2>
            <p className="mb-6">
              When a planogram update removes an item&rsquo;s shelf location, the system marks it
              &ldquo;No Home.&rdquo; This is a strong signal — the store has no designated place for
              the item, which often means it is headed for final markdown or removal. You will see
              this term referenced in later chapters.
            </p>

            <h2>Signal stacking</h2>
            <p className="mb-6">
              No single signal is reliable on its own. The strongest predictions come from combining
              multiple signals at once:
            </p>
            <ul className="mb-8">
              <li>
                <strong>Strongest stack:</strong> &ldquo;No Home&rdquo; status + late-stage ending
                (.03/.02) + older tag date. When all three align, the item is very likely headed to
                penny.
              </li>
              <li>
                If only one signal is present, odds are lower. Verify in-store with a UPC scan.
              </li>
              <li>
                Add community reports from the same SKU/store as a fourth signal for the highest
                confidence.
              </li>
            </ul>

            <h2>Seasonal vs. core inventory</h2>
            <p className="mb-6">
              Not every category moves at the same speed. Seasonal categories tend to drop quickly
              after a holiday or reset, while core categories can sit longer at early markdowns.
            </p>
            <ul className="mb-8">
              {seasonalNotes.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>

            <h2>What to do when you see .00</h2>
            <ul className="mb-8">
              {dotZeroTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>

            <h2>How to use tag dates without guessing</h2>
            <div className="p-6 mb-6 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
              <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">
                Tag date example
              </h3>
              <p className="text-[var(--text-secondary)]">
                Example: A clearance label showing $12.06 with a tag date of 11/04 is a
                mid-clearance stage. If that date is several weeks old, the next drop is likely
                closer — but timing still varies by store and category.
              </p>
            </div>
            <ul className="mb-8">
              <li>Older clearance tag dates usually mean a drop is closer, but not guaranteed.</li>
              <li>Combine an old tag date with low stock for a stronger signal.</li>
              <li>If a tag is missing, rely on the scan price, not the shelf.</li>
              <li>Use the digital pre-hunt chapter to filter candidates before you drive.</li>
            </ul>

            <h2>Reset timing signals</h2>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Note: Reset timing data is based on consistent community reports. Specifics vary by
              store and region.
            </p>
            <p className="mb-6">
              Late-stage items are often pulled around MET bay reset work. The 48 hours before a
              scheduled reset is when items are most likely to be pulled. If you see a $.02 buffer
              price during that window, the item is almost certainly on its way out.
            </p>
            <ul className="mb-8">
              <li>
                Use the signal stack (No Home + late-stage ending + older tag date) as your primary
                filter.
              </li>
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
    </>
  )
}
