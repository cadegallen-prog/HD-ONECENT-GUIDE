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

      <Section title="Google AdSense Privacy Disclosure">
        <Prose>
          <p>
            Penny Central uses third-party advertising vendors, including Google, to serve ads on
            this site. These vendors use cookies to serve ads based on a user&apos;s prior visits to
            this website and other sites on the internet.
          </p>
          <p>
            Google&apos;s use of the DoubleClick DART cookie enables it and its partners to serve
            ads to you based on your visit to Penny Central and/or other sites on the internet.
            Users may opt out of the use of the DART cookie by visiting Google&apos;s ad settings or
            by visiting{" "}
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
              www.aboutads.info
            </a>
            .
          </p>
          <p>
            If you would like to learn more about how Google uses data when you use partner sites or
            apps, you can review Google&apos;s disclosures at{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://policies.google.com/technologies/ads
            </a>
            .
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
