import type { Metadata } from "next"
import Link from "next/link"
import { TableOfContents } from "@/components/guide/TableOfContents"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { RouteAdSlots } from "@/components/ads/route-ad-slots"
import { MonumetricInContentSlot } from "@/components/ads/monumetric-in-content-slot"

export const metadata: Metadata = {
  title: "How to Find Home Depot Penny Items (2026 Guide) | Penny Central",
  description:
    "Learn how Home Depot penny items work, why they reach $0.01, and which guide chapters to read next if you want to find them in store.",
  keywords: [
    "how to find home depot penny items",
    "home depot penny guide",
    "home depot one cent items",
    "how to find penny items at home depot",
    "penny item guide",
  ],
  alternates: {
    canonical: "/guide",
  },
  openGraph: {
    title: "How to Find Home Depot Penny Items (2026 Guide)",
    description:
      "Learn how Home Depot penny items work and which guide chapters to read next if you want to find them in store.",
  },
  twitter: {
    card: "summary_large_image",
  },
}

const guideJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "How to Find Home Depot Penny Items (2026 Guide)",
  description:
    "A practical guide to finding Home Depot penny items, understanding clearance patterns, verifying in store, and reporting confirmed finds.",
  url: "https://www.pennycentral.com/guide",
  author: { "@type": "Person", name: "Cade Allen", url: "https://www.pennycentral.com/about" },
  publisher: {
    "@type": "Organization",
    name: "Penny Central",
    url: "https://www.pennycentral.com",
    logo: { "@type": "ImageObject", url: "https://www.pennycentral.com/icon.svg" },
  },
  dateModified: "2026-02-28",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Clearance Lifecycle & Cadence",
        url: "https://www.pennycentral.com/clearance-lifecycle",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Labels, Overhead, & Pre-Hunt",
        url: "https://www.pennycentral.com/digital-pre-hunt",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Verify & In-Store Strategy",
        url: "https://www.pennycentral.com/in-store-strategy",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Inside Scoop (2026 Context)",
        url: "https://www.pennycentral.com/inside-scoop",
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "Facts vs. Myths",
        url: "https://www.pennycentral.com/facts-vs-myths",
      },
      {
        "@type": "ListItem",
        position: 6,
        name: "FAQ & Quick Reference",
        url: "https://www.pennycentral.com/faq",
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
            <Link href="/" className="hover:text-[var(--cta-primary)]">
              Home
            </Link>
            <span className="mx-1.5">/</span>
            <span className="text-[var(--text-secondary)]">Guide</span>
          </nav>
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
            How to Find Home Depot Penny Items
          </h1>
          <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
            You are here to learn how penny items work, why they reach $0.01, and what clues matter
            when you try to find them.
          </p>
          <EditorialBlock className="mt-1" />
          <EthicalDisclosure />
        </header>

        <section className="mx-auto mb-6 max-w-[68ch] space-y-4 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5 md:p-6">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] md:text-3xl">
            What are penny items?
          </h2>
          <p className="text-[var(--text-secondary)] leading-relaxed md:text-lg">
            Penny items are clearance products that reach a final price of $0.01. They are not a
            public sale. They are the last step in the clearance process, which is why timing and
            store-by-store variation matter so much.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            Some items get pulled right away. Others stay on the shelf long enough for shoppers to
            find them. That is why people pay attention to clearance timing, label changes, and
            in-store verification instead of treating penny hunting like random luck.
          </p>
          <p className="text-[var(--text-secondary)] leading-relaxed">
            This page is Part 1. If you are new, read the chapters below in order. If you already
            know the basics, jump to the part that answers your next question.
          </p>
        </section>

        <section className="mb-6 space-y-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Guide Chapters</h2>
          <p className="text-[var(--text-secondary)]">
            Start with Part 2 below and keep going in order unless you are returning for one
            specific topic.
          </p>
          <TableOfContents />
        </section>

        <MonumetricInContentSlot />
      </div>
    </>
  )
}
