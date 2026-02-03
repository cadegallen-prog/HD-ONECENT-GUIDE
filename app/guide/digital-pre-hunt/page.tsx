import type { Metadata } from "next"
import { EthicalDisclosure } from "@/components/guide/EthicalDisclosure"
import { DigitalPreHunt } from "@/components/guide/sections/DigitalPreHunt"
import { GuideNav } from "@/components/guide/GuideNav"

export const metadata: Metadata = {
  title: "Pre-Hunt Intelligence & Tools | Home Depot Penny Guide",
  description:
    "Use digital tools and the Home Depot app to scout penny items before you even leave your house.",
}

export default function DigitalPreHuntPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Pre-Hunt Intelligence
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          Don't drive blind. Use digital tools to scout your local store inventory first.
        </p>
      </div>

      <EthicalDisclosure />

      <DigitalPreHunt />

      <GuideNav
        prev={{
          label: "Clearance Lifecycle",
          href: "/guide/clearance-lifecycle",
        }}
        next={{
          label: "In-Store Strategy",
          href: "/guide/in-store-strategy",
        }}
      />
    </div>
  )
}
