"use client"

import { cn } from "@/lib/utils"
import { trackEvent } from "@/lib/analytics"

interface SupportAndCashbackCardProps {
  className?: string
}

export function SupportAndCashbackCard({ className }: SupportAndCashbackCardProps) {
  return (
    <div
      className={cn(
        "bg-[var(--bg-card)] dark:bg-[var(--bg-card)] rounded-xl p-6 border border-[var(--border-default)] border-l-4 border-l-[var(--border-strong)]",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
        Support the Site (Optional)
      </h3>

      <div className="text-sm text-[var(--text-secondary)] space-y-3 mb-5">
        <p>
          Penny Central stays ad-free on purpose. If the guides saved you time or gas money, here
          are two low-effort ways to keep it running:
        </p>

        <ul className="list-disc pl-5 space-y-1">
          <li>
            Activate free cashback with BeFrugal before normal purchases. When you earn $10+ in
            cashback, they send me a referral bonus (no extra cost to you).
          </li>
          <li>
            Buy me a coffee via PayPal if the playbook helped you score a haul. It goes straight to
            hosting, map APIs, and testing runs.
          </li>
        </ul>

        <p className="text-xs text-[var(--text-muted)]">
          BeFrugal doesn&apos;t reveal penny items. It only levels up the everyday orders{" "}
          you&apos;re already placing.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="/go/befrugal"
          target="_blank"
          rel="noopener noreferrer"
          data-cta="befrugal"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--cta-primary)] hover:bg-[var(--cta-hover)] text-white text-sm font-medium rounded-lg shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-colors"
          onClick={() =>
            trackEvent("affiliate_click", { surface: "support-card", linkId: "befrugal" })
          }
        >
          Activate BeFrugal Cashback
        </a>
        <a
          href="https://paypal.me/cadegallen"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2.5 bg-[var(--bg-elevated)] dark:bg-[var(--bg-hover)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] text-sm font-medium rounded-lg border border-[var(--border-default)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-colors"
          onClick={() => trackEvent("coffee_click", { surface: "support-card" })}
        >
          Buy Me a Coffee (optional tip)
        </a>
      </div>
    </div>
  )
}
