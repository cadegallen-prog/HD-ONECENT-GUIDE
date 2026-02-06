import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, FACEBOOK_GROUP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About PennyCentral",
  description:
    "A free, community-driven guide for finding $0.01 clearance items at Home Depot. Learn about our mission, transparency practices, and how to contact us.",
  alternates: {
    canonical: "/about",
  },
}

export default function AboutPage() {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PennyCentral",
    url: "https://www.pennycentral.com",
    logo: "https://www.pennycentral.com/penny-central-logo.png",
    description:
      "A community-driven resource for finding and verifying $0.01 clearance items at Home Depot.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "contact@pennycentral.com",
      url: "https://www.pennycentral.com/contact",
    },
    sameAs: ["https://www.facebook.com/groups/homedepotonecent"],
    founder: {
      "@type": "Person",
      name: "Penny Central Founder",
    },
    foundingDate: "2025",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  }

  return (
    <PageShell width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

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
        <Prose className="[&_h2]:mt-10 [&_h2:first-of-type]:mt-0">
          <h2>From a Humble PDF to a Community Platform</h2>
          <p>
            PennyCentral didn&apos;t start as a business idea. It started because a PDF guide on
            Facebook was hard to download.
          </p>
          <p>
            On April 5, 2025, we restarted the <strong>Home Depot One Cent Items</strong> community
            from scratch. The growth was explosive—rocketing from zero to over 62,000 members in
            less than 10 months. New members joined every day asking the same questions:{" "}
            <em>How do I find them?</em> <em>Is it a scam?</em> <em>What rules do I follow?</em>{" "}
            Check the files section, we said. But on mobile, downloading files was a pain.
          </p>
          <p>
            I&apos;m a nurse by trade, not a coder. I had zero website experience. But I figured:{" "}
            <em>What if I just put the guide on a webpage?</em> That way, people could just click a
            link. No downloads, no searching. Simple.
          </p>
          <p>
            That simple idea—Project &quot;Host the PDF&quot;—somehow exploded. While{" "}
            <strong>we</strong> built the community together, <strong>I</strong> built this website
            in my spare time to serve that community.
          </p>

          <h2>Growing with the 62,000+</h2>
          <p>
            When I launched the site in December 2025, the group had about 32,000 members. Today, we
            have crossed 62,000.
          </p>
          <p>
            As the community grew, the needs grew. Facebook is great for conversation, but it&apos;s
            terrible for history. Excellent finds would get buried in the feed within hours. We
            needed a repository—a way to tag, track, and search findings across the country. That
            became the <strong>Penny List</strong>.
          </p>
          <p>
            This website is an extension of that community. It exists to do what social media
            can&apos;t: organize our collective knowledge into a tool we can actually use in the
            aisles.
          </p>

          <h2>The Scavenger Hunt Philosophy</h2>
          <p>
            For us, penny shopping isn&apos;t really about the items. (I have a storage unit that
            proves I don&apos;t need more stuff.) It&apos;s about the hunt. It&apos;s the challenge,
            the scavenger hunt, the thrill of finding something hidden in plain sight.
          </p>
          <p>
            That shared excitement is what powers this site. Millions of items are marked down, and
            most are thrown away. When we find them, we save them from a landfill and get a great
            deal. It&apos;s a win-win, as long as we play by the rules and treat store staff with
            respect.
          </p>

          <h2>Independent & Authentic</h2>
          <p>
            PennyCentral is not a corporation. It&apos;s a passion project born from a Facebook
            group.
          </p>
          <ul>
            <li>
              <strong>We are independent:</strong> We are not affiliated with The Home Depot.
            </li>
            <li>
              <strong>We are transparent:</strong> We use ads and affiliate links to pay for the
              servers, database, and domains that keep this site free for everyone.
            </li>
            <li>
              <strong>We are grateful:</strong> This community wouldn&apos;t exist without{" "}
              <strong>Spoe Jarky</strong> (our founder), fellow admin <strong>Jorian Wulf</strong>,
              and the thousands of members who contribute data every day.
            </li>
          </ul>

          <p>
            I never thought I&apos;d be running a website with 20,000 monthly users. I make
            mistakes. I break things. But I promise to keep fixing them, creating value, and
            listening to the community that made this possible.
          </p>
        </Prose>

        <div className="mt-12 flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Link
            href="/penny-list"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold rounded-lg hover:bg-[var(--cta-hover)] shadow-sm transition-all"
          >
            Check the Community List
          </Link>
          <Link
            href={FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] font-medium rounded-lg hover:bg-[var(--bg-secondary)] transition-all"
          >
            Join the Facebook Group
          </Link>
        </div>
      </Section>
    </PageShell>
  )
}
