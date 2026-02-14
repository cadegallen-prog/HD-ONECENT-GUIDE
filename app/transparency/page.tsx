import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { Button } from "@/components/ui/button"
import { COMMUNITY_MEMBER_COUNT_DISPLAY } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Transparency & Funding | PennyCentral",
  description:
    "Learn how PennyCentral is funded and how advertising plus referral links support free access.",
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
            PennyCentral is free to use. No paywalls, no subscriptions, and no premium tier required
            to access the core tools for the <strong>{COMMUNITY_MEMBER_COUNT_DISPLAY}</strong>{" "}
            member community.
          </>
        }
      />

      <Section>
        <Prose className="mb-12">
          <section className="monetization-transparency">
            <h2>PennyCentral Funding & Editorial Disclosure</h2>
            <p>
              To ensure PennyCentral remains a 100% free resource for the deal-hunting community, we
              utilize a professional commercial revenue model. Our operations are funded via:
            </p>
            <ul>
              <li>
                <strong>Display Advertising:</strong> We utilize Google Ad Manager and third-party
                ad exchanges to serve relevant, high-quality advertisements.
              </li>
              <li>
                <strong>Referral Links:</strong> PennyCentral includes a Rakuten referral link. If
                someone signs up through that link, PennyCentral may receive referral compensation.
              </li>
            </ul>
            <p>
              <strong>Editorial Integrity:</strong> Revenue sources never influence our deal-finding
              process. We do not accept payment for favorable placement or reviews.
            </p>
            <p>PennyCentral is not part of the Amazon Associates program.</p>
          </section>
        </Prose>

        {/* Rakuten highlight card */}
        <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            Save Money with Rakuten
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            Get cash back on purchases (including Home Depot) while using our referral link.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            Rakuten is a trusted cash back service used by millions:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 mb-6 text-[var(--text-secondary)]">
            <li>Earn up to 10%+ back at thousands of stores</li>
            <li>$30 welcome bonus after a small qualifying spend</li>
          </ul>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <Button asChild variant="primary" size="lg">
              <a href="/go/rakuten" target="_blank" rel="nofollow sponsored noopener noreferrer">
                Sign Up for Rakuten →
              </a>
            </Button>
            <p className="text-sm text-[var(--text-muted)]">
              Referral disclosure: we may receive a referral bonus for qualifying signups.
            </p>
          </div>
        </div>

        <Prose className="[&_h2]:mt-8 [&_h2:first-of-type]:mt-0">
          <h2>Disclosures</h2>
          <p>
            <strong>Advertising:</strong> PennyCentral may earn revenue from ads displayed on the
            site.
          </p>
          <p>
            <strong>Referral links:</strong> PennyCentral may receive a referral bonus for
            qualifying signups (for example, Rakuten). These links will be clearly labeled.
          </p>

          <h2>Feedback</h2>
          <p>
            If something breaks or looks off, report it here:{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>
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
