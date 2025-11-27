import { getThemedColors, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { Sparkle, TennisBall, UserCircle } from 'phosphor-react-native';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { continueAsGuest } = useAuth();

    const handleGuest = async () => {
        await continueAsGuest();
        router.replace('/(tabs)');
    };

    const handleSignIn = () => {
        router.push('/auth/sign-in');
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Header */}
                <Animated.View entering={FadeInUp.delay(100)} style={styles.header}>
                    <TennisBall size={64} color={colors.accent} weight="duotone" />
                    <Text style={[styles.title, { color: colors.accent }]}>PicklePulse</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        Your pickleball scoring companion
                    </Text>
                </Animated.View>

                {/* Options */}
                <View style={styles.options}>
                    {/* Guest Mode */}
                    <Animated.View entering={FadeInDown.delay(200)}>
                        <TouchableOpacity
                            style={[styles.optionCard, styles.guestCard]}
                            onPress={handleGuest}
                            activeOpacity={0.8}
                        >
                            <View style={styles.optionIcon}>
                                <Sparkle size={32} color="#fff" weight="duotone" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={styles.optionTitle}>Play as Guest</Text>
                                <Text style={styles.optionDescription}>
                                    Start immediately, no account needed
                                </Text>
                                <View style={styles.features}>
                                    <Text style={styles.featureText}>✓ Instant access</Text>
                                    <Text style={styles.featureText}>✓ Works offline</Text>
                                    <Text style={styles.featureText}>⚠ Data stored locally</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Authenticated Mode */}
                    <Animated.View entering={FadeInDown.delay(300)}>
                        <TouchableOpacity
                            style={[styles.optionCard, styles.authCard, { borderColor: colors.accent }]}
                            onPress={handleSignIn}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.optionIcon, { backgroundColor: colors.accent }]}>
                                <UserCircle size={32} color="#fff" weight="duotone" />
                            </View>
                            <View style={styles.optionContent}>
                                <Text style={[styles.optionTitle, { color: colors.textPrimary }]}>
                                    Sign In / Sign Up
                                </Text>
                                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                                    Save your matches forever
                                </Text>
                                <View style={styles.features}>
                                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                                        ✓ Cloud sync
                                    </Text>
                                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                                        ✓ Access anywhere
                                    </Text>
                                    <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                                        ✓ Never lose data
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>

                {/* Footer */}
                <Animated.View entering={FadeInUp.delay(400)}>
                    <Text style={[styles.footer, { color: colors.textTertiary }]}>
                        You can upgrade from guest to account anytime
                    </Text>
                </Animated.View>
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
    },
    content: {
        flexGrow: 1,
        padding: 24,
        justifyContent: 'space-between',
    },
    header: {
        alignItems: 'center',
        paddingTop: 40,
    },
    title: {
        ...Typography.hero,
        marginTop: 16,
        marginBottom: 8,
    },
    subtitle: {
        ...Typography.body,
        textAlign: 'center',
    },
    options: {
        gap: 20,
    },
    optionCard: {
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    guestCard: {
        backgroundColor: '#fb923c', // Orange
    },
    authCard: {
        backgroundColor: '#fff',
        borderWidth: 2,
    },
    optionIcon: {
        width: 56,
        height: 56,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    optionContent: {
        gap: 8,
    },
    optionTitle: {
        ...Typography.h2,
        color: '#fff',
    },
    optionDescription: {
        ...Typography.body,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 8,
    },
    features: {
        gap: 4,
    },
    featureText: {
        ...Typography.caption,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    footer: {
        ...Typography.caption,
        textAlign: 'center',
        paddingBottom: 20,
    },
});
