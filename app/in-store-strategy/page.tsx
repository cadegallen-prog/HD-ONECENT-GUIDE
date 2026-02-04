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
    title: "Where to Look: Home Bay Focus",
    description:
      "As of 2026, clearance endcaps are being phased out. Focus on Home Bays—the primary shelf location for each item. Look for items that don't fit the planogram, are sitting in the wrong section, or have no shelf tag.",
  },
  {
    title: "Timing Your Visits",
    description:
      "MET teams work primarily Wednesday and Thursday (overnight/early morning). Visit Tuesday evenings for the highest penny availability, or Friday/Saturday after MET has cleared but before weekend foot traffic.",
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

          <h2 className="text-2xl font-bold mb-8">Key Strategies</h2>

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

          <h2 className="text-2xl font-bold mb-6">Register Awareness: The Zero-Comm Factor</h2>
          <p className="mb-6">
            When a penny item is scanned, the system generates a "Zero-Communication" report—an
            internal audit that flags the transaction for management review. Many cashiers are
            coached to refuse penny sales or call for a manager override. Understanding this
            pressure helps you approach checkout strategically.
          </p>

          <div className="border-l-4 border-[var(--cta-primary)] pl-6 py-2 mb-10">
            <h3 className="text-xl font-bold mb-3">Best Practices at the Register</h3>
            <ul className="space-y-2 text-[var(--text-secondary)] list-disc list-inside">
              <li>Mix penny items with regular purchases to avoid raising flags</li>
              <li>Use self-checkout when available (reduced scrutiny)</li>
              <li>If a cashier questions the price, remain calm and polite—never argue</li>
              <li>Acknowledge $.02 vs $.01 distinction: $.02 may ring up but trigger MET alert</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold mb-6">The Checkout Approach</h2>
          <p className="mb-6">
            Successfully purchasing penny items requires discretion and awareness of the internal
            dynamics. Bring a mix of items (even full-price ones) to the register. It's less
            conspicuous than a cart full of the same penny item. If an item rings up for a penny,
            remain calm and process the transaction normally.
          </p>

          <div className="p-6 bg-[var(--bg-elevated)] border-l-4 border-l-[var(--status-warning)] rounded-r-lg mb-10">
            <p className="italic text-[var(--text-secondary)]">
              "Your best tool isn't a scanning app—it's your personality. Employees who like you are
              far more likely to let a penny item slide through than those who find you disruptive."
            </p>
          </div>

          <h2 className="text-2xl font-bold mb-6">Navigating Employee Interactions</h2>
          <p className="mb-6">
            If an employee realizes an item is a penny, they are often required by corporate policy
            to pull it from your cart and place it in the ZMA (Z-Mark Out of Asset) bin for
            destruction or return to vendor. MET team members, in particular, are evaluated on how
            quickly they can clear salvage items.
          </p>
        </Prose>

        <div className="mt-16 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Advance Prep</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
            Winning in the store starts at home. Learn how to use the "Digital Pre-Hunt" method to
            verify inventory before you even burn the gas.
          </p>
          <Link
            href="/digital-pre-hunt"
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
