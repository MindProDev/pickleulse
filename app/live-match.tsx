import FuturisticCourt from '@/components/FuturisticCourt';
import { Typography } from '@/constants/theme';
import { useMatchContext } from '@/context/MatchContext';
import { useHaptics } from '@/hooks/useHaptics';
import { useWatchConnectivity } from '@/hooks/useWatchConnectivity';
import type { MatchSetup } from '@/types/match';
import { showAlert } from '@/utils/alert';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowCounterClockwise, CaretDown, StopCircle, TennisBall } from 'phosphor-react-native';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Futuristic Live Match Screen
 */
export default function LiveMatchScreen() {
    const params = useLocalSearchParams();
    const { scoreHaptic, undoHaptic, successHaptic, errorHaptic } = useHaptics();

    const {
        matchState,
        scoreTeamA,
        scoreTeamB,
        undo,
        endMatch,
        saveMatch,
        isMatchWon,
        canUndo,
        isMatchActive,
        startMatch,
    } = useMatchContext();

    // Initialize match if needed
    useEffect(() => {
        if (!isMatchActive && params.matchType) {
            const setup: MatchSetup = {
                matchType: (params.matchType as any) || 'singles',
                scoringRule: Number(params.scoringRule) || 11,
                teamAName: params.teamAName as string,
                teamBName: params.teamBName as string,
                firstServer: (params.firstServer as any) || 'team_a',
            };
            startMatch(setup);
        }
    }, [isMatchActive, params, startMatch]);

    // Auto-end match when a team reaches the scoring rule
    useEffect(() => {
        if (isMatchActive && isMatchWon()) {
            // Small delay to show the final score before transitioning
            const timer = setTimeout(async () => {
                const summary = await endMatch();
                const result = await saveMatch(summary);

                if (result.success) {
                    successHaptic();
                    router.push({
                        pathname: '/match-summary',
                        params: summary as any,
                    });
                } else {
                    errorHaptic();
                    showAlert('Error', result.error || 'Failed to save match');
                }
            }, 800); // 800ms delay to show final score

            return () => clearTimeout(timer);
        }
    }, [matchState.scoreA, matchState.scoreB, isMatchActive, isMatchWon, endMatch, saveMatch, successHaptic, errorHaptic]);

    const handleScoreA = () => {
        scoreHaptic();
        scoreTeamA();
    };

    const handleScoreB = () => {
        scoreHaptic();
        scoreTeamB();
    };

    const handleUndo = () => {
        if (!canUndo) return;
        undoHaptic();
        undo();
    };

    const handleEndMatch = () => {
        showAlert(
            'End Match',
            'Are you sure you want to end this match?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'End Match',
                    style: 'destructive',
                    onPress: async () => {
                        const summary = await endMatch();
                        const result = await saveMatch(summary);

                        if (result.success) {
                            successHaptic();
                            router.push({
                                pathname: '/match-summary',
                                params: summary as any,
                            });
                        } else {
                            errorHaptic();
                            showAlert('Error', result.error || 'Failed to save match');
                        }
                    },
                },
            ]
        );
    };

    // Integrate Watch Connectivity
    useWatchConnectivity({
        scoreA: matchState.scoreA,
        scoreB: matchState.scoreB,
        server: matchState.server,
        onScoreA: handleScoreA,
        onScoreB: handleScoreB,
        onUndo: handleUndo,
    });

    const teamAName = matchState.teamAName || 'Team A';
    const teamBName = matchState.teamBName || 'Team B';

    return (
        <View style={styles.container}>
            <FuturisticCourt />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <CaretDown size={24} color="#fff" weight="bold" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Live Match</Text>
                    <View style={{ width: 40 }} />
                </View>

                <View style={styles.content}>
                    {/* Score Card */}
                    <Animated.View
                        entering={FadeInDown.delay(100).springify()}
                        style={styles.scoreCard}
                    >
                        {/* Team A */}
                        <TouchableOpacity
                            style={[styles.teamSection, matchState.server === 'team_a' && styles.activeServer]}
                            onPress={handleScoreA}
                            activeOpacity={0.9}
                            disabled={isMatchWon()}
                        >
                            <View style={styles.playerInfo}>
                                <Text style={styles.teamName} numberOfLines={1}>{teamAName}</Text>
                                {matchState.server === 'team_a' && (
                                    <View style={styles.serverBadge}>
                                        <TennisBall size={12} color="#0f172a" weight="fill" />
                                        <Text style={styles.serverText}>Serving</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.scoreBig}>{matchState.scoreA}</Text>
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Team B */}
                        <TouchableOpacity
                            style={[styles.teamSection, matchState.server === 'team_b' && styles.activeServer]}
                            onPress={handleScoreB}
                            activeOpacity={0.9}
                            disabled={isMatchWon()}
                        >
                            <View style={styles.playerInfo}>
                                <Text style={styles.teamName} numberOfLines={1}>{teamBName}</Text>
                                {matchState.server === 'team_b' && (
                                    <View style={styles.serverBadge}>
                                        <TennisBall size={12} color="#0f172a" weight="fill" />
                                        <Text style={styles.serverText}>Serving</Text>
                                    </View>
                                )}
                            </View>
                            <Text style={styles.scoreBig}>{matchState.scoreB}</Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Controls */}
                    <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.controls}>
                        <TouchableOpacity
                            onPress={handleUndo}
                            disabled={!canUndo}
                            style={[styles.controlButton, !canUndo && styles.controlButtonDisabled]}
                        >
                            <ArrowCounterClockwise size={24} color={!canUndo ? '#475569' : '#e2e8f0'} weight="bold" />
                            <Text style={[styles.controlButtonText, !canUndo && styles.textDisabled]}>Undo</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleEndMatch}
                            style={[styles.controlButton, styles.endButton]}
                        >
                            <StopCircle size={24} color="#ef4444" weight="duotone" />
                            <Text style={[styles.controlButtonText, styles.textDanger]}>End Match</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1e293b', // Lighter slate for better web visibility
    },
    safeArea: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...Typography.h4,
        color: '#fff',
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        alignItems: 'center', // Center horizontally for web
        maxWidth: 600, // Constrain width on large screens
        width: '100%',
        alignSelf: 'center',
    },
    scoreCard: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Darker, more opaque for better contrast
        borderRadius: 32,
        overflow: 'hidden',
        borderWidth: 2, // Thicker border
        borderColor: '#22d3ee', // Bright cyan border
        shadowColor: '#22d3ee', // Cyan glow
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4, // Stronger glow
        shadowRadius: 24,
        elevation: 10,
        width: '100%', // Full width within constrained content
    },
    teamSection: {
        padding: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeServer: {
        backgroundColor: 'rgba(34, 197, 94, 0.15)', // Vibrant green tint for active server
    },
    divider: {
        height: 1,
        backgroundColor: '#334155',
        width: '100%',
    },
    playerInfo: {
        alignItems: 'center',
        marginBottom: 12,
    },
    teamName: {
        ...Typography.h3,
        color: '#cbd5e1', // Brighter text for better readability
        textAlign: 'center',
        marginBottom: 8,
    },
    serverBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#22d3ee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    serverText: {
        ...Typography.label,
        color: '#0f172a',
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    scoreBig: {
        fontSize: 96, // Reduced from Typography.scoreLarge (120)
        fontWeight: '800',
        color: '#f8fafc',
        fontVariant: ['tabular-nums'],
        textShadowColor: 'rgba(255, 255, 255, 0.2)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginTop: 40,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(51, 65, 85, 0.9)', // Lighter, more visible background
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#475569', // Brighter border
    },
    controlButtonDisabled: {
        opacity: 0.5,
        borderColor: 'transparent',
    },
    endButton: {
        borderColor: 'rgba(239, 68, 68, 0.3)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
    },
    controlButtonText: {
        ...Typography.button,
        color: '#e2e8f0',
    },
    textDisabled: {
        color: '#475569',
    },
    textDanger: {
        color: '#ef4444',
    },
});
