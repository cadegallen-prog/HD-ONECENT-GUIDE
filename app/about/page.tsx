import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, FACEBOOK_GROUP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About PennyCentral",
  description:
    "About Cade Allen and PennyCentral: the origin story, mission, community leadership, and philosophy behind the Home Depot One Cent Items ecosystem.",
  alternates: {
    canonical: "/about",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/about",
    title: "About PennyCentral",
    description:
      "Meet Cade Allen and learn how PennyCentral grew from a simple guide into a trusted community platform.",
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
    sameAs: [FACEBOOK_GROUP_URL],
    founder: {
      "@type": "Person",
      name: "Cade Allen",
      url: "https://www.pennycentral.com/about",
    },
    foundingDate: "2025",
    areaServed: {
      "@type": "Country",
      name: "United States",
    },
  }

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: "https://www.pennycentral.com/about",
    name: "About PennyCentral",
    author: {
      "@type": "Person",
      name: "Cade Allen",
      url: "https://www.pennycentral.com/about",
    },
    publisher: {
      "@type": "Organization",
      name: "PennyCentral",
      url: "https://www.pennycentral.com",
    },
  }

  return (
    <PageShell width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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
          <h2>From a Simple PDF to a Real Platform</h2>
          <p>
            PennyCentral did not start as a business plan. It started because a guide in Facebook
            files was difficult to use on mobile.
          </p>
          <p>
            On April 5, 2025, the <strong>Home Depot One Cent Items</strong> community restarted
            from zero. The growth was explosive, rocketing to over {COMMUNITY_MEMBER_COUNT_DISPLAY}{" "}
            members. New members joined every day asking the same practical questions: where to
            start, what is real, and how to hunt responsibly.
          </p>
          <p>
            I am a nurse by trade, not a developer. I built the first version of this site so people
            could open one link and get answers without downloading files or digging through old
            posts.
          </p>

          <h2>The Story Behind the Site</h2>
          <p>
            As the group grew, one thing became obvious: social feeds are good for conversation but
            bad for searchable history. Good finds get buried quickly.
          </p>
          <p>
            PennyCentral became the place to preserve that knowledge in a format people can actually
            use in stores: clearer structure, easier lookup, and better reporting loops.
          </p>

          <h2>Who Is Behind PennyCentral</h2>
          <p>
            PennyCentral is founder-led by <strong>Cade Allen</strong>. The broader community and
            group leadership made it possible to grow into what it is today.
          </p>
          <ul>
            <li>
              <strong>Spoe Jarky</strong> - Facebook group founder
            </li>
            <li>
              <strong>Jorian Wulf</strong> - fellow admin
            </li>
            <li>
              <strong>The members</strong> - thousands of people reporting and validating finds
            </li>
          </ul>

          <h2>Our Philosophy</h2>
          <p>
            The fun is in the hunt: the puzzle, the timing, and finding something hidden in plain
            sight. We keep this hobby strong by sharing real information and treating store teams
            with respect.
          </p>
          <p>
            We are strict about standards because bad data wastes trips. Our operating philosophy:
          </p>
          <ol>
            <li>Accuracy over hype</li>
            <li>Clarity over clutter</li>
            <li>Transparency over ambiguity</li>
          </ol>
          <p>PennyCentral is independent and is not affiliated with or endorsed by Home Depot.</p>

          <h2>The Scavenger Hunt Philosophy</h2>
          <p>
            For us, penny shopping isn't really about the items. (I have a storage unit that proves
            I don't need more stuff.) It's about the hunt. It's the challenge, the scavenger hunt,
            the thrill of finding something hidden in plain sight.
          </p>
          <p>
            That shared excitement is what powers this site. Millions of items are marked down and
            most are thrown away. When we find them, we save them from a landfill and get a great
            deal. It's a win-win, as long as we play by the rules and treat store staff with
            respect.
          </p>

          <p>
            I never thought I'd be running a website with this many users. I make mistakes. I break
            things. But as long as this community keeps hunting, I'll keep building.
          </p>
          <p className="mt-6 text-[var(--text-muted)] italic">
            — Cade Allen, PennyCentral Creator, Home Depot One Cent Items Admin, and fellow hunter
          </p>
        </Prose>
      </Section>

      <Section title="Where to Start">
        <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/guide"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-[var(--cta-primary)] px-5 py-3 font-semibold text-[var(--cta-text)]"
          >
            Read the Step-by-Step Guide
          </Link>
          <Link
            href="/penny-list"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] px-5 py-3 font-medium text-[var(--text-primary)]"
          >
            Browse the Penny List
          </Link>
          <Link
            href={FACEBOOK_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center rounded-md border border-[var(--border-default)] bg-[var(--bg-elevated)] px-5 py-3 font-medium text-[var(--text-primary)]"
          >
            Join the Facebook Group
          </Link>
        </div>
      </Section>
    </PageShell>
  )
}
