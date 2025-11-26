import { Typography } from '@/constants/theme';
import { useMatchContext } from '@/context/MatchContext';
import { usePathname, useRouter } from 'expo-router';
import { CaretRight } from 'phosphor-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ActiveMatchBar() {
    const { isMatchActive, matchState } = useMatchContext();
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    // Don't show if no match is active or if we are already on the live match screen
    if (!isMatchActive || pathname === '/live-match') {
        return null;
    }

    const handlePress = () => {
        router.push('/live-match');
    };

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutDown}
            style={[styles.container, { bottom: insets.bottom + 60 }]} // Position above tab bar
        >
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                style={styles.content}
            >
                <View style={styles.leftSection}>
                    <View style={styles.liveIndicator}>
                        <View style={styles.dot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                    <Text style={styles.matchType}>{matchState.matchType === 'singles' ? '1v1' : '2v2'}</Text>
                </View>

                <View style={styles.scoreSection}>
                    <Text style={styles.teamName}>{matchState.teamAName || 'Team A'}</Text>
                    <View style={styles.scoreBadge}>
                        <Text style={styles.score}>{matchState.scoreA}</Text>
                        <Text style={styles.divider}>-</Text>
                        <Text style={styles.score}>{matchState.scoreB}</Text>
                    </View>
                    <Text style={styles.teamName}>{matchState.teamBName || 'Team B'}</Text>
                </View>

                <CaretRight size={20} color="#94a3b8" weight="bold" />
            </TouchableOpacity>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 100,
    },
    content: {
        backgroundColor: 'rgba(15, 23, 42, 0.95)', // Dark Slate
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#334155',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ef4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
        gap: 4,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
    liveText: {
        ...Typography.label,
        color: '#fff',
    },
    matchType: {
        ...Typography.label,
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    scoreSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    teamName: {
        ...Typography.label,
        color: '#cbd5e1',
        maxWidth: 60,
    },
    scoreBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1e293b',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
        borderWidth: 1,
        borderColor: '#334155',
    },
    score: {
        fontFamily: 'JetBrainsMono-Bold',
        fontSize: 16,
        fontWeight: '700',
        color: '#22d3ee',
        fontVariant: ['tabular-nums'],
    },
    divider: {
        ...Typography.caption,
        color: '#64748b',
    },
});
