/**
 * Shared constants for Penny Central
 * This is the single source of truth for values used across the site.
 */

// ============================================
// COMMUNITY CONSTANTS
// ============================================

/** Raw member count number (for calculations if needed) */
export const COMMUNITY_MEMBER_COUNT = 50000

/** Display string for member count (use this in JSX) */
export const COMMUNITY_MEMBER_COUNT_DISPLAY = "50,000+"

/** Badge text for OG images (single source of truth) */
export const MEMBER_COUNT_BADGE_TEXT = "50K+ Members"

/** Raw member count for badge (alternative for calculations) */
export const MEMBER_COUNT_RAW = 50000

/** Facebook group URL */
export const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/homedepotonecent"

/**
 * Internal Report Find page URL for submitting penny finds.
 */
export const SUBMIT_FIND_FORM_URL = "/report-find"

/** Kit (ConvertKit) Landing Page URL */
export const NEWSLETTER_URL = "https://pennycentral.kit.com"

// ============================================
// AFFILIATE LINKS
// ============================================

/**
 * BeFrugal referral redirect path (internal route that 301s to the affiliate URL).
 * Use this for all BeFrugal links throughout the site.
 */
export const BEFRUGAL_REFERRAL_PATH = "/go/befrugal"
