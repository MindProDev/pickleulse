/**
 * Type definitions for match-related data structures
 */

export type MatchType = 'singles' | 'doubles';
export type Server = 'team_a' | 'team_b';

/**
 * Match setup configuration
 */
export interface MatchSetup {
    matchType: MatchType;
    scoringRule: number; // Points to win (11, 15, or custom)
    teamAName?: string;
    teamBName?: string;
    firstServer: Server;
}

/**
 * Live match state during gameplay
 */
export interface MatchState {
    id?: string; // Database ID of the active match
    scoreA: number;
    scoreB: number;
    server: Server;
    rallyCount: number;
    startTime: Date;
    matchType: MatchType;
    scoringRule: number;
    teamAName?: string;
    teamBName?: string;
}

/**
 * Match record stored in database
 */
export interface Match {
    id: string;
    created_at: string;
    score_p1: number;
    score_p2: number;
    match_type: MatchType;
    scoring_rule: number;
    team_a_name?: string;
    team_b_name?: string;
    duration_seconds?: number;
    rally_count: number;
    server: Server;
    ended_at?: string;
    is_active?: boolean; // Whether this match is currently in progress
}

/**
 * Match summary for display after game ends
 */
export interface MatchSummary {
    finalScoreA: number;
    finalScoreB: number;
    winner: 'team_a' | 'team_b';
    winnerName?: string;
    duration: number; // in seconds
    rallyCount: number;
    matchType: MatchType;
    teamAName?: string;
    teamBName?: string;
    endedAt: Date;
}

/**
 * Action for undo functionality
 */
export interface MatchAction {
    type: 'score_a' | 'score_b' | 'switch_server';
    timestamp: Date;
    previousState: {
        scoreA: number;
        scoreB: number;
        server: Server;
        rallyCount: number;
    };
}

/**
 * Settings for match preferences
 */
export interface MatchSettings {
    defaultMatchType: MatchType;
    defaultScoringRule: number;
    hapticsEnabled: boolean;
    soundEnabled: boolean;
    theme: 'light' | 'dark' | 'auto';
}
