
import GoogleSignInButton from '@/components/GoogleSignInButton';
import { getThemedColors, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';
import { CaretLeft, Envelope, Lock } from 'phosphor-react-native';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignUpScreen() {
    const { actualTheme } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { signUp } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignUp = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await signUp(email, password);
        setLoading(false);

        if (result.success) {
            router.replace('/(tabs)');
        } else {
            Alert.alert('Sign Up Failed', result.error || 'Please try again');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <CaretLeft size={24} color={colors.textPrimary} weight="bold" />
                        </TouchableOpacity>
                        <Text style={[styles.title, { color: colors.textPrimary }]}>Sign Up</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    <View style={styles.divider}>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                        <Text style={[styles.dividerText, { color: colors.textSecondary }]}>or</Text>
                        <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                    </View>

                    <GoogleSignInButton />

                    {/* Form */}
                    <View style={styles.form}>
                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Email</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary }]}>
                                <Envelope size={20} color={colors.textTertiary} weight="duotone" />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="your@email.com"
                                    placeholderTextColor={colors.textTertiary}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Password</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary }]}>
                                <Lock size={20} color={colors.textTertiary} weight="duotone" />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="At least 6 characters"
                                    placeholderTextColor={colors.textTertiary}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View style={styles.inputGroup}>
                            <Text style={[styles.label, { color: colors.textSecondary }]}>Confirm Password</Text>
                            <View style={[styles.inputContainer, { backgroundColor: colors.backgroundSecondary }]}>
                                <Lock size={20} color={colors.textTertiary} weight="duotone" />
                                <TextInput
                                    style={[styles.input, { color: colors.textPrimary }]}
                                    placeholder="Re-enter your password"
                                    placeholderTextColor={colors.textTertiary}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    editable={!loading}
                                />
                            </View>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            style={[styles.signUpButton, loading && styles.buttonDisabled]}
                            onPress={handleSignUp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.signUpButtonText}>Create Account</Text>
                            )}
                        </TouchableOpacity>

                        {/* Sign In Link */}
                        <TouchableOpacity
                            onPress={() => router.back()}
                            disabled={loading}
                            style={styles.linkButton}
                        >
                            <Text style={[styles.linkText, { color: colors.textSecondary }]}>
                                Already have an account?{' '}
                                <Text style={[styles.linkTextBold, { color: colors.accent }]}>Sign In</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        ...Typography.h1,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        ...Typography.label,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 12,
    },
    input: {
        ...Typography.body,
        flex: 1,
    },
    signUpButton: {
        backgroundColor: '#14b8a6',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    signUpButtonText: {
        ...Typography.button,
        color: '#fff',
    },
    linkButton: {
        alignItems: 'center',
        paddingVertical: 8,
    },
    linkText: {
        ...Typography.body,
    },
    linkTextBold: {
        fontWeight: '700',
    },
});
