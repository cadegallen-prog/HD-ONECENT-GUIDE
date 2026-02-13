import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  dateModified: "2026-02-09",
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
      {
        "@type": "ListItem",
        position: 7,
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

const quickStart = [
  "Read in order if you are new, then bookmark the chapters you revisit most often.",
  "Use online and app signals for targeting, then verify in-store with UPC scans.",
  "Treat guidance as directional. Store timing and enforcement can vary by location.",
]

const triageTracks = [
  {
    href: "/what-are-pennies",
    label: "New to penny hunting?",
    note: "Start with Chapter 1 — it explains what penny items are and why they exist.",
  },
  {
    href: "/digital-pre-hunt",
    label: "Know the basics?",
    note: "Jump to Chapter 3 — it covers how to find deals before you go to the store.",
  },
  {
    href: "/in-store-strategy",
    label: "Heading to a store today?",
    note: "Chapter 4 is your field guide — verification, checkout, and what to expect.",
  },
  {
    href: "/inside-scoop",
    label: "Want the inside story?",
    note: "Chapter 5 covers the operational systems behind the scenes.",
  },
]

const utilityLinks = [
  {
    href: "/penny-list",
    label: "Live Penny List",
    note: "Community finds, updated throughout the day.",
  },
  {
    href: "/report-find",
    label: "Report a Find",
    note: "Submit SKU + store + date to improve list quality.",
  },
  {
    href: "/store-finder",
    label: "Store Finder",
    note: "Set the right store before researching or scanning.",
  },
  {
    href: "/support",
    label: "Support",
    note: "Contact, transparency, and site support details.",
  },
]

const workflowGuardrails = [
  "Build your shortlist digitally first, but treat in-store UPC scans as the final source of truth.",
  "Use chapter order for your first pass, then revisit only the chapter tied to your next decision.",
  "Prioritize respectful behavior in-store and follow store policy when outcomes differ by location.",
]

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
          <div className="flex flex-wrap gap-3 pt-1">
            <Button asChild size="lg" variant="primary">
              <Link href="/what-are-pennies">
                Start Chapter 1 <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/report-find">Report a Find</Link>
            </Button>
          </div>
        </header>

        <section className="mx-auto mb-6 max-w-[68ch] space-y-4">
          <EthicalDisclosure />
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
            <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
              How to use this guide
            </h2>
            <ul className="list-disc space-y-2 pl-5 text-[var(--text-secondary)]">
              {quickStart.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="mt-4 text-[var(--text-secondary)]">
              The guide is built around one core principle: reliable process beats rumor chasing.
              Each chapter focuses on a distinct decision point so you can move from theory to
              practical field execution without skipping critical verification steps.
            </p>
          </div>
        </section>

        <section className="mx-auto mb-6 max-w-[68ch] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
            Why this guide format works
          </h2>
          <p className="text-[var(--text-secondary)]">
            Most penny content online is either too shallow to be useful or too speculative to
            trust. This guide is structured to avoid both failure modes. It starts with
            fundamentals, moves into repeatable detection and verification steps, then adds deeper
            operational context only after you understand the practical field workflow.
          </p>
          <p className="mt-3 text-[var(--text-secondary)]">
            That structure is intentional. New hunters need clear, safe decisions they can execute
            today. Returning hunters need stronger signal interpretation so they can prioritize
            where to spend time in-store. By separating those layers, you avoid overloading the
            early chapters while still preserving advanced context for readers who need it.
          </p>
          <p className="mt-3 text-[var(--text-secondary)]">
            You should expect each chapter to answer one core question, not ten loosely connected
            ones. Chapter 1 explains what penny items are and why they exist. Chapter 2 explains
            cadence and signal quality. Chapters 3 and 4 convert theory into execution. Chapters 5
            through 7 handle deeper context, myth correction, and rapid operational answers.
          </p>
        </section>

        <section className="mx-auto mb-6 max-w-[68ch]">
          <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
            <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
              Where should you start?
            </h2>
            <p className="mb-4 text-[var(--text-secondary)]">
              Choose the track that matches your current experience level, then return here to
              branch into the next chapter once you complete it.
            </p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {triageTracks.map((track) => (
                <li key={track.href}>
                  <Link
                    href={track.href}
                    className="block h-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 transition-colors hover:border-[var(--cta-primary)]"
                  >
                    <p className="font-semibold text-[var(--text-primary)]">{track.label}</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{track.note}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mb-6 space-y-3 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Guide Chapters</h2>
          <p className="text-[var(--text-secondary)]">
            Follow the chapter order for full context, or jump directly to the section that matches
            your next action.
          </p>
          <TableOfContents />
        </section>

        <section className="mx-auto mb-6 max-w-[68ch] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
            Execution standards before you hunt
          </h2>
          <p className="text-[var(--text-secondary)]">
            Treat this as a field operations checklist, not entertainment content. The strongest
            results come from process discipline: verify identity, verify timing, verify checkout
            behavior, and log outcomes. When you skip steps, you increase wasted trips and increase
            avoidable conflict at checkout.
          </p>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[var(--text-secondary)]">
            {workflowGuardrails.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
          <p className="mt-3 text-[var(--text-secondary)]">
            If you can only read one chapter before a store run, use Chapter 4. If you have 20
            minutes before leaving, use Chapter 3 first, then Chapter 4. If something in-store feels
            inconsistent, use Chapter 6 to test assumptions before escalating. This keeps your
            decisions grounded in known behavior instead of rumor loops.
          </p>
        </section>

        <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="mb-4 text-2xl font-bold text-[var(--text-primary)]">Essential Tools</h2>
          <p className="mb-4 text-[var(--text-secondary)]">
            Use these pages to move from research to action quickly. The Penny List gives you live
            inventory signals, Report a Find strengthens data quality, and Store Finder keeps your
            targeting aligned with the location you actually plan to visit.
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {utilityLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="font-semibold text-[var(--cta-primary)] underline"
                >
                  {link.label}
                </Link>
                <p className="text-sm text-[var(--text-secondary)]">{link.note}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  )
}
