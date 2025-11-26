import { Paywall } from '@/components/Paywall';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getThemedColors, Typography } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StatsScreen() {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { matches, loading } = useMatchHistory();
    const { isPro } = useSubscription();
    const [showPaywall, setShowPaywall] = useState(false);

    // Calculate Stats
    const totalMatches = matches.length;

    // Assume User is always Team A for personal stats
    const wins = matches.filter(m => m.score_p1 > m.score_p2).length;
    const losses = totalMatches - wins;
    const winRate = totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0;

    const totalPointsScored = matches.reduce((acc, m) => acc + m.score_p1, 0);
    const totalPointsConceded = matches.reduce((acc, m) => acc + m.score_p2, 0);

    // Calculate Streak
    let currentStreak = 0;
    let isWinStreak = true;

    if (matches.length > 0) {
        // Matches are ordered by created_at desc (newest first)
        const firstResult = matches[0].score_p1 > matches[0].score_p2;
        isWinStreak = firstResult;

        for (const match of matches) {
            const result = match.score_p1 > match.score_p2;
            if (result === isWinStreak) {
                currentStreak++;
            } else {
                break;
            }
        }
    }

    const StatCard = ({ label, value, icon, color }: { label: string, value: string | number, icon: string, color: string }) => (
        <View style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                <IconSymbol name={icon as any} size={24} color={color} weight="duotone" />
            </View>
            <View>
                <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
            </View>
        </View>
    );

    if (!isPro) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
                <View style={styles.header}>
                    <Text style={[styles.headerText, { color: colors.textPrimary }]}>Statistics</Text>
                </View>

                <View style={styles.lockContainer}>
                    <IconSymbol name="lock.fill" size={64} color={colors.accent} weight="duotone" />
                    <Text style={[styles.lockTitle, { color: colors.textPrimary }]}>Pro Feature</Text>
                    <Text style={[styles.lockDescription, { color: colors.textSecondary }]}>
                        Upgrade to Pro to view detailed statistics, win rates, and performance trends.
                    </Text>
                    <TouchableOpacity
                        style={styles.upgradeButton}
                        onPress={() => setShowPaywall(true)}
                    >
                        <Text style={styles.upgradeButtonText}>Unlock Stats</Text>
                    </TouchableOpacity>
                </View>

                <Paywall visible={showPaywall} onClose={() => setShowPaywall(false)} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={[styles.headerText, { color: colors.textPrimary }]}>Statistics</Text>
                </View>

                <View style={styles.grid}>
                    <StatCard
                        label="Win Rate"
                        value={`${winRate}%`}
                        icon="chart.bar.fill"
                        color={colors.accent}
                    />
                    <StatCard
                        label="Total Matches"
                        value={totalMatches}
                        icon="sportscourt.fill"
                        color="#f59e0b"
                    />
                    <StatCard
                        label="Current Streak"
                        value={`${currentStreak} ${isWinStreak ? 'W' : 'L'}`}
                        icon="flame.fill"
                        color={isWinStreak ? colors.error : colors.textSecondary}
                    />
                    <StatCard
                        label="Points Scored"
                        value={totalPointsScored}
                        icon="sportscourt.fill"
                        color="#8b5cf6"
                    />
                </View>

                <View style={[styles.section, { backgroundColor: colors.card }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Performance</Text>
                    <View style={styles.row}>
                        <View style={styles.rowItem}>
                            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Wins</Text>
                            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{wins}</Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Losses</Text>
                            <Text style={[styles.rowValue, { color: colors.textPrimary }]}>{losses}</Text>
                        </View>
                        <View style={styles.rowItem}>
                            <Text style={[styles.rowLabel, { color: colors.textSecondary }]}>Points Diff</Text>
                            <Text style={[styles.rowValue, { color: totalPointsScored >= totalPointsConceded ? colors.success : colors.error }]}>
                                {totalPointsScored - totalPointsConceded > 0 ? '+' : ''}{totalPointsScored - totalPointsConceded}
                            </Text>
                        </View>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 24,
    },
    header: {
        marginBottom: 24,
        paddingHorizontal: 24,
        paddingTop: 12,
    },
    headerText: {
        ...Typography.h1,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        borderRadius: 16,
        padding: 16,
        width: '47%', // roughly half minus gap
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    statValue: {
        ...Typography.h3,
        marginBottom: 4,
    },
    statLabel: {
        ...Typography.caption,
    },
    section: {
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    sectionTitle: {
        ...Typography.h4,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowItem: {
        alignItems: 'center',
    },
    rowLabel: {
        ...Typography.caption,
        marginBottom: 4,
    },
    rowValue: {
        ...Typography.h4,
    },
    lockContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    lockTitle: {
        ...Typography.h3,
        marginTop: 24,
        marginBottom: 12,
    },
    lockDescription: {
        ...Typography.body,
        textAlign: 'center',
        marginBottom: 32,
    },
    upgradeButton: {
        backgroundColor: '#14b8a6',
        paddingHorizontal: 32,
        paddingVertical: 16,
        borderRadius: 100,
    },
    upgradeButtonText: {
        ...Typography.button,
        color: '#fff',
    },
});
