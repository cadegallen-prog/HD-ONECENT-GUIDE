export type SelectorStrategy = "data-pc-id" | "data-testid" | "aria-role-name" | "text" | "css-path"

export interface SelectorCandidate {
  strategy: SelectorStrategy
  selector: string
  confidence: "high" | "medium" | "low"
}

export interface SourceAnchorMeta {
  pcId: string
  route: string
  component: string
  file: string
  line: number
  column?: number
}

export interface VisualPointerCapture {
  captureId: string
  capturedAt: string
  url: string
  pathname: string
  query: string
  viewportWidth: number
  viewportHeight: number
  dpr: number
  theme: "light" | "dark" | "unknown"
  targetTag: string
  targetTextSnippet: string
  targetRole: string | null
  targetLabel: string | null
  primarySelector: string
  selectorCandidates: SelectorCandidate[]
  pcId: string | null
  source: SourceAnchorMeta | "source_unavailable"
}
