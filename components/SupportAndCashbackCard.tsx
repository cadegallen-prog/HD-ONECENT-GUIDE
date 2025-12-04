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
          Keeping this site running, testing deals, and building new tools takes time and money.
        </p>

        <p>If you want to support the project without paying anything extra, you can:</p>

        <ul className="list-disc pl-5 space-y-1">
          <li>
            Turn on free cashback with BeFrugal before you check out at stores like Home Depot,
            Lowe&apos;s, Sam&apos;s Club, Amazon, and more
          </li>
          <li>
            Toss a small tip into the PayPal coffee fund if the guides saved you serious time or
            money
          </li>
        </ul>

        <p className="text-xs text-stone-400 dark:text-stone-400">
          BeFrugal does not show or unlock penny items. Penny items are in store only. This is just
          a quiet way to get a bit back on the normal stuff you are already buying.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/go/befrugal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-cta-primary hover:bg-cta-hover text-white text-sm font-medium rounded-lg transition-colors"
        >
          Get Cashback with BeFrugal
        </a>
        <a
          href="https://paypal.me/cadegallen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-sm font-medium rounded-lg transition-colors border border-stone-300 dark:border-stone-600"
        >
          Leave a Tip
        </a>
      </div>
    </div>
  )
}
