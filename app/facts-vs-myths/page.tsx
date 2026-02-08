import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Penny Hunting Facts vs Myths | Penny Central",
  description: "Clear, practical myth-busting based on community patterns and in-store reality.",
  alternates: {
    canonical: "/facts-vs-myths",
  },
}

const comparisons = [
  {
    fact: "Penny items are internal clearance, not public promotions.",
    myth: "Penny items are secret sales Home Depot wants you to find.",
  },
  {
    fact: "Store discretion is real. A penny scan does not guarantee a sale.",
    myth: "If it scans for a penny, the store must sell it to you.",
  },
  {
    fact: "Price endings help, but timing varies by store and category.",
    myth: "A .03 ending always means it will penny next week.",
  },
  {
    fact: "The app is a filter, not the truth. It can be delayed or incomplete.",
    myth: "The app shows penny prices and exact inventory in real time.",
  },
  {
    fact: "There is no perfect day or time. Patterns exist, but they shift.",
    myth: "Pennies always drop on a specific weekday.",
  },
  {
    fact: "Employees are following policy. Politeness keeps the hobby alive.",
    myth: "Arguing with staff is how you win a penny sale.",
  },
  {
    fact: "Community intel is valuable but time-sensitive. Check dates and store context.",
    myth: "A screenshot from months ago is still reliable today.",
  },
  {
    fact: "Shelf tags can be stale. The scan price is what matters.",
    myth: "The yellow tag always matches the real price.",
  },
  {
    fact: "Penny items are most often found in their home bay — the original shelf location. Clearance endcaps are being phased out, so the deepest discounts hide in plain sight alongside full-price stock.",
    myth: "Only the clearance endcap has penny items.",
  },
  {
    fact: "Scan the UPC on the product, not the clearance tag.",
    myth: "The yellow clearance tag is the best barcode to scan.",
  },
  {
    fact: "Clearing a shelf can draw attention and hurt future success.",
    myth: "If you find pennies, you should buy every item in sight.",
  },
]

const realityTable = [
  {
    claim: "Price endings can signal clearance progress.",
    reality: "Often useful, but timing varies by store and category.",
  },
  {
    claim: "A penny scan guarantees a sale.",
    reality: "No. Store discretion is real and policy varies by location.",
  },
  {
    claim: "The app shows penny prices in real time.",
    reality: "Usually not. The scan price is the truth.",
  },
  {
    claim: "Community intel is reliable.",
    reality: "Strong when it is recent and specific, weak when it lacks context.",
  },
]

const researchRules = [
  "Prefer multiple reports over a single viral post.",
  "Check the date and store location before you drive.",
  "Match the report to your store and category, not just the price ending.",
  "Treat any exact timeline claims as unconfirmed until you see them yourself.",
]

const redFlags = [
  "Claims of guaranteed timing (for example, exact day-of-week drops).",
  "Advice that requires arguing with staff or violating store policy.",
  "Screenshots with no date, no SKU, or no store context.",
  'Posts that say "every store" without evidence.',
]

export default function FactsVsMythsPage() {
  return (
    <PageShell width="default" padding="sm" gap="md">
      <div className="w-full max-w-[68ch] mx-auto">
        <PageHeader
          title="Facts vs. Myths"
          subtitle="Separating useful signals from rumors that waste your time."
        />
      </div>

      <EditorialBlock className="w-full max-w-[68ch] mx-auto" />

      <Section className="w-full max-w-[68ch] mx-auto">
        <Prose variant="guide">
          <p className="mb-8 text-lg leading-relaxed">
            Penny hunting lives on community information. That is a strength, but it also creates a
            lot of noise. This chapter filters the most common myths so you can focus on what
            actually works.
          </p>

          <h2>Common misconceptions</h2>

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

          <h2>How we decide what is real</h2>
          <ul className="mb-8">
            {researchRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="mb-6">
            Community intel is most reliable when it includes a SKU or UPC, the store or region, and
            a recent date. It is weakest when it is a cropped screenshot with no context.
          </p>

          <div className="overflow-x-auto mb-8">
            <table className="w-full border-collapse border border-[var(--border-default)]">
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Claim
                  </th>
                  <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                    Reality
                  </th>
                </tr>
              </thead>
              <tbody>
                {realityTable.map((row) => (
                  <tr key={row.claim} className="hover:bg-[var(--bg-elevated)] transition-colors">
                    <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                      {row.claim}
                    </td>
                    <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                      {row.reality}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            For detailed cadence breakdown, see Chapter 2.
          </p>

          <h2>Red flags to ignore</h2>
          <ul className="mb-8">
            {redFlags.map((flag) => (
              <li key={flag}>{flag}</li>
            ))}
          </ul>

          <h2>Why timeline myths spread so fast</h2>
          <p className="mb-6">
            Timeline myths feel trustworthy because they are simple. "Pennies always drop on X day"
            sounds actionable, so people repeat it even when it fails half the time. In reality,
            markdown timing is driven by local conditions: staffing, reset windows, inventory
            pressure, and category behavior. A pattern that worked in one district can fail
            immediately in another.
          </p>
          <p className="mb-8">
            Treat all timing claims as probability, not certainty. If a post includes no SKU, no
            store context, and no recent date, you are reading entertainment, not field-ready intel.
          </p>

          <h2>90-second validation workflow</h2>
          <p className="mb-6">
            Use this fast screen before acting on any claim. It protects your time and keeps the
            Penny List signal quality high.
          </p>
          <ol className="mb-8">
            <li>
              <strong>Identifier check:</strong> Confirm the post includes a SKU or UPC. If not,
              stop there.
            </li>
            <li>
              <strong>Date check:</strong> Verify the report is recent enough to matter for your
              next trip.
            </li>
            <li>
              <strong>Location check:</strong> Make sure the store/region is known and relevant to
              your hunt.
            </li>
            <li>
              <strong>Signal stack check:</strong> Look for at least one supporting signal
              (late-stage ending, old tag date, No Home context, or multiple matching reports).
            </li>
            <li>
              <strong>Decision check:</strong> If you would regret the trip without the penny, skip
              it and wait for stronger evidence.
            </li>
          </ol>

          <h2>60-second vetting checklist</h2>
          <ol className="mb-8">
            <li>Check the date and the specific store or region.</li>
            <li>Look for a SKU or UPC, not just a price screenshot.</li>
            <li>Compare the report to tag dates and price endings you can see.</li>
            <li>See if there are multiple recent reports, not just one post.</li>
            <li>Decide if the trip is worth it even if the penny is gone.</li>
          </ol>

          <h2>Why myths persist</h2>
          <p className="mb-8">
            Penny hunting moves fast, and screenshots spread faster. A real penny find in one store
            can turn into a rumor for every store within hours. Treat rumors as leads, not truth.
          </p>

          <h2>Trip ROI rule</h2>
          <p className="mb-6">
            A good lead should still make sense if the penny is gone. If your plan depends on one
            unverified screenshot, your expected return is low. Build trips around clusters of
            credible signals so each stop has more than one chance to pay off.
          </p>
          <ul className="mb-8">
            <li>Group nearby departments so one failed SKU does not waste the entire trip.</li>
            <li>Prioritize repeatable patterns over viral one-off claims.</li>
            <li>Track what worked in your store so your next trip gets smarter, not longer.</li>
            <li>
              Share corrected outcomes back to the community so weak myths lose traction over time.
            </li>
          </ul>

          <h2>Example: strong report vs. weak report</h2>
          <p className="mb-4">
            <strong>Strong report:</strong> Includes the SKU, the store, the date, and a clear photo
            of the tag or UPC. You can verify it in your own context.
          </p>
          <p className="mb-8">
            <strong>Weak report:</strong> A cropped screenshot with no date, no SKU, and no store.
            It might be real, but you cannot act on it responsibly.
          </p>

          <h2>Research deep dive</h2>
          <p className="mb-6">
            Home Depot does not publish a penny roadmap, so community intel is the best available
            data. It is strong when it is recent, specific, and backed by receipts or tag photos. It
            is weak when it is vague or repeated without context.
          </p>
          <p className="mb-8">
            Treat every report as a lead, not a promise. The most successful hunters combine
            community tips with their own store knowledge. If you would regret the trip without the
            penny, skip it.
          </p>
        </Prose>

        <ChapterNavigation
          prev={{
            slug: "inside-scoop",
            title: "Inside Scoop (2026 Context)",
          }}
          next={{
            slug: "faq",
            title: "FAQ & Quick Reference",
          }}
        />
      </Section>
    </PageShell>
  )
}
