/**
 * Ezoic Ad Configuration
 *
 * KILL SWITCH: Set NEXT_PUBLIC_EZOIC_ENABLED=false in Vercel to disable all ads.
 * Note: Vercel requires a redeploy for env var changes to take effect.
 *
 * This module centralizes all ad-related configuration:
 * - EZOIC_ENABLED flag (simple toggle)
 * - AD_SLOTS (numeric IDs matching Ezoic dashboard)
 * - AD_MIN_HEIGHTS (CLS protection)
 */

// =============================================================================
// KILL SWITCH
// =============================================================================

/**
 * Master toggle for Ezoic ads.
 *
 * Enabled when:
 * - NEXT_PUBLIC_EZOIC_ENABLED is not explicitly "false"
 * - Running in production
 *
 * To disable: Set NEXT_PUBLIC_EZOIC_ENABLED=false in Vercel dashboard (then redeploy)
 */
export const EZOIC_ENABLED =
  process.env.NEXT_PUBLIC_EZOIC_ENABLED !== "false" && process.env.NODE_ENV === "production"

// =============================================================================
// AD SLOT IDS
// =============================================================================

/**
 * Ad slot IDs - must match Ezoic dashboard configuration.
 *
 * Naming convention: PAGE_POSITION
 * ID ranges:
 * - 100-109: Homepage
 * - 110-119: Penny List
 * - 120-129: SKU Detail
 * - 130-139: Guide/Content
 * - 140-149: Report Find / Forms
 */
export const AD_SLOTS = {
  // Homepage (3 slots)
  HOME_TOP: 100, // After TodaysFinds section
  HOME_MID: 101, // After "How it works" section
  HOME_BOTTOM: 102, // After Community, before Support

  // Penny List (3 slots) - NO top-of-page ad above results
  LIST_AFTER_N: 110, // After item #10 in grid
  LIST_MID: 111, // After item #20 in grid
  LIST_BOTTOM: 112, // After results grid

  // SKU Detail (2 slots)
  DETAIL_MID: 120, // After identifiers section
  DETAIL_BOTTOM: 121, // After related items

  // Guide / Content pages (3 slots)
  CONTENT_AFTER_P1: 130, // After first major section
  CONTENT_MID: 131, // Mid-page
  CONTENT_BOTTOM: 132, // Before final CTA

  // Report Find (1 slot) - minimal ads on conversion page
  REPORT_BOTTOM: 140,
} as const

// =============================================================================
// CLS PROTECTION - MIN HEIGHTS
// =============================================================================

/**
 * Minimum heights by ad format to prevent Cumulative Layout Shift (CLS).
 *
 * These values reserve space before ads load, ensuring content doesn't jump.
 * Heights based on standard IAB ad sizes.
 */
export const AD_MIN_HEIGHTS = {
  leaderboard: 90, // 728x90
  rectangle: 250, // 300x250
  largeRectangle: 280, // 336x280
  banner: 60, // 468x60
  mobileBanner: 50, // 320x50
  mobileLeaderboard: 100, // 320x100
} as const

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type AdSlotId = (typeof AD_SLOTS)[keyof typeof AD_SLOTS]
export type AdFormat = keyof typeof AD_MIN_HEIGHTS
