-- Promo codes setup for Finora
-- Safe server-side promo validation and grants
-- IMPORTANT: Do NOT add real promo strings into frontend. Insert hashed codes using the SQL shown below.

-- 1) Ensure pgcrypto for hashing and gen_random_uuid
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2) Promo codes table: store only hashed codes and metadata about what the promo grants
CREATE TABLE IF NOT EXISTS public.promo_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code_hash text NOT NULL,
  grants_trial boolean DEFAULT true,
  trial_days int DEFAULT 7,
  grants_subscription boolean DEFAULT false,
  subscription_months int DEFAULT 1,
  note text,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  revoked boolean DEFAULT false
);

-- 3) Secure RPC: validate_promo(code) -> jsonb
--    - Runs as function owner (security definer)
--    - Uses crypt() to compare the provided code against stored bcrypt hashes
--    - Uses auth.uid() to identify the caller (no user id argument)
--    - Updates the caller's profile to `pro` and optionally sets a trial window
--    - Optionally creates a subscription record when subscription_months > 0
CREATE OR REPLACE FUNCTION public.validate_promo(code text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  _uid uuid := auth.uid();
  _promo RECORD;
  _sub_id uuid;
BEGIN
  IF _uid IS NULL THEN
    RETURN jsonb_build_object('valid', false, 'error', 'not_authenticated');
  END IF;

  SELECT * INTO _promo
  FROM public.promo_codes
  WHERE NOT revoked
    AND (expires_at IS NULL OR now() < expires_at)
    AND crypt(code, code_hash) = code_hash
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'invalid_code');
  END IF;

  -- Grant pro status on the caller's profile
  UPDATE public.profiles
  SET subscription_status = 'pro',
      trial_start = CASE WHEN _promo.grants_trial THEN now() ELSE trial_start END,
      trial_end = CASE WHEN _promo.grants_trial THEN now() + (_promo.trial_days || ' days')::interval ELSE trial_end END
  WHERE id = _uid;

  -- Create a subscription row if this promo grants a subscription duration
  IF _promo.grants_subscription AND _promo.subscription_months > 0 THEN
    INSERT INTO public.subscriptions (user_id, status, tier, subscribed_at, expires_at, metadata, created_at)
    VALUES (_uid, 'active', 'pro', now(), now() + (_promo.subscription_months || ' months')::interval, jsonb_build_object('promo_id', _promo.id), now())
    RETURNING id INTO _sub_id;
  END IF;

  RETURN jsonb_build_object('valid', true, 'promo_id', _promo.id, 'subscription_created', _sub_id IS NOT NULL);
END;
$$;

-- 4) Allow authenticated users to call the RPC (function runs with owner privileges)
GRANT EXECUTE ON FUNCTION public.validate_promo(text) TO authenticated;

-- 5) Example: How to insert a promo code (run only in SQL editor as an admin)
-- INSERT INTO public.promo_codes (code_hash, grants_trial, trial_days, grants_subscription, subscription_months, note, created_by)
-- VALUES (crypt('REPLACE_WITH_REAL_CODE', gen_salt('bf')), true, 7, false, 0, 'Example trial promo', '00000000-0000-0000-0000-000000000000');

-- Notes for admins:
--  - Do NOT run the example insert with a real promo on CI or in any code repository; paste it into the Supabase SQL editor manually.
--  - Use `crypt(real_code, gen_salt('bf'))` to store a bcrypt hash of the promo code.
--  - The function uses auth.uid() so clients should call the RPC like:
--      supabase.rpc('validate_promo', { p_code: 'USER_ENTERED_CODE' })
--    and handle the returned JSON.