import Link from "next/link"
import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { COMMUNITY_MEMBER_COUNT_DISPLAY, FACEBOOK_GROUP_URL } from "@/lib/constants"

export const metadata: Metadata = {
  title: "About PennyCentral",
  description:
    "A free, community-driven guide for finding $0.01 clearance items at Home Depot. Learn about our mission, transparency practices, and how to contact us.",
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
    foundingDate: "2024",
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
          <p>
            Penny Central is a community-built resource for tracking and sharing extreme clearance
            finds at Home Depot. The mission is simple: help people spot patterns, verify penny
            items, and share trustworthy information so the community can find legitimate deals
            faster. We focus on clear, searchable data and practical education so that shoppers and
            the community can make better decisions in store.
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

          <h2>Community Emphasis</h2>
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

          <h2>Transparency & Operations</h2>
          <p>
            PennyCentral is an independent educational resource dedicated to consumer advocacy and
            retail price transparency. Our mission is to provide accurate, community-verified data
            regarding extreme clearance patterns at major retailers.
          </p>

          <h2>Business Identity & Ownership</h2>
          <p>
            PennyCentral is a founder-led project based in the United States. We operate with a
            &quot;Community-First&quot; philosophy, ensuring that all data shared on our Community
            Penny List is vetted for accuracy by actual shoppers. We remain independent and are not
            affiliated with Home Depot or any advertising network, though we may use partner
            services to support site operations and provide free content to our community.
          </p>

          <h2>Contact & Transparency</h2>
          <p>
            We value transparency and are available for inquiries regarding our data, privacy
            practices, or community guidelines. Please reach out using any of the methods below:
          </p>
          <ul>
            <li>
              <strong>General Inquiries:</strong>{" "}
              <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>
            </li>
            <li>
              <strong>Support & Transparency:</strong>{" "}
              <Link href="/support">Support PennyCentral</Link>
            </li>
            <li>
              <strong>Contact Form:</strong> <Link href="/contact">Contact Us Page</Link>
            </li>
          </ul>

          <h2>Disclosure</h2>
          <p>PennyCentral is not affiliated with Home Depot.</p>

          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4">
            <Link
              href="/support"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold rounded-lg hover:bg-[var(--cta-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all duration-150"
            >
              Support PennyCentral
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-[48px] px-6 py-3 text-[var(--text-secondary)] font-medium rounded-lg hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-all duration-150"
            >
              Get In Touch →
            </Link>
          </div>
        </Prose>
      </Section>
    </PageShell>
  )
}
