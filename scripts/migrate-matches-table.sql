-- Migration script to enhance matches table with new features
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/kyqoypqfcydrelosngtx/sql/new

-- Add new columns to existing matches table
ALTER TABLE matches
ADD COLUMN IF NOT EXISTS match_type VARCHAR(10) DEFAULT 'singles',
ADD COLUMN IF NOT EXISTS scoring_rule INTEGER DEFAULT 11,
ADD COLUMN IF NOT EXISTS team_a_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS team_b_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER,
ADD COLUMN IF NOT EXISTS rally_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS server VARCHAR(10) DEFAULT 'team_a',
ADD COLUMN IF NOT EXISTS ended_at TIMESTAMP WITH TIME ZONE;

-- Add comment to document the schema
COMMENT ON COLUMN matches.match_type IS 'Type of match: singles or doubles';
COMMENT ON COLUMN matches.scoring_rule IS 'Points needed to win: 11, 15, or custom';
COMMENT ON COLUMN matches.team_a_name IS 'Optional custom name for Team A';
COMMENT ON COLUMN matches.team_b_name IS 'Optional custom name for Team B';
COMMENT ON COLUMN matches.duration_seconds IS 'Match duration in seconds';
COMMENT ON COLUMN matches.rally_count IS 'Total number of rallies in the match';
COMMENT ON COLUMN matches.server IS 'Current server: team_a or team_b';
COMMENT ON COLUMN matches.ended_at IS 'Timestamp when match ended';

-- Create index for faster queries on created_at (most recent first)
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at DESC);

-- Create index for match type filtering
CREATE INDEX IF NOT EXISTS idx_matches_type ON matches(match_type);

-- Verify the migration
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'matches'
ORDER BY ordinal_position;
