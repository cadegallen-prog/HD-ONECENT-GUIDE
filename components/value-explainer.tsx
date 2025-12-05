"use client"

import { CheckCircle2 } from "lucide-react"

interface ValueExplainerProps {
  originalPrice: number
  pennyPrice?: number
  productName?: string
  showMarkdownPath?: boolean
  className?: string
}

/**
 * Value Explainer Component
 *
 * Shows the dramatic value of penny items with:
 * - Original retail price → $0.01 conversion
 * - Total savings calculation
 * - Optional markdown path visualization
 * - "Penny Achieved" status badge
 *
 * Usage:
 * <ValueExplainer originalPrice={499.99} productName="Milwaukee Drill" />
 */
export function ValueExplainer({
  originalPrice,
  pennyPrice = 0.01,
  productName,
  showMarkdownPath = false,
  className = "",
}: ValueExplainerProps) {
  const savings = originalPrice - pennyPrice
  const savingsPercent = ((savings / originalPrice) * 100).toFixed(1)

  return (
    <div className={`value-explainer ${className}`}>
      {/* Header */}
      {productName && (
        <div className="value-explainer-header">
          <span className="value-explainer-title">{productName}</span>
          <span className="badge-penny">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Penny Item
          </span>
        </div>
      )}

      {/* Price display */}
      <div className="value-explainer-prices">
        <span className="value-explainer-original">${originalPrice.toFixed(2)}</span>
        <span className="value-explainer-arrow">→</span>
        <span className="value-explainer-penny">${pennyPrice.toFixed(2)}</span>
      </div>

      {/* Markdown path visualization */}
      {showMarkdownPath && (
        <div className="markdown-path mt-4">
          <div className="markdown-step">
            <span className="markdown-price">.00</span>
          </div>
          <span className="markdown-arrow">→</span>
          <div className="markdown-step">
            <span className="markdown-price">.06</span>
          </div>
          <span className="markdown-arrow">→</span>
          <div className="markdown-step">
            <span className="markdown-price">.03</span>
          </div>
          <span className="markdown-arrow">→</span>
          <div className="markdown-step">
            <span className="markdown-price penny">$0.01</span>
          </div>
        </div>
      )}

      {/* Savings summary */}
      <div className="value-explainer-savings">
        <span className="font-semibold text-[var(--color-success)]">
          You save ${savings.toFixed(2)}
        </span>
        <span className="mx-2 text-[var(--text-muted)]">•</span>
        <span>{savingsPercent}% discount</span>
      </div>
    </div>
  )
}

/**
 * Markdown Path Component
 *
 * Shows the clearance markdown stages visually:
 * .00 → .06 → .03 → $0.01
 *
 * Use activeStage to highlight current position
 */
interface MarkdownPathProps {
  activeStage?: "00" | "06" | "03" | "01"
  className?: string
}

export function MarkdownPath({ activeStage, className = "" }: MarkdownPathProps) {
  const stages = [
    { id: "00", label: ".00", discount: "~25%" },
    { id: "06", label: ".06", discount: "~50%" },
    { id: "03", label: ".03", discount: "~75%" },
    { id: "01", label: "$0.01", discount: "Penny!" },
  ]

  return (
    <div className={`markdown-path ${className}`}>
      {stages.map((stage, index) => (
        <div key={stage.id} className="markdown-step">
          {index > 0 && <span className="markdown-arrow">→</span>}
          <span
            className={`markdown-price ${
              activeStage === stage.id ? "active" : ""
            } ${stage.id === "01" ? "penny" : ""}`}
          >
            {stage.label}
          </span>
        </div>
      ))}
    </div>
  )
}

/**
 * Penny Value Badge
 *
 * Compact badge for showing penny status
 */
interface PennyBadgeProps {
  variant?: "penny" | "clearance" | "markdown" | "info"
  children: React.ReactNode
  className?: string
}

export function PennyBadge({ variant = "penny", children, className = "" }: PennyBadgeProps) {
  const variantClasses = {
    penny: "badge-penny",
    clearance: "badge-clearance",
    markdown: "badge-markdown",
    info: "badge-info",
  }

  return <span className={`${variantClasses[variant]} ${className}`}>{children}</span>
}

/**
 * Educational Tooltip Component
 */
interface TooltipProps {
  term: string
  explanation: string
  children?: React.ReactNode
}

export function Tooltip({ term, explanation, children }: TooltipProps) {
  return (
    <span className="tooltip-trigger">
      {children || term}
      <span className="tooltip-content" role="tooltip">
        <strong className="block mb-1">{term}</strong>
        {explanation}
      </span>
    </span>
  )
}
