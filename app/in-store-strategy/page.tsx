import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import Link from "next/link"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Verify & In-Store Penny Strategy | Penny Central",
  description:
    "How to verify penny status, where to look in-store, and how to checkout without drama.",
  alternates: {
    canonical: "/in-store-strategy",
  },
}

const verifySteps = [
  {
    title: "Use the UPC, not the yellow tag",
    detail:
      "Scan the manufacturer barcode at self-checkout when possible. The tag can be stale or trigger a price override prompt.",
  },
  {
    title: "Keep it low-key",
    detail:
      "If you need help, ask for a stock check rather than a price check. It reduces the chance the item gets pulled.",
  },
  {
    title: "Pay quickly and keep the receipt",
    detail:
      "If it scans for a penny and the sale goes through, finish the transaction and keep your receipt in case of confusion.",
  },
]

const communityReportedTips = [
  "Many hunters avoid bringing the item to the desk. A clear UPC photo is usually enough.",
  "Asking for a stock check is often lower drama than asking for a price check, which some say can lead to a pull.",
  "Some associates use handhelds often called Zebra or FIRST. If they scan and see a penny, they may pull the item.",
]

const rightWay = [
  "Take a photo of the UPC and shelf tag so you can verify without carrying the item around.",
  "Ask for a stock check if you are unsure. It is less confrontational than asking for a price override.",
  "Use self-checkout when it is quiet and you can pay quickly.",
]

const wrongWay = [
  "Handing the item to an employee and asking for a price check. If it scans for a penny, it may be pulled.",
  "Making a scene when a cashier refuses a sale. It almost always backfires.",
  "Using employee-only ladders or restricted areas. That can get you removed from the store.",
]

const bringList = [
  "Your phone with the Home Depot app set to the correct store.",
  "A photo of the UPC or the SKU number.",
  "A payment method ready so checkout is quick.",
  "Patience. Not every trip will be a win.",
]

const hotspots = [
  "Home bay shelves where the item normally lives",
  "Seasonal sections right after a holiday or department reset",
  "Top and bottom shelves where leftovers sit undisturbed",
  "Overhead areas with visible yellow tags (high reward, higher risk)",
  "Return areas or endcaps that look unorganized",
]

const pennyCategories = [
  "Hardware",
  "Lighting",
  "Electrical parts",
  "Paint accessories",
  "Seasonal leftovers",
  "Discontinued items",
  "Brand or packaging transitions",
]

const checkoutTips = [
  "Mix one penny item with a few normal items if you are worried about attention.",
  "Avoid scanning multiple different penny SKUs in one transaction.",
  "If an associate stops the sale, stay calm. Many stores simply do not allow penny sales.",
  "If you are asked to return the item after purchase, show your receipt and ask politely for guidance.",
]

const selfCheckoutSteps = [
  "Have your payment ready before you scan anything.",
  "Scan the UPC barcode on the product, not the yellow clearance tag.",
  "If it scans for a penny, pay immediately and print the receipt.",
  "Leave calmly and avoid drawing attention to the screen.",
]

const ifStoppedSteps = [
  "Stay calm and polite. Do not argue.",
  "If you have already paid, show the receipt and ask for guidance.",
  "If the sale is refused, accept it and move on.",
]

export default function InStoreStrategyPage() {
  return (
    <PageShell width="default">
      <PageHeader
        title="Verify & In-Store Strategy"
        subtitle="Boots-on-the-ground tactics for finding pennies and checking out responsibly."
      />

      <div className="flex justify-center mb-8">
        <EditorialBlock />
      </div>

      <Section>
        <Prose className="mt-8">
          <p className="mb-10 text-lg leading-relaxed">
            Finding a penny item is only half the game. The other half is verifying the price,
            avoiding unnecessary attention, and staying respectful if a store refuses the sale. This
            chapter covers the safest ways to check and the most common pitfalls.
          </p>

          <h2 className="text-2xl font-bold mb-6">How to verify penny status in-store</h2>
          <p className="mb-6">
            The only way to know the real price is to scan the UPC. The app can help, but the scan
            is what counts.
          </p>

          <div className="space-y-6 mb-10">
            {verifySteps.map((step) => (
              <div key={step.title} className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
                <h3 className="font-bold mb-2 text-[var(--text-primary)]">{step.title}</h3>
                <p className="text-[var(--text-secondary)]">{step.detail}</p>
              </div>
            ))}
          </div>
          <h3 className="text-xl font-bold mb-4">Community-reported verification tips</h3>
          <p className="mb-4 text-[var(--text-secondary)]">
            These are common patterns reported by experienced hunters. They are not official policy
            and may vary by store.
          </p>
          <ul className="mb-10">
            {communityReportedTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">The right way vs. the wrong way</h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)]">
              <h3 className="text-lg font-bold mb-3">Low-risk moves</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {rightWay.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)] border-l-4 border-l-[var(--status-error)]">
              <h3 className="text-lg font-bold mb-3">High-risk moves</h3>
              <ul className="space-y-2 text-[var(--text-secondary)]">
                {wrongWay.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-6">What to bring</h2>
          <ul className="mb-10">
            {bringList.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">Where to look in-store</h2>
          <ul className="mb-10">
            {hotspots.map((spot) => (
              <li key={spot}>{spot}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">What to look for (penny-prone categories)</h2>
          <p className="mb-6">
            These categories show up often in community reports. They are not guarantees, but they
            are reliable starting points.
          </p>
          <ul className="mb-10">
            {pennyCategories.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold mb-6">Checkout: keep it simple</h2>
          <p className="mb-6">
            There is no perfect method. Some stores honor penny prices. Some do not. The goal is to
            avoid unnecessary attention and respect store discretion.
          </p>
          <ul className="mb-10">
            {checkoutTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>

          <h3 className="text-xl font-bold mb-4">Self-checkout flow (low drama)</h3>
          <ol className="mb-10">
            {selfCheckoutSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>

          <h3 className="text-xl font-bold mb-4">If you are stopped</h3>
          <ul className="mb-10">
            {ifStoppedSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
          <p className="mb-10 text-[var(--text-secondary)]">
            The long game matters. Leaving a penny behind is better than burning a store or creating
            a bad interaction.
          </p>

          <h2 className="text-2xl font-bold mb-6">Locked cases and cages</h2>
          <p className="mb-6">
            Items in locked cases or cages require an employee. If the item is a penny, the employee
            may refuse to hand it over. If you still want to try, add a normal item to your cart,
            ask politely, and accept the answer you get.
          </p>

          <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg mb-10">
            <p className="text-[var(--text-secondary)]">
              If a store refuses the sale, move on. The best long-term strategy is to stay welcome
              and keep hunting.
            </p>
          </div>
        </Prose>

        <div className="mt-16 p-8 bg-[var(--bg-card)] border border-[var(--border-default)] rounded-2xl shadow-sm">
          <h2 className="text-2xl font-bold mb-4">Need better targets?</h2>
          <p className="text-[var(--text-secondary)] mb-8 max-w-2xl">
            Before you drive, use label recognition and pre-hunt filters to narrow the list.
          </p>
          <Link
            href="/digital-pre-hunt"
            className="inline-flex items-center gap-2 font-bold text-[var(--cta-primary)] hover:underline"
          >
            Read: Labels, Overhead, & Pre-Hunt
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

        <ChapterNavigation
          prev={{
            slug: "digital-pre-hunt",
            title: "Labels, Overhead, & Pre-Hunt",
          }}
          next={{
            slug: "inside-scoop",
            title: "Inside Scoop (2026 Context)",
          }}
        />
      </Section>
    </PageShell>
  )
}
