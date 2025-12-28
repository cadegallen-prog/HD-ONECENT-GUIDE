"use client"

import { useState, useCallback } from "react"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"
import { trackEvent } from "@/lib/analytics"
import { formatSkuForDisplay } from "@/lib/sku"

interface CopySkuButtonProps {
  sku: string
  source?: "card" | "table" | "hot" | string
}

/**
 * Copy text to clipboard with iOS Safari fallback
 * Uses execCommand as fallback for older iOS Safari versions
 */
async function copyToClipboard(text: string): Promise<boolean> {
  // Try modern Clipboard API first
  if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
    try {
      await navigator.clipboard.writeText(text)
      return true
    } catch {
      // Fall through to fallback
    }
  }

  // Fallback for iOS Safari and older browsers
  try {
    const textArea = document.createElement("textarea")
    textArea.value = text
    textArea.style.position = "fixed"
    textArea.style.left = "-9999px"
    textArea.style.top = "0"
    textArea.setAttribute("readonly", "")
    document.body.appendChild(textArea)

    // iOS Safari requires selection range
    const range = document.createRange()
    range.selectNodeContents(textArea)
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
    }
    textArea.setSelectionRange(0, text.length)

    const success = document.execCommand("copy")
    document.body.removeChild(textArea)
    return success
  } catch {
    return false
  }
}

export function CopySkuButton({ sku, source = "unknown" }: CopySkuButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const success = await copyToClipboard(sku)
      if (success) {
        const skuMasked = sku.slice(-4)
        trackEvent("sku_copy", { skuMasked, source })
        setCopied(true)
        toast.success(`Copied SKU ${formatSkuForDisplay(sku)}`, {
          duration: 2000,
        })
        setTimeout(() => setCopied(false), 1500)
      } else {
        toast.error("Failed to copy SKU", { duration: 2000 })
      }
    },
    [sku, source]
  )

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-md border border-[var(--border-default)] px-3 py-2 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--cta-primary)] min-h-[44px]"
      aria-label={`Copy SKU ${sku}`}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-[var(--status-success)]" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  )
}

// Export the copy utility for reuse
export { copyToClipboard }
