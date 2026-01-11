"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, MapPin, Package, Calendar, Info, Pencil } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { US_STATES } from "@/lib/us-states"
import { normalizeSku, validateSku, formatSkuForDisplay } from "@/lib/sku"

// Get raw digits from SKU input
function getRawSku(input: string): string {
  return input.replace(/\D/g, "")
}

const USER_STATE_KEY = "pennycentral_user_state"

function ReportFindForm() {
  const searchParams = useSearchParams()
  const handledPrefillKeyRef = useRef<string | null>(null)
  const [todayIso, setTodayIso] = useState("")
  const [minDateIso, setMinDateIso] = useState("")
  const [productUrl, setProductUrl] = useState("")
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
  const [skuLocked, setSkuLocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  useEffect(() => {
    const today = new Date()
    // Format as YYYY-MM-DD (using locale that produces ISO format)
    const todayStr = today.toLocaleDateString("en-CA")
    setTodayIso(todayStr)

    // Calculate 30 days ago for min date
    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const minDateStr = thirtyDaysAgo.toLocaleDateString("en-CA")
    setMinDateIso(minDateStr)

    // Prefill with today as default
    setFormData((prev) => (prev.dateFound ? prev : { ...prev, dateFound: todayStr }))
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

  // Prefill from query params (deep-link from Penny List)
  useEffect(() => {
    const skuParam = normalizeSku(searchParams.get("sku") ?? "").slice(0, 10)
    const nameParam = (searchParams.get("name") ?? "").trim().slice(0, 75)
    const src = (searchParams.get("src") ?? "").trim().slice(0, 64)

    if (!skuParam && !nameParam) return

    const prefillKey = `${skuParam}|${nameParam}|${src}`
    if (handledPrefillKeyRef.current === prefillKey) return
    handledPrefillKeyRef.current = prefillKey

    let applied = false

    // Only prefill if current field is empty (don't overwrite user edits)
    if (skuParam && !formData.sku) {
      const formattedSku = formatSkuForDisplay(skuParam)
      setFormData((prev) => ({ ...prev, sku: skuParam }))
      setSkuDisplay(formattedSku)
      setSkuLocked(true) // Lock SKU when prefilled to prevent accidental edits
      applied = true
    }

    if (nameParam && !formData.itemName) {
      setFormData((prev) => ({ ...prev, itemName: nameParam }))
      applied = true
    }

    if (applied) {
      trackEvent("report_prefill_loaded", {
        sku: skuParam,
        name: nameParam,
        src,
      })
    }
  }, [searchParams, formData.sku, formData.itemName])

  const skuWarning =
    formData.sku.length === 10 && !formData.sku.startsWith("10")
      ? 'Receipts usually show a UPC/barcode, not a SKU. A valid 10‑digit Home Depot SKU should start with "10" (format: 10xx‑xxx‑xxx).'
      : ""

  // Extract SKU from Home Depot URL
  function extractSkuFromUrl(url: string): string | null {
    // Match patterns:
    // https://www.homedepot.com/p/product-name/1234567890
    // https://www.homedepot.com/p/1234567890
    // https://homedepot.com/p/some-product/123456
    const match = url.match(/\/p\/(?:[^/]+\/)?(\d{6,10})(?:[/?]|$)/)
    return match ? match[1] : null
  }

  const handleProductUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setProductUrl(url)

    if (!url.trim()) return

    const extracted = extractSkuFromUrl(url)
    if (extracted) {
      const normalized = normalizeSku(extracted)
      const check = validateSku(normalized)

      if (!check.error) {
        // Auto-fill SKU field
        setFormData({ ...formData, sku: normalized })
        setSkuDisplay(formatSkuForDisplay(normalized))
        setSkuError("")
      }
    }
  }

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
        setSkuLocked(false)
        setProductUrl("")
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
            Takes about 30 seconds. Required: item name, SKU, state.
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

          {/* Optional: Paste Home Depot URL */}
          <div>
            <label
              htmlFor="productUrl"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Home Depot product URL{" "}
              <span className="text-xs text-[var(--text-muted)] font-normal">
                (optional - auto-fills product details)
              </span>
            </label>
            <input
              type="url"
              id="productUrl"
              value={productUrl}
              onChange={handleProductUrlChange}
              placeholder="https://www.homedepot.com/p/product-name/1234567890"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent text-sm"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Paste a product URL to auto-fill item name and SKU
            </p>
          </div>

          {/* SKU */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="sku" className="block text-sm font-medium text-[var(--text-primary)]">
                SKU Number{" "}
                <span className="text-[var(--status-error)]" aria-hidden="true">
                  *
                </span>
                <span className="sr-only">(required)</span>
              </label>
              {skuLocked && (
                <button
                  type="button"
                  onClick={() => setSkuLocked(false)}
                  className="inline-flex items-center gap-1 text-sm text-[var(--link-default)] hover:text-[var(--link-hover)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                  aria-label="Edit SKU number"
                >
                  <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
                  Edit
                </button>
              )}
            </div>

            {/* SKU Helper (Collapsible) */}
            <details className="mb-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)]">
              <summary className="cursor-pointer px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]">
                How to find the SKU 🔍
              </summary>
              <div className="px-3 pb-3 pt-2 space-y-3">
                <p className="text-sm text-[var(--text-secondary)]">
                  The SKU is a 6 or 10-digit number found on the shelf tag or in the Home Depot app.
                </p>

                {/* Image grid - placeholder images for now */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="border border-[var(--border-default)] rounded-lg p-2">
                    <div className="aspect-video bg-[var(--bg-elevated)] rounded flex items-center justify-center text-[var(--text-muted)] text-xs">
                      [Shelf tag photo placeholder]
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Shelf tag: Look for 6-digit number
                    </p>
                  </div>
                  <div className="border border-[var(--border-default)] rounded-lg p-2">
                    <div className="aspect-video bg-[var(--bg-elevated)] rounded flex items-center justify-center text-[var(--text-muted)] text-xs">
                      [HD app screenshot placeholder]
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                      Home Depot app: Find &quot;Model #&quot; or &quot;SKU&quot;
                    </p>
                  </div>
                </div>

                <div className="text-xs text-[var(--text-muted)] space-y-1">
                  <p>
                    ✅ <strong>SKU:</strong> 6 digits (e.g., 123-456) or 10 digits starting with
                    &quot;10&quot; (e.g., 1001-234-567)
                  </p>
                  <p>
                    ❌ <strong>UPC/Barcode:</strong> Usually 12-14 digits on receipts (NOT the same
                    as SKU)
                  </p>
                </div>
              </div>
            </details>

            <input
              type="text"
              id="sku"
              required
              aria-required="true"
              aria-describedby="sku-hint"
              aria-errormessage={skuError ? "sku-error" : undefined}
              value={skuDisplay}
              onChange={handleSkuChange}
              disabled={skuLocked}
              placeholder="e.g., 123456 or 1001234567"
              className={`w-full px-4 py-2 rounded-lg border text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent font-mono ${
                skuLocked
                  ? "bg-[var(--bg-muted)] cursor-not-allowed opacity-75"
                  : "bg-[var(--bg-page)]"
              } ${skuError ? "border-[var(--status-error)]" : "border-[var(--border-default)]"}`}
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
                Use the 6‑digit shelf SKU or the Home Depot app. Receipts usually show a
                UPC/barcode, not the SKU.
              </p>
            )}
            {skuWarning && (
              <p className="mt-1 text-xs text-[var(--status-warning)] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{skuWarning}</span>
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
              aria-required="true"
              value={formData.dateFound}
              onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
              min={minDateIso || undefined}
              max={todayIso || undefined}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              When did you find this item? (within the last 30 days)
            </p>
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

          {/* Quantity (optional) */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Quantity Found{" "}
              <span className="text-xs text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              max={99}
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 3"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              How many did you find? (1-99, leave blank if unsure)
            </p>
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
              <div className="flex-1">
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {result.success
                    ? "✅ Thanks! Your find is live on the Penny List."
                    : result.message}
                </p>
                {result.success && (
                  <>
                    <p className="text-xs text-[var(--text-secondary)] mt-1">
                      Help the community by sharing your find in the Facebook group!
                    </p>
                    {/* Action CTAs */}
                    <div className="mt-3 flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          window.location.href = "/penny-list"
                        }}
                        className="flex-1"
                      >
                        View on Penny List →
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setResult(null)
                        }}
                        className="flex-1"
                      >
                        Report Another Find
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          window.open(
                            "https://www.facebook.com/groups/homedepotonecent",
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }}
                        className="flex-1"
                      >
                        Share to Facebook Group
                      </Button>
                    </div>
                  </>
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

function ReportFindSkeleton() {
  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-12 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto animate-pulse">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="h-6 w-32 bg-[var(--bg-muted)] rounded-full mx-auto mb-4" />
          <div className="h-10 w-64 bg-[var(--bg-muted)] rounded mx-auto mb-4" />
          <div className="h-5 w-80 bg-[var(--bg-muted)] rounded mx-auto" />
        </div>

        {/* Info box skeleton */}
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 mb-8">
          <div className="h-4 w-24 bg-[var(--bg-muted)] rounded mb-2" />
          <div className="h-3 w-full bg-[var(--bg-muted)] rounded mb-2" />
          <div className="h-3 w-3/4 bg-[var(--bg-muted)] rounded" />
        </div>

        {/* Form skeleton */}
        <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 space-y-6">
          {/* Field 1 */}
          <div>
            <div className="h-4 w-20 bg-[var(--bg-muted)] rounded mb-2" />
            <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
          </div>
          {/* Field 2 */}
          <div>
            <div className="h-4 w-32 bg-[var(--bg-muted)] rounded mb-2" />
            <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
          </div>
          {/* Field 3 */}
          <div>
            <div className="h-4 w-24 bg-[var(--bg-muted)] rounded mb-2" />
            <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
          </div>
          {/* Field 4 */}
          <div>
            <div className="h-4 w-16 bg-[var(--bg-muted)] rounded mb-2" />
            <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
          </div>
          {/* Submit button */}
          <div className="h-14 w-full bg-[var(--bg-muted)] rounded" />
        </div>
      </div>
    </div>
  )
}

export default function ReportFindPage() {
  return (
    <Suspense fallback={<ReportFindSkeleton />}>
      <ReportFindForm />
    </Suspense>
  )
}
