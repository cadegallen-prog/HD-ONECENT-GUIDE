import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Trip Tracker - Plan Your Penny Hunting Trips | Penny Central",
  description:
    "Plan and track your Home Depot penny hunting trips. Create checklists, add stores, track success rates, and organize your penny finds efficiently.",
  keywords: [
    "penny hunting trip planner",
    "home depot hunting tracker",
    "penny trip checklist",
    "clearance hunting organizer",
    "penny hunting schedule",
    "trip planning tool",
  ],
  openGraph: {
    title: "Trip Tracker - Plan Your Penny Hunting Trips",
    description:
      "Organize your penny hunting trips with checklists, store lists, and success tracking.",
    images: [ogImageUrl("Trip Tracker")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Trip Tracker")],
  },
}

export default function TripTrackerLayout({ children }: { children: React.ReactNode }) {
  return children
}
