import type { Metadata } from "next"
import { PageHeader, PageShell, Prose, Section } from "@/components/page-templates"
import { ChapterNavigation } from "@/components/guide/ChapterNavigation"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"

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
    category: "Basics",
    question: "What exactly is a penny item?",
    answer:
      "A penny item is a product that scans for $0.01 after it reaches the final removal stage in Home Depot's clearance flow. It is not a coupon, an advertised sale, or a markdown event for shoppers. The penny price is an inventory-status signal that tells the store the item should already be gone from active selling space.",
  },
  {
    category: "Basics",
    question: "How do I find penny items at Home Depot?",
    answer:
      "Start with a specific SKU list, then search the product's normal home bay first because many markdowns now stay in their regular aisle location. After that, check overhead storage and nearby seasonal transitions. Use the Penny List as a scouting tool, but treat in-store UPC scans as the final authority before you make a checkout decision.",
  },
  {
    category: "Basics",
    question: "Why does Home Depot penny items out?",
    answer:
      "The penny stage marks clearance completion so an item can be removed from normal inventory flow. At that point the store often needs to pull, return, dispose, or otherwise process the product according to internal operations. That is why penny pricing exists in the system and why shopper experience can differ from one location to another.",
  },
  {
    category: "Checkout & Policy",
    question: "Are penny items guaranteed to be sold to customers?",
    answer:
      "No. Penny status does not guarantee a sale because managers still control how removed inventory is handled in their store. One location may allow the sale while another may refuse at register review. Keep expectations realistic, stay respectful, and avoid building a trip around the assumption that every penny scan will be honored.",
  },
  {
    category: "Verification",
    question: "Can I see penny prices in the Home Depot app?",
    answer:
      "Usually no. The app is useful for identifying likely SKUs, bay locations, and on-hand clues, but it is not a real-time source of penny status. Price feeds can lag and final markdown states are often missing from customer-facing results. Use the app to narrow targets, then verify with an in-store scan before acting.",
  },
  {
    category: "Basics",
    question: "What do clearance price endings mean?",
    answer:
      "Endings such as .00, .06/.04, and .03/.02 are useful timing signals in common clearance cadence patterns. They help you estimate where an item sits in the markdown lifecycle, but they do not guarantee the next date or next price step. Combine endings with tag dates, shelf location, and in-store scan results for stronger decisions.",
  },
  {
    category: "Checkout & Policy",
    question: "What is the best time to go penny hunting?",
    answer:
      "There is no universal best day across every store. Strong windows usually appear around resets, seasonal transitions, and early-day shopping before aisles are heavily picked over. The most reliable approach is to build a short target list, monitor timing signals, and go when multiple indicators align instead of relying on one schedule rumor.",
  },
  {
    category: "Checkout & Policy",
    question: "Why do cashiers sometimes refuse penny sales?",
    answer:
      "Penny items can trigger operational friction because the product is flagged for removal rather than normal sale flow. In many stores that creates register prompts, policy checks, or manager involvement. Refusal is usually a store-level decision tied to inventory handling, not a personal conflict with the cashier, so calm and respectful behavior is the best path.",
  },
  {
    category: "Checkout & Policy",
    question: "What if the item is locked, recalled, or buy-back?",
    answer:
      "If the register blocks the sale or an associate confirms lock, recall, or buy-back status, treat the item as unsellable and move on. Those outcomes are often system-enforced and cannot be overridden at checkout. Arguing usually wastes time and can create avoidable negative interactions for both staff and shoppers.",
  },
  {
    category: "Basics",
    question: "Is penny hunting legal?",
    answer:
      "Yes, searching for legitimate markdown inventory is legal when you follow store rules and normal customer conduct. Problems begin when someone swaps tags, hides merchandise, blocks access, or ignores staff direction. The sustainable approach is simple: verify honestly, checkout politely, keep receipts, and leave the store in the same condition you found it.",
  },
  {
    category: "Verification",
    question: "How can I verify a penny price without losing the item?",
    answer:
      "Your safest workflow is to verify using a method that keeps identification accurate and interaction simple. Capture a clear UPC photo, compare SKU digits, and use normal checkout flow. If staff help is required, ask for price confirmation and follow the final store decision. Precision and calm communication reduce friction and mistakes.",
  },
  {
    category: "Checkout & Policy",
    question: "Do Home Depot employees buy penny items?",
    answer:
      "Employee penny-item purchases are generally reported as prohibited by policy. Enforcement details can vary by store, but shoppers should assume employee penny-item purchases are prohibited and focus on their own process. Keeping your focus on verification, respect, and accurate reporting is more productive than debating how internal policy is enforced.",
  },
  {
    category: "Verification",
    question: "Do penny prices show on the shelf tag?",
    answer:
      "Not reliably. Shelf tags can be old, misplaced, or disconnected from the most current register state. A tag may still show a higher ending even when the item is already in late-stage clearance. Treat tags as directional context, then verify with a scan because the register result is the final source of truth.",
  },
  {
    category: "Verification",
    question: "Can I use a price check kiosk?",
    answer:
      "Yes, if your store still has an active kiosk, but use it as a filter only. Kiosk feeds can be delayed, and some stores remove or limit kiosk reliability during resets. A kiosk hit can justify checking a SKU in person, but you should still confirm at the register before assuming penny status is final.",
  },
  {
    category: "Checkout & Policy",
    question: "Can I buy multiple penny items at once?",
    answer:
      "Sometimes, but outcomes vary by store and by checkout context. Multiple units of one SKU may pass in one location while mixed penny SKUs can trigger extra review in another. If your goal is smooth checkout, keep transactions simple, avoid unnecessary complexity, and accept store discretion when a lane or manager declines a basket.",
  },
  {
    category: "Verification",
    question: "What if the app says out of stock but I see the item?",
    answer:
      "Inventory systems lag, so online stock status and physical shelf reality can disagree. If the product is in front of you, verify the exact item by UPC and shelf context instead of assuming the app is correct. The practical rule is physical evidence plus scan result beats delayed online inventory data.",
  },
  {
    category: "Checkout & Policy",
    question: "What if I am asked to return a penny item after purchase?",
    answer:
      "Stay calm, keep the interaction professional, and present your receipt so facts are clear. Ask for manager clarification instead of debating front-line staff, then follow the final direction provided. Even when you disagree, avoiding escalation protects your account standing, your local reputation, and your ability to shop productively in the future.",
  },
  {
    category: "Etiquette & Community",
    question: "How do I report a find to help others?",
    answer:
      "Use the Report a Find form with exact SKU, store location, and date while details are still fresh. Include only information you verified directly so the Penny List remains useful for everyone who checks it later. High-quality reporting creates better route planning, fewer wasted trips, and stronger trust across the community.",
  },
  {
    category: "Etiquette & Community",
    question: "Should I hide items for later?",
    answer:
      "No. Hiding products harms other shoppers, increases staff friction, and can lead to broader crackdowns that hurt everyone using the process responsibly. If you want an item, verify it and checkout through normal customer flow. Respectful behavior protects long-term access and keeps the local environment healthier for future trips.",
  },
  {
    category: "Basics",
    question: "Do all stores have penny items?",
    answer:
      "Most stores eventually generate penny-stage inventory, but frequency and visibility vary widely. Some locations pull fast and leave very little on the floor, while others miss occasional items during transitions. Treat each store as its own operating pattern, track your own results, and avoid assuming one location behaves like another.",
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

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Penny Hunting FAQ & Quick Reference",
    description:
      "Clear answers to the most common penny hunting questions, plus a quick reference cheat sheet.",
    author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
    publisher: {
      "@type": "Organization",
      name: "Penny Central",
      url: "https://www.pennycentral.com",
      logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
    },
    datePublished: "2025-06-01",
    dateModified: "2026-02-09",
    mainEntityOfPage: "https://www.pennycentral.com/faq",
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: "Guide",
        item: "https://www.pennycentral.com/guide",
      },
      { "@type": "ListItem", position: 3, name: "FAQ & Quick Reference" },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <RouteAdSlots pathname="/faq" />
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
            <span className="text-[var(--text-secondary)]">FAQ & Quick Reference</span>
          </nav>
          <PageHeader
            title="Frequently Asked Questions"
            subtitle="Clear answers and a quick reference for penny hunting."
          />
          <EditorialBlock className="mt-2 mb-8" />
        </div>

        <Section className="w-full max-w-[68ch] mx-auto">
          <Prose variant="guide">
            <p className="mb-6">
              This FAQ is organized by workflow so you can scan quickly and still get full context.
              Every answer is visible by default, and each point reflects practical guidance from
              the same system logic explained in the chapter routes.
            </p>

            <div className="space-y-10">
              <section>
                <h2>Basics</h2>
                <p className="mb-5 text-[var(--text-secondary)]">
                  Core definitions, lifecycle fundamentals, and realistic expectations before your
                  first trip.
                </p>
                <div className="space-y-5">
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      What exactly is a penny item?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      A penny item is a product that scans for $0.01 after it reaches the final
                      removal stage in Home Depot&apos;s clearance flow. It is not a coupon, an
                      advertised sale, or a markdown event for shoppers. The penny price is an
                      inventory-status signal that tells the store the item should already be gone
                      from active selling space.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      How do I find penny items at Home Depot?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Start with a specific SKU list, then search the product&apos;s normal home bay
                      first because many markdowns now stay in their regular aisle location. After
                      that, check overhead storage and nearby seasonal transitions. Use the Penny
                      List as a scouting tool, but treat in-store UPC scans as the final authority
                      before you make a checkout decision.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Why does Home Depot penny items out?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      The penny stage marks clearance completion so an item can be removed from
                      normal inventory flow. At that point the store often needs to pull, return,
                      dispose, or otherwise process the product according to internal operations.
                      That is why penny pricing exists in the system and why shopper experience can
                      differ from one location to another.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      What do clearance price endings mean?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Endings such as .00, .06/.04, and .03/.02 are useful timing signals in common
                      clearance cadence patterns. They help you estimate where an item sits in the
                      markdown lifecycle, but they do not guarantee the next date or next price
                      step. Combine endings with tag dates, shelf location, and in-store scan
                      results for stronger decisions.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">Is penny hunting legal?</h3>
                    <p className="text-[var(--text-secondary)]">
                      Yes, searching for legitimate markdown inventory is legal when you follow
                      store rules and normal customer conduct. Problems begin when someone swaps
                      tags, hides merchandise, blocks access, or ignores staff direction. The
                      sustainable approach is simple: verify honestly, checkout politely, keep
                      receipts, and leave the store in the same condition you found it.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Do all stores have penny items?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Most stores eventually generate penny-stage inventory, but frequency and
                      visibility vary widely. Some locations pull fast and leave very little on the
                      floor, while others miss occasional items during transitions. Treat each store
                      as its own operating pattern, track your own results, and avoid assuming one
                      location behaves like another.
                    </p>
                  </article>
                </div>
              </section>

              <section>
                <h2>Verification</h2>
                <p className="mb-5 text-[var(--text-secondary)]">
                  How to confirm signal quality, validate item status, and avoid bad assumptions.
                </p>
                <div className="space-y-5">
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Can I see penny prices in the Home Depot app?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Usually no. The app is useful for identifying likely SKUs, bay locations, and
                      on-hand clues, but it is not a real-time source of penny status. Price feeds
                      can lag and final markdown states are often missing from customer-facing
                      results. Use the app to narrow targets, then verify with an in-store scan
                      before acting.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      How can I verify a penny price without losing the item?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Your safest workflow is to verify using a method that keeps identification
                      accurate and interaction simple. Capture a clear UPC photo, compare SKU
                      digits, and use normal checkout flow. If staff help is required, ask for price
                      confirmation and follow the final store decision. Precision and calm
                      communication reduce friction and mistakes.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Do penny prices show on the shelf tag?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Not reliably. Shelf tags can be old, misplaced, or disconnected from the most
                      current register state. A tag may still show a higher ending even when the
                      item is already in late-stage clearance. Treat tags as directional context,
                      then verify with a scan because the register result is the final source of
                      truth.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Can I use a price check kiosk?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Yes, if your store still has an active kiosk, but use it as a filter only.
                      Kiosk feeds can be delayed, and some stores remove or limit kiosk reliability
                      during resets. A kiosk hit can justify checking a SKU in person, but you
                      should still confirm at the register before assuming penny status is final.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      What if the app says out of stock but I see the item?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Inventory systems lag, so online stock status and physical shelf reality can
                      disagree. If the product is in front of you, verify the exact item by UPC and
                      shelf context instead of assuming the app is correct. The practical rule is
                      physical evidence plus scan result beats delayed online inventory data.
                    </p>
                  </article>
                </div>
              </section>

              <section>
                <h2>Checkout &amp; Policy</h2>
                <p className="mb-5 text-[var(--text-secondary)]">
                  What to expect at register time, why refusal happens, and how to handle edge
                  cases.
                </p>
                <div className="space-y-5">
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Are penny items guaranteed to be sold to customers?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      No. Penny status does not guarantee a sale because managers still control how
                      removed inventory is handled in their store. One location may allow the sale
                      while another may refuse at register review. Keep expectations realistic, stay
                      respectful, and avoid building a trip around the assumption that every penny
                      scan will be honored.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      What is the best time to go penny hunting?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      There is no universal best day across every store. Strong windows usually
                      appear around resets, seasonal transitions, and early-day shopping before
                      aisles are heavily picked over. The most reliable approach is to build a short
                      target list, monitor timing signals, and go when multiple indicators align
                      instead of relying on one schedule rumor.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Why do cashiers sometimes refuse penny sales?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Penny items can trigger operational friction because the product is flagged
                      for removal rather than normal sale flow. In many stores that creates register
                      prompts, policy checks, or manager involvement. Refusal is usually a
                      store-level decision tied to inventory handling, not a personal conflict with
                      the cashier, so calm and respectful behavior is the best path.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      What if the item is locked, recalled, or buy-back?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      If the register blocks the sale or an associate confirms lock, recall, or
                      buy-back status, treat the item as unsellable and move on. Those outcomes are
                      often system-enforced and cannot be overridden at checkout. Arguing usually
                      wastes time and can create avoidable negative interactions for both staff and
                      shoppers.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Do Home Depot employees buy penny items?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Employee penny-item purchases are generally reported as prohibited by policy.
                      Enforcement details can vary by store, but shoppers should assume employee
                      penny-item purchases are prohibited and focus on their own process. Keeping
                      your focus on verification, respect, and accurate reporting is more productive
                      than debating how internal policy is enforced.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Can I buy multiple penny items at once?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Sometimes, but outcomes vary by store and by checkout context. Multiple units
                      of one SKU may pass in one location while mixed penny SKUs can trigger extra
                      review in another. If your goal is smooth checkout, keep transactions simple,
                      avoid unnecessary complexity, and accept store discretion when a lane or
                      manager declines a basket.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      What if I am asked to return a penny item after purchase?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Stay calm, keep the interaction professional, and present your receipt so
                      facts are clear. Ask for manager clarification instead of debating front-line
                      staff, then follow the final direction provided. Even when you disagree,
                      avoiding escalation protects your account standing, your local reputation, and
                      your ability to shop productively in the future.
                    </p>
                  </article>
                </div>
              </section>

              <section>
                <h2>Etiquette &amp; Community</h2>
                <p className="mb-5 text-[var(--text-secondary)]">
                  Behavior standards that keep the process sustainable for everyone.
                </p>
                <div className="space-y-5">
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      How do I report a find to help others?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      Use the Report a Find form with exact SKU, store location, and date while
                      details are still fresh. Include only information you verified directly so the
                      Penny List remains useful for everyone who checks it later. High-quality
                      reporting creates better route planning, fewer wasted trips, and stronger
                      trust across the community.
                    </p>
                  </article>
                  <article className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
                    <h3 className="mb-2 text-[var(--text-primary)]">
                      Should I hide items for later?
                    </h3>
                    <p className="text-[var(--text-secondary)]">
                      No. Hiding products harms other shoppers, increases staff friction, and can
                      lead to broader crackdowns that hurt everyone using the process responsibly.
                      If you want an item, verify it and checkout through normal customer flow.
                      Respectful behavior protects long-term access and keeps the local environment
                      healthier for future trips.
                    </p>
                  </article>
                </div>
              </section>
            </div>

            <h2>Quick reference</h2>
            <ul className="mb-8">
              {quickReference.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Prose>

          <ChapterNavigation
            prev={{
              slug: "facts-vs-myths",
              title: "Facts vs. Myths",
            }}
            next={undefined}
          />
        </Section>
      </PageShell>
    </>
  )
}
