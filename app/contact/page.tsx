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
          <p>
            The fastest way to reach Penny Central is email. We read every message and prioritize
            corrections, broken links, and anything that improves the accuracy of the Penny List.
          </p>
        </Prose>

        {/* Primary contact card */}
        <div className="mt-6 p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">Email Us</h2>
          <a
            href="mailto:contact@pennycentral.com"
            className="inline-flex items-center min-h-[44px] text-xl font-medium text-[var(--link-default)] hover:text-[var(--link-hover)] hover:underline transition-colors"
          >
            contact@pennycentral.com
          </a>
          <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
            Include any SKU numbers, store details, and dates that help us verify what you saw. For
            collaboration or media requests, include your timeline and the best way to follow up.
          </p>
        </div>
      </Section>
    </PageShell>
  )
}
