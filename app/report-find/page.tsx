"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, MapPin, Package, Calendar, Info } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { US_STATES } from "@/lib/us-states"
import { validateSku } from "@/lib/sku"

// Format SKU for display: 123456 -> 123-456, 1234567890 -> 1234-567-890
function formatSkuForDisplay(rawSku: string): string {
  const digits = rawSku.replace(/\D/g, "")
  if (digits.length <= 3) return digits
  if (digits.length <= 6) {
    return `${digits.slice(0, 3)}-${digits.slice(3)}`
  }
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }
  if (digits.length <= 10) {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`
  }
  return `${digits.slice(0, 4)}-${digits.slice(4, 7)}-${digits.slice(7, 10)}`
}

// Get raw digits from SKU input
function getRawSku(input: string): string {
  return input.replace(/\D/g, "")
}

const USER_STATE_KEY = "pennycentral_user_state"

export default function ReportFindPage() {
  const [todayIso, setTodayIso] = useState("")
  const [formData, setFormData] = useState({
    itemName: "",
    sku: "",
    storeCity: "",
    storeState: "",
    dateFound: "",
    quantity: "",
    notes: "",
    website: "",
  })

  const [skuDisplay, setSkuDisplay] = useState("")
  const [skuError, setSkuError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA")
    setTodayIso(today)
    setFormData((prev) => (prev.dateFound ? prev : { ...prev, dateFound: today }))
  }, [])

  // Prefill state from user's last selection (saved on Penny List or here)
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(USER_STATE_KEY)
      if (!savedState) return
      setFormData((prev) => (prev.storeState ? prev : { ...prev, storeState: savedState }))
    } catch {
      // ignore storage failures
    }
  }, [])

  // Persist selected state for next time
  useEffect(() => {
    if (!formData.storeState) return
    try {
      localStorage.setItem(USER_STATE_KEY, formData.storeState)
    } catch {
      // ignore storage failures
    }
  }, [formData.storeState])

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const rawDigits = getRawSku(input)

    // Limit to 10 digits max
    const limitedDigits = rawDigits.slice(0, 10)

    // Update display with formatting
    setSkuDisplay(formatSkuForDisplay(limitedDigits))

    // Store raw digits
    setFormData({ ...formData, sku: limitedDigits })

    // Validate and show error if needed
    if (limitedDigits.length < 6) {
      setSkuError("")
      return
    }
    const check = validateSku(limitedDigits)
    setSkuError(check.error || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final SKU validation
    const skuCheck = validateSku(formData.sku)
    if (skuCheck.error) {
      setSkuError(skuCheck.error)
      return
    }

    setSubmitting(true)
    setResult(null)

    try {
      const response = await fetch("/api/submit-find", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Track successful submission
        trackEvent("find_submit", {
          event_label: "success",
          value: 1,
        })
        setResult({
          success: true,
          message: data.message,
        })
        // Reset form
        const today = todayIso || new Date().toLocaleDateString("en-CA")
        setFormData({
          itemName: "",
          sku: "",
          storeCity: "",
          storeState: "",
          dateFound: today,
          quantity: "",
          notes: "",
          website: "",
        })
        setSkuDisplay("")
        setSkuError("")
      } else {
        setResult({
          success: false,
          message: data.error || "Something went wrong. Please try again.",
        })
      }
    } catch {
      setResult({
        success: false,
        message: "Network error. Please check your connection and try again.",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="pill pill-muted mx-auto w-fit mb-4 inline-flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--status-info)]" aria-hidden="true" />
            Help the Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Report a Penny Find
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Takes about 30 seconds. Required: item name, SKU, state, quantity.
          </p>
        </div>

        {/* Info Box */}
        <div className="rounded-lg border border-[var(--border-default)] border-l-4 border-l-[var(--status-info)] bg-[var(--bg-elevated)] p-4 mb-8 flex gap-3 items-start">
          <Info className="w-5 h-5 text-[var(--status-info)] flex-shrink-0 mt-0.5" />
          <div className="text-sm text-[var(--text-secondary)]">
            <p className="font-semibold mb-2">About This Form</p>
            <p className="mb-2">
              Your report shows up on the Penny List automatically (usually within an hour).
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Submissions are not individually confirmed.</li>
              <li>The Penny List may contain mistakes, sold-out items, or prices that changed.</li>
              <li>
                For proof-of-purchase posts with receipts and discussion, always use the Facebook
                group.
              </li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 space-y-6"
        >
          {/* Item Name */}
          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Item Name{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="itemName"
              required
              aria-required="true"
              maxLength={75}
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              placeholder="e.g., Milwaukee Drill Set, Ryobi Battery Pack"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              What is the item? (max 75 characters)
            </p>
          </div>

          {/* SKU */}
          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              SKU Number{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="text"
              id="sku"
              required
              aria-required="true"
              aria-describedby="sku-hint"
              aria-errormessage={skuError ? "sku-error" : undefined}
              value={skuDisplay}
              onChange={handleSkuChange}
              placeholder="e.g., 123456 or 1001234567"
              className={`w-full px-4 py-2 rounded-lg border bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent font-mono ${
                skuError ? "border-[var(--status-error)]" : "border-[var(--border-default)]"
              }`}
            />
            {skuError ? (
              <p
                id="sku-error"
                className="mt-1 text-xs text-[var(--status-error)] flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3" />
                {skuError}
              </p>
            ) : (
              <p id="sku-hint" className="mt-1 text-xs text-[var(--text-muted)]">
                6 or 10 digit SKU from receipt or Home Depot app
              </p>
            )}
          </div>

          {/* Honeypot field for bots */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* State (required) */}
          <div>
            <label
              htmlFor="storeState"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              State{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <select
              id="storeState"
              required
              aria-required="true"
              value={formData.storeState}
              onChange={(e) => setFormData({ ...formData, storeState: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            >
              <option value="">Select state...</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              We use state to show regional patterns.
            </p>
          </div>

          {/* Date Found */}
          <div>
            <label
              htmlFor="dateFound"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Date Found <span className="text-[var(--status-error)]">*</span>
            </label>
            <input
              type="date"
              id="dateFound"
              required
              value={formData.dateFound}
              onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
              max={todayIso || undefined}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          {/* Optional details (collapsed by default) */}
          <details className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--text-primary)]">
              Add optional details (city, notes)
            </summary>
            <div className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="storeCity"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                >
                  City (optional)
                </label>
                <input
                  type="text"
                  id="storeCity"
                  value={formData.storeCity}
                  onChange={(e) => setFormData({ ...formData, storeCity: e.target.value })}
                  placeholder="e.g., Tampa"
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-[var(--text-primary)] mb-2"
                >
                  Additional Notes (optional)
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g., Found in clearance aisle, back corner near garden..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent resize-none"
                />
              </div>
            </div>
          </details>

          {/* Quantity (required) */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Quantity Found{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(required)</span>
            </label>
            <input
              type="number"
              id="quantity"
              required
              aria-required="true"
              min={1}
              max={99}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 3"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">How many did you find? (1-99)</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting || !!skuError}
            className="w-full bg-[var(--cta-primary)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] py-6 text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit Find"}
          </Button>

          {/* Result Message */}
          {result && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border border-[var(--border-default)] border-l-4 bg-[var(--bg-elevated)] ${
                result.success
                  ? "border-l-[var(--status-success)]"
                  : "border-l-[var(--status-error)]"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-[var(--status-error)] flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    result.success ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"
                  }`}
                >
                  {result.message}
                </p>
                {result.success && (
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    Please post your haul with receipt photos in the Facebook group so the community
                    can confirm this find.
                  </p>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
          <p>
            Submissions appear on the Penny List automatically. The Facebook group is the gold
            standard for receipt photos and discussion to confirm a find.
          </p>
        </div>
      </div>
    </div>
  )
}
