import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Inside Scoop: 2026 Context (Community-Reported) | Penny Central",
  description:
    "A careful look at community-reported internal terms, what we can verify publicly, and what remains unconfirmed.",
  alternates: {
    canonical: "/inside-scoop",
  },
}

const communitySignals = [
  "Community-reported: Store Pulse is the internal system associates mention most when discussing clearance tasks.",
  "Community-reported: ICE is commonly described as Inactive / Clearance / E-velocity inside Store Pulse.",
  "Community-reported: No Home is a status used for items without a current bay location during resets.",
  "Community-reported: BOLT is the tool associates mention for bay sequencing and planogram changes.",
]

const doNotAssume = [
  "Exact timing windows (for example, a fixed number of days between markdowns).",
  "A guaranteed sale at the penny price.",
  "That any single internal status always equals a penny item.",
]

const handheldNotes = [
  "Community-reported: associates often use handheld scanners (commonly called Zebra or FIRST).",
  "Community-reported: some report a clearance or Store Pulse screen that lists markdown tasks.",
  "Community-reported: terms like ZMA, ICE, and No Home are reported but not publicly documented.",
]

const managementFocus = [
  "Community-reported: penny items can create extra cleanup because they are meant to be removed, not sold.",
  "Community-reported: managers may be measured on shrink, inventory accuracy, or clearance completion.",
  "Community-reported: some stores treat penny scans as exceptions that trigger follow-up work.",
]

const policyPracticeNotes = [
  "Community-reported: some managers quietly honor the scan to avoid conflict. Others refuse the sale.",
  "Community-reported: enforcement can change by shift, department, or leadership style.",
  "Community-reported: the same store can behave differently from week to week.",
]

const reported2026Signals = [
  "Community-reported: Store Pulse is described as a central hub for clearance tasks.",
  "Community-reported: ICE is described as Inactive, Clearance, and E-velocity tracking inside Store Pulse.",
  "Community-reported: ZMA is often used to describe the internal removal stage after penny.",
  "Community-reported: Zero-Comm is mentioned as an internal exception report when a penny sale happens.",
  "Community-reported: MET teams are reported to handle more of the reset and clearance execution work.",
  "Community-reported: some vendors use buy-back or RTV locks that prevent a sale at the register.",
]

export default function InsideScoopPage() {
  return (
    <PageShell width="default" padding="sm" gap="md">
      <div className="w-full max-w-[68ch] mx-auto">
        <PageHeader
          title="Inside Scoop (2026 Context)"
          subtitle="What the community reports, what we can verify publicly, and what remains unconfirmed."
        />
      </div>

      <EditorialBlock className="w-full max-w-[68ch] mx-auto" />

      <Section className="w-full max-w-[68ch] mx-auto">
        <Prose variant="guide">
          <p className="mb-8 text-lg leading-relaxed">
            This chapter is different from the rest of the guide. It separates what we can verify
            publicly from what employees and shoppers report in the field. The goal is accuracy, not
            hype. Use these notes as context, not as guarantees.
          </p>

          <h2 className="text-2xl font-bold mb-6">Community-reported internal terms</h2>
          <p className="mb-6">
            Employees and longtime shoppers frequently reference the same internal terms on public
            forums. We cannot verify these definitions from Home Depot directly, but the consistency
            across reports makes them useful as context.
          </p>
          <ul className="mb-8">
            {communitySignals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
          <p className="text-sm text-[var(--text-secondary)]">
            These terms are community-reported and may vary by store. Treat them as indicators, not
            rules.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-6">
            Handhelds and clearance tools (community-reported)
          </h2>
          <p className="mb-6">
            The following notes come from employee and shopper reports. They are not confirmed by
            Home Depot and should be treated as context only.
          </p>
          <ul className="mb-8">
            {handheldNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">Why management cares (community-reported)</h2>
          <p className="mb-6">
            Many hunters notice strong reactions when a penny item is found. Community reports
            suggest a few reasons why stores take penny scans seriously:
          </p>
          <ul className="mb-8">
            {managementFocus.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">
            Zero-Comm and register exceptions (community-reported)
          </h2>
          <p className="mb-6">
            Community reports describe penny scans as exception events that can create extra
            checkout work and follow-up review.
          </p>
          <ul className="mb-8">
            <li>
              Community-reported: a penny scan can trigger associate intervention at checkout.
            </li>
            <li>
              Community-reported: some associates re-ring at the last merchandised price to avoid a
              Zero-Comm exception log.
            </li>
            <li>
              Community-reported: recall or Buy-Back/RTV locks can block sale even when an item is
              physically present.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-6">ZMA disposition paths (community-reported)</h2>
          <p className="mb-6">
            After an item reaches penny status, community reports describe two common disposition
            paths rather than one universal outcome.
          </p>
          <ul className="mb-8">
            <li>
              Community-reported: field destruction/compactor is common for low-value salvage.
            </li>
            <li>
              Community-reported: return-to-vendor (RTV/Buy-Back) is common in some branded or
              higher-value categories.
            </li>
            <li>
              Community-reported: frequently cited ranges are roughly 40-60% destruction with a
              substantial RTV share (often cited near 40%), but this varies by store and category.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mb-6">Policy vs. practice</h2>
          <p className="mb-6">
            Store behavior is inconsistent. That is why we recommend using multiple signals and
            staying polite at checkout.
          </p>
          <ul className="mb-8">
            {policyPracticeNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">MET reset timing signals (community-reported)</h2>
          <p className="mb-6">
            Community reports often align major pulls with MET bay reset work rather than a fixed
            customer-facing calendar.
          </p>
          <ul className="mb-8">
            <li>
              Community-reported: items marked "No Home" can be pre-pull candidates during reset
              windows.
            </li>
            <li>
              Community-reported: some stores report a short .02 buffer window before pull, while
              others skip that step.
            </li>
            <li>
              Community-reported: use reset timing as a probability signal only, not a guaranteed
              schedule.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-6">How to use this section safely</h2>
          <p className="mb-6">
            The inside-scoop terms are useful as context, not as instructions. If a post uses
            internal acronyms, treat that as a signal that the person may have store access, not as
            a promise that the item will penny in your store.
          </p>
          <ul className="mb-8">
            <li>Look for multiple, recent reports before you act.</li>
            <li>Use internal terms as a tie-breaker, not your only reason to drive.</li>
            <li>Expect store-to-store variation, even when the terms are the same.</li>
            <li>When in doubt, fall back to tag dates, price endings, and a scan.</li>
          </ul>

          <h2 className="text-2xl font-bold mb-6">Confidence levels we use</h2>
          <ul className="mb-8">
            <li>
              <strong>Verified publicly:</strong> Information that appears in official statements or
              press releases (not penny mechanics).
            </li>
            <li>
              <strong>Community-reported:</strong> Repeated by employees and shoppers, but not
              confirmed by Home Depot.
            </li>
            <li>
              <strong>Speculative:</strong> Plausible theories with no public confirmation. We label
              these clearly.
            </li>
          </ul>

          <h2 className="text-2xl font-bold mt-10 mb-6">What we can verify publicly</h2>
          <p className="mb-6">
            Home Depot has publicly discussed its 2026 outlook and ongoing investments in
            Pro-focused tools. This does not confirm any specific penny mechanics, but it does
            explain why inventory efficiency and faster decision cycles matter in 2026.
          </p>
          <ul className="mb-8">
            <li>
              Home Depot issued a strategic update outlining its fiscal 2026 outlook and margin
              focus.
            </li>
            <li>
              Home Depot launched the Material List Builder AI to help Pros build project lists
              faster.
            </li>
          </ul>

          <div className="p-6 mb-8 rounded-lg bg-[var(--bg-card)] border border-[var(--border-default)]">
            <h3 className="text-lg font-bold mb-3">Why this matters to penny hunters</h3>
            <p className="text-[var(--text-secondary)]">
              When a retailer emphasizes operational efficiency, clearance decisions can feel faster
              and less predictable at the store level. That is why we recommend using multiple
              signals (tag dates, price endings, and community reports) instead of relying on a
              fixed calendar.
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Stacking signals the safe way</h2>
          <p className="mb-8">
            Treat internal terms as a supporting signal. If a report mentions "No Home" and you also
            see an old tag date plus a late-stage ending (.03/.02), the signal stack is stronger. If
            the only evidence is an acronym with no SKU, no date, and no store, skip it. Assume
            noise until you can corroborate it.
          </p>

          <h2 className="text-2xl font-bold mb-6">What not to assume</h2>
          <p className="mb-6">
            Some claims sound confident but are not verifiable. The safest approach is to treat
            anything time-specific as unconfirmed until you see it in your own store.
          </p>
          <ul className="mb-8">
            {doNotAssume.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">Speculation: Pro liquidation bundle</h2>
          <p className="mb-6">
            This is speculation, not a claim. Home Depot is building AI tools for Pros. It is
            possible those tools could eventually influence how clearance inventory is bundled or
            surfaced to professional buyers. There is no public confirmation of that today, so we
            treat it as a future watch item only.
          </p>

          <h2 className="text-2xl font-bold mb-6">2026 workflow signals (community-reported)</h2>
          <p className="mb-6">
            These terms and workflow notes are reported by employees and experienced hunters. They
            are not official policy and should not be treated as guarantees.
          </p>
          <ul className="mb-8">
            {reported2026Signals.map((signal) => (
              <li key={signal}>{signal}</li>
            ))}
          </ul>
        </Prose>

        <ChapterNavigation
          prev={{
            slug: "in-store-strategy",
            title: "Verify & In-Store Strategy",
          }}
          next={{
            slug: "facts-vs-myths",
            title: "Facts vs. Myths",
          }}
        />
      </Section>
    </PageShell>
  )
}
