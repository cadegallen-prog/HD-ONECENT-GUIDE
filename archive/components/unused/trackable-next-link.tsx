"use client"

import Link from "next/link"
import type { ComponentPropsWithoutRef } from "react"
import { trackEvent, type EventName, type EventParams } from "@/lib/analytics"

interface TrackableNextLinkProps extends ComponentPropsWithoutRef<typeof Link> {
  eventName: EventName
  eventParams?: EventParams
}

export function TrackableNextLink({
  eventName,
  eventParams,
  onClick,
  ...props
}: TrackableNextLinkProps) {
  return (
    <Link
      {...props}
      prefetch={props.prefetch ?? false}
      onClick={(event) => {
        trackEvent(eventName, eventParams)
        onClick?.(event)
      }}
    />
  )
}
