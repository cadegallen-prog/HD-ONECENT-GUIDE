import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Contact Penny Central",
  description: "Contact Penny Central with questions, corrections, or partnership inquiries.",
  alternates: {
    canonical: "/contact",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/contact",
    title: "Contact Penny Central",
    description: "Contact Penny Central with questions, corrections, or partnership inquiries.",
  },
}

export default function ContactPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Contact Penny Central"
        subtitle="Questions, corrections, or partnership ideas? Reach out anytime."
      />

      <Section>
        <Prose>
          <p className="lead">
            <strong>We prioritize accuracy above everything else.</strong>
          </p>
          <p>
            PennyCentral is maintained by Cade Allen and the penny hunting community. If you spot a
            wrong SKU, an expired penny item, or a price change, we want to know immediately. Our
            goal is to verify and fix data errors within 24 hours to keep the list safe for
            everyone.
          </p>
          <p>
            This site exists because accurate, timely penny data is hard to find. Most community
            groups move fast and old posts get buried. PennyCentral gives that information a
            permanent, searchable home — and your feedback is what keeps it reliable. Whether you
            found a pricing error, have a suggestion for the guide, or want to report a new penny
            find, the channels below will get your message to the right place.
          </p>
        </Prose>

        {/* Primary contact card */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Corrections Channel */}
          <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-[var(--text-primary)] mb-3">
              <span className="text-[var(--status-error)]">●</span> Report a Correction
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              Found a bad SKU on the Penny List? An item that is no longer penny? A store that
              stopped honoring sales? Let us know so we can flag or remove it. Include the SKU, your
              state, and what you observed — the more detail, the faster we can act.
            </p>
            <a
              href="mailto:contact@pennycentral.com?subject=Correction: SKU Verification"
              className="inline-flex items-center font-medium text-[var(--cta-primary)] hover:underline"
            >
              contact@pennycentral.com
            </a>
          </div>

          {/* General Support */}
          <div className="p-6 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-lg">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
              General Inquiries
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
              For feedback on the guide, partnership requests, advertising questions, or help using
              the site. We welcome constructive suggestions from hunters of all experience levels.
            </p>
            <a
              href="mailto:contact@pennycentral.com"
              className="inline-flex items-center font-medium text-[var(--text-primary)] hover:underline"
            >
              contact@pennycentral.com
            </a>
          </div>
        </div>

        <Prose className="mt-8">
          <h3>Response Time</h3>
          <p>
            PennyCentral is a founder-led project. Data corrections are our highest priority and are
            typically addressed within 24 hours. General inquiries, partnership proposals, and
            feature suggestions are reviewed weekly. If your message is time-sensitive — for
            example, a newly discovered penny item or a safety concern — please include
            &ldquo;Urgent&rdquo; in your subject line.
          </p>

          <h3>Community Reporting</h3>
          <p>
            The fastest way to contribute penny finds is through the{" "}
            <a href="/report-find" className="text-[var(--cta-primary)] underline">
              Report a Find
            </a>{" "}
            page. Submissions go directly into our verification pipeline and, once confirmed, appear
            on the live Penny List. Email is best for corrections, partnership discussions, or
            anything that needs a personal response.
          </p>

          <h3>Transparency</h3>
          <p>
            PennyCentral is committed to honest, community-first data. We do not accept payment to
            list or promote specific SKUs. Our monetization approach is disclosed on the{" "}
            <a href="/about" className="text-[var(--cta-primary)] underline">
              About
            </a>{" "}
            page. If you believe any content on this site is misleading, inaccurate, or harmful,
            please contact us immediately so we can investigate and correct it.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
