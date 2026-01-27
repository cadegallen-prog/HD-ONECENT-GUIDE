import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Privacy Policy | Penny Central",
  description:
    "Privacy policy and advertising disclosures for Penny Central, including Ezoic data usage notices.",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/privacy-policy",
    title: "Privacy Policy | Penny Central",
    description: "Privacy policy and advertising disclosures for Penny Central.",
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

      {/* Section title="Publisher Advertising Privacy (Monumetric)" - Temporarily hidden during Ezoic MCM review
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
      */}

      <Section title="Google Advertising Privacy Disclosure">
        <Prose>
          <p>
            Penny Central uses third-party advertising vendors, including Google, to serve ads on
            this site. These vendors use cookies to serve ads based on a user&apos;s prior visits to
            this website and other sites on the internet.
          </p>
          <p>
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based
            on your visit to Penny Central and/or other sites on the internet. Users may opt out of
            personalized advertising by visiting{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              Google Ad Settings
            </a>{" "}
            or by visiting{" "}
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
              www.aboutads.info
            </a>
            .
          </p>
          <p>
            For more information on how Google uses data in its ad products, please visit{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy & Terms
            </a>
            .
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
