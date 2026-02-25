import type { SelectorCandidate } from "@/lib/visual-pointer/types"

const MAX_TEXT_SNIPPET_LENGTH = 160
const MAX_LABEL_LENGTH = 120

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim()
}

function toSnippet(value: string, maxLength: number): string {
  const normalized = normalizeWhitespace(value)
  if (normalized.length <= maxLength) {
    return normalized
  }
  return `${normalized.slice(0, maxLength - 1)}…`
}

function escapeForAttributeSelector(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function escapeForNameSelector(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')
}

function getFallbackRole(element: Element): string | null {
  const tag = element.tagName.toLowerCase()
  if (tag === "button") return "button"
  if (tag === "a" && (element as HTMLAnchorElement).href) return "link"
  if (tag === "img") return "img"
  if (tag === "select") return "combobox"
  if (tag === "textarea") return "textbox"
  if (tag === "input") {
    const type = ((element as HTMLInputElement).type || "text").toLowerCase()
    if (type === "button" || type === "submit" || type === "reset") return "button"
    if (type === "checkbox") return "checkbox"
    if (type === "radio") return "radio"
    if (type === "search" || type === "text" || type === "email" || type === "tel") {
      return "textbox"
    }
  }
  return null
}

function getRole(element: Element): string | null {
  const explicit = element.getAttribute("role")
  if (explicit) {
    return explicit
  }
  return getFallbackRole(element)
}

function getLabelFromAriaLabelledBy(element: Element): string | null {
  const labelledBy = element.getAttribute("aria-labelledby")
  if (!labelledBy) {
    return null
  }

  const parts = labelledBy
    .split(/\s+/)
    .map((id) => document.getElementById(id))
    .filter((node): node is HTMLElement => Boolean(node))
    .map((node) => node.textContent ?? "")
    .map((text) => normalizeWhitespace(text))
    .filter(Boolean)

  if (parts.length === 0) {
    return null
  }

  return toSnippet(parts.join(" "), MAX_LABEL_LENGTH)
}

function getLabel(element: Element): string | null {
  const ariaLabel = element.getAttribute("aria-label")
  if (ariaLabel) {
    return toSnippet(ariaLabel, MAX_LABEL_LENGTH)
  }

  const fromLabelledBy = getLabelFromAriaLabelledBy(element)
  if (fromLabelledBy) {
    return fromLabelledBy
  }

  const htmlElement = element as HTMLElement
  if (typeof htmlElement.innerText === "string" && htmlElement.innerText.trim()) {
    return toSnippet(htmlElement.innerText, MAX_LABEL_LENGTH)
  }

  if (typeof htmlElement.textContent === "string" && htmlElement.textContent.trim()) {
    return toSnippet(htmlElement.textContent, MAX_LABEL_LENGTH)
  }

  return null
}

function getNearestAttribute(
  element: Element,
  attribute: "data-pc-id" | "data-testid"
): string | null {
  const owner = element.closest(`[${attribute}]`)
  if (!owner) {
    return null
  }
  return owner.getAttribute(attribute)
}

function buildCssPath(element: Element): string {
  const segments: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === 1 && current.tagName.toLowerCase() !== "html") {
    const tagName = current.tagName.toLowerCase()
    const id = current.getAttribute("id")

    if (id) {
      segments.unshift(`${tagName}#${id}`)
      break
    }

    const parentElement: Element | null = current.parentElement
    if (!parentElement) {
      segments.unshift(tagName)
      break
    }

    const sameTagSiblings = Array.from(parentElement.children as HTMLCollectionOf<Element>).filter(
      (sibling: Element) => sibling.tagName.toLowerCase() === tagName
    )

    if (sameTagSiblings.length === 1) {
      segments.unshift(tagName)
    } else {
      const index = sameTagSiblings.indexOf(current) + 1
      segments.unshift(`${tagName}:nth-of-type(${index})`)
    }

    current = parentElement
    if (segments.length >= 6) {
      break
    }
  }

  return segments.join(" > ")
}

function getTextSnippet(element: Element): string {
  const htmlElement = element as HTMLElement
  const sourceText =
    (typeof htmlElement.innerText === "string" && htmlElement.innerText) ||
    htmlElement.textContent ||
    ""
  return toSnippet(sourceText, MAX_TEXT_SNIPPET_LENGTH)
}

export interface SelectorFingerprint {
  primarySelector: string
  selectorCandidates: SelectorCandidate[]
  pcId: string | null
  targetTag: string
  targetTextSnippet: string
  targetRole: string | null
  targetLabel: string | null
}

export function createSelectorFingerprint(element: Element): SelectorFingerprint {
  const candidates: SelectorCandidate[] = []
  const pcId = getNearestAttribute(element, "data-pc-id")
  const testId = getNearestAttribute(element, "data-testid")
  const targetRole = getRole(element)
  const targetLabel = getLabel(element)
  const targetTextSnippet = getTextSnippet(element)

  if (pcId) {
    candidates.push({
      strategy: "data-pc-id",
      selector: `[data-pc-id="${escapeForAttributeSelector(pcId)}"]`,
      confidence: "high",
    })
  }

  if (testId) {
    candidates.push({
      strategy: "data-testid",
      selector: `[data-testid="${escapeForAttributeSelector(testId)}"]`,
      confidence: "medium",
    })
  }

  if (targetRole) {
    const roleSelector = targetLabel
      ? `role=${targetRole}[name="${escapeForNameSelector(targetLabel)}"]`
      : `role=${targetRole}`
    candidates.push({
      strategy: "aria-role-name",
      selector: roleSelector,
      confidence: "medium",
    })
  }

  if (targetTextSnippet) {
    candidates.push({
      strategy: "text",
      selector: `text=${targetTextSnippet}`,
      confidence: "low",
    })
  }

  const cssPath = buildCssPath(element)
  candidates.push({
    strategy: "css-path",
    selector: cssPath || element.tagName.toLowerCase(),
    confidence: "low",
  })

  return {
    primarySelector: candidates[0]?.selector || element.tagName.toLowerCase(),
    selectorCandidates: candidates,
    pcId,
    targetTag: element.tagName.toLowerCase(),
    targetTextSnippet,
    targetRole,
    targetLabel,
  }
}
