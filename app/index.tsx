import { useAuth } from '@/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';

const HAS_SEEN_WELCOME_KEY = 'picklepulse_has_seen_welcome';

export default function Index() {
    const { mode } = useAuth();
    const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean | null>(null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        checkWelcomeStatus();
    }, []);

    async function checkWelcomeStatus() {
        try {
            // Check if we're in a browser environment
            if (Platform.OS === 'web' && typeof window === 'undefined') {
                // Server-side rendering - default to false
                setHasSeenWelcome(false);
                setIsChecking(false);
                return;
            }

            const value = Platform.OS === 'web'
                ? localStorage.getItem(HAS_SEEN_WELCOME_KEY)
                : await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
            setHasSeenWelcome(value === 'true');
        } catch (error) {
            setHasSeenWelcome(false);
        } finally {
            setIsChecking(false);
        }
    }

    // Show loading only while checking welcome status
    if (isChecking) {
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

    // Fallback - show welcome (for users who have seen welcome but haven't chosen a mode yet)
    return <Redirect href="/welcome" />;
}
