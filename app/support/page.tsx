import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { Button } from "@/components/ui/button"
import { DONATION_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "Support PennyCentral",
  description: "Learn how PennyCentral is funded and how you can optionally support the project.",
}

export default function SupportPage() {
  const hasDonationUrl = Boolean(DONATION_URL)

  return (
    <PageShell width="narrow">
      <PageHeader
        title="Support PennyCentral"
        subtitle="PennyCentral is free to use. No paywalls, no subscriptions, and no premium tier required to access the core tools."
      />

      <Section>
        <Prose>
          <h2>Sustainability</h2>
          <p>
            As the site grows, there are real costs to keep it online and improving (hosting,
            database, tooling, and maintenance). To keep PennyCentral sustainable, we use a mix of
            advertising and optional community support.
          </p>

          <h2>Ads</h2>
          <p>
            Ads are being enabled now. You may start seeing ads appear as setup and testing
            finishes.
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
            <strong>Affiliate/referral links:</strong> If affiliate or referral links are added in
            the future, they will be clearly labeled.
          </p>

          <h2>Feedback</h2>
          <p>
            If something breaks or looks off, report it here:{" "}
            <a href="mailto:support@pennycentral.com">support@pennycentral.com</a>
          </p>

          <div className="mt-6">
            <Link
              href="/cashback"
              className="text-[var(--link-default)] hover:text-[var(--link-hover)] hover:underline"
            >
              Support & Transparency →
            </Link>
          </div>
        </Prose>
      </Section>
    </PageShell>
  )
}
