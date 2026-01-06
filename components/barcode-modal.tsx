"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { X } from "lucide-react"
import { formatCurrency } from "@/lib/penny-list-utils"

interface BarcodeModalProps {
  open: boolean
  upc: string
  onClose: () => void
  productName?: string
  pennyPrice?: number
}

function computeModulo10Checksum(digits: string, weightOddFromRight: number): number {
  let sum = 0
  for (let i = digits.length - 1; i >= 0; i -= 1) {
    const digit = digits.charCodeAt(i) - 48
    if (digit < 0 || digit > 9) return NaN
    const positionFromRight = digits.length - i
    const weight = positionFromRight % 2 === 1 ? weightOddFromRight : 1
    sum += digit * weight
  }
  const mod = sum % 10
  return (10 - mod) % 10
}

function isValidUpcA12(value: string): boolean {
  if (!/^\d{12}$/.test(value)) return false
  const expected = computeModulo10Checksum(value.slice(0, 11), 3)
  const actual = Number(value[11])
  return Number.isFinite(expected) && expected === actual
}

function isValidEan13(value: string): boolean {
  if (!/^\d{13}$/.test(value)) return false
  const expected = computeModulo10Checksum(value.slice(0, 12), 3)
  const actual = Number(value[12])
  return Number.isFinite(expected) && expected === actual
}

export function BarcodeModal({ open, upc, onClose, productName, pennyPrice }: BarcodeModalProps) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const formattedPrice =
    typeof pennyPrice === "number" && Number.isFinite(pennyPrice)
      ? formatCurrency(pennyPrice)
      : null

  useEffect(() => {
    if (!open || !upc || !svgRef.current) return
    let cancelled = false

    import("jsbarcode").then((module) => {
      if (cancelled) return

      const element = svgRef.current!
      while (element.firstChild) element.removeChild(element.firstChild)

      const rawValue = upc.trim()
      const compact = rawValue.replace(/\s+/g, "")
      const digitsOnly = /^\d+$/.test(compact)
      const digitValue = digitsOnly ? compact : rawValue

      const baseOptions = {
        displayValue: true,
        width: 2,
        height: 90,
        margin: 10,
        lineColor: "#000000",
      } as const

      const tryRender = (value: string, format: "UPC" | "EAN13" | "CODE128") => {
        module.default(element, value, { ...baseOptions, format })
      }

      try {
        if (digitsOnly && digitValue.length === 11) {
          tryRender(digitValue, "UPC")
          return
        }

        if (digitsOnly && digitValue.length === 12 && isValidUpcA12(digitValue)) {
          tryRender(digitValue, "UPC")
          return
        }

        if (digitsOnly && digitValue.length === 13 && isValidEan13(digitValue)) {
          tryRender(digitValue, "EAN13")
          return
        }

        // Fall back to CODE128 for invalid/unknown formats so we always show a scannable barcode.
        tryRender(digitValue, "CODE128")
      } catch (error) {
        // JsBarcode throws on invalid UPC/EAN check digits. Ensure we still render something.
        console.warn("Failed to render barcode; falling back to CODE128", error)
        try {
          tryRender(digitValue, "CODE128")
        } catch (nested) {
          console.warn("Failed to render fallback CODE128 barcode", nested)
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [open, upc])

  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", handleKey)

    return () => {
      document.body.style.overflow = originalOverflow
      document.removeEventListener("keydown", handleKey)
    }
  }, [open, onClose])

  if (!open || !upc || typeof document === "undefined") return null

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 bg-[var(--bg-hover)] opacity-80"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="barcode-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-w-md rounded-t-2xl border border-[var(--border-default)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow-card)] sm:rounded-2xl">
          <button
            type="button"
            onClick={() => onClose()}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            aria-label="Close barcode"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
          <div className="space-y-1 pr-8">
            <h2
              id="barcode-modal-title"
              className="text-lg font-semibold text-[var(--text-primary)]"
            >
              Scan this UPC
            </h2>
            {productName && (
              <p
                className="text-sm font-medium text-[var(--text-primary)] truncate"
                title={productName}
              >
                {productName}
              </p>
            )}
            {formattedPrice && (
              <p className="text-xs text-[var(--text-secondary)]">Penny price {formattedPrice}</p>
            )}
            {!productName && !formattedPrice && (
              <p className="text-xs text-[var(--text-secondary)]">
                Show this to a cashier or scanner app
              </p>
            )}
          </div>
          <div className="mt-5 rounded-2xl border border-[var(--border-default)] bg-white p-4 text-center">
            <svg ref={svgRef} className="mx-auto h-24 w-full" aria-hidden="true" />
          </div>
          <p className="mt-3 text-center text-sm font-mono text-[var(--text-secondary)]">{upc}</p>
          <button
            type="button"
            onClick={() => onClose()}
            className="mt-5 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-muted)] px-4 py-3 text-sm font-semibold text-[var(--text-primary)] transition hover:border-[var(--cta-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          >
            Close
          </button>
        </div>
      </div>
    </>,
    document.body
  )
}
