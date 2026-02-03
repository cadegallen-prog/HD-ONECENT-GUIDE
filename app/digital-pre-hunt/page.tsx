import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Digital Pre-Hunt Tools - Scout Penny Items Before You Go | Penny Central",
  description:
    "Master digital scouting tools for penny hunting. Use the Penny List, Store Finder, and online research to plan your hunting trips effectively.",
  keywords: [
    "penny hunting tools",
    "digital scouting",
    "pre-hunt research",
    "penny list tool",
    "store finder",
    "clearance scouting",
  ],
  openGraph: {
    title: "Digital Pre-Hunt Tools - Scout Before You Go",
    description: "Learn to use digital tools to scout penny items before visiting stores.",
    images: [ogImageUrl("Digital Pre-Hunt Tools")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Digital Pre-Hunt Tools")],
  },
}

export default function DigitalPreHuntRedirect() {
  redirect("/guide/digital-pre-hunt")
}
