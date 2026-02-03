import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Penny Hunting FAQ - Your Questions Answered | Penny Central",
  description:
    "The most common questions about Home Depot penny items, clearance cycles, and hunting strategies explained clearly.",
}

const faqs = [
  {
    question: "What exactly is a 'penny item'?",
    answer:
      "A penny item is a product that has completed its clearance lifecycle and been 'pennied out' by the store's computer system. While these items are usually intended to be removed from the floor, they ring up at $0.01 if you find them before they are pulled.",
  },
  {
    question: "Why does Home Depot penny items out?",
    answer:
      "The $0.01 price is an internal signal to employees that the product has reached a 100% discount and should be removed from inventory (ZMA/Destroyed). It is not meant to be a promotional sale for customers.",
  },
  {
    question: "What happens if a cashier refuses to sell me a penny item?",
    answer:
      "Technically, Home Depot is not required to sell items that have been marked for removal. If they refuse, the best practice is to be polite and walk away. Don't argue with staff or demand to speak to a manager, as this draws negative attention to the hobby.",
  },
  {
    question: "How do I know if an item is a penny without taking it to the register?",
    answer:
      "Download the Home Depot app and set it to your specific store location. While most penny items show 'Out of Stock' online, you can use the in-app scanner to check prices. However, many penny items will show full price or 'See Associate' in the app to prevent people from finding them.",
  },
  {
    question: "When is the best time to go penny hunting?",
    answer:
      "Most automated markdowns happen on Sundays or Mondays. Many hunters prefer to go early in the morning when the store first opens, before employees have a chance to clear the clearance sections.",
  },
  {
    question: "Is penny hunting legal?",
    answer:
      "Yes, it is perfectly legal to buy items at the price they ring up for in the store's system. As long as you are not hiding items, switching tags, or being disruptive, it is simply extreme clearance shopping.",
  },
]

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  }

  return (
    <PageShell width="default">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Common questions about the penny hunting cycle, store policies, and strategies."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-[var(--border-default)] rounded-lg p-4 [&_summary::-webkit-details-marker]:hidden bg-[var(--bg-card)]"
              >
                <summary className="flex items-center justify-between cursor-pointer font-bold text-lg text-[var(--text-primary)]">
                  <span>{faq.question}</span>
                  <span className="text-[var(--cta-primary)] transition-transform group-open:rotate-180">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-default)] pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Prose>

        <div className="mt-12 p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-center">
          <h3 className="text-xl font-bold mb-3">Still have questions?</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Check out our detailed guide chapters for a deep dive into store operations and hunting
            tactics.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/guide"
              className="btn-primary px-6 py-2 rounded-lg bg-[var(--cta-primary)] text-white font-semibold"
            >
              Read the Full Guide
            </Link>
            <Link
              href="/contact"
              className="btn-secondary px-6 py-2 rounded-lg border border-[var(--border-default)] font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  )
}
