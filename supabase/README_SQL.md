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
