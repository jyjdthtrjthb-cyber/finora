-- Finora Supabase schema and Row Level Security policies
-- Run these statements in the Supabase SQL editor (or via psql with the service_role key).

-- 1) Profiles table (one row per user)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  locale text DEFAULT 'ru',
  preferred_locale text DEFAULT 'ru',
  plan text DEFAULT 'free', -- free | pro
  subscription_status text DEFAULT 'free', -- free | pro
  monthly_income numeric(14,2) DEFAULT 0,
  monthly_expenses numeric(14,2) DEFAULT 0,
  monthly_savings numeric(14,2) DEFAULT 0,
  bank_annual_yield numeric(5,2) DEFAULT 19.0,
  onboarding_completed boolean DEFAULT false,
  trial_start timestamptz,
  trial_end timestamptz,
  created_at timestamptz DEFAULT now()
);

-- 2) Expenses
CREATE TABLE IF NOT EXISTS public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(14,2) NOT NULL,
  category text NOT NULL,
  description text,
  occurred_at date NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- 3) Budgets
CREATE TABLE IF NOT EXISTS public.budgets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  month date NOT NULL,
  category text NOT NULL,
  planned numeric(14,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- 4) Savings (records of saved amounts or plans)
CREATE TABLE IF NOT EXISTS public.savings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  monthly_contribution numeric(14,2) DEFAULT 0,
  total_saved numeric(14,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- 5) Financial goals
CREATE TABLE IF NOT EXISTS public.financial_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  target_amount numeric(14,2) NOT NULL,
  current_amount numeric(14,2) DEFAULT 0,
  monthly_contribution numeric(14,2) DEFAULT 0,
  target_date date,
  created_at timestamptz DEFAULT now()
);

-- 6) Debts
CREATE TABLE IF NOT EXISTS public.debts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  total_amount numeric(14,2) NOT NULL,
  remaining_amount numeric(14,2) NOT NULL,
  interest_rate numeric(5,3),
  monthly_payment numeric(14,2),
  due_date date,
  created_at timestamptz DEFAULT now()
);

-- 7) Child funds
CREATE TABLE IF NOT EXISTS public.child_funds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  child_name text,
  child_current_age int,
  child_target_age int,
  current_savings numeric(14,2) DEFAULT 0,
  monthly_contribution numeric(14,2) DEFAULT 0,
  annual_rate numeric(5,3) DEFAULT 0.0,
  created_at timestamptz DEFAULT now()
);

-- 8) Scenarios (what-if)
CREATE TABLE IF NOT EXISTS public.scenarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text,
  payload jsonb,
  created_at timestamptz DEFAULT now()
);

-- 9) Subscriptions / trial records
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'trial', -- trial | active | canceled | expired
  tier text DEFAULT 'pro',
  trial_start timestamptz,
  trial_end timestamptz,
  subscribed_at timestamptz,
  expires_at timestamptz,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on all user data tables
ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.savings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.child_funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies: allow authenticated users to manage their own rows
-- Profiles: user owns their profile (id == auth.uid())
CREATE POLICY IF NOT EXISTS "Profiles: owner" ON public.profiles
FOR ALL
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Generic policy for tables with user_id column
DO $$
DECLARE
  tbl text;
BEGIN
  FOR tbl IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename IN (
    'expenses','budgets','savings','financial_goals','debts','child_funds','scenarios','subscriptions'
  ) LOOP
    EXECUTE format(
      'CREATE POLICY IF NOT EXISTS "%I: owner" ON public.%I FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);',
      tbl, tbl
    );
  END LOOP;
END$$;

-- Useful indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON public.expenses (user_id, occurred_at);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON public.budgets (user_id, month);

-- Notes:
-- 1) To allow public read access for some aggregated analytics endpoints, create separate views and policies.
-- 2) Run these queries in the Supabase SQL editor as an authenticated SQL admin (use service_role key if running remotely).
-- 3) Do NOT run client-side with anon key; schema and policies must be applied by a project admin.
