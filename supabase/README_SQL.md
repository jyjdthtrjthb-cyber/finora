Supabase schema & RLS

This file contains the schema for Finora's initial tables and row-level security policies.

How to apply:
1. Open your Supabase project.
2. Go to "SQL Editor" -> "New query".
3. Paste the contents of `schema.sql` and run it as a project administrator.

Important notes:
- Policies use `auth.uid()` which requires Supabase Auth.
- Create the `profiles` table to store user metadata (and link to `auth.users`).
- For production migrations, use a migration system or Supabase CLI.

Security:
- Only admins should run these statements.
- Do not expose your `service_role` key in the frontend.

Promo-code secure validation (ADMIN):

1) Create a table to store promo codes (store only hashes):

```sql
create table if not exists public.promo_codes (
	id uuid primary key default gen_random_uuid(),
	code_hash text not null,
	active boolean default true,
	created_at timestamptz default now()
);
```

2) Create a secure SQL function to validate a promo code and mark a profile as pro (run as an admin in the SQL editor):

```sql
create or replace function public.validate_promo(code text, user_uuid uuid)
returns jsonb as $$
declare
	rec record;
begin
	-- compare hashed values to avoid storing plain codes in source
	select * into rec from public.promo_codes where active = true and code_hash = crypt(code, code_hash) limit 1;
	if not found then
		return json_build_object('valid', false)::jsonb;
	end if;

	-- grant pro to the user
	update public.profiles set subscription_status = 'pro', trial_end = null where id = user_uuid;

	return json_build_object('valid', true)::jsonb;
end;
$$ language plpgsql security definer;
```

3) To add a promo code, generate a salted hash with Postgres `crypt()` using a secure salt, for example in SQL:

```sql
insert into public.promo_codes (code_hash) values (crypt('THE_REAL_CODE_GOES_HERE', gen_salt('bf')));
```

Notes:
- Do NOT put `THE_REAL_CODE_GOES_HERE` into your frontend code. Keep the service_role key and admin SQL operations in the Supabase admin console or server-side tooling.
- The frontend should call the `validate_promo` RPC (as implemented in the UpgradeModalProvider) which will perform the secure check and update the profile server-side.

