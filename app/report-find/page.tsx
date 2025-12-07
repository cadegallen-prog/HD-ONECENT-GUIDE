"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle2, MapPin, Package, Calendar } from "lucide-react"

export default function ReportFindPage() {
  const [formData, setFormData] = useState({
    sku: "",
    storeName: "",
    storeCity: "",
    storeState: "",
    dateFound: new Date().toISOString().split("T")[0],
    quantity: "",
    notes: "",
  })

  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    validationScore?: number
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
        setResult({
          success: true,
          message: data.message,
          validationScore: data.validationScore,
        })
        // Reset form
        setFormData({
          sku: "",
          storeName: "",
          storeCity: "",
          storeState: "",
          dateFound: new Date().toISOString().split("T")[0],
          quantity: "",
          notes: "",
        })
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <MapPin className="w-4 h-4" />
            Help the Community
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--text-primary)] mb-4">
            Report a Penny Find
          </h1>
          <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Share what you found to help other hunters in your area. All submissions are reviewed
            before publishing.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800 dark:text-amber-200">
            <p className="font-semibold mb-1">Quick Tips:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Enter the exact SKU from your receipt or the app</li>
              <li>Include your store location (helps others nearby)</li>
              <li>Recent finds (last 7-14 days) are most valuable</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-xl p-6 sm:p-8 space-y-6"
        >
          {/* SKU */}
          <div>
            <label
              htmlFor="sku"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Item SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              placeholder="e.g., 1001234567 or 123456"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              6 or 10 digit SKU from receipt or Home Depot app
            </p>
          </div>

          {/* Store Name */}
          <div>
            <label
              htmlFor="storeName"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2"
            >
              Store Name/Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="storeName"
              required
              value={formData.storeName}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              placeholder="e.g., Home Depot #1234 or Brandon"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          {/* Location - City & State */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="storeCity"
                className="block text-sm font-medium text-[var(--text-primary)] mb-2"
              >
                City
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
                htmlFor="storeState"
                className="block text-sm font-medium text-[var(--text-primary)] mb-2"
              >
                State <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="storeState"
                required
                maxLength={2}
                value={formData.storeState}
                onChange={(e) =>
                  setFormData({ ...formData, storeState: e.target.value.toUpperCase() })
                }
                placeholder="FL"
                className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Date Found */}
          <div>
            <label
              htmlFor="dateFound"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Date Found <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="dateFound"
              required
              value={formData.dateFound}
              onChange={(e) => setFormData({ ...formData, dateFound: e.target.value })}
              max={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          {/* Quantity (optional) */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-[var(--text-primary)] mb-2 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              Quantity Found (optional)
            </label>
            <input
              type="text"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              placeholder="e.g., 5 on shelf, Full endcap, 1 left"
              className="w-full px-4 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent"
            />
          </div>

          {/* Notes (optional) */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--cta-primary)] text-white hover:opacity-90 py-6 text-lg font-medium"
          >
            {submitting ? "Submitting..." : "Submit Find"}
          </Button>

          {/* Result Message */}
          {result && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
                result.success
                  ? "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800"
              }`}
            >
              {result.success ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    result.success
                      ? "text-green-800 dark:text-green-200"
                      : "text-red-800 dark:text-red-200"
                  }`}
                >
                  {result.message}
                </p>
                {result.success && result.validationScore && (
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Your submission will be reviewed within 24-48 hours.
                  </p>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Bottom Info */}
        <div className="mt-8 text-center text-sm text-[var(--text-muted)]">
          <p>
            All submissions are manually reviewed to ensure accuracy. Thank you for helping the
            community!
          </p>
        </div>
      </div>
    </div>
  )
}
