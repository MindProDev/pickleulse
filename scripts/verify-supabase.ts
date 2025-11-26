import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';
import https from 'https';
import fetch from 'node-fetch';

const agent = new https.Agent({
    rejectUnauthorized: false
});

// @ts-ignore
global.fetch = (url, init) => fetch(url, { ...init, agent });

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Missing Supabase environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyConnection() {
    console.log('Verifying Supabase connection...');

    try {
        // Try to select from the profiles table to check if schema exists
        const { data, error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });

        if (error) {
            if (error.code === '42P01') { // undefined_table
                console.error('Connection successful, but "profiles" table does not exist.');
                console.error('Please run the SQL schema in the Supabase Dashboard.');
            } else {
                console.error('Connection failed:', error.message);
            }
        } else {
            console.log('Success! Connected to Supabase and "profiles" table exists.');
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

verifyConnection();
