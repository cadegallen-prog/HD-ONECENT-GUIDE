"use client"

import { cn } from "@/lib/utils"

interface SupportAndCashbackCardProps {
  className?: string
}

export function SupportAndCashbackCard({ className }: SupportAndCashbackCardProps) {
  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
        Stack Extra Savings (Optional)
      </h3>

      <div className="text-sm text-slate-600 dark:text-slate-400 space-y-3 mb-5">
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
            Toss a small tip into the PayPal coffee fund if the guides saved you serious time or money
          </li>
        </ul>

        <p className="text-xs text-slate-500 dark:text-slate-500">
          BeFrugal does not show or unlock penny items. Penny items are in store only. This is just
          a quiet way to get a bit back on the normal stuff you are already buying.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://www.befrugal.com/rs/NJIKJUB/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Activate BeFrugal Cashback
        </a>
        <a
          href="https://paypal.me/cadegallen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors"
        >
          Tip via PayPal
        </a>
      </div>
    </div>
  )
}
