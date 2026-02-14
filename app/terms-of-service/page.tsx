import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Terms of Service | PennyCentral",
  description: "Terms of service for PennyCentral.com.",
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
    description: "Terms of service for PennyCentral.com.",
  },
}

export default function TermsOfServicePage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Terms of Service"
        subtitle={
          <>
            <strong>Effective date:</strong> January 28, 2026
          </>
        }
      />

      <Section>
        <Prose>
          <p>
            By using PennyCentral.com (the “Site”), you agree to these Terms of Service. If you do
            not agree, please do not use the Site.
          </p>

          <h2>Site Use</h2>
          <p>
            PennyCentral is provided for informational purposes only. Finds are community-sourced
            and not guaranteed. Always verify pricing and availability in-store.
          </p>
          <p>
            You agree not to misuse the Site, including attempting to interfere with the Site’s
            operation, access restricted areas, or scrape the Site in a way that degrades
            performance.
          </p>

          <h2>Submissions</h2>
          <p>
            If you submit information (such as reporting a find), you grant PennyCentral a
            non-exclusive, worldwide, royalty-free license to use, reproduce, and display that
            content to operate and improve the Site. You represent that you have the right to submit
            the information you provide.
          </p>

          <h2>Advertising & Referral Links</h2>
          <p>
            The Site may include third-party advertising and referral links (for example, Rakuten).
            We may earn revenue from ads and may receive referral bonuses from qualifying signups.
            These third parties are not endorsed by PennyCentral unless explicitly stated.
          </p>
          <p>PennyCentral is not part of the Amazon Associates program.</p>

          <h2>Cookies and Data Collection</h2>
          <p>
            PennyCentral is fully compliant with 2026 privacy standards, including the Google
            Privacy Sandbox and Topics API. We prioritize user privacy by honoring Global Privacy
            Control (GPC) signals. If your browser broadcasts a GPC signal, we automatically treat
            this as an &quot;Opt-Out of Sale/Sharing&quot; request for all personal data.
          </p>

          <h2>Disclaimers</h2>
          <p>
            PennyCentral is not affiliated with The Home Depot. The Site is provided “as is” and “as
            available” without warranties of any kind, express or implied.
          </p>
          <p>
            To the fullest extent permitted by law, PennyCentral will not be liable for any
            indirect, incidental, consequential, special, or exemplary damages arising from or
            related to your use of the Site.
          </p>

          <h2>Changes</h2>
          <p>
            We may update these terms from time to time. We will update the effective date at the
            top of this page when changes are made.
          </p>

          <h2>Governing Law</h2>
          <p>These terms are governed by the laws of the United States and the State of Georgia.</p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Email{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>.
          </p>
          <p className="text-sm text-[var(--text-muted)]">Last updated: January 28, 2026</p>
        </Prose>
      </Section>
    </PageShell>
  )
}
