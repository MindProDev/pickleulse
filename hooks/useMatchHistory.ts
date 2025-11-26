import { supabase } from '@/lib/supabase';
import type { Match } from '@/types/match';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

export function useMatchHistory() {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMatches = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data, error } = await supabase
                .from('matches')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                throw error;
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
        }, [])
    );

    return {
        matches,
        loading,
        error,
        refetch: fetchMatches,
    };
}
