import { supabase } from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Session, User } from '@supabase/supabase-js';
import { makeRedirectUri } from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

type AuthMode = 'guest' | 'authenticated' | 'loading';

interface AuthContextType {
    mode: AuthMode;
    user: User | null;
    session: Session | null;
    guestId: string | null;
    signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signUp: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    continueAsGuest: () => Promise<void>;
    upgradeGuestToAccount: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    isGuest: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_ID_KEY = 'picklepulse_guest_id';
const HAS_SEEN_WELCOME_KEY = 'picklepulse_has_seen_welcome';

// Generate a unique guest ID
function generateGuestId(): string {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Storage helpers that work on both web and native
const storage = {
    getItem: async (key: string): Promise<string | null> => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return AsyncStorage.getItem(key);
    },
    setItem: async (key: string, value: string): Promise<void> => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await AsyncStorage.setItem(key, value);
        }
    },
    removeItem: async (key: string): Promise<void> => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await AsyncStorage.removeItem(key);
        }
    },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<AuthMode>('loading');
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [guestId, setGuestId] = useState<string | null>(null);

    // Initialize auth state
    useEffect(() => {
        initializeAuth();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                setMode('authenticated');
                // Clear guest ID when authenticated
                storage.removeItem(GUEST_ID_KEY);
                setGuestId(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    async function initializeAuth() {
        try {
            // Check for existing Supabase session
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                setSession(session);
                setUser(session.user);
                setMode('authenticated');
                return;
            }

            // Check for existing guest ID
            const existingGuestId = await storage.getItem(GUEST_ID_KEY);
            if (existingGuestId) {
                setGuestId(existingGuestId);
                setMode('guest');
                return;
            }

            // New user - stay in loading state until they choose
            setMode('loading');
        } catch (error) {
            console.error('Error initializing auth:', error);
            setMode('loading');
        }
    }

    async function signIn(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.session) {
                setSession(data.session);
                setUser(data.user);
                setMode('authenticated');
                await storage.setItem(HAS_SEEN_WELCOME_KEY, 'true');
                return { success: true };
            }

            return { success: false, error: 'No session returned' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    async function signUp(email: string, password: string) {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.session) {
                setSession(data.session);
                setUser(data.user);
                setMode('authenticated');
                await storage.setItem(HAS_SEEN_WELCOME_KEY, 'true');
                return { success: true };
            }

            // Email confirmation may be required
            return { success: true };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    async function signOut() {
        try {
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
            setMode('loading');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    }

    async function signInWithGoogle() {
        try {
            const redirectUrl = makeRedirectUri({
                scheme: 'picklepulse',
                path: 'auth/callback',
            });

            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectUrl,
                    skipBrowserRedirect: true,
                },
            });

            if (error) throw error;

            if (data.url) {
                const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
                if (result.type === 'success') {
                    return { success: true };
                }
            }

            return { success: false, error: 'User cancelled or failed to sign in' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    async function continueAsGuest() {
        try {
            const newGuestId = generateGuestId();
            await storage.setItem(GUEST_ID_KEY, newGuestId);
            await storage.setItem(HAS_SEEN_WELCOME_KEY, 'true');
            setGuestId(newGuestId);
            setMode('guest');
        } catch (error) {
            console.error('Error creating guest session:', error);
        }
    }

    async function upgradeGuestToAccount(email: string, password: string) {
        try {
            // Sign up for new account
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            });

            if (error) {
                return { success: false, error: error.message };
            }

            if (data.session) {
                setSession(data.session);
                setUser(data.user);
                setMode('authenticated');

                // Migrate guest data
                if (data.user) {
                    // We import dynamically to avoid circular dependencies if any
                    const { migrateGuestData } = require('@/lib/migration');
                    await migrateGuestData(data.user.id);
                }

                // Clear guest ID after successful upgrade
                await storage.removeItem(GUEST_ID_KEY);
                setGuestId(null);

                return { success: true };
            }

            return { success: false, error: 'No session returned' };
        } catch (error) {
            return { success: false, error: String(error) };
        }
    }

    const value: AuthContextType = {
        mode,
        user,
        session,
        guestId,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        upgradeGuestToAccount,
        signInWithGoogle,
        isGuest: mode === 'guest',
        isAuthenticated: mode === 'authenticated',
        isLoading: mode === 'loading',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
