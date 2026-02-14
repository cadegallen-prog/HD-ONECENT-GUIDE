# PennyCentral "Masterpiece" Sitemap + Trust Content Package

**Prepared for:** Cade (founder)  
**Last updated:** March 1, 2026  
**Primary objective:** Stronger than query-parameter competitor patterns (`/?info=`), while keeping legal/trust UX clean, scalable, and ad-network friendly.

---

## 1) URL Architecture (Clean, Scalable, SEO-Friendly)

### Core rules

- Use **path-based URLs** (not `/?info=` query pages).
- Use lowercase + kebab-case slugs.
- Keep one canonical URL per topic.
- Avoid duplicate header/footer labels (example: `Privacy` in one place and `Privacy Policy` in another).

### Recommended route map

#### Core utility (traffic + retention)

- `/` (Home)
- `/penny-list`
- `/report-find`
- `/store-finder`
- `/guide`
- `/faq`

#### Trust + legal (reviewer confidence)

- `/about`
- `/contact`
- `/transparency`
- `/privacy-policy`
- `/terms-of-service`
- `/do-not-sell-or-share` (first-party CCPA/CPRA choices page)

#### Optional trust extensions (future)

- `/editorial-policy`
- `/corrections-policy`
- `/advertising-disclosure`

---

## 2) Navigation Strategy (No Redundancy, Better UX)

### Header navigation (top intent links only)

- Penny List
- Report a Find
- Guide
- Store Finder
- FAQ
- About
- Contact

### Footer navigation (trust/legal + company)

- About
- Contact
- Transparency
- Privacy Policy
- Terms of Service
- Do Not Sell or Share

### Retention pattern

On legal/policy pages, add a subtle utility return path near the top:

- **"← Back to Penny List"** (small text link, not a giant CTA)

This retains users without making legal pages look manipulative.

### Ad policy recommendation

- **Do not render display ads on legal/trust routes** (`/privacy-policy`, `/terms-of-service`, `/do-not-sell-or-share`, `/contact`, optionally `/about`).
- This improves perceived legitimacy and review trust.

---

## 3) `app/sitemap.ts` Blueprint (Drop-In Example)

```ts
import { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.pennycentral.com"
  const now = new Date().toISOString()

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1.0 },

    // Core utility routes
    { url: `${base}/penny-list`, lastModified: now, changeFrequency: "hourly", priority: 0.95 },
    { url: `${base}/report-find`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/store-finder`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/guide`, lastModified: now, changeFrequency: "monthly", priority: 0.85 },
    { url: `${base}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },

    // Trust + legal routes
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/transparency`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    {
      url: `${base}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    {
      url: `${base}/do-not-sell-or-share`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ]
}
```

---

## 4) Privacy Policy (Professional Draft)

# Privacy Policy

**Last Updated: March 1, 2026**

PennyCentral ("we," "us," "our") respects your privacy. This Privacy Policy explains what information we collect, how we use it, how we share it, and the choices available to you.

## 1. Scope

This Privacy Policy applies to https://www.pennycentral.com and related services, including the Penny List, Report a Find workflow, and supporting informational pages.

## 2. Information We Collect

### A) Information collected automatically

When you use the site, we may automatically collect:

- IP address (used for approximate location and security)
- Browser type/version
- Device type and operating system
- Pages viewed and feature interactions
- Referral URL, session timestamps, and similar usage telemetry

### B) Information you submit

We may collect information you choose to provide, such as:

- Report submissions (SKU details, store/location context, optional notes)
- Contact form details (name, email, message)
- Other support or correction requests

### C) Local browser storage

Some preferences and saved items may be stored in your browser (localStorage/sessionStorage) to improve your experience.

## 3. How We Use Information

We use information to:

- Operate and maintain the site
- Show relevant local deal data
- Improve reliability, usability, and performance
- Detect abuse, fraud, and technical errors
- Respond to messages and support requests
- Support monetization through affiliate links and, when enabled, advertising

## 4. Cookies and Similar Technologies

### A) Essential cookies/technologies (always on)

Used for core functionality, security, and preferences.

### B) Non-essential cookies/technologies (optional where required)

Used for analytics and advertising/personalization when applicable.

If we enable ad-tech or advanced analytics requiring consent, we will present a consent mechanism and store your choices.

## 5. Affiliate Disclosure

PennyCentral participates in affiliate programs. Some links may generate a commission when you click or make a qualifying purchase.

- Commissions are paid by affiliate networks or retailers, not by you directly.
- Affiliate relationships do not override our editorial standards.

## 6. Advertising and Future Ad Network Integration

PennyCentral may work with third-party ad partners (for example, Mediavine or similar providers).

When active, partners may collect data such as:

- IP address
- Device/browser information
- Cookie IDs or advertising identifiers
- Page interaction and ad interaction data

This may be used for ad delivery, frequency capping, measurement, fraud prevention, and (where permitted) interest-based advertising.

When an ad network is enabled, this section and our choices page will be updated with:

- Partner-specific disclosure language
- Partner list links
- Opt-out and privacy controls

## 7. How We Share Information

We may share limited information with:

- Service providers (hosting, analytics, forms, anti-abuse tools)
- Affiliate platforms (for conversion tracking)
- Advertising partners (if/when ads are enabled)
- Authorities when legally required

We do not sell personal information for money.

## 8. Data Retention

We retain data only as long as necessary for the purposes described in this policy, legal obligations, dispute handling, and security operations.

## 9. Your U.S. Privacy Rights (including CCPA/CPRA)

Depending on your state, you may have rights to request access, correction, deletion, and additional disclosures regarding personal information.

### Do Not Sell or Share

We provide a first-party mechanism at:

- **https://www.pennycentral.com/do-not-sell-or-share**

You can submit your request there without creating an account.

### Global Privacy Control (GPC)

Where required by law, we will treat a recognized browser GPC signal as an opt-out request for sale/share contexts.

## 10. Children’s Privacy

PennyCentral is not directed to children under 13, and we do not knowingly collect personal information from children under 13.

## 11. Security

We use reasonable administrative, technical, and organizational safeguards to protect data. No method of storage or transmission is 100% secure.

## 12. International Visitors

If you access the site outside the United States, your information may be processed in the United States or other jurisdictions where service providers operate.

## 13. Changes to This Policy

We may update this Privacy Policy periodically. We will update the "Last Updated" date above when material changes are made.

## 14. Contact

Questions about privacy practices: **contact@pennycentral.com**

---

## 5) Terms of Service (Professional Draft)

# Terms of Service

**Last Updated: March 1, 2026**

By accessing or using PennyCentral, you agree to these Terms of Service.

## 1. Service Description

PennyCentral is an informational aggregator and community utility focused on retail markdown and penny-item intelligence.

- We do **not** sell products.
- We do **not** process transactions.
- We do **not** control store pricing, inventory, or policy enforcement.

## 2. Data Accuracy and Availability Disclaimer

Retail data changes quickly and may be delayed, incomplete, inaccurate, or unavailable.

You are responsible for confirming final price, stock, and terms directly with the retailer before making purchase or travel decisions.

## 3. No Guarantee of Deal Outcome

We do not guarantee any listed item, markdown, or promotion will be available, honored, or purchasable at your store.

## 4. User Responsibilities

You agree to:

- Use the site lawfully
- Avoid harmful or abusive behavior
- Avoid scraping, reverse engineering, or interfering with site systems
- Avoid submitting knowingly false reports

## 5. Affiliate Relationships

Some outbound links may be affiliate links, and we may earn a commission from qualifying activity.

Affiliate compensation does not change your price and does not guarantee product availability.

## 6. Third-Party Content and Ads

If advertising is enabled, third-party ads may appear. We do not control third-party ad content, availability, or claims.

## 7. Intellectual Property

Site design, content structure, and software are owned by PennyCentral or licensors and protected by law.

No unauthorized copying, scraping, redistribution, or derivative use is permitted without permission.

## 8. Limitation of Liability

To the fullest extent permitted by law, PennyCentral is not liable for direct, indirect, incidental, consequential, special, or punitive damages arising from use of the site.

This includes losses tied to:

- Inaccurate or stale deal data
- Out-of-stock or unavailable products
- Store refusal to honor markdowns
- Travel costs, missed opportunities, or reliance damages

## 9. Indemnification

You agree to indemnify and hold PennyCentral harmless from claims resulting from your misuse of the site or your violation of these terms.

## 10. Modifications

We may update these terms at any time. Continued use after updates means acceptance of revised terms.

## 11. Governing Law

These terms are governed by U.S. law and applicable state law, without regard to conflict-of-law principles.

## 12. Contact

Questions about these terms: **contact@pennycentral.com**

---

## 6) About Us (Trust-Building Draft)

# About PennyCentral

**Last Updated: March 1, 2026**

PennyCentral exists to help deal hunters make smarter, faster decisions when searching for major markdowns and penny items at Home Depot.

## Our Mission

Our mission is simple: make penny hunting more accurate, less frustrating, and more transparent.

## What We Do

- Track and organize community-reported penny and clearance intelligence
- Provide practical guides so users understand how markdown cycles work
- Help users verify details before driving to stores

## Why People Use PennyCentral

- Faster discovery of likely markdown opportunities
- Better context before making a store trip
- Cleaner, easier tools than scattered social posts

## Our Standards

We prioritize:

1. Clarity over hype
2. Accuracy over speed
3. Transparency in monetization and disclosures

## Important Note

PennyCentral is independent and is not affiliated with or endorsed by Home Depot.

---

## 7) FAQ (Exhaustive Draft)

# Frequently Asked Questions

**Last Updated: March 1, 2026**

## General

### What is PennyCentral?

PennyCentral is a deal-intelligence utility that helps shoppers find likely penny and deep-clearance opportunities, primarily for Home Depot.

### Do you sell products directly?

No. PennyCentral is an information service, not a retailer.

### Are you affiliated with Home Depot?

No. PennyCentral is independent.

## Accuracy and Expectations

### Is every deal guaranteed to be available?

No. Inventory and pricing can change quickly, and stores may handle markdowns differently.

### Why did I not find an item in-store?

Common reasons include: sold out, moved, removed, returned to vendor, delayed data refresh, or store-level policy differences.

### Should I call the store first?

For longer trips or higher-value items, yes. Calling can reduce wasted travel.

## Penny Items

### What is a penny item?

A penny item is typically a product marked down to $0.01 late in a clearance cycle, often intended for removal from active sales floor inventory.

### Will every store sell penny items?

Not always. Enforcement varies by location and manager discretion.

## Site Features

### How do I report a find?

Use `/report-find` and include as much detail as possible (SKU, store, price observed, date).

### How often is data updated?

Core data and reports are refreshed regularly, but exact timing varies by source and validation pipeline.

### Can I save items?

Where supported, saved state may be stored locally in your browser.

## Technical

### Why does the site look broken on my browser?

Try refreshing, clearing cache, disabling aggressive blockers, and using an up-to-date browser.

### Does ad blocking affect site behavior?

It can. Some scripts or embedded features may not load correctly with strict blocking.

## Policies and Privacy

### Do you use affiliate links?

Yes, some outbound links may be affiliate links.

### Do you run ads on legal pages?

Recommended policy is no. Legal/trust pages should remain clean to improve user trust.

### How do I submit a CCPA/CPRA opt-out?

Use `/do-not-sell-or-share`.

---

## 8) Contact Us (Robust Draft)

# Contact PennyCentral

**Last Updated: March 1, 2026**

Need help, found bad data, or have a partnership request? We’re reachable.

## Primary Contact Channels

- **General support:** contact@pennycentral.com
- **Data corrections:** contact@pennycentral.com (subject: `Correction`)
- **Partnership/media:** contact@pennycentral.com (subject: `Partnership`)

## Recommended Contact Form Fields

- Name (optional)
- Email (required)
- Topic (required dropdown)
  - Data correction
  - Technical issue
  - Partnership/media
  - General question
- Message (required)
- Optional SKU/store fields (for correction tickets)

## Response Expectations

- Correction-related messages: target response within 24–48 hours
- General inquiries: target response within 3–5 business days

## Quality Tip

For correction requests, include:

- SKU/UPC
- Store city/state or location ID
- Observed price and date/time
- Any relevant receipt/photo evidence (if available)

---

## 9) CCPA/CPRA Mechanism (Beyond External Redirect)

Implement a first-party page at `/do-not-sell-or-share` with:

- Plain-language explanation of rights
- A request form (name optional, email optional unless needed for response)
- Request types:
  - Do Not Sell/Share
  - Access request
  - Deletion request
  - Correction request
- Confirmation message + timestamped request ID
- Link to `aboutads.info` and similar tools as **supplemental**, not primary

This gives stronger trust and legal posture than only redirecting users to external ad-industry pages.

---

## 10) Why This Beats the Competitor Pattern

- No brittle `/?info=` URL scheme
- No nav duplication/confusing labels
- Dedicated first-party privacy choices route
- Cleaner legal UX (no ad clutter)
- Better retention pattern (subtle back-to-list link)
- Content written in plain language with stronger legal clarity
