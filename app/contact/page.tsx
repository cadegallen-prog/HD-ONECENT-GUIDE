import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Contact PennyCentral",
  description: "Reach PennyCentral for corrections, support, partnerships, and privacy requests.",
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
    title: "Contact PennyCentral",
    description: "Reach PennyCentral for corrections, support, partnerships, and privacy requests.",
  },
}

export default function ContactPage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="Contact PennyCentral"
        subtitle="Questions, corrections, partnership requests, or privacy concerns — we’re reachable."
      />

      <Section title="Fastest Ways to Reach Us">
        <Prose>
          <ul>
            <li>
              <strong>Corrections:</strong>{" "}
              <a href="mailto:contact@pennycentral.com?subject=Correction">
                contact@pennycentral.com
              </a>
            </li>
            <li>
              <strong>General support:</strong>{" "}
              <a href="mailto:contact@pennycentral.com?subject=General%20Support">
                contact@pennycentral.com
              </a>
            </li>
            <li>
              <strong>Partnership/media:</strong>{" "}
              <a href="mailto:contact@pennycentral.com?subject=Partnership">
                contact@pennycentral.com
              </a>
            </li>
          </ul>
        </Prose>
      </Section>

      <Section title="Contact Form (Recommended Format)">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-6">
          <form
            className="grid gap-4"
            action="mailto:contact@pennycentral.com"
            method="post"
            encType="text/plain"
          >
            <label className="grid gap-1 text-sm text-[var(--text-secondary)]">
              Name (optional)
              <input
                type="text"
                name="name"
                className="min-h-[44px] rounded-md border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)]"
              />
            </label>

            <label className="grid gap-1 text-sm text-[var(--text-secondary)]">
              Email
              <input
                type="email"
                name="email"
                required
                className="min-h-[44px] rounded-md border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)]"
              />
            </label>

            <label className="grid gap-1 text-sm text-[var(--text-secondary)]">
              Topic
              <select
                name="topic"
                required
                className="min-h-[44px] rounded-md border border-[var(--border-default)] bg-[var(--bg-page)] px-3 text-[var(--text-primary)]"
              >
                <option value="Data correction">Data correction</option>
                <option value="Technical issue">Technical issue</option>
                <option value="Partnership/media">Partnership/media</option>
                <option value="General question">General question</option>
                <option value="Privacy request">Privacy request</option>
              </select>
            </label>

            <label className="grid gap-1 text-sm text-[var(--text-secondary)]">
              Message
              <textarea
                name="message"
                required
                rows={6}
                className="rounded-md border border-[var(--border-default)] bg-[var(--bg-page)] p-3 text-[var(--text-primary)]"
              />
            </label>

            <button
              type="submit"
              className="min-h-[44px] w-fit rounded-md bg-[var(--cta-primary)] px-4 py-2 text-sm font-semibold text-[var(--cta-text)]"
            >
              Send Message
            </button>
          </form>
        </div>
      </Section>

      <Section title="Data Deletion & Account Closure">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-subtle)] p-6">
          <p className="text-sm text-[var(--text-secondary)]">
            You have the right to request deletion of your personal data. To delete your account and
            remove all associated data from our systems (including data stored via{" "}
            <strong>Supabase</strong> and email records managed through <strong>Resend</strong>),
            please email{" "}
            <a
              href="mailto:contact@pennycentral.com?subject=Data%20Deletion%20Request"
              className="text-[var(--cta-primary)] underline"
            >
              contact@pennycentral.com
            </a>{" "}
            with the subject line &ldquo;Data Deletion Request.&rdquo; We will process your request
            and confirm deletion within 30 days.
          </p>
        </div>
      </Section>

      <Section title="Response Windows">
        <Prose>
          <ul>
            <li>Correction-related messages: usually within 24–48 hours</li>
            <li>General inquiries and partnerships: usually within 3–5 business days</li>
          </ul>
          <p>
            For urgent data corrections, include SKU, location, observed price, and date/time to
            help us validate quickly.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
