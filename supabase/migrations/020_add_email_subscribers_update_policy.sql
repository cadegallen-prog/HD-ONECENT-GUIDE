-- Migration: Add UPDATE policy for email_subscribers reactivation
-- Purpose: Allow anonymous users to reactivate previously unsubscribed emails
-- Date: 2026-01-24

-- First ensure the email_subscribers table exists (migration 015 might have failed)
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

-- Add indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_email_subscribers_email ON public.email_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_email_subscribers_active ON public.email_subscribers(is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_email_subscribers_token ON public.email_subscribers(unsubscribe_token);

-- Enable RLS if not already enabled (idempotent via ALTER TABLE ENABLE ROW LEVEL SECURITY)
ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

-- Ensure the INSERT policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'email_subscribers' 
    AND policyname = 'email_subscribers_insert_policy'
  ) THEN
    CREATE POLICY email_subscribers_insert_policy ON public.email_subscribers
      FOR INSERT
      TO anon
      WITH CHECK (TRUE);
  END IF;
END $$;

-- Ensure the UPDATE policy exists (this is the critical fix)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'email_subscribers' 
    AND policyname = 'email_subscribers_update_policy'
  ) THEN
    CREATE POLICY email_subscribers_update_policy ON public.email_subscribers
      FOR UPDATE
      TO anon
      USING (TRUE)
      WITH CHECK (TRUE);
  END IF;
END $$;

-- Ensure the SELECT policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'email_subscribers' 
    AND policyname = 'email_subscribers_select_by_token'
  ) THEN
    CREATE POLICY email_subscribers_select_by_token ON public.email_subscribers
      FOR SELECT
      TO anon
      USING (unsubscribe_token IS NOT NULL);
  END IF;
END $$;

-- Ensure the service role policy exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'email_subscribers' 
    AND policyname = 'email_subscribers_service_role_all'
  ) THEN
    CREATE POLICY email_subscribers_service_role_all ON public.email_subscribers
      FOR ALL
      TO service_role
      USING (TRUE)
      WITH CHECK (TRUE);
  END IF;
END $$;

-- Ensure the trigger exists for updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_subscribers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_subscribers_updated_at ON public.email_subscribers;
CREATE TRIGGER email_subscribers_updated_at
  BEFORE UPDATE ON public.email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION update_email_subscribers_updated_at();

