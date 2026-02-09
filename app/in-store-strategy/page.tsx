import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"

export const metadata: Metadata = {
  title: "Verify & In-Store Penny Strategy | Penny Central",
  description:
    "How to verify penny status, where to look in-store, and how to checkout without drama.",
  alternates: {
    canonical: "/in-store-strategy",
  },
}

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Verify & In-Store Penny Strategy",
  description:
    "How to verify penny status, where to look in-store, and how to checkout without drama.",
  author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
  publisher: {
    "@type": "Organization",
    name: "Penny Central",
    url: "https://www.pennycentral.com",
    logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
  },
  datePublished: "2025-06-01",
  dateModified: "2026-02-09",
  mainEntityOfPage: "https://www.pennycentral.com/in-store-strategy",
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
    { "@type": "ListItem", position: 2, name: "Guide", item: "https://www.pennycentral.com/guide" },
    { "@type": "ListItem", position: 3, name: "Verify & In-Store Strategy" },
  ],
}

const verifySteps = [
  {
    title: "Use the UPC, not the yellow tag",
    detail:
      'Scan only the manufacturer barcode at self-checkout. Scanning the yellow tag can trigger a "customer needs assistance" alert that brings staff over. Exception: if there is no barcode, an employee must key in the SKU number, and they are likely to notice penny status, decline the sale, and take the item.',
  },
  {
    title: "Don't scan the QR code",
    detail:
      'There are occasionally QR codes placed near the manufacturer barcode. Cover those when scanning the UPC. If you scan the QR code, it can trigger a "customer needs assistance" alert that brings the SCO attendant over.',
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
  "Avoid bringing the item to the desk. A clear UPC photo is usually enough.",
  "Ask for a stock check instead of a price check. A price check is more likely to result in the item being pulled.",
  "Associates use handhelds (Zebra or FIRST). If they scan and see a penny, they may pull the item.",
  "Associates can scan a barcode photo on your phone or look up the SKU on their device without physically taking the item, but expect pushback or extra questions.",
  "Community members report an easier checkout experience when they scan a filler item first, then the penny item, to draw less attention to a $0.01 screen result.",
  "Note: self-checkout terminals can notify employees through the FIRST phone (store phone, also called Zebra) when a penny item is scanned. Some stores are more proactive than others.",
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
  "Home bay shelves where the item normally lives — this is now the primary location as endcaps are phased out",
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <PageShell width="default" padding="sm" gap="md">
        <div className="w-full max-w-[68ch] mx-auto">
          <nav aria-label="Breadcrumb" className="mb-3 text-sm text-[var(--text-muted)]">
            <a href="/" className="hover:text-[var(--cta-primary)]">
              Home
            </a>
            <span className="mx-1.5">/</span>
            <a href="/guide" className="hover:text-[var(--cta-primary)]">
              Guide
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-[var(--text-secondary)]">Verify & In-Store Strategy</span>
          </nav>
          <PageHeader
            title="Verify & In-Store Strategy"
            subtitle="Boots-on-the-ground tactics for finding pennies and checking out responsibly."
          />
          <p className="mt-2 mb-8 text-xs text-[var(--text-muted)]">
            <time dateTime="2026-02-09">Updated February 2026</time> · By Cade Allen
          </p>
        </div>

        <Section className="w-full max-w-[68ch] mx-auto">
          <Prose variant="guide">
            <p className="mb-8 text-lg leading-relaxed">
              Finding a penny item is only half the game. The other half is verifying the price,
              avoiding unnecessary attention, and staying respectful if a store refuses the sale.
              This chapter covers the safest ways to check and the most common pitfalls.
            </p>

            <h2>How to verify penny status in-store</h2>
            <p className="mb-6">
              The only way to know the real price is to scan the UPC. The app can help, but the scan
              is what counts.
            </p>
            <p className="mb-6 text-[var(--text-secondary)]">
              Verify the in-store price at self-checkout or with an employee store phone. Employee
              verification can be risky because if the item is a penny, they may take it away. They
              can scan a barcode photo from your phone or look up the SKU number without physically
              taking the item, but some associates may push back or ask more questions. The safest
              approach is usually to take the item to self-checkout and chance it there.
            </p>

            <div className="space-y-6 mb-8">
              {verifySteps.map((step) => (
                <div key={step.title} className="border-l-4 border-[var(--cta-primary)] pl-6 py-2">
                  <h3 className="font-bold mb-2 text-[var(--text-primary)]">{step.title}</h3>
                  <p className="text-[var(--text-secondary)]">{step.detail}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-bold mb-4">Practical verification tips</h3>
            <p className="mb-4 text-sm text-[var(--text-secondary)]">
              Note: These tips are based on consistent community reports. Specifics vary by store.
            </p>
            <ul className="mb-8">
              {communityReportedTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>

            <h2>The right way vs. the wrong way</h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
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

            <h2>What to bring</h2>
            <ul className="mb-8">
              {bringList.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <h2>Where to look in-store</h2>
            <ul className="mb-8">
              {hotspots.map((spot) => (
                <li key={spot}>{spot}</li>
              ))}
            </ul>

            <h2>MET reset timing</h2>
            <p className="mb-6">
              MET teams handle bay resets on a scheduled calendar. Penny-outs are often synchronized
              with these resets. The 48 hours before a scheduled reset is when items are most likely
              to be pulled. If you notice a reset in progress in a specific department, check nearby
              bays for late-stage clearance items before they get swept.
            </p>

            <h2>What to look for (penny-prone categories)</h2>
            <p className="mb-6">
              These categories show up often in community reports. They are not guarantees, but they
              are reliable starting points.
            </p>
            <ul className="mb-8">
              {pennyCategories.map((category) => (
                <li key={category}>{category}</li>
              ))}
            </ul>

            <h2>Why checkout can be complicated</h2>
            <p className="mb-6">
              Every penny sale generates an internal report called a Zero-Comm. It is a failure log
              — it means the store did not pull the item before someone found it. This is why some
              associates push back: the sale creates paperwork for them. Understanding this helps
              you stay patient when checkout does not go smoothly.
            </p>
            <p className="mb-6">
              Some items — especially power tools from brands like Milwaukee and Ryobi — have
              automated buy-back locks. Even a willing associate cannot sell them. The system blocks
              the sale because the vendor has already arranged to reclaim the inventory. If a
              register blocks the sale entirely, the item is likely in this category.
            </p>

            <h2>The $.02 signal in practice</h2>
            <p className="mb-6">
              If you find an item at $.02, move quickly. This price is a 48-hour signal to the MET
              team to pull the item (explained in detail in Chapter 2). The window between $.02 and
              removal is short.
            </p>

            <h2>Checkout: keep it simple</h2>
            <p className="mb-6">
              There is no perfect method. Some stores honor penny prices. Some do not. The goal is
              to avoid unnecessary attention and respect store discretion.
            </p>
            <ul className="mb-8">
              {checkoutTips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>

            <h3 className="text-xl font-bold mb-4">Self-checkout flow (low drama)</h3>
            <ol className="mb-8">
              {selfCheckoutSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <h3 className="text-xl font-bold mb-4">If you are stopped</h3>
            <ul className="mb-8">
              {ifStoppedSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ul>
            <p className="mb-8 text-[var(--text-secondary)]">
              The long game matters. Leaving a penny behind is better than burning a store or
              creating a bad interaction.
            </p>

            <h2>Locked cases and cages</h2>
            <p className="mb-6">
              Items in locked cases or cages require an employee. If the item is a penny, the
              employee may refuse to hand it over. If you still want to try, add a normal item to
              your cart, ask politely, and accept the answer you get.
            </p>

            <div className="p-6 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg mb-8">
              <p className="text-[var(--text-secondary)]">
                If a store refuses the sale, move on. The best long-term strategy is to stay welcome
                and keep hunting.
              </p>
            </div>
          </Prose>

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
    </>
  )
}
