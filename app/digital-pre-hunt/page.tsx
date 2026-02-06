import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Labels, Overhead, & Pre-Hunt Strategy | Penny Central",
  description:
    "How to recognize clearance labels, assess overhead risks, and use digital checks before you drive.",
  alternates: {
    canonical: "/digital-pre-hunt",
  },
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
  'Overhead areas marked as "No Home" (community term, not official)',
  "Dusty boxes or items that look untouched for weeks",
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
    <PageShell width="default" gap="md">
      <div className="w-full max-w-[68ch] mx-auto">
        <PageHeader
          title="Labels, Overhead, & Pre-Hunt"
          subtitle="Use label signals and digital checks to cut wasted trips."
        />
      </div>

      <EditorialBlock className="w-full max-w-[68ch] mx-auto" />

      <Section className="w-full max-w-[68ch] mx-auto">
        <Prose variant="guide">
          <p className="mb-10 text-lg leading-relaxed">
            The best penny hunters do most of their work before they drive. This chapter teaches you
            how to read clearance labels, spot overhead risks, and use the app as a filter without
            treating it like a crystal ball.
          </p>

          <h2 className="text-2xl font-bold mb-6">Visual label recognition</h2>
          <p className="mb-6">
            Price endings tell you more than the discount percentage. A high-dollar item ending in
            .06 or .03 is often closer to penny than a cheap item ending in .97. These endings are
            not official policy, but they show up consistently in the field.
          </p>

          <div className="overflow-x-auto mb-10">
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
                  <tr key={row.ending} className="hover:bg-[var(--bg-elevated)] transition-colors">
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

          <h2 className="text-2xl font-bold mb-6">Overhead hunting (high reward, real risk)</h2>
          <p className="mb-6">
            Clearance items often move to overhead storage when a bay is being cleared. Overhead can
            be a goldmine, but it is also where items get pulled quickly if an associate scans them.
            Ask yourself if you are willing to risk the item being removed before you ask for help.
            Some hunters also report a \"No Home\" status in overhead areas, but treat that as a
            community signal, not a guarantee.
          </p>
          <ul className="mb-6">
            {overheadClues.map((clue) => (
              <li key={clue}>{clue}</li>
            ))}
          </ul>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Community note: Ladder colors and rules vary by store. Many locations treat yellow
            ladders as customer use and orange ladders as employee-only, but always ask before using
            any ladder. If an item is out of reach, request help instead of guessing.
          </p>
          <p className="text-sm text-[var(--text-secondary)]">
            If you ask an employee to pull an overhead item, they may scan it first. If it scans as
            a penny, they may remove it instead of handing it to you. This is common, not personal.
          </p>

          <h2 className="text-2xl font-bold mt-10 mb-6">Digital pre-hunt steps</h2>
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 mb-16">
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

          <h2 className="text-2xl font-bold mb-6">Interpreting online status</h2>
          <p className="mb-6">
            Online data is useful, but it is not real-time. Treat it as a filter, then verify in
            person.
          </p>

          <div className="overflow-x-auto mb-10">
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
                  <tr key={row.status} className="hover:bg-[var(--bg-elevated)] transition-colors">
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

          <h2 className="text-2xl font-bold mb-6">Limitations to keep in mind</h2>
          <ul className="mb-10">
            {limitations.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">When to skip a trip</h2>
          <ul className="mb-10">
            {skipTrip.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">When to go in-store</h2>
          <p className="mb-6">
            Go in person only when the signal stack is strong. These are the most reliable triggers:
          </p>
          <ul className="mb-10">
            {inStoreTriggers.map((trigger) => (
              <li key={trigger}>{trigger}</li>
            ))}
          </ul>

          <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm mb-12">
            <h2 className="text-2xl font-bold mb-4">A note on accuracy</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Online inventory counts are often wrong for low-stock items. A listing that shows "one
              left" might already be gone, or it might be sitting in overhead. Always verify in
              person if the trip is worth it to you.
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
  )
}
