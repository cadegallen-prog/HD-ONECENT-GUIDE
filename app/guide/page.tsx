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
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="text-center mb-12 space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
          The Ultimate Home Depot Penny Shopping Guide (2026)
        </h1>
        <p className="text-xl md:text-2xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          At Home Depot, a "penny item" refers to merchandise that rings up at{" "}
          <strong className="text-[var(--text-primary)]">$0.01</strong>. These aren't sales—they're
          clearance secrets.
        </p>

        <div className="flex justify-center max-w-2xl mx-auto">
          <EditorialBlock />
        </div>

        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)]">
            <Link href="/guide/clearance-lifecycle">
              Start Reading <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/report-find">Report a Find</Link>
          </Button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-16">
        <h3>Why This Guide Exists</h3>
        <p>
          This guide is the result of years of community knowledge, trial and error, and thousands
          of successful finds verified by the PennyCentral community. It breaks down exactly how the
          system works, what the price tags mean, and how to find these items before they disappear.
        </p>

        <EthicalDisclosure />
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
