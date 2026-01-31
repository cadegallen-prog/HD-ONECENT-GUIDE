/**
 * Shared constants for Penny Central
 * This is the single source of truth for values used across the site.
 */

// ============================================
// COMMUNITY CONSTANTS
// ============================================

/** Raw member count number (for calculations if needed) */
export const COMMUNITY_MEMBER_COUNT = 60000

/** Display string for member count (use this in JSX) */
export const COMMUNITY_MEMBER_COUNT_DISPLAY = "60,000+"

/** Badge text for OG images (single source of truth) */
export const MEMBER_COUNT_BADGE_TEXT = "60K+ Members"

/** Raw member count for badge (alternative for calculations) */
export const MEMBER_COUNT_RAW = 60000

/** Facebook group URL */
export const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/homedepotonecent"

/**
 * Internal Report Find page URL for submitting penny finds.
 */
export const SUBMIT_FIND_FORM_URL = "/report-find"

/** Kit (ConvertKit) Landing Page URL */
export const NEWSLETTER_URL = "https://pennycentral.kit.com"

// ============================================
// MONETIZATION CONSTANTS
// ============================================

/** Rakuten referral URL (affiliate) */
export const RAKUTEN_REFERRAL_URL = "https://www.rakuten.com/r/CADEGA16?eeid=28187"

/**
 * Optional donation URL for supporting PennyCentral.
 * If empty/undefined: hide donate button and show "Donations coming soon."
 * If set: show "Support PennyCentral" button linking to this URL.
 */
export const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL || ""
