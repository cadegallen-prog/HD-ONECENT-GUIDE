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
            PennyCentral is a community-built resource for tracking and sharing extreme clearance
            finds. The goal is simple: make it easier to spot patterns, verify items, and help each
            other find legit deals faster.
          </p>

          <p>
            The site works because the community reports what they&apos;re seeing in real stores,
            and PennyCentral organizes that information into a format that&apos;s easier to search,
            scan, and reference.
          </p>

          <h2>Community emphasis</h2>
          <p>
            PennyCentral was built for members of the Home Depot One Cent Items community and is
            shaped by community reports.
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
