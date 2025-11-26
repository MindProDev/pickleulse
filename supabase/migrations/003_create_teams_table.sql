-- Teams table for doubles partnerships
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Team info
    name TEXT NOT NULL,
    
    -- Players (for doubles - 2 players)
    player1_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    player2_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    
    -- Optional metadata
    avatar_url TEXT,
    
    -- Ensure unique partnerships
    CONSTRAINT unique_partnership UNIQUE (player1_id, player2_id)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_teams_player1 ON teams(player1_id);
CREATE INDEX IF NOT EXISTS idx_teams_player2 ON teams(player2_id);

-- RLS Policies
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Anyone can view teams
CREATE POLICY "Teams are viewable by everyone"
    ON teams FOR SELECT
    USING (true);

-- Users can create teams if they are one of the players
CREATE POLICY "Users can create teams they are part of"
    ON teams FOR INSERT
    WITH CHECK (
        auth.uid() = player1_id OR auth.uid() = player2_id
    );

-- Users can update teams they are part of
CREATE POLICY "Users can update their teams"
    ON teams FOR UPDATE
    USING (
        auth.uid() = player1_id OR auth.uid() = player2_id
    );

-- Users can delete teams they are part of
CREATE POLICY "Users can delete their teams"
    ON teams FOR DELETE
    USING (
        auth.uid() = player1_id OR auth.uid() = player2_id
    );

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_teams_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_teams_updated_at();
