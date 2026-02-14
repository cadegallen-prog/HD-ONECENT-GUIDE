import type { Metadata } from "next"
import { LegalBackLink } from "@/components/legal-back-link"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Do Not Sell or Share | PennyCentral",
  description:
    "How to submit CCPA/CPRA privacy requests, including Do Not Sell or Share, access, deletion, and correction.",
  alternates: {
    canonical: "/do-not-sell-or-share",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "article",
    url: "https://www.pennycentral.com/do-not-sell-or-share",
    title: "Do Not Sell or Share | PennyCentral",
    description: "First-party CCPA/CPRA privacy choices and request instructions for PennyCentral.",
  },
}

export default function DoNotSellOrSharePage() {
  return (
    <PageShell width="default">
      <LegalBackLink />

      <PageHeader
        title="Do Not Sell or Share My Personal Information"
        subtitle="U.S. privacy rights request instructions (including CCPA/CPRA options)."
      />

      <Section title="Request Types You Can Submit">
        <Prose>
          <ul>
            <li>Do Not Sell or Share</li>
            <li>Access request</li>
            <li>Deletion request</li>
            <li>Correction request</li>
          </ul>
        </Prose>
      </Section>

      <Section title="How to Submit Your Request">
        <Prose>
          <p>
            Email your request to{" "}
            <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a> with subject line{" "}
            <strong>Privacy Request</strong>.
          </p>
          <p>To help us process your request quickly, include:</p>
          <ul>
            <li>Your request type (for example, Do Not Sell or Share)</li>
            <li>
              The email address or browser/device context you want us to review (if available)
            </li>
            <li>Any additional context that helps identify your request</li>
          </ul>
          <p>
            We do not require account creation for privacy requests. We may ask for limited
            follow-up information when necessary to process your request securely.
          </p>
        </Prose>
      </Section>

      <Section title="Supplemental Industry Opt-Out Tools">
        <Prose>
          <p>
            You may also review broader advertising controls at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info/choices
            </a>{" "}
            and{" "}
            <a href="https://www.youradchoices.com/" target="_blank" rel="noopener noreferrer">
              youradchoices.com
            </a>
            .
          </p>
          <p>
            These are supplemental industry tools. Your primary PennyCentral request path is the
            email channel above.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
