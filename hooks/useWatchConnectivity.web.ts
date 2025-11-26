interface UseWatchConnectivityProps {
    scoreA: number;
    scoreB: number;
    server: string;
    onScoreA: () => void;
    onScoreB: () => void;
    onUndo: () => void;
}

export function useWatchConnectivity(props: UseWatchConnectivityProps) {
    // No-op for web
}
