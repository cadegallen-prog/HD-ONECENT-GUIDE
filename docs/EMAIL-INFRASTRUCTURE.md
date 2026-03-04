# Email Infrastructure

**Last Updated:** 2026-03-03

All outbound email for PennyCentral routes through **Resend** (resend.com). One Resend account, one verified domain, two delivery paths.

---

## Domain Setup (Resend)

| Setting             | Value                                                     |
| ------------------- | --------------------------------------------------------- |
| Provider            | Resend                                                    |
| Domain              | `pennycentral.com`                                        |
| DNS provider        | Cloudflare (auto-configured)                              |
| Domain verification | DKIM + SPF + DMARC all verified                           |
| Receiving           | Not enabled (inbound email uses Cloudflare Email Routing) |
| API key scope       | Send only                                                 |

---

## Two Email Paths

### 1. Supabase Auth (OTP / Magic Links)

Supabase sends authentication emails (OTP codes, magic links) through Resend's SMTP pipe. This was configured on **2026-03-03** via Resend's "Connect to Supabase" integration.

| Setting          | Value                                                                  |
| ---------------- | ---------------------------------------------------------------------- |
| Sender address   | `noreply@pennycentral.com`                                             |
| Sender name      | Penny Central                                                          |
| SMTP host        | `smtp.resend.com`                                                      |
| SMTP port        | `465`                                                                  |
| SMTP username    | `resend`                                                               |
| SMTP password    | Resend API key (stored encrypted in Supabase dashboard)                |
| Minimum interval | 60 seconds per user                                                    |
| Configured where | Supabase Dashboard > Project Settings > Authentication > SMTP Settings |

**How it works:** When a user requests an OTP on the login page, Supabase's servers send the email via Resend's SMTP. The API key lives inside Supabase's dashboard (encrypted), not in Vercel env vars or your codebase. Your app code (`signInWithOtp()`, `verifyOtp()`) does not change — Supabase handles delivery internally.

**To verify it's working:** Request an OTP and check the "from" address. If it says `Penny Central <noreply@pennycentral.com>`, it's going through Resend. If it says `noreply@mail.app.supabase.io`, it's on Supabase's built-in sender (which has severe rate limits).

### 2. Weekly Digest (Newsletter)

Your Next.js app sends weekly penny list digest emails directly through Resend's API (SDK, not SMTP).

| Setting          | Value                                                             |
| ---------------- | ----------------------------------------------------------------- |
| Sender address   | `updates@pennycentral.com`                                        |
| Sender name      | Penny Central                                                     |
| Delivery method  | Resend SDK (`resend.emails.send()`)                               |
| API key location | `RESEND_API_KEY` in Vercel env vars + `.env.local`                |
| Schedule         | Every Sunday 8 AM UTC (currently paused)                          |
| Status           | Paused since 2026-02-03 (pending content validation)              |
| Code             | `lib/email-sender.ts`, `app/api/cron/send-weekly-digest/route.ts` |
| Template         | `emails/weekly-digest.tsx` (React Email)                          |
| Unsubscribe      | RFC 8058 one-click via `/api/unsubscribe?token=...`               |

**To resume the digest:** Remove the pause guard or set `FORCE_RUN_DIGEST=true` in env.

---

## Rate Limits (Resend Free Tier)

| Limit                         | Value               |
| ----------------------------- | ------------------- |
| Daily emails                  | 100                 |
| Monthly emails                | 3,000               |
| Supabase OTP minimum interval | 60 seconds per user |

**Both paths share the same quota.** OTP emails and digest emails all count against the 100/day and 3,000/month limits.

### Current Blocker: Digest Cannot Run on Free Tier

As of 2026-03-03, the subscriber list has **~400 active emails**. At 100 emails/day, a single weekly digest would take **4-5 days to send**, which:

- Makes "weekly" meaningless — early subscribers get the email Monday, late ones get it Thursday/Friday
- Competes with OTP emails for the daily quota — auth could fail if the digest is draining the limit
- At 400 subscribers x 4 weeks = 1,600 emails/month just for the digest, leaving only 1,400/month for OTP + growth

**Options when ready to resume the digest:**

| Option                                     | Cost                | What it solves                                  |
| ------------------------------------------ | ------------------- | ----------------------------------------------- |
| Resend Pro ($20/month)                     | 50,000 emails/month | Eliminates the daily cap entirely               |
| Reduce digest frequency (biweekly/monthly) | Free                | Cuts volume in half but still slow on free tier |
| Segment the list (active users only)       | Free                | Reduces per-send volume but doesn't scale       |

**Decision needed before resuming:** Upgrade to Resend Pro or accept multi-day send windows. Do not resume the digest on the free tier without accounting for OTP competition.

---

## Sender Addresses Summary

| Address                    | Used By                  | Purpose                                      |
| -------------------------- | ------------------------ | -------------------------------------------- |
| `noreply@pennycentral.com` | Supabase Auth (SMTP)     | OTP codes, magic links                       |
| `updates@pennycentral.com` | Weekly Digest (API)      | Newsletter emails                            |
| `contact@pennycentral.com` | Cloudflare Email Routing | Inbound support (forwards to personal email) |

---

## Auth Flow (OTP)

1. User enters email on `/login`
2. App calls `supabase.auth.signInWithOtp({ email })`
3. Supabase sends a 6-digit OTP code via Resend SMTP to `noreply@pennycentral.com`
4. User enters the code on the login page
5. App calls `supabase.auth.verifyOtp({ email, token, type: 'email' })`
6. On success, Supabase issues a session and redirects to `/auth/callback`
7. Callback exchanges auth code for session, redirects to `/lists`

**Key files:**

- `components/auth-provider.tsx` — auth context with `signInWithOtp()` and `verifyOtp()`
- `app/login/page.tsx` — login UI (email input → OTP input)
- `app/auth/callback/route.ts` — session exchange handler

---

## Troubleshooting

| Problem                          | Cause                                             | Fix                                                  |
| -------------------------------- | ------------------------------------------------- | ---------------------------------------------------- |
| OTP email not arriving           | Supabase SMTP not configured or credentials wrong | Check Supabase Dashboard > Auth > SMTP Settings      |
| OTP from `@mail.app.supabase.io` | Custom SMTP not enabled                           | Toggle "Enable custom SMTP" on in Supabase dashboard |
| "Rate limit exceeded" on OTP     | 60-second minimum interval                        | Wait 60 seconds between requests                     |
| Digest emails not sending        | Digest is paused                                  | Set `FORCE_RUN_DIGEST=true` or remove pause guard    |
| Hitting daily limit              | 100/day shared across OTP + digest                | Upgrade Resend plan or reduce digest frequency       |

---

## Maintenance

**When to update this doc:**

- Changing email providers or sender addresses
- Upgrading Resend plan tier
- Resuming or modifying the weekly digest
- Adding new email types (transactional, notifications, etc.)
- Changing Supabase SMTP settings
