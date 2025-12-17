import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Penny Hunting FAQ - Common Questions Answered | Penny Central",
  description:
    "Get answers to frequently asked questions about Home Depot penny items, clearance cycles, hunting strategies, and more.",
  keywords: [
    "penny hunting faq",
    "penny item questions",
    "home depot penny faq",
    "penny hunting answers",
    "clearance questions",
    "penny item help",
  ],
  openGraph: {
    title: "Penny Hunting FAQ - Your Questions Answered",
    description: "Find answers to common questions about penny hunting at Home Depot.",
    images: [ogImageUrl("Penny Hunting FAQ")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Penny Hunting FAQ")],
  },
}

export default function FAQRedirect() {
  redirect("/#faq")
}
