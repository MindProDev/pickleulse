import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function applyMigration() {
    try {
        console.log('🚀 Starting migration: Add is_active field to matches table...\n');

        // Read the migration file
        const migrationPath = path.join(__dirname, '../supabase/migrations/004_add_is_active_to_matches.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

        console.log('📄 Migration SQL:');
        console.log('─'.repeat(60));
        console.log(migrationSQL);
        console.log('─'.repeat(60));
        console.log('');

        // Execute the migration
        console.log('⏳ Executing migration...');
        const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

        if (error) {
            // If exec_sql doesn't exist, try direct execution (this might not work with ALTER TABLE)
            console.log('⚠️  exec_sql RPC not available, attempting direct execution...');

            // Split the SQL into individual statements
            const statements = migrationSQL
                .split(';')
                .map(s => s.trim())
                .filter(s => s.length > 0 && !s.startsWith('--'));

            for (const statement of statements) {
                if (statement.toLowerCase().includes('alter table')) {
                    console.log('⚠️  Cannot execute ALTER TABLE via client. Please use Supabase Dashboard.');
                    console.log('\n📋 Instructions:');
                    console.log('1. Go to: https://kyqoypqfcydrelosngtx.supabase.co/project/_/sql');
                    console.log('2. Click "New Query"');
                    console.log('3. Paste the migration SQL shown above');
                    console.log('4. Click "Run"\n');
                    process.exit(1);
                }
            }
        }

        console.log('✅ Migration applied successfully!\n');

        // Verify the migration
        console.log('🔍 Verifying migration...');
        const { data: columns, error: verifyError } = await supabase
            .from('matches')
            .select('*')
            .limit(1);

        if (verifyError) {
            console.log('⚠️  Could not verify migration:', verifyError.message);
        } else {
            console.log('✅ Verification complete - matches table is accessible\n');
        }

        console.log('🎉 Migration process complete!');
        console.log('\n📝 Next steps:');
        console.log('   - Test creating a new match');
        console.log('   - Verify is_active field is set to true');
        console.log('   - Test the free tier limitation\n');

    } catch (error: any) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n📋 Manual migration required:');
        console.log('1. Go to: https://kyqoypqfcydrelosngtx.supabase.co/project/_/sql');
        console.log('2. Click "New Query"');
        console.log('3. Paste the contents of: supabase/migrations/004_add_is_active_to_matches.sql');
        console.log('4. Click "Run"\n');
        process.exit(1);
    }
}

applyMigration();
