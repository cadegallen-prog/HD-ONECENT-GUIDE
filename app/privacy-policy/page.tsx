import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Privacy Policy | PennyCentral",
  description:
    "Privacy policy and disclosures for PennyCentral, including analytics, advertising, and affiliate information.",
  alternates: {
    canonical: "/privacy-policy",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/privacy-policy",
    title: "Privacy Policy | PennyCentral",
    description: "Privacy policy and disclosures for PennyCentral.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Privacy Policy"
        subtitle={
          <>
            <strong>Effective date:</strong> January 28, 2026. This page explains how PennyCentral
            collects, uses, and shares information when you use the site.
          </>
        }
      />

      <Section title="Introduction">
        <Prose>
          <p>
            PennyCentral is an informational site for the “Home Depot One Cent Items” community. We
            aim to collect only what we need to operate the site, improve it, and keep it safe.
          </p>
          <p>
            This policy describes our practices for this website and its related pages and services
            (including the Penny List and “Report a Find” flow).
          </p>
        </Prose>
      </Section>

      <Section title="Information We Collect">
        <Prose>
          <p>We collect information in three main ways:</p>
          <ul>
            <li>
              <strong>Automatically collected:</strong> basic usage and device information such as
              pages visited, approximate location (derived from IP address), browser type, device
              type, and timestamps. This may be collected via cookies or similar technologies.
            </li>
            <li>
              <strong>User-submitted:</strong> information you choose to submit through the site,
              such as reporting a find (e.g., item identifiers, store/location details, and other
              details you provide) or joining an email list (email address).
            </li>
            <li>
              <strong>Contact information:</strong> if you email us or use our contact page, we
              receive the information you include (such as your email address and message).
            </li>
          </ul>
        </Prose>
      </Section>

      <Section title="How We Use Information">
        <Prose>
          <p>We use information to:</p>
          <ul>
            <li>Operate and maintain the site and its features</li>
            <li>Respond to messages and support requests</li>
            <li>Understand usage and improve content and usability</li>
            <li>Detect, prevent, and address spam, abuse, and security issues</li>
          </ul>
        </Prose>
      </Section>

      <Section title="Analytics (Google Analytics 4)">
        <Prose>
          <p>
            We may use Google Analytics 4 (GA4) to understand how visitors use the site (for
            example, which pages are visited and how long pages take to load). GA4 may use cookies
            and similar technologies.
          </p>
          <p>
            You can learn more about Google&apos;s practices at{" "}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses information from sites or apps that use its services
            </a>
            .
          </p>
        </Prose>
      </Section>

      <Section title="Advertising (Advertising Partners + ads.txt)">
        <Prose>
          <p>
            PennyCentral may display ads served by advertising partners. These partners may use
            cookies or similar technologies to deliver and measure ads, including interest-based
            advertising.
          </p>
          <p>
            We maintain an{" "}
            <a href="/ads.txt" target="_blank" rel="noopener noreferrer">
              ads.txt
            </a>{" "}
            file for transparency about authorized sellers.
          </p>
          <p>
            If you prefer, you can often limit interest-based advertising through browser settings
            and industry opt-out tools such as{" "}
            <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer">
              www.aboutads.info
            </a>{" "}
            and Google Ad Settings{" "}
            <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
              here
            </a>
            .
          </p>
        </Prose>
      </Section>

      <Section title="Affiliate Programs (Rakuten)">
        <Prose>
          <p>
            PennyCentral may include affiliate/referral links, including a link to Rakuten. If you
            sign up or make a qualifying purchase through our Rakuten referral link, we may earn a
            commission. This helps support site operations at no additional cost to you.
          </p>
          <p>
            Our Rakuten referral link is available at{" "}
            <a href="/go/rakuten" target="_blank" rel="nofollow sponsored noopener noreferrer">
              /go/rakuten
            </a>
            .
          </p>
          <p>
            As an Amazon Associate, PennyCentral earns from qualifying purchases upon our
            participation in the program.
          </p>
        </Prose>
      </Section>

      <Section title="Data Sharing">
        <Prose>
          <p>We may share information in limited situations:</p>
          <ul>
            <li>
              <strong>Service providers:</strong> with vendors that help us run the site (for
              example, hosting, analytics, email delivery, and advertising partners).
            </li>
            <li>
              <strong>Legal and safety:</strong> when required by law, or to protect the rights,
              safety, and security of PennyCentral and our users.
            </li>
            <li>
              <strong>Aggregated/anonymous reporting:</strong> we may publish or analyze aggregated
              information that does not reasonably identify an individual.
            </li>
          </ul>
          <p>
            We do not sell your personal information in the traditional sense (i.e., for money in
            exchange).
          </p>
        </Prose>
      </Section>

      <Section title="Cookies and Data Collection">
        <Prose>
          <p>
            Cookies are small files stored by your browser. We and our partners may use cookies and
            similar technologies to provide core site functionality, understand site performance,
            and deliver/measure ads.
          </p>
          <p>
            PennyCentral is fully compliant with 2026 privacy standards, including the Google
            Privacy Sandbox and Topics API. We prioritize user privacy by honoring Global Privacy
            Control (GPC) signals. If your browser broadcasts a GPC signal, we automatically treat
            this as an &quot;Opt-Out of Sale/Sharing&quot; request for all personal data.
          </p>
          <p>
            You can usually control cookies through your browser settings. Note that disabling some
            cookies may affect parts of the site.
          </p>
        </Prose>
      </Section>

      <Section title="Your Privacy Rights">
        <Prose>
          <p>
            Depending on where you live, you may have rights to request access, correction, or
            deletion of personal information. To make a request, contact{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>.
          </p>
          <p>We will respond to legitimate requests within a reasonable time.</p>
        </Prose>
      </Section>

      <Section id="ccpa" title="California Residents (CCPA)">
        <Prose>
          <p>
            If you are a California resident, the California Consumer Privacy Act (CCPA/CPRA) may
            provide additional rights, including the right to know, access, delete, and correct
            certain personal information, and the right to opt out of certain “sales” or “sharing”
            as defined by law.
          </p>
          <p>
            PennyCentral does not sell personal information for money. If you have questions or
            would like to make a request, email{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a> with the subject
            line “CCPA Request”.
          </p>
        </Prose>
      </Section>

      <Section title="Changes to This Policy">
        <Prose>
          <p>
            We may update this privacy policy from time to time. We will update the effective date
            at the top of this page when changes are made.
          </p>
        </Prose>
      </Section>

      <Section title="Contact">
        <Prose>
          <ul>
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>
            </li>
            <li>
              <strong>Contact Form:</strong> <a href="/contact">Visit our contact page</a>
            </li>
          </ul>
          <p className="text-sm text-[var(--text-muted)]">Last updated: January 28, 2026</p>
        </Prose>
      </Section>
    </PageShell>
  )
}
