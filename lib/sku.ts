import { z } from "zod"

export const ALLOWED_SKU_LENGTHS = [6, 10] as const

export function normalizeSku(input: string): string {
  return (input ?? "").replace(/\D/g, "")
}

function isAllSameDigit(value: string): boolean {
  return /^(\d)\1+$/.test(value)
}

function isRepeatedPattern(value: string): boolean {
  const len = value.length
  for (let size = 2; size <= len / 2; size += 1) {
    if (len % size !== 0) continue
    const pattern = value.slice(0, size)
    if (pattern.repeat(len / size) === value) return true
  }
  return false
}

export function validateSku(rawSku: string): { normalized: string; error?: string } {
  const normalized = normalizeSku(rawSku)

  if (!normalized) {
    return { normalized, error: "Enter a SKU to continue." }
  }

  if (!/^\d+$/.test(normalized)) {
    return { normalized, error: "SKU must be digits only." }
  }

  if (!ALLOWED_SKU_LENGTHS.includes(normalized.length as (typeof ALLOWED_SKU_LENGTHS)[number])) {
    return { normalized, error: "SKU must be 6 or 10 digits." }
  }

  if (normalized.length === 10 && !normalized.startsWith("101") && !normalized.startsWith("100")) {
    return {
      normalized,
      error:
        '10-digit SKUs should start with "100" or "101". If you used a receipt, you probably entered a UPC/barcode instead.',
    }
  }

  if (isAllSameDigit(normalized) || /^0+$/.test(normalized)) {
    return {
      normalized,
      error:
        "That SKU looks like a placeholder (all the same digit). Please double-check the real SKU.",
    }
  }

  if (isRepeatedPattern(normalized)) {
    return {
      normalized,
      error: "That SKU looks invalid (repeating pattern). Please double‑check the real SKU.",
    }
  }

  return { normalized }
}

export const skuSchema = z
  .string()
  .transform((value) => normalizeSku(value))
  .superRefine((value, ctx) => {
    const { error } = validateSku(value)
    if (error) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: error })
    }
  })
