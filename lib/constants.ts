/**
 * Shared constants for Penny Central
 * This is the single source of truth for values used across the site.
 */

// ============================================
// COMMUNITY CONSTANTS
// ============================================

/** Raw member count number (for calculations if needed). */
export const COMMUNITY_MEMBER_COUNT = 64000

/** ISO date when the community member count was last verified. */
export const COMMUNITY_MEMBER_COUNT_LAST_VERIFIED = "2026-02-13"

/** Display string for member count (use this in JSX). */
export const COMMUNITY_MEMBER_COUNT_DISPLAY = `${COMMUNITY_MEMBER_COUNT.toLocaleString("en-US")}+`

/** Badge text for OG images (single source of truth). */
export const MEMBER_COUNT_BADGE_TEXT = `${Math.floor(COMMUNITY_MEMBER_COUNT / 1000)}K+ Members`

/** Raw member count alias retained for backward compatibility. */
export const MEMBER_COUNT_RAW = COMMUNITY_MEMBER_COUNT

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

/** Rakuten referral URL */
export const RAKUTEN_REFERRAL_URL = "https://www.rakuten.com/r/CADEGA16?eeid=28187"
