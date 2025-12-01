import type { Metadata } from "next"
import { GuideContent } from "@/GuideContent"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Complete Guide | Penny Central",
  description: "Master the art of finding $0.01 clearance items at Home Depot. Learn the clearance lifecycle, digital pre-hunt strategies, in-store tactics, and checkout procedures.",
}

export default function GuidePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 max-w-4xl">
      <GuideContent />

      {/* Subtle Support Callout */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-6 border border-indigo-200 dark:border-indigo-500/20 mt-12">
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          💡 <strong className="text-slate-900 dark:text-white">Tip:</strong> Shopping at Home Depot for your penny hunting trips? Use{" "}
          <a
            href="https://www.befrugal.com/rs/NJIKJUB/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            BeFrugal
          </a>{" "}
          to get cashback on your purchases.{" "}
          <Link
            href="/about#support"
            className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
          >
            Learn more
          </Link>
        </p>
      </div>
    </div>
  )
}
