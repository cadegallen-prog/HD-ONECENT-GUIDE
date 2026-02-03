import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TableOfContents } from "@/components/guide/TableOfContents"

export const metadata: Metadata = {
  title: "The Ultimate Home Depot Penny Shopping Guide (2025 Edition)",
  description:
    "The definitive guide to finding 1-cent items at Home Depot. Learn the clearance lifecycle, verify prices, and master the hunt.",
}

export default function GuideHubPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-16 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          The Ultimate Penny Shopping Guide
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          At Home Depot, a "penny item" refers to merchandise that rings up at{" "}
          <strong className="text-[var(--text-primary)]">$0.01</strong>. These aren't sales—they're
          clearance secrets.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)]">
            <Link href="/guide/clearance-lifecycle">
              Start Reading <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-16">
        <p>
          This guide is the result of years of community knowledge, trial and error, and thousands
          of successful finds. It breaks down exactly how the system works, what the price tags
          mean, and how to find these items before they disappear.
        </p>
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] border-l-4 border-l-[var(--cta-primary)] rounded-lg p-5 my-8 not-prose">
          <div className="flex items-start gap-3">
            <span className="text-lg leading-none">⚠️</span>
            <div>
              <div className="font-bold text-[var(--cta-primary)] flex items-center gap-2 mb-2">
                <span>Disclaimer:</span>
              </div>
              <p className="text-[var(--text-secondary)] mt-2 leading-relaxed">
                This guide is based on consistent community reports and retail logic, not official
                Home Depot policy. Practices may vary by store.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold border-b border-[var(--border-default)] pb-2">
          Table of Contents
        </h2>
        <TableOfContents />
      </div>
    </div>
  )
}
