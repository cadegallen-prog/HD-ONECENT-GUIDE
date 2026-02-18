import type { Metadata } from "next"
import { TableOfContents } from "@/components/guide/TableOfContents"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"

export const metadata: Metadata = {
  title: "Home Depot Penny Guide (2026) | Penny Central",
  description:
    "Start here. A field-tested, community-verified guide to Home Depot penny items, clearance patterns, and responsible hunting.",
  alternates: {
    canonical: "/guide",
  },
}

const guideJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Home Depot Penny Guide (2026)",
  description:
    "A field-tested, community-verified guide to Home Depot penny items, clearance patterns, and responsible hunting.",
  url: "https://www.pennycentral.com/guide",
  author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
  publisher: {
    "@type": "Organization",
    name: "Penny Central",
    url: "https://www.pennycentral.com",
    logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
  },
  dateModified: "2026-02-18",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "What Are Penny Items?",
        url: "https://www.pennycentral.com/what-are-pennies",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Clearance Lifecycle & Cadence",
        url: "https://www.pennycentral.com/clearance-lifecycle",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Labels, Overhead, & Pre-Hunt",
        url: "https://www.pennycentral.com/digital-pre-hunt",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Verify & In-Store Strategy",
        url: "https://www.pennycentral.com/in-store-strategy",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Inside Scoop (2026 Context)",
        url: "https://www.pennycentral.com/inside-scoop",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "Facts vs. Myths",
        url: "https://www.pennycentral.com/facts-vs-myths",
      },
    ],
  },
}

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.pennycentral.com" },
    { "@type": "ListItem", position: 2, name: "Guide" },
  ],
}

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What are Home Depot penny items?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Home Depot penny items are clearance products that can reach a one-cent terminal price in some stores. Timing and availability vary by location.",
      },
    },
    {
      "@type": "Question",
      name: "Do online prices confirm penny status?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Online and app signals are directional only. In-store UPC scan and checkout behavior are the final source of truth.",
      },
    },
    {
      "@type": "Question",
      name: "What should I do when I find a confirmed penny item?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Record SKU, store, and date, then submit a report through Penny Central so the community list stays current and trustworthy.",
      },
    },
  ],
}

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find Home Depot penny items",
  description:
    "A practical process to identify likely penny items, verify them in-store, and report findings responsibly.",
  totalTime: "PT20M",
  step: [
    {
      "@type": "HowToStep",
      name: "Build a shortlist before visiting",
      text: "Review the Live Penny List and shortlist SKUs relevant to your next store run.",
      url: "https://www.pennycentral.com/penny-list",
    },
    {
      "@type": "HowToStep",
      name: "Set your target store",
      text: "Use Store Finder so your research is tied to the location you actually plan to visit.",
      url: "https://www.pennycentral.com/store-finder",
    },
    {
      "@type": "HowToStep",
      name: "Verify in-store with UPC checks",
      text: "Use in-store verification and checkout behavior as final truth; online signals are not confirmation.",
      url: "https://www.pennycentral.com/in-store-strategy",
    },
    {
      "@type": "HowToStep",
      name: "Report confirmed outcomes",
      text: "Submit confirmed finds with SKU, store, and date so the list improves for returning users.",
      url: "https://www.pennycentral.com/report-find",
    },
  ],
}

export default function GuideHubPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(guideJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <RouteAdSlots pathname="/guide" />
      <div className="container mx-auto max-w-5xl px-4 py-7 md:px-6 md:py-9">
        <header className="mx-auto mb-6 max-w-[68ch] space-y-4">
          <nav aria-label="Breadcrumb" className="text-sm text-[var(--text-muted)]">
            <a href="/" className="hover:text-[var(--cta-primary)]">
              Home
            </a>
            <span className="mx-1.5">/</span>
            <span className="text-[var(--text-secondary)]">Guide</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
            The Home Depot Penny Guide
          </h1>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            Practical, community-verified guidance for penny items, clearance patterns, and
            respectful in-store behavior.
          </p>
          <EditorialBlock className="mt-1" />
        </header>

        <section className="mx-auto mb-6 max-w-[68ch] space-y-4">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5 space-y-3 text-[var(--text-secondary)] leading-relaxed">
            <p className="text-lg font-semibold text-[var(--text-primary)]">Before you start.</p>
            <p>
              You're not going to find a penny item tomorrow. Probably not this week either. Your
              first one might take weeks of driving, scanning, and walking out empty handed. Most
              people won't last that long.
            </p>
            <p>That's the barrier to entry. That's why it works.</p>
            <p>
              If you're here because TikTok made it look like free money, save yourself the gas and
              quit now. No hard feelings. This isn't a side hustle. It's a scavenger hunt with a
              brutal learning curve.
            </p>
            <p>
              But if you read that and thought &ldquo;weeks of effort for something that rings up
              $0.01&rdquo; sounds like a good trade? You're already thinking like us. Read the
              guide. Join the Facebook group. Put in the hours.
            </p>
            <p>
              When you finally hold that first one in your hand, something worth $50 that you paid a
              penny for, you'll understand why the rest of us are obsessed.
            </p>
            <p className="font-medium text-[var(--text-primary)]">
              Start with the guide. Then come find us in the group.
            </p>
          </div>

          <EthicalDisclosure />
        </section>

        <section className="mb-6 space-y-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Guide Chapters</h2>
          <p className="text-[var(--text-secondary)]">
            Read in order. Each chapter builds on the one before it.
          </p>
          <TableOfContents />
        </section>
      </div>
    </>
  )
}
