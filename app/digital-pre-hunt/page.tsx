import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Digital Pre-Hunt Strategy - Find Penny Items From Home | Penny Central",
  description:
    "Master the art of checking inventory from your couch. Learn how to use online tools to find hidden clearance and penny items.",
}

const steps = [
  {
    step: "01",
    title: "Change Your Store Location",
    text: "Set the Home Depot app to a specific store you plan to visit. Inventory levels and clearance status are store-specific.",
  },
  {
    step: "02",
    title: "Filter for 'In-Stock'",
    text: "Search for common penny-prone categories (lighting, home decor, seasonal) and filter specifically for items physically inside that store branch.",
  },
  {
    step: "03",
    title: "Look for 'Not Sold Online'",
    text: "Items that show as available locally but 'not sold online' are often items that have been removed from the national catalog—a major indicator of pending markdowns.",
  },
  {
    step: "04",
    title: "The 'See Price in Cart' Trick",
    text: "Rarely, clearance prices won't show on the search page. Adding the item to your cart and looking at the checkout total can sometimes reveal a deeper discount.",
  },
]

export default function DigitalPreHuntPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Digital Pre-Hunt"
        subtitle="Save time and gas by narrowing down your targets before leaving the house."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            The era of 'blindly' wandering aisles is over. The most efficient penny hunters use the
            Home Depot digital inventory as a blueprint for their day.
          </p>

          <h2 className="text-2xl font-bold mb-8">The Process</h2>

          <div className="grid md:grid-cols-2 gap-x-12 gap-y-16 mb-20">
            {steps.map((item, idx) => (
              <div key={idx} className="relative pl-16">
                <span className="absolute left-0 top-0 text-5xl font-black text-[var(--cta-primary)] opacity-20">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed relative z-10">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div className="p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm mb-12">
            <h2 className="text-2xl font-bold mb-4">A Note on Accuracy</h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Online inventory counts are <strong>not real-time</strong> and are often inaccurate
              for low-stock items. An item showing '1 in stock' has a high probability of being
              missing, stolen, or bereits in someone's cart. Always use our
              <Link href="/in-store-strategy" className="mx-1 text-[var(--cta-primary)] underline">
                In-Store Strategy
              </Link>
              to verify.
            </p>
          </div>
        </Prose>

        <div className="mt-16 text-center">
          <p className="text-[var(--text-secondary)] mb-6">
            New to the concept? Start with the basics.
          </p>
          <Link
            href="/what-are-pennies"
            className="inline-flex items-center gap-2 font-bold text-[var(--cta-primary)] hover:underline"
          >
            What are Penny Items?
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </Section>
    </PageShell>
  )
}
