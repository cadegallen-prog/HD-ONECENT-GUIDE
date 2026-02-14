import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Privacy Policy | PennyCentral",
  description:
    "How PennyCentral collects, uses, stores, and shares data, including cookie controls and U.S. privacy rights.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/privacy-policy",
    title: "Privacy Policy | PennyCentral",
    description: "Privacy practices, disclosures, and rights controls for PennyCentral.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="Privacy Policy"
        subtitle={
          <>
            <strong>Last Updated:</strong> March 1, 2026
          </>
        }
      />

      <Section title="1) Scope">
        <Prose>
          <p>
            This Privacy Policy applies to PennyCentral and related pages, including the Penny List,
            Report a Find workflow, and supporting informational routes.
          </p>
        </Prose>
      </Section>

      <Section title="2) Information We Collect">
        <Prose>
          <h3>Automatically Collected Data</h3>
          <ul>
            <li>IP address (used for approximate location and abuse prevention)</li>
            <li>Browser/device/operating-system metadata</li>
            <li>Pages visited, referral source, and interaction timestamps</li>
          </ul>

          <h3>Information You Provide</h3>
          <ul>
            <li>Report submissions (for example: SKU details and location context)</li>
            <li>Contact submissions (name, email, message, and optional context fields)</li>
          </ul>

          <h3>Local Browser Storage</h3>
          <p>
            We may store selected preferences locally in your browser (for example, list or filter
            preferences) to improve your experience.
          </p>
        </Prose>
      </Section>

      <Section title="3) How We Use Information">
        <Prose>
          <ul>
            <li>Operate and maintain core website functionality</li>
            <li>Improve reliability, safety, and user experience</li>
            <li>Respond to corrections, support messages, and partnership outreach</li>
            <li>Detect abuse, spam, and technical failures</li>
            <li>Support monetization through affiliate programs and future advertising</li>
          </ul>
        </Prose>
      </Section>

      <Section title="4) Cookies and Similar Technologies">
        <Prose>
          <h3>Essential Technologies</h3>
          <p>
            Essential cookies or similar technologies may be used for security, session continuity,
            and site functionality.
          </p>

          <h3>Non-Essential Technologies</h3>
          <p>
            Analytics and advertising technologies may be used to measure performance and, when
            enabled, support interest-based advertising.
          </p>
          <p>
            Where required, we will provide a consent mechanism and store your preferences before
            non-essential technologies are activated.
          </p>
        </Prose>
      </Section>

      <Section title="5) Affiliate and Advertising Disclosures">
        <Prose>
          <p>
            Some outbound links may be affiliate links, including Rakuten referral links. If you
            click and complete a qualifying signup, PennyCentral may receive referral compensation
            at no extra cost to you.
          </p>
          <p>
            PennyCentral may integrate third-party advertising partners in the future. If enabled,
            this policy and the privacy choices page will be updated with partner-specific
            disclosures, controls, and links.
          </p>
        </Prose>
      </Section>

      <Section title="6) Sharing and Retention">
        <Prose>
          <p>We may share limited data with service providers for:</p>
          <ul>
            <li>Hosting and infrastructure</li>
            <li>Analytics and operations</li>
            <li>Fraud/abuse prevention</li>
            <li>Affiliate or ad attribution (when applicable)</li>
          </ul>
          <p>
            We retain information only as long as necessary for operations, security, legal
            obligations, and legitimate business records.
          </p>
        </Prose>
      </Section>

      <Section id="ccpa" title="7) U.S. Privacy Rights (including CCPA/CPRA)">
        <Prose>
          <p>
            Depending on your state, you may have rights to request access, correction, deletion, or
            additional disclosures regarding personal information.
          </p>
          <p>
            You can submit a request at{" "}
            <a href="/do-not-sell-or-share" className="text-[var(--cta-primary)] underline">
              /do-not-sell-or-share
            </a>
            .
          </p>
          <p>
            Where required by law, recognized Global Privacy Control (GPC) browser signals are
            honored as an opt-out request in applicable sale/share contexts.
          </p>
        </Prose>
      </Section>

      <Section title="8) Contact">
        <Prose>
          <p>
            For privacy questions or requests, email{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
