-- ============================================================
-- Migration: Add purpose column to email_verifications
-- Run this in: Supabase Dashboard → SQL Editor
-- Run AFTER the main schema.sql has already been applied
-- ============================================================

ALTER TABLE email_verifications
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'registration';

-- Backfill existing rows
UPDATE email_verifications SET purpose = 'registration' WHERE purpose IS NULL;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_verifications_purpose ON email_verifications(purpose);
