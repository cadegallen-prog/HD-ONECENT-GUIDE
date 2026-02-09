import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Labels, Overhead, & Pre-Hunt Strategy | Penny Central",
  description:
    "How to recognize clearance labels, assess overhead risks, and use digital checks before you drive.",
  alternates: {
    canonical: "/digital-pre-hunt",
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Labels, Overhead, & Pre-Hunt Strategy",
  description:
    "How to recognize clearance labels, assess overhead risks, and use digital checks before you drive.",
  author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
  publisher: {
    "@type": "Organization",
    name: "Penny Central",
    url: "https://www.pennycentral.com",
    logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
  },
  datePublished: "2025-06-01",
  dateModified: "2026-02-09",
  mainEntityOfPage: "https://www.pennycentral.com/digital-pre-hunt",
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
    { "@type": "ListItem", position: 2, name: "Guide", item: "https://www.pennycentral.com/guide" },
    { "@type": "ListItem", position: 3, name: "Labels, Overhead, & Pre-Hunt" },
  ],
}

const labelSignals = [
  {
    ending: ".06",
    meaning: "Mid-clearance in one common cadence. Worth tracking.",
    priority: "Medium",
  },
  {
    ending: ".04",
    meaning: "Mid-clearance in another common cadence. Worth tracking.",
    priority: "Medium",
  },
  {
    ending: ".03",
    meaning: "Late-clearance in a common cadence. Often close to penny.",
    priority: "High",
  },
  {
    ending: ".02",
    meaning: "Late-clearance in another common cadence. Often close to penny.",
    priority: "High",
  },
  {
    ending: ".01",
    meaning: "Penny. Internal removal stage; sale is not guaranteed.",
    priority: "Highest",
  },
  {
    ending: ".97",
    meaning: "Regular sale price in many categories.",
    priority: "Low",
  },
]

const overheadClues = [
  "Yellow clearance tags visible from the floor",
  'Overhead areas marked as "No Home" (defined in Chapter 2) — a signal the item has no shelf location',
  "Dusty boxes or items that look untouched for months",
  "Mixed or mismatched products tucked above a bay",
  "Seasonal items parked in overhead after the season ends",
]

const preHuntSteps = [
  {
    step: "01",
    title: "Set the right store",
    text: "Inventory and pricing are store-specific. If you are on the wrong store, every signal is wrong.",
  },
  {
    step: "02",
    title: "Search by SKU when possible",
    text: "SKU searches reduce noise. Use the clearance tag or product packaging to find the correct item quickly.",
  },
  {
    step: "03",
    title: "Interpret the listing",
    text: "Look for low stock, unusual availability, or items that appear online but are hard to find in-store.",
  },
  {
    step: "04",
    title: "Save a short target list",
    text: "Pick 5-15 candidates, not 100. The goal is a focused trip, not a scavenger hunt.",
  },
]

const statusRows = [
  {
    status: "In stock with a clearance price",
    meaning: "Still in clearance cycle. Not a penny yet.",
  },
  {
    status: "In stock at full price",
    meaning: "Still active inventory. Check tag dates and price endings in-store.",
  },
  {
    status: "Unavailable or ship-to-store only",
    meaning: "Possible clearance candidate. Verify in-store with the UPC scan.",
  },
  {
    status: "Listing removed or hard to find",
    meaning: "Could be discontinued or fully pulled. Treat as a low-probability lead.",
  },
]

const limitations = [
  "Online data is not real-time. Delays of a day or two are common.",
  "The penny price almost never shows online.",
  "Low-stock counts are often wrong or out of date.",
  "Some items disappear from the site before they disappear in-store.",
]

const skipTrip = [
  "You only have an old screenshot without a date or SKU.",
  "There is no clearance tag date and no recent community report.",
  "You cannot verify the UPC or the item description in person.",
]

const inStoreTriggers = [
  "A very old clearance tag date combined with low stock",
  "Community reports that the same SKU pennied recently",
  "Seasonal transitions or major department resets",
  "A category that frequently goes clearance in your store",
]

export default function DigitalPreHuntPage() {
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
            <span className="text-[var(--text-secondary)]">Labels, Overhead, & Pre-Hunt</span>
          </nav>
          <PageHeader
            title="Labels, Overhead, & Pre-Hunt"
            subtitle="Use label signals and digital checks to cut wasted trips."
          />
          <p className="mt-2 mb-8 text-xs text-[var(--text-muted)]">
            <time dateTime="2026-02-09">Updated February 2026</time> · By Cade Allen
          </p>
        </div>

        <Section className="w-full max-w-[68ch] mx-auto">
          <Prose variant="guide">
            <p className="mb-8 text-lg leading-relaxed">
              The best penny hunters do most of their work before they drive. This chapter teaches
              you how to read clearance labels, spot overhead risks, and use the app as a filter
              without treating it like a crystal ball.
            </p>

            <h2>Visual label recognition</h2>
            <p className="mb-6">
              Price endings tell you more than the discount percentage. A high-dollar item ending in
              .06 or .03 is often closer to penny than a cheap item ending in .97. These endings are
              not official policy, but they show up consistently in the field.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-[var(--border-default)]">
                <thead>
                  <tr className="bg-[var(--bg-elevated)]">
                    <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                      Ending
                    </th>
                    <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                      What it usually means
                    </th>
                    <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                      Priority
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {labelSignals.map((row) => (
                    <tr
                      key={row.ending}
                      className="hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                        {row.ending}
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        {row.meaning}
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        {row.priority}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              For the complete cadence breakdown, see Chapter 2.
            </p>

            <h2>Overhead hunting (high reward, real risk)</h2>
            <p className="mb-6">
              Clearance items often move to overhead storage when a bay is being cleared. Overhead
              can be a goldmine, but it is also where items get pulled quickly if an associate scans
              them. Ask yourself if you are willing to risk the item being removed before you ask
              for help. Items marked &ldquo;No Home&rdquo; (introduced in Chapter 2) are strong
              candidates &mdash; the store has no shelf location for them, which often means they
              are headed for final markdown.
            </p>
            <ul className="mb-6">
              {overheadClues.map((clue) => (
                <li key={clue}>{clue}</li>
              ))}
            </ul>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Community note: Ladder colors and rules vary by store. Many locations treat yellow
              ladders as customer use and orange ladders as employee-only, but always ask before
              using any ladder. If an item is out of reach, request help instead of guessing.
            </p>
            <p className="text-sm text-[var(--text-secondary)]">
              If you ask an employee to pull an overhead item, they may scan it first. If it scans
              as a penny, they may remove it instead of handing it to you. This is common, not
              personal.
            </p>
            <p className="mb-6">
              Clearance endcaps are being phased out in many stores. Items now stay in their home
              bay — the original shelf location — through the entire markdown cycle. The deepest
              discounts are hidden in plain sight alongside full-price stock. When pre-hunting
              online, focus on specific SKUs and bays rather than assuming everything will be on an
              endcap.
            </p>

            <h2>Digital pre-hunt steps</h2>
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-10 mb-16">
              {preHuntSteps.map((item) => (
                <div key={item.step} className="relative pl-16">
                  <span className="absolute left-0 top-0 text-5xl font-black text-[var(--cta-primary)] opacity-20">
                    {item.step}
                  </span>
                  <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed relative z-10">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            <h2>Home-bay-first search workflow</h2>
            <p className="mb-6">
              A fast pre-hunt starts with shelf location, not price hype. Because many stores now
              keep markdown items in their original bays, your goal is to build a short list of
              exact shelf targets before you walk in. Think in this order: SKU, department, bay,
              then fallback locations like overhead.
            </p>
            <ul className="mb-8">
              <li>Start with 5-15 SKUs you can verify quickly, not a giant wishlist.</li>
              <li>
                For each SKU, note the department and aisle/bay so you walk a direct route instead
                of wandering.
              </li>
              <li>
                Prioritize items that already show late-stage endings (.03/.02) or old tag dates
                from recent community photos.
              </li>
              <li>
                Use overhead as a secondary pass after you check the home bay, especially in
                seasonal categories.
              </li>
            </ul>

            <h2>Interpreting online status</h2>
            <p className="mb-6">
              Online data is useful, but it is not real-time. Treat it as a filter, then verify in
              person.
            </p>

            <div className="overflow-x-auto mb-8">
              <table className="w-full border-collapse border border-[var(--border-default)]">
                <thead>
                  <tr className="bg-[var(--bg-elevated)]">
                    <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                      Online status
                    </th>
                    <th className="border border-[var(--border-default)] px-4 py-3 text-left font-bold">
                      What it could mean
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {statusRows.map((row) => (
                    <tr
                      key={row.status}
                      className="hover:bg-[var(--bg-elevated)] transition-colors"
                    >
                      <td className="border border-[var(--border-default)] px-4 py-3 font-semibold">
                        {row.status}
                      </td>
                      <td className="border border-[var(--border-default)] px-4 py-3 text-[var(--text-secondary)]">
                        {row.meaning}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2>Limitations to keep in mind</h2>
            <ul className="mb-8">
              {limitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Pre-trip evidence checklist</h2>
            <p className="mb-6">
              Before you drive, require at least two strong signals for each target. One weak clue
              is usually not enough to justify the trip.
            </p>
            <ul className="mb-8">
              <li>A specific SKU or UPC you can match in-store.</li>
              <li>A recent date from a tag photo, receipt, or trusted report.</li>
              <li>A plausible location path (home bay first, then overhead fallback).</li>
              <li>
                A realistic expectation: the item may be gone, refused, or already pulled by the
                time you arrive.
              </li>
            </ul>

            <h2>When to skip a trip</h2>
            <ul className="mb-8">
              {skipTrip.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>When to go in-store</h2>
            <p className="mb-6">
              Go in person only when the signal stack is strong. These are the most reliable
              triggers:
            </p>
            <ul className="mb-8">
              {inStoreTriggers.map((trigger) => (
                <li key={trigger}>{trigger}</li>
              ))}
            </ul>

            <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm mb-8">
              <h2>A note on accuracy</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Online inventory counts are often wrong for low-stock items. A listing that shows
                "one left" might already be gone, or it might be sitting in overhead. Always verify
                in person if the trip is worth it to you.
              </p>
            </div>
          </Prose>

          <ChapterNavigation
            prev={{
              slug: "clearance-lifecycle",
              title: "Clearance Lifecycle & Cadence",
            }}
            next={{
              slug: "in-store-strategy",
              title: "Verify & In-Store Strategy",
            }}
          />
        </Section>
      </PageShell>
    </>
  )
}
