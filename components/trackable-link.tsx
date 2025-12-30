"use client"

import { trackEvent, type EventName, type EventParams } from "@/lib/analytics"
import type { ReactNode, AnchorHTMLAttributes } from "react"

interface TrackableLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  eventName: EventName
  eventParams?: EventParams
  children: ReactNode
}

/**
 * A link component that tracks clicks with the configured analytics provider
 * Use this for CTAs where you want to track conversions
 */
export function TrackableLink({
  eventName,
  eventParams,
  children,
  onClick,
  ...props
}: TrackableLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackEvent(eventName, eventParams)
    onClick?.(e)
  }

  return (
    <a {...props} onClick={handleClick}>
      {children}
    </a>
  )
}
