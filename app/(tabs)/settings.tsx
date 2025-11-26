import { getThemedColors, Typography } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { showAlert } from '@/utils/alert';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CaretRight } from 'phosphor-react-native';
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

/**
 * Settings screen
 * Based on Section 8 of user guide
 */
export default function SettingsScreen() {
    const { themeMode, actualTheme, setThemeMode } = useTheme();
    const colors = getThemedColors(actualTheme);
    const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

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
            showAlert('Error', 'Failed to save settings');
        }
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
                    <Text style={[styles.title, { color: colors.textPrimary }]}>Settings</Text>
                </View>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
                        APPEARANCE
                    </Text>

                    <SettingRow
                        label="Theme"
                        value={themeMode === 'system' ? 'System' : themeMode === 'light' ? 'Light' : 'Dark'}
                        onPress={() => {
                            showAlert(
                                'Theme',
                                'Choose your preferred theme',
                                [
                                    {
                                        text: 'Light',
                                        onPress: () => setThemeMode('light'),
                                    },
                                    {
                                        text: 'Dark',
                                        onPress: () => setThemeMode('dark'),
                                    },
                                    {
                                        text: 'System',
                                        onPress: () => setThemeMode('system'),
                                    },
                                    { text: 'Cancel', style: 'cancel' },
                                ]
                            );
                        }}
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
                        onPress={() => {
                            showAlert(
                                'Default Match Type',
                                'Choose your preferred match type',
                                [
                                    {
                                        text: 'Singles',
                                        onPress: () => saveSettings({ ...settings, defaultMatchType: 'singles' }),
                                    },
                                    {
                                        text: 'Doubles',
                                        onPress: () => saveSettings({ ...settings, defaultMatchType: 'doubles' }),
                                    },
                                    { text: 'Cancel', style: 'cancel' },
                                ]
                            );
                        }}
                    />

                    <SettingRow
                        label="Default Scoring Rule"
                        value={`Play to ${settings.defaultScoringRule}`}
                        onPress={() => {
                            showAlert(
                                'Default Scoring Rule',
                                'Choose your preferred scoring rule',
                                [
                                    {
                                        text: 'Play to 11',
                                        onPress: () => saveSettings({ ...settings, defaultScoringRule: 11 }),
                                    },
                                    {
                                        text: 'Play to 15',
                                        onPress: () => saveSettings({ ...settings, defaultScoringRule: 15 }),
                                    },
                                    {
                                        text: 'Play to 21',
                                        onPress: () => saveSettings({ ...settings, defaultScoringRule: 21 }),
                                    },
                                    { text: 'Cancel', style: 'cancel' },
                                ]
                            );
                        }}
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
                        <Text style={styles.settingLabel}>Version</Text>
                        <Text style={styles.aboutValue}>1.0.0</Text>
                    </View>

                    <View style={styles.aboutRowLast}>
                        <Text style={styles.settingLabel}>PicklePulse</Text>
                        <Text style={styles.aboutValue}>
                            Your pickleball scoring companion
                        </Text>
                    </View>
                </View>
            </ScrollView>
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
    settingChevron: {
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
