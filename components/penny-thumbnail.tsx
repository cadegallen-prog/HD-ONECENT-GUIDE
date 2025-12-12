"use client"

import { useState } from "react"
import { ImageOff } from "lucide-react"

export function PennyThumbnail({
  src,
  alt,
  size = 64,
}: {
  src?: string
  alt: string
  size?: number
}) {
  const [errored, setErrored] = useState(false)
  const normalizedSrc = src?.trim()
  const showImage = normalizedSrc && /^https?:\/\//i.test(normalizedSrc) && !errored

  if (!showImage) {
    return (
      <div
        className="flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border-default)] text-[var(--text-muted)]"
        style={{ width: size, height: size }}
        aria-label="No photo available"
      >
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
      className="rounded-lg object-cover border border-[var(--border-default)] bg-[var(--bg-page)]"
      onError={() => setErrored(true)}
      referrerPolicy="no-referrer"
    />
  )
}
