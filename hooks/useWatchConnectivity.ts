import { useEffect } from 'react';
import { Platform } from 'react-native';

// Mock implementations for Expo Go / Web
let sendWatchMessage: any = (msg: any) => { };
// Mock returns a cleanup function to match expected type () => void
let watchEvents: any = { addListener: (event: string, cb: any) => (() => { }) };
let sendWearMessage: any = (msg: any) => { };
let wearEvents: any = { addListener: (event: string, cb: any) => ({ remove: () => { } }) };

try {
    if (Platform.OS !== 'web') {
        const RNWatch = require('react-native-watch-connectivity');
        sendWatchMessage = RNWatch.sendMessage;
        watchEvents = RNWatch.watchEvents;
    }
} catch (e) {
    console.warn('Watch connectivity not available (native module missing)');
}

try {
    if (Platform.OS !== 'web') {
        const RNWear = require('react-native-wear-connectivity');
        sendWearMessage = RNWear.sendMessage;
        wearEvents = RNWear.watchEvents;
    }
} catch (e) {
    console.warn('Wear connectivity not available (native module missing)');
}

interface UseWatchConnectivityProps {
    scoreA: number;
    scoreB: number;
    server: string;
    onScoreA: () => void;
    onScoreB: () => void;
    onUndo: () => void;
}

export function useWatchConnectivity({
    scoreA,
    scoreB,
    server,
    onScoreA,
    onScoreB,
    onUndo
}: UseWatchConnectivityProps) {
    // Send state updates to Watch
    useEffect(() => {
        const message = {
            scoreA,
            scoreB,
            server
        };

        if (Platform.OS === 'ios') {
            sendWatchMessage(message);
        } else {
            sendWearMessage(message);
        }
    }, [scoreA, scoreB, server]);

    // Listen for actions from Watch
    useEffect(() => {
        let unsubscribe: () => void;

        if (Platform.OS === 'ios') {
            const sub = watchEvents.addListener('message', (message: any) => {
                handleMessage(message);
            });
            // Handle both function and object return types from addListener
            unsubscribe = typeof sub === 'function' ? sub : () => sub.remove();
        } else {
            // For WearOS, we might use DeviceEventEmitter or the library's event listener
            // Assuming standard API for now
            const subscription = wearEvents.addListener('message', (message: any) => {
                handleMessage(message);
            });
            unsubscribe = () => subscription.remove();
        }

        const handleMessage = (message: any) => {
            if (message.action === 'SCORE_A') {
                onScoreA();
            } else if (message.action === 'SCORE_B') {
                onScoreB();
            } else if (message.action === 'UNDO') {
                onUndo();
            }
        };

        return () => {
            if (unsubscribe) unsubscribe();
        };
    }, [onScoreA, onScoreB, onUndo]);
}
