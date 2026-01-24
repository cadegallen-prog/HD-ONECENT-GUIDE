import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, FACEBOOK_GROUP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About PennyCentral",
  description: "A free, community-driven guide for finding $0.01 clearance items at Home Depot.",
}

export default function AboutPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="About PennyCentral"
        subtitle="A free, community-driven guide for finding $0.01 clearance items at Home Depot."
        primaryAction={{
          label: `Join ${COMMUNITY_MEMBER_COUNT_DISPLAY} penny hunters`,
          href: FACEBOOK_GROUP_URL,
          external: true,
          target: "_blank",
        }}
      />

      <Section>
        <Prose>
          <p>
            Penny Central is a community-built resource for tracking and sharing extreme clearance
            finds at Home Depot. The mission is simple: help people spot patterns, verify penny
            items, and share trustworthy information so the community can find legitimate deals
            faster. We focus on clear, searchable data and practical education so you (Cade) and the
            community can make better decisions in store.
          </p>

          <p>
            The site works because the community reports what they&apos;re seeing in real stores,
            and PennyCentral organizes that information into a format that&apos;s easier to search,
            scan, and reference.
          </p>

          <p>
            Penny Central is run as a small, founder-led project that prioritizes accuracy, safety,
            and clarity over hype. We aim to be the most reliable penny-hunting reference on the web
            by keeping the guide up to date, highlighting verified reporting patterns, and making it
            easy to double-check SKUs before you drive to a store. The goal is not just to list
            deals but to help people understand how penny pricing works, where to look, and how to
            contribute responsibly.
          </p>

          <h2>Community emphasis</h2>
          <p>
            PennyCentral was built for members of the Home Depot One Cent Items community and is
            shaped by community reports.
          </p>

          <p>
            Penny Central exists to support returning visitors and high-quality submissions. That
            means prioritizing a fast Penny List, a frictionless Report a Find flow, and a guide
            that explains the clearance cadence in plain language. If you share a find, you help the
            next person verify it. If you verify a find, you help the list stay accurate. This
            feedback loop is the core of the product.
          </p>

          <h2>Disclosure</h2>
          <p>PennyCentral is not affiliated with Home Depot.</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/support"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold rounded-lg hover:bg-[var(--cta-hover)] transition-colors"
            >
              Support PennyCentral
            </Link>
            <Link
              href="/cashback"
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-[var(--border-default)] text-[var(--text-primary)] font-semibold rounded-lg hover:bg-[var(--bg-elevated)] transition-colors"
            >
              Support & Transparency
            </Link>
          </div>
        </Prose>
      </Section>
    </PageShell>
  )
}
