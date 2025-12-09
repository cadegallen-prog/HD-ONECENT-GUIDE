"use client"

import { cn } from "@/lib/utils"

interface SupportAndCashbackCardProps {
  className?: string
}

export function SupportAndCashbackCard({ className }: SupportAndCashbackCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-stone-800 rounded-xl p-6 border-l-4 border-brand-copper border-t border-r border-b border-stone-200 dark:border-stone-700",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-3">
        Support the Site (Optional)
      </h3>

      <div className="text-sm text-stone-600 dark:text-stone-400 space-y-3 mb-5">
        <p>
          Penny Central stays ad-free on purpose. If the guides saved you time or gas money, here
          are two low-effort ways to keep it running:
        </p>

        <ul className="list-disc pl-5 space-y-1">
          <li>
            Activate free cashback with BeFrugal before normal purchases. When you earn $10+ in
            cashback, they send me a referral bonus.
          </li>
          <li>
            Buy me a coffee via PayPal if the playbook helped you score a haul. It goes straight to
            hosting, map APIs, and testing runs.
          </li>
        </ul>

        <p className="text-xs text-stone-400 dark:text-stone-400">
          BeFrugal doesn&apos;t reveal penny items. It only levels up the everyday orders{" "}
          you&apos;re already placing.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/go/befrugal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-cta-primary hover:bg-cta-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          Activate BeFrugal Cashback
        </a>
        <a
          href="https://paypal.me/cadegallen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-sm font-medium rounded-lg transition-colors border border-stone-300 dark:border-stone-600"
        >
          Buy Me a Coffee
        </a>
      </div>
    </div>
  )
}
