import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "@/components/guide/TableOfContents"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"

export const metadata: Metadata = {
  title: "Home Depot Penny Guide (2026) | Penny Central",
  description:
    "Start here. A field-tested, community-verified guide to Home Depot penny items, clearance patterns, and responsible hunting.",
  alternates: {
    canonical: "/guide",
  },
}

export default function GuideHubPage() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--status-success)] opacity-30"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--status-success)]"></span>
          </span>
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Updated February 2026
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">
          The Home Depot Penny Guide
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          A practical, field-tested guide to penny items, clearance patterns, and responsible
          hunting. This is not official Home Depot policy. It is a synthesis of community reports
          and real-world observations. Rules and enforcement vary by store.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-[var(--cta-text)] shadow-sm"
          >
            <Link href="/what-are-pennies">
              Start Chapter 1 <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
          >
            <Link href="/report-find">Report a Find</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-10 mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <div className="p-6 rounded-xl bg-[var(--bg-subtle)] border border-[var(--border-default)] not-prose mb-8">
            <h3 className="font-bold text-lg mb-2">Read This First</h3>
            <p className="text-[var(--text-secondary)] mb-4">
              Penny items are not public promotions. They are clearance items marked for removal.
              Some stores honor the price. Some do not. Your goal is to hunt responsibly and keep
              the hobby healthy for everyone.
            </p>
            <ul className="grid gap-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--cta-primary)] font-bold">1.</span>
                <span>Penny items are internal clearance, not a guaranteed sale.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--cta-primary)] font-bold">2.</span>
                <span>Store discretion is real. Stay polite and avoid confrontation.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--cta-primary)] font-bold">3.</span>
                <span>Use this guide to reduce wasted trips, not to argue with staff.</span>
              </li>
            </ul>
          </div>

          <EthicalDisclosure />

          <h2>How to use this guide</h2>
          <p>
            Think of this as a step-by-step playbook. Start with definitions, then learn how
            clearance typically moves, then go practical with labels, overhead cues, and in-store
            verification. If you are new, read it in order. If you are experienced, jump straight to
            the chapter you need and use the quick reference at the end.
          </p>

          <ol>
            <li>
              Start with <strong>What Are Penny Items?</strong> to understand the basics and ethics.
            </li>
            <li>
              Learn how clearance usually flows in <strong>Clearance Lifecycle & Cadence</strong>.
            </li>
            <li>
              Use <strong>Labels, Overhead, & Pre-Hunt</strong> to filter targets before you drive.
            </li>
            <li>
              Follow <strong>Verify & In-Store Strategy</strong> to check prices and checkout
              calmly.
            </li>
          </ol>

          <h2>Who this guide is for</h2>
          <p>
            If you are brand new, this is your zero-to-one. If you are experienced, this is a clean
            reference that matches how the stores actually behave in 2026.
          </p>
          <ul>
            <li>New hunters who want a legit foundation without forum noise.</li>
            <li>Experienced hunters who want a current, calm reference.</li>
            <li>Anyone who wants to cut wasted trips and avoid awkward checkout moments.</li>
          </ul>

          <h2>What this guide is not</h2>
          <ul>
            <li>It is not official Home Depot policy.</li>
            <li>It is not a promise that penny items will be available in your store.</li>
            <li>It is not a script for arguing with staff or gaming the system.</li>
          </ul>

          <h2>Key terms in 60 seconds</h2>
          <ul>
            <li>
              <strong>Penny item:</strong> A product that scans for $0.01 after clearance is
              complete.
            </li>
            <li>
              <strong>Clearance cadence:</strong> The rough pattern of markdowns before a penny.
            </li>
            <li>
              <strong>Tag date:</strong> The date on the clearance label that helps you estimate
              timing.
            </li>
            <li>
              <strong>UPC vs SKU:</strong> The UPC is the barcode on the product; the SKU is the
              Home Depot identifier. Both can help, but the UPC scan is the truth.
            </li>
            <li>
              <strong>ZMA:</strong> A term often used to describe the removal stage after an item
              pennied out.
            </li>
          </ul>

          <h2>What has changed since older guides</h2>
          <p>
            Many 2024 guides assumed fixed schedules and a dedicated clearance corner. The field
            reports we see in 2026 are more mixed. Timing varies by store and department, and older
            "three-week rules" do not hold everywhere. That does not mean penny hunting is dead. It
            means you have to use signals, not myths.
          </p>
          <ul>
            <li>Cadence patterns still exist, but the timing ranges are wider.</li>
            <li>Clearance items can be in home bays, seasonal areas, or overheads.</li>
            <li>Digital pre-hunt saves time, but app data is not real-time.</li>
          </ul>
          <p className="text-sm text-[var(--text-secondary)]">
            This guide reflects community-reported patterns, not official Home Depot policy.
          </p>

          <h2>Quick start checklist</h2>
          <ul>
            <li>Set your store in the Home Depot app before searching.</li>
            <li>Track price endings and tag dates, not just discount percentages.</li>
            <li>Use the manufacturer UPC to scan at self-checkout, not the yellow tag.</li>
            <li>Be willing to walk away if staff refuse a penny sale.</li>
            <li>Keep receipts; they are your proof if there is confusion later.</li>
          </ul>
          <h2>If you only do one thing</h2>
          <p>
            Set your store, note the tag date, and scan the UPC in person. That simple routine
            prevents most wasted trips and most awkward checkout moments.
          </p>
          <p>
            For fresh intel, use the Penny List and report your own finds so the community stays
            accurate. It is the fastest way for this guide to stay current between updates.
          </p>
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-xl border border-[var(--border-default)] bg-[var(--bg-card)] shadow-sm">
            <EditorialBlock />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-4 pb-2 border-b border-[var(--border-default)]">
          <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[var(--bg-elevated)] font-bold text-sm text-[var(--text-muted)]">
            1
          </span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Complete Guide Chapters</h2>
        </div>
        <TableOfContents />
      </div>

      <div className="mt-12 p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border-default)]">
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Quick links</h2>
        <ul className="grid gap-4 md:grid-cols-2 text-[var(--text-secondary)]">
          <li>
            <Link
              href="/penny-list"
              className="text-[var(--cta-primary)] font-semibold underline underline-offset-4 hover:underline"
            >
              Live Penny List
            </Link>
            <span className="block text-sm">
              Usually updated within about 5 minutes with community finds.
            </span>
          </li>
          <li>
            <Link
              href="/report-find"
              className="text-[var(--cta-primary)] font-semibold underline underline-offset-4 hover:underline"
            >
              Report a Find
            </Link>
            <span className="block text-sm">
              Share a SKU, store, and date so the list stays accurate.
            </span>
          </li>
          <li>
            <Link
              href="/store-finder"
              className="text-[var(--cta-primary)] font-semibold underline underline-offset-4 hover:underline"
            >
              Store Finder
            </Link>
            <span className="block text-sm">
              Set the correct store before you research or scan.
            </span>
          </li>
          <li>
            <Link
              href="/support"
              className="text-[var(--cta-primary)] font-semibold underline underline-offset-4 hover:underline"
            >
              Support
            </Link>
            <span className="block text-sm">Contact and transparency info for Penny Central.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
