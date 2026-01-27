import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Support & Transparency | PennyCentral",
  description:
    "Learn how PennyCentral is funded and what to expect as ads and monetization evolve.",
}

export default function TransparencyPage() {
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Support & Transparency"
        subtitle="This page explains how PennyCentral is funded and what to expect as ads and monetization evolve."
      />

      <Section>
        <Prose>
          <h2>What&apos;s changing</h2>
          <p>
            Ads are now live on the site, helping fund continued development and operations. You
            will see ads displayed across our pages to support free access to all tools.
          </p>

          <h2>What won&apos;t change</h2>
          <p>
            The core tools and penny list stay free to use. No paywalls and no subscriptions are
            required.
          </p>

          <h2>Ad experience</h2>
          <p>
            We are optimizing for a usable site first. We will avoid the most disruptive formats,
            like popups that block content and auto-play audio. Placement may change over time as we
            improve performance and layout.
          </p>

          <h2>Optional support</h2>
          <p>
            <Link
              href="/support"
              className="text-[var(--link-default)] hover:text-[var(--link-hover)] hover:underline"
            >
              Support PennyCentral →
            </Link>
          </p>

          <h2>Disclosures</h2>
          <p>
            <strong>Advertising:</strong> PennyCentral may earn revenue from ads displayed on the
            site.
          </p>
          <p>
            <strong>Affiliate/referral links:</strong> If affiliate or referral links are added in
            the future, they will be clearly labeled.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
