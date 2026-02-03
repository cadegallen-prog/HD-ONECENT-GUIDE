import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"

export const metadata: Metadata = {
  title: "In-Store Penny Hunting Strategy - Shop Like a Pro | Penny Central",
  description:
    "Tactical advice for finding penny items in-store. Learn how to handle store employees, find hidden inventory, and checkout successfully.",
}

const strategies = [
  {
    title: "The Golden Rule: Don't Be a Nuisance",
    description:
      "Penny shopping is a privilege, not a right. Keep your cart manageable, don't leave aisles a mess, and always be polite to staff. If you are asked to leave or told an item is not for sale, comply immediately.",
  },
  {
    title: "Scanning Protocol",
    description:
      "Use the Home Depot mobile app for price checks. Ensure your app is set to your current store location. If an item shows a price but you suspect it's a penny, try scanning it at a self-checkout station (if available and not busy).",
  },
  {
    title: "Hidden Spots",
    description:
      "Penny items are often 'hiding' in plain sight. Check the very back of shelves, bottom racks behind larger items, and 'end-cap' displays where items might have been moved for quick clearance.",
  },
  {
    title: "The Checkout Approach",
    description:
      "Bring a mix of items (even full-price ones) to the register. It's less conspicuous than 50 of the exact same penny item. If an item rings up for a penny, remain calm and process the transaction normally.",
  },
]

export default function InStoreStrategyPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="In-Store Strategy"
        subtitle="Tactical, boots-on-the-ground advice for successful (and ethical) hunting."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <EthicalDisclosure />

        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            Successfully finding a penny item is only half the battle. Getting it through the front
            doors requires a blend of preparation, awareness, and extreme courtesy.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 mb-16">
            {strategies.map((strat, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-default)] hover:border-[var(--cta-primary)] transition-colors group"
              >
                <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--cta-primary)] transition-colors">
                  {strat.title}
                </h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{strat.description}</p>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-6">Navigating Employee Interactions</h2>
          <p className="mb-6">
            If an employee realizes an item is a penny, they are often required by corporate policy
            to pull it from your cart and place it in the "ZMA" (Z-Mark Out of Asset) bin for
            destruction or return to vendor.
          </p>
          <div className="p-6 bg-[var(--bg-elevated)] border-l-4 border-yellow-400 rounded-r-lg mb-10 italic">
            "Your best tool isn't a scanning app—it's your personality. Employees who like you are
            far more likely to let a penny item slide through than those who find you disruptive."
          </div>
        </Prose>

        <div className="mt-16 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Advance Prep</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
            Winning in the store starts at home. Learn how to use the "Digital Pre-Hunt" method to
            verify inventory before you even burn the gas.
          </p>
          <Link
            href="/guide/digital-pre-hunt"
            className="inline-flex items-center gap-2 font-bold text-[var(--cta-primary)] hover:underline"
          >
            Read: The Digital Pre-Hunt
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
