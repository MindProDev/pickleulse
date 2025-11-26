import { supabase } from '@/lib/supabase';
import type { MatchAction, MatchSetup, MatchState, MatchSummary } from '@/types/match';
import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

interface MatchContextType {
    matchState: MatchState;
    isMatchActive: boolean;
    canUndo: boolean;
    startMatch: (setup: MatchSetup) => Promise<void>;
    scoreTeamA: () => void;
    scoreTeamB: () => void;
    switchServer: () => void;
    undo: () => void;
    endMatch: () => Promise<MatchSummary>;
    saveMatch: (summary: MatchSummary) => Promise<{ success: boolean; error?: string }>;
    isMatchWon: () => boolean;
    getMatchDuration: () => number;
    resetMatch: () => void;
}

const MatchContext = createContext<MatchContextType | undefined>(undefined);

export function MatchProvider({ children }: { children: React.ReactNode }) {
    const [matchState, setMatchState] = useState<MatchState>({
        scoreA: 0,
        scoreB: 0,
        server: 'team_a',
        rallyCount: 0,
        startTime: new Date(),
        matchType: 'singles',
        scoringRule: 11,
    });

    const [undoStack, setUndoStack] = useState<MatchAction[]>([]);
    const [isMatchActive, setIsMatchActive] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startMatch = useCallback(async (setup: MatchSetup) => {
        try {
            // Create a new match record in the database with is_active = true
            const { data, error } = await supabase.from('matches').insert({
                score_p1: 0,
                score_p2: 0,
                match_type: setup.matchType,
                scoring_rule: setup.scoringRule,
                team_a_name: setup.teamAName,
                team_b_name: setup.teamBName,
                rally_count: 0,
                server: setup.firstServer,
                is_active: true,
            }).select().single();

            if (error) {
                console.error('Error creating match record:', error);
                throw error;
            }

            setMatchState({
                id: data.id,
                scoreA: 0,
                scoreB: 0,
                server: setup.firstServer,
                rallyCount: 0,
                startTime: new Date(),
                matchType: setup.matchType,
                scoringRule: setup.scoringRule,
                teamAName: setup.teamAName,
                teamBName: setup.teamBName,
            });
            setUndoStack([]);
            setIsMatchActive(true);
        } catch (e) {
            console.error('Failed to start match:', e);
            // Still allow match to start locally even if DB fails
            setMatchState({
                scoreA: 0,
                scoreB: 0,
                server: setup.firstServer,
                rallyCount: 0,
                startTime: new Date(),
                matchType: setup.matchType,
                scoringRule: setup.scoringRule,
                teamAName: setup.teamAName,
                teamBName: setup.teamBName,
            });
            setUndoStack([]);
            setIsMatchActive(true);
        }
    }, []);

    // Restore active match from database on mount
    useEffect(() => {
        const restoreActiveMatch = async () => {
            try {
                const { data, error } = await supabase
                    .from('matches')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (error) {
                    // No active match found or error - this is fine
                    console.log('No active match to restore');
                    return;
                }

                if (data) {
                    // Restore the match state
                    setMatchState({
                        id: data.id,
                        scoreA: data.score_p1,
                        scoreB: data.score_p2,
                        server: data.server,
                        rallyCount: data.rally_count,
                        startTime: new Date(data.created_at),
                        matchType: data.match_type,
                        scoringRule: data.scoring_rule,
                        teamAName: data.team_a_name,
                        teamBName: data.team_b_name,
                    });
                    setIsMatchActive(true);
                    console.log('Restored active match:', data.id);
                }
            } catch (e) {
                console.error('Error restoring active match:', e);
            }
        };

        restoreActiveMatch();
    }, []);

    const scoreTeamA = useCallback(() => {
        setMatchState(prev => {
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

    const scoreTeamB = useCallback(() => {
        setMatchState(prev => {
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

    const switchServer = useCallback(() => {
        setMatchState(prev => {
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

    // Sync match state to database whenever scores change
    useEffect(() => {
        const syncToDatabase = async () => {
            if (!isMatchActive || !matchState.id) return;

            try {
                await supabase
                    .from('matches')
                    .update({
                        score_p1: matchState.scoreA,
                        score_p2: matchState.scoreB,
                        server: matchState.server,
                        rally_count: matchState.rallyCount,
                    })
                    .eq('id', matchState.id);
            } catch (e) {
                console.error('Error syncing match to database:', e);
            }
        };

        syncToDatabase();
    }, [matchState.scoreA, matchState.scoreB, matchState.server, matchState.rallyCount, isMatchActive, matchState.id]);

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

    const endMatch = useCallback(async (): Promise<MatchSummary> => {
        // Mark match as inactive in database if we have a match ID
        if (matchState.id) {
            try {
                await supabase
                    .from('matches')
                    .update({ is_active: false })
                    .eq('id', matchState.id);
            } catch (e) {
                console.error('Error marking match inactive:', e);
            }
        }

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

    const isMatchWon = useCallback(() => {
        const { scoreA, scoreB, scoringRule } = matchState;
        return scoreA >= scoringRule || scoreB >= scoringRule;
    }, [matchState]);

    const getMatchDuration = useCallback(() => {
        if (!isMatchActive) return 0;
        return Math.floor((new Date().getTime() - matchState.startTime.getTime()) / 1000);
    }, [isMatchActive, matchState.startTime]);

    const resetMatch = useCallback(() => {
        setMatchState(prev => ({
            ...prev,
            scoreA: 0,
            scoreB: 0,
            rallyCount: 0,
            startTime: new Date(),
        }));
        setUndoStack([]);
        setIsMatchActive(false);
    }, []);

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    return (
        <MatchContext.Provider
            value={{
                matchState,
                isMatchActive,
                canUndo: undoStack.length > 0,
                startMatch,
                scoreTeamA,
                scoreTeamB,
                switchServer,
                undo,
                endMatch,
                saveMatch,
                isMatchWon,
                getMatchDuration,
                resetMatch,
            }}
        >
            {children}
        </MatchContext.Provider>
    );
}

export function useMatchContext() {
    const context = useContext(MatchContext);
    if (context === undefined) {
        throw new Error('useMatchContext must be used within a MatchProvider');
    }
    return context;
}
