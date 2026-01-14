import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Privacy Policy | Penny Central",
  description:
    "Privacy policy and advertising disclosures for Penny Central, including Monumetric data usage notice.",
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

      <Section title="Publisher Advertising Privacy (Monumetric)">
        <Prose>
          <p>
            This Site is affiliated with Monumetric (dba for The Blogger Network, LLC) for the
            purposes of placing advertising on the Site, and Monumetric will collect and use certain
            data for advertising purposes. To learn more about Monumetric’s data usage, click here:{" "}
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
