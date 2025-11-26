import ActiveMatchBar from '@/components/ActiveMatchBar';
import { MatchProvider } from '@/context/MatchContext';
import { SubscriptionProvider } from '@/context/SubscriptionContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded, fontError] = useFonts({
    // Outfit variable font supports weights 100-900
    'Outfit-Regular': require('../assets/fonts/Outfit-Variable.ttf'),
    'Outfit-Medium': require('../assets/fonts/Outfit-Variable.ttf'),
    'Outfit-SemiBold': require('../assets/fonts/Outfit-Variable.ttf'),
    'Outfit-Bold': require('../assets/fonts/Outfit-Variable.ttf'),
    // JetBrains Mono variable font supports weights 100-800
    'JetBrainsMono-Bold': require('../assets/fonts/JetBrainsMono-Variable.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Hide splash screen once fonts are loaded
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render app until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <SubscriptionProvider>
          <MatchProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                gestureEnabled: true,
                gestureDirection: 'horizontal',
              }}
            >
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="match-setup"
                options={{
                  presentation: 'modal',
                  animation: 'slide_from_bottom',
                }}
              />
              <Stack.Screen
                name="live-match"
                options={{
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                }}
              />
              <Stack.Screen name="match-summary" options={{ presentation: 'modal' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            </Stack>
            <ActiveMatchBar />
            <StatusBar style="auto" />
          </MatchProvider>
        </SubscriptionProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
