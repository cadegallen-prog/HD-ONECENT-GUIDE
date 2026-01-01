"use client"

import { useState, useRef, useEffect } from "react"
import { Share2, Check } from "lucide-react"
import { trackEvent } from "@/lib/analytics"

interface ShareButtonProps {
  sku: string
  itemName: string
  source?: "card" | "page" | string
}

export function ShareButton({ sku, itemName, source = "card" }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showMenu])

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/sku/${sku}`
  const shareText = `Found this penny item at Home Depot: ${itemName} (SKU ${sku})`

  const handleShareFacebook = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`
    window.open(fbShareUrl, "_blank", "noopener,noreferrer,width=600,height=400")
    trackEvent("share_click", { platform: "facebook", sku: sku.slice(-4), source })
    setShowMenu(false)
  }

  const handleCopyLink = async (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    try {
      await navigator.clipboard.writeText(shareUrl)
      trackEvent("share_click", { platform: "copy_link", sku: sku.slice(-4), source })
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setShowMenu(false)
      }, 1500)
    } catch (error) {
      console.error("Failed to copy link", error)
    }
  }

  const toggleMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
    setShowMenu(!showMenu)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center justify-center w-11 h-11 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--cta-primary)]"
        aria-label="Share this item"
        aria-expanded={showMenu}
      >
        <Share2 className="w-4 h-4" />
      </button>

      {showMenu && (
        <div
          className="absolute bottom-full right-0 mb-2 w-48 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-[var(--shadow-card)] overflow-hidden z-10"
          role="menu"
        >
          <button
            type="button"
            onClick={handleShareFacebook}
            className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2"
            role="menuitem"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
            </svg>
            Share to Facebook
          </button>
          <button
            type="button"
            onClick={handleCopyLink}
            className="w-full px-4 py-2.5 text-left text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors flex items-center gap-2"
            role="menuitem"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                Link copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Copy link
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
