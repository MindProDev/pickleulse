import SelectionModal from '@/components/SelectionModal';
import UpgradePrompt from '@/components/UpgradePrompt';
import { getThemedColors, Typography } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { CaretRight, SignOut, User } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Settings {
    defaultMatchType: 'singles' | 'doubles';
    defaultScoringRule: number;
    hapticsEnabled: boolean;
    soundEnabled: boolean;
}

const DEFAULT_SETTINGS: Settings = {
    defaultMatchType: 'singles',
    defaultScoringRule: 11,
    hapticsEnabled: true,
    soundEnabled: false,
};

type ModalType = 'theme' | 'matchType' | 'scoringRule' | null;

/**
 * Profile screen (formerly Settings)
 */
export default function ProfileScreen() {
    const { themeMode, actualTheme, setThemeMode } = useTheme();
    const colors = getThemedColors(actualTheme);
    const { signOut, user, isGuest } = useAuth();
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [activeModal, setActiveModal] = useState<ModalType>(null);

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const saved = await AsyncStorage.getItem('app_settings');
            if (saved) {
                setSettings(JSON.parse(saved));
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveSettings = async (newSettings: Settings) => {
        try {
            await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings));
            setSettings(newSettings);
        } catch (error) {
            console.error('Error saving settings:', error);
        }
    };

    const handleSignOut = async () => {
        await signOut();
        router.replace('/welcome');
    };

    const SettingRow = ({
        label,
        value,
        onPress
    }: {
        label: string;
        value: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.settingRow, { borderBottomColor: colors.border }]}
        >
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
            <View style={styles.settingValueContainer}>
                <Text style={[styles.settingValue, { color: colors.textSecondary }]}>{value}</Text>
                <CaretRight size={20} color={colors.textTertiary} />
            </View>
        </TouchableOpacity>
    );

    const ToggleRow = ({
        label,
        value,
        onValueChange
    }: {
        label: string;
        value: boolean;
        onValueChange: (value: boolean) => void;
    }) => (
        <View style={[styles.toggleRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>{label}</Text>
            <Switch
                value={value}
                onValueChange={onValueChange}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={value ? colors.backgroundPrimary : colors.backgroundSecondary}
            />
        </View>
    );

    if (loading) {
        return (
            <SafeAreaView style={[styles.loadingContainer, { backgroundColor: colors.backgroundPrimary }]}>
                <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.backgroundPrimary }]}>
            <ScrollView style={styles.scrollView}>
                {/* Header */}
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
                </View>

                {/* User Info */}
                <View style={styles.section}>
                    <View style={[styles.userCard, { backgroundColor: colors.backgroundSecondary }]}>
                        <View style={[styles.avatarCircle, { backgroundColor: colors.accent }]}>
                            <User size={32} color="#fff" weight="bold" />
                        </View>
                        <View style={styles.userInfo}>
                            {isGuest ? (
                                <>
                                    <Text style={[styles.userName, { color: colors.textPrimary }]}>
                                        Guest User
                                    </Text>
                                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                                        Playing without an account
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text style={[styles.userName, { color: colors.textPrimary }]}>
                                        {user?.email?.split('@')[0] || 'User'}
                                    </Text>
                                    <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
                                        {user?.email}
                                    </Text>
                                </>
                            )}
                        </View>
                    </View>

                    {isGuest && <UpgradePrompt />}

                    {!isGuest && (
                        <TouchableOpacity
                            style={[styles.signOutButton, { borderColor: colors.border }]}
                            onPress={handleSignOut}
                        >
                            <SignOut size={20} color="#ef4444" weight="bold" />
                            <Text style={styles.signOutText}>Sign Out</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        APPEARANCE
                    </Text>

                    <SettingRow
                        label="Theme"
                        value={themeMode === 'system' ? 'System' : themeMode === 'light' ? 'Light' : 'Dark'}
                        onPress={() => setActiveModal('theme')}
                    />
                </View>

                {/* Match Defaults */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        MATCH DEFAULTS
                    </Text>

                    <SettingRow
                        label="Default Match Type"
                        value={settings.defaultMatchType === 'singles' ? 'Singles' : 'Doubles'}
                        onPress={() => setActiveModal('matchType')}
                    />

                    <SettingRow
                        label="Default Scoring Rule"
                        value={`Play to ${settings.defaultScoringRule}`}
                        onPress={() => setActiveModal('scoringRule')}
                    />
                </View>

                {/* Preferences */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        PREFERENCES
                    </Text>

                    <ToggleRow
                        label="Haptic Feedback"
                        value={settings.hapticsEnabled}
                        onValueChange={(value) => saveSettings({ ...settings, hapticsEnabled: value })}
                    />

                    <ToggleRow
                        label="Sound Effects"
                        value={settings.soundEnabled}
                        onValueChange={(value) => saveSettings({ ...settings, soundEnabled: value })}
                    />
                </View>

                {/* About */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        ABOUT
                    </Text>

                    <View style={styles.aboutRow}>
                        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>Version</Text>
                        <Text style={[styles.aboutValue, { color: colors.textSecondary }]}>1.0.0</Text>
                    </View>

                    <View style={styles.aboutRowLast}>
                        <Text style={[styles.settingLabel, { color: colors.textPrimary }]}>PicklePulse</Text>
                        <Text style={[styles.aboutValue, { color: colors.textSecondary }]}>
                            Your pickleball scoring companion
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Theme Modal */}
            <SelectionModal
                visible={activeModal === 'theme'}
                title="Choose Theme"
                options={[
                    { label: 'Light', value: 'light', onSelect: () => setThemeMode('light') },
                    { label: 'Dark', value: 'dark', onSelect: () => setThemeMode('dark') },
                    { label: 'System', value: 'system', onSelect: () => setThemeMode('system') },
                ]}
                onClose={() => setActiveModal(null)}
            />

            {/* Match Type Modal */}
            <SelectionModal
                visible={activeModal === 'matchType'}
                title="Default Match Type"
                options={[
                    { label: 'Singles', value: 'singles', onSelect: () => saveSettings({ ...settings, defaultMatchType: 'singles' }) },
                    { label: 'Doubles', value: 'doubles', onSelect: () => saveSettings({ ...settings, defaultMatchType: 'doubles' }) },
                ]}
                onClose={() => setActiveModal(null)}
            />

            {/* Scoring Rule Modal */}
            <SelectionModal
                visible={activeModal === 'scoringRule'}
                title="Default Scoring Rule"
                options={[
                    { label: 'Play to 11', value: '11', onSelect: () => saveSettings({ ...settings, defaultScoringRule: 11 }) },
                    { label: 'Play to 15', value: '15', onSelect: () => saveSettings({ ...settings, defaultScoringRule: 15 }) },
                    { label: 'Play to 21', value: '21', onSelect: () => saveSettings({ ...settings, defaultScoringRule: 21 }) },
                ]}
                onClose={() => setActiveModal(null)}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        ...Typography.body,
    },
    scrollView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    title: {
        ...Typography.h2,
    },
    section: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    sectionTitle: {
        ...Typography.label,
        letterSpacing: 1,
        marginBottom: 12,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
    },
    avatarCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        ...Typography.h3,
        marginBottom: 4,
    },
    userEmail: {
        ...Typography.caption,
    },
    signOutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 12,
    },
    signOutText: {
        ...Typography.button,
        color: '#ef4444',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    toggleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    settingLabel: {
        ...Typography.body,
    },
    settingValueContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    settingValue: {
        ...Typography.body,
    },
    aboutRow: {
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    aboutRowLast: {
        paddingVertical: 16,
    },
    aboutValue: {
        ...Typography.caption,
        marginTop: 4,
    },
});
