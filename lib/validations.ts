// Zod validation schemas for forms
// Install: npm install zod

import { z } from "zod"

// Newsletter signup schema
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  state: z.string().optional(),
})

export type Newsletter = z.infer<typeof newsletterSchema>

// Store search schema
export const storeSearchSchema = z.object({
  state: z.string().optional(),
  zip: z
    .string()
    .regex(/^\d{5}$/, "ZIP code must be 5 digits")
    .optional(),
  storeId: z
    .string()
    .regex(/^\d{4}$/, "Store ID must be 4 digits")
    .optional(),
})

export type StoreSearch = z.infer<typeof storeSearchSchema>
