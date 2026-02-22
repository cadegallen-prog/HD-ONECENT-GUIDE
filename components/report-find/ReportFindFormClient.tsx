"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, Calendar, Info, PlusCircle, Trash2 } from "lucide-react"
import { trackEvent } from "@/lib/analytics"
import { US_STATES } from "@/lib/us-states"
import { normalizeSku, validateSku, formatSkuForDisplay } from "@/lib/sku"
import { copyToClipboard } from "@/components/copy-sku-button"

function getRawSku(input: string): string {
  return input.replace(/\D/g, "")
}

function ordinal(n: number): string {
  const suffixes = ["th", "st", "nd", "rd"]
  const value = n % 100
  return `${n}${suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]}`
}

const USER_STATE_KEY = "pennycentral_user_state"
const BASKET_STORAGE_KEY = "pc_report_basket_v1"
const PREFILL_VISIT_KEY = "pc_report_prefill_seen_v1"

type BasketItem = {
  sku: string
  itemName: string
  quantity: number | null
  addedVia: "manual" | "prefill"
}

type SubmitFailure = {
  item: BasketItem
  message: string
}

type SubmitResult = {
  attempted: number
  successCount: number
  failed: SubmitFailure[]
  stats?: {
    totalReports: number
    stateCount: number
    isFirstReport: boolean
  }
}

function readBasketFromSessionStorage(): BasketItem[] {
  try {
    const raw = sessionStorage.getItem(BASKET_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((entry): BasketItem | null => {
        if (!entry || typeof entry !== "object") return null

        const item = entry as Partial<BasketItem>
        const sku = normalizeSku(String(item.sku ?? "")).slice(0, 10)
        const itemName = String(item.itemName ?? "")
          .trim()
          .slice(0, 75)
        const addedVia = item.addedVia === "prefill" ? "prefill" : "manual"

        let quantity: number | null = null
        if (typeof item.quantity === "number" && Number.isFinite(item.quantity)) {
          const normalizedQty = Math.max(1, Math.min(99, Math.round(item.quantity)))
          quantity = normalizedQty
        }

        if (!sku || !itemName) return null

        return { sku, itemName, quantity, addedVia }
      })
      .filter((entry): entry is BasketItem => entry !== null)
  } catch {
    return []
  }
}

function writeBasketToSessionStorage(basket: BasketItem[]): void {
  try {
    sessionStorage.setItem(BASKET_STORAGE_KEY, JSON.stringify(basket))
  } catch {
    // Ignore storage failures.
  }
}

function parseDraftQuantity(value: string): { quantity: number | null; error?: string } {
  const trimmed = value.trim()
  if (!trimmed) return { quantity: null }

  const qty = Number.parseInt(trimmed, 10)
  if (Number.isNaN(qty) || qty < 1 || qty > 99) {
    return { quantity: null, error: "Quantity must be between 1 and 99." }
  }

  return { quantity: qty }
}

function effectiveQuantity(item: BasketItem): number {
  return item.quantity ?? 1
}

function ReportFindForm() {
  const searchParams = useSearchParams()
  const trackedReportOpenRef = useRef(false)
  const basketHydratedRef = useRef(false)
  const [todayIso, setTodayIso] = useState("")
  const [minDateIso, setMinDateIso] = useState("")

  const [sharedData, setSharedData] = useState({
    storeCity: "",
    storeState: "",
    dateFound: "",
    website: "",
  })

  const [draft, setDraft] = useState({
    itemName: "",
    sku: "",
    quantity: "",
  })

  const [basket, setBasket] = useState<BasketItem[]>([])
  const [skuDisplay, setSkuDisplay] = useState("")
  const [skuError, setSkuError] = useState("")
  const [addFeedback, setAddFeedback] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<SubmitResult | null>(null)
  const [lastSuccessfulItems, setLastSuccessfulItems] = useState<BasketItem[]>([])
  const [copyFeedback, setCopyFeedback] = useState("")

  useEffect(() => {
    const today = new Date()
    const todayStr = today.toLocaleDateString("en-CA")
    setTodayIso(todayStr)

    const thirtyDaysAgo = new Date(today)
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const minDateStr = thirtyDaysAgo.toLocaleDateString("en-CA")
    setMinDateIso(minDateStr)

    setSharedData((prev) => (prev.dateFound ? prev : { ...prev, dateFound: todayStr }))
  }, [])

  useEffect(() => {
    try {
      const savedState = localStorage.getItem(USER_STATE_KEY)
      if (!savedState) return
      setSharedData((prev) => (prev.storeState ? prev : { ...prev, storeState: savedState }))
    } catch {
      // Ignore storage failures.
    }
  }, [])

  useEffect(() => {
    if (!sharedData.storeState) return
    try {
      localStorage.setItem(USER_STATE_KEY, sharedData.storeState)
    } catch {
      // Ignore storage failures.
    }
  }, [sharedData.storeState])

  useEffect(() => {
    const restoredBasket = readBasketFromSessionStorage()
    setBasket(restoredBasket)
    basketHydratedRef.current = true
  }, [])

  useEffect(() => {
    if (!basketHydratedRef.current) return
    writeBasketToSessionStorage(basket)
  }, [basket])

  useEffect(() => {
    if (trackedReportOpenRef.current) return
    trackedReportOpenRef.current = true

    const src = (searchParams.get("src") ?? "direct").trim().slice(0, 64)
    trackEvent("report_open", { ui_source: src || "direct" })
  }, [searchParams])

  useEffect(() => {
    if (!basketHydratedRef.current) return

    const skuParam = normalizeSku(searchParams.get("sku") ?? "").slice(0, 10)
    const nameParam = (searchParams.get("name") ?? "").trim().slice(0, 75)
    const src = (searchParams.get("src") ?? "direct").trim().slice(0, 64)

    if (!skuParam || !nameParam) return

    const visitMarker = `${PREFILL_VISIT_KEY}:${skuParam}:${nameParam}:${src}`

    try {
      if (sessionStorage.getItem(visitMarker) === "1") return
    } catch {
      // Ignore storage failures.
    }

    let added = false
    setBasket((prev) => {
      if (prev.some((item) => item.sku === skuParam)) return prev
      added = true
      return [...prev, { sku: skuParam, itemName: nameParam, quantity: null, addedVia: "prefill" }]
    })

    if (!added) return

    try {
      sessionStorage.setItem(visitMarker, "1")
    } catch {
      // Ignore storage failures.
    }

    setAddFeedback({ type: "success", message: "Prefilled item added to basket." })
    trackEvent("report_prefill_loaded", {
      ui_source: src || "direct",
      skuMasked: skuParam.slice(-4),
      hasItemName: true,
    })
    trackEvent("item_add_prefill", {
      ui_source: src || "direct",
      skuMasked: skuParam.slice(-4),
    })
  }, [searchParams])

  const skuWarning =
    draft.sku.length === 10 && !draft.sku.startsWith("10")
      ? 'Receipts usually show a UPC/barcode, not a SKU. A valid 10-digit Home Depot SKU should start with "10" (format: 10xx-xxx-xxx).'
      : ""

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const rawDigits = getRawSku(input)
    const limitedDigits = rawDigits.slice(0, 10)

    setSkuDisplay(formatSkuForDisplay(limitedDigits))
    setDraft((prev) => ({ ...prev, sku: limitedDigits }))

    if (limitedDigits.length < 6) {
      setSkuError("")
      return
    }

    const check = validateSku(limitedDigits)
    setSkuError(check.error || "")
  }

  const handleAddItem = () => {
    setAddFeedback(null)
    setResult(null)
    setCopyFeedback("")

    const itemName = draft.itemName.trim().slice(0, 75)
    if (!itemName) {
      setAddFeedback({ type: "error", message: "Item name is required." })
      return
    }

    const skuCheck = validateSku(draft.sku)
    if (skuCheck.error) {
      setSkuError(skuCheck.error)
      setAddFeedback({ type: "error", message: skuCheck.error })
      return
    }

    const quantityCheck = parseDraftQuantity(draft.quantity)
    if (quantityCheck.error) {
      setAddFeedback({ type: "error", message: quantityCheck.error })
      return
    }

    const normalizedSku = skuCheck.normalized
    const incomingQuantity = quantityCheck.quantity

    let merged = false
    let mergedQuantity = 0

    setBasket((prev) => {
      const existingIndex = prev.findIndex((item) => item.sku === normalizedSku)

      if (existingIndex === -1) {
        return [
          ...prev,
          {
            sku: normalizedSku,
            itemName,
            quantity: incomingQuantity,
            addedVia: "manual",
          },
        ]
      }

      merged = true
      const existing = prev[existingIndex]
      const nextQuantity = Math.min(99, effectiveQuantity(existing) + (incomingQuantity ?? 1))
      mergedQuantity = nextQuantity

      const next = [...prev]
      next[existingIndex] = {
        ...existing,
        itemName,
        quantity: nextQuantity,
        addedVia: "manual",
      }
      return next
    })

    if (merged) {
      setAddFeedback({
        type: "success",
        message: `Duplicate SKU merged. Quantity updated to ${mergedQuantity}.`,
      })
      trackEvent("item_add_manual", {
        ui_source: "report-find-manual",
        merged_duplicate: true,
        skuMasked: normalizedSku.slice(-4),
        quantity: mergedQuantity,
      })
    } else {
      setAddFeedback({ type: "success", message: "Item added to basket." })
      trackEvent("item_add_manual", {
        ui_source: "report-find-manual",
        merged_duplicate: false,
        skuMasked: normalizedSku.slice(-4),
        hasQuantity: incomingQuantity !== null,
      })
    }

    setDraft({ itemName: "", sku: "", quantity: "" })
    setSkuDisplay("")
    setSkuError("")
  }

  const removeBasketItem = (sku: string) => {
    setBasket((prev) => prev.filter((item) => item.sku !== sku))
  }

  const handleSubmitAll = async (e: React.FormEvent) => {
    e.preventDefault()

    if (basket.length === 0) {
      setAddFeedback({ type: "error", message: "Add at least one item before submitting." })
      return
    }

    if (!sharedData.storeState) {
      setAddFeedback({ type: "error", message: "State is required." })
      return
    }

    if (!sharedData.dateFound) {
      setAddFeedback({ type: "error", message: "Date found is required." })
      return
    }

    setSubmitting(true)
    setResult(null)
    setCopyFeedback("")

    const failures: SubmitFailure[] = []
    const successes: BasketItem[] = []
    let firstStats: SubmitResult["stats"]

    for (const item of basket) {
      const payload = {
        itemName: item.itemName,
        sku: item.sku,
        storeCity: sharedData.storeCity,
        storeState: sharedData.storeState,
        dateFound: sharedData.dateFound,
        quantity: item.quantity !== null ? String(item.quantity) : "",
        website: sharedData.website,
      }

      try {
        const response = await fetch("/api/submit-find", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })

        const data = await response.json()

        if (response.ok) {
          successes.push(item)
          if (!firstStats && data?.stats) {
            firstStats = data.stats as SubmitResult["stats"]
          }
          trackEvent("find_submit", { event_label: "success", value: 1 })
          continue
        }

        failures.push({
          item,
          message: data?.error || "Something went wrong. Please try again.",
        })
      } catch {
        failures.push({
          item,
          message: "Network error. Please check your connection and try again.",
        })
      }
    }

    const attempted = basket.length
    const successCount = successes.length

    if (successCount > 0) {
      const successfulSkuSet = new Set(successes.map((item) => item.sku))
      setBasket((prev) => prev.filter((item) => !successfulSkuSet.has(item.sku)))
      setLastSuccessfulItems(successes)

      if (attempted === 1 && successCount === 1) {
        trackEvent("report_submit_single", {
          ui_source: "report-find-submit",
          attempted,
          succeeded: successCount,
          failed: failures.length,
        })
      }

      if (attempted > 1) {
        trackEvent("report_submit_batch", {
          ui_source: "report-find-submit",
          attempted,
          succeeded: successCount,
          failed: failures.length,
        })
      }
    } else {
      setLastSuccessfulItems([])
    }

    setResult({
      attempted,
      successCount,
      failed: failures,
      ...(firstStats ? { stats: firstStats } : {}),
    })

    setSubmitting(false)
  }

  const handleCopyForFacebook = async () => {
    if (lastSuccessfulItems.length === 0) return

    const placeLabel = sharedData.storeCity
      ? `${sharedData.storeCity}, ${sharedData.storeState}`
      : sharedData.storeState

    const header =
      lastSuccessfulItems.length === 1
        ? `I reported 1 penny find at Home Depot (${placeLabel}) on ${sharedData.dateFound}:`
        : `I reported ${lastSuccessfulItems.length} penny finds at Home Depot (${placeLabel}) on ${sharedData.dateFound}:`

    const lines = lastSuccessfulItems.map((item) => {
      const qtyText = item.quantity ? ` x${item.quantity}` : ""
      return `- ${item.itemName} (SKU ${formatSkuForDisplay(item.sku)})${qtyText}`
    })

    const text = [
      header,
      ...lines,
      "",
      "Report your own finds: https://www.pennycentral.com/report-find",
    ].join("\n")

    const copied = await copyToClipboard(text)

    if (copied) {
      setCopyFeedback("Copied. Paste it into your Facebook post.")
      trackEvent("copy_for_facebook", {
        ui_source: "report-find-success",
        item_count: lastSuccessfulItems.length,
      })
      return
    }

    setCopyFeedback("Could not copy automatically. Please try again.")
  }

  const submitDisabled = submitting || basket.length === 0

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-lg border border-[var(--border-default)] border-l-4 border-l-[var(--status-info)] bg-[var(--bg-elevated)] p-4 mb-8 flex gap-3 items-start">
        <Info className="w-5 h-5 text-[var(--status-info)] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[var(--text-secondary)]">
          <p className="font-semibold mb-2">About this form</p>
          <p className="mb-2">
            Add one or more items to your basket, then submit everything at once.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Submissions are not individually confirmed.</li>
            <li>The Penny List may contain mistakes, sold-out items, or prices that changed.</li>
            <li>For receipts and discussion, use the Facebook group.</li>
          </ul>
        </div>
      </div>

      <form
        onSubmit={handleSubmitAll}
        className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 space-y-6"
      >
        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4 space-y-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Shared haul details</p>

          <div>
            <label
              htmlFor="storeCity"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              City <span className="text-xs text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              type="text"
              id="storeCity"
              value={sharedData.storeCity}
              onChange={(e) => setSharedData((prev) => ({ ...prev, storeCity: e.target.value }))}
              placeholder="e.g., Tampa"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="storeState"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              State{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
            </label>
            <select
              id="storeState"
              required
              aria-required="true"
              value={sharedData.storeState}
              onChange={(e) => setSharedData((prev) => ({ ...prev, storeState: e.target.value }))}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            >
              <option value="">Select state...</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.code})
                </option>
              ))}
            </select>
          </div>

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
              value={sharedData.dateFound}
              onChange={(e) => setSharedData((prev) => ({ ...prev, dateFound: e.target.value }))}
              min={minDateIso || undefined}
              max={todayIso || undefined}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">Within the last 30 days.</p>
          </div>

          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={sharedData.website}
              onChange={(e) => setSharedData((prev) => ({ ...prev, website: e.target.value }))}
            />
          </div>
        </div>

        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4 space-y-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">Add item to basket</p>

          <div>
            <label
              htmlFor="itemName"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Item Name{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              id="itemName"
              maxLength={75}
              value={draft.itemName}
              onChange={(e) => setDraft((prev) => ({ ...prev, itemName: e.target.value }))}
              placeholder="e.g., Milwaukee Drill Set"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              SKU Number{" "}
              <span className="text-[var(--status-error)]" aria-hidden="true">
                *
              </span>
            </label>
            <input
              type="text"
              id="sku"
              aria-describedby="sku-hint"
              aria-errormessage={skuError ? "sku-error" : undefined}
              value={skuDisplay}
              onChange={handleSkuChange}
              placeholder="e.g., 1009258128"
              className={`w-full px-4 py-2 rounded-lg border text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent font-mono bg-[var(--bg-page)] ${skuError ? "border-[var(--status-error)]" : "border-[var(--border-default)]"}`}
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
                Enter the 6 or 10-digit SKU from the shelf tag or Home Depot app.
              </p>
            )}
            {skuWarning && (
              <p className="mt-1 text-xs text-[var(--status-warning)] flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span>{skuWarning}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Quantity{" "}
              <span className="text-xs text-[var(--text-muted)] font-normal">(optional)</span>
            </label>
            <input
              type="number"
              id="quantity"
              min={1}
              max={99}
              value={draft.quantity}
              onChange={(e) => setDraft((prev) => ({ ...prev, quantity: e.target.value }))}
              placeholder="e.g., 3"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          <Button
            type="button"
            onClick={handleAddItem}
            className="w-full sm:w-auto bg-[var(--cta-primary)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)]"
          >
            <PlusCircle className="w-4 h-4 mr-2" aria-hidden="true" />
            Add item
          </Button>

          {addFeedback && (
            <p
              className={`text-sm ${addFeedback.type === "error" ? "text-[var(--status-error)]" : "text-[var(--status-success)]"}`}
              role="status"
            >
              {addFeedback.message}
            </p>
          )}
        </div>

        <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-[var(--text-primary)]">Basket</p>
            <p className="text-xs text-[var(--text-muted)]">{basket.length} item(s)</p>
          </div>

          {basket.length === 0 ? (
            <p className="text-sm text-[var(--text-muted)]">No items added yet.</p>
          ) : (
            <ul className="space-y-2" data-testid="report-basket-list">
              {basket.map((item) => (
                <li
                  key={item.sku}
                  data-testid={`basket-item-${item.sku}`}
                  className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2 flex items-start justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {item.itemName}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] font-mono">
                      SKU {formatSkuForDisplay(item.sku)}
                      {item.quantity !== null ? ` - Qty ${item.quantity}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBasketItem(item.sku)}
                    className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
                    aria-label={`Remove ${item.itemName} from basket`}
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Button
          type="submit"
          disabled={submitDisabled || !!skuError}
          className="w-full bg-[var(--cta-primary)] text-[var(--cta-text)] hover:bg-[var(--cta-hover)] py-6 text-lg font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] disabled:opacity-60"
        >
          {submitting ? "Submitting..." : `Submit all (${basket.length})`}
        </Button>

        {result && (
          <div
            className={`flex items-start gap-3 p-4 rounded-lg border border-[var(--border-default)] border-l-4 bg-[var(--bg-elevated)] ${
              result.successCount > 0
                ? "border-l-[var(--status-success)]"
                : "border-l-[var(--status-error)]"
            }`}
          >
            {result.successCount > 0 ? (
              <CheckCircle2 className="w-5 h-5 text-[var(--status-success)] flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[var(--status-error)] flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-[var(--text-primary)]">
                {result.successCount > 0
                  ? result.attempted === 1 && result.successCount === 1
                    ? result.stats?.isFirstReport
                      ? "You are the first to report this item. Your find is now live for the community."
                      : result.stats
                        ? `You are the ${ordinal(result.stats.totalReports)} person to report this item${
                            result.stats.stateCount > 1
                              ? ` across ${result.stats.stateCount} states`
                              : ""
                          }.`
                        : "Thanks. Your find is live on the Penny List."
                    : `Submitted ${result.successCount} of ${result.attempted} item(s).`
                  : result.failed[0]?.message || "Something went wrong. Please try again."}
              </p>

              {result.failed.length > 0 && (
                <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] p-3">
                  <p className="text-xs font-semibold text-[var(--text-primary)] mb-2">
                    {result.failed.length} item(s) failed and stayed in your basket for retry:
                  </p>
                  <ul className="space-y-1 text-xs text-[var(--text-secondary)]">
                    {result.failed.map((failure) => (
                      <li key={failure.item.sku}>
                        {failure.item.itemName} (SKU {formatSkuForDisplay(failure.item.sku)}):{" "}
                        {failure.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.successCount > 0 && (
                <div className="mt-3 flex flex-col sm:flex-row gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      window.location.href = "/penny-list?fresh=1"
                    }}
                    className="flex-1"
                  >
                    View on Penny List
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setResult(null)
                      setCopyFeedback("")
                    }}
                    className="flex-1"
                  >
                    Report Another Find
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyForFacebook}
                    className="flex-1"
                  >
                    Copy for Facebook
                  </Button>
                </div>
              )}

              {copyFeedback && (
                <p className="text-xs text-[var(--text-secondary)]">{copyFeedback}</p>
              )}
            </div>
          </div>
        )}
      </form>

      <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
        <p>
          Submissions are added to the Penny List automatically, usually within about 5 minutes. For
          receipts and real-time discussion, use the Facebook group.
        </p>
      </div>
    </div>
  )
}

function ReportFindSkeleton() {
  return (
    <div className="max-w-2xl mx-auto animate-pulse">
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 mb-8">
        <div className="h-4 w-24 bg-[var(--bg-muted)] rounded mb-2" />
        <div className="h-3 w-full bg-[var(--bg-muted)] rounded mb-2" />
        <div className="h-3 w-3/4 bg-[var(--bg-muted)] rounded" />
      </div>

      <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="h-4 w-28 bg-[var(--bg-muted)] rounded mb-2" />
          <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
        </div>
        <div>
          <div className="h-4 w-24 bg-[var(--bg-muted)] rounded mb-2" />
          <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
        </div>
        <div>
          <div className="h-4 w-20 bg-[var(--bg-muted)] rounded mb-2" />
          <div className="h-10 w-full bg-[var(--bg-muted)] rounded" />
        </div>
        <div className="h-14 w-full bg-[var(--bg-muted)] rounded" />
      </div>
    </div>
  )
}

export default function ReportFindFormClient() {
  return (
    <Suspense fallback={<ReportFindSkeleton />}>
      <ReportFindForm />
    </Suspense>
  )
}
