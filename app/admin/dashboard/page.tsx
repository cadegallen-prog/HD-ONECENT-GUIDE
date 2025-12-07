"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  XCircle,
  Trash2,
  AlertTriangle,
  MapPin,
  Calendar,
  Package,
} from "lucide-react"

interface FindSubmission {
  id: string
  sku: string
  storeName: string
  storeCity: string
  storeState: string
  dateFound: string
  quantity?: string
  notes?: string
  submittedAt: string
  status: "pending" | "approved" | "rejected"
  validationScore?: number
}

export default function AdminDashboard() {
  const [submissions, setSubmissions] = useState<FindSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending")

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      const response = await fetch("/api/admin/submissions")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data.submissions || [])
      }
    } catch (error) {
      console.error("Error loading submissions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "approve" }),
      })
      if (response.ok) {
        loadSubmissions()
      }
    } catch (error) {
      console.error("Error approving submission:", error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch("/api/admin/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action: "reject" }),
      })
      if (response.ok) {
        loadSubmissions()
      }
    } catch (error) {
      console.error("Error rejecting submission:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this submission permanently?")) return

    try {
      const response = await fetch("/api/admin/submissions", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      })
      if (response.ok) {
        loadSubmissions()
      }
    } catch (error) {
      console.error("Error deleting submission:", error)
    }
  }

  const filteredSubmissions = submissions.filter((sub) =>
    filter === "all" ? true : sub.status === filter
  )

  const pendingCount = submissions.filter((s) => s.status === "pending").length

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-page)] flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--bg-page)] py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Admin Dashboard</h1>
          <p className="text-[var(--text-secondary)]">
            Review and approve community penny find submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-4">
            <p className="text-sm text-[var(--text-muted)] mb-1">Total</p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">{submissions.length}</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">Pending</p>
            <p className="text-2xl font-bold text-amber-800 dark:text-amber-200">{pendingCount}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300 mb-1">Approved</p>
            <p className="text-2xl font-bold text-green-800 dark:text-green-200">
              {submissions.filter((s) => s.status === "approved").length}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-sm text-red-700 dark:text-red-300 mb-1">Rejected</p>
            <p className="text-2xl font-bold text-red-800 dark:text-red-200">
              {submissions.filter((s) => s.status === "rejected").length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "approved", "rejected"] as const).map((f) => (
            <Button
              key={f}
              onClick={() => setFilter(f)}
              variant={filter === f ? "primary" : "ghost"}
              className={filter === f ? "bg-[var(--cta-primary)] text-white" : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Button>
          ))}
        </div>

        {/* Submissions List */}
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12 bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg">
            <p className="text-[var(--text-muted)]">No {filter} submissions</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                className="bg-[var(--bg-elevated)] border border-[var(--border-default)] rounded-lg p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-mono font-semibold text-[var(--text-primary)]">
                        SKU: {submission.sku}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          submission.status === "pending"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                            : submission.status === "approved"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {submission.status}
                      </span>
                      {submission.validationScore !== undefined && (
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            submission.validationScore >= 60
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : submission.validationScore >= 40
                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          Score: {submission.validationScore}
                        </span>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {submission.storeName}
                          {submission.storeCity && `, ${submission.storeCity}`},{" "}
                          {submission.storeState}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                        <Calendar className="w-4 h-4" />
                        <span>Found: {new Date(submission.dateFound).toLocaleDateString()}</span>
                      </div>
                      {submission.quantity && (
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <Package className="w-4 h-4" />
                          <span>{submission.quantity}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs">
                        Submitted: {new Date(submission.submittedAt).toLocaleString()}
                      </div>
                    </div>

                    {submission.notes && (
                      <div className="mt-3 p-3 bg-[var(--bg-page)] rounded border border-[var(--border-default)]">
                        <p className="text-sm text-[var(--text-secondary)]">{submission.notes}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {submission.status === "pending" && (
                  <div className="flex gap-2 pt-4 border-t border-[var(--border-default)]">
                    <Button
                      onClick={() => handleApprove(submission.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      onClick={() => handleReject(submission.id)}
                      variant="ghost"
                      className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleDelete(submission.id)}
                      variant="ghost"
                      className="ml-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
                {submission.status !== "pending" && (
                  <div className="flex gap-2 pt-4 border-t border-[var(--border-default)]">
                    <Button
                      onClick={() => handleDelete(submission.id)}
                      variant="ghost"
                      className="ml-auto"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Warning */}
        {pendingCount > 0 && (
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Next Steps:</p>
              <p>
                Review pending submissions and approve legitimate finds. Approved items will need to
                be manually added to the penny-list.json file with location data.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
