import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Inside Scoop: Operational Context for Experienced Hunters | Penny Central",
  description:
    "Deeper operational context: disposition paths, handheld tools, policy vs. practice, and advanced 2026 workflow signals for experienced penny hunters.",
  alternates: {
    canonical: "/inside-scoop",
  },
}

const communitySignals = [
  "Store Pulse is the internal system associates reference most when discussing clearance tasks. The basics are covered in Chapter 1.",
  "ICE (Inactive / Clearance / E-velocity) is the tracking framework inside Store Pulse. The breakdown is covered in Chapter 2.",
  "No Home is a status used for items without a current bay location during resets. Defined in Chapter 2.",
  "BOLT is the tool associates use for bay sequencing and planogram changes.",
]

const doNotAssume = [
  "Exact timing windows (for example, a fixed number of days between markdowns).",
  "A guaranteed sale at the penny price.",
  "That any single internal status always equals a penny item.",
]

const handheldNotes = [
  "Associates use handheld scanners (commonly called Zebra or FIRST) for most clearance tasks.",
  "Some handhelds display a clearance or Store Pulse screen that lists markdown tasks by bay.",
  "Terms like ZMA, ICE, and No Home appear on these screens but are not publicly documented by Home Depot.",
]

const managementFocus = [
  "Penny items create extra cleanup because they are meant to be removed, not sold.",
  "Managers may be measured on shrink, inventory accuracy, or clearance completion rates.",
  "Some stores treat penny scans as exceptions that trigger follow-up work and reporting.",
]

const policyPracticeNotes = [
  "Some managers quietly honor the scan to avoid conflict. Others refuse the sale on principle.",
  "Enforcement can change by shift, department, or leadership style.",
  "The same store can behave differently from week to week depending on staffing and priorities.",
]

const reported2026Signals = [
  "Department Supervisor roles are being restructured in some regions, with less direct clearance authority than before.",
  "Ghost Inventory: some stores carry $80,000 or more in unresolved clearance that does not move — items that are technically in the system but effectively invisible on the floor.",
  "MET teams are handling more of the reset and clearance execution work, especially during bay restructuring.",
  "Some vendors use buy-back or RTV locks that prevent a sale at the register regardless of associate willingness.",
]

export default function InsideScoopPage() {
  return (
    <PageShell width="default" padding="sm" gap="md">
      <div className="w-full max-w-[68ch] mx-auto">
        <PageHeader
          title="Inside Scoop (2026 Context)"
          subtitle="Deeper operational context — the systems and workflows behind what you see in-store."
        />
      </div>

      <EditorialBlock className="w-full max-w-[68ch] mx-auto" />

      <Section className="w-full max-w-[68ch] mx-auto">
        <Prose variant="guide">
          <p className="mb-8 text-lg leading-relaxed">
            This chapter covers deeper operational context for experienced hunters. The basics —
            Store Pulse, ZMA, and the $.02 signal — are introduced in earlier chapters. Here you
            will find the operational logic behind what you see in-store.
          </p>

          <p className="mb-8 text-sm text-[var(--text-secondary)]">
            Note: This section draws on community reports and public sources. Specifics vary by
            store and region.
          </p>

          <h2>Internal terms you will see</h2>
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

          <h2>Handhelds and clearance tools</h2>
          <p className="mb-6">
            The following notes come from employee and shopper reports. They are not confirmed by
            Home Depot and should be treated as context only.
          </p>
          <ul className="mb-8">
            {handheldNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2>Why management cares</h2>
          <p className="mb-6">
            Strong reactions often happen when a penny item is found. Community reports suggest a
            few reasons why stores take penny scans seriously:
          </p>
          <ul className="mb-8">
            {managementFocus.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2>Zero-Comm and register exceptions</h2>
          <p className="mb-6">
            Community reports describe penny scans as exception events that can create extra
            checkout work and follow-up review.
          </p>
          <ul className="mb-8">
            <li>
              A penny scan can trigger associate intervention at checkout — this is the Zero-Comm
              flag in action (introduced in Chapter 1).
            </li>
            <li>
              Some associates re-ring at the last merchandised price to avoid a Zero-Comm exception
              log on their store.
            </li>
            <li>
              Recall or Buy-Back/RTV locks can block sale even when an item is physically present on
              the shelf. These locks are automated and cannot be overridden by the associate.
            </li>
          </ul>

          <h2>ZMA disposition paths</h2>
          <p className="mb-6">
            After an item reaches penny status, community reports describe two common disposition
            paths rather than one universal outcome.
          </p>
          <ul className="mb-8">
            <li>
              Field destruction (compactor) is common for low-value salvage items — roughly 40-60%
              of ZMA items go this route.
            </li>
            <li>
              Return-to-vendor (RTV/Buy-Back) is common for branded or higher-value categories —
              often near 40% of disposition volume.
            </li>
            <li>
              A small percentage goes to donation programs. The split varies significantly by store
              and category.
            </li>
          </ul>

          <h2>Policy vs. practice</h2>
          <p className="mb-6">
            Store behavior is inconsistent. That is why we recommend using multiple signals and
            staying polite at checkout.
          </p>
          <ul className="mb-8">
            {policyPracticeNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          <h2>MET reset timing</h2>
          <p className="mb-6">
            Community reports often align major pulls with MET bay reset work rather than a fixed
            customer-facing calendar.
          </p>
          <ul className="mb-8">
            <li>
              Items marked "No Home" are pre-pull candidates during reset windows. If you see a bay
              being restructured, check it before the MET team finishes.
            </li>
            <li>
              The $.02 buffer window (about 48 hours) before a pull exists in some stores. Others
              skip straight from $.03 to removal. Both patterns are covered in Chapter 2.
            </li>
            <li>Use reset timing as a probability signal only, not a guaranteed schedule.</li>
          </ul>

          <h2>How to use this section safely</h2>
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

          <h2>Confidence levels we use</h2>
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

          <h2>Stacking signals the safe way</h2>
          <p className="mb-8">
            Treat internal terms as a supporting signal. If a report mentions "No Home" and you also
            see an old tag date plus a late-stage ending (.03/.02), the signal stack is stronger. If
            the only evidence is an acronym with no SKU, no date, and no store, skip it. Assume
            noise until you can corroborate it.
          </p>

          <h2>What not to assume</h2>
          <p className="mb-6">
            Some claims sound confident but are not verifiable. The safest approach is to treat
            anything time-specific as unconfirmed until you see it in your own store.
          </p>
          <ul className="mb-8">
            {doNotAssume.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2>Speculation: Pro liquidation bundle</h2>
          <p className="mb-6">
            This is speculation, not a claim. Home Depot is building AI tools for Pros. It is
            possible those tools could eventually influence how clearance inventory is bundled or
            surfaced to professional buyers. There is no public confirmation of that today, so we
            treat it as a future watch item only.
          </p>

          <h2>2026 operational signals</h2>
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
