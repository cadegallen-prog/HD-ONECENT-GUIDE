"use client"

import { trackEvent } from "@/lib/analytics"
import { BEFRUGAL_REFERRAL_PATH } from "@/lib/constants"

export function ResourcesSupportCtas() {
  return (
    <section className="mt-8 grid gap-3 sm:grid-cols-2">
      <a
        href="https://paypal.me/cadegallen"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("coffee_click", { surface: "resources" })}
        className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-default)] text-[var(--text-primary)] font-semibold min-h-[44px] hover:border-[var(--border-strong)] hover:-translate-y-[1px] hover:shadow-card-hover transition-colors transition-transform duration-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      >
        Buy me a coffee — if the guide saved you time.
      </a>
      <a
        href={BEFRUGAL_REFERRAL_PATH}
        target="_blank"
        rel="noopener noreferrer"
        data-cta="befrugal"
        onClick={() => trackEvent("affiliate_click", { surface: "resources", linkId: "befrugal" })}
        className="inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold min-h-[44px] hover:bg-[var(--cta-hover)] hover:-translate-y-[1px] hover:shadow-card-hover transition-colors transition-transform duration-120 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
      >
        Activate BeFrugal cashback — supports Penny Central at no extra cost.
      </a>
    </section>
  )
}
