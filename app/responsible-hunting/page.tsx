import { redirect } from "next/navigation"
import { Metadata } from "next"
import { ogImageUrl } from "@/lib/og"

export const metadata: Metadata = {
  title: "Responsible Penny Hunting - Ethics and Best Practices | Penny Central",
  description:
    "Learn ethical penny hunting practices. Community guidelines, store etiquette, and responsible shopping to keep penny hunting sustainable for everyone.",
  keywords: [
    "responsible penny hunting",
    "penny hunting ethics",
    "store etiquette",
    "community guidelines",
    "ethical shopping",
    "penny hunting rules",
  ],
  openGraph: {
    title: "Responsible Penny Hunting - Ethics & Best Practices",
    description: "Learn ethical practices to keep penny hunting sustainable and respectful.",
    images: [ogImageUrl("Responsible Hunting")],
  },
  twitter: {
    card: "summary_large_image",
    images: [ogImageUrl("Responsible Hunting")],
  },
}

export default function ResponsibleRedirect() {
  redirect("/#responsible-hunting")
}
