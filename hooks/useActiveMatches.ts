import { supabase } from '@/lib/supabase';
import type { Match } from '@/types/match';
import { useCallback, useState } from 'react';

/**
 * Hook for managing active matches
 * Provides utilities to check and manage active match state
 */
export function useActiveMatches() {
    const [activeMatches, setActiveMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Fetch all active matches for the current user
     */
    const fetchActiveMatches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error: fetchError } = await supabase
                .from('matches')
                .select('*')
                .eq('is_active', true)
                .order('created_at', { ascending: false });

            if (fetchError) {
                throw fetchError;
            }

            setActiveMatches(data || []);
            return data || [];
        } catch (e: any) {
            console.error('Error fetching active matches:', e);
            setError(e.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Get count of active matches
     */
    const getActiveMatchCount = useCallback(async (): Promise<number> => {
        const matches = await fetchActiveMatches();
        return matches.length;
    }, [fetchActiveMatches]);

    /**
     * Check if user has any active matches
     */
    const hasActiveMatch = useCallback(async (): Promise<boolean> => {
        const count = await getActiveMatchCount();
        return count > 0;
    }, [getActiveMatchCount]);

    /**
     * Get the first active match (most recent)
     */
    const getFirstActiveMatch = useCallback(async (): Promise<Match | null> => {
        const matches = await fetchActiveMatches();
        return matches.length > 0 ? matches[0] : null;
    }, [fetchActiveMatches]);

    /**
     * Mark a match as inactive
     */
    const markMatchInactive = useCallback(async (matchId: string): Promise<boolean> => {
        try {
            const { error: updateError } = await supabase
                .from('matches')
                .update({ is_active: false })
                .eq('id', matchId);

            if (updateError) {
                throw updateError;
            }

            // Refresh active matches
            await fetchActiveMatches();
            return true;
        } catch (e: any) {
            console.error('Error marking match inactive:', e);
            setError(e.message);
            return false;
        }
    }, [fetchActiveMatches]);

    return {
        activeMatches,
        loading,
        error,
        fetchActiveMatches,
        getActiveMatchCount,
        hasActiveMatch,
        getFirstActiveMatch,
        markMatchInactive,
    };
}
