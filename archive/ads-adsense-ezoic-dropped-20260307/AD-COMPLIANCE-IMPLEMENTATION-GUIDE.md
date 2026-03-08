# PennyCentral Ad Compliance & Privacy Implementation Guide

**Purpose**: Canonical single-source-of-truth for ad network compliance, privacy policy requirements, and third-party service disclosures. Written from an audit of the actual codebase — not aspirational.

**Target Audience**: Any agentic coder (AI or human) with full access to the PennyCentral codebase.

**Last Audited**: February 16, 2026

**Cross-references**:

- `.ai/topics/MONETIZATION.md` — timeline, decisions, and current status
- `.ai/topics/MONETIZATION_INCIDENT_REGISTER.md` — open incidents and next actions
- `app/privacy-policy/page.tsx` — the live privacy policy
- `app/layout.tsx` — all script integrations
- `public/ads.txt` — ad network authorization file

---

## Table of Contents

1. [Approval Hierarchy & Current Blockers](#1-approval-hierarchy--current-blockers)
2. [Active Services Inventory](#2-active-services-inventory)
3. [Service-by-Service Compliance](#3-service-by-service-compliance)
4. [Privacy Policy Gap Analysis](#4-privacy-policy-gap-analysis)
5. [ads.txt Management](#5-adstxt-management)
6. [Consent Management & CMP Strategy](#6-consent-management--cmp-strategy)
7. [Script Loading Order (Actual layout.tsx)](#7-script-loading-order-actual-layouttsx)
8. [Footer & Header Structure](#8-footer--header-structure)
9. [Contact Page Requirements](#9-contact-page-requirements)
10. [Cloudflare WAF / EU Traffic Blocking](#10-cloudflare-waf--eu-traffic-blocking)
11. [Code Cleanup Tasks](#11-code-cleanup-tasks)
12. [Multi-Network Activation Playbook](#12-multi-network-activation-playbook)
13. [Verification Checklist](#13-verification-checklist)

---

## 1. Approval Hierarchy & Current Blockers

### The Bottleneck

**Google Ad Manager domain approval** is the gateway to everything. Without it, neither Ezoic nor Monumetric can serve ads (both operate through MCM/Ad Manager). The privacy policy is the likely cause of the Ad Manager denial.

### Approval Status

| Network                    | Status                                     | Depends On                   | Notes                                                        |
| -------------------------- | ------------------------------------------ | ---------------------------- | ------------------------------------------------------------ |
| **Google Ad Manager**      | DENIED — resubmitted                       | Privacy policy fixes         | BLOCKER for Monumetric + Ezoic                               |
| **Monumetric** (preferred) | MCM accepted, awaiting advertiser approval | Ad Manager domain approval   | Paid $99 setup fee. Propel tier (10k-80k PV).                |
| **Ezoic** (backup)         | In domain approval                         | Ad Manager domain approval   | Scripts removed Feb 1 (bad UX). Kept as fallback.            |
| **Google AdSense**         | Rejected "Low Value Content", reapplied    | Sitemap fix + time           | Opens more demand partners. May or may not block Ad Manager. |
| **Mediavine Journey**      | Grow collecting prerequisite data          | 30 days of Grow data minimum | Exclusive when activated — would replace other ad engines.   |

### Priority Order

1. **Fix privacy policy** → unblock Google Ad Manager
2. **Implement Cloudflare EU block** → simplify GDPR compliance
3. **Whichever network approves first** → activate that one
4. **Keep all others ready** → don't burn bridges

---

## 2. Active Services Inventory

### Currently Running in Production

| Service                  | Integration                                | File Location                                | Privacy Disclosed?                              |
| ------------------------ | ------------------------------------------ | -------------------------------------------- | ----------------------------------------------- |
| Google AdSense           | `<script>` tag in `<head>`                 | `app/layout.tsx:124-128`                     | Vague — no explicit mention by name             |
| Mediavine Journey (Grow) | Inline script in `<head>`                  | `app/layout.tsx:186-193`                     | **NO — MISSING**                                |
| Google Analytics 4       | GTM + inline gtag with Consent Mode v2     | `app/layout.tsx:200-276`                     | Partial — in Sections 2, 5                      |
| Vercel Analytics         | `<Analytics />` component                  | `app/layout.tsx:310`                         | **NO — MISSING**                                |
| Vercel SpeedInsights     | `<SpeedInsights />` component              | `app/layout.tsx:311`                         | **NO — MISSING**                                |
| Sentry                   | `withSentryConfig` wrapper + global error  | `next.config.js`, `app/global-error.tsx`     | **NO — MISSING**                                |
| Resend                   | Email delivery for digests + transactional | `lib/email-sender.ts`                        | Yes — Sections 5, 6                             |
| Supabase                 | Auth + database (lists, subs, reports)     | Multiple files (`lib/supabase/*`)            | Only in data deletion section, not in providers |
| Monumetric               | ads.txt manager + route eligibility        | `public/ads.txt`, `lib/ads/launch-config.ts` | Yes — Section 5                                 |

### Not Running (but in ads.txt / privacy policy)

| Service | Status                      | Notes                                                                                       |
| ------- | --------------------------- | ------------------------------------------------------------------------------------------- |
| Ezoic   | Scripts removed Feb 1, 2026 | 65 entries in ads.txt (kept). Full disclosure in privacy policy (keep — still in approval). |

### Dead Code

| Service    | Location                                                          | Action     |
| ---------- | ----------------------------------------------------------------- | ---------- |
| ConvertKit | `lib/constants.ts:34` — `NEWSLETTER_URL` constant, never imported | **Remove** |

---

## 3. Service-by-Service Compliance

### 3a. Monumetric (Preferred Primary)

**What it does**: Programmatic ad management network. Manages ad inventory, serves ads through exchange partners, handles ads.txt.

**Integration**:

- `public/ads.txt` — Monumetric is the manager domain (line 1). 385+ exchange entries.
- `lib/ads/launch-config.ts` — `MONUMETRIC_LAUNCH_CONFIG` with provider-managed placement mode, interstitials (1hr frequency), Volt enabled for guide chapters.
- `lib/ads/route-eligibility.ts` — Hard-excluded routes: `/report-find`, `/store-finder`, `/support`, `/transparency`, `/contact`, `/privacy-policy`, `/terms-of-service`, `/do-not-sell-or-share`, `/unsubscribed`, `/login`, `/auth/callback`, plus `/lists/*`, `/s/*`, `/api/*`, `/admin/*`.

**Privacy policy requirement**: Monumetric places cookies and processes data for ad serving. Must link to their privacy policy.

- **Currently disclosed**: Yes — Section 5, with link to `https://www.monumetric.com/privacy-policy`
- **Status**: Adequate.

**ads.txt**: Managed by Monumetric. DO NOT manually edit. See [Section 5](#5-adstxt-management).

### 3b. Google AdSense

**What it does**: Google's ad network. Publisher ID: `ca-pub-5302589080375312`.

**Integration**:

- `app/layout.tsx:124-128` — Direct `<script async>` tag loading `adsbygoogle.js` with client ID. Disabled during Playwright tests.
- `public/ads.txt:756` — `google.com, pub-5302589080375312, DIRECT, f08c47fec0942fa0`

**Privacy policy requirement**: Must explicitly mention AdSense/Google Ad Manager by name. Must include the Google Partner Link.

- **Currently disclosed**: Vaguely — Section 5 says "Google or Google-certified ad networks" but does NOT mention AdSense by name or include the mandatory partner link.
- **MUST ADD**:
  - Explicit mention of "Google AdSense" and "Google Ad Manager" by name
  - **Mandatory link**: `https://policies.google.com/technologies/partner-sites` (Google checks for this exact URL)
  - Google Ad Settings link: `https://www.google.com/settings/ads`

**Interaction with other networks**: If Monumetric or Ezoic activates, they manage AdSense demand through their platform. The direct AdSense script in layout.tsx should be removed at that point — running both simultaneously can cause policy violations.

### 3c. Mediavine Journey / Grow

**What it does**: First-party engagement and analytics platform by Mediavine. Collects user behavior data (social sharing, email signups, browsing patterns). Serves as the 30-day prerequisite data collection period before qualifying for Journey by Mediavine (full ad network).

**Integration**:

- `app/layout.tsx:186-193` — Inline script with `data-grow-initializer`. Loads `https://faves.grow.me/main.js` with site ID `U2l0ZToyOWE5MzYwOS02MjA3LTQ4NzMtOGNjOC01ZDI5MjliMWZlYzY=`.
- `app/layout.tsx:135` — Preconnect hint to `https://faves.grow.me`.
- Installed January 12, 2026.

**Privacy policy requirement**: Grow collects user data. Must disclose its presence and link to Mediavine's privacy policy.

- **Currently disclosed**: **NO — completely missing.**
- **MUST ADD** to Section 5 (Third-Party Service Providers):
  ```
  Grow by Mediavine (Engagement Platform): We use Grow by Mediavine to provide
  social sharing features, email subscription tools, and first-party audience analytics.
  Grow may collect browsing behavior, device information, and interaction data.
  See Mediavine's privacy policy: https://www.mediavine.com/privacy-policy/
  ```

### 3d. Google Analytics 4

**What it does**: Traffic analytics. Measurement ID: `G-DJ4RJRX05E`. Includes Consent Mode v2 (defaults to "granted" for US/CA regions), return visit tracking via localStorage.

**Integration**:

- `app/layout.tsx:200-276` — GTM script + inline gtag configuration.
- Consent Mode v2: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` all default to `granted` for regions `US`, `CA`.
- Custom return visit tracking: stores sessions in `pc_sessions` localStorage key, fires `return_visit` event when 2+ sessions in 7-day window.
- Controlled by `NEXT_PUBLIC_ANALYTICS_ENABLED` env var (defaults to enabled).
- `components/analytics-tracker.tsx` — Client-side SPA tracking component.

**Privacy policy requirement**: Must disclose GA4 by name with measurement ID, describe data collected, link to Google's opt-out tools.

- **Currently disclosed**: Partially — mentioned in Section 2 (with measurement ID) and Section 5 (with opt-out tools).
- **Should improve**: Add the Google Partner Link (`policies.google.com/technologies/partner-sites`) to the GA4 disclosure.

### 3e. Vercel Analytics + SpeedInsights

**What it does**: Production performance monitoring. Vercel Analytics tracks page views and Web Vitals. SpeedInsights provides Core Web Vitals monitoring.

**Integration**:

- `app/layout.tsx:310` — `<Analytics />` from `@vercel/analytics/react`
- `app/layout.tsx:311` — `<SpeedInsights />` from `@vercel/speed-insights/next`
- Only active when: `NODE_ENV=production`, not Playwright, running on Vercel production.

**Privacy policy requirement**: Processes IP addresses and performance data. Should disclose.

- **Currently disclosed**: **NO — missing.**
- **MUST ADD** to Section 5:
  ```
  Vercel (Hosting, Analytics & Performance): Our site is hosted on Vercel.
  We use Vercel Analytics and Vercel Speed Insights to monitor page performance
  and Core Web Vitals. These services may process IP addresses, page URLs,
  and browser/device metadata. See Vercel's privacy policy:
  https://vercel.com/legal/privacy-policy
  ```

### 3f. Sentry

**What it does**: Error tracking and performance monitoring.

**Integration**:

- `next.config.js` — Wraps Next.js config with `withSentryConfig` from `@sentry/nextjs`.
- `app/global-error.tsx` — Global error boundary with Sentry reporting.
- Build-time configuration with source map upload, tree-shaking of logger statements.

**Privacy policy requirement**: Sentry processes error data which may include IP addresses, browser info, and stack traces.

- **Currently disclosed**: **NO — missing.**
- **MUST ADD** to Section 5:
  ```
  Sentry (Error Monitoring): We use Sentry to detect and diagnose technical errors.
  Sentry may process IP addresses, browser metadata, and error context.
  See Sentry's privacy policy: https://sentry.io/privacy/
  ```

### 3g. Supabase

**What it does**: Authentication (email OTP) and database (lists, subscriptions, report submissions, admin functions).

**Integration**:

- `lib/supabase/browser.ts` — Browser client using `@supabase/ssr`
- `lib/supabase/server.ts` — Server-side client
- `lib/supabase/lists.ts` — User lists functionality
- `app/api/subscribe/`, `app/api/unsubscribe/` — Email subscription management
- `app/api/submit-find/` — Report submissions
- `app/auth/callback/` — Auth callback handler

**Privacy policy requirement**: Manages user accounts and stores personal data. Must be named as a service provider.

- **Currently disclosed**: Only in data deletion section (Section 6, lines 244-247). Not in the service providers list.
- **MUST ADD** to Section 5:
  ```
  Supabase (Database & Authentication): We use Supabase to manage user accounts,
  store login credentials (via one-time passwords), and maintain user data
  (lists, subscriptions, report submissions). Supabase processes email addresses,
  login metadata, and user-generated content securely.
  See Supabase's privacy policy: https://supabase.com/privacy
  ```

### 3h. Resend

**What it does**: Email delivery for weekly digest and transactional emails.

**Integration**:

- `lib/email-sender.ts` — Sends from `updates@pennycentral.com`. Renders React email templates. Includes `List-Unsubscribe` and `List-Unsubscribe-Post` headers.

**Privacy policy requirement**: Processes email addresses and message content.

- **Currently disclosed**: Yes — Section 5 with link to `https://resend.com/legal/privacy-policy`, and Section 6 with unsubscribe/deletion info.
- **Status**: Adequate.

### 3i. Ezoic (Scripts Removed — Still in Approval)

**What it does**: Ad testing, optimization, and serving platform. Provides CMP (consent management).

**Current state**: All Ezoic scripts, components, and CSP entries were removed on February 1, 2026 due to poor UX (gray placeholder boxes). **However**, PennyCentral is still in the Ezoic domain approval process as a backup if Monumetric falls through.

**What remains**:

- `public/ads.txt:759-825` — 65+ Ezoic exchange entries (kept intentionally)
- `app/privacy-policy/page.tsx:185-219` — Full Ezoic disclosure + embed span `<span id="ezoic-privacy-policy-embed" />`
- `NEXT_PUBLIC_EZOIC_ENABLED` env var exists in test configuration

**Privacy policy**: Keep the current Ezoic disclosure. If Ezoic is activated in the future, the embed span at `id="ezoic-privacy-policy-embed"` will be populated automatically by Ezoic's cloud integration, or manually for JavaScript integration.

**If Ezoic activates**: See [Section 12 — Multi-Network Activation Playbook](#12-multi-network-activation-playbook).

### 3j. ConvertKit (Dead Code — Remove)

**What it is**: Email marketing platform. PennyCentral has a Kit (ConvertKit) landing page at `pennycentral.kit.com`.

**Current state**: The only reference is a never-imported constant:

```typescript
// lib/constants.ts:33-34
/** Kit (ConvertKit) Landing Page URL */
export const NEWSLETTER_URL = "https://pennycentral.kit.com"
```

This constant is never imported anywhere in the codebase. Resend handles all email delivery.

**Action**: Remove this dead constant. No privacy disclosure needed since it's not integrated.

---

## 4. Privacy Policy Gap Analysis

### File: `app/privacy-policy/page.tsx`

### What's Already Disclosed (Good)

- [x] GA4 with measurement ID (Section 2, 5)
- [x] Monumetric with privacy policy link (Section 5)
- [x] Ezoic with dedicated disclosure + embed span (Section 5)
- [x] Resend with privacy policy link (Section 5, 6)
- [x] Cookie/advertising disclosure with opt-out tools (Section 4)
- [x] CCPA/CPRA rights with link to Do Not Sell page (Section 7)
- [x] GPC browser signal honored (Section 7)
- [x] Data deletion process for Supabase, Resend, GA4 (Section 6)
- [x] Rakuten affiliate disclosure (Section 5)
- [x] EEA/UK/Switzerland consent section (Section 8)

### MISSING — Must Add

These are the gaps most likely causing Google Ad Manager denial:

| #   | What's Missing                                                                        | Where to Add                                 | Priority |
| --- | ------------------------------------------------------------------------------------- | -------------------------------------------- | -------- |
| 1   | **Google Partner Link** (`https://policies.google.com/technologies/partner-sites`)    | Section 5 — mandatory for AdSense/Ad Manager | CRITICAL |
| 2   | **Grow/Mediavine Journey disclosure**                                                 | Section 5 — active script, zero disclosure   | CRITICAL |
| 3   | **Explicit AdSense mention by name** with publisher ID                                | Section 5                                    | HIGH     |
| 4   | **Explicit Google Ad Manager mention**                                                | Section 5                                    | HIGH     |
| 5   | **Vercel hosting + Analytics + SpeedInsights disclosure**                             | Section 5                                    | HIGH     |
| 6   | **Sentry error tracking disclosure**                                                  | Section 5                                    | HIGH     |
| 7   | **Supabase as named service provider** (not just in deletion)                         | Section 5                                    | MEDIUM   |
| 8   | **Network Advertising Initiative opt-out** (`https://optout.networkadvertising.org/`) | Section 4 or 7                               | MEDIUM   |

### Should Update

| What                   | Current State                                  | Recommended Change                                                                                                         |
| ---------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Ezoic disclosure       | Written as if Ezoic is actively serving ads    | Reword to reflect current status: "PennyCentral has authorized Ezoic as an advertising partner. When active, Ezoic may..." |
| Google section         | Vague "Google or Google-certified ad networks" | Explicit: "Google AdSense (Publisher ID: ca-pub-5302589080375312) and Google Ad Manager"                                   |
| Service providers list | Unstructured bullet list                       | Consider consistent format: Name, Purpose, Data processed, Privacy link                                                    |

### Exact Additions to `app/privacy-policy/page.tsx`

#### Add to Section 5 — Third-Party Service Providers list:

```tsx
<li>
  <strong>Google AdSense & Ad Manager:</strong> We use Google AdSense
  (Publisher ID: ca-pub-5302589080375312) and Google Ad Manager to serve
  and manage advertising on this site. Google may use cookies and similar
  technologies to serve ads based on your prior visits. Learn how Google
  uses data:{" "}
  <a
    href="https://policies.google.com/technologies/partner-sites"
    target="_blank"
    rel="noopener noreferrer"
  >
    How Google uses information from sites that use its services
  </a>
  . Manage your ad personalization at{" "}
  <a
    href="https://www.google.com/settings/ads"
    target="_blank"
    rel="noopener noreferrer"
  >
    Google Ads Settings
  </a>
  .
</li>

<li>
  <strong>Grow by Mediavine (Engagement Platform):</strong> We use Grow
  by Mediavine to provide social sharing features and first-party
  audience analytics. Grow may collect browsing behavior, device
  information, and interaction data. See{" "}
  <a
    href="https://www.mediavine.com/privacy-policy/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Mediavine&apos;s privacy policy
  </a>
  .
</li>

<li>
  <strong>Supabase (Database & Authentication):</strong> We use Supabase
  to manage user accounts, authentication (via one-time passwords), and
  user data (lists, subscriptions, report submissions). Supabase
  processes email addresses and login metadata securely. See{" "}
  <a
    href="https://supabase.com/privacy"
    target="_blank"
    rel="noopener noreferrer"
  >
    Supabase&apos;s privacy policy
  </a>
  .
</li>

<li>
  <strong>Vercel (Hosting & Performance):</strong> Our site is hosted on
  Vercel. We use Vercel Analytics and Vercel Speed Insights to monitor
  page performance. These services may process IP addresses, page URLs,
  and browser metadata. See{" "}
  <a
    href="https://vercel.com/legal/privacy-policy"
    target="_blank"
    rel="noopener noreferrer"
  >
    Vercel&apos;s privacy policy
  </a>
  .
</li>

<li>
  <strong>Sentry (Error Monitoring):</strong> We use Sentry to detect
  and diagnose technical errors. Sentry may process IP addresses,
  browser metadata, and error context. See{" "}
  <a
    href="https://sentry.io/privacy/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Sentry&apos;s privacy policy
  </a>
  .
</li>
```

#### Add to Section 4 (or Section 7) — opt-out links:

```tsx
<li>
  <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer">
    Network Advertising Initiative (NAI) Opt-Out
  </a>
</li>
```

---

## 5. ads.txt Management

### Current State

**File**: `public/ads.txt`
**Manager**: Monumetric (generated 2026-01-26)
**Size**: ~825 lines

### Architecture

| Section               | Entries       | Purpose                                                      |
| --------------------- | ------------- | ------------------------------------------------------------ |
| Monumetric header     | Lines 1-5     | Manager domain declaration                                   |
| Exchange partners     | Lines 6-755   | 300+ ad exchanges authorized through Monumetric              |
| Google AdSense DIRECT | Line 756      | `google.com, pub-5302589080375312, DIRECT, f08c47fec0942fa0` |
| Ezoic section         | Lines 759-825 | 65+ Ezoic exchange entries (legacy, kept intentionally)      |

### Rules

1. **NEVER replace the entire file.** It contains 800+ entries that represent live exchange relationships.
2. **Updates go through Monumetric's console.** They manage the file content.
3. **Adding new networks**: Add entries at the end. Don't remove existing entries unless instructed by the network.
4. **Ezoic entries**: Kept as-is. If Ezoic activates, these are already in place.
5. **Monumetric entries for potential future networks (e.g., Mediavine)**: Use Monumetric's ads.txt manager to authorize additional partners.

### Verification

- Must be accessible at `https://pennycentral.com/ads.txt` and `https://www.pennycentral.com/ads.txt`
- Check with Google's [ads.txt validator](https://adstxt.guru/) or the IAB ads.txt validator
- Confirm no syntax errors (each line: `domain, publisher-id, relationship, cert-authority-id`)

---

## 6. Consent Management & CMP Strategy

### Current State

- **No CMP banner/dialog exists** on the site.
- Consent Mode v2 in `layout.tsx:214-220` is hardcoded to `granted` for all categories (`ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage`) for regions US and CA.
- No user-facing consent choice mechanism.
- Global Privacy Control (GPC) is mentioned in privacy policy but no implementation code exists.

### Cloudflare EU Block — NOT Yet Implemented

Until the Cloudflare EU/UK traffic block is configured (see [Section 10](#10-cloudflare-waf--eu-traffic-blocking)), there is GDPR exposure for any EU visitors.

### Strategy

| Scenario                 | CMP Required?                          | Action                                                                          |
| ------------------------ | -------------------------------------- | ------------------------------------------------------------------------------- |
| After EU block is active | No GDPR CMP needed                     | Current CCPA setup (Do Not Sell page) is sufficient for US                      |
| If Ezoic activates       | Yes — Ezoic CMP required               | Add Ezoic CMP scripts (see [Section 12](#12-multi-network-activation-playbook)) |
| If Monumetric activates  | No publisher-side CMP required         | Monumetric handles consent through their platform                               |
| If Mediavine activates   | Yes — Mediavine provides their own CMP | Follow Mediavine's integration guide                                            |
| For AdSense approval     | Consent mechanism recommended          | Current Consent Mode v2 defaults + Do Not Sell page may suffice                 |

### What NOT to Do

- Do NOT add Ezoic CMP scripts unless Ezoic is actually being activated.
- Do NOT build a custom cookie consent banner — ad networks require IAB TCF v2.2 certified CMPs, not homemade ones.
- Do NOT change the Consent Mode v2 defaults without understanding the impact on ad revenue modeling.

---

## 7. Script Loading Order (Actual layout.tsx)

This is the REAL script order in `app/layout.tsx` as of February 16, 2026. Any guide that shows different code is wrong.

### `<head>` Section

```
1. Google AdSense             (lines 124-128)  — async <script>, disabled during Playwright
2. Preconnect hints           (lines 132-136)  — GTM, GA, Vercel, Grow, OpenStreetMap
3. Analytics meta tag         (lines 139-142)  — pennycentral:analytics enabled status
4. Facebook App ID            (lines 147-149)  — conditional, if env var set
5. JSON-LD structured data    (lines 152-180)  — WebSite + Organization schemas
6. Mediavine Journey (Grow)   (lines 186-193)  — inline script, data-grow-initializer
7. GA4 + Consent Mode v2      (lines 200-276)  — conditional on ANALYTICS_ENABLED
```

### `<body>` Section

```
8. Skip link                  (lines 280-285)  — accessibility
9. ThemeProvider > AnalyticsTracker > AuthProvider > CommandPaletteProvider
10. Navbar                    (line 297)
11. Main content + Footer     (lines 300-303)
12. Toaster                   (line 305)
13. Vercel Analytics          (line 310)        — conditional, production + Vercel only
14. Vercel SpeedInsights      (line 311)        — conditional, production + Vercel only
```

### Key Notes

- AdSense loads first in `<head>` (async, non-blocking).
- Grow loads in `<head>` via inline script with `defer`.
- GA4 loads conditionally based on `NEXT_PUBLIC_ANALYTICS_ENABLED` env var.
- Vercel scripts load LAST, only in production on Vercel.
- **No Ezoic scripts are present.** They were removed Feb 1, 2026.

### If Adding Ezoic CMP (Future)

Ezoic CMP scripts MUST load before ALL other scripts. They would need to be inserted at the very top of `<head>`, before the AdSense script:

```typescript
{/* EZOIC CMP — add ONLY if activating Ezoic */}
<Script
  id="ezoic-privacy-cmp"
  src="https://the.gatekeeperconsent.com/cmp.min.js"
  strategy="beforeInteractive"
  data-cfasync="false"
/>
<Script
  id="ezoic-privacy-gatekeeper"
  src="https://cmp.gatekeeperconsent.com/min.js"
  strategy="beforeInteractive"
  data-cfasync="false"
/>

{/* EZOIC AD ENGINE — add ONLY if activating Ezoic */}
<Script
  id="ezoic-ads"
  src="//www.ezojs.com/ezoic/sa.min.js"
  strategy="afterInteractive"
/>
```

**Do NOT add these scripts now.** They are only needed if/when Ezoic is activated.

---

## 8. Footer & Header Structure

### Footer (Keep Current — Add FAQ Link)

**File**: `components/footer.tsx`

The current 3-column footer is well-structured and should be kept:

| Column       | Links                                                     |
| ------------ | --------------------------------------------------------- |
| **Brand**    | PennyCentral logo + tagline                               |
| **Navigate** | Penny List, Guide, Store Finder, Report a Find, Community |
| **Company**  | About, Contact, Transparency                              |
| **Legal**    | Privacy Policy, Terms of Service, Do Not Sell or Share    |

**One change**: Add FAQ to the Navigate column. FAQ is currently only in the navbar.

**Why keep navigation links**: Ad network reviewers look for a "live, functional site." Navigation links in the footer signal depth of content and good UX. Stripping to legal-only would make the site look thin.

**Why keep Transparency**: It demonstrates editorial independence — revenue doesn't influence content. This is a positive signal for ad network approval.

**Why keep Do Not Sell as standalone page**: The current `/do-not-sell-or-share` page has a structured request form with multiple privacy request types (access, deletion, correction, opt-out). This is MORE compliant than a simple jump link to a section of the privacy policy.

### Header/Navbar (Keep Current)

**File**: `components/navbar.tsx`

Current structure is comprehensive and should NOT be changed:

| Item          | Route           | Notes                    |
| ------------- | --------------- | ------------------------ |
| Penny List    | `/penny-list`   | Core functionality       |
| Guide         | `/guide`        | Dropdown with 7 chapters |
| Store Finder  | `/store-finder` | Core functionality       |
| My List       | `/lists`        | Auth-gated               |
| Report a Find | `/report-find`  | Community feature        |
| FAQ           | `/faq`          | Help/support             |
| Theme toggle  | N/A             | Sun/Moon icon            |

**No legal links in the header.** All compliance links belong in the footer.

---

## 9. Contact Page Requirements

### File: `app/contact/page.tsx`

The contact page needs an explicit **Data Deletion & Account Closure** section. Currently, the form has a "Privacy request" topic option, but no dedicated section explaining the process.

### Required Addition

Add a clearly visible section below the contact form:

```tsx
<div className="mt-12 p-6 bg-[var(--bg-subtle)] rounded-lg border border-[var(--border-default)]">
  <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
    Data Deletion & Account Closure
  </h3>
  <p className="text-sm text-[var(--text-secondary)]">
    You have the right to request deletion of your personal data. To delete your account and remove
    all associated data from our systems (including data stored via <strong>Supabase</strong> and
    email records managed through <strong>Resend</strong>), please email{" "}
    <a href="mailto:contact@pennycentral.com" className="text-[var(--cta-primary)] underline">
      contact@pennycentral.com
    </a>{" "}
    with the subject line &ldquo;Data Deletion Request.&rdquo; We will process your request and
    confirm deletion within 30 days.
  </p>
</div>
```

### Requirements

- Email: `contact@pennycentral.com` (must be active and monitored)
- Processing commitment: 30 days
- Must name Supabase and Resend by name
- Must be accessible without login

---

## 10. Cloudflare WAF / EU Traffic Blocking

### Status: NOT YET IMPLEMENTED

**Priority**: HIGH — until this is configured, there is GDPR exposure for EU visitors reaching the site.

### Implementation Steps (Cloudflare Dashboard — Not Code)

1. Log into Cloudflare Dashboard for `pennycentral.com`
2. Navigate to: **Security > WAF > Custom Rules > Create Rule**
3. Configure:
   ```
   Rule Name: Block_EU_UK_Traffic
   Expression: (ip.geoip.continent eq "EU") or (ip.geoip.country eq "GB")
   Action: Block
   ```
4. Deploy the rule.

### Verification

- Use a VPN set to a EU country (e.g., France, Germany) or UK
- Confirm the site returns **403 Forbidden**
- Test from US IP to confirm site still works normally

### Impact

Once active:

- No GDPR compliance required (no EU visitors)
- No "Reject All" cookie banner needed
- Simplifies CMP requirements to US-only (CCPA)
- Section 8 of privacy policy ("Regional Consent Controls — EEA/UK/Switzerland") can be updated to note EU access is blocked

---

## 11. Code Cleanup Tasks

| Task                            | File                                  | Action                                                                                                                |
| ------------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Remove dead ConvertKit constant | `lib/constants.ts:33-34`              | Delete the `NEWSLETTER_URL` constant and its comment                                                                  |
| Keep Ezoic privacy embed span   | `app/privacy-policy/page.tsx:211`     | Keep `<span id="ezoic-privacy-policy-embed" />` — needed if Ezoic activates                                           |
| Keep Ezoic disclosure section   | `app/privacy-policy/page.tsx:210-219` | Keep but consider rewording: "PennyCentral has authorized Ezoic as an advertising partner. When active, Ezoic may..." |
| Add FAQ to footer               | `components/footer.tsx`               | Add FAQ link to Navigate column                                                                                       |

---

## 12. Multi-Network Activation Playbook

Only ONE ad placement engine should be active at a time. Running Ezoic + Monumetric + direct AdSense simultaneously will cause conflicts and policy violations.

### Scenario A: Monumetric Activates (Preferred)

1. Monumetric ads.txt entries are already present (they manage the file).
2. Monumetric will provide ad placement code/scripts — follow their instructions.
3. **Remove the direct AdSense script** from `layout.tsx:124-128` — Monumetric manages AdSense demand through their platform.
4. Privacy policy: Monumetric disclosure already present. No changes needed.
5. Grow/Journey can continue running alongside Monumetric (Grow is engagement, not ad placement).

### Scenario B: Ezoic Activates (Backup)

1. Ezoic ads.txt entries are already present (lines 759-825).
2. **Add Ezoic CMP scripts** to top of `<head>` in `layout.tsx` (see [Section 7](#7-script-loading-order-actual-layouttsx) for exact code).
3. **Add Ezoic ad engine script** after CMP scripts.
4. **Remove the direct AdSense script** — Ezoic manages AdSense through their platform.
5. Privacy policy: Ezoic disclosure already present. Embed span already in place.
6. Go to Ezoic Dashboard > Settings > Privacy and copy the specific HTML disclosure — insert into privacy policy where the embed span is.
7. Configure Ezoic CMP in their dashboard: Set to "US State Laws" mode (since EU traffic is blocked).

### Scenario C: AdSense Approves (Standalone)

1. AdSense script is already in `layout.tsx`. No code changes needed.
2. ads.txt DIRECT entry already present.
3. Can run alongside Monumetric if Monumetric manages AdSense demand.
4. Should NOT run direct AdSense alongside Ezoic's integration.
5. Privacy policy: Add explicit AdSense mention (see [Section 4](#4-privacy-policy-gap-analysis)).

### Scenario D: Journey by Mediavine Qualifies

1. Grow script is already collecting prerequisite data.
2. When qualified (30+ days), Mediavine provides their own:
   - Ad scripts (replace other ad engines — Mediavine is exclusive)
   - CMP (their own consent management)
   - ads.txt entries (add to existing file, don't replace)
3. **Remove** Monumetric/Ezoic ad scripts when switching to Mediavine.
4. **Add** Mediavine privacy disclosure to privacy policy.
5. Update ads.txt with Mediavine entries (additive).
6. Monumetric ads.txt entries can remain until Monumetric confirms removal is OK.

---

## 13. Verification Checklist

### Privacy Policy Compliance

- [ ] Google Partner Link present: `https://policies.google.com/technologies/partner-sites`
- [ ] Google AdSense mentioned by name with publisher ID
- [ ] Google Ad Manager mentioned by name
- [ ] Grow/Mediavine Journey disclosed with privacy link
- [ ] Vercel (hosting + Analytics + SpeedInsights) disclosed with privacy link
- [ ] Sentry disclosed with privacy link
- [ ] Supabase listed as named service provider (not just in deletion section)
- [ ] Resend disclosed (already done)
- [ ] Monumetric disclosed (already done)
- [ ] Ezoic disclosed (already done — verify wording is accurate)
- [ ] Rakuten affiliate disclosure present (already done)
- [ ] NAI opt-out link present: `https://optout.networkadvertising.org/`
- [ ] CCPA/Do Not Sell section present (already done)
- [ ] Data deletion process documented (already done)

### Technical Compliance

- [ ] `ads.txt` accessible at `https://pennycentral.com/ads.txt`
- [ ] `ads.txt` accessible at `https://www.pennycentral.com/ads.txt`
- [ ] Sitemap includes `/privacy-policy`, `/terms-of-service`, `/contact`, `/do-not-sell-or-share`
- [ ] Privacy Policy page is crawlable (no `noindex`, no `nofollow` on link)
- [ ] All footer legal links working correctly
- [ ] `contact@pennycentral.com` is active and monitored
- [ ] No "Coming Soon", "Under Construction", or placeholder text anywhere
- [ ] No donation buttons or "Buy me a Coffee" links
- [ ] No broken pages or 404 errors on legal pages

### Cloudflare EU Block

- [ ] WAF rule created and deployed
- [ ] Verified: EU VPN returns 403
- [ ] Verified: US access unaffected

### Contact Page

- [ ] Data Deletion & Account Closure section present
- [ ] Supabase and Resend named in deletion process
- [ ] Email address clearly visible
- [ ] 30-day processing commitment stated

### Code Cleanup

- [ ] ConvertKit `NEWSLETTER_URL` constant removed from `lib/constants.ts`
- [ ] FAQ link added to footer Navigate section
- [ ] No Ezoic scripts in layout.tsx (unless Ezoic has been activated)

### Content Quality (for Ad Network Approval)

- [ ] 15+ high-quality content pages (guide chapters, FAQ, informational pages)
- [ ] No thin content on indexed pages
- [ ] Sitemap shows pillar pages only (currently 18 URLs)
- [ ] All pages fully functional and mobile-responsive

---

## Appendix: Key URLs & IDs

| Item                           | Value                                                       |
| ------------------------------ | ----------------------------------------------------------- |
| AdSense Publisher ID           | `ca-pub-5302589080375312`                                   |
| GA4 Measurement ID             | `G-DJ4RJRX05E`                                              |
| Grow Site ID                   | `U2l0ZToyOWE5MzYwOS02MjA3LTQ4NzMtOGNjOC01ZDI5MjliMWZlYzY=`  |
| Contact Email                  | `contact@pennycentral.com`                                  |
| Updates Email                  | `updates@pennycentral.com`                                  |
| Domain                         | `pennycentral.com` / `www.pennycentral.com`                 |
| Google Partner Link            | `https://policies.google.com/technologies/partner-sites`    |
| Google Ad Settings             | `https://www.google.com/settings/ads`                       |
| NAI Opt-Out                    | `https://optout.networkadvertising.org/`                    |
| DAA Opt-Out                    | `https://optout.aboutads.info/`                             |
| Monumetric Privacy             | `https://www.monumetric.com/privacy-policy`                 |
| Monumetric Advertising Privacy | `https://www.monumetric.com/publisher-advertising-privacy/` |
| Ezoic Privacy                  | `https://www.ezoic.com/privacy-policy/`                     |
| Ezoic Disclosure URL           | `http://g.ezoic.net/privacy/pennycentral.com`               |
| Mediavine Privacy              | `https://www.mediavine.com/privacy-policy/`                 |
| Resend Privacy                 | `https://resend.com/legal/privacy-policy`                   |
| Supabase Privacy               | `https://supabase.com/privacy`                              |
| Vercel Privacy                 | `https://vercel.com/legal/privacy-policy`                   |
| Sentry Privacy                 | `https://sentry.io/privacy/`                                |

---

**This guide supersedes all previous versions.** Any agent working on ad compliance should treat this as the canonical reference and cross-check against the actual codebase before making changes.
