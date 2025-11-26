import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Hook for providing haptic feedback patterns
 * Based on industry best practices from the user guide (Section 3.3)
 */
export function useHaptics() {
    const isHapticsAvailable = Platform.OS !== 'web';

    /**
     * Light short pulse for single score
     */
    const scoreHaptic = () => {
        if (!isHapticsAvailable) return;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    /**
     * Two pulses for server switch
     */
    const serverSwitchHaptic = async () => {
        if (!isHapticsAvailable) return;
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setTimeout(() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }, 100);
    };

    /**
     * Long pulse for undo action
     */
    const undoHaptic = () => {
        if (!isHapticsAvailable) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    };

    /**
     * Success pattern for match save
     */
    const successHaptic = () => {
        if (!isHapticsAvailable) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    /**
     * Error pattern for failed actions
     */
    const errorHaptic = () => {
        if (!isHapticsAvailable) return;
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    };

    /**
     * Selection haptic for button presses
     */
    const selectionHaptic = () => {
        if (!isHapticsAvailable) return;
        Haptics.selectionAsync();
    };

    return {
        scoreHaptic,
        serverSwitchHaptic,
        undoHaptic,
        successHaptic,
        errorHaptic,
        selectionHaptic,
        isAvailable: isHapticsAvailable,
    };
}
