-- Migration: add canonical currency column and check constraint to profiles
-- Adds `currency` column if missing and creates a CHECK constraint to allow only USD, UZS, EUR, RUB.

DO $$
BEGIN
  -- Add column if it does not exist
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'profiles'
      AND column_name = 'currency'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN currency text DEFAULT 'UZS';
  END IF;

  -- Add check constraint if it does not exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_currency_check'
  ) THEN
    ALTER TABLE public.profiles ADD CONSTRAINT profiles_currency_check CHECK (currency IN ('USD','UZS','EUR','RUB'));
  END IF;
END$$;

-- End migration
