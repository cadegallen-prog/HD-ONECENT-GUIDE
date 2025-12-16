"use client"

import { useEffect, useState } from "react"
import { trackEvent } from "@/lib/analytics"

const STORAGE_KEY = "penny_list_feedback_v1"

export function FeedbackWidget() {
  const [dismissed, setDismissed] = useState(false)
  const [vote, setVote] = useState<"yes" | "no" | null>(null)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setDismissed(stored === "true")
  }, [])

  const handleVote = (value: "yes" | "no") => {
    if (vote) return
    setVote(value)
    trackEvent("feedback_vote", { vote: value, surface: "penny-list" })
  }

  const handleSubmit = async () => {
    if (!vote || submitting) return
    setSubmitting(true)
    try {
      trackEvent("feedback_comment", {
        length: comment.trim().length,
        voteContext: vote,
        surface: "penny-list",
      })
      setDismissed(true)
      localStorage.setItem(STORAGE_KEY, "true")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  function toPressed(value: boolean): "true" | "false" {
    return value ? "true" : "false"
  }

  if (dismissed) return null

  return (
    <section
      aria-labelledby="penny-feedback-heading"
      className="mt-10 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3
            id="penny-feedback-heading"
            className="text-base font-semibold text-[var(--text-primary)]"
          >
            Is this penny list helpful today?
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Quick pulse check. Optional comment helps prioritize fixes.
          </p>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline"
        >
          Dismiss
        </button>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => handleVote("yes")}
          aria-pressed={toPressed(vote === "yes")}
          className={`flex-1 min-h-[44px] rounded-lg border px-4 py-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
            vote === "yes"
              ? "bg-[var(--cta-primary)] text-[var(--cta-text)] border-[var(--cta-primary)]"
              : "bg-[var(--bg-page)] text-[var(--text-primary)] border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
          }`}
        >
          Yes
        </button>
        <button
          type="button"
          onClick={() => handleVote("no")}
          aria-pressed={toPressed(vote === "no")}
          className={`flex-1 min-h-[44px] rounded-lg border px-4 py-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] ${
            vote === "no"
              ? "bg-[var(--bg-page)] text-[var(--cta-primary)] border-[var(--cta-primary)]"
              : "bg-[var(--bg-page)] text-[var(--text-primary)] border-[var(--border-default)] hover:bg-[var(--bg-elevated)]"
          }`}
        >
          No
        </button>
      </div>
      {vote && (
        <div className="mt-4 space-y-3">
          <label
            className="text-sm font-medium text-[var(--text-primary)]"
            htmlFor="feedback-comment"
          >
            Optional comment
          </label>
          <textarea
            id="feedback-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-page)] text-[var(--text-primary)] text-sm p-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            placeholder="What’s missing or confusing?"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">
              We don’t store PII. Comment is only counted for length.
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-semibold hover:bg-[var(--cta-hover)] transition-colors disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
