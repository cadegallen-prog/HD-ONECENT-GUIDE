import type { Metadata } from "next"
import Link from "next/link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Internal Systems Reference | PennyCentral",
  description: "Reference context on store-side systems that can affect clearance outcomes.",
  alternates: {
    canonical: "/internal-systems",
  },
  robots: {
    index: false,
    follow: false,
  },
}

export default function InternalSystemsPage() {
  return (
    <PageShell width="narrow">
      <p className="mb-6 text-sm text-[var(--text-secondary)]">
        <Link className="text-[var(--cta-primary)] underline" href="/guide">
          ← Back to Guide
        </Link>
      </p>

      <PageHeader
        title="Internal Systems Reference"
        subtitle="Operational context that can affect clearance outcomes. This page is informational and intentionally not indexed."
      />

      <Section>
        <Prose className="[&_h2]:mt-8 [&_h2:first-of-type]:mt-0">
          <h2>What this page is</h2>
          <p>
            This page documents operational signals that can influence in-store clearance outcomes.
            It exists as a reference supplement to the main Guide chapters.
          </p>

          <h2>How to use it</h2>
          <ul>
            <li>Treat these notes as context, not guarantees.</li>
            <li>Use in-store scan behavior as final confirmation.</li>
            <li>Prioritize the main Guide for day-to-day execution.</li>
          </ul>

          <h2>Key operational factors</h2>
          <ul>
            <li>Store-level reset timing and local inventory turnover can vary by location.</li>
            <li>Clearance stage signals are directional and may lag real checkout outcomes.</li>
            <li>Department-level handling can change how quickly items are pulled or repriced.</li>
          </ul>

          <h2>Related pages</h2>
          <ul>
            <li>
              <Link href="/inside-scoop">Inside Scoop</Link>
            </li>
            <li>
              <Link href="/in-store-strategy">In-Store Strategy</Link>
            </li>
            <li>
              <Link href="/penny-list">Live Penny List</Link>
            </li>
          </ul>
        </Prose>
      </Section>
    </PageShell>
  )
}
