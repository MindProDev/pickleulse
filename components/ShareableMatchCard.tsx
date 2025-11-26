import { Typography } from '@/constants/theme';
import { MatchSummary } from '@/types/match';
import { TennisBall, Trophy } from 'phosphor-react-native';
import { StyleSheet, Text, View } from 'react-native';

interface ShareableMatchCardProps {
    summary: MatchSummary;
}

/**
 * A beautiful, shareable match result card
 * Designed to be captured as an image for social sharing
 */
export function ShareableMatchCard({ summary }: ShareableMatchCardProps) {
    const teamAName = summary.teamAName || 'Team A';
    const teamBName = summary.teamBName || 'Team B';
    const winnerDisplayName = summary.winnerName || (summary.winner === 'team_a' ? teamAName : teamBName);

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={styles.card}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.appName}>PicklePulse</Text>
                <Text style={styles.matchType}>{summary.matchType.toUpperCase()}</Text>
            </View>

            {/* Trophy */}
            <View style={styles.trophyContainer}>
                <Trophy size={64} color="#fbbf24" weight="duotone" />
            </View>

            {/* Winner */}
            <View style={styles.winnerContainer}>
                <Text style={styles.winnerLabel}>WINNER</Text>
                <Text style={styles.winnerName}>{winnerDisplayName}</Text>
            </View>

            {/* Score */}
            <View style={styles.scoreContainer}>
                <View style={styles.teamScore}>
                    <Text style={styles.teamName}>{teamAName}</Text>
                    <Text style={[styles.score, summary.winner === 'team_a' && styles.winningScore]}>
                        {summary.finalScoreA}
                    </Text>
                </View>

                <Text style={styles.scoreSeparator}>-</Text>

                <View style={styles.teamScore}>
                    <Text style={styles.teamName}>{teamBName}</Text>
                    <Text style={[styles.score, summary.winner === 'team_b' && styles.winningScore]}>
                        {summary.finalScoreB}
                    </Text>
                </View>
            </View>

            {/* Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{formatDuration(summary.duration)}</Text>
                    <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.stat}>
                    <Text style={styles.statValue}>{summary.rallyCount}</Text>
                    <Text style={styles.statLabel}>Rallies</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Tracked with PicklePulse</Text>
                <TennisBall size={16} color="#9ca3af" weight="fill" />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: 400,
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 32,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    appName: {
        ...Typography.h3,
        color: '#14b8a6',
    },
    matchType: {
        ...Typography.label,
        color: '#6b7280',
        letterSpacing: 1,
    },
    trophyContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    trophy: {
        // Removed as we use Phosphor component directly
    },
    winnerContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    winnerLabel: {
        ...Typography.label,
        color: '#6b7280',
        letterSpacing: 2,
        marginBottom: 8,
    },
    winnerName: {
        ...Typography.h2,
        color: '#000',
    },
    scoreContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
        gap: 24,
    },
    teamScore: {
        alignItems: 'center',
    },
    teamName: {
        ...Typography.caption,
        color: '#6b7280',
        marginBottom: 8,
    },
    score: {
        ...Typography.hero,
        fontFamily: 'JetBrainsMono-Bold',
        color: '#9ca3af',
    },
    winningScore: {
        color: '#14b8a6',
    },
    scoreSeparator: {
        ...Typography.h1,
        color: '#d1d5db',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 48,
        paddingVertical: 24,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        marginBottom: 24,
    },
    stat: {
        alignItems: 'center',
    },
    statValue: {
        ...Typography.h3,
        color: '#000',
        marginBottom: 4,
    },
    statLabel: {
        ...Typography.label,
        color: '#6b7280',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    footerText: {
        ...Typography.caption,
        color: '#9ca3af',
    },
});
