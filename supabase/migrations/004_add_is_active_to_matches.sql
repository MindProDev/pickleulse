-- Migration: Add is_active field to matches table
-- This allows tracking which matches are currently in progress

ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;

-- Create index for faster queries on active matches
CREATE INDEX IF NOT EXISTS idx_matches_is_active ON matches(is_active);

-- Add comment for documentation
COMMENT ON COLUMN matches.is_active IS 'Indicates whether this match is currently in progress';
