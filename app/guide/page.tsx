import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "@/components/guide/TableOfContents"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"

export const metadata: Metadata = {
  title: "Home Depot Penny Guide (2026) | Penny Central",
  description:
    "Start here. A field-tested, community-verified guide to Home Depot penny items, clearance patterns, and responsible hunting.",
  alternates: {
    canonical: "/guide",
  },
}

const quickStart = [
  "Read in order if you are new. Jump by chapter if you already know the basics.",
  "Treat this guide as directional. Store behavior and enforcement can vary.",
  "Verify in-store with UPC scans before acting on any online claim.",
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

export default function GuideHubPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
      <header className="mx-auto mb-8 max-w-[68ch] space-y-4">
        <p className="inline-flex items-center rounded-full border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Updated February 2026
        </p>
        <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)] md:text-5xl">
          The Home Depot Penny Guide
        </h1>
        <p className="text-lg leading-relaxed text-[var(--text-secondary)] md:text-xl">
          Practical, community-verified guidance for penny items, clearance patterns, and respectful
          in-store behavior.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Button asChild size="lg" className="bg-[var(--cta-primary)] text-[var(--cta-text)]">
            <Link href="/what-are-pennies">
              Start Chapter 1 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/report-find">Report a Find</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto mb-8 max-w-[68ch] space-y-4">
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
        </div>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Guide Chapters</h2>
        <TableOfContents />
      </section>

      <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <h2 className="mb-4 text-2xl font-bold text-[var(--text-primary)]">Quick Links</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {utilityLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-semibold text-[var(--cta-primary)]">
                {link.label}
              </Link>
              <p className="text-sm text-[var(--text-secondary)]">{link.note}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
