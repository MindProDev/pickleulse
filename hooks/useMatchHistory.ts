import { useAuth } from '@/context/AuthContext';
import { storage } from '@/lib/storage';
import type { Match } from '@/types/match';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useMatchHistory() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { user, guestId } = useAuth();

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setError(null);

            const userId = user?.id || guestId;
            const { data, error } = await storage.getMatches(userId || undefined);

            if (error) {
                throw new Error(error);
            }

            setMatches(data || []);
        } catch (e: any) {
            console.error('Error fetching matches:', e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchMatches();
        }, [user, guestId])
    );

    return {
        matches,
        loading,
        error,
        refetch: fetchMatches,
    };
}
