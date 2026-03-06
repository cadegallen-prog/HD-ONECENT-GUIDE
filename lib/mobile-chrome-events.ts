export const PENNY_LIST_MOBILE_CHROME_VISIBILITY_EVENT = "pc:penny-list-mobile-chrome-visibility"

export interface PennyListMobileChromeVisibilityDetail {
  visible: boolean
}

export function emitPennyListMobileChromeVisibility(visible: boolean) {
  if (typeof window === "undefined") return

  window.dispatchEvent(
    new CustomEvent<PennyListMobileChromeVisibilityDetail>(
      PENNY_LIST_MOBILE_CHROME_VISIBILITY_EVENT,
      { detail: { visible } }
    )
  )
}
