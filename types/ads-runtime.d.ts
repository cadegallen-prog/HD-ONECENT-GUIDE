export {}

type MonumetricQueueEntry = [string]

interface MonumetricDisplayState {
  slots?: MonumetricQueueEntry[]
}

interface MonumetricRuntimeState {
  cmd?: Array<() => void>
  display?: MonumetricDisplayState
  refreshOnce?: () => void
  setNumMonuAdUnits?: () => void
  startRefresh?: () => void
  stopRefresh?: () => void
  insertAds?: () => void
  ready?: (callback: () => void) => void
  deviceType?: string
  spa?: {
    enabled?: boolean
    currentURL?: string | null
    enable?: () => void
    setCallback?: (callback: () => void) => void
  }
}

declare global {
  interface Window {
    $MMT?: MonumetricRuntimeState
  }
}
