# Running Database Migrations for Teams Feature

## Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/003_create_teams_table.sql`
4. Paste into the SQL Editor
5. Click **Run**

## Option 2: Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or run the specific migration
supabase db execute --file supabase/migrations/003_create_teams_table.sql
```

## Verification

After running the migration, you can verify the table was created:

```sql
SELECT * FROM teams;
```

This should return an empty result set (no rows) but confirm the table exists.

## What the Migration Does

- Creates `teams` table with columns:
  - `id` (UUID, primary key)
  - `name` (team name)
  - `player1_id` and `player2_id` (references to profiles)
  - `created_at` and `updated_at` timestamps
  
- Sets up Row Level Security (RLS) policies:
  - Anyone can view teams
  - Users can create/update/delete teams they're part of

- Creates indexes for faster lookups
- Adds trigger for auto-updating `updated_at` timestamp
