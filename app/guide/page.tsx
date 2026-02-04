import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "@/components/guide/TableOfContents"
import { EditorialBlock } from "@/components/guide/EditorialBlock"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"

export const metadata: Metadata = {
  title: "The Ultimate Home Depot Penny Shopping Guide (2026 Edition)",
  description:
    "The definitive guide to finding 1-cent items at Home Depot. Learn the clearance lifecycle, verify prices, and master the hunt.",
}

export default function GuideHubPage() {
  return (
    <div className="container max-w-5xl mx-auto py-8 px-4 md:px-6">
      <div className="text-center mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-default)] mb-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            Updated for 2026 Store Pulse
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--text-primary)] mb-2">
          The Ultimate Home Depot Penny Guide
        </h1>
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          The "penny system" has changed. Stop reading outdated 2024 guides. Here is how to find
          1-cent clearance items using the <strong>2026 Rules of Engagement</strong>.
        </p>

        <div className="flex justify-center gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className="bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white shadow-lg shadow-blue-900/10"
          >
            <Link href="/clearance-lifecycle">
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
            <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
              <span className="text-xl">🛑</span> Read This First
            </h3>
            <p className="text-[var(--text-secondary)] mb-4">
              This is not a "get rich quick" scheme. Penny shopping is a hobby that requires
              understanding retail logistics. If you walk into a store asking for "penny items," you
              will leave empty-handed.
            </p>
            <ul className="grid gap-2 text-sm text-[var(--text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--cta-primary)] font-bold">1.</span>
                <span>
                  Penny items are <strong>expired clearance</strong> meant for the trash (ZMA).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--cta-primary)] font-bold">2.</span>
                <span>
                  Employees <strong>must remove them</strong> if they find them.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--cta-primary)] font-bold">3.</span>
                <span>Self-checkout is your only friend for small hauls.</span>
              </li>
            </ul>
          </div>

          <EthicalDisclosure />
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
            📚
          </span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)]">Complete Guide Chapters</h2>
        </div>
        <TableOfContents />
      </div>
    </div>
  )
}
