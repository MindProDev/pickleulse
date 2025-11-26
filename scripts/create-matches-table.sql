-- Run this SQL in your Supabase SQL Editor
-- https://supabase.com/dashboard/project/YOUR_PROJECT/sql/new

CREATE TABLE IF NOT EXISTS matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score_p1 INTEGER NOT NULL,
    score_p2 INTEGER NOT NULL
);

-- Enable Row Level Security
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations on matches" ON matches
    FOR ALL USING (true) WITH CHECK (true);
