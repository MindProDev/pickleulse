import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
    themeMode: ThemeMode;
    actualTheme: 'light' | 'dark';
    setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'app_theme_mode';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useSystemColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('system');

    // Load saved theme preference on mount
    useEffect(() => {
        loadThemePreference();
    }, []);

    const loadThemePreference = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
                setThemeModeState(saved as ThemeMode);
            }
        } catch (error) {
            console.error('Error loading theme preference:', error);
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            setThemeModeState(mode);
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    };

    // Determine the actual theme to use
    const actualTheme: 'light' | 'dark' =
        themeMode === 'system'
            ? systemColorScheme === 'dark'
                ? 'dark'
                : 'light'
            : themeMode;

    return (
        <ThemeContext.Provider value={{ themeMode, actualTheme, setThemeMode }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
