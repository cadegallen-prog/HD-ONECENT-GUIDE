import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Penny Hunting FAQ & Quick Reference | Penny Central",
  description:
    "Clear answers to the most common penny hunting questions, plus a quick reference cheat sheet.",
  alternates: {
    canonical: "/faq",
  },
}

const faqs = [
  {
    question: "What exactly is a penny item?",
    answer:
      "A penny item is a product that scans for $0.01 because it has reached the final stage of clearance. It is an internal removal signal, not a public promotion.",
  },
  {
    question: "How do I find penny items at Home Depot?",
    answer:
      "Start with clearance areas and the home bay where the item normally lives, then check seasonal sections and overhead for yellow tags. Use the Penny List for recent SKUs, and always verify by scanning the UPC in-store.",
  },
  {
    question: "Why does Home Depot penny items out?",
    answer:
      "The penny price marks an item as clearance complete so it can be removed from inventory. Stores may dispose of it, return it to a vendor, or handle it internally.",
  },
  {
    question: "Are penny items guaranteed to be sold to customers?",
    answer:
      "No. Store managers have discretion. Some stores honor the price, others refuse because the item is marked for removal.",
  },
  {
    question: "Can I see penny prices in the Home Depot app?",
    answer:
      "Usually not. The app is useful for filtering, but it is not real-time and often does not show penny prices directly.",
  },
  {
    question: "What do clearance price endings mean?",
    answer:
      "Endings like .00, .06/.04, and .03/.02 often show up in clearance cycles. They are helpful signals, but timing varies by store and category.",
  },
  {
    question: "What is the best time to go penny hunting?",
    answer:
      "There is no guaranteed day. Many hunters go early in the morning or after seasonal transitions, but timing varies by store.",
  },
  {
    question: "Why do cashiers sometimes refuse penny sales?",
    answer:
      "Because the item is flagged for removal, some stores do not allow penny sales. This is a policy choice, not a personal decision by the cashier.",
  },
  {
    question: "What if the item is locked, recalled, or buy-back?",
    answer:
      "If the register blocks the sale or an associate says the item is locked, it is usually unsellable. Do not argue; move on.",
  },
  {
    question: "Is penny hunting legal?",
    answer:
      "Yes, as long as you are not switching tags, hiding items, or causing disruption. Always follow store policy and staff direction.",
  },
  {
    question: "How can I verify a penny price without losing the item?",
    answer:
      "Take a photo of the UPC and ask for a stock check, or scan the UPC at self-checkout if it is quiet. Avoid asking for a price override.",
  },
  {
    question: "Do Home Depot employees buy penny items?",
    answer:
      "Policy generally prohibits employees from buying penny items, but enforcement varies by store. Assume nothing and focus on your own process.",
  },
  {
    question: "Do penny prices show on the shelf tag?",
    answer:
      "Not reliably. Tags can be stale or missing. The scan price is the truth, which is why verification matters.",
  },
  {
    question: "Can I use a price check kiosk?",
    answer:
      "If your store has one, it can be a helpful hint, but it is not always current. Treat it as a filter, not a guarantee.",
  },
  {
    question: "Can I buy multiple penny items at once?",
    answer:
      "Some stores allow multiples of the same SKU, but different penny SKUs in one checkout can draw attention. Keep it simple and respect store discretion.",
  },
  {
    question: "What if the app says out of stock but I see the item?",
    answer:
      "Inventory data lags. If you see it on the shelf, scan the UPC and decide based on the real price.",
  },
  {
    question: "What if I am asked to return a penny item after purchase?",
    answer:
      "Stay calm and show your receipt. Ask politely for clarification and follow the manager's direction. Avoid arguments.",
  },
  {
    question: "How do I report a find to help others?",
    answer:
      "Use the Report a Find page with the SKU, store, and date so the Penny List stays accurate for everyone.",
  },
  {
    question: "Should I hide items for later?",
    answer:
      "No. Hiding items hurts other shoppers and often leads to crackdowns. If you want it, verify and check out responsibly.",
  },
  {
    question: "Do all stores have penny items?",
    answer:
      "Most stores see pennies eventually, but frequency and timing vary. Some stores pull them fast, others miss a few.",
  },
]

const quickReference = [
  "Use UPC scans, not yellow tags.",
  "Price endings help, but do not guarantee timing.",
  "Tag dates are better than guesswork.",
  "Be polite if a sale is refused. It is not worth a confrontation.",
  "Keep receipts for any penny purchase.",
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
    <PageShell width="default" gap="md">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <PageHeader
        title="Frequently Asked Questions"
        subtitle="Clear answers and a quick reference for penny hunting."
      />

      <div className="flex justify-center">
        <EditorialBlock />
      </div>

      <Section>
        <Prose>
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

          <h2 className="text-2xl font-bold mt-12 mb-6">Quick reference</h2>
          <ul className="mb-10">
            {quickReference.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Prose>

        <div className="mt-12 p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl text-center">
          <h3 className="text-xl font-bold mb-3">Want the full playbook?</h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Go back to the guide hub to follow the full sequence.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/guide"
              className="btn-primary px-6 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold"
            >
              Guide Hub
            </Link>
            <Link
              href="/contact"
              className="btn-secondary px-6 py-2 rounded-lg border border-[var(--border-default)] font-semibold"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <ChapterNavigation
          prev={{
            slug: "facts-vs-myths",
            title: "Facts vs. Myths",
          }}
          next={undefined}
        />
      </Section>
    </PageShell>
  )
}
