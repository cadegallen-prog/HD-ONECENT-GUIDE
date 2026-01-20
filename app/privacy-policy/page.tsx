import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Privacy Policy | Penny Central",
  description:
    "Privacy policy and advertising disclosures for Penny Central, including Ezoic and Monumetric data usage notices.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/privacy-policy",
    title: "Privacy Policy | Penny Central",
    description:
      "Privacy policy and advertising disclosures for Penny Central, including Monumetric data usage notice.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Privacy Policy"
        subtitle="Advertising disclosures and privacy information for Penny Central."
      />

      <Section title="Ezoic Advertising Privacy">
        <Prose>
          <p>
            This Site uses Ezoic to serve personalized advertisements. Ezoic and its partners use
            cookies and other technologies to collect information about your browsing activity to
            provide advertising and analytics services.
          </p>
          {/* Ezoic privacy policy embed - auto-populated by Ezoic scripts */}
          <span id="ezoic-privacy-policy-embed"></span>
          <p>
            For more information about Ezoic&apos;s privacy practices, visit:{" "}
            <a
              href="https://g.ezoic.net/privacy/pennycentral.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ezoic Privacy Policy for Penny Central
            </a>
            .
          </p>
        </Prose>
      </Section>

      <Section title="Publisher Advertising Privacy (Monumetric)">
        <Prose>
          <p>
            This Site is affiliated with Monumetric (dba for The Blogger Network, LLC) for the
            purposes of placing advertising on the Site, and Monumetric will collect and use certain
            data for advertising purposes. To learn more about Monumetric&apos;s data usage, click
            here:{" "}
            <a
              href="https://www.monumetric.com/publisher-advertising-privacy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Publisher Advertising Privacy
            </a>
            .
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
