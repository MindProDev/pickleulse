import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import 'react-native-url-polyfill/auto';

// Web-compatible localStorage adapter
const WebStorageAdapter = {
    getItem: (key: string) => {
        if (typeof localStorage === 'undefined') return null;
        return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
        if (typeof localStorage === 'undefined') return;
        localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
        if (typeof localStorage === 'undefined') return;
        localStorage.removeItem(key);
    },
};

// Helper to use Expo SecureStore on native
const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key);
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value);
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key);
    },
};

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: Platform.OS === 'web' ? WebStorageAdapter : ExpoSecureStoreAdapter,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
