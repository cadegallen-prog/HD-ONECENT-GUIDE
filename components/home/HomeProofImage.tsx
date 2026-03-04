"use client"

import { useEffect, useState } from "react"
import { ImageOff } from "lucide-react"
import { PLACEHOLDER_IMAGE_URL, toThdImageVariant } from "@/lib/image-cache"

type HomeProofImageTarget = 400 | 600
type HomeProofImageState = "loading" | "loaded" | "fallback"

function normalizeImageSource(src: string | null | undefined, target: HomeProofImageTarget) {
  const trimmed = src?.trim()
  if (!trimmed || trimmed === PLACEHOLDER_IMAGE_URL) return null
  return toThdImageVariant(trimmed, target)
}

function normalizeCanonicalSource(src: string | null | undefined) {
  const trimmed = src?.trim()
  if (!trimmed || trimmed === PLACEHOLDER_IMAGE_URL) return null
  return trimmed
}

export function HomeProofImage({
  src,
  alt,
  target,
  wrapperClassName,
  imageClassName,
  loading = "lazy",
  fetchPriority,
  testId,
  fallbackLabel = "Product photo unavailable",
  fallbackCopy,
  compactFallback = false,
}: {
  src?: string | null
  alt: string
  target: HomeProofImageTarget
  wrapperClassName: string
  imageClassName: string
  loading?: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
  testId?: string
  fallbackLabel?: string
  fallbackCopy?: string
  compactFallback?: boolean
}) {
  const normalizedSrc = normalizeImageSource(src, target)
  const canonicalSrc = normalizeCanonicalSource(src)
  const [currentSrc, setCurrentSrc] = useState(normalizedSrc)
  const [imageState, setImageState] = useState<HomeProofImageState>(
    normalizedSrc ? "loading" : "fallback"
  )
  const [triedCanonical, setTriedCanonical] = useState(false)

  useEffect(() => {
    setCurrentSrc(normalizedSrc)
    setImageState(normalizedSrc ? "loading" : "fallback")
    setTriedCanonical(false)
  }, [normalizedSrc])

  if (imageState === "fallback" || !currentSrc) {
    return (
      <div
        data-proof-visual="fallback"
        data-testid={testId}
        className={`${wrapperClassName} flex items-center justify-center bg-[var(--bg-recessed)] text-center text-[var(--text-muted)]`}
        aria-label={fallbackLabel}
      >
        <div
          className={compactFallback ? "flex items-center justify-center" : "max-w-[18rem] px-4"}
        >
          <ImageOff
            className={compactFallback ? "h-5 w-5" : "mx-auto h-8 w-8"}
            aria-hidden="true"
          />
          {compactFallback ? <span className="sr-only">{fallbackLabel}</span> : null}
          {!compactFallback ? (
            <>
              <p className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                {fallbackLabel}
              </p>
              {fallbackCopy ? (
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {fallbackCopy}
                </p>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div data-proof-visual={imageState} data-testid={testId} className={wrapperClassName}>
      <img
        src={currentSrc}
        alt={alt}
        className={imageClassName}
        loading={loading}
        fetchPriority={fetchPriority}
        referrerPolicy="no-referrer"
        onLoad={() => {
          setImageState("loaded")
        }}
        onError={() => {
          if (!triedCanonical && canonicalSrc && canonicalSrc !== currentSrc) {
            setTriedCanonical(true)
            setCurrentSrc(canonicalSrc)
            setImageState("loading")
            return
          }
          setImageState("fallback")
        }}
      />
    </div>
  )
}
