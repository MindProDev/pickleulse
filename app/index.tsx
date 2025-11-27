import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

const HAS_SEEN_WELCOME_KEY = 'picklepulse_has_seen_welcome';

export default function Index() {
    const { mode, isLoading } = useAuth();
    const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);

    useEffect(() => {
        checkWelcomeStatus();
    }, []);

    async function checkWelcomeStatus() {
        try {
            const value = Platform.OS === 'web'
                ? localStorage.getItem(HAS_SEEN_WELCOME_KEY)
                : await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
            setHasSeenWelcome(value === 'true');
        } catch (error) {
            setHasSeenWelcome(false);
        }
    }

    // Show loading while checking auth state
    if (isLoading || hasSeenWelcome === null) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size="large" color="#14b8a6" />
            </View>
        );
    }

    // First time user - show welcome screen
    if (!hasSeenWelcome) {
        return <Redirect href="/welcome" />;
    }

    // User has chosen a mode - go to main app
    if (mode === 'guest' || mode === 'authenticated') {
        return <Redirect href="/(tabs)" />;
    }

    // Fallback - show welcome
    return <Redirect href="/welcome" />;
}
