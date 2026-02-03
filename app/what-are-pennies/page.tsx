import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "What Are Penny Items? - Home Depot $0.01 Clearance Explained | Penny Central",
  description:
    "Learn what Home Depot penny items are, how they work, and why products get marked down to $0.01. Complete introduction to penny hunting.",
  keywords: [
    "what are penny items",
    "home depot one cent items",
    "penny clearance explained",
    "0.01 items home depot",
    "penny hunting intro",
  ],
  openGraph: {
    title: "What Are Penny Items? - Home Depot $0.01 Clearance Explained",
    description: "Learn what Home Depot penny items are and how the $0.01 clearance system works.",
    images: [ogImageUrl("What Are Penny Items?")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("What Are Penny Items?")],
  },
}

export default function WhatArePenniesRedirect() {
  redirect("/guide/inside-scoop")
}
