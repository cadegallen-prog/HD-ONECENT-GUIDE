import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "The Clearance Lifecycle - From Full Price to One Cent | Penny Central",
  description:
    "Predicting the penny. Learn the exact pricing sequence Home Depot uses to clear out inventory, from .06 and .03 markdowns to the final penny.",
}

const milestones = [
  {
    price: ".06",
    title: "First Major Markdown",
    description:
      "When an item ends in .06, it is officially on clearance. Usually, this stays for 3-6 weeks before the next drop.",
  },
  {
    price: ".03",
    title: "Final Clearance",
    description:
      "The 'Yellow Tag' phase. This is the last stop before the penny. Items ending in .03 will almost certainly drop to .01 in exactly 3 weeks.",
  },
  {
    price: ".01",
    title: "The Penny",
    description:
      "The item has been removed from inventory systems. It is technically 'salvage' or 'ZMA' status and no longer belongs on the floor.",
  },
]

export default function ClearanceLifecyclePage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Clearance Lifecycle"
        subtitle="The roadmap of a markdown. Understanding the 3-week cadence."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            Contrary to popular belief, items don't just 'randomly' become a penny. Home Depot uses
            a standardized, predictable sequence for clearing out shelf space.
          </p>

          <div className="space-y-6 mb-16">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                className="flex gap-6 p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] shadow-sm"
              >
                <div className="text-4xl font-black text-[var(--cta-primary)] flex-shrink-0 pt-1">
                  {m.price}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{m.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed">{m.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">The Success Trick</h2>
          <p className="mb-6">
            The secret to high-volume penny hunting isn't finding penny items—it's{" "}
            <strong>finding .03 items</strong> and marking your calendar. If you see a shelf full of
            .03 lighting fixtures today, there is a nearly 100% chance they will be $0.01 in three
            weeks.
          </p>

          <div className="mt-12 p-8 rounded-2xl bg-[var(--cta-primary)] text-white">
            <h3 className="text-xl font-bold mb-3">Want your own reminder system?</h3>
            <p className="mb-6 opacity-90">
              Our Trip Tracker helps you log .03 finds so you can get a notification when they're
              likely to hit the penny.
            </p>
            <Link
              href="/trip-tracker"
              className="inline-block px-6 py-3 bg-white text-[var(--cta-primary)] rounded-full font-bold hover:bg-opacity-90 transition-all"
            >
              Try Trip Tracker (Free)
            </Link>
          </div>
        </Prose>
      </Section>
    </PageShell>
  )
}
