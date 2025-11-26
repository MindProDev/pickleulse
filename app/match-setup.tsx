import { ActiveMatchAlert } from '@/components/ActiveMatchAlert';
import { getThemedColors, Typography } from '@/constants/theme';
import { useMatchContext } from '@/context/MatchContext';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { useActiveMatches } from '@/hooks/useActiveMatches';
import { useHaptics } from '@/hooks/useHaptics';
import type { Match, MatchSetup, MatchType, Server } from '@/types/match';
import { router } from 'expo-router';
import { ArrowRight, User, Users, X } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

if (Platform.OS === 'android') {
    if (UIManager.setLayoutAnimationEnabledExperimental) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
}

/**
 * Futuristic Match Setup Screen
 */
export default function MatchSetupScreen() {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { selectionHaptic } = useHaptics();
    const { startMatch } = useMatchContext();
    const { isPro } = useSubscription();
    const { getFirstActiveMatch } = useActiveMatches();

    const [matchType, setMatchType] = useState<MatchType>('singles');
    const [scoringRule, setScoringRule] = useState(11);

    // Singles Names
    const [p1Name, setP1Name] = useState('');
    const [p2Name, setP2Name] = useState('');

    // Doubles Names
    const [t1p1Name, setT1P1Name] = useState('');
    const [t1p2Name, setT1P2Name] = useState('');
    const [t2p1Name, setT2P1Name] = useState('');
    const [t2p2Name, setT2P2Name] = useState('');

    const [firstServer, setFirstServer] = useState<Server>('team_a');

    // Active match validation
    const [showActiveMatchAlert, setShowActiveMatchAlert] = useState(false);
    const [activeMatch, setActiveMatch] = useState<Match | null>(null);
    const [pendingSetup, setPendingSetup] = useState<MatchSetup | null>(null);

    // Check for active matches when screen loads (for free users)
    useEffect(() => {
        const checkActiveMatches = async () => {
            if (!isPro) {
                const active = await getFirstActiveMatch();
                if (active) {
                    setActiveMatch(active);
                    setShowActiveMatchAlert(true);
                }
            }
        };
        checkActiveMatches();
    }, [isPro, getFirstActiveMatch]);

    const toggleMatchType = (type: MatchType) => {
        if (matchType !== type) {
            selectionHaptic();
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setMatchType(type);
        }
    };

    const handleStartMatch = async () => {
        selectionHaptic();

        let teamAName = '';
        let teamBName = '';

        if (matchType === 'singles') {
            teamAName = p1Name.trim() || 'Player 1';
            teamBName = p2Name.trim() || 'Player 2';
        } else {
            const t1n1 = t1p1Name.trim() || 'P1';
            const t1n2 = t1p2Name.trim() || 'P2';
            const t2n1 = t2p1Name.trim() || 'P3';
            const t2n2 = t2p2Name.trim() || 'P4';
            teamAName = `${t1n1} & ${t1n2}`;
            teamBName = `${t2n1} & ${t2n2}`;
        }

        const setup: MatchSetup = {
            matchType,
            scoringRule,
            teamAName,
            teamBName,
            firstServer,
        };

        // Check for active matches for free users
        if (!isPro) {
            const active = await getFirstActiveMatch();
            if (active) {
                setActiveMatch(active);
                setPendingSetup(setup);
                setShowActiveMatchAlert(true);
                return;
            }
        }

        // Pro users or free users with no active match can proceed
        await startMatch(setup);
        router.push('/live-match');
    };

    const handleProceedAfterEnding = async () => {
        setShowActiveMatchAlert(false);
        if (pendingSetup) {
            await startMatch(pendingSetup);
            setPendingSetup(null);
            router.push('/live-match');
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <SafeAreaView style={styles.safeArea}>
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={[styles.closeButton, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                            <X size={24} color={colors.textSecondary} weight="bold" />
                        </TouchableOpacity>
                        <View>
                            <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>New Match</Text>
                            <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>Setup your game</Text>
                        </View>
                    </View>

                    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                        {/* Match Type Selection */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Match Format</Text>
                            <View style={[styles.segmentContainer, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                                <TouchableOpacity
                                    style={[styles.segmentButton, matchType === 'singles' && { backgroundColor: colors.accent, shadowColor: colors.accent }]}
                                    onPress={() => toggleMatchType('singles')}
                                    activeOpacity={0.8}
                                >
                                    <User size={16} color={matchType === 'singles' ? colors.backgroundPrimary : colors.textSecondary} weight={matchType === 'singles' ? 'fill' : 'regular'} />
                                    <Text style={[styles.segmentText, { color: matchType === 'singles' ? colors.backgroundPrimary : colors.textSecondary }, matchType === 'singles' && styles.segmentTextActive]}>1 vs 1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.segmentButton, matchType === 'doubles' && { backgroundColor: colors.accent, shadowColor: colors.accent }]}
                                    onPress={() => toggleMatchType('doubles')}
                                    activeOpacity={0.8}
                                >
                                    <Users size={18} color={matchType === 'doubles' ? colors.backgroundPrimary : colors.textSecondary} weight={matchType === 'doubles' ? 'fill' : 'regular'} />
                                    <Text style={[styles.segmentText, { color: matchType === 'doubles' ? colors.backgroundPrimary : colors.textSecondary }, matchType === 'doubles' && styles.segmentTextActive]}>2 vs 2</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Players Input */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Players</Text>

                            {matchType === 'singles' ? (
                                <View style={styles.inputsContainer}>
                                    <View style={styles.inputWrapper}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Player 1</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }]}
                                            placeholder="Name"
                                            value={p1Name}
                                            onChangeText={setP1Name}
                                            placeholderTextColor={colors.textTertiary}
                                        />
                                    </View>
                                    <View style={styles.vsBadge}>
                                        <Text style={[styles.vsText, { color: colors.textSecondary, backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>VS</Text>
                                    </View>
                                    <View style={styles.inputWrapper}>
                                        <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Player 2</Text>
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border, color: colors.textPrimary }]}
                                            placeholder="Name"
                                            value={p2Name}
                                            onChangeText={setP2Name}
                                            placeholderTextColor={colors.textTertiary}
                                        />
                                    </View>
                                </View>
                            ) : (
                                <View style={styles.doublesContainer}>
                                    {/* Team A */}
                                    <View style={[styles.teamBlock, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                                        <Text style={[styles.teamLabel, { color: colors.accent }]}>Team A</Text>
                                        <TextInput
                                            style={[styles.input, styles.mb2, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border, color: colors.textPrimary }]}
                                            placeholder="Player 1"
                                            value={t1p1Name}
                                            onChangeText={setT1P1Name}
                                            placeholderTextColor={colors.textTertiary}
                                        />
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border, color: colors.textPrimary }]}
                                            placeholder="Player 2"
                                            value={t1p2Name}
                                            onChangeText={setT1P2Name}
                                            placeholderTextColor={colors.textTertiary}
                                        />
                                    </View>

                                    <View style={styles.vsBadgeDoubles}>
                                        <Text style={[styles.vsText, { color: colors.textSecondary, backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>VS</Text>
                                    </View>

                                    {/* Team B */}
                                    <View style={[styles.teamBlock, { backgroundColor: colors.backgroundSecondary, borderColor: colors.border }]}>
                                        <Text style={[styles.teamLabel, { color: colors.accent }]}>Team B</Text>
                                        <TextInput
                                            style={[styles.input, styles.mb2, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border, color: colors.textPrimary }]}
                                            placeholder="Player 3"
                                            value={t2p1Name}
                                            onChangeText={setT2P1Name}
                                            placeholderTextColor={colors.textTertiary}
                                        />
                                        <TextInput
                                            style={[styles.input, { backgroundColor: colors.backgroundPrimary, borderColor: colors.border, color: colors.textPrimary }]}
                                            placeholder="Player 4"
                                            value={t2p2Name}
                                            onChangeText={setT2P2Name}
                                            placeholderTextColor={colors.textTertiary}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Game Type */}
                        <View style={styles.section}>
                            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Game To</Text>
                            <View style={styles.gameTypeRow}>
                                {[11, 15, 21].map((points) => (
                                    <TouchableOpacity
                                        key={points}
                                        onPress={() => {
                                            selectionHaptic();
                                            setScoringRule(points);
                                        }}
                                        style={[
                                            styles.gameTypeOption,
                                            { backgroundColor: colors.backgroundSecondary, borderColor: colors.border },
                                            scoringRule === points && { backgroundColor: colors.accent + '20', borderColor: colors.accent }
                                        ]}
                                        activeOpacity={0.8}
                                    >
                                        <Text style={[
                                            styles.gameTypeOptionText,
                                            { color: colors.textSecondary },
                                            scoringRule === points && { color: colors.accent }
                                        ]}>{points}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={handleStartMatch}
                            style={[styles.startButton, { backgroundColor: colors.accent, shadowColor: colors.accent }]}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.startButtonText, { color: colors.backgroundPrimary }]}>Start Match</Text>
                            <ArrowRight size={20} color={colors.backgroundPrimary} weight="bold" />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>

            <ActiveMatchAlert
                visible={showActiveMatchAlert}
                onClose={() => setShowActiveMatchAlert(false)}
                onProceed={handleProceedAfterEnding}
                activeMatch={activeMatch}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
        padding: 20,
    },
    header: {
        marginBottom: 24,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(30, 41, 59, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#334155',
    },
    headerTitle: {
        ...Typography.h1,
        marginBottom: 4,
    },
    headerSubtitle: {
        ...Typography.body,
    },
    card: {
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        marginBottom: 40,
    },
    section: {
        marginBottom: 28,
    },
    sectionLabel: {
        ...Typography.label,
        marginBottom: 12,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    segmentContainer: {
        flexDirection: 'row',
        borderRadius: 12,
        padding: 4,
        borderWidth: 1,
    },
    segmentButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 10,
        gap: 8,
    },
    segmentButtonActive: {
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    segmentText: {
        ...Typography.buttonSmall,
    },
    segmentTextActive: {
        fontWeight: '700',
    },
    inputsContainer: {
        gap: 12,
    },
    doublesContainer: {
        gap: 16,
    },
    teamBlock: {
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
    },
    teamLabel: {
        ...Typography.label,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flex: 1,
    },
    inputLabel: {
        ...Typography.label,
        marginBottom: 6,
        marginLeft: 4,
    },
    input: {
        ...Typography.body,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    mb2: {
        marginBottom: 8,
    },
    vsBadge: {
        alignItems: 'center',
        marginVertical: 4,
    },
    vsBadgeDoubles: {
        alignItems: 'center',
        marginTop: -8,
        marginBottom: -8,
        zIndex: 10,
    },
    vsText: {
        ...Typography.label,
        fontWeight: '900',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        overflow: 'hidden',
        borderWidth: 1,
    },
    gameTypeRow: {
        flexDirection: 'row',
        gap: 12,
    },
    gameTypeOption: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    gameTypeOptionSelected: {
        backgroundColor: 'rgba(34, 211, 238, 0.1)',
        borderColor: '#22d3ee',
    },
    gameTypeOptionText: {
        ...Typography.h4,
    },
    gameTypeOptionTextSelected: {
        color: '#22d3ee',
    },
    startButton: {
        paddingVertical: 18,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 6,
    },
    startButtonText: {
        ...Typography.button,
        fontSize: 18,
    },
});
