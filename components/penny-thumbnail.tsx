"use client"

import { useEffect, useState } from "react"
import { ImageOff } from "lucide-react"
import { toThdImageVariant } from "@/lib/image-cache"

type PennyThumbnailSize = 40 | 48 | 64 | 72 | 120

const sizeClassMap: Record<PennyThumbnailSize, string> = {
  40: "w-10 h-10",
  48: "w-12 h-12",
  64: "w-16 h-16",
  72: "w-[72px] h-[72px]",
  120: "w-[120px] h-[120px]",
}

export function PennyThumbnail({
  src,
  alt,
  size = 64,
}: {
  src?: string
  alt: string
  size?: PennyThumbnailSize
}) {
  const normalizedSrc = src?.trim()
  const [currentSrc, setCurrentSrc] = useState(normalizedSrc)
  const [triedThdFallback, setTriedThdFallback] = useState(false)
  const [errored, setErrored] = useState(false)
  useEffect(() => {
    setCurrentSrc(normalizedSrc)
    setTriedThdFallback(false)
    setErrored(false)
  }, [normalizedSrc])
  const showImage =
    currentSrc && !errored && (/^https?:\/\//i.test(currentSrc) || currentSrc.startsWith("/"))
  const normalizedSize = size ?? 64
  const sizeClass = sizeClassMap[normalizedSize]
  const wrapperClass = `flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-strong)] shadow-[inset_0_0_0_1px_var(--border-strong)] text-[var(--text-muted)] ${sizeClass}`

  if (!showImage) {
    return (
      <div className={wrapperClass} aria-label="No photo available">
        <ImageOff className="w-5 h-5" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={`${sizeClass} rounded-lg object-contain border border-[var(--border-strong)] bg-[var(--bg-tertiary)]`}
      onError={() => {
        if (!triedThdFallback && currentSrc) {
          const fallback = toThdImageVariant(currentSrc, 1000)
          if (fallback !== currentSrc) {
            setTriedThdFallback(true)
            setCurrentSrc(fallback)
            setErrored(false)
            return
          }
        }
        setErrored(true)
      }}
      referrerPolicy="no-referrer"
    />
  )
}
