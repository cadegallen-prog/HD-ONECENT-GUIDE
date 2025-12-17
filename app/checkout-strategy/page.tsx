import { redirect } from "next/navigation"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout Strategy - Self-Checkout Tips for Penny Items | Penny Central",
  description:
    "Learn checkout best practices for penny items. Self-checkout tips, cashier etiquette, and how to handle pricing issues successfully.",
  keywords: [
    "penny item checkout",
    "self checkout pennies",
    "penny checkout tips",
    "home depot self checkout",
    "cashier etiquette",
    "checkout strategy",
  ],
  openGraph: {
    title: "Checkout Strategy - Self-Checkout Tips for Pennies",
    description:
      "Master the checkout process for penny items with self-checkout tips and etiquette.",
    images: ["/og-image.png"],
  },
}

export default function CheckoutRedirect() {
  redirect("/#checkout")
}
