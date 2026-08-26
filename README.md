# Finora

Finora — Personal finance & wealth planning (Phase 1–2 starter)

## Setup

1. Create a Supabase project and enable Email authentication.
2. Enable Row Level Security for your tables (see schema instructions below).
3. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.


## Run locally

```bash
npm install
npm run dev
```

## Supabase notes

- Use `auth.users` for user accounts. Do not store plain-text passwords.
- Create `profiles` table with `id uuid REFERENCES auth.users(id)` and other profile fields.
- Enable RLS and policies: allow SELECT/INSERT/UPDATE/DELETE only when `auth.uid() = user_id`.

This repo contains initial auth pages and a landing demo. Continue with database schema and RLS policies next.
