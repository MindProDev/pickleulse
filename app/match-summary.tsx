import { ShareableMatchCard } from '@/components/ShareableMatchCard';
import { getThemedColors } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import type { MatchSummary } from '@/types/match';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useRef, useState } from 'react';
import { Platform, ScrollView, Share, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { captureRef } from 'react-native-view-shot';

/**
 * Match summary screen - Post-game results
 * Based on Section 4.4 of user guide
 */
export default function MatchSummaryScreen() {
    const params = useLocalSearchParams();
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { isPro } = useSubscription();
    const shareCardRef = useRef<View>(null);
    const [isCapturing, setIsCapturing] = useState(false);

    // Parse summary from params
    const summary: MatchSummary = {
        finalScoreA: Number(params.finalScoreA) || 0,
        finalScoreB: Number(params.finalScoreB) || 0,
        winner: (params.winner as any) || 'team_a',
        winnerName: params.winnerName as string,
        duration: Number(params.duration) || 0,
        rallyCount: Number(params.rallyCount) || 0,
        matchType: (params.matchType as any) || 'singles',
        teamAName: params.teamAName as string,
        teamBName: params.teamBName as string,
        endedAt: new Date(params.endedAt as string || Date.now()),
    };

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleShare = async () => {
        const teamAName = summary.teamAName || 'Team A';
        const teamBName = summary.teamBName || 'Team B';
        const message = `🎾 Pickleball Match Results\n\n${teamAName}: ${summary.finalScoreA}\n${teamBName}: ${summary.finalScoreB}\n\n🏆 Winner: ${summary.winnerName || (summary.winner === 'team_a' ? teamAName : teamBName)}\n⏱️ Duration: ${formatDuration(summary.duration)}\n🔄 Rallies: ${summary.rallyCount}\n\nTracked with PicklePulse`;

        try {
            await Share.share({ message });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleShareImage = async () => {
        if (!shareCardRef.current) return;

        try {
            setIsCapturing(true);
            const uri = await captureRef(shareCardRef, {
                format: 'png',
                quality: 1,
            });

            if (Platform.OS === 'web') {
                // On web, download the image
                const link = document.createElement('a');
                link.href = uri;
                link.download = `picklepulse-match-${Date.now()}.png`;
                link.click();
            } else {
                // On native, use Expo Sharing
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: 'Share Match Result',
                });
            }
        } catch (error) {
            console.error('Error sharing image:', error);
        } finally {
            setIsCapturing(false);
        }
    };

    const handleNewMatch = () => {
        router.replace('/match-setup');
    };

    const handleBackHome = () => {
        router.replace('/(tabs)');
    };

    const teamAName = summary.teamAName || 'Team A';
    const teamBName = summary.teamBName || 'Team B';
    const winnerDisplayName = summary.winnerName || (summary.winner === 'team_a' ? teamAName : teamBName);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <ScrollView style={styles.scrollView}>
                {/* Winner Announcement */}
                <View style={styles.winnerSection}>
                    <Text style={styles.trophy}>🏆</Text>
                    <Text style={[styles.winnerName, { color: colors.textPrimary }]}>
                        {winnerDisplayName}
                    </Text>
                    <Text style={[styles.winsText, { color: colors.textSecondary }]}>
                        Wins!
                    </Text>
                </View>

                {/* Final Score */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
                        FINAL SCORE
                    </Text>

                    <View style={styles.scoreRow}>
                        <View style={styles.teamScore}>
                            <Text style={[styles.teamLabel, { color: colors.textPrimary }]}>{teamAName}</Text>
                            <Text style={[
                                styles.finalScore,
                                summary.winner === 'team_a' ? { color: colors.success } : { color: colors.textTertiary }
                            ]}>
                                {summary.finalScoreA}
                            </Text>
                        </View>

                        <Text style={[styles.scoreSeparator, { color: colors.textTertiary }]}>-</Text>

                        <View style={styles.teamScore}>
                            <Text style={[styles.teamLabel, { color: colors.textPrimary }]}>{teamBName}</Text>
                            <Text style={[
                                styles.finalScore,
                                summary.winner === 'team_b' ? { color: colors.success } : { color: colors.textTertiary }
                            ]}>
                                {summary.finalScoreB}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Match Stats */}
                <View style={[styles.card, { backgroundColor: colors.card }]}>
                    <Text style={[styles.cardTitle, { color: colors.textSecondary }]}>
                        MATCH STATS
                    </Text>

                    <View style={styles.statsRow}>
                        <View style={styles.stat}>
                            <Text style={styles.statIcon}>⏱️</Text>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{formatDuration(summary.duration)}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Duration</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statIcon}>🔄</Text>
                            <Text style={[styles.statValue, { color: colors.textPrimary }]}>{summary.rallyCount}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rallies</Text>
                        </View>

                        <View style={styles.stat}>
                            <Text style={styles.statIcon}>{summary.matchType === 'doubles' ? '👥' : '🎾'}</Text>
                            <Text style={[styles.statValue, styles.capitalize, { color: colors.textPrimary }]}>{summary.matchType}</Text>
                            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Type</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.buttonContainer}>
                    {/* Share Button */}
                    <TouchableOpacity
                        onPress={handleShare}
                        style={[styles.shareButton, { backgroundColor: colors.accent }]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.buttonText, { color: colors.backgroundPrimary }]}>
                            📤 Share Results
                        </Text>
                    </TouchableOpacity>

                    {/* Pro Image Share Button */}
                    {isPro && (
                        <TouchableOpacity
                            onPress={handleShareImage}
                            style={[styles.shareButton, { backgroundColor: colors.accentDark }]}
                            activeOpacity={0.8}
                            disabled={isCapturing}
                        >
                            <Text style={[styles.buttonText, { color: colors.backgroundPrimary }]}>
                                {isCapturing ? '⏳ Generating...' : '🖼️ Share as Image (Pro)'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* New Match Button */}
                    <TouchableOpacity
                        onPress={handleNewMatch}
                        style={[styles.newMatchButton, { backgroundColor: colors.success }]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.buttonText, { color: colors.backgroundPrimary }]}>
                            🎾 New Match
                        </Text>
                    </TouchableOpacity>

                    {/* Back to Home */}
                    <TouchableOpacity
                        onPress={handleBackHome}
                        style={[styles.homeButton, { backgroundColor: colors.backgroundSecondary }]}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.homeButtonText, { color: colors.textPrimary }]}>
                            Back to Home
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Hidden Shareable Card for Image Capture */}
            <View style={styles.hiddenCard}>
                <View ref={shareCardRef} collapsable={false}>
                    <ShareableMatchCard summary={summary} />
                </View>
            </View>
        </SafeAreaView >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    winnerSection: {
        alignItems: 'center',
        marginBottom: 32,
    },
    trophy: {
        fontSize: 60,
        marginBottom: 16,
    },
    winnerName: {
        fontSize: 36,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    winsText: {
        fontSize: 24,
    },
    card: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
    },
    cardTitle: {
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 1,
        fontSize: 12,
        fontWeight: '600',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    teamScore: {
        alignItems: 'center',
    },
    teamLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    finalScore: {
        fontSize: 60,
        fontWeight: 'bold',
    },
    winnerScore: {
    },
    loserScore: {
    },
    scoreSeparator: {
        fontSize: 36,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    stat: {
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    capitalize: {
        textTransform: 'capitalize',
    },
    statLabel: {
        fontSize: 14,
        marginTop: 4,
    },
    buttonContainer: {
        gap: 12,
    },
    shareButton: {
        paddingVertical: 20,
        borderRadius: 12,
    },
    newMatchButton: {
        paddingVertical: 20,
        borderRadius: 12,
    },
    homeButton: {
        paddingVertical: 16,
        borderRadius: 12,
    },
    buttonText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
    },
    homeButtonText: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 18,
    },
    proButton: {
    },
    hiddenCard: {
        position: 'absolute',
        left: -9999,
        top: -9999,
    },
});
