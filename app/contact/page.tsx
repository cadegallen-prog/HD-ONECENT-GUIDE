import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Contact Penny Central",
  description: "Contact Penny Central with questions, corrections, or partnership inquiries.",
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/contact",
    title: "Contact Penny Central",
    description: "Contact Penny Central with questions, corrections, or partnership inquiries.",
  },
}

export default function ContactPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Contact Penny Central"
        subtitle="Questions, corrections, or partnership ideas? Reach out anytime."
      />

      <Section>
        <Prose>
          <p className="lead">
            <strong>We prioritize accuracy above everything else.</strong>
          </p>
          <p>
            PennyCentral is maintained by the community, for the community. If you spot a wrong SKU,
            an expired penny item, or a price change, we want to know immediately. Our goal is to
            verify and fix data errors within 24 hours to keep the list safe for everyone.
          </p>
        </Prose>

        {/* Primary contact card */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Corrections Channel */}
          <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)] mb-3">
              <span className="text-[var(--status-error)]">●</span> Report a Correction
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              Found a bad SKU on the Penny List? Let us know so we can flag it.
            </p>
            <a
              href="mailto:contact@pennycentral.com?subject=Correction: SKU Verification"
              className="inline-flex items-center font-medium text-[var(--cta-primary)] hover:underline"
            >
              contact@pennycentral.com
            </a>
          </div>

          {/* General Support */}
          <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              General Inquiries
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              For feedback, partnership requests, or help with the site.
            </p>
            <a
              href="mailto:contact@pennycentral.com"
              className="inline-flex items-center font-medium text-[var(--text-primary)] hover:underline"
            >
              contact@pennycentral.com
            </a>
          </div>
        </div>

        <Prose className="mt-8">
          <h3>Response Time</h3>
          <p>
            We are a small, founder-led team. We aim to respond to data corrections within 24 hours.
            General inquiries are answered as time permits. Thank you for helping keep PennyCentral
            accurate.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
