import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createMatchesTable() {
    console.log('Creating matches table...');

    // Create the matches table using SQL
    const { error } = await supabase.rpc('exec_sql', {
        sql: `
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
        `
    });

    if (error) {
        console.error('Error creating table:', error);
        console.log('\nNote: If exec_sql function does not exist, please run this SQL manually in Supabase:');
        console.log(`
CREATE TABLE IF NOT EXISTS matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    score_p1 INTEGER NOT NULL,
    score_p2 INTEGER NOT NULL
);

ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on matches" ON matches
    FOR ALL USING (true) WITH CHECK (true);
        `);
    } else {
        console.log('Success! Matches table created.');
    }
}

createMatchesTable();
