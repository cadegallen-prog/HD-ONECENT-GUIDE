import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"
import { Button } from "@/components/ui/button"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, FACEBOOK_GROUP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About | Penny Central",
  description:
    "Learn about Penny Central, the companion site for the Home Depot One Cent Items community.",
}

export default function AboutPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="About Penny Central"
        subtitle="A free, community-driven guide for finding $0.01 clearance items at Home Depot."
        primaryAction={{
          label: `Join ${COMMUNITY_MEMBER_COUNT_DISPLAY} penny hunters`,
          href: FACEBOOK_GROUP_URL,
          external: true,
          target: "_blank",
        }}
        secondaryActions={[{ label: "See support options", href: "#support" }]}
      />

      <Section>
        <Prose>
          <p>
            Penny Central is a community-driven guide for finding clearance items marked to $0.01 at
            Home Depot stores. This resource was created by and for members of the{" "}
            <a href={FACEBOOK_GROUP_URL} target="_blank" rel="noopener noreferrer">
              Home Depot One Cent Items Facebook group
            </a>
            , which has grown to over {COMMUNITY_MEMBER_COUNT_DISPLAY} members.
          </p>

          <p>
            This guide covers the clearance lifecycle, digital scouting tools, in-store strategies,
            checkout procedures, and community best practices. Everything you need to understand how
            penny items work and how to find them effectively.
          </p>
        </Prose>
      </Section>

      <Section
        id="support"
        title="How This Site is Supported"
        subtitle="Penny Central is completely free. No ads, no paywalls, no premium tiers. Running this site comes with real costs: hosting, domain, development time, and ongoing maintenance. Here's how you can help:"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                Activate BeFrugal Cashback
              </h3>
              <span className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--text-muted)]">
                Preferred
              </span>
            </div>
            <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
              This is the easiest win. Turn on cashback before normal purchases, earn money back,
              and when you clear $10 BeFrugal sends a referral bonus that keeps Penny Central
              running.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--text-secondary)]">
              <li>Works at Home Depot, Lowe&apos;s, Sam&apos;s Club, Amazon, and more</li>
              <li>Free to sign up, no card required</li>
              <li>Supports Penny Central once you earn $10+ in cashback</li>
            </ul>
            <div className="mt-5">
              <Button asChild variant="primary" size="lg">
                <a
                  href="/go/befrugal"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cta="befrugal"
                >
                  Activate BeFrugal Cashback
                </a>
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)]">
            <h3 className="text-xl font-semibold text-[var(--text-primary)]">Buy Me a Coffee</h3>
            <p className="mt-3 text-[var(--text-secondary)] leading-relaxed">
              Hosting, APIs, map tiles, and in-store testing runs add up. If the guides helped you
              score a haul, buying me a coffee via PayPal keeps everything fast and free.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[var(--text-secondary)]">
              <li>Covers hosting, domains, and analytics</li>
              <li>Funds new tools and field-testing trips</li>
              <li>Keeps the guides ad-free and open to everyone</li>
            </ul>
            <div className="mt-5">
              <Button asChild variant="secondary" size="lg">
                <a href="https://paypal.me/cadegallen" target="_blank" rel="noopener noreferrer">
                  Buy Me a Coffee
                </a>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="How This Site Stays Free"
        subtitle="None of this is required. All the penny item info and guides work with or without it."
      >
        <Prose>
          <p>
            I cover the cost of the site, tools, and updates myself. There are no paywalls or hidden
            gotchas.
          </p>

          <p>
            To keep everything free long term, there are two totally optional ways to support the
            project:
          </p>

          <ul>
            <li>
              BeFrugal cashback — you earn money back on normal orders and I receive a one-time
              referral bonus after you reach $10
            </li>
            <li>
              Buying me a coffee via PayPal when the guides save you serious time or gas money
            </li>
          </ul>

          <p>
            If you want the full breakdown of how cashback works, how long it takes, and what the
            catches are, you can read the full explanation here:
          </p>
        </Prose>

        <div className="flex flex-wrap gap-3">
          <Button asChild variant="secondary" size="lg">
            <Link href="/cashback">Read the full cashback guide</Link>
          </Button>
        </div>
      </Section>

      <Section spacing="md">
        <SupportAndCashbackCard />
      </Section>
    </PageShell>
  )
}
