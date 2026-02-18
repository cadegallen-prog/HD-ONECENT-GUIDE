import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Contact PennyCentral",
  description: "Reach PennyCentral for corrections, support, partnerships, and privacy requests.",
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
    title: "Contact PennyCentral",
    description: "Reach PennyCentral for corrections, support, partnerships, and privacy requests.",
  },
}

export default function ContactPage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="Contact PennyCentral"
        subtitle="Email is the primary contact path. One inbox, clear routing, no form friction."
      />

      <Section title="Best Way to Reach Us">
        <Prose>
          <p>
            Email us at{" "}
            <a
              href="mailto:contact@pennycentral.com"
              className="text-[var(--cta-primary)] underline"
            >
              contact@pennycentral.com
            </a>
            . We read every message and prioritize corrections that improve Penny List accuracy.
          </p>
          <p>Recommended subject lines (optional):</p>
          <ul>
            <li>
              <strong>Correction:</strong> for SKU/store/price updates
            </li>
            <li>
              <strong>General:</strong> for support or site feedback
            </li>
            <li>
              <strong>Partnership:</strong> for media or collaboration requests
            </li>
            <li>
              <strong>Privacy Request:</strong> for personal-data rights requests
            </li>
          </ul>
          <p>
            For urgent correction emails, include SKU, store location, observed price, and date/time
            to help us validate quickly.
          </p>
        </Prose>
      </Section>

      <Section title="Privacy and Data Requests">
        <Prose>
          <p>Privacy rights and deletion details live on the privacy pages:</p>
          <ul>
            <li>
              <a href="/privacy-policy" className="text-[var(--cta-primary)] underline">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="/do-not-sell-or-share" className="text-[var(--cta-primary)] underline">
                Do Not Sell or Share
              </a>
            </li>
          </ul>
          <p>
            You can still email{" "}
            <a href="mailto:contact@pennycentral.com?subject=Privacy%20Request">
              contact@pennycentral.com
            </a>{" "}
            for any privacy request.
          </p>
        </Prose>
      </Section>

      <Section title="Response Windows">
        <Prose>
          <ul>
            <li>Corrections: usually within 24-48 hours</li>
            <li>General and partnership inquiries: usually within 3-5 business days</li>
          </ul>
        </Prose>
      </Section>
    </PageShell>
  )
}
