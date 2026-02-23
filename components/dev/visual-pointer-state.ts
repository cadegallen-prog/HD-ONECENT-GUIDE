"use client"

export const VISUAL_POINTER_MODE_STORAGE_KEY = "pc_visual_pointer_mode_v1"
export const VISUAL_POINTER_MODE_EVENT = "pc-visual-pointer:mode"

function isLocalPreviewHost(hostname: string): boolean {
  return hostname === "localhost" || hostname === "127.0.0.1"
}

function hasVisualPointerQueryOverride(): boolean {
  if (typeof window === "undefined") {
    return false
  }
  return new URLSearchParams(window.location.search).get("visualPointer") === "1"
}

export function isVisualPointerEnabledEnv(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const isLocalPreview = isLocalPreviewHost(window.location.hostname)
  const isEnabledEnv = process.env.NODE_ENV === "development" || isLocalPreview
  const blockedForPlaywright = process.env.PLAYWRIGHT === "1" && !hasVisualPointerQueryOverride()

  return isEnabledEnv && !blockedForPlaywright
}

export function readVisualPointerMode(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  return window.localStorage.getItem(VISUAL_POINTER_MODE_STORAGE_KEY) === "armed"
}

export function setVisualPointerMode(armed: boolean): void {
  if (typeof window === "undefined") {
    return
  }

  window.localStorage.setItem(VISUAL_POINTER_MODE_STORAGE_KEY, armed ? "armed" : "disarmed")
  window.dispatchEvent(
    new CustomEvent(VISUAL_POINTER_MODE_EVENT, {
      detail: { armed },
    })
  )
}
