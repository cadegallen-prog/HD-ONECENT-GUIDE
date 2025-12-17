import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Facts vs Myths - Penny Hunting Misconceptions Debunked | Penny Central",
  description:
    "Separate penny hunting facts from fiction. Debunk common myths, understand the truth about penny items, and avoid misinformation.",
  keywords: [
    "penny hunting myths",
    "penny item facts",
    "penny misconceptions",
    "penny hunting truth",
    "debunking penny myths",
    "penny hunting reality",
  ],
  openGraph: {
    title: "Facts vs Myths - Penny Hunting Misconceptions Debunked",
    description: "Learn the truth about penny hunting and avoid common misconceptions.",
    images: [ogImageUrl("Facts vs Myths")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Facts vs Myths")],
  },
}

export default function FactsRedirect() {
  redirect("/#fact-vs-fiction")
}
