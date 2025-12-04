import type { Metadata } from "next"
import { GuideContent } from "@/components/GuideContent"
import { SupportAndCashbackCard } from "@/components/SupportAndCashbackCard"

export const metadata: Metadata = {
  title: "Complete Guide | Penny Central",
  description: "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
}

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      <GuideContent />

      {/* Support Card */}
      <SupportAndCashbackCard className="mt-12" />
    </div>
  )
}
