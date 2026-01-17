"use client"

import { useEffect, useState } from "react"
import { X, Download } from "lucide-react"

/**
 * PWA Install Prompt Component
 *
 * Shows an "Add to Home Screen" prompt to increase user retention.
 * - Appears after scroll or ~20s delay
 * - Dismissible with localStorage persistence
 * - Tracks GA4 events (pwa_prompt_shown, pwa_prompt_dismissed, pwa_install_started)
 */

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent
  }
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if already dismissed
    const dismissed = localStorage.getItem("pwa-install-dismissed")
    if (dismissed === "true") {
      setIsDismissed(true)
      return
    }

    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as { standalone?: boolean }).standalone === true
    ) {
      return
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  useEffect(() => {
    if (!deferredPrompt || isDismissed) return

    let triggered = false

    // Show prompt after scroll
    const handleScroll = () => {
      if (!triggered && window.scrollY > 200) {
        triggered = true
        setShowPrompt(true)
        trackEvent("pwa_prompt_shown", { trigger: "scroll" })
      }
    }

    // Show prompt after 20 seconds
    const timer = setTimeout(() => {
      if (!triggered) {
        triggered = true
        setShowPrompt(true)
        trackEvent("pwa_prompt_shown", { trigger: "timer" })
      }
    }, 20000)

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [deferredPrompt, isDismissed])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    trackEvent("pwa_install_started")

    try {
      await deferredPrompt.prompt()
      const choiceResult = await deferredPrompt.userChoice

      if (choiceResult.outcome === "accepted") {
        trackEvent("pwa_install_accepted")
      } else {
        trackEvent("pwa_install_declined")
      }

      setShowPrompt(false)
      setDeferredPrompt(null)
    } catch (error) {
      console.error("PWA install error:", error)
      trackEvent("pwa_install_error")
    }
  }

  const handleDismiss = () => {
    localStorage.setItem("pwa-install-dismissed", "true")
    setIsDismissed(true)
    setShowPrompt(false)
    trackEvent("pwa_prompt_dismissed")
  }

  const trackEvent = (name: string, extra?: Record<string, string | number>) => {
    try {
      if (
        typeof window !== "undefined" &&
        (window as { gtag?: (...args: unknown[]) => void }).gtag
      ) {
        ;(window as { gtag: (...args: unknown[]) => void }).gtag("event", name, {
          event_category: "pwa",
          page: window.location.pathname,
          ...extra,
        })
      }
    } catch {
      // Silent fail
    }
  }

  if (!showPrompt || !deferredPrompt) return null

  return (
    <div
      role="dialog"
      aria-labelledby="pwa-prompt-title"
      aria-describedby="pwa-prompt-description"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-50 animate-slide-up"
    >
      <div className="rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] p-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Download className="h-5 w-5 text-[var(--status-info)]" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              id="pwa-prompt-title"
              className="text-sm font-semibold text-[var(--text-primary)] mb-1"
            >
              Add to Home Screen
            </h3>
            <p id="pwa-prompt-description" className="text-sm text-[var(--text-secondary)] mb-3">
              Get quick access to the latest penny finds. Install Penny Central on your home screen.
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstallClick}
                className="btn-primary text-sm px-3 py-1.5"
                aria-label="Install Penny Central app"
              >
                Install
              </button>
              <button
                onClick={handleDismiss}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5"
                aria-label="Dismiss install prompt"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close install prompt"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
