import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { Button } from "@/components/ui/button"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, DONATION_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Support | PennyCentral",
  description:
    "Learn how PennyCentral is funded, how ads work on the site, and how you can optionally support the project.",
}

export default function SupportPage() {
  const hasDonationUrl = Boolean(DONATION_URL)

  return (
    <PageShell width="narrow">
      <PageHeader
        title="Support PennyCentral"
        subtitle={
          <>
            PennyCentral is free to use. No paywalls, no subscriptions, and no premium tier required
            to access the core tools for the <strong>{COMMUNITY_MEMBER_COUNT_DISPLAY}</strong>{" "}
            member community.
          </>
        }
      />

      <div className="flex justify-center mb-12">
        <EditorialBlock />
      </div>

      <Section>
        {/* Rakuten highlight card - primary monetization CTA */}
        <div className="p-6 sm:p-8 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">
            Save Money & Support the Site with Rakuten
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
            Get cash back on purchases (including Home Depot!) while helping fund PennyCentral—at no
            cost to you.
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
              <a href="/go/rakuten" target="_blank" rel="noopener noreferrer">
                Sign Up for Rakuten →
              </a>
            </Button>
            <p className="text-sm text-[var(--text-muted)]">
              Affiliate disclosure: we earn a commission on qualifying referrals.
            </p>
          </div>
        </div>

        {/* Remaining content */}
        <Prose className="[&_h2]:mt-8 [&_h2:first-of-type]:mt-0">
          <h2>Sustainability</h2>
          <p>
            As the site grows, there are real costs to keep it online and improving (hosting,
            database, tooling, and maintenance). To keep PennyCentral sustainable, we use a mix of
            advertising and optional community support.
          </p>

          <h2>Ads</h2>
          <p>
            Ads are now live on the site. You will see ads displayed across our pages to help fund
            continued development and operations.
          </p>
          <p>
            We are optimizing for a usable site first. That means we will avoid the most disruptive
            formats, like popups that block content and auto-play audio. Placement may change over
            time as we improve performance and layout.
          </p>

          <h2>Optional Support</h2>
          {hasDonationUrl ? (
            <>
              <p>
                If you&apos;d like to support PennyCentral directly, you can do so using the button
                below.
              </p>
              <div className="mt-4">
                <Button asChild variant="primary" size="lg">
                  <a href={DONATION_URL} target="_blank" rel="noopener noreferrer">
                    Support PennyCentral
                  </a>
                </Button>
              </div>
              <p className="text-sm text-[var(--text-muted)] mt-2">
                Optional. If you use an ad blocker, that&apos;s fine too.
              </p>
            </>
          ) : (
            <p>Donations are not enabled yet. A PennyCentral support link is coming soon.</p>
          )}

          <h2>Disclosures</h2>
          <p>
            <strong>Advertising:</strong> PennyCentral may earn revenue from ads displayed on the
            site.
          </p>
          <p>
            <strong>Affiliate/referral links:</strong> PennyCentral may earn a commission from
            qualifying referrals (for example, Rakuten). These links will be clearly labeled.
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
