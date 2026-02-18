import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Privacy Policy | PennyCentral",
  description:
    "How PennyCentral collects, uses, stores, and shares data, including cookie controls, advertising disclosures, and U.S. privacy rights.",
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
    description: "Privacy practices, disclosures, and rights controls for PennyCentral.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="Privacy Policy"
        subtitle={
          <>
            <strong>Last Updated:</strong> February 16, 2026
          </>
        }
      />

      <Section title="1) Scope">
        <Prose>
          <p>
            This Privacy Policy applies to PennyCentral and related pages, including the Penny List,
            Report a Find workflow, and supporting informational routes.
          </p>
        </Prose>
      </Section>

      <Section title="2) Information We Collect">
        <Prose>
          <h3>Automatically Collected Data</h3>
          <ul>
            <li>IP address (used for approximate location and abuse prevention)</li>
            <li>Browser/device/operating-system metadata</li>
            <li>Pages visited, traffic source, and interaction timestamps</li>
            <li>Google Analytics tracking via GA4 (Measurement ID: G-DJ4RJRX05E)</li>
          </ul>

          <h3>Information You Provide</h3>
          <ul>
            <li>Report submissions (for example: SKU details and location context)</li>
            <li>Contact submissions (name, email, message, and optional context fields)</li>
            <li>
              Email signup data when you subscribe to updates (email address and signup metadata)
            </li>
          </ul>

          <h3>Local Browser Storage</h3>
          <p>
            We may store selected preferences locally in your browser (for example, list or filter
            preferences) to improve your experience.
          </p>
        </Prose>
      </Section>

      <Section title="3) How We Use Information">
        <Prose>
          <ul>
            <li>Operate and maintain core website functionality</li>
            <li>Improve reliability, safety, and user experience</li>
            <li>Respond to corrections, support messages, and partnership outreach</li>
            <li>
              Send weekly email digests with new penny list items when you subscribe (unsubscribe
              anytime using the email footer link)
            </li>
            <li>Detect abuse, spam, and technical failures</li>
            <li>Support operations and advertising delivery</li>
          </ul>
        </Prose>
      </Section>

      <Section title="4) Cookies and Similar Technologies">
        <Prose>
          <h3>Essential Technologies</h3>
          <p>
            Essential cookies or similar technologies may be used for security, session continuity,
            and site functionality.
          </p>

          <h3>Non-Essential Technologies</h3>
          <p>
            Analytics and advertising technologies may be used to measure performance and, when
            enabled, support interest-based advertising.
          </p>
          <p>
            Where required, we will provide a consent mechanism and store your preferences before
            non-essential technologies are activated.
          </p>
          <p>
            If advertising features are active, third-party vendors (including Google and partner ad
            networks) may use cookies to serve ads based on your prior visits to this website or
            other websites.
          </p>
          <p>
            You can also manage many browser-based advertising preferences through industry tools,
            including{" "}
            <a
              href="https://optout.aboutads.info/?c=2&lang=EN"
              target="_blank"
              rel="noopener noreferrer"
            >
              WebChoices
            </a>{" "}
            and{" "}
            <a href="https://youradchoices.com/" target="_blank" rel="noopener noreferrer">
              YourAdChoices
            </a>
            , and{" "}
            <a
              href="https://optout.networkadvertising.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Network Advertising Initiative (NAI) Opt-Out
            </a>
            .
          </p>
          <p>
            You can manage Google ad personalization controls at{" "}
            <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>
            .
          </p>
        </Prose>
      </Section>

      <Section title="5) Advertising and Third-Party Disclosures">
        <Prose>
          <p>
            PennyCentral may work with third-party analytics and advertising providers. If
            advertising is enabled, those providers may set or read cookies and similar identifiers
            for ad delivery, measurement, frequency capping, and fraud prevention.
          </p>
          <p>
            If ads are active through Google or Google-certified ad networks, users may opt out of
            personalized advertising via Google Ads Settings and can also opt out from many
            participating third-party vendors through{" "}
            <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info/choices
            </a>
            .
          </p>
          <p>
            For transparency, we may provide or update links to key third-party privacy pages when
            specific providers are active on the site.
          </p>

          <h3>Third-Party Service Providers</h3>
          <ul>
            <li>
              <strong>Google AdSense &amp; Ad Manager:</strong> We use Google AdSense (Publisher ID:
              ca-pub-5302589080375312) and Google Ad Manager to serve and manage advertising on this
              site. Google may use cookies and similar technologies to serve ads based on your prior
              visits. Learn how Google uses data:{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses information from sites that use its services
              </a>
              . Manage your ad personalization at{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google Ads Settings
              </a>
              .
            </li>
            <li>
              <strong>Google Analytics (GA4):</strong> We use Google Analytics to understand how
              visitors use our site. Google may collect IP addresses, browser details, and usage
              patterns. You can opt out with browser controls or Google&apos;s Analytics opt-out
              tools.
            </li>
            <li>
              <strong>Grow by Mediavine (Engagement Platform):</strong> We use Grow by Mediavine to
              provide social sharing features and first-party audience analytics. Grow may collect
              browsing behavior, device information, and interaction data. See{" "}
              <a
                href="https://www.mediavine.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Mediavine&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Monumetric:</strong> Monumetric may place cookies and process data for ad
              serving and measurement. See{" "}
              <a
                href="https://www.monumetric.com/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Monumetric&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Ezoic:</strong> PennyCentral has authorized Ezoic as an advertising partner.
              When active, Ezoic may place cookies and process data for ad testing, optimization,
              and serving. See{" "}
              <a
                href="https://www.ezoic.com/privacy-policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ezoic&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Resend:</strong> We use Resend for email delivery (weekly digest and
              transactional emails). Resend processes email addresses and message content. See{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resend&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Supabase (Database &amp; Authentication):</strong> We use Supabase to manage
              user accounts, authentication (via one-time passwords), and user data (lists,
              subscriptions, report submissions). Supabase processes email addresses and login
              metadata securely. See{" "}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                Supabase&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Vercel (Hosting &amp; Performance):</strong> Our site is hosted on Vercel. We
              use Vercel Analytics and Vercel Speed Insights to monitor page performance. These
              services may process IP addresses, page URLs, and browser metadata. See{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Vercel&apos;s privacy policy
              </a>
              .
            </li>
            <li>
              <strong>Sentry (Error Monitoring):</strong> We use Sentry to detect and diagnose
              technical errors. Sentry may process IP addresses, browser metadata, and error
              context. See{" "}
              <a href="https://sentry.io/privacy/" target="_blank" rel="noopener noreferrer">
                Sentry&apos;s privacy policy
              </a>
              .
            </li>
          </ul>

          <h3>Ezoic-Specific Disclosure</h3>
          <span id="ezoic-privacy-policy-embed" />
          <p>
            This site uses services provided by Ezoic Inc. to manage third-party interest-based
            advertising. Ezoic technologies may use first- and third-party cookies to understand
            visitor interactions. Data may include IP address, operating system and device
            information, language preferences, browser type, and hashed or encrypted email
            identifiers. Ezoic and its partners may combine this data with other independently
            collected information to provide and measure targeted advertising.
          </p>
        </Prose>
      </Section>

      <Section title="6) Sharing, Retention, and Security">
        <Prose>
          <p>We may share limited data with service providers for:</p>
          <ul>
            <li>Hosting and infrastructure</li>
            <li>Analytics and operations</li>
            <li>Fraud/abuse prevention</li>
            <li>Ad attribution (when applicable)</li>
          </ul>
          <p>
            We retain information only as long as necessary for operations, security, legal
            obligations, and legitimate business records.
          </p>
          <p>
            We use reasonable administrative and technical safeguards to protect personal data, but
            no internet transmission or storage method is guaranteed to be 100% secure.
          </p>

          <h3>Data Deletion Requests</h3>
          <ul>
            <li>
              <strong>Supabase (database):</strong> Email{" "}
              <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a> to request
              account-data deletion. We target completion within 30 days.
            </li>
            <li>
              <strong>Resend (email):</strong> Use the unsubscribe link in any email. Inactive
              subscriber records are deleted after one year of inactivity.
            </li>
            <li>
              <strong>Google Analytics:</strong> GA4 retention follows Google&apos;s settings (14
              months by default in our current setup). You can opt out through browser or Google
              controls.
            </li>
          </ul>
        </Prose>
      </Section>

      <Section id="ccpa" title="7) U.S. Privacy Rights (including CCPA/CPRA)">
        <Prose>
          <p>
            Depending on your state, you may have rights to request access, correction, deletion, or
            additional disclosures regarding personal information.
          </p>
          <p>
            You can submit a request at{" "}
            <a href="/do-not-sell-or-share" className="text-[var(--cta-primary)] underline">
              /do-not-sell-or-share
            </a>
            .
          </p>
          <p>
            Where required by law, recognized Global Privacy Control (GPC) browser signals are
            honored as an opt-out request in applicable sale/share contexts.
          </p>
        </Prose>
      </Section>

      <Section title="8) Regional Consent Controls (EEA/UK/Switzerland)">
        <Prose>
          <p>
            Where required, we obtain consent for non-essential cookies and local storage before
            activating personalized advertising and related measurement.
          </p>
          <p>
            You may withdraw or update consent choices through available consent controls and
            browser/device settings.
          </p>
        </Prose>
      </Section>

      <Section title="9) Contact and Policy Updates">
        <Prose>
          <p>
            For privacy questions or requests, email{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a>.
          </p>
          <p>
            We may update this Privacy Policy as practices or legal requirements evolve. Material
            updates will be reflected by revising the "Last Updated" date at the top of this page.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
