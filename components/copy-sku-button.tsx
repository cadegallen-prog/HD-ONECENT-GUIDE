"use client"

import { useState } from "react"
import { Copy } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface CopySkuButtonProps {
  sku: string
  source?: "card" | "table" | "hot" | string
}

export function CopySkuButton({ sku, source = "unknown" }: CopySkuButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sku)
      const skuMasked = sku.slice(-4)
      trackEvent("sku_copy", { skuMasked, source })
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error("Failed to copy SKU", error)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--cta-primary)] min-h-[44px]"
      aria-label={`Copy SKU ${sku}`}
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  )
}
