// Zod validation schemas for forms
// Install: npm install zod

import { z } from "zod"

// Recent Finds submission schema
export const recentFindSchema = z.object({
  date: z.date(),
  sku: z.string().optional(),
  item: z.string().min(10, "Description must be at least 10 characters").max(200, "Description must be under 200 characters"),
  storeNumber: z.string().regex(/^\d{4}$/, "Store number must be 4 digits"),
  state: z.string().min(2, "Please select a state"),
  photo: z.instanceof(File).optional(),
})

export type RecentFind = z.infer<typeof recentFindSchema>

// Trip Tracker schema
export const tripSchema = z.object({
  date: z.date(),
  stores: z.string().min(1, "Enter at least one store"),
  milesDriven: z.number().min(0, "Miles must be positive"),
  timeSpent: z.number().min(0, "Time must be positive"),
  itemsFound: z.number().int().min(0, "Items must be a positive integer"),
  totalSaved: z.number().min(0, "Savings must be positive"),
  gasCost: z.number().min(0, "Gas cost must be positive").optional(),
})

export type Trip = z.infer<typeof tripSchema>

// Newsletter signup schema
export const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  state: z.string().optional(),
})

export type Newsletter = z.infer<typeof newsletterSchema>

// Store search schema
export const storeSearchSchema = z.object({
  state: z.string().optional(),
  zip: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits").optional(),
  storeNumber: z.string().regex(/^\d{4}$/, "Store number must be 4 digits").optional(),
})

export type StoreSearch = z.infer<typeof storeSearchSchema>
