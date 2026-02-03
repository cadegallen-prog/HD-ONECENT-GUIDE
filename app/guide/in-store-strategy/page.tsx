import type { Metadata } from "next"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { InStoreStrategy } from "@/components/guide/sections/InStoreStrategy"
import { GuideNav } from "@/components/guide/GuideNav"

export const metadata: Metadata = {
  title: "In-Store Penny Hunting Strategy | Home Depot Penny Guide",
  description:
    "Master the in-store hunt: where to look, how to scan discreetly, and how to verify prices without alerting staff.",
}

export default function InStoreStrategyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          In-Store Hunting Strategy
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          You're in the store. Here's where to look, how to verify prices, and how to checkout
          successfully.
        </p>
      </div>

      <EthicalDisclosure />

      <InStoreStrategy />

      <GuideNav
        prev={{
          label: "Pre-Hunt Intelligence",
          href: "/guide/digital-pre-hunt",
        }}
        next={{
          label: "The Inside Scoop",
          href: "/guide/inside-scoop",
        }}
      />
    </div>
  )
}
