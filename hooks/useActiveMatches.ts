import { useAuth } from '@/context/AuthContext';
import { storage } from '@/lib/storage';
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

    const { user, guestId } = useAuth();

    /**
     * Fetch all active matches for the current user
     */
    const fetchActiveMatches = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const userId = user?.id || guestId;
            const { data, error: fetchError } = await storage.getActiveMatches(userId || undefined);

            if (fetchError) {
                throw new Error(fetchError);
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
    }, [user, guestId]);

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
            const userId = user?.id || guestId;
            const { error: updateError } = await storage.updateMatch(
                matchId,
                { is_active: false },
                userId || undefined
            );

            if (updateError) {
                throw new Error(updateError);
            }

            // Refresh active matches
            await fetchActiveMatches();
            return true;
        } catch (e: any) {
            console.error('Error marking match inactive:', e);
            setError(e.message);
            return false;
        }
    }, [fetchActiveMatches, user, guestId]);

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
