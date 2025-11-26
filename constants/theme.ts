/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Extended theme colors
    backgroundPrimary: '#ffffff',
    backgroundSecondary: '#f9fafb',
    backgroundTertiary: '#f3f4f6',
    card: '#ffffff',
    border: '#e5e7eb',
    borderLight: '#f3f4f6',
    textPrimary: '#000000',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    accent: '#14b8a6',
    accentLight: '#ccfbf1',
    accentDark: '#0d9488',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    errorLight: '#fee2e2',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Extended theme colors
    backgroundPrimary: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    card: '#1e293b',
    border: '#334155',
    borderLight: '#475569',
    textPrimary: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    accent: '#22d3ee',
    accentLight: '#06b6d4',
    accentDark: '#0891b2',
    success: '#10b981',
    warning: '#fbbf24',
    error: '#ef4444',
    errorLight: '#7f1d1d',
  },
};

export function getThemedColors(theme: 'light' | 'dark') {
  return Colors[theme];
}

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

/**
 * Typography scale for the app using Outfit (friendly/rounded) and JetBrains Mono (numbers/stats)
 * Outfit provides a modern, approachable aesthetic perfect for futuristic UIs
 * JetBrains Mono ensures numbers and scores are highly readable
 */
export const Typography = {
  // Display & Hero text
  hero: {
    fontSize: 48,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: -1,
    lineHeight: 56,
  },

  // Headings
  h1: {
    fontSize: 32,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: -0.5,
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: -0.25,
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },
  h4: {
    fontSize: 18,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },

  // Body text
  body: {
    fontSize: 16,
    fontFamily: 'Outfit-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: 'Outfit-SemiBold',
    fontWeight: '600' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontFamily: 'Outfit-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 28,
  },

  // Small text
  caption: {
    fontSize: 14,
    fontFamily: 'Outfit-Medium',
    fontWeight: '500' as const,
    letterSpacing: 0,
    lineHeight: 20,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Outfit-SemiBold',
    fontWeight: '600' as const,
    letterSpacing: 0.5,
    lineHeight: 16,
  },

  // Monospace for numbers and scores
  mono: {
    fontSize: 16,
    fontFamily: 'JetBrainsMono-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0,
    lineHeight: 24,
  },
  score: {
    fontSize: 64,
    fontFamily: 'JetBrainsMono-Bold',
    fontWeight: '700' as const,
    letterSpacing: -2,
    lineHeight: 72,
  },
  scoreLarge: {
    fontSize: 96,
    fontFamily: 'JetBrainsMono-Bold',
    fontWeight: '700' as const,
    letterSpacing: -3,
    lineHeight: 104,
  },

  // Button text
  button: {
    fontSize: 16,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 24,
  },
  buttonSmall: {
    fontSize: 14,
    fontFamily: 'Outfit-Bold',
    fontWeight: '700' as const,
    letterSpacing: 0.5,
    lineHeight: 20,
  },
};
