import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { COMMUNITY_MEMBER_COUNT_DISPLAY } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Transparency & Funding | PennyCentral",
  description:
    "How PennyCentral is funded and how editorial independence is protected for the community.",
  alternates: {
    canonical: "/transparency",
  },
}

export default function TransparencyPage() {
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    publisher: {
      "@type": "Organization",
      name: "PennyCentral",
      email: "contact@pennycentral.com",
    },
    mainEntity: {
      "@type": "Service",
      name: "Deal Hunting Community",
      provider: "PennyCentral",
    },
  }

  return (
    <PageShell width="narrow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <PageHeader
        title="Transparency & Funding"
        subtitle={
          <>
            PennyCentral is free to use for the <strong>{COMMUNITY_MEMBER_COUNT_DISPLAY}</strong>{" "}
            member community.
          </>
        }
      />

      <Section>
        <Prose className="[&_h2]:mt-8 [&_h2:first-of-type]:mt-0">
          <h2>How the Site Is Funded</h2>
          <p>PennyCentral may generate revenue through:</p>
          <ul>
            <li>Display advertising</li>
            <li>Referral or affiliate links on selected outbound pages</li>
          </ul>

          <h2>What This Means for You</h2>
          <p>
            We do not charge users for core tools. Revenue helps cover hosting, operations, and
            ongoing product maintenance.
          </p>
          <p>
            Editorial decisions are independent. We do not sell placement in the Penny List and do
            not accept payment to manipulate ranking or visibility of reported items.
          </p>

          <h2>Disclosure Promise</h2>
          <p>
            If a link may generate referral compensation, we disclose that relationship in context.
            This includes Rakuten referral links where PennyCentral may earn compensation for
            qualifying signups. We keep disclosure language straightforward and avoid promotional
            pressure in trust/legal surfaces.
          </p>

          <h2>Questions or Concerns</h2>
          <p>
            If any monetization or disclosure language feels unclear, contact us at{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>.
          </p>

          <div className="mt-6">
            <Link
              href="/contact"
              className="text-[var(--link-default)] hover:text-[var(--link-hover)] hover:underline"
            >
              Contact Us →
            </Link>
          </div>
        </Prose>
      </Section>
    </PageShell>
  )
}
