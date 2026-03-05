export {}

type MonumetricQueueEntry = [string]

interface MonumetricDisplayState {
  slots?: MonumetricQueueEntry[]
}

interface MonumetricRuntimeState {
  cmd?: Array<() => void>
  display?: MonumetricDisplayState
  spa?: {
    setCallback?: (callback: () => void) => void
  }
}

declare global {
  interface Window {
    $MMT?: MonumetricRuntimeState
  }
}
