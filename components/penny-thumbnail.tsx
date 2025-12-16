"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

type PennyThumbnailSize = 40 | 48 | 64 | 72

const sizeClassMap: Record<PennyThumbnailSize, string> = {
  40: "w-10 h-10",
  48: "w-12 h-12",
  64: "w-16 h-16",
  72: "w-[72px] h-[72px]",
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
  const [errored, setErrored] = useState(false)
  const normalizedSrc = src?.trim()
  const showImage = normalizedSrc && /^https?:\/\//i.test(normalizedSrc) && !errored
  const normalizedSize = size ?? 64
  const sizeClass = sizeClassMap[normalizedSize]
  const wrapperClass = `flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-muted)] ${sizeClass}`

  if (!showImage) {
    return (
      <div className={wrapperClass} aria-label="No photo available">
        <ImageOff className="w-5 h-5" aria-hidden="true" />
      </div>
    )
  }

  return (
    <img
      src={normalizedSrc}
      alt={alt}
      width={size}
      height={size}
      loading="lazy"
      className={`${sizeClass} rounded-lg object-cover border border-[var(--border-default)] bg-[var(--bg-page)]`}
      onError={() => setErrored(true)}
      referrerPolicy="no-referrer"
    />
  )
}
