import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"

export const metadata: Metadata = {
  title: "Contact Penny Central",
  description: "Contact Penny Central with questions, corrections, or partnership inquiries.",
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
          <p>
            The fastest way to reach Penny Central is email. We read every message and prioritize
            corrections, broken links, and anything that improves the accuracy of the Penny List.
          </p>
          <p>
            Email us at <a href="mailto:contact@pennycentral.com">contact@pennycentral.com</a> and
            include any SKU numbers, store details, and dates that help us verify what you saw. If
            you have a collaboration or media request, include your timeline and the best way to
            follow up.
          </p>
        </Prose>
      </Section>
    </PageShell>
  )
}
