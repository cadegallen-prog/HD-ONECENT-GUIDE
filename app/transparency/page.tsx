import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Transparency | PennyCentral",
  description:
    "How PennyCentral is funded through advertising and how editorial independence is protected.",
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
  }

  return (
    <PageShell width="narrow">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />

      <PageHeader
        title="Transparency"
        subtitle="How this site is funded and how editorial decisions are made."
      />

      <Section>
        <Prose className="[&_h2]:mt-8 [&_h2:first-of-type]:mt-0">
          <h2>Funding Sources</h2>
          <p>PennyCentral is free to use. The site is funded through advertising.</p>
          <ul>
            <li>
              <strong>Advertising.</strong> Display ads are served on some pages by third-party ad
              networks.
            </li>
          </ul>

          <h2>Editorial Independence</h2>
          <p>
            Revenue does not influence the Penny List or editorial content. We do not sell
            placement, accept payment to alter item rankings, or promote products in exchange for
            compensation.
          </p>

          <h2>Advertising Disclosure</h2>
          <p>
            Advertising may appear on selected pages to support hosting and operations. Sponsored
            placement does not determine Penny List inclusion or ranking.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about funding or disclosures can be sent to{" "}
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
