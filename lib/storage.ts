import { supabase } from '@/lib/supabase';
import type { Match } from '@/types/match';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const GUEST_MATCHES_KEY = 'picklepulse_guest_matches';

export interface StorageInterface {
    saveMatch: (match: Omit<Match, 'id' | 'created_at' | 'user_id'>, userId?: string) => Promise<{ success: boolean; error?: string; data?: Match }>;
    getMatches: (userId?: string) => Promise<{ data: Match[]; error?: string }>;
    getActiveMatches: (userId?: string) => Promise<{ data: Match[]; error?: string }>;
    updateMatch: (matchId: string, updates: Partial<Match>, userId?: string) => Promise<{ success: boolean; error?: string }>;
    deleteMatch: (matchId: string, userId?: string) => Promise<{ success: boolean; error?: string }>;
}

// Helper to get local matches
async function getLocalMatches(): Promise<Match[]> {
    try {
        const json = Platform.OS === 'web'
            ? localStorage.getItem(GUEST_MATCHES_KEY)
            : await AsyncStorage.getItem(GUEST_MATCHES_KEY);

        if (!json) return [];

        const matches = JSON.parse(json);
        // Convert date strings back to Date objects if needed, though usually we keep them as strings in types
        return matches;
    } catch (e) {
        console.error('Error reading local matches:', e);
        return [];
    }
}

// Helper to save local matches
async function saveLocalMatches(matches: Match[]): Promise<void> {
    try {
        const json = JSON.stringify(matches);
        if (Platform.OS === 'web') {
            localStorage.setItem(GUEST_MATCHES_KEY, json);
        } else {
            await AsyncStorage.setItem(GUEST_MATCHES_KEY, json);
        }
    } catch (e) {
        console.error('Error saving local matches:', e);
    }
}

export const storage: StorageInterface = {
    async saveMatch(matchData, userId) {
        // Authenticated User -> Supabase
        if (userId && !userId.startsWith('guest_')) {
            try {
                const { data, error } = await supabase
                    .from('matches')
                    .insert({
                        ...matchData,
                        user_id: userId,
                    })
                    .select()
                    .single();

                if (error) return { success: false, error: error.message };
                return { success: true, data };
            } catch (e: any) {
                return { success: false, error: e.message };
            }
        }

        // Guest User -> Local Storage
        else {
            try {
                const matches = await getLocalMatches();
                const newMatch: Match = {
                    ...matchData,
                    id: `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    created_at: new Date().toISOString(),
                    user_id: userId || 'guest',
                } as Match; // Cast to Match as we're generating the missing fields

                matches.unshift(newMatch); // Add to beginning
                await saveLocalMatches(matches);

                return { success: true, data: newMatch };
            } catch (e: any) {
                return { success: false, error: e.message };
            }
        }
    },

    async getMatches(userId) {
        // Authenticated User -> Supabase
        if (userId && !userId.startsWith('guest_')) {
            try {
                const { data, error } = await supabase
                    .from('matches')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) return { data: [], error: error.message };
                return { data: data || [] };
            } catch (e: any) {
                return { data: [], error: e.message };
            }
        }

        // Guest User -> Local Storage
        else {
            const matches = await getLocalMatches();
            return { data: matches };
        }
    },

    async getActiveMatches(userId) {
        // Authenticated User -> Supabase
        if (userId && !userId.startsWith('guest_')) {
            try {
                const { data, error } = await supabase
                    .from('matches')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false });

                if (error) return { data: [], error: error.message };
                return { data: data || [] };
            } catch (e: any) {
                return { data: [], error: e.message };
            }
        }

        // Guest User -> Local Storage
        else {
            const matches = await getLocalMatches();
            const activeMatches = matches.filter(m => m.is_active);
            return { data: activeMatches };
        }
    },

    async updateMatch(matchId, updates, userId) {
        // Authenticated User -> Supabase
        if (userId && !userId.startsWith('guest_')) {
            try {
                const { error } = await supabase
                    .from('matches')
                    .update(updates)
                    .eq('id', matchId);

                if (error) return { success: false, error: error.message };
                return { success: true };
            } catch (e: any) {
                return { success: false, error: e.message };
            }
        }

        // Guest User -> Local Storage
        else {
            try {
                const matches = await getLocalMatches();
                const index = matches.findIndex(m => m.id === matchId);

                if (index !== -1) {
                    matches[index] = { ...matches[index], ...updates };
                    await saveLocalMatches(matches);
                    return { success: true };
                }
                return { success: false, error: 'Match not found' };
            } catch (e: any) {
                return { success: false, error: e.message };
            }
        }
    },

    async deleteMatch(matchId, userId) {
        // Authenticated User -> Supabase
        if (userId && !userId.startsWith('guest_')) {
            try {
                const { error } = await supabase
                    .from('matches')
                    .delete()
                    .eq('id', matchId);

                if (error) return { success: false, error: error.message };
                return { success: true };
            } catch (e: any) {
                return { success: false, error: e.message };
            }
        }

        // Guest User -> Local Storage
        else {
            try {
                const matches = await getLocalMatches();
                const filteredMatches = matches.filter(m => m.id !== matchId);
                await saveLocalMatches(filteredMatches);
                return { success: true };
            } catch (e: any) {
                return { success: false, error: e.message };
            }
        }
    }
};
