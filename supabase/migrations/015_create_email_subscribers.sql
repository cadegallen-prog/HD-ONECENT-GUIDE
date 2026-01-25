-- Migration: Create email_subscribers table
-- Purpose: Store email addresses for weekly penny list updates
-- Date: 2026-01-16

-- Create email_subscribers table
CREATE TABLE IF NOT EXISTS public.email_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  unsubscribe_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Add index on email for fast lookups
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);

-- Add index on is_active for filtering active subscribers
CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON public.email_subscribers(is_active) WHERE is_active = TRUE;

-- Add index on unsubscribe_token for unsubscribe endpoint
CREATE INDEX IF NOT EXISTS idx_email_subscribers_token ON public.email_subscribers(unsubscribe_token);

-- Enable RLS
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous inserts (for signup form)
CREATE POLICY email_subscribers_insert_policy ON public.email_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (TRUE);

-- Policy: Allow anonymous updates (for reactivating subscriptions)
CREATE POLICY email_subscribers_update_policy ON public.email_subscribers
  FOR UPDATE
  TO anon
  USING (TRUE)
  WITH CHECK (TRUE);

-- Policy: Allow token-based unsubscribe (public reads by token)
CREATE POLICY email_subscribers_select_by_token ON public.email_subscribers
  FOR SELECT
  TO anon
  USING (unsubscribe_token IS NOT NULL);

-- Policy: Allow service role full access (for email cron)
CREATE POLICY email_subscribers_service_role_all ON public.email_subscribers
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER email_subscribers_updated_at
  BEFORE UPDATE ON public.email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_email_subscribers_updated_at();

-- Add comment for documentation
COMMENT ON TABLE public.email_subscribers IS 'Stores email addresses for weekly penny list update notifications';
COMMENT ON COLUMN public.email_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN public.email_subscribers.subscribed_at IS 'Timestamp when user subscribed';
COMMENT ON COLUMN public.email_subscribers.unsubscribed_at IS 'Timestamp when user unsubscribed (null if still active)';
COMMENT ON COLUMN public.email_subscribers.is_active IS 'Whether subscription is currently active';
COMMENT ON COLUMN public.email_subscribers.unsubscribe_token IS 'Unique token for one-click unsubscribe links';
