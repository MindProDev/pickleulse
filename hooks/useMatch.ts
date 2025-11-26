import { supabase } from '@/lib/supabase';
import type { MatchAction, MatchSetup, MatchState, MatchSummary } from '@/types/match';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Core hook for managing match state
 * Handles scoring, server tracking, undo, and persistence
 */
export function useMatch(initialSetup?: MatchSetup) {
    const [matchState, setMatchState] = useState<MatchState>(() => ({
        scoreA: 0,
        scoreB: 0,
        server: initialSetup?.firstServer || 'team_a',
        rallyCount: 0,
        startTime: new Date(),
        matchType: initialSetup?.matchType || 'singles',
        scoringRule: initialSetup?.scoringRule || 11,
        teamAName: initialSetup?.teamAName,
        teamBName: initialSetup?.teamBName,
    }));

    const [undoStack, setUndoStack] = useState<MatchAction[]>([]);
    const [isMatchActive, setIsMatchActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Start the match timer
     */
    const startMatch = useCallback(() => {
        setIsMatchActive(true);
        setMatchState(prev => ({ ...prev, startTime: new Date() }));
    }, []);

    /**
     * Score a point for Team A
     */
    const scoreTeamA = useCallback(() => {
        setMatchState(prev => {
            // Save current state for undo
            const action: MatchAction = {
                type: 'score_a',
                timestamp: new Date(),
                previousState: {
                    scoreA: prev.scoreA,
                    scoreB: prev.scoreB,
                    server: prev.server,
                    rallyCount: prev.rallyCount,
                },
            };
            setUndoStack(stack => [...stack, action]);

            return {
                ...prev,
                scoreA: prev.scoreA + 1,
                rallyCount: prev.rallyCount + 1,
            };
        });
    }, []);

    /**
     * Score a point for Team B
     */
    const scoreTeamB = useCallback(() => {
        setMatchState(prev => {
            // Save current state for undo
            const action: MatchAction = {
                type: 'score_b',
                timestamp: new Date(),
                previousState: {
                    scoreA: prev.scoreA,
                    scoreB: prev.scoreB,
                    server: prev.server,
                    rallyCount: prev.rallyCount,
                },
            };
            setUndoStack(stack => [...stack, action]);

            return {
                ...prev,
                scoreB: prev.scoreB + 1,
                rallyCount: prev.rallyCount + 1,
            };
        });
    }, []);

    /**
     * Switch server manually
     */
    const switchServer = useCallback(() => {
        setMatchState(prev => {
            // Save current state for undo
            const action: MatchAction = {
                type: 'switch_server',
                timestamp: new Date(),
                previousState: {
                    scoreA: prev.scoreA,
                    scoreB: prev.scoreB,
                    server: prev.server,
                    rallyCount: prev.rallyCount,
                },
            };
            setUndoStack(stack => [...stack, action]);

            return {
                ...prev,
                server: prev.server === 'team_a' ? 'team_b' : 'team_a',
            };
        });
    }, []);

    /**
     * Undo the last action
     */
    const undo = useCallback(() => {
        if (undoStack.length === 0) return;

        const lastAction = undoStack[undoStack.length - 1];
        setMatchState(prev => ({
            ...prev,
            scoreA: lastAction.previousState.scoreA,
            scoreB: lastAction.previousState.scoreB,
            server: lastAction.previousState.server,
            rallyCount: lastAction.previousState.rallyCount,
        }));

        setUndoStack(stack => stack.slice(0, -1));
    }, [undoStack]);

    /**
     * Reset the match
     */
    const resetMatch = useCallback(() => {
        setMatchState(prev => ({
            ...prev,
            scoreA: 0,
            scoreB: 0,
            rallyCount: 0,
            startTime: new Date(),
        }));
        setUndoStack([]);
    }, []);

    /**
     * End the match and return summary
     */
    const endMatch = useCallback((): MatchSummary => {
        setIsMatchActive(false);

        const duration = Math.floor((new Date().getTime() - matchState.startTime.getTime()) / 1000);
        const winner: 'team_a' | 'team_b' = matchState.scoreA > matchState.scoreB ? 'team_a' : 'team_b';
        const winnerName = winner === 'team_a' ? matchState.teamAName : matchState.teamBName;

        return {
            finalScoreA: matchState.scoreA,
            finalScoreB: matchState.scoreB,
            winner,
            winnerName,
            duration,
            rallyCount: matchState.rallyCount,
            matchType: matchState.matchType,
            teamAName: matchState.teamAName,
            teamBName: matchState.teamBName,
            endedAt: new Date(),
        };
    }, [matchState]);

    /**
     * Save match to database
     */
    const saveMatch = useCallback(async (summary: MatchSummary): Promise<{ success: boolean; error?: string }> => {
        try {
            const { error } = await supabase.from('matches').insert({
                score_p1: summary.finalScoreA,
                score_p2: summary.finalScoreB,
                match_type: summary.matchType,
                scoring_rule: matchState.scoringRule,
                team_a_name: summary.teamAName,
                team_b_name: summary.teamBName,
                duration_seconds: summary.duration,
                rally_count: summary.rallyCount,
                server: matchState.server,
                ended_at: summary.endedAt.toISOString(),
            });

            if (error) {
                console.error('Error saving match:', error);
                return { success: false, error: error.message };
            }

            return { success: true };
        } catch (e) {
            console.error('Unexpected error saving match:', e);
            return { success: false, error: 'An unexpected error occurred' };
        }
    }, [matchState]);

    /**
     * Check if match is won
     */
    const isMatchWon = useCallback(() => {
        const { scoreA, scoreB, scoringRule } = matchState;
        return scoreA >= scoringRule || scoreB >= scoringRule;
    }, [matchState]);

    /**
     * Get current match duration in seconds
     */
    const getMatchDuration = useCallback(() => {
        if (!isMatchActive) return 0;
        return Math.floor((new Date().getTime() - matchState.startTime.getTime()) / 1000);
    }, [isMatchActive, matchState.startTime]);

    // Cleanup timer on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return {
        matchState,
        scoreTeamA,
        scoreTeamB,
        switchServer,
        undo,
        resetMatch,
        startMatch,
        endMatch,
        saveMatch,
        isMatchWon,
        getMatchDuration,
        canUndo: undoStack.length > 0,
        isMatchActive,
    };
}
