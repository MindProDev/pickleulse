-- 1. Add user_id column to matches table
-- We make it nullable first to avoid issues with existing data
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Create index for performance
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);

-- 3. Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies

-- Policy: Users can only view their own matches
CREATE POLICY "Users can view own matches"
ON matches FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own matches
CREATE POLICY "Users can insert own matches"
ON matches FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own matches
CREATE POLICY "Users can update own matches"
ON matches FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can delete their own matches
CREATE POLICY "Users can delete own matches"
ON matches FOR DELETE
USING (auth.uid() = user_id);

-- 5. (Optional) Allow anonymous access for guest matches if you want to support that via Supabase later
-- For now, guest matches are local-only, so we don't need this.
