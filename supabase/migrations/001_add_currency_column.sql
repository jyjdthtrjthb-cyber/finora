-- Migration: add canonical currency column to profiles
-- Adds `currency` column if it does not exist. Safe to run repeatedly.

ALTER TABLE IF EXISTS public.profiles
ADD COLUMN IF NOT EXISTS currency text DEFAULT 'UZS';

-- End migration
