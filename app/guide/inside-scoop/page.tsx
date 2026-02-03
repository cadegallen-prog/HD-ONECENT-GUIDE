import type { Metadata } from "next"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { InsideScoop } from "@/components/guide/sections/InsideScoop"
import { GuideNav } from "@/components/guide/GuideNav"

export const metadata: Metadata = {
  title: "Inside Home Depot Operations | Penny Item Secrets",
  description:
    "The inside scoop on how ZMA, MOS, and internal store policies act against penny hunters.",
}

export default function InsideScoopPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          The Inside Scoop: Internal Ops
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          Understand the "why" behind policies, ZMA, and why stores try to stop penny sales.
        </p>
      </div>

      <EthicalDisclosure />

      <InsideScoop />

      <GuideNav
        prev={{
          label: "In-Store Strategy",
          href: "/guide/in-store-strategy",
        }}
        next={{
          label: "Fact vs. Fiction",
          href: "/guide/fact-vs-fiction",
        }}
      />
    </div>
  )
}
