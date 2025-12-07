"use client"

import { useState } from "react"
import { Copy } from "lucide-react"

interface CopySkuButtonProps {
  sku: string
}

export function CopySkuButton({ sku }: CopySkuButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sku)
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
      className="inline-flex items-center gap-1 rounded-md border border-[var(--border-default)] px-2 py-1 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--cta-primary)]"
      aria-label={`Copy SKU ${sku}`}
    >
      <Copy className="h-3.5 w-3.5" />
      {copied ? "Copied" : "Copy"}
    </button>
  )
}
