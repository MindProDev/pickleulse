import { getThemedColors, Typography } from '@/constants/theme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useTheme } from '@/context/ThemeContext';
import { useActiveMatches } from '@/hooks/useActiveMatches';
import type { Match } from '@/types/match';
import { router } from 'expo-router';
import { ArrowRight, Crown, X } from 'phosphor-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ActiveMatchAlertProps {
    visible: boolean;
    onClose: () => void;
    onProceed: () => void;
    activeMatch: Match | null;
}

/**
 * Alert shown to free users when they try to start a new match
 * while already having an active match
 */
export function ActiveMatchAlert({ visible, onClose, onProceed, activeMatch }: ActiveMatchAlertProps) {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { isPro } = useSubscription();
    const { markMatchInactive } = useActiveMatches();
    const [isEnding, setIsEnding] = useState(false);

    const handleEndAndStart = async () => {
        if (!activeMatch) return;

        setIsEnding(true);
        try {
            // Mark the active match as inactive
            const success = await markMatchInactive(activeMatch.id);
            if (success) {
                onProceed();
            } else {
                Alert.alert('Error', 'Failed to end the current match. Please try again.');
            }
        } catch (e) {
            console.error('Error ending match:', e);
            Alert.alert('Error', 'An unexpected error occurred.');
        } finally {
            setIsEnding(false);
        }
    };

    const handleGoToMatch = () => {
        onClose();
        router.push('/live-match');
    };

    const handleUpgrade = () => {
        onClose();
        // Navigate to settings where paywall can be accessed
        router.push('/(tabs)/settings');
    };

    if (isPro) return null;

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>Active Match in Progress</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color={colors.textSecondary} weight="bold" />
                        </TouchableOpacity>
                    </View>

                    {/* Message */}
                    <Text style={[styles.message, { color: colors.textSecondary }]}>
                        You already have an active match. Free tier users can only play one match at a time.
                    </Text>

                    {activeMatch && (
                        <View style={[styles.matchInfo, { backgroundColor: colors.backgroundSecondary }]}>
                            <Text style={[styles.matchInfoText, { color: colors.textPrimary }]}>
                                {activeMatch.team_a_name || 'Team A'} vs {activeMatch.team_b_name || 'Team B'}
                            </Text>
                            <Text style={[styles.matchScore, { color: colors.accent }]}>
                                {activeMatch.score_p1} - {activeMatch.score_p2}
                            </Text>
                        </View>
                    )}

                    {/* Options */}
                    <View style={styles.options}>
                        {/* Go to Active Match */}
                        <TouchableOpacity
                            onPress={handleGoToMatch}
                            style={[styles.optionButton, { backgroundColor: colors.accent }]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.optionButtonText}>Continue Active Match</Text>
                            <ArrowRight size={20} color="#fff" weight="bold" />
                        </TouchableOpacity>

                        {/* End and Start New */}
                        <TouchableOpacity
                            onPress={handleEndAndStart}
                            style={[styles.optionButton, styles.secondaryButton, { borderColor: colors.textTertiary }]}
                            activeOpacity={0.8}
                            disabled={isEnding}
                        >
                            {isEnding ? (
                                <ActivityIndicator color={colors.textPrimary} />
                            ) : (
                                <>
                                    <Text style={[styles.secondaryButtonText, { color: colors.textPrimary }]}>
                                        End Current & Start New
                                    </Text>
                                </>
                            )}
                        </TouchableOpacity>

                        {/* Upgrade to Pro */}
                        <TouchableOpacity
                            onPress={handleUpgrade}
                            style={[styles.upgradeButton, { backgroundColor: colors.accentLight }]}
                            activeOpacity={0.8}
                        >
                            <Crown size={20} color={colors.accentDark} weight="fill" />
                            <Text style={[styles.upgradeButtonText, { color: colors.accentDark }]}>
                                Upgrade to Pro for Unlimited Matches
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    container: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        ...Typography.h3,
        flex: 1,
    },
    closeButton: {
        padding: 4,
    },
    message: {
        ...Typography.body,
        marginBottom: 16,
        lineHeight: 22,
    },
    matchInfo: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    matchInfoText: {
        ...Typography.body,
        marginBottom: 8,
    },
    matchScore: {
        ...Typography.h2,
        fontFamily: 'JetBrainsMono-Bold',
    },
    options: {
        gap: 12,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
    },
    optionButtonText: {
        ...Typography.h4,
        color: '#fff',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
    },
    secondaryButtonText: {
        ...Typography.h4,
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 12,
        borderRadius: 12,
        gap: 8,
    },
    upgradeButtonText: {
        ...Typography.caption,
        fontWeight: '600',
    },
});
