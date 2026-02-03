import type { Metadata } from "next"
import { ClearanceLifecycle } from "@/components/guide/sections/ClearanceLifecycle"
import { GuideNav } from "@/components/guide/GuideNav"

export const metadata: Metadata = {
  title: "Understanding the Clearance Lifecycle | Home Depot Penny Guide",
  description:
    "Learn how Home Depot's price drop system works, from full retail to clearance to the final penny markdown.",
}

export default function ClearanceLifecyclePage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
          Understanding the Clearance Lifecycle
        </h1>
        <p className="text-xl text-[var(--text-secondary)]">
          The journey from full price to $0.01 follows a predictable pattern. Here's how to spot it.
        </p>
      </div>

      <ClearanceLifecycle />

      <GuideNav
        next={{
          label: "Pre-Hunt Intelligence",
          href: "/guide/digital-pre-hunt",
        }}
      />
    </div>
  )
}
