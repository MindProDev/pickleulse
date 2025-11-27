import { getThemedColors, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { Sparkle } from 'phosphor-react-native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function UpgradePrompt() {
    const { isGuest } = useAuth();
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);

    if (!isGuest) return null;

    return (
        <View style={[styles.container, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Sparkle size={24} color="#fb923c" weight="duotone" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                        Playing as Guest
                    </Text>
                    <Text style={[styles.description, { color: colors.textSecondary }]}>
                        Upgrade to save your matches forever and access them anywhere.
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/auth/sign-up')}
            >
                <Text style={styles.buttonText}>Upgrade Now</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 16,
        padding: 16,
        borderRadius: 16,
        gap: 16,
    },
    content: {
        flexDirection: 'row',
        gap: 12,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(251, 146, 60, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    textContainer: {
        flex: 1,
        gap: 4,
    },
    title: {
        ...Typography.h3,
    },
    description: {
        ...Typography.caption,
    },
    button: {
        backgroundColor: '#fb923c',
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonText: {
        ...Typography.button,
        color: '#fff',
    },
});
