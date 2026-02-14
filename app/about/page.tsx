import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "About PennyCentral",
  description:
    "Learn PennyCentral's mission, approach to deal intelligence, and commitment to transparent data quality.",
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/about",
    title: "About PennyCentral",
    description: "How PennyCentral helps shoppers find markdowns with better accuracy and trust.",
  },
}

export default function AboutPage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="About PennyCentral"
        subtitle="Find hidden clearance opportunities faster, with better context and fewer wasted trips."
      />

      <Section title="Our Mission">
        <Prose>
          <p>
            PennyCentral exists to help you make smarter decisions before you drive to a store. We
            focus on practical, transparent, and community-powered deal intelligence.
          </p>
        </Prose>
      </Section>

      <Section title="What We Do">
        <Prose>
          <ul>
            <li>Aggregate and organize community-reported markdown and penny-item signals</li>
            <li>Provide education on clearance lifecycle behavior and store-level variability</li>
            <li>Improve find quality through structured reporting and validation workflows</li>
          </ul>
        </Prose>
      </Section>

      <Section title="How We’re Different">
        <Prose>
          <ul>
            <li>Path-based, easy-to-share page structure (not hidden query-string policy pages)</li>
            <li>Utility-first navigation that keeps core actions one click away</li>
            <li>Plain-language legal and transparency pages written for real users</li>
          </ul>
        </Prose>
      </Section>

      <Section title="Our Standards">
        <Prose>
          <ol>
            <li>Accuracy over hype</li>
            <li>Clarity over clutter</li>
            <li>Transparency over ambiguity</li>
          </ol>
          <p>PennyCentral is independent and is not affiliated with or endorsed by Home Depot.</p>
        </Prose>
      </Section>
    </PageShell>
  )
}
