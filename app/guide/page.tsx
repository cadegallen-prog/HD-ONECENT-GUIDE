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

export default function GuideHubPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-7 md:px-6 md:py-9">
      <header className="mx-auto mb-6 max-w-[68ch] space-y-4">
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
        <div className="flex flex-wrap gap-3 pt-1">
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
            The guide is built around one core principle: reliable process beats rumor chasing. Each
            chapter focuses on a distinct decision point so you can move from theory to practical
            field execution without skipping critical verification steps.
          </p>
        </div>
      </section>

      <section className="mx-auto mb-6 max-w-[68ch]">
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
          <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
            Where should you start?
          </h2>
          <p className="mb-4 text-[var(--text-secondary)]">
            Choose the track that matches your current experience level, then return here to branch
            into the next chapter once you complete it.
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

      <section className="mb-6 space-y-3">
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Guide Chapters</h2>
        <p className="text-[var(--text-secondary)]">
          Follow the chapter order for full context, or jump directly to the section that matches
          your next action.
        </p>
        <TableOfContents />
      </section>

      <section className="mx-auto mb-6 max-w-[68ch] rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <h2 className="mb-3 text-xl font-semibold text-[var(--text-primary)]">
          Hub monetization gate (Phase 2 decision)
        </h2>
        <p className="text-[var(--text-secondary)]">
          This `/guide` hub remains navigation-first in this phase, so it stays ad-ineligible.
          Monetization remains focused on chapter routes that meet depth requirements.
        </p>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[var(--text-secondary)]">
          <li>Chapter routes remain monetization-eligible after quality-depth checks.</li>
          <li>Legal and compliance routes stay ad-ineligible.</li>
          <li>
            Mobile guardrails stay active: no ad clusters, one sticky max, and inline spacing
            between substantive sections.
          </li>
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] p-5">
        <h2 className="mb-4 text-2xl font-bold text-[var(--text-primary)]">Quick Links</h2>
        <ul className="grid gap-4 md:grid-cols-2">
          {utilityLinks.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-semibold text-[var(--cta-primary)] underline">
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
