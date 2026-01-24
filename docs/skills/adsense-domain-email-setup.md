# AdSense + Professional Domain Email Setup

**When to use:** You need a professional contact email on your domain (without paying for Google Workspace) and a checklist that meets AdSense reviewer expectations.

## Outcome

- `contact@yourdomain.com` receives mail in your personal inbox
- Mail to the address does **not bounce** (AdSense reviewer requirement)
- Site has the minimum pages and signals AdSense reviewers expect

## Checklist

### 1) Domain + DNS

- Canonical domain decided (`www` vs apex) + 301 redirect set.
- DNS points to your host (Vercel or equivalent) and HTTPS is live.

### 2) Cloudflare Email Routing (Receive)

1. Enable **Email Routing** in Cloudflare.
2. Add the **MX** + **TXT** records Cloudflare provides.
3. Create `contact@yourdomain.com`.
4. Forward to your personal inbox.

### 3) Gmail “Send Mail As” (Send)

Cloudflare Email Routing is **receive-only** (no SMTP). If you need to send/reply from `contact@yourdomain.com`, pick one:

- **Option A (fastest, free):** Reply from your personal inbox, but set your display name to your brand (AdSense usually doesn’t care about outbound).
- **Option B (reliable, paid):** Use an email host (Google Workspace, Fastmail, Zoho, etc.) and configure Gmail “Send mail as” using that provider’s SMTP.
- **Option C (for newsletters):** Use a newsletter/transactional provider (this repo already uses Resend for the weekly digest) and keep `contact@...` for inbound support.

### 4) Deliverability Records

- If you start sending mail from `@yourdomain.com`, set up SPF/DKIM per the actual sender (Workspace/Resend/etc.) and optionally add DMARC (`p=none` to start).

### 5) Verification

- Send a test email **to** the custom address.
- Confirm it arrives in your inbox and does **not bounce**.

### 6) AdSense Reviewer Basics

- Contact page with your professional email.
- Privacy Policy page (required).
- Terms/Disclaimer page (recommended).
- Clear navigation and sufficient original content.
- No broken links or placeholder pages.
- HTTPS on every page.
- Add `ads.txt` **after** AdSense approval (use the line they provide).
