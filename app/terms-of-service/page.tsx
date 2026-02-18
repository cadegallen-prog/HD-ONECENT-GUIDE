import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Terms of Service | PennyCentral",
  description:
    "Terms governing use of PennyCentral, including real-time deal-data disclaimers, advertising disclosures, and liability limits.",
  alternates: {
    canonical: "/terms-of-service",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/terms-of-service",
    title: "Terms of Service | PennyCentral",
    description: "Terms governing the use of PennyCentral.",
  },
}

export default function TermsOfServicePage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="Terms of Service"
        subtitle={
          <>
            <strong>Last Updated:</strong> March 1, 2026
          </>
        }
      />

      <Section title="1) Acceptance of Terms">
        <Prose>
          <p>
            By using PennyCentral, you agree to these Terms of Service. If you do not agree, please
            do not use the site.
          </p>
        </Prose>
      </Section>

      <Section title="2) Service Description">
        <Prose>
          <p>
            PennyCentral is an informational aggregator and community utility focused on markdown
            and penny-item intelligence.
          </p>
          <ul>
            <li>We do not sell products.</li>
            <li>We do not process customer transactions.</li>
            <li>We do not control retailer pricing, stock, or policy decisions.</li>
          </ul>
        </Prose>
      </Section>

      <Section title="3) Accuracy and Availability Disclaimer">
        <Prose>
          <p>
            Pricing and inventory data can become outdated quickly and may be delayed, incomplete,
            or inaccurate.
          </p>
          <p>
            You are responsible for confirming price, availability, and purchase terms directly with
            the retailer before making travel or buying decisions.
          </p>
        </Prose>
      </Section>

      <Section title="4) User Responsibilities">
        <Prose>
          <ul>
            <li>Use the service lawfully and respectfully.</li>
            <li>Do not scrape, reverse engineer, or abuse site systems.</li>
            <li>Do not submit intentionally false or misleading reports.</li>
            <li>Follow local laws and individual store policies during purchases.</li>
          </ul>
        </Prose>
      </Section>

      <Section title="5) Advertising and Third-Party Services">
        <Prose>
          <p>Some pages may include advertising or links to third-party services.</p>
          <p>
            Third-party websites, promotions, and advertisers have their own terms and privacy
            practices, which are outside our control.
          </p>
        </Prose>
      </Section>

      <Section title="6) Limitation of Liability">
        <Prose>
          <p>
            To the fullest extent permitted by law, PennyCentral is not liable for direct, indirect,
            incidental, consequential, special, or punitive damages arising from your use of the
            service.
          </p>
          <p>This includes losses related to:</p>
          <ul>
            <li>Outdated or inaccurate pricing/inventory information</li>
            <li>Store refusal to honor markdowns</li>
            <li>Travel costs, missed opportunities, or reliance on displayed data</li>
          </ul>
        </Prose>
      </Section>

      <Section title="7) Intellectual Property">
        <Prose>
          <p>
            Site content, software, and design are owned by PennyCentral or its licensors and are
            protected by law. Unauthorized copying, scraping, or redistribution is prohibited.
          </p>
        </Prose>
      </Section>

      <Section title="8) Changes to Terms">
        <Prose>
          <p>
            We may update these terms at any time. Continued use after updates are posted
            constitutes acceptance of the revised terms.
          </p>
        </Prose>
      </Section>

      <Section title="9) Governing Law">
        <Prose>
          <p>
            These terms are governed by applicable United States and state law, without regard to
            conflict-of-law rules.
          </p>
        </Prose>
      </Section>

      <Section title="10) Contact">
        <Prose>
          <p>
            Questions about these terms:{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
