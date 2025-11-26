import { getThemedColors, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Match } from '@/types/match';
import { TennisBall, Users } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MatchCardProps {
    match: Match;
    onPress?: () => void;
}

/**
 * Enhanced match history card showing all match details
 * Displays team names, scores, duration, match type, and winner
 */
export function MatchCard({ match, onPress }: MatchCardProps) {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const teamAName = match.team_a_name || 'Team A';
    const teamBName = match.team_b_name || 'Team B';
    const winner = match.score_p1 > match.score_p2 ? teamAName : teamBName;
    const date = new Date(match.created_at).toLocaleDateString();
    const time = new Date(match.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const formatDuration = (seconds?: number) => {
        if (!seconds) return 'N/A';
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const MatchTypeIcon = match.match_type === 'doubles' ? Users : TennisBall;

    const CardContent = (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            {/* Header with match type and date */}
            <View style={styles.header}>
                <View style={styles.matchTypeContainer}>
                    <MatchTypeIcon size={24} color={colors.textSecondary} weight="duotone" />
                    <Text style={[styles.matchType, { color: colors.textSecondary }]}>
                        {match.match_type}
                    </Text>
                </View>
                <View style={styles.dateContainer}>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>{date}</Text>
                    <Text style={[styles.dateText, { color: colors.textSecondary }]}>{time}</Text>
                </View>
            </View>

            {/* Score display */}
            <View style={styles.scoreRow}>
                <View style={styles.teamScore}>
                    <Text style={[styles.teamName, { color: colors.textPrimary }]}>{teamAName}</Text>
                    <Text style={[styles.score, { color: colors.textPrimary }]}>{match.score_p1}</Text>
                </View>

                <Text style={[styles.scoreSeparator, { color: colors.textTertiary }]}>-</Text>

                <View style={styles.teamScoreRight}>
                    <Text style={[styles.teamName, { color: colors.textPrimary }]}>{teamBName}</Text>
                    <Text style={[styles.score, { color: colors.textPrimary }]}>{match.score_p2}</Text>
                </View>
            </View>

            {/* Winner and stats */}
            <View style={[styles.footer, { borderTopColor: colors.border }]}>
                <Text style={[styles.winnerText, { color: colors.success }]}>
                    {winner} Won
                </Text>
                <View style={styles.statsContainer}>
                    {match.duration_seconds && (
                        <View style={styles.stat}>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formatDuration(match.duration_seconds)}</Text>
                        </View>
                    )}
                    {match.rally_count > 0 && (
                        <View style={styles.stat}>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rallies</Text>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{match.rally_count}</Text>
                        </View>
                    )}
                </View>
            </View>
        </View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
                {CardContent}
            </TouchableOpacity>
        );
    }

    return CardContent;
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    matchTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    matchTypeIcon: {
        // Removed as we use Phosphor component directly
    },
    matchType: {
        ...Typography.caption,
        textTransform: 'capitalize',
    },
    dateContainer: {
        alignItems: 'flex-end',
    },
    dateText: {
        ...Typography.label,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    teamScore: {
        flex: 1,
    },
    teamScoreRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    teamName: {
        ...Typography.bodyMedium,
    },
    score: {
        ...Typography.h1,
        fontFamily: 'JetBrainsMono-Bold',
        marginTop: 4,
    },
    scoreSeparator: {
        ...Typography.h2,
        marginHorizontal: 16,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
    },
    winnerText: {
        ...Typography.label,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
    },
    stat: {
        alignItems: 'center',
    },
    statLabel: {
        ...Typography.label,
    },
    statValue: {
        ...Typography.label,
        fontWeight: '600',
    },
});
