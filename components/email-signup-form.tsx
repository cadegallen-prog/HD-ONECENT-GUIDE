"use client"

import { useEffect, useState } from "react"
import { Mail, X, Loader2, CheckCircle2 } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

const DISMISSED_KEY = "pennycentral_email_signup_dismissed_v1"
const SUBSCRIBED_KEY = "pennycentral_email_subscribed_v1"

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function safeSetItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

export function EmailSignupForm() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isDismissed = safeGetItem(DISMISSED_KEY) === "1"
  const isSubscribed = safeGetItem(SUBSCRIBED_KEY) === "1"

  useEffect(() => {
    if (isDismissed || isSubscribed) return

    let hasShown = false

    const show = () => {
      if (hasShown) return
      hasShown = true
      setIsVisible(true)
      trackEvent("email_signup_shown", { surface: "penny-list" })
    }

    const timeoutId = window.setTimeout(show, 25_000) // 25s delay

    const onScroll = () => {
      if (window.scrollY >= 600) show()
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      window.clearTimeout(timeoutId)
      window.removeEventListener("scroll", onScroll)
    }
  }, [isDismissed, isSubscribed])

  const handleDismiss = () => {
    safeSetItem(DISMISSED_KEY, "1")
    setIsVisible(false)
    trackEvent("email_signup_dismissed", { surface: "penny-list" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus("success")
        setSuccessMessage(data.message || "Successfully subscribed!")
        trackEvent("email_signup", {
          surface: "penny-list",
          alreadySubscribed: data.alreadySubscribed || false,
          reactivated: data.reactivated || false,
        })

        // Hide form after 3 seconds, THEN mark as subscribed in localStorage
        // (Moving localStorage write here prevents immediate re-render that hides success message)
        setTimeout(() => {
          safeSetItem(SUBSCRIBED_KEY, "1")
          setIsVisible(false)
        }, 3000)
      } else {
        setSubmitStatus("error")
        setErrorMessage(data.error || "Failed to subscribe. Please try again.")
        trackEvent("email_signup_error", {
          surface: "penny-list",
          error: data.error,
        })
      }
    } catch {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
      trackEvent("email_signup_error", {
        surface: "penny-list",
        error: "network_error",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isVisible || isDismissed || isSubscribed) return null

  return (
    <section
      aria-label="Email signup form"
      className="mb-6 rounded-xl border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 sm:p-5"
      data-email-signup-form="true"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)]">
            <Mail className="h-5 w-5 text-[var(--cta-primary)]" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              Get weekly penny list updates via email
            </p>
            <p className="mt-1 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              We'll send you a digest of new penny finds every Sunday. Unsubscribe anytime.
            </p>

            {submitStatus === "success" ? (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-[var(--status-success)]/10 border border-[var(--status-success)]/20 px-3 py-2">
                <CheckCircle2
                  className="h-4 w-4 text-[var(--status-success)] flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="text-sm text-[var(--status-success)]">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-3 py-2 rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-primary)] text-sm placeholder:text-[var(--text-placeholder)] focus:outline-none focus:ring-2 focus:ring-[var(--cta-primary)] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[var(--cta-primary)] text-[var(--cta-text)] font-medium text-sm transition-colors duration-150 hover:bg-[var(--cta-hover)] shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)] disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] whitespace-nowrap"
                    aria-label="Subscribe to email updates"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                        Subscribing...
                      </>
                    ) : (
                      "Subscribe"
                    )}
                  </button>
                </div>
                {errorMessage && (
                  <p className="mt-2 text-sm text-[var(--status-error)]" role="alert">
                    {errorMessage}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--border-default)] bg-[var(--bg-card)] text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
          aria-label="Dismiss email signup"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
