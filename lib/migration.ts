import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

/**
 * Migrate guest data to authenticated user account
 * 
 * @param userId The authenticated user ID to migrate data to
 * @returns Result of migration
 */
export async function migrateGuestData(userId: string): Promise<{ success: boolean; count: number; error?: string }> {
    try {
        // 1. Get all guest matches
        // We pass undefined to get local matches
        const { data: guestMatches, error: fetchError } = await storage.getMatches(undefined);

        if (fetchError) {
            return { success: false, count: 0, error: fetchError };
        }

        if (guestMatches.length === 0) {
            return { success: true, count: 0 };
        }

        // 2. Prepare matches for insertion
        // Remove local IDs and add user_id
        const matchesToInsert = guestMatches.map(match => ({
            score_p1: match.score_p1,
            score_p2: match.score_p2,
            match_type: match.match_type,
            scoring_rule: match.scoring_rule,
            team_a_name: match.team_a_name,
            team_b_name: match.team_b_name,
            duration_seconds: match.duration_seconds,
            rally_count: match.rally_count,
            server: match.server,
            ended_at: match.ended_at,
            is_active: false, // Ensure migrated matches are not active to avoid conflicts
            user_id: userId,
            // Let Supabase generate new IDs and created_at
        }));

        // 3. Insert into Supabase
        const { error: insertError } = await supabase
            .from('matches')
            .insert(matchesToInsert);

        if (insertError) {
            console.error('Error migrating matches:', insertError);
            return { success: false, count: 0, error: insertError.message };
        }

        // 4. Clear local storage
        // We delete each match individually to be safe, or we could clear the key
        // For now, let's clear the key via storage interface if possible, 
        // but our interface only deletes by ID.
        // Let's use a loop to delete local matches
        for (const match of guestMatches) {
            await storage.deleteMatch(match.id, undefined);
        }

        return { success: true, count: matchesToInsert.length };
    } catch (e: any) {
        console.error('Unexpected error during migration:', e);
        return { success: false, count: 0, error: e.message };
    }
}
