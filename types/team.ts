export interface Team {
    id: string;
    created_at: string;
    updated_at: string;
    name: string;
    player1_id: string;
    player2_id: string;
    avatar_url?: string;
}

export interface TeamWithStats extends Team {
    wins: number;
    losses: number;
    winRate: number;
    totalMatches: number;
}
