import { Typography } from '@/constants/theme';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ScoreButtonProps {
    score: number;
    teamName?: string;
    color: 'blue' | 'red' | 'green' | 'purple';
    onPress: () => void;
    disabled?: boolean;
}

/**
 * Futuristic score button with glow effects and gradients
 * Optimized for 1-meter readability with premium aesthetics
 */
export function ScoreButton({ score, teamName, color, onPress, disabled = false }: ScoreButtonProps) {
    const getColorStyles = () => {
        switch (color) {
            case 'blue':
                return {
                    background: styles.backgroundBlue,
                    shadow: styles.shadowBlue,
                };
            case 'red':
                return {
                    background: styles.backgroundRed,
                    shadow: styles.shadowRed,
                };
            case 'green':
                return {
                    background: styles.backgroundGreen,
                    shadow: styles.shadowGreen,
                };
            case 'purple':
                return {
                    background: styles.backgroundPurple,
                    shadow: styles.shadowPurple,
                };
        }
    };

    const colorStyle = getColorStyles();

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            style={[
                styles.button,
                colorStyle.background,
                colorStyle.shadow,
                disabled && styles.disabled
            ]}
            activeOpacity={0.8}
        >
            {/* Glass overlay for depth */}
            <View style={styles.glassOverlay} />

            {/* Content */}
            <View style={styles.content}>
                {/* Team name with neon glow */}
                <Text style={styles.teamName}>
                    {teamName || 'Team'}
                </Text>

                {/* Massive score - ultra readable */}
                <Text style={styles.score}>{score}</Text>

                {/* Tap instruction with pulse */}
                <View style={styles.tapInstruction}>
                    <Text style={styles.tapInstructionText}>TAP TO SCORE</Text>
                </View>
            </View>

            {/* Animated border glow */}
            <View style={[styles.border, disabled && styles.borderDisabled]} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        borderRadius: 24,
        minWidth: 180,
        minHeight: 240,
        position: 'relative',
    },
    backgroundBlue: {
        backgroundColor: '#0ea5e9',
    },
    backgroundRed: {
        backgroundColor: '#ec4899',
    },
    backgroundGreen: {
        backgroundColor: '#10b981',
    },
    backgroundPurple: {
        backgroundColor: '#8b5cf6',
    },
    shadowBlue: {
        shadowColor: '#00f0ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 10,
    },
    shadowRed: {
        shadowColor: '#ff006e',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 10,
    },
    shadowGreen: {
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 10,
    },
    shadowPurple: {
        shadowColor: '#b24bf3',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 40,
        elevation: 10,
    },
    disabled: {
        opacity: 0.4,
    },
    glassOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 24,
    },
    content: {
        position: 'relative',
        zIndex: 10,
        alignItems: 'center',
    },
    teamName: {
        ...Typography.h2,
        color: '#ffffff',
        marginBottom: 12,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        textShadowColor: 'rgba(255, 255, 255, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    score: {
        ...Typography.score,
        fontSize: 96, // Override size for massive button
        color: '#ffffff',
        marginBottom: 12,
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 4 },
        textShadowRadius: 8,
    },
    tapInstruction: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 9999,
    },
    tapInstructionText: {
        ...Typography.label,
        color: '#ffffff',
        fontWeight: '600',
        letterSpacing: 1.2,
    },
    border: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    borderDisabled: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
});
