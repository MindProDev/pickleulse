import { Alert, Platform } from 'react-native';

/**
 * Cross-platform alert that works on web and native
 */
export function showAlert(
    title: string,
    message?: string,
    buttons?: Array<{
        text: string;
        onPress?: () => void;
        style?: 'default' | 'cancel' | 'destructive';
    }>
) {
    if (Platform.OS === 'web') {
        // For web, handle multiple options
        if (buttons && buttons.length > 2) {
            // Create a numbered list of options
            const options = buttons
                .filter(b => b.style !== 'cancel')
                .map((b, i) => `${i + 1}. ${b.text}`)
                .join('\n');

            const promptMessage = `${message || ''}\n\n${options}\n\nEnter number (or press Cancel):`;
            const result = window.prompt(title + '\n\n' + promptMessage);

            if (result) {
                const index = parseInt(result) - 1;
                const nonCancelButtons = buttons.filter(b => b.style !== 'cancel');
                if (index >= 0 && index < nonCancelButtons.length) {
                    nonCancelButtons[index]?.onPress?.();
                }
            } else {
                // User cancelled
                const cancelButton = buttons.find(b => b.style === 'cancel');
                cancelButton?.onPress?.();
            }
        } else if (buttons && buttons.length > 1) {
            const result = window.confirm(`${title}\n\n${message || ''}`);
            if (result) {
                // Find the non-cancel button
                const confirmButton = buttons.find(b => b.style !== 'cancel');
                confirmButton?.onPress?.();
            } else {
                // Find the cancel button
                const cancelButton = buttons.find(b => b.style === 'cancel');
                cancelButton?.onPress?.();
            }
        } else {
            window.alert(`${title}\n\n${message || ''}`);
            buttons?.[0]?.onPress?.();
        }
    } else {
        // Use native Alert on mobile
        Alert.alert(
            title,
            message,
            buttons?.map(b => ({
                text: b.text,
                onPress: b.onPress,
                style: b.style,
            }))
        );
    }
}
